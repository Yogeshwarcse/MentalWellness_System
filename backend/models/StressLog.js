const mongoose = require('mongoose');

const stressLogSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String },
    stressScore: { type: Number, required: true },
    features: { type: Object },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StressLog', stressLogSchema);
