import express from 'express';
import homeRoutes from './home.js';

const router = express.Router();

router.use('/', homeRoutes);

export default router;
