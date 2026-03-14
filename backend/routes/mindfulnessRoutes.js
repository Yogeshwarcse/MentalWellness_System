const express = require('express');
const router = express.Router();
const { generatePlan, getPlans } = require('../controllers/mindfulnessController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generatePlan);
router.get('/', protect, getPlans);

module.exports = router;
