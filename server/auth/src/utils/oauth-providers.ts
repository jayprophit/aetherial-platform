import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { Strategy as AppleStrategy } from 'passport-apple';
import { VerifyCallback } from 'passport-oauth2';
import { prisma } from '../../_core/db';
import { JWT_SECRET, OAUTH_CONFIG } from '../config';
import { generateTokens } from './token.utils';
import { v4 as uuidv4 } from 'uuid';

interface OAuthProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string; verified?: boolean }>;
  photos?: Array<{ value: string }>;
  provider: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  _json?: any;
}

type OAuthCallback = (
  accessToken: string,
  refreshToken: string,
  profile: OAuthProfile,
  done: VerifyCallback
) => Promise<void>;

export const getGoogleStrategy = (): GoogleStrategy => {
  return new GoogleStrategy(
    {
      clientID: OAUTH_CONFIG.google.clientId,
      clientSecret: OAUTH_CONFIG.google.clientSecret,
      callbackURL: OAUTH_CONFIG.google.callbackURL,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (
      req: Express.Request,
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'));
        }

        // Find or create user
        const user = await findOrCreateUser({
          provider: 'google',
          providerId: profile.id,
          email,
          name: profile.displayName,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          avatar: profile.photos?.[0]?.value,
          emailVerified: profile.emails?.[0]?.verified || false,
          metadata: profile._json,
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  );
};

export const getGitHubStrategy = (): GitHubStrategy => {
  return new GitHubStrategy(
    {
      clientID: OAUTH_CONFIG.github.clientId,
      clientSecret: OAUTH_CONFIG.github.clientSecret,
      callbackURL: OAUTH_CONFIG.github.callbackURL,
      scope: ['user:email'],
      passReqToCallback: true,
    },
    async (
      req: Express.Request,
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: VerifyCallback
    ) => {
      try {
        // GitHub might not return email in the profile
        let email = profile.emails?.[0]?.value;
        
        // If no email in profile, try to fetch it from GitHub API
        if (!email && accessToken) {
          const response = await fetch('https://api.github.com/user/emails', {
            headers: { Authorization: `token ${accessToken}` },
          });
          
          if (response.ok) {
            const emails = await response.json();
            const primaryEmail = emails.find((e: any) => e.primary) || emails[0];
            email = primaryEmail?.email;
          }
        }

        if (!email) {
          return done(new Error('No email found in GitHub profile'));
        }

        // Find or create user
        const user = await findOrCreateUser({
          provider: 'github',
          providerId: profile.id,
          email,
          name: profile.displayName || profile.username,
          avatar: profile.photos?.[0]?.value,
          emailVerified: profile.emails?.[0]?.verified || false,
          metadata: profile._json,
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  );
};

export const getAppleStrategy = (): AppleStrategy => {
  return new AppleStrategy(
    {
      clientID: OAUTH_CONFIG.apple.clientId,
      teamID: OAUTH_CONFIG.apple.teamId,
      keyID: OAUTH_CONFIG.apple.keyId,
      key: OAUTH_CONFIG.apple.privateKey,
      callbackURL: OAUTH_CONFIG.apple.callbackURL,
      scope: ['name', 'email'],
      passReqToCallback: true,
    },
    async (
      req: Express.Request,
      accessToken: string,
      refreshToken: string,
      idToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        if (!idToken) {
          return done(new Error('No ID token from Apple'));
        }

        // Apple sends name only on first login
        const { email, sub: appleId } = profile;
        const name = profile.name
          ? `${profile.name.firstName || ''} ${profile.name.lastName || ''}`.trim() || null
          : null;

        if (!email) {
          return done(new Error('No email found in Apple profile'));
        }

        // Find or create user
        const user = await findOrCreateUser({
          provider: 'apple',
          providerId: appleId,
          email,
          name,
          emailVerified: true, // Apple verifies emails
          metadata: profile,
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  );
};

interface FindOrCreateUserParams {
  provider: string;
  providerId: string;
  email: string;
  name?: string | null;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  emailVerified?: boolean;
  metadata?: any;
}

async function findOrCreateUser({
  provider,
  providerId,
  email,
  name,
  firstName,
  lastName,
  avatar,
  emailVerified = false,
  metadata,
}: FindOrCreateUserParams) {
  // Start a transaction to ensure data consistency
  return prisma.$transaction(async (tx) => {
    // Check if user already exists with this provider
    const existingAccount = await tx.socialAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
      include: {
        user: true,
      },
    });

    if (existingAccount) {
      // Update last login time and any other relevant info
      await tx.user.update({
        where: { id: existingAccount.userId },
        data: {
          lastLoginAt: new Date(),
          avatar: avatar || undefined,
          emailVerified: emailVerified || undefined,
        },
      });

      return existingAccount.user;
    }

    // Check if user with this email already exists
    const existingUser = await tx.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Link this OAuth account to the existing user
      await tx.socialAccount.create({
        data: {
          provider,
          providerId,
          userId: existingUser.id,
          metadata: metadata || {},
        },
      });

      // Update user with any new information
      const updatedUser = await tx.user.update({
        where: { id: existingUser.id },
        data: {
          name: name || existingUser.name,
          avatar: avatar || existingUser.avatar,
          emailVerified: emailVerified || existingUser.emailVerified,
          lastLoginAt: new Date(),
        },
      });

      return updatedUser;
    }

    // Create a new user
    const newUser = await tx.user.create({
      data: {
        email,
        name: name || `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0],
        firstName: firstName || null,
        lastName: lastName || null,
        avatar: avatar || null,
        emailVerified,
        lastLoginAt: new Date(),
        socialAccounts: {
          create: {
            provider,
            providerId,
            metadata: metadata || {},
          },
        },
        // Set a random password that can't be used for login
        password: `oauth_${uuidv4()}`,
      },
    });

    return newUser;
  });
}

// Helper to get the appropriate strategy based on provider
export const getStrategy = (provider: string) => {
  switch (provider) {
    case 'google':
      return getGoogleStrategy();
    case 'github':
      return getGitHubStrategy();
    case 'apple':
      return getAppleStrategy();
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
};

// Helper to get the redirect URL after successful authentication
export const getSuccessRedirect = (req: Express.Request, defaultRedirect = '/') => {
  return req.session?.returnTo || req.query.returnTo?.toString() || defaultRedirect;
};

// Helper to get the failure redirect URL
export const getFailureRedirect = (req: Express.Request, defaultRedirect = '/login') => {
  return req.session?.returnTo || req.query.returnTo?.toString() || defaultRedirect;
};
