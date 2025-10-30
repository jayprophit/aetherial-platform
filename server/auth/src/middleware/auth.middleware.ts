import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { JWT_SECRET, ACCOUNT_LOCKOUT, AUTH_RATE_LIMIT } from '../config';
import { prisma } from '../../_core/db';

export interface AuthRequest extends Request {
  user?: any;
  token?: string;
}

// Rate limiting for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: AUTH_RATE_LIMIT.windowMs,
  max: AUTH_RATE_LIMIT.max,
  message: AUTH_RATE_LIMIT.message,
  keyGenerator: (req) => {
    return req.ip; // Use IP address for rate limiting
  },
  skip: (req) => {
    // Skip rate limiting for certain paths or in development
    return process.env.NODE_ENV === 'development' || 
           req.path.includes('/health') ||
           req.path.includes('/metrics');
  },
});

// Main authentication middleware
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check for token in Authorization header or cookies
    let token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        loginAttempts: true,
        lockUntil: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(423).json({ 
        error: 'Account locked', 
        retryAfter: Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000) 
      });
    }

    // Reset login attempts if lock has expired
    if (user.lockUntil && user.lockUntil <= new Date()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          loginAttempts: 0,
          lockUntil: null,
        },
      });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    req.token = token;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Role-based authorization
export const authorize = (roles: string | string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRoles = Array.isArray(req.user?.role) ? req.user.role : [req.user?.role];
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    if (requiredRoles.length > 0 && !requiredRoles.some(role => userRoles.includes(role))) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        requiredRoles,
        userRole: req.user?.role,
      });
    }
    next();
  };
};

// Check if user is authenticated (non-blocking)
export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;
    
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      if (user) {
        req.user = user;
        req.token = token;
      }
    }
  } catch (error) {
    // Ignore token errors for optional auth
  }
  next();
};

// Check if user is the owner of the resource
export const isOwner = (resourceOwnerIdField = 'userId') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const resourceOwnerId = req.params[resourceOwnerIdField] || req.body[resourceOwnerIdField];
    
    if (req.user.id !== resourceOwnerId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'You do not have permission to access this resource',
      });
    }
    
    next();
  };
};

// Check if user has a specific permission
export const hasPermission = (permission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // This is a simplified example - in a real app, you'd check against the user's permissions
    const hasPermission = req.user?.permissions?.includes(permission);
    
    if (!hasPermission && req.user?.role !== 'admin') {
      return res.status(403).json({ 
        error: `Missing required permission: ${permission}`,
      });
    }
    
    next();
  };
};
