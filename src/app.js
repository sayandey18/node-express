import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { engine } from 'express-handlebars';

// Config files
import config from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/index.js';
import { logger } from './utils/index.js';
import { connectDatabase } from './config/databse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to database
await connectDatabase();

// Security middleware
app.use(helmet(config.csp));
app.use(cors(config.cors));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Logging middleware
app.use(morgan('dev'));

// View engine setup (if using server-side rendering)
app.engine(
    'hbs',
    engine({
        extname: 'hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        partialsDir: path.join(__dirname, 'views', 'partials'),
        helpers: {
            eq: (a, b) => a === b
        }
    })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Request logging
const isLogEnabled = process.env.LOG_ENABLED || false;
if (isLogEnabled) {
    app.use((req, res, next) => {
        logger.info(`${req.method} ${req.path}`, { ip: req.ip });
        next();
    });
}

// Routes
app.use('/', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
