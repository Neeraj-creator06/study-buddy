const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResults,
} = require('../controllers/quizController');

router.use(protect);

router.get('/', getQuizzes);
router.get('/results/history', getQuizResults);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuiz);

module.exports = router;
