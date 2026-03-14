const mongoose = require('mongoose');

const wearableLogSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String },
    heartRate: { type: Number, required: true },
    physiologicalStressIndex: { type: Number },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WearableLog', wearableLogSchema);
