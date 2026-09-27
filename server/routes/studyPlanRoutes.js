const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getStudyPlans,
  updateTaskStatus,
  deleteStudyPlan,
} = require('../controllers/studyPlanController');

router.use(protect);

router.get('/', getStudyPlans);
router.put('/:planId/tasks/:taskId', updateTaskStatus);
router.delete('/:id', deleteStudyPlan);

module.exports = router;
