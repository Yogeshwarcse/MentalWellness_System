const Feedback = require('../models/Feedback');
const fs = require('fs').promises;
const path = require('path');

// @desc    Submit user feedback
// @route   POST /api/feedback
// @access  Private
const submitFeedback = async (req, res) => {
    try {
        const { message, rating } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Feedback message is required' });
        }

        const feedback = new Feedback({
            user: req.user.id,
            message,
            rating: rating || 5
        });

        await feedback.save();

        // Save to local file
        try {
            const logEntry = {
                user: req.user.id,
                message,
                rating: rating || 5,
                timestamp: new Date().toISOString()
            };

            const logFilePath = path.join(__dirname, '../feedback_logs.json');
            let logs = [];
            
            // Check if file exists and read it
            try {
                const data = await fs.readFile(logFilePath, 'utf8');
                logs = JSON.parse(data);
            } catch (err) {
                // File doesn't exist or is empty, start fresh
                logs = [];
            }

            logs.push(logEntry);
            await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2));
            console.log('Feedback saved to feedback_logs.json');
        } catch (fileError) {
            console.error('Error saving feedback to file:', fileError.message);
        }

        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    submitFeedback
};
