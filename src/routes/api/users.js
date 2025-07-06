import express from 'express';
import userController from '../../controllers/userController.js';
import { auth, validate } from '../../middleware/index.js';
import { userUpdateRules, userIdRules } from '../../utils/validations.js';

const router = express.Router();

router.get('/', auth, userController.getAll);
router.get('/:id', auth, validate(userIdRules), userController.getById);
router.put(
    '/:id',
    auth,
    validate(userUpdateRules, userIdRules),
    userController.update
);
router.delete('/:id', auth, validate(userIdRules), userController.delete);

export default router;
