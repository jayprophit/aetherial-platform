import rateLimit from 'express-rate-limit';

// Basic rate limiting for all API requests
export const apiLimiter = rateLimit({
	windicatorMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
});

// Stricter rate limiting for sensitive endpoints like login and register
export const authLimiter = rateLimit({
	windicatorMs: 5 * 60 * 1000, // 5 minutes
	max: 5, // Limit each IP to 5 requests per `window`
    standardHeaders: true,
	legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts from this IP, please try again after 5 minutes' },
});

