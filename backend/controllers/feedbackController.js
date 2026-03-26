const Feedback = require('../models/Feedback');

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

        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    submitFeedback
};
