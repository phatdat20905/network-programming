import apiResponse from '../utils/apiResponse.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));
    return apiResponse.error(res, 'Validation failed', 400, messages);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map(error => ({
      field: error.path,
      message: `${error.path} already exists`
    }));
    return apiResponse.error(res, 'Duplicate field value', 400, messages);
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return apiResponse.error(res, 'Related resource not found', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return apiResponse.error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return apiResponse.error(res, 'Token expired', 401);
  }

  // Default error
  return apiResponse.error(res, error.message || 'Server Error', error.statusCode || 500);
};

export default errorHandler;