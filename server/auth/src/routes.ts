import { Router } from 'express';
import { 
  authenticate, 
  register, 
  login, 
  logout, 
  refreshToken, 
  verifyEmail, 
  requestPasswordReset, 
  resetPassword, 
  enable2FA, 
  verify2FA,
  changePassword,
  updateProfile,
  getProfile,
  disable2FA,
  requestEmailVerification
} from './controllers/auth.controller';
import { validate } from '../_core/middleware/validation';
import { 
  registerSchema, 
  loginSchema, 
  emailSchema, 
  resetPasswordSchema,
  verify2FASchema,
  changePasswordSchema,
  updateProfileSchema,
  refreshTokenSchema
} from './validators/auth.validators';
import { rateLimiter } from '../_core/middleware/rate-limiter';
import { checkSchema } from 'express-validator';

const router = Router();

// Apply rate limiting to authentication endpoints
const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Public routes
router.post(
  '/register', 
  rateLimiter({ windowMs: 3600000, max: 5 }), // 5 requests per hour
  validate(registerSchema), 
  register
);

router.post(
  '/login', 
  authRateLimiter,
  validate(loginSchema), 
  login
);

router.post(
  '/refresh-token', 
  validate(refreshTokenSchema), 
  refreshToken
);

router.post(
  '/verify-email', 
  validate(emailSchema), 
  verifyEmail
);

router.post(
  '/request-email-verification',
  rateLimiter({ windowMs: 60000, max: 1 }), // 1 request per minute
  validate(emailSchema),
  requestEmailVerification
);

router.post(
  '/request-password-reset', 
  rateLimiter({ windowMs: 60000, max: 3 }), // 3 requests per minute
  validate(emailSchema), 
  requestPasswordReset
);

router.post(
  '/reset-password', 
  validate(resetPasswordSchema), 
  resetPassword
);

// Protected routes (require authentication)
router.use(authenticate);

router.post('/logout', logout);

// 2FA routes
router.post('/enable-2fa', enable2FA);
router.post('/disable-2fa', disable2FA);
router.post(
  '/verify-2fa', 
  validate(verify2FASchema), 
  verify2FA
);

// Profile management
router.get('/profile', getProfile);
router.put(
  '/profile', 
  validate(updateProfileSchema), 
  updateProfile
);

// Password management
router.post(
  '/change-password',
  validate(changePasswordSchema),
  changePassword
);

// Error handling middleware
router.use((err: any, req: any, res: any, next: any) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.details?.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message
      })) || []
    });
  }
  
  // Handle other types of errors
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

export default router;
