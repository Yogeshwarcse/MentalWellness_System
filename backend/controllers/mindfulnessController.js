const MindfulnessPlan = require('../models/MindfulnessPlan');
const { OpenAI } = require('openai');
const MoodLog = require('../models/MoodLog');

const hasOpenAIKey = !!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_ope');
const openai = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function buildFallbackPlan(currentEmotion, currentStress) {
    const stress = currentStress || 0;
    const emotion = (currentEmotion || 'neutral').toLowerCase();

    if (stress >= 75) {
        return 'Plan for now (high stress): Take 2–3 minutes of box breathing (inhale 4, hold 4, exhale 4, hold 4), then do a quick grounding scan (notice 5 things you see, 4 you feel, 3 you hear). Later tonight, dim your screens 30 minutes before bed and take 5 slow breaths lying down.';
    }

    if (emotion === 'sad') {
        return 'Plan for now (feeling low): Spend 3 minutes on slow breathing (inhale 4, exhale 6), then write down one kind sentence to yourself and one small thing you are grateful for. Tonight, choose one gentle activity before bed, like soft music or a warm drink.';
    }

    if (emotion === 'angry') {
        return 'Plan for now (frustrated): Do 1–2 minutes of physical release (shake out hands, roll shoulders), followed by 2 minutes of calm breathing (inhale 4, exhale 4). Before sleep, take 5 breaths while telling yourself “I can pause and respond later.”';
    }

    if (emotion === 'happy') {
        return 'Plan for now (feeling good): Take 2 minutes to savor what is going well (name 3 good things and why they matter), then do 2–3 minutes of relaxed breathing. Tonight, keep the momentum with a simple wind-down like stretching or writing one thing you appreciated about today.';
    }

    return 'Plan for now: Take 3–5 minutes of calm breathing, do a short grounding practice (feel your feet on the floor, relax your jaw and shoulders), and note one thing you are grateful for. Before bed, reduce screen brightness and end the day with 5 slow breaths.';
}

async function generatePlan(req, res) {
    try {
        const userId = req.user._id;
        // Gather short mood history
        const history = await MoodLog.find({ user: userId }).sort({ timestamp: -1 }).limit(30);
        const moodSummary = history.map(h => `${h.timestamp.toISOString().split('T')[0]}:${h.emotion}:${h.calmnessScore || 0}:${h.stressScore || 0}`).join('\n');

        const latest = history[0];
        const currentEmotion = latest ? latest.emotion : 'neutral';
        const currentStress = latest ? (latest.stressScore || 0) : 0;

        const prompt = `Create a short, "plan for now" mindfulness routine for this user based on their recent mood history:\n${moodSummary}\n
Focus especially on their current state: emotion=${currentEmotion}, stressScore=${currentStress} (0-100).\n
The plan should focus on the next few hours and the rest of today, not a full week. Include:
- 1–2 brief breathing exercises (with minutes)
- 1 simple grounding or body-based practice
- 1 gentle reflection or gratitude prompt
- 1 small sleep or wind-down tip for tonight.
Keep it practical, compassionate, and concise.`;

        let planText = buildFallbackPlan(currentEmotion, currentStress);
        if (hasOpenAIKey && openai) {
            try {
                const completion = await openai.chat.completions.create({
                    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful wellness planner.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 500
                });
                planText = completion.choices[0].message.content;
            } catch (err) {
                console.warn('OpenAI plan generation failed, using fallback plan:', err.message);
            }
        }

        const planDoc = await MindfulnessPlan.create({
            user: userId,
            weekStart: new Date(),
            days: {},
            notes: planText,
            summary: planText.slice(0, 300)
        });

        res.json({ plan: planText, planId: planDoc._id });
    } catch (err) {
        console.error('Generate plan error:', err.message);
        res.status(500).json({ message: 'Error generating plan' });
    }
}

async function getPlans(req, res) {
    try {
        const userId = req.user._id;
        const plans = await MindfulnessPlan.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching plans' });
    }
}

module.exports = { generatePlan, getPlans };
