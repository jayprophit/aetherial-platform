import { Router } from 'express';
import { SocialAuthController } from '../controllers/social-auth-v2.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

// OAuth callback endpoints
router.get(
  '/:provider/callback',
  validateRequest({
    params: z.object({
      provider: z.enum(['google', 'github', 'apple']),
    }),
    query: z.object({
      code: z.string().optional(),
      state: z.string().optional(),
      id_token: z.string().optional(),
      access_token: z.string().optional(),
      error: z.string().optional(),
      error_description: z.string().optional(),
    }),
  }),
  SocialAuthController.handleCallback
);

// Link/Unlink social accounts (requires authentication)
router.get(
  '/accounts',
  authenticate,
  SocialAuthController.getLinkedAccounts
);

router.delete(
  '/accounts/:provider',
  authenticate,
  validateRequest({
    params: z.object({
      provider: z.enum(['google', 'github', 'apple']),
    }),
  }),
  SocialAuthController.unlinkAccount
);

// Session management (requires authentication)
router.get(
  '/sessions',
  authenticate,
  SocialAuthController.getActiveSessions
);

delete(
  '/sessions/:sessionId',
  authenticate,
  validateRequest({
    params: z.object({
      sessionId: z.string().uuid(),
    }),
  }),
  SocialAuthController.revokeSession
);

export default router;
