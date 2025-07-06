import jwt from 'jsonwebtoken';
import { userService } from '../services/index.js';
import { logger } from '../utils/index.js';
import config from '../config/index.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            const authError = new Error('Missing authentication token');
            authError.name = 'MissingTokenError';
            return next(authError);
        }

        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await userService.getUserById(decoded.userId);

        if (!user) {
            const authError = new Error('Invalid authentication token');
            authError.name = 'InvalidTokenError';
            return next(authError);
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        next(error);
    }
};

export default auth;
