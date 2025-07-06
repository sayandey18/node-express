import { validationResult } from 'express-validator';

// Create a validation middleware
const validate = (...rules) => {
    let allRules = rules.flat();
    return [
        ...allRules,
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const validationError = new Error('Validation failed');
                validationError.name = 'ValidationError';
                validationError.errors = {};

                errors.array().forEach((error) => {
                    validationError.errors[error.path] = {
                        path: error.path,
                        message: error.msg,
                        value: error.value
                    };
                });

                return next(validationError);
            }

            next();
        }
    ];
};

export default validate;
