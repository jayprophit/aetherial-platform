import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as AppleStrategy } from 'passport-apple';
import { User } from '@prisma/client';
import { prisma } from '../../_core/db';
import { JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

type SocialProfile = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  provider: 'google' | 'github' | 'apple';
};

export const createOrUpdateUserFromSocial = async (profile: SocialProfile): Promise<User> => {
  const { id, email, name, avatar, provider } = profile;
  
  // Check if user exists with this social account
  const existingAccount = await prisma.account.findFirst({
    where: {
      provider,
      providerAccountId: id,
    },
    include: { user: true },
  });

  if (existingAccount) {
    return existingAccount.user;
  }

  // Check if user exists with this email
  let user = await prisma.user.findUnique({
    where: { email },
  });

  // If user doesn't exist, create a new one
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || `User-${Math.random().toString(36).substr(2, 9)}`,
        emailVerified: new Date(),
        image: avatar,
        accounts: {
          create: {
            provider,
            providerAccountId: id,
            type: 'oauth',
          },
        },
      },
    });
  } else {
    // Link existing account to this social provider
    await prisma.account.create({
      data: {
        userId: user.id,
        provider,
        providerAccountId: id,
        type: 'oauth',
      },
    });
  }

  return user;
};

export const generateAuthTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, tokenId: uuidv4() },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

// Google OAuth Strategy
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.API_URL}/auth/google/callback`,
    scope: ['profile', 'email'],
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const user = await createOrUpdateUserFromSocial({
        id: profile.id,
        email: profile.emails?.[0]?.value || '',
        name: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        provider: 'google',
      });
      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  }
);

// GitHub OAuth Strategy
export const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: `${process.env.API_URL}/auth/github/callback`,
    scope: ['user:email'],
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void
  ) => {
    try {
      const email = profile.emails?.[0]?.value || `${profile.id}@users.noreply.github.com`;
      const user = await createOrUpdateUserFromSocial({
        id: profile.id,
        email,
        name: profile.displayName || profile.username,
        avatar: profile.photos?.[0]?.value,
        provider: 'github',
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

// Apple OAuth Strategy
export const appleStrategy = new AppleStrategy(
  {
    clientID: process.env.APPLE_CLIENT_ID!,
    teamID: process.env.APPLE_TEAM_ID!,
    keyID: process.env.APPLE_KEY_ID!,
    key: process.env.APPLE_PRIVATE_KEY!,
    callbackURL: `${process.env.API_URL}/auth/apple/callback`,
    scope: ['name', 'email'],
    passReqToCallback: true,
  },
  async (
    req: any,
    accessToken: string,
    refreshToken: string,
    idToken: string,
    profile: any,
    done: (error: any, user?: any) => void
  ) => {
    try {
      // Apple sends the user's name only on the first login
      let name = '';
      if (profile?.name) {
        name = `${profile.name.firstName || ''} ${profile.name.lastName || ''}`.trim();
      }

      const user = await createOrUpdateUserFromSocial({
        id: profile.id,
        email: profile.email || `${profile.id}@privaterelay.appleid.com`,
        name: name || 'Apple User',
        provider: 'apple',
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
