const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.error(res, 'Not authorized, no token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ai_studybuddy_jwt_secret_dev_key_2026_secure');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return ApiResponse.error(res, 'User no longer exists', 401);
    }

    if (user.status === 'disabled') {
      return ApiResponse.error(res, 'Your account has been deactivated. Please contact support.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Error]', error.message);
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Your session has expired. Please log in again.', 401);
    }
    return ApiResponse.error(res, 'Not authorized, invalid token', 401);
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(res, 'Access denied: You do not have permission for this resource', 403);
    }
    next();
  };
};

module.exports = { protect, restrictTo };
