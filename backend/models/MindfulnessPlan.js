const mongoose = require('mongoose');

const planSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    weekStart: { type: Date },
    days: { type: Object }, // { monday: {breathing:10, meditation:15, completed: false}, ... }
    notes: { type: String },
    summary: { type: String }
});

module.exports = mongoose.model('MindfulnessPlan', planSchema);
