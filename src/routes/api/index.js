import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import config from '../../config/index.js';

const router = express.Router();
const { apiVersion } = config;

router.use(`/${apiVersion}/auth`, authRoutes);
router.use(`/${apiVersion}/users`, userRoutes);

// Health check
router.get(`/${apiVersion}/health`, (req, res) => {
    res.json({
        success: true,
        uptime: process.uptime(),
        message: 'I am healthy and running!',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

export default router;
