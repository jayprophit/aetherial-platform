import { Request } from 'express';

// Request/Response types
export interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    username: string;
    displayName?: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
    code?: string; // For 2FA
  };
}

export interface RefreshTokenRequest extends Request {
  cookies: {
    refreshToken?: string;
  };
}

export interface VerifyEmailRequest extends Request {
  body: {
    token: string;
  };
}

export interface RequestPasswordResetRequest extends Request {
  body: {
    email: string;
  };
}

export interface ResetPasswordRequest extends Request {
  body: {
    token: string;
    newPassword: string;
  };
}

export interface Enable2FARequest extends Request {
  user: {
    id: number;
  };
}

export interface Verify2FARequest extends Request {
  body: {
    code: string;
  };
  user: {
    id: number;
  };
}

// Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends ApiResponse {
  user?: {
    id: number;
    email: string;
    username: string;
    displayName?: string;
    isVerified: boolean;
    mfaEnabled: boolean;
  };
  accessToken?: string;
  refreshToken?: string;
  requires2FA?: boolean;
}

export interface Enable2FAResponse extends ApiResponse {
  secret?: string;
  qrCodeUrl?: string;
  manualEntryCode?: string;
}

// JWT Payload
export interface JwtPayload {
  userId: number;
  email: string;
  username: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

// Error types
export interface ApiError extends Error {
  statusCode: number;
  isOperational?: boolean;
  code?: string | number;
}

// Middleware types
export interface RequestWithUser extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
    isVerified: boolean;
    mfaEnabled: boolean;
  };
}

// Rate limiting
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

// Session types
export interface SessionData {
  userId: number;
  email: string;
  role: string;
  createdAt: Date;
  lastActive: Date;
  userAgent?: string;
  ipAddress?: string;
}
