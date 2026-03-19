require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const wellnessRoutes = require('./routes/wellnessRoutes');
const crisisRoutes = require('./routes/crisisRoutes');
const aiRoutes = require('./routes/aiRoutes');
const wearableRoutes = require('./routes/wearableRoutes');
const mindfulnessRoutes = require('./routes/mindfulnessRoutes');

const app = express();

// Connect to Database
let dbConnected = false;
connectDB().then(connected => {
    dbConnected = connected;
    global.DEMO_MODE = !connected;
}).catch(() => {
    global.DEMO_MODE = true;
});

fs.mkdirSync('uploads', { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/crisis', crisisRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/wearable', wearableRoutes);
app.use('/api/mindfulness', mindfulnessRoutes);

// Health Check / API Home
app.get('/api', (req, res) => {
    res.send('Mental Wellness API is running...');
});

// Wildcard route to serve React app for any other path
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please stop the process using this port or set a different PORT.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});
