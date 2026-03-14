const mongoose = require('mongoose');

const moodLogSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    emotion: { type: String, required: true },
    confidence: { type: Number },
    transcript: { type: String },
    aiResponse: { type: String },
    calmnessScore: { type: Number, default: 0 },
    stressScore: { type: Number, default: 0 },
    crisisRiskScore: { type: Number, default: 0 },
    sessionSummary: { type: String },
    sessionId: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoodLog', moodLogSchema);
