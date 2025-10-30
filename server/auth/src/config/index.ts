import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
});

// Environment schema validation
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  API_URL: z.string().url().default('http://localhost:4000'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  
  // JWT
  JWT_SECRET: z.string().min(32).default('your-super-secret-jwt-key-change-in-production'),
  JWT_ACCESS_EXPIRATION_MINUTES: z.string().default('15'),
  JWT_REFRESH_EXPIRATION_DAYS: z.string().default('7'),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.string().default('10'),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.string().default('60'),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().default('noreply@aetherial.com'),
  
  // OAuth - Google
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // OAuth - GitHub
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  
  // OAuth - Apple
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_KEY_ID: z.string().optional(),
  APPLE_PRIVATE_KEY: z.string().optional(),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX: z.string().default('100'),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  // Session
  SESSION_SECRET: z.string().default('your-session-secret-change-in-production'),
  SESSION_COOKIE_MAX_AGE: z.string().default('86400000'), // 1 day
  
  // Security
  SECURE_COOKIES: z.string().default('false'),
  TRUST_PROXY: z.string().default('1'),
  
  // Logging
  LOG_LEVEL: z.string().default('info'),
  ENABLE_REQUEST_LOGGING: z.string().default('true'),
});

// Validate and parse environment variables
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(env.error.format(), null, 2));
  process.exit(1);
}

// Export validated environment variables
export const {
  NODE_ENV,
  PORT,
  API_URL,
  CLIENT_URL,
  JWT_SECRET,
  JWT_ACCESS_EXPIRATION_MINUTES,
  JWT_REFRESH_EXPIRATION_DAYS,
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  DATABASE_URL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  EMAIL_FROM,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  APPLE_CLIENT_ID,
  APPLE_TEAM_ID,
  APPLE_KEY_ID,
  APPLE_PRIVATE_KEY,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
  CORS_ORIGIN,
  SESSION_SECRET,
  SESSION_COOKIE_MAX_AGE,
  SECURE_COOKIES,
  TRUST_PROXY,
  LOG_LEVEL,
  ENABLE_REQUEST_LOGGING,
} = env.data;

// Application configuration
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_TEST = NODE_ENV === 'test';

// JWT configuration
export const JWT_CONFIG = {
  secret: JWT_SECRET,
  accessExpirationMinutes: parseInt(JWT_ACCESS_EXPIRATION_MINUTES, 10),
  refreshExpirationDays: parseInt(JWT_REFRESH_EXPIRATION_DAYS, 10),
  resetPasswordExpirationMinutes: parseInt(JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 10),
  verifyEmailExpirationMinutes: parseInt(JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 10),
  cookieOptions: {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? 'strict' as const : 'lax' as const,
    maxAge: parseInt(SESSION_COOKIE_MAX_AGE, 10),
  },
};

// OAuth configuration
export const OAUTH_CONFIG = {
  google: {
    clientId: GOOGLE_CLIENT_ID || '',
    clientSecret: GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${API_URL}/api/auth/google/callback`,
    scope: ['profile', 'email'],
  },
  github: {
    clientId: GITHUB_CLIENT_ID || '',
    clientSecret: GITHUB_CLIENT_SECRET || '',
    callbackURL: `${API_URL}/api/auth/github/callback`,
    scope: ['user:email'],
  },
  apple: {
    clientId: APPLE_CLIENT_ID || '',
    teamId: APPLE_TEAM_ID || '',
    keyId: APPLE_KEY_ID || '',
    privateKey: APPLE_PRIVATE_KEY || '',
    callbackURL: `${API_URL}/api/auth/apple/callback`,
    scope: ['name', 'email'],
  },
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  windowMs: parseInt(RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(RATE_LIMIT_MAX, 10),
  message: 'Too many requests, please try again later.',
};

// CORS configuration
export const CORS_OPTIONS = {
  origin: CORS_ORIGIN.split(',').map(origin => origin.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // 10 minutes
};

// Session configuration
export const SESSION_CONFIG = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: IS_PRODUCTION,
    httpOnly: true,
    sameSite: IS_PRODUCTION ? 'strict' as const : 'lax' as const,
    maxAge: parseInt(SESSION_COOKIE_MAX_AGE, 10),
  },
};

// Email configuration
export const EMAIL_CONFIG = {
  host: SMTP_HOST,
  port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 587,
  auth: SMTP_USERNAME && SMTP_PASSWORD 
    ? { user: SMTP_USERNAME, pass: SMTP_PASSWORD }
    : undefined,
  from: EMAIL_FROM,
  secure: IS_PRODUCTION,
};

// Security configuration
export const SECURITY_CONFIG = {
  secureCookies: SECURE_COOKIES === 'true',
  trustProxy: TRUST_PROXY === 'true',
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  accountLockout: {
    maxAttempts: 5,
    lockoutTime: 15 * 60 * 1000, // 15 minutes
  },
  csrf: {
    cookie: {
      key: '_csrf',
      secure: IS_PRODUCTION,
      httpOnly: true,
      sameSite: 'strict' as const,
    },
  },
};

// Logging configuration
export const LOGGING_CONFIG = {
  level: LOG_LEVEL,
  enableRequestLogging: ENABLE_REQUEST_LOGGING === 'true',
  file: {
    filename: 'logs/combined.log',
    errorFilename: 'logs/error.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
  },
  console: {
    colorize: true,
    timestamp: true,
  },
};

// Export all configurations
export default {
  env: NODE_ENV,
  isProduction: IS_PRODUCTION,
  isDevelopment: IS_DEVELOPMENT,
  isTest: IS_TEST,
  port: PORT,
  apiUrl: API_URL,
  clientUrl: CLIENT_URL,
  jwt: JWT_CONFIG,
  oauth: OAUTH_CONFIG,
  rateLimit: RATE_LIMIT_CONFIG,
  cors: CORS_OPTIONS,
  session: SESSION_CONFIG,
  email: EMAIL_CONFIG,
  security: SECURITY_CONFIG,
  logging: LOGGING_CONFIG,
};
