import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userService } from './index.js';
import { logger, AppError } from '../utils/index.js';
import config from '../config/index.js';

class AuthService {
    async register(userData) {
        try {
            const { email, password, name } = userData;

            // Check if user already exists
            const existingUser = await userService.getUserByEmail(email);
            if (existingUser) {
                throw new AppError('User already exists with this email', 409);
            }

            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create user
            const user = await userService.createUser({
                email,
                password: hashedPassword,
                name
            });

            // Generate tokens
            const tokens = this.generateTokens(user._id);

            return {
                user,
                ...tokens
            };
        } catch (error) {
            logger.error('Error in register:', error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            // Find user with password
            const user = await userService.getUserByEmail(email);
            if (!user) {
                throw new AppError('Invalid email or password', 401);
            }

            // Check password
            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );
            if (!isValidPassword) {
                throw new AppError('Invalid email or password', 401);
            }

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            // Generate tokens
            const tokens = this.generateTokens(user._id);

            return {
                user: userResponse,
                ...tokens
            };
        } catch (error) {
            logger.error('Error in login:', error);
            throw error;
        }
    }

    async refreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, config.jwt.secret);
            const tokens = this.generateTokens(decoded.userId);

            return tokens;
        } catch (error) {
            logger.error('Error in refreshToken:', error);
            throw new AppError('Invalid refresh token', 401);
        }
    }

    generateTokens(userId) {
        const accessToken = jwt.sign({ userId }, config.jwt.secret, {
            expiresIn: '15m'
        });

        const refreshToken = jwt.sign({ userId }, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        });

        return {
            accessToken,
            refreshToken
        };
    }
}

export default new AuthService();
