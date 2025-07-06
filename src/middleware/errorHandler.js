import { logger, AppError } from '../utils/index.js';

// Error type handlers
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
        value: e.value
    }));

    return {
        statusCode: 400,
        message: 'Validation Error',
        errors,
        type: 'VALIDATION_ERROR'
    };
};

const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    return {
        statusCode: 409,
        message: `Resource with ${field} '${value}' already exists`,
        field,
        value,
        type: 'DUPLICATE_ERROR'
    };
};

const handleCastError = (err) => {
    return {
        statusCode: 400,
        message: `Invalid ${err.path}: ${err.value}`,
        field: err.path,
        value: err.value,
        type: 'CAST_ERROR'
    };
};

const handleJWTError = (err) => {
    const responses = {
        InvalidTokenError: {
            statusCode: 401,
            message: err.message || 'Invalid authentication token',
            type: 'AUTH_ERROR'
        },
        MissingTokenError: {
            statusCode: 401,
            message: err.message || 'Missing authentication token',
            type: 'AUTH_ERROR'
        },
        TokenExpiredError: {
            statusCode: 401,
            message: err.message || 'Authentication token has expired',
            type: 'AUTH_ERROR'
        },
        NotBeforeError: {
            statusCode: 401,
            message: err.message || 'Token not active yet',
            type: 'AUTH_ERROR'
        }
    };

    return (
        responses[err.name] || {
            statusCode: 401,
            message: err.message || 'Authentication failed',
            type: 'AUTH_ERROR'
        }
    );
};

const handleRateLimitError = (err) => {
    return {
        statusCode: 429,
        message: 'Too many requests, please try again later',
        retryAfter: err.retryAfter,
        type: 'RATE_LIMIT_ERROR'
    };
};

// Main error handler
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error details
    const errorContext = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id || 'anonymous',
        timestamp: new Date().toISOString(),
        stack: err.stack
    };

    // Log based on error severity
    if (err.isOperational) {
        logger.warn('Operational Error:', {
            ...errorContext,
            error: err.message
        });
    } else {
        logger.error('System Error:', errorContext);
    }

    let response;

    // Handle specific error types
    switch (true) {
        case err.name === 'ValidationError':
            response = handleValidationError(err);
            break;
        case err.code === 11000:
            response = handleDuplicateKeyError(err);
            break;
        case err.name === 'CastError':
            response = handleCastError(err);
            break;
        case [
            'InvalidTokenError',
            'MissingTokenError',
            'TokenExpiredError',
            'NotBeforeError'
        ].includes(err.name):
            response = handleJWTError(err);
            break;
        case err.name === 'RateLimitError':
            response = handleRateLimitError(err);
            break;
        case err instanceof AppError:
            response = {
                statusCode: err.statusCode,
                message: err.message,
                type: 'APP_ERROR'
            };
            break;
        default:
            response = {
                statusCode: err.statusCode || err.status || 500,
                message: err.message || 'Internal Server Error',
                type: 'SYSTEM_ERROR'
            };
    }

    // Sanitize error message in production
    if (process.env.NODE_ENV === 'production' && response.statusCode === 500) {
        response.message = 'Something went wrong';
    }

    // Build response object
    const responseBody = {
        success: false,
        error: {
            type: response.type,
            message: response.message,
            timestamp: new Date().toISOString(),
            ...(response.errors && { details: response.errors }),
            ...(response.field && { field: response.field }),
            ...(response.value && { value: response.value }),
            ...(response.retryAfter && { retryAfter: response.retryAfter })
        }
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        responseBody.error.stack = err.stack;
    }

    res.status(response.statusCode).json(responseBody);
};

// Enhanced 404 handler
export const notFound = (req, res, next) => {
    const isApiRequest = req.path.startsWith('/api');

    if (isApiRequest) {
        const error = new AppError(
            `Resource not found - ${req.method} ${req.originalUrl}`,
            404
        );

        return next(error);
    } else {
        res.status(404).render('errors/404', {
            title: '404 - Page Not Found',
            currentYear: new Date().getFullYear()
        });
    }

    // Log 404 attempts for security monitoring
    logger.warn('404 Error:', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
};

// Global unhandled promise rejection handler
export const handleUnhandledRejection = () => {
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Promise Rejection:', {
            reason,
            promise,
            stack: reason?.stack
        });

        // Graceful shutdown
        process.exit(1);
    });
};

// Global uncaught exception handler
export const handleUncaughtException = () => {
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception:', {
            error: error.message,
            stack: error.stack
        });

        // Graceful shutdown
        process.exit(1);
    });
};
