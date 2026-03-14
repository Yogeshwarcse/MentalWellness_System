const mongoose = require('mongoose');

const memorySchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String },
    summaries: { type: [String], default: [] },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ConversationMemory', memorySchema);
