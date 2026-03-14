const express = require('express');
const router = express.Router();
const { postHeartRate } = require('../controllers/wearableController');
const { protect } = require('../middleware/auth');

router.post('/heart-rate', protect, postHeartRate);

module.exports = router;
