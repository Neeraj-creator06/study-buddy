const StudyPlan = require('../models/StudyPlan');
const ApiResponse = require('../utils/apiResponse');

/**
 * @route   GET /api/study-plans
 * @desc    Get all study plans for the user
 * @access  Private
 */
const getStudyPlans = async (req, res, next) => {
  try {
    const plans = await StudyPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return ApiResponse.success(res, { plans }, 'Study plans retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/study-plans/:planId/tasks/:taskId
 * @desc    Toggle task completion status
 * @access  Private
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { planId, taskId } = req.params;
    const { isCompleted } = req.body;

    const plan = await StudyPlan.findOne({ _id: planId, userId: req.user._id });
    if (!plan) {
      return ApiResponse.error(res, 'Study plan not found', 404);
    }

    const task = plan.tasks.id(taskId);
    if (!task) {
      return ApiResponse.error(res, 'Task not found in this study plan', 404);
    }

    task.isCompleted = typeof isCompleted === 'boolean' ? isCompleted : !task.isCompleted;
    task.completedAt = task.isCompleted ? new Date() : null;

    // Recalculate overall progress
    const completedCount = plan.tasks.filter((t) => t.isCompleted).length;
    plan.progress = Math.round((completedCount / plan.tasks.length) * 100);

    await plan.save();

    return ApiResponse.success(
      res,
      {
        planId: plan._id,
        taskId: task._id,
        isCompleted: task.isCompleted,
        progress: plan.progress,
      },
      'Task status updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/study-plans/:id
 * @desc    Delete a study plan
 * @access  Private
 */
const deleteStudyPlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!plan) {
      return ApiResponse.error(res, 'Study plan not found', 404);
    }

    return ApiResponse.success(res, {}, 'Study plan deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudyPlans,
  updateTaskStatus,
  deleteStudyPlan,
};
