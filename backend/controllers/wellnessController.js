const MoodLog = require('../models/MoodLog');
const axios = require('axios');
const { OpenAI } = require('openai');
const fs = require('fs');
const FormData = require('form-data');

const hasOpenAIKey = !!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_ope');
const openai = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const AI_SERVICE_BASE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

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

        let emotionData;
        try {
            const aiResponse = await axios.post(`${AI_SERVICE_BASE_URL}/predict-emotion`, formData, {
                headers: { ...formData.getHeaders() }
            });
            emotionData = aiResponse.data;
        } catch (error) {
            console.error('AI Service Error:', error.message);
            // Fallback for demo purposes if AI service is down
            emotionData = { emotion: 'neutral', confidence: 0.5, mode: 'fallback' };
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
        if (stressScore && stressScore > 75) {
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

        return res.json({
            emotion,
            confidence,
            aiResponse: aiResponseText,
            logId: log._id,
            stressScore: stressScore || 0,
            crisis: stressScore && stressScore > 75,
            helpline: '988',
            actions: stressScore > 75 ? ['deep_breathing', 'call_counselor', 'go_to_safe_place'] : []
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
