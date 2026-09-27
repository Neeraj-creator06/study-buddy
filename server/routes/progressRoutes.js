const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProgressStats } = require('../controllers/progressController');

router.use(protect);

router.get('/', getProgressStats);

module.exports = router;
