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
import passport from 'passport';
import { validateRequest } from './middleware/validate-request';
import { 
  authenticate, 
  authorize, 
  authRateLimiter, 
  optionalAuth 
} from './middleware/auth.middleware';
import { ROLES } from '../shared/constants';

const router = Router();

// Rate limiting middleware for auth endpoints
const authLimiter = authRateLimiter;

// ========================
// Authentication Routes
// ========================
router.post(
  '/register',
  [
    checkSchema(registerSchema),
  ],
  validateRequest,
  rateLimiter({ windowMs: 3600000, max: 5 }), // 5 requests per hour
  register
);

router.post(
  '/login', 
  [
    checkSchema(loginSchema),
  ],
  validateRequest,
  authLimiter,
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

// ========================
// Token Management
// ========================
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);

// ========================
// Email Verification
// ========================
router.get('/verify-email/:token', verifyEmail);
router.post(
  '/request-verification',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  validateRequest,
  authLimiter,
  requestEmailVerification
);

// ========================
// Password Management
// ========================
router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  validateRequest,
  authLimiter,
  requestPasswordReset
);

router.post(
  '/reset-password/:token',
  [
    body('password').isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  validateRequest,
  resetPassword
);

router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  validateRequest,
  changePassword
);

// ========================
// Social Authentication
// ========================
const socialAuthCallback = (provider: string) => 
  passport.authenticate(provider, { 
    failureRedirect: '/auth/failure',
    session: false 
  });

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', socialAuthCallback('google'), googleAuthCallback);

// GitHub OAuth
router.get('/github', githubAuth);
router.get('/github/callback', socialAuthCallback('github'), githubAuthCallback);

// Apple OAuth
router.get('/apple', appleAuth);
router.get('/apple/callback', socialAuthCallback('apple'), appleAuthCallback);

// Social account linking
router.post(
  '/link/:provider', 
  authenticate, 
  [
    body('accessToken').notEmpty().withMessage('Access token is required'),
    body('userId').optional().isString().withMessage('User ID must be a string'),
  ],
  validateRequest,
  linkSocialAccount
);

router.delete(
  '/unlink/:provider', 
  authenticate, 
  unlinkSocialAccount
);

// Auth failure route
router.get('/failure', authFailure);

// ========================
// User Management
// ========================
router.get('/me', authenticate, getProfile);

router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().normalizeEmail(),
    body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  ],
  validateRequest,
  updateProfile
);

router.delete(
  '/account',
  authenticate,
  [
    body('password').notEmpty().withMessage('Password is required for account deletion'),
  ],
  validateRequest,
  logout
);

// ========================
// 2FA Routes
// ========================
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
