// Export all types
export * from './user.types';
export * from './auth.types';

// Global type declarations
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_SSL: string;
      
      // JWT
      JWT_SECRET: string;
      JWT_ACCESS_EXPIRES_IN: string;
      JWT_REFRESH_EXPIRES_IN: string;
      
      // Email
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;
      EMAIL_FROM: string;
      
      // App
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      APP_URL: string;
      
      // CORS
      CORS_ORIGIN: string;
      
      // Session
      SESSION_SECRET: string;
      
      // Rate limiting
      RATE_LIMIT_WINDOW_MS: string;
      RATE_LIMIT_MAX: string;
      
      // 2FA
      MFA_ISSUER: string;
    }
  }
}

// Extend Express types
declare module 'express' {
  interface Request {
    user?: import('./user.types').UserPublic;
    requestId?: string;
  }
}

// Extend JWT payload
declare module 'jsonwebtoken' {
  interface JwtPayload {
    userId: number;
    email: string;
    username: string;
    type: 'access' | 'refresh';
  }
}
