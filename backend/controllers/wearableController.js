const WearableLog = require('../models/WearableLog');
const MoodLog = require('../models/MoodLog');

// Accepts heartRate and correlates with latest stressScore to compute physiologicalStressIndex
async function postHeartRate(req, res) {
    try {
        const userId = req.user._id;
        const { heartRate, sessionId } = req.body;
        if (!heartRate) return res.status(400).json({ message: 'heartRate required' });

        // Fetch latest stressScore
        const latest = await MoodLog.findOne({ user: userId }).sort({ timestamp: -1 });
        const stressScore = latest ? (latest.stressScore || 0) : 0;

        // Simple correlation: scale heartRate (bpm) and stressScore into physiological index
        const hrComponent = Math.min(Math.max((heartRate - 60) / 60, 0), 1); // 0..1
        const stressComponent = Math.min(Math.max(stressScore / 100, 0), 1);
        const physiologicalStressIndex = Math.round((hrComponent * 0.6 + stressComponent * 0.4) * 100);

        const log = await WearableLog.create({ user: userId, sessionId: sessionId || null, heartRate, physiologicalStressIndex });

        res.json({ heartRate, physiologicalStressIndex, logId: log._id });
    } catch (err) {
        console.error('Wearable error:', err.message);
        res.status(500).json({ message: 'Error storing heart rate' });
    }
}

module.exports = { postHeartRate };
