import { eq, and } from 'drizzle-orm';
import { db } from '../../../server/_core/db';
import { users, sessions, refreshTokens, userRoles, roles } from '../../../server/_core/db/schema';
import { sign, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Config } from '../../../server/_core/config';
import { addDays, addMinutes } from 'date-fns';

const SALT_ROUNDS = 12;

export class AuthService {
  // User Registration
  static async register(userData: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) {
    return db.transaction(async (tx) => {
      // Check if user already exists
      const existingUser = await tx.query.users.findFirst({
        where: or(
          eq(users.email, userData.email),
          eq(users.username, userData.username)
        ),
      });

      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Hash password
      const hashedPassword = await hash(userData.password, SALT_ROUNDS);

      // Create user
      const [newUser] = await tx
        .insert(users)
        .values({
          email: userData.email,
          username: userData.username,
          passwordHash: hashedPassword,
          displayName: userData.displayName || userData.username,
          isVerified: false,
        })
        .returning();

      // Assign default 'user' role
      const [defaultRole] = await tx
        .select()
        .from(roles)
        .where(eq(roles.name, 'user'));

      if (defaultRole) {
        await tx.insert(userRoles).values({
          userId: newUser.id,
          roleId: defaultRole.id,
        });
      }

      // Generate verification token
      const verificationToken = uuidv4();
      const verificationExpires = addDays(new Date(), 1);

      await tx
        .update(users)
        .set({
          verificationToken,
          verificationTokenExpires: verificationExpires,
        })
        .where(eq(users.id, newUser.id));

      // TODO: Send verification email

      return {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        displayName: newUser.displayName,
        isVerified: newUser.isVerified,
      };
    });
  }

  // User Login
  static async login(credentials: { emailOrUsername: string; password: string }) {
    const user = await db.query.users.findFirst({
      where: or(
        eq(users.email, credentials.emailOrUsername),
        eq(users.username, credentials.emailOrUsername)
      ),
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await compare(credentials.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email address');
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        isVerified: user.isVerified,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  // Token Refresh
  static async refreshToken(refreshToken: string) {
    // Verify refresh token
    const tokenData = await this.verifyToken(refreshToken, 'refresh');
    if (!tokenData) {
      throw new Error('Invalid refresh token');
    }

    // Check if token exists and is not revoked
    const tokenRecord = await db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.token, refreshToken),
        eq(refreshTokens.revoked, false),
        gt(refreshTokens.expiresAt, new Date())
      ),
    });

    if (!tokenRecord) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
      tokenData.userId
    );

    // Revoke the old refresh token
    await db
      .update(refreshTokens)
      .set({ revoked: true, replacedByToken: newRefreshToken })
      .where(eq(refreshTokens.id, tokenRecord.id));

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  // Verify Email
  static async verifyEmail(token: string) {
    const user = await db.query.users.findFirst({
      where: and(
        eq(users.verificationToken, token),
        gt(users.verificationTokenExpires, new Date())
      ),
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      })
      .where(eq(users.id, user.id));

    return { success: true };
  }

  // Password Reset Request
  static async requestPasswordReset(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // Don't reveal if user exists for security
      return { success: true };
    }

    const resetToken = uuidv4();
    const resetExpires = addMinutes(new Date(), 30); // Token expires in 30 minutes

    await db
      .update(users)
      .set({
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      })
      .where(eq(users.id, user.id));

    // TODO: Send password reset email

    return { success: true };
  }

  // Reset Password
  static async resetPassword(token: string, newPassword: string) {
    const user = await db.query.users.findFirst({
      where: and(
        eq(users.passwordResetToken, token),
        gt(users.passwordResetExpires, new Date())
      ),
    });

    if (!user) {
      throw new Error('Invalid or expired password reset token');
    }

    const hashedPassword = await hash(newPassword, SALT_ROUNDS);

    await db
      .update(users)
      .set({
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      })
      .where(eq(users.id, user.id));

    // Revoke all user's refresh tokens
    await db
      .update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.userId, user.id));

    return { success: true };
  }

  // Logout
  static async logout(userId: number, refreshToken?: string) {
    if (refreshToken) {
      // Revoke specific refresh token
      await db
        .update(refreshTokens)
        .set({ revoked: true })
        .where(
          and(
            eq(refreshTokens.token, refreshToken),
            eq(refreshTokens.userId, userId)
          )
        );
    } else {
      // Revoke all user's refresh tokens
      await db
        .update(refreshTokens)
        .set({ revoked: true })
        .where(eq(refreshTokens.userId, userId));
    }

    return { success: true };
  }

  // Helper: Generate JWT tokens
  private static async generateTokens(userId: number) {
    const accessToken = sign(
      { userId, type: 'access' },
      Config.jwt.secret,
      { expiresIn: Config.jwt.accessExpiresIn }
    );

    const refreshToken = sign(
      { userId, type: 'refresh' },
      Config.jwt.secret,
      { expiresIn: Config.jwt.refreshExpiresIn }
    );

    // Store refresh token in database
    await db.insert(refreshTokens).values({
      userId,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() +
          parseInt(Config.jwt.refreshExpiresIn) * 1000
      ),
    });

    return { accessToken, refreshToken };
  }

  // Helper: Verify JWT token
  private static async verifyToken(token: string, type: 'access' | 'refresh') {
    try {
      const decoded = verify(token, Config.jwt.secret) as {
        userId: number;
        type: string;
        iat: number;
        exp: number;
      };

      if (decoded.type !== type) {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Get user by ID
  static async getUserById(userId: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        passwordHash: false,
        verificationToken: false,
        verificationTokenExpires: false,
        passwordResetToken: false,
        passwordResetExpires: false,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
