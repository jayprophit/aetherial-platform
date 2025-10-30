// Authentication configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// Email configuration
export const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'noreply@example.com',
    pass: process.env.EMAIL_PASS || 'your-email-password',
  },
  from: process.env.EMAIL_FROM || 'Aetherial Platform <noreply@example.com>',
};

// App URL for email links
export const APP_URL = process.env.APP_URL || 'http://localhost:3000';

// Password reset token expiration (in milliseconds)
export const PASSWORD_RESET_EXPIRATION = 60 * 60 * 1000; // 1 hour

// Rate limiting configuration
export const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};

// CORS configuration
export const CORS_OPTIONS = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Session configuration
export const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: 'strict' as const,
  },
};

// 2FA configuration
export const MFA_CONFIG = {
  issuer: 'Aetherial Platform',
  label: 'Aetherial',
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  window: 1,
};

// Password requirements
// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

// API rate limiting for authentication endpoints
export const AUTH_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: 'Too many login attempts, please try again later',
};

// Account lockout configuration
export const ACCOUNT_LOCKOUT = {
  maxAttempts: 5,
  lockoutTime: 15 * 60 * 1000, // 15 minutes
};
