const axios = require('axios');
const CrisisLog = require('../models/CrisisLog');
const MoodLog = require('../models/MoodLog');
const FormData = require('form-data');
const fs = require('fs');

const AI_SERVICE_BASE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Simple keyword-based detection for crisis phrases
const CRISIS_KEYWORDS = [
    'kill myself', 'i want to die', 'suicide', 'end my life', 'can\'t go on', 'hopeless', 'no reason to live', 'worthless', 'give up'
];

function keywordRiskScore(transcript) {
    if (!transcript) return 0;
    const lc = transcript.toLowerCase();
    let score = 0;
    CRISIS_KEYWORDS.forEach((k) => {
        if (lc.includes(k)) score += 30;
    });
    if (lc.includes('alone') || lc.includes('nobody')) score += 10;
    return Math.min(score, 100);
}

async function evaluateCrisis(req, res) {
    let audioPath = null;
    try {
        const userId = req.user._id;
        const transcript = req.body.transcript || '';

        // 1. Call AI service to analyze audio if provided
        let audioFeatures = null;
        let stressScore = 0;

        if (req.file) {
            audioPath = req.file.path;
            const form = new FormData();
            form.append('file', fs.createReadStream(audioPath));

            try {
                const aiResp = await axios.post(`${AI_SERVICE_BASE_URL}/predict-emotion`, form, { headers: form.getHeaders() });
                audioFeatures = aiResp.data.audioFeatures || null;
                stressScore = aiResp.data.stressScore || 0;
            } catch (aiErr) {
                console.warn('Crisis evaluate AI service unavailable:', aiErr.message);
            }
        }

        // 2. Keyword-based score
        const kwScore = keywordRiskScore(transcript);

        // 3. Behavioral trend: check last 5 mood logs for repeated sadness or falling calmness
        const recent = await MoodLog.find({ user: userId }).sort({ timestamp: -1 }).limit(6);
        let trendScore = 0;
        if (recent && recent.length > 0) {
            const sadnessCount = recent.filter(r => r.emotion === 'sad').length;
            if (sadnessCount >= 3) trendScore += 25;
            // calmness drop
            const calmnesses = recent.map(r => r.calmnessScore || 0);
            if (calmnesses.length >= 2) {
                const drop = calmnesses[0] - calmnesses[calmnesses.length - 1];
                if (drop > 10) trendScore += 20;
            }
        }

        // 4. Combine into crisisRiskScore
        const combined = Math.min(100, Math.round((kwScore * 0.5) + (stressScore * 0.35) + (trendScore * 0.15)));

        // Store CrisisLog securely
        const log = await CrisisLog.create({
            user: userId,
            sessionId: req.body.sessionId || null,
            crisisRiskScore: combined,
            indicators: [kwScore > 0 ? 'keyword' : '', stressScore > 60 ? 'high_stress' : '', trendScore > 0 ? 'trend' : ''].filter(Boolean),
            transcript,
            audioFeatures,
            actionTaken: combined > 75 ? 'Crisis Mode Triggered' : 'Monitored',
            helplineShown: null
        });

        const response = {
            crisisRiskScore: combined,
            crisis: combined > 75,
            actions: []
        };

        if (response.crisis) {
            // Provide emergency options
            response.actions.push('pause_conversation', 'start_calming_voice', 'start_guided_breathing', 'show_emergency_contacts');
            // Minimal region-based helpline discovery (could call external API)
            const country = req.user.country || 'US';
            if (country === 'US') response.helpline = '988 (US Suicide & Crisis Lifeline)';
            else response.helpline = 'Contact local emergency services';
        }

        // Return structured result
        return res.json({ ...response, logId: log._id });

    } catch (err) {
        console.error('Crisis evaluate error:', err.message);
        return res.status(500).json({ message: 'Error evaluating crisis' });
    } finally {
        if (audioPath && fs.existsSync(audioPath)) {
            fs.unlink(audioPath, () => {});
        }
    }
}

module.exports = { evaluateCrisis };
