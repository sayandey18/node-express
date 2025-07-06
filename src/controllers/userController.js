import { userService } from '../services/index.js';
import { logger } from '../utils/index.js';

class UserController {
    async getAll(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            logger.error('Error getting users:', error);
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            logger.error('Error getting user:', error);
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const user = await userService.updateUser(id, updateData);

            res.json({
                success: true,
                data: user,
                message: 'User updated successfully'
            });
        } catch (error) {
            logger.error('Error updating user:', error);
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await userService.deleteUser(id);

            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            logger.error('Error deleting user:', error);
            next(error);
        }
    }
}

export default new UserController();
