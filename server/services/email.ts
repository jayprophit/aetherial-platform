import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

// Create transporter
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransporter(EMAIL_CONFIG);
  }
  return transporter;
}

// Email templates
const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to AETHERIAL!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to AETHERIAL!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for joining AETHERIAL - the ultimate unified platform for social networking, e-commerce, e-learning, and more!</p>
              <p>Your account has been successfully created. You can now:</p>
              <ul>
                <li>Connect with friends and join communities</li>
                <li>Buy and sell products in our marketplace</li>
                <li>Enroll in courses and learn new skills</li>
                <li>Find your dream job</li>
                <li>And much more!</li>
              </ul>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5000'}" class="button">Get Started</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The AETHERIAL Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 AETHERIAL. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  orderConfirmation: (name: string, orderId: number, total: number, items: any[]) => ({
    subject: `Order Confirmation #${orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .order-item { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #10b981; }
            .total { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; font-size: 18px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Order Confirmed!</h1>
              <p>Order #${orderId}</p>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for your order! We've received your payment and are processing your order.</p>
              
              <h3>Order Details:</h3>
              ${items.map(item => `
                <div class="order-item">
                  <strong>${item.name}</strong><br>
                  Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}
                </div>
              `).join('')}
              
              <div class="total">
                Total: $${total.toFixed(2)}
              </div>
              
              <p>You'll receive another email when your order ships.</p>
              <p>Best regards,<br>The AETHERIAL Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 AETHERIAL. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordReset: (name: string, resetToken: string) => ({
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}" class="button">Reset Password</a>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                This link will expire in 1 hour. If you didn't request this reset, please ignore this email and your password will remain unchanged.
              </div>
              <p>Best regards,<br>The AETHERIAL Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 AETHERIAL. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  courseEnrollment: (name: string, courseName: string, courseId: number) => ({
    subject: `Welcome to ${courseName}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Course Enrollment Confirmed!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Congratulations! You've successfully enrolled in <strong>${courseName}</strong>.</p>
              <p>You can now access all course materials, lessons, and resources.</p>
              <a href="${process.env.CLIENT_URL}/courses/${courseId}" class="button">Start Learning</a>
              <p>Happy learning!<br>The AETHERIAL Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 AETHERIAL. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  notification: (name: string, title: string, message: string, link?: string) => ({
    subject: title,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #8b5cf6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title}</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>${message}</p>
              ${link ? `<a href="${process.env.CLIENT_URL}${link}" class="button">View Details</a>` : ''}
              <p>Best regards,<br>The AETHERIAL Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 AETHERIAL. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

// Email sending functions
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  try {
    const template = emailTemplates.welcome(name);
    await getTransporter().sendMail({
      from: `"AETHERIAL" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderId: number,
  total: number,
  items: any[]
): Promise<boolean> {
  try {
    const template = emailTemplates.orderConfirmation(name, orderId, total, items);
    await getTransporter().sendMail({
      from: `"AETHERIAL" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`Order confirmation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<boolean> {
  try {
    const template = emailTemplates.passwordReset(name, resetToken);
    await getTransporter().sendMail({
      from: `"AETHERIAL" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

export async function sendCourseEnrollmentEmail(
  email: string,
  name: string,
  courseName: string,
  courseId: number
): Promise<boolean> {
  try {
    const template = emailTemplates.courseEnrollment(name, courseName, courseId);
    await getTransporter().sendMail({
      from: `"AETHERIAL" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`Course enrollment email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send course enrollment email:', error);
    return false;
  }
}

export async function sendNotificationEmail(
  email: string,
  name: string,
  title: string,
  message: string,
  link?: string
): Promise<boolean> {
  try {
    const template = emailTemplates.notification(name, title, message, link);
    await getTransporter().sendMail({
      from: `"AETHERIAL" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`Notification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send notification email:', error);
    return false;
  }
}

export default {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendCourseEnrollmentEmail,
  sendNotificationEmail,
};

