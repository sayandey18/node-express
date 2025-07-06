import nodemailer from 'nodemailer';
import { logger } from '../utils/index.js';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendEmail(to, subject, html) {
        try {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to,
                subject,
                html
            };

            const result = await this.transporter.sendMail(mailOptions);
            logger.info('Email sent successfully:', result.messageId);
            return result;
        } catch (error) {
            logger.error('Error sending email:', error);
            throw error;
        }
    }

    async sendWelcomeEmail(email, name) {
        const subject = 'Welcome to Our App!';
        const html = `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining our application.</p>
    `;

        return this.sendEmail(email, subject, html);
    }
}

export default new EmailService();
