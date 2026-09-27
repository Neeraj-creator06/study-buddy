const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateSummaryController,
  generateFlashcardsController,
  generateQuizController,
  generateStudyPlanController,
  askAiController,
  importantQuestionsController,
  explainConceptController,
} = require('../controllers/aiController');

router.use(protect);

router.post('/summary', generateSummaryController);
router.post('/flashcards', generateFlashcardsController);
router.post('/quiz', generateQuizController);
router.post('/study-plan', generateStudyPlanController);
router.post('/ask', askAiController);
router.post('/important-questions', importantQuestionsController);
router.post('/explain', explainConceptController);

module.exports = router;
