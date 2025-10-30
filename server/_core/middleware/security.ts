import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { rateLimit as redisRateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { Config } from '../config';
import logger from '../utils/logger';

// Initialize Redis client for distributed rate limiting
const redisClient = createClient({
  url: Config.redis.url,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        logger.error('Max Redis reconnection attempts reached');
        return new Error('Max reconnection attempts reached');
      }
      return Math.min(retries * 100, 400); // Exponential backoff
    },
  },
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

// Security headers middleware
export const securityHeaders = [
  // Prevent clickjacking
  (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'"); // Modern alternative to X-Frame-Options
    next();
  },

  // Enable CORS with specific origins
  (req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = Config.security.allowedOrigins;
    const origin = req.headers.origin;
    
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
    }
    
    next();
  },

  // Security headers using helmet
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", Config.api.baseUrl],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 63072000, // 2 years in seconds
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true,
    frameguard: { action: 'deny' },
  }),

  // Prevent MIME type sniffing
  (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  },

  // Prevent XSS attacks
  (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  },
];

// Rate limiting for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many login attempts from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - Known issue with Redis client types
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: 'auth-rate-limit:',
  }),
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      user: req.user?.id || 'anonymous',
    });
    
    res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: 'Too many login attempts. Please try again later.',
    });
  },
});

// Request validation middleware
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        messages: errors,
      });
    }
    
    next();
  };
};

// CSRF protection (for non-API routes)
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for API routes and GET/HEAD/OPTIONS requests
  if (req.path.startsWith('/api/') || ['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Verify CSRF token for other requests
  const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
  
  if (!csrfToken || csrfToken !== req.csrfToken()) {
    return res.status(403).json({
      success: false,
      error: 'Invalid CSRF Token',
      message: 'Invalid or missing CSRF token',
    });
  }
  
  next();
};

// Security middleware for production
export const productionSecurity = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    // Enable HSTS in production
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    
    // Prevent content type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Disable client-side caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  
  next();
};

// Export all security middlewares
export const securityMiddleware = [
  ...securityHeaders,
  csrfProtection,
  productionSecurity,
];

export default securityMiddleware;
