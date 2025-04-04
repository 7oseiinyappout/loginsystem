// utils/AppError.js
class AppError extends Error {
    constructor(err, statusCode) {
      super(err);
      this.statusCode = statusCode;
      this.mainStack = err.stack;
      this.stack = err.stack;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  