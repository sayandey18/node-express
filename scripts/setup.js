import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setup() {
    try {
        // Create logs directory
        const logsDir = path.join(__dirname, '../logs');
        await fs.mkdir(logsDir, { recursive: true });

        // Create uploads directory
        const uploadsDir = path.join(__dirname, '../public/uploads');
        await fs.mkdir(uploadsDir, { recursive: true });

        // Create .env file if it doesn't exist
        const envPath = path.join(__dirname, '../.env');
        try {
            await fs.access(envPath);
            console.log('✓ .env file already exists');
        } catch {
            const envExample = await fs.readFile(path.join(__dirname, '../.env.example'), 'utf8');
            await fs.writeFile(envPath, envExample);
            console.log('✓ Created .env file from .env.example');
        }

        console.log('✓ Setup completed successfully!');
        console.log('Please update your .env file with your configuration');
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
}

setup();