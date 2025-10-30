import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { Config } from '../config';
import logger from '../utils/logger';

// Create Redis client for distributed rate limiting
const redisClient = createClient({
  url: Config.redis.url,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        logger.error('Max Redis reconnection attempts reached');
        return new Error('Max reconnection attempts reached');
      }
      // Exponential backoff: 100ms, 200ms, 400ms
      return Math.min(retries * 100, 400);
    },
  },
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

// Initialize Redis connection
const initRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Connected to Redis for rate limiting');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    // Fallback to in-memory store if Redis is not available
    return null;
  }
};

// Initialize Redis connection immediately
const redisStore = initRedis().then(() => 
  new RedisStore({
    // @ts-expect-error - Known issue with Redis client types
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: 'rate-limit:',
  })
).catch(() => null);

// Rate limit configuration
const defaultRateLimit = rateLimit({
  // Use Redis store if available, otherwise in-memory
  store: redisStore,
  
  // 100 requests per window (15 minutes by default)
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: async (req) => {
    // Higher limits for authenticated users
    if (req.user) return 300; // 300 requests per 15 minutes
    return 100; // 100 requests per 15 minutes for unauthenticated users
  },
  
  // Skip rate limiting for certain paths
  skip: (req) => {
    // Skip health checks and static files
    const skipPaths = ['/health', '/favicon.ico', '/robots.txt'];
    if (skipPaths.includes(req.path)) return true;
    
    // Skip rate limiting for trusted IPs (e.g., your own services)
    const trustedIps = ['127.0.0.1', '::1', '10.0.0.0/8'];
    if (trustedIps.includes(req.ip)) return true;
    
    return false;
  },
  
  // Custom message and headers
  message: {
    success: false,
    error: 'Too many requests',
    message: 'You have exceeded the rate limit. Please try again later.',
  },
  
  // Custom handler
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      user: req.user?.id || 'anonymous',
    });
    
    res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: 'You have exceeded the rate limit. Please try again later.',
    });
  },
});

// Specific rate limits for sensitive endpoints
const authRateLimit = rateLimit({
  store: redisStore,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: 'Too many login attempts',
    message: 'Too many login attempts from this IP. Please try again later.',
  },
});

// Rate limiter for public APIs
const publicApiRateLimit = rateLimit({
  store: redisStore,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // 1000 requests per hour
  message: {
    success: false,
    error: 'API rate limit exceeded',
    message: 'You have exceeded the API rate limit. Please try again later.',
  },
});

// Rate limiter for account creation
const createAccountRateLimit = rateLimit({
  store: redisStore,
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // 5 accounts per day per IP
  message: {
    success: false,
    error: 'Account creation limit exceeded',
    message: 'Too many accounts created from this IP. Please try again tomorrow.',
  },
});

// Rate limiter for password reset
const passwordResetRateLimit = rateLimit({
  store: redisStore,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 password reset attempts per hour
  message: {
    success: false,
    error: 'Too many password reset attempts',
    message: 'Too many password reset attempts. Please try again later.',
  },
});

// Apply rate limiting based on route
const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Apply stricter rate limits to auth endpoints
  if (req.path.startsWith('/auth/login') || req.path.startsWith('/auth/refresh-token')) {
    return authRateLimit(req, res, next);
  }
  
  // Apply account creation limits
  if (req.path === '/auth/register') {
    return createAccountRateLimit(req, res, next);
  }
  
  // Apply password reset limits
  if (req.path === '/auth/forgot-password' || req.path === '/auth/reset-password') {
    return passwordResetRateLimit(req, res, next);
  }
  
  // Apply public API rate limits
  if (req.path.startsWith('/api/')) {
    return publicApiRateLimit(req, res, next);
  }
  
  // Default rate limit for all other routes
  return defaultRateLimit(req, res, next);
};

// Export rate limiters for specific use cases
export {
  rateLimiter as default,
  authRateLimit,
  publicApiRateLimit,
  createAccountRateLimit,
  passwordResetRateLimit,
};
