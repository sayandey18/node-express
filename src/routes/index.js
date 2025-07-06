import express from 'express';
import apiRoutes from './api/index.js';
import webRoutes from './web/index.js';

const router = express.Router();

// API routes
router.use('/api', apiRoutes);

// Web routes
router.use('/', webRoutes);

export default router;
