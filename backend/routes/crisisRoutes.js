const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { evaluateCrisis } = require('../controllers/crisisController');
const { protect } = require('../middleware/auth');

router.post('/evaluate', protect, upload.single('audio'), evaluateCrisis);

module.exports = router;
