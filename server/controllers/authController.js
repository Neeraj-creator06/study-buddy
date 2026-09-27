const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ai_studybuddy_jwt_secret_dev_key_2026_secure', {
    expiresIn: '30d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password) {
      return ApiResponse.error(res, 'Please provide name, email, and password', 400);
    }

    if (confirmPassword && password !== confirmPassword) {
      return ApiResponse.error(res, 'Passwords do not match', 400);
    }

    if (password.length < 6) {
      return ApiResponse.error(res, 'Password must be at least 6 characters long', 400);
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return ApiResponse.error(res, 'A user with this email address already exists', 400);
    }

    // Role default is 'student'. 'admin' can only be created if specifically chosen on registration for demo purposes or configured
    const userRole = role === 'admin' ? 'admin' : 'student';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: userRole,
    });

    const token = generateToken(user._id);

    return ApiResponse.success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          streak: user.streak,
          preferences: user.preferences,
        },
        token,
      },
      'Registration successful',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, 'Please provide both email and password', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return ApiResponse.error(res, 'Invalid email or password', 401);
    }

    if (user.status === 'disabled') {
      return ApiResponse.error(res, 'Your account has been deactivated. Please contact support.', 403);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return ApiResponse.error(res, 'Invalid email or password', 401);
    }

    // Update streak if active on a new day
    const now = new Date();
    const lastActive = new Date(user.lastActiveDate || now);
    const diffHours = Math.abs(now - lastActive) / 36e5;
    if (diffHours >= 20 && diffHours <= 48) {
      user.streak = (user.streak || 1) + 1;
    }
    user.lastActiveDate = now;
    await user.save();

    const token = generateToken(user._id);

    return ApiResponse.success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          streak: user.streak,
          preferences: user.preferences,
        },
        token,
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return ApiResponse.success(res, { user }, 'User profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile & preferences
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    const { name, preferredSubjects, dailyStudyGoal, theme, newPassword, currentPassword } = req.body;

    if (name) user.name = name;
    if (preferredSubjects) user.preferences.preferredSubjects = preferredSubjects;
    if (dailyStudyGoal) user.preferences.dailyStudyGoal = dailyStudyGoal;
    if (theme) user.preferences.theme = theme;

    if (newPassword) {
      if (!currentPassword) {
        return ApiResponse.error(res, 'Please provide current password to set a new password', 400);
      }
      const userWithPass = await User.findById(req.user._id).select('+password');
      const isMatch = await userWithPass.matchPassword(currentPassword);
      if (!isMatch) {
        return ApiResponse.error(res, 'Current password does not match', 400);
      }
      user.password = newPassword;
    }

    await user.save();

    return ApiResponse.success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          streak: user.streak,
          preferences: user.preferences,
        },
      },
      'Profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clears client session)
 * @access  Private
 */
const logout = async (req, res) => {
  return ApiResponse.success(res, {}, 'Logged out successfully');
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
};
