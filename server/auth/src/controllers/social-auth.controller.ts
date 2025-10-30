import { Request, Response } from 'express';
import passport from 'passport';
import { generateAuthTokens } from '../services/social-auth.service';
import { prisma } from '../../_core/db';
import { v4 as uuidv4 } from 'uuid';
import { JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';

type SocialProvider = 'google' | 'github' | 'apple';

// Helper to handle successful authentication
const handleSocialAuthSuccess = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateAuthTokens(user.id);

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Set secure httpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh-token',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect to the frontend with tokens in the URL hash
    const redirectUrl = new URL(`${process.env.CLIENT_URL}/auth/callback`);
    redirectUrl.searchParams.set('access_token', accessToken);
    redirectUrl.searchParams.set('refresh_token', refreshToken);
    
    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Social auth error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};

// Helper to handle authentication errors
const handleSocialAuthError = (req: Request, res: Response) => {
  const error = req.query.error || 'authentication_failed';
  res.redirect(`${process.env.CLIENT_URL}/login?error=${error}`);
};

// Social authentication endpoints
export const socialAuth = (provider: SocialProvider) => {
  return passport.authenticate(provider, {
    scope: ['profile', 'email'],
    session: false,
  });
};

export const socialAuthCallback = (provider: SocialProvider) => {
  return passport.authenticate(provider, {
    failureRedirect: '/api/auth/failure',
    session: false,
  }, (req, res) => {
    handleSocialAuthSuccess(req, res);
  });
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
    
    // Delete the refresh token from the database
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to log out' });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }
    
    // Verify the refresh token
    const payload = jwt.verify(refreshToken, JWT_SECRET) as { userId: string; tokenId: string };
    
    // Check if the token exists in the database
    const token = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    
    if (!token || token.userId !== payload.userId) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateAuthTokens(payload.userId);
    
    // Update the refresh token in the database
    await prisma.refreshToken.update({
      where: { id: token.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
    
    // Set new tokens as cookies
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh-token',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Export individual provider handlers
export const googleAuth = socialAuth('google');
export const googleAuthCallback = socialAuthCallback('google');

export const githubAuth = socialAuth('github');
export const githubAuthCallback = socialAuthCallback('github');

export const appleAuth = socialAuth('apple');
export const appleAuthCallback = socialAuthCallback('apple');

export const authFailure = (req: Request, res: Response) => {
  handleSocialAuthError(req, res);
};
