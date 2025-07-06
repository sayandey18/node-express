import express from 'express';
import authController from '../../controllers/authController.js';
import { validate } from '../../middleware/index.js';
import { userSignupRules, userLoginRules } from '../../utils/validations.js';

const router = express.Router();

router.post('/register', validate(userSignupRules), authController.register);
router.post('/login', validate(userLoginRules), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);

export default router;
