import { Router } from 'express';
import {
  googleAuth,
  googleAuthCallback,
  githubAuth,
  githubAuthCallback,
  appleAuth,
  appleAuthCallback,
  authFailure,
  logout,
  refreshToken,
  getCurrentUser,
} from '../controllers/social-auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Social Auth Routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

router.get('/github', githubAuth);
router.get('/github/callback', githubAuthCallback);

router.get('/apple', appleAuth);
router.get('/apple/callback', appleAuthCallback);

// Auth failure route
router.get('/failure', authFailure);

// Protected routes
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticate, getCurrentUser);

export default router;
