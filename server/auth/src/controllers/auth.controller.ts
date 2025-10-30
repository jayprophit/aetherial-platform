import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { db } from '../../_core/db/connection';
import { users } from '../../_core/db/schema';
import { generateTokens, verifyToken, hashToken } from '../../_core/utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../_core/utils/email';
import { generateSecret, verify as verify2FACode } from 'speakeasy';
import QRCode from 'qrcode';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, displayName } = req.body;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { or, eq }) => or(
        eq(users.email, email),
        eq(users.username, username)
      )
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = uuidv4();

    // Create user
    const [user] = await db.insert(users).values({
      email,
      username,
      displayName: displayName || username,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Return user and access token
    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled
      },
      accessToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during registration',
      error: error.message 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, code } = req.body;

    // Find user by email
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email)
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // If 2FA is enabled, verify the code
    if (user.mfaEnabled && user.mfaSecret) {
      if (!code) {
        return res.status(202).json({
          success: true,
          requires2FA: true,
          message: '2FA verification required'
        });
      }

      const isCodeValid = verify2FACode({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: code,
        window: 1
      });

      if (!isCodeValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid 2FA code'
        });
      }
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Return user and access token
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled
      },
      accessToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during login',
      error: error.message 
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Invalidate the refresh token in the database if needed
    // (you would need to implement this in your token blacklist)

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during logout',
      error: error.message 
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided'
      });
    }

    // Verify the refresh token
    const decoded = verifyToken(refreshToken, 'refresh');
    
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if user exists
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, decoded.userId)
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Set new refresh token in HTTP-only cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Return new access token
    res.json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error refreshing token',
      error: error.message 
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Find user by verification token
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.verificationToken, token)
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user as verified
    await db.update(users)
      .set({ 
        isVerified: true,
        verificationToken: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying email',
      error: error.message 
    });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email)
    });

    if (!user) {
      // Don't reveal that the email doesn't exist
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to user
    await db.update(users)
      .set({ 
        resetToken,
        resetTokenExpiry,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error requesting password reset',
      error: error.message 
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by reset token
    const user = await db.query.users.findFirst({
      where: (users, { eq, and, gt }) => and(
        eq(users.resetToken, token),
        gt(users.resetTokenExpiry, new Date())
      )
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user's password and clear reset token
    await db.update(users)
      .set({ 
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error resetting password',
      error: error.message 
    });
  }
};

export const enable2FA = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Generate a secret for the user
    const secret = generateSecret({
      name: 'Aetherial Platform',
      issuer: 'Aetherial'
    });

    // Generate a QR code URL for the authenticator app
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Save the secret to the user's account (temporarily, until verified)
    await db.update(users)
      .set({ 
        mfaSecret: secret.base32,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      secret: secret.base32,
      qrCodeUrl,
      manualEntryCode: secret.otpauth_url
    });
  } catch (error) {
    console.error('2FA enable error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error enabling 2FA',
      error: error.message 
    });
  }
};

export const verify2FA = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const userId = (req as any).user.id;

    // Get user with MFA secret
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId)
    });

    if (!user || !user.mfaSecret) {
      return res.status(400).json({
        success: false,
        message: '2FA is not set up for this account'
      });
    }

    // Verify the code
    const isCodeValid = verify2FACode({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!isCodeValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA code'
      });
    }

    // Enable 2FA for the user
    await db.update(users)
      .set({ 
        mfaEnabled: true,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      message: '2FA enabled successfully'
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying 2FA',
      error: error.message 
    });
  }
};

export const authenticate = async (req: Request, res: Response, next: Function) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    // Verify token
    const decoded = verifyToken(token, 'access');
    
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, decoded.userId)
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request object
    (req as any).user = {
      id: user.id,
      email: user.email,
      username: user.username,
      isVerified: user.isVerified,
      mfaEnabled: user.mfaEnabled
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error authenticating user',
      error: error.message 
    });
  }
};
