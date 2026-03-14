const MindfulnessPlan = require('../models/MindfulnessPlan');
const { OpenAI } = require('openai');
const MoodLog = require('../models/MoodLog');

const hasOpenAIKey = !!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_ope');
const openai = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

async function generatePlan(req, res) {
    try {
        const userId = req.user._id;
        // Gather short mood history
        const history = await MoodLog.find({ user: userId }).sort({ timestamp: -1 }).limit(30);
        const moodSummary = history.map(h => `${h.timestamp.toISOString().split('T')[0]}:${h.emotion}:${h.calmnessScore || 0}:${h.stressScore || 0}`).join('\n');

        const prompt = `Create a one-week personalized mindfulness plan for a user based on this mood history:\n${moodSummary}\nPlan should include daily breathing minutes, meditation suggestion, gratitude prompt, music suggestion, and sleep tip.`;

        let planText = 'Suggested plan: 5-10 minutes daily breathing, 10-15 minute meditation on alternate days, nightly gratitude journaling prompt: "Today I am grateful for...", calming music suggestion: soft instrumental, sleep tip: keep a consistent bedtime.';
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

        const planDoc = await MindfulnessPlan.create({ user: userId, weekStart: new Date(), days: {}, notes: planText, summary: planText.slice(0, 300) });

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
