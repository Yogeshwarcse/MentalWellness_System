const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processVoice, getMoodHistory } = require('../controllers/wellnessController');
const { protect } = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

router.post('/process-voice', protect, upload.single('audio'), processVoice);
router.get('/history', protect, getMoodHistory);

module.exports = router;
