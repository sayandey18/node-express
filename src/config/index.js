import database from './databse.js';
import server from './server.js';

export default {
    ...server,
    database,
    jwt: {
        secret: process.env.JWT_SECRET_KEY || 'secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5000',
        credentials: true
    },
    csp: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'https://fonts.googleapis.com',
                    'https://fonts.gstatic.com'
                ],
                fontSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'https://fonts.googleapis.com',
                    'https://fonts.gstatic.com'
                ],
                imgSrc: ["'self'", 'data:'],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: []
            }
        }
    }
};
