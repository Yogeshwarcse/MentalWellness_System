const mongoose = require('mongoose');

const crisisLogSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String },
    crisisRiskScore: { type: Number, required: true },
    indicators: { type: [String] },
    transcript: { type: String },
    audioFeatures: { type: Object },
    actionTaken: { type: String },
    helplineShown: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CrisisLog', crisisLogSchema);
