import { User } from '../models/index.js';
import { logger } from '../utils/index.js';

class UserService {
    async getAllUsers() {
        try {
            return await User.find().select('-password');
        } catch (error) {
            logger.error('Error in getAllUsers:', error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await User.findById(id).select('-password');
        } catch (error) {
            logger.error('Error in getUserById:', error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            logger.error('Error in getUserByEmail:', error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const user = new User(userData);
            await user.save();

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            return userResponse;
        } catch (error) {
            logger.error('Error in createUser:', error);
            throw error;
        }
    }

    async updateUser(id, updateData) {
        try {
            const user = await User.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true
            }).select('-password');

            return user;
        } catch (error) {
            logger.error('Error in updateUser:', error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            logger.error('Error in deleteUser:', error);
            throw error;
        }
    }
}

export default new UserService();
