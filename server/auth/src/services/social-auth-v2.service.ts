import { eq, and } from 'drizzle-orm';
import { db } from '../../../server/_core/db';
import { users, socialAccounts, refreshTokens, sessions } from '../../../server/_core/db/schema';
import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';
import { Config } from '../../../server/_core/config';

type SocialProvider = 'google' | 'github' | 'apple';

interface SocialProfile {
  id: string;
  email: string;
  emailVerified?: boolean;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  provider: SocialProvider;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  rawProfile?: any;
}

export class SocialAuthService {
  static async findOrCreateUser(profile: SocialProfile, ipAddress?: string, userAgent?: string) {
    return db.transaction(async (tx) => {
      // Check if social account exists
      const existingAccount = await tx.query.socialAccounts.findFirst({
        where: and(
          eq(socialAccounts.provider, profile.provider),
          eq(socialAccounts.providerId, profile.id)
        ),
      });

      let user = existingAccount 
        ? await tx.query.users.findFirst({
            where: eq(users.id, existingAccount.userId)
          })
        : null;

      // If user not found by social account, try to find by email
      if (!user && profile.email) {
        user = await tx.query.users.findFirst({
          where: eq(users.email, profile.email)
        });
      }

      // Create new user if not exists
      if (!user) {
        const [newUser] = await tx
          .insert(users)
          .values({
            email: profile.email,
            emailVerified: profile.emailVerified || false,
            firstName: profile.firstName || profile.name?.split(' ')[0] || 'User',
            lastName: profile.lastName || profile.name?.split(' ').slice(1).join(' '),
            avatarUrl: profile.avatarUrl,
            lastLoginAt: new Date(),
            lastIp: ipAddress,
          })
          .returning();
        
        user = newUser;
      } else {
        // Update last login
        await tx
          .update(users)
          .set({
            lastLoginAt: new Date(),
            lastIp: ipAddress,
            ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
            ...(profile.firstName ? { firstName: profile.firstName } : {}),
            ...(profile.lastName ? { lastName: profile.lastName } : {}),
          })
          .where(eq(users.id, user.id));
      }

      // Create or update social account
      if (existingAccount) {
        await tx
          .update(socialAccounts)
          .set({
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
            expiresAt: profile.expiresAt,
            updatedAt: new Date(),
          })
          .where(eq(socialAccounts.id, existingAccount.id));
      } else {
        await tx.insert(socialAccounts).values({
          userId: user.id,
          provider: profile.provider,
          providerId: profile.id,
          email: profile.email,
          name: profile.name,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.avatarUrl,
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
          tokenType: 'bearer',
          expiresAt: profile.expiresAt,
          rawUserInfo: profile.rawProfile ? JSON.stringify(profile.rawProfile) : null,
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(user.id);
      
      // Create session
      const [session] = await tx
        .insert(sessions)
        .values({
          userId: user.id,
          userAgent: userAgent || '',
          ipAddress: ipAddress || '',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })
        .returning();

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          emailVerified: user.emailVerified,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
        sessionId: session.id,
      };
    });
  }

  static async generateTokens(userId: string) {
    const accessToken = sign(
      { userId, type: 'access' },
      Config.jwt.secret,
      { expiresIn: Config.jwt.accessExpirationMinutes * 60 }
    );

    const refreshToken = sign(
      { 
        userId, 
        type: 'refresh',
        tokenId: uuidv4(),
      },
      Config.jwt.secret,
      { expiresIn: Config.jwt.refreshExpirationDays * 24 * 60 * 60 }
    );

    // Store refresh token in database
    await db.insert(refreshTokens).values({
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + Config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }

  static async unlinkAccount(userId: string, provider: SocialProvider) {
    const [deletedAccount] = await db
      .delete(socialAccounts)
      .where(
        and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.provider, provider)
        )
      )
      .returning();

    return { success: !!deletedAccount };
  }

  static async getLinkedAccounts(userId: string) {
    return db.query.socialAccounts.findMany({
      where: eq(socialAccounts.userId, userId),
      columns: {
        id: true,
        provider: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async revokeSession(sessionId: string, userId: string) {
    const [session] = await db
      .update(sessions)
      .set({ revoked: true, revokedAt: new Date() })
      .where(
        and(
          eq(sessions.id, sessionId),
          eq(sessions.userId, userId)
        )
      )
      .returning();

    return { success: !!session };
  }

  static async getActiveSessions(userId: string) {
    return db.query.sessions.findMany({
      where: and(
        eq(sessions.userId, userId),
        eq(sessions.revoked, false),
        gt(sessions.expiresAt, new Date())
      ),
      columns: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        lastActiveAt: true,
        expiresAt: true,
      },
    });
  }
}
