import { Request, Response, NextFunction } from 'express';
import { SocialAuthService } from '../services/social-auth-v2.service';
import { SocialProvider } from '../services/social-auth-v2.service';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Request validation schemas
const socialAuthCallbackSchema = z.object({
  provider: z.enum(['google', 'github', 'apple']),
  code: z.string().optional(),
  state: z.string().optional(),
  id_token: z.string().optional(),
  access_token: z.string().optional(),
});

const unlinkAccountSchema = z.object({
  provider: z.enum(['google', 'github', 'apple']),
});

const revokeSessionSchema = z.object({
  sessionId: z.string().uuid(),
});

export class SocialAuthController {
  /**
   * Handle OAuth callback from social providers
   */
  static async handleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider } = socialAuthCallbackSchema.parse({
        ...req.params,
        ...req.query,
        ...req.body,
      });

      // In a real implementation, you would exchange the authorization code for tokens here
      // and fetch the user profile from the provider's API
      const profile = await this.getUserProfile(provider, {
        code: req.query.code as string,
        idToken: req.query.id_token as string || req.body.id_token,
        accessToken: req.query.access_token as string || req.body.access_token,
      });

      const result = await SocialAuthService.findOrCreateUser(
        {
          ...profile,
          provider,
        },
        req.ip,
        req.get('user-agent') || ''
      );

      // Set cookies
      res.cookie('accessToken', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/refresh-token',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // Redirect to frontend with tokens in query params for client-side handling
      const redirectUrl = new URL(process.env.FRONTEND_URL || 'http://localhost:3000');
      redirectUrl.pathname = '/auth/callback';
      redirectUrl.searchParams.set('access_token', result.tokens.accessToken);
      redirectUrl.searchParams.set('refresh_token', result.tokens.refreshToken);
      redirectUrl.searchParams.set('session_id', result.sessionId);

      res.redirect(redirectUrl.toString());
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unlink a social account from the current user
   */
  static async unlinkAccount(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { provider } = unlinkAccountSchema.parse(req.params);
      await SocialAuthService.unlinkAccount(req.user.id, provider);
      
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: fromZodError(error).message,
        });
      }
      next(error);
    }
  }

  /**
   * Get the current user's linked social accounts
   */
  static async getLinkedAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const accounts = await SocialAuthService.getLinkedAccounts(req.user.id);
      res.json(accounts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Revoke a session
   */
  static async revokeSession(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { sessionId } = revokeSessionSchema.parse(req.params);
      const result = await SocialAuthService.revokeSession(sessionId, req.user.id);
      
      if (!result.success) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: fromZodError(error).message,
        });
      }
      next(error);
    }
  }

  /**
   * Get active sessions for the current user
   */
  static async getActiveSessions(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const sessions = await SocialAuthService.getActiveSessions(req.user.id);
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user profile from provider
   * In a real implementation, this would make API calls to the provider
   */
  private static async getUserProfile(
    provider: SocialProvider,
    params: { code?: string; idToken?: string; accessToken?: string }
  ) {
    // This is a simplified example. In a real implementation, you would:
    // 1. Exchange the authorization code for tokens
    // 2. Fetch the user profile from the provider's API
    // 3. Transform the profile into a consistent format

    // For demonstration purposes, we'll return a mock profile
    return {
      id: 'mock-user-id',
      email: 'user@example.com',
      emailVerified: true,
      name: 'Mock User',
      firstName: 'Mock',
      lastName: 'User',
      avatarUrl: 'https://example.com/avatar.jpg',
      provider,
      accessToken: params.accessToken || 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: new Date(Date.now() + 3600 * 1000),
      rawProfile: {},
    };
  }
}
