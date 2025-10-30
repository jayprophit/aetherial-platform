import { Router } from 'express';
import { authenticate, register, login, logout, refreshToken, verifyEmail, requestPasswordReset, resetPassword, enable2FA, verify2FA } from './controllers/auth.controller';
import { validate } from '../_core/middleware/validation';
import { 
  registerSchema, 
  loginSchema, 
  emailSchema, 
  resetPasswordSchema,
  verify2FASchema
} from './validators/auth.validators';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/verify-email', validate(emailSchema), verifyEmail);
router.post('/request-password-reset', validate(emailSchema), requestPasswordReset);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

// Protected routes
router.use(authenticate); // All routes below this will require authentication
router.post('/logout', logout);
router.post('/enable-2fa', enable2FA);
router.post('/verify-2fa', validate(verify2FASchema), verify2FA);

export default router;
