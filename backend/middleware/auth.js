const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user && !global.DEMO_MODE) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Fallback for demo mode if user doesn't exist
            if (!req.user && global.DEMO_MODE) {
                req.user = { _id: decoded.id, name: 'Demo User', email: 'demo@example.com' };
            }

            next();
        } catch (error) {
            console.error('Auth Error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };