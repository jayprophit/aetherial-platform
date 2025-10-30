import nodemailer from 'nodemailer';
import { Config } from '../config';
import { logger } from '../utils/logger';
import { compile } from 'handlebars';
import { readFileSync } from 'fs';
import path from 'path';

// Email templates
const TEMPLATES_DIR = path.join(__dirname, '../../templates/emails');

// Load email template
const loadTemplate = (templateName: string, context: any = {}) => {
  try {
    const templatePath = path.join(TEMPLATES_DIR, `${templateName}.hbs`);
    const template = compile(readFileSync(templatePath, 'utf8'));
    return template(context);
  } catch (error) {
    logger.error(`Failed to load email template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
};

// Create transporter
const transporter = nodemailer.createTransport({
  host: Config.email.host,
  port: Config.email.port,
  secure: Config.email.secure,
  auth: {
    user: Config.email.auth.user,
    pass: Config.email.auth.pass,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    logger.error('Error with email configuration:', error);
  } else {
    logger.info('Email server is ready to take our messages');
  }
});

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  template: string;
  context?: Record<string, any>;
  attachments?: any[];
}

export class EmailService {
  static async sendEmail(options: SendEmailOptions) {
    try {
      const { to, subject, template, context = {}, attachments = [] } = options;
      
      // Render email template
      const html = loadTemplate(template, context);
      
      // Setup email data
      const mailOptions = {
        from: `"${Config.email.fromName}" <${Config.email.fromEmail}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        attachments,
      };
      
      // Send email
      const info = await transporter.sendMail(mailOptions);
      
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  // Send verification email
  static async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${Config.appUrl}/auth/verify-email?token=${token}`;
    
    await this.sendEmail({
      to: email,
      subject: 'Verify your email address',
      template: 'verify-email',
      context: {
        name: email.split('@')[0],
        verificationUrl,
        supportEmail: Config.email.supportEmail,
      },
    });
  }

  // Send password reset email
  static async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${Config.appUrl}/auth/reset-password?token=${token}`;
    
    await this.sendEmail({
      to: email,
      subject: 'Reset your password',
      template: 'password-reset',
      context: {
        resetUrl,
        expiresIn: '1 hour',
        supportEmail: Config.email.supportEmail,
      },
    });
  }

  // Send welcome email
  static async sendWelcomeEmail(email: string, name: string) {
    await this.sendEmail({
      to: email,
      subject: 'Welcome to Aetherial Platform!',
      template: 'welcome',
      context: {
        name,
        loginUrl: `${Config.appUrl}/auth/login`,
        supportEmail: Config.email.supportEmail,
      },
    });
  }

  // Send 2FA code
  static async send2FACode(email: string, code: string) {
    await this.sendEmail({
      to: email,
      subject: 'Your 2FA Verification Code',
      template: '2fa-code',
      context: {
        code,
        expiresIn: '5 minutes',
      },
    });
  }
}

export default EmailService;
