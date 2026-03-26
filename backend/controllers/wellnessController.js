const MoodLog = require('../models/MoodLog');
const axios = require('axios');
const { OpenAI } = require('openai');
const fs = require('fs');
const FormData = require('form-data');

const hasOpenAIKey = !!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_ope');
const openai = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const AI_SERVICE_BASE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

function buildMindfulnessGuidance({ emotion, stressScore = 0, crisis = false }) {
    const normalizedEmotion = (emotion || 'neutral').toLowerCase();
    const level = stressScore >= 80 ? 'critical' : stressScore >= 60 ? 'high' : stressScore >= 35 ? 'mild' : 'calm';

    if (crisis || stressScore > 75) {
        return {
            title: 'Grounding First',
            message: 'Your stress looks very high right now. Let’s focus on immediate calm and safety.',
            practice: {
                name: 'Box breathing',
                steps: [
                    'Inhale through your nose for 4 seconds',
                    'Hold for 4 seconds',
                    'Exhale slowly for 4 seconds',
                    'Hold for 4 seconds — repeat 4 times'
                ],
                durationMinutes: 2
            },
            suggestion: 'If you feel unsafe or overwhelmed, reach out to a trusted person or your local crisis line.'
        };
    }

    const byEmotion = {
        happy: {
            title: 'Savor the Good',
            message: 'You sound brighter. Let’s lock in what’s working so it lasts longer.',
            practice: { name: 'Gratitude snapshot', steps: ['Name 3 things that went well today', 'Pick 1 and describe why it mattered'], durationMinutes: 3 },
            suggestion: 'Take one small step that supports this mood (a short walk, water, or texting someone supportive).'
        },
        sad: {
            title: 'Gentle Support',
            message: 'You sound a bit low. Let’s soften the edges with something kind and steady.',
            practice: { name: 'Soothing breath', steps: ['Inhale 4 seconds', 'Exhale 6 seconds', 'Relax your shoulders — repeat 8 times'], durationMinutes: 2 },
            suggestion: 'If you can, do one tiny task that helps future-you (shower, tidy one surface, or a warm drink).'
        },
        angry: {
            title: 'Regulate the Heat',
            message: 'I’m hearing frustration. Let’s slow your body down before solving anything.',
            practice: { name: 'Release + reset', steps: ['Unclench your jaw', 'Drop shoulders', 'Exhale fully', 'Count 5 slow breaths'], durationMinutes: 2 },
            suggestion: 'Try a 60-second pause before replying or deciding anything important.'
        },
        fear: {
            title: 'Steady & Safe',
            message: 'You sound tense or worried. Let’s bring you back to the present.',
            practice: { name: '5-4-3-2-1 grounding', steps: ['5 things you see', '4 things you feel', '3 things you hear', '2 things you smell', '1 thing you taste'], durationMinutes: 3 },
            suggestion: 'Say: “Right now, in this moment, I am safe enough.”'
        },
        disgust: {
            title: 'Reset & Clean Slate',
            message: 'That felt unpleasant. Let’s reset your nervous system and shift your attention.',
            practice: { name: 'Sensory reset', steps: ['Sip water slowly', 'Wash hands with warm water', 'Take 5 slow breaths'], durationMinutes: 3 },
            suggestion: 'If possible, change your environment slightly (fresh air, different room, or open a window).'
        },
        surprise: {
            title: 'Settle After the Spike',
            message: 'Surprises can jolt your system. Let’s settle your breathing and re-center.',
            practice: { name: 'Long exhale', steps: ['Inhale 4 seconds', 'Exhale 8 seconds', 'Repeat 6 times'], durationMinutes: 2 },
            suggestion: 'Ask: “What’s the next best small step?”'
        },
        neutral: {
            title: 'Build a Calm Baseline',
            message: 'You sound steady. This is a good time to build supportive habits.',
            practice: { name: '1-minute body scan', steps: ['Notice forehead', 'Notice jaw', 'Notice shoulders', 'Relax on each exhale'], durationMinutes: 1 },
            suggestion: 'Pick one micro-habit for today: drink water, stretch, or step outside for 2 minutes.'
        }
    };

    const base = byEmotion[normalizedEmotion] || byEmotion.neutral;
    return {
        ...base,
        meta: { emotion: normalizedEmotion, stressLevel: level, stressScore }
    };
}

const processVoice = async (req, res) => {
    let audioPath = null;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No audio file provided' });
        }

        audioPath = req.file.path;
        console.log(`Processing audio at: ${audioPath}`);

        // 1. Send to Python AI Service for emotion detection
        const formData = new FormData();
        formData.append('file', fs.createReadStream(audioPath));

        try {
            console.log(`Calling AI Service at: ${AI_SERVICE_BASE_URL}/predict`);
            const aiResponse = await axios.post(`${AI_SERVICE_BASE_URL}/predict`, formData, {
                headers: { ...formData.getHeaders() },
                timeout: 30000 // Increase to 30 seconds
            });
            emotionData = aiResponse.data;
            console.log('AI Service Success:', JSON.stringify(emotionData));
        } catch (error) {
            console.error('AI Service Error Status:', error.response?.status);
            console.error('AI Service Error Data:', JSON.stringify(error.response?.data));
            console.error('AI Service Error Message:', error.message);
            // Fallback for demo purposes if AI service is down
            emotionData = { emotion: 'error_fallback', confidence: 0.0, mode: 'fallback' };
        }

        const { emotion, confidence, stressScore, audioFeatures } = emotionData;

        // 2. Generate Empathetic Response using OpenAI (or hardcoded templates as fallback)
        let aiResponseText = '';
        try {
            const prompt = `The user is feeling ${emotion}. Generate a short, empathetic, comforting voice-assistant response (max 2 sentences) to help them feel better. Current detected mood: ${emotion}.`;
            if (hasOpenAIKey && openai) {
                const completion = await openai.chat.completions.create({
                    messages: [{ role: "system", content: "You are a kind mental wellness coach." }, { role: "user", content: prompt }],
                    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
                });
                aiResponseText = completion.choices[0].message.content;
            } else {
                const templates = {
                    sad: "I'm sorry you're feeling down. I'm here for you. Take a deep breath.",
                    happy: "It's wonderful to hear you're feeling good! Let's keep that positive energy going.",
                    angry: "I hear that you're frustrated. It's okay to feel this way. Let's try to find some calm together.",
                    neutral: "I'm here to listen. How has your day been so far?"
                };
                aiResponseText = templates[emotion] || "I'm here for you. Tell me more about how you feel.";
            }
        } catch (error) {
            console.error('OpenAI Error:', error.message);
            const templates = {
                sad: "I'm sorry you're feeling down. I'm here for you. Take a deep breath.",
                happy: "It's wonderful to hear you're feeling good! Let's keep that positive energy going.",
                angry: "I hear that you're frustrated. It's okay to feel this way. Let's try to find some calm together.",
                neutral: "I'm here to listen. How has your day been so far?"
            };
            aiResponseText = templates[emotion] || "I'm here for you. Tell me more about how you feel.";
        }

        // 3. Save to database
        const log = await MoodLog.create({
            user: req.user._id,
            emotion,
            confidence,
            aiResponse: aiResponseText,
            stressScore: stressScore || 0,
            sessionId: req.body.sessionId || null,
            timestamp: new Date()
        });

        // If stressScore is critical, create a CrisisLog and flag response
        const crisis = !!(stressScore && stressScore > 75);
        if (crisis) {
            try {
                const CrisisLog = require('../models/CrisisLog');
                await CrisisLog.create({
                    user: req.user._id,
                    sessionId: req.body.sessionId || null,
                    crisisRiskScore: stressScore,
                    indicators: ['high_stress'],
                    transcript: req.body.transcript || '',
                    audioFeatures: audioFeatures || null,
                    actionTaken: 'Auto Crisis Log from wellness processing'
                });
                // attach crisis info to response
                aiResponseText += ' [System: High stress detected — initiating calming guidance.]';
            } catch (e) {
                console.warn('Failed to create CrisisLog:', e.message);
            }
        }

        const mindfulnessGuidance = buildMindfulnessGuidance({ emotion, stressScore: stressScore || 0, crisis });

        return res.json({
            emotion,
            confidence,
            aiResponse: aiResponseText,
            logId: log._id,
            stressScore: stressScore || 0,
            crisis,
            helpline: '988',
            mode: emotionData.mode,
            ai_error: emotionData.error || emotionData.ai_error || null,
            actions: (stressScore || 0) > 75 ? ['deep_breathing', 'call_counselor', 'go_to_safe_place'] : [],
            mindfulnessGuidance
        });

    } catch (error) {
        console.error('Wellness Controller Error:', error);
        return res.status(500).json({ message: 'Error processing voice' });
    } finally {
        if (audioPath && fs.existsSync(audioPath)) {
            fs.unlink(audioPath, () => { });
        }
    }
};

const getMoodHistory = async (req, res) => {
    try {
        const history = await MoodLog.find({ user: req.user._id }).sort({ timestamp: -1 }).limit(20);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history' });
    }
};

module.exports = { processVoice, getMoodHistory };
