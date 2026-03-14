const express = require('express');
const router = express.Router();
const { aiRespond } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/respond', protect, aiRespond);

module.exports = router;
