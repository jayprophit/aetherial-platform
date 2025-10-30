import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, COOKIE_OPTIONS } from '../config';
import { AuthRequest } from '../middleware/auth.middleware';

export interface TokenPayload {
  userId: string;
  sessionId?: string;
  [key: string]: any;
}

/**
 * Generate JWT access and refresh tokens
 */
export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(
    { ...payload, type: 'access' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { 
      ...payload, 
      type: 'refresh',
      tokenVersion: 0 // Increment this to invalidate all refresh tokens
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Set authentication cookies on the response
 */
export const setAuthCookies = (
  res: Response,
  tokens: { accessToken: string; refreshToken: string }
) => {
  const { accessToken, refreshToken } = tokens;
  
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Clear authentication cookies
 */
export const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', COOKIE_OPTIONS);
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.clearCookie('session', COOKIE_OPTIONS);
};

/**
 * Get the current user from the request
 */
export const getCurrentUser = (req: AuthRequest) => {
  return req.user || null;
};

/**
 * Create a CSRF token
 */
export const generateCsrfToken = (req: AuthRequest) => {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
  
  return jwt.sign(
    { userId: req.user.id, csrf: true },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Verify CSRF token
 */
export const verifyCsrfToken = (token: string, userId: string): boolean => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; csrf: boolean };
    return decoded.userId === userId && decoded.csrf === true;
  } catch (error) {
    return false;
  }
};

/**
 * Generate a password reset token
 */
export const generatePasswordResetToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email, purpose: 'password_reset' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Generate an email verification token
 */
export const generateEmailVerificationToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email, purpose: 'email_verification' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};
