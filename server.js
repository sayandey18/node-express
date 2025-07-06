import 'dotenv/config';
import app from './src/app.js';

// Server config
const isProd = process.env.NODE_ENV === 'production';
const HOST = isProd ? '0.0.0.0' : 'localhost';
const PORT = isProd ? 8000 : 5000;

// Start server
app.listen(PORT, () => {
    console.log(`⚡ Node.js + Express Server: http://${HOST}:${PORT}`);
});