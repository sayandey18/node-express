import logger from './logger.js';
import * as helpers from './helpers.js';
import * as validations from './validations.js';

// Custom error class for application-specific errors
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace(this, this.constructor);
    }
}

export { AppError, logger, helpers, validations };
