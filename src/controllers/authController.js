import { authService } from '../services/index.js';
import { logger } from '../utils/index.js';

class AuthController {
    async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            const result = await authService.register({
                email,
                password,
                name
            });

            res.status(201).json({
                success: true,
                data: result,
                message: 'User registered successfully'
            });
        } catch (error) {
            logger.error('Error in register:', error);
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);

            res.json({
                success: true,
                data: result,
                message: 'Login successful'
            });
        } catch (error) {
            logger.error('Error in login:', error);
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            // In a real app, you might invalidate the token
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            logger.error('Error in logout:', error);
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);

            res.json({
                success: true,
                data: result,
                message: 'Token refreshed successfully'
            });
        } catch (error) {
            logger.error('Error in refreshToken:', error);
            next(error);
        }
    }
}

export default new AuthController();
