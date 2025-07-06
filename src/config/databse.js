import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { logger } from '../utils/index.js';

dotenv.config();

const database = {
    url: process.env.MONGO_DATABASE_URL || 'mongodb://localhost:27017/myapp',
    options: {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
    }
};

export const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(database.url, database.options);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed through app termination');
            process.exit(0);
        });
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default database;
