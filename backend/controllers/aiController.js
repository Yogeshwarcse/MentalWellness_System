const { OpenAI } = require('openai');
const ConversationMemory = require('../models/ConversationMemory');
const MoodLog = require('../models/MoodLog');

const hasOpenAIKey = !!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_ope');
const openai = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function buildPrompt({ userMessage, emotion, stressScore, crisisRiskScore, recentSummaries }) {
    // Basic adaptive style rules
    let style = 'neutral and supportive';
    if (crisisRiskScore && crisisRiskScore > 75) style = 'urgent, calming, and safety-first';
    else if (emotion === 'sad' && stressScore > 60) style = 'grounding, reassuring, and slow-paced';
    else if (emotion === 'angry') style = 'calm, regulatory coaching with short exercises';
    else if (emotion === 'happy') style = 'uplifting and positive reinforcement';

    const memoryText = (recentSummaries || []).slice(-5).join('\n');

    const prompt = `You are a clinical-adjacent mental wellness assistant. Conversation style: ${style}. Use memory: ${memoryText}.
User message: ${userMessage}
Respond concisely (1-3 sentences), suggest one micro-practice if appropriate, and include a short breathing cue when stressScore > 60.`;

    return prompt;
}

async function aiRespond(req, res) {
    try {
        const userId = req.user._id;
        const { message, sessionId } = req.body;

        // Fetch latest mood entry for context
        const latest = await MoodLog.findOne({ user: userId }).sort({ timestamp: -1 });
        const emotion = latest ? latest.emotion : 'neutral';
        const stressScore = latest ? latest.stressScore : 0;
        const crisisRiskScore = latest ? latest.crisisRiskScore : 0;

        // Fetch memory summaries
        let memory = await ConversationMemory.findOne({ user: userId, sessionId: sessionId || null });
        if (!memory) memory = await ConversationMemory.create({ user: userId, sessionId: sessionId || null, summaries: [] });

        const prompt = buildPrompt({ userMessage: message, emotion, stressScore, crisisRiskScore, recentSummaries: memory.summaries });

        // Call OpenAI to generate response
        let aiText = 'I hear you.';
        if (hasOpenAIKey && openai) {
            try {
                const completion = await openai.chat.completions.create({
                    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a kind, concise mental wellness assistant.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 200
                });
                aiText = completion.choices && completion.choices[0] && completion.choices[0].message ? completion.choices[0].message.content : aiText;
            } catch (err) {
                console.warn('OpenAI call failed, falling back to default response:', err.message);
            }
        } else {
            // simple heuristic fallback
            if (emotion === 'sad') aiText = 'I\'m sorry you\'re feeling down. I\'m here with you.';
            else if (emotion === 'angry') aiText = 'I hear your frustration. Let\'s try a calming exercise.';
            else if (emotion === 'happy') aiText = 'That\'s great to hear — keep it up!';
        }

        // Update conversation memory with a short summary
        const summary = `User: ${message.slice(0, 140)} | AI: ${aiText.slice(0, 140)}`;
        memory.summaries = (memory.summaries || []).concat([summary]).slice(-5);
        memory.lastUpdated = new Date();
        await memory.save();

        // Optionally store in MoodLog as aiResponse
        await MoodLog.create({ user: userId, emotion, transcript: message, aiResponse: aiText, stressScore, crisisRiskScore, timestamp: new Date() });

        res.json({ aiResponse: aiText, summary });
    } catch (err) {
        console.error('AI respond error:', err.message);
        res.status(500).json({ message: 'Error generating AI response' });
    }
}

module.exports = { aiRespond };
