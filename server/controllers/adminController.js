const User = require('../models/User');
const StudyMaterial = require('../models/StudyMaterial');
const Summary = require('../models/Summary');
const QuizResult = require('../models/QuizResult');
const ApiResponse = require('../utils/apiResponse');

/**
 * @route   GET /api/admin/stats
 * @desc    Get system-wide platform analytics
 * @access  Private (Admin only)
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalMaterials,
      totalSummaries,
      quizResults,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      StudyMaterial.countDocuments(),
      Summary.countDocuments(),
      QuizResult.find().select('percentage'),
    ]);

    const totalScore = quizResults.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
    const avgScore = quizResults.length > 0 ? Math.round(totalScore / quizResults.length) : 0;

    return ApiResponse.success(
      res,
      {
        totalUsers,
        activeUsers,
        totalMaterials,
        totalSummaries,
        quizzesCompleted: quizResults.length,
        averageQuizScore: avgScore,
      },
      'Admin analytics loaded successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get list of all registered users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    return ApiResponse.success(
      res,
      {
        users,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      'Users list retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Change user role (student/admin)
 * @access  Private (Admin only)
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'admin'].includes(role)) {
      return ApiResponse.error(res, 'Invalid role specification', 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    user.role = role;
    await user.save();

    return ApiResponse.success(res, { user }, `User role updated to ${role}`);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Toggle user active/disabled status
 * @access  Private (Admin only)
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    // Prevent admin from disabling themselves
    if (user._id.toString() === req.user._id.toString()) {
      return ApiResponse.error(res, 'You cannot disable your own admin account', 400);
    }

    user.status = user.status === 'active' ? 'disabled' : 'active';
    await user.save();

    return ApiResponse.success(res, { user }, `User account marked as ${user.status}`);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    if (user._id.toString() === req.user._id.toString()) {
      return ApiResponse.error(res, 'You cannot delete your own admin account', 400);
    }

    await user.deleteOne();
    return ApiResponse.success(res, {}, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
};
