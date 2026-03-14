const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`MongoDB Error: ${error.message}`);
        console.log('Running in DEMO mode without database persistence');
        return false;
    }
};

module.exports = connectDB;
