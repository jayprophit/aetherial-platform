import { databaseConfig } from './database';

const env = process.env.NODE_ENV || 'development';

export const Config = {
  env,
  isProduction: env === 'production',
  isDevelopment: env === 'development',
  isTest: env === 'test',
  
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  apiPrefix: process.env.API_PREFIX || '/api',
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // Database
  database: databaseConfig[env as keyof typeof databaseConfig],
  
  // Email
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'noreply@example.com',
      pass: process.env.EMAIL_PASS || 'your-email-password',
    },
    from: process.env.EMAIL_FROM || 'Aetherial Platform <noreply@example.com>',
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window
  },
  
  // 2FA
  mfa: {
    issuer: process.env.MFA_ISSUER || 'Aetherial Platform',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    window: 1,
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
} as const;

export type Config = typeof Config;
