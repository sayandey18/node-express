import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const isLogEnabled = String(process.env.LOG_ENABLED).toLowerCase() === 'true';

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

let transports = [];

if (isLogEnabled) {
    if (!isProduction) {
        // Console logging for development
        transports.push(
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            })
        );
    } else {
        // File logging for production
        transports.push(
            new winston.transports.File({
                filename: path.join(__dirname, '../../logs/combined.log')
            }),
            new winston.transports.File({
                filename: path.join(__dirname, '../../logs/error.log'),
                level: 'error'
            })
        );
    }
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'node-express' },
    transports
});

// If we're not in production, log to console with simple format
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple()
        })
    );
}

export default logger;
