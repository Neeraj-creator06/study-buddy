const ApiResponse = require('../utils/apiResponse');

const notFound = (req, res, next) => {
  return ApiResponse.error(res, `Route not found: ${req.originalUrl}`, 404);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  const message = err.message || 'Internal Server Error';

  console.error(`[API Error] ${req.method} ${req.originalUrl} -`, err);

  return ApiResponse.error(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? err.errors || err.stack : undefined
  );
};

module.exports = { notFound, errorHandler };
