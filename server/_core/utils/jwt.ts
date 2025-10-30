import jwt from 'jsonwebtoken';
import { users } from '../../db/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

type TokenType = 'access' | 'refresh';

export interface TokenPayload {
  userId: number;
  email: string;
  username: string;
  type: TokenType;
}

export const generateTokens = (user: typeof users.$inferSelect) => {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    type: 'access'
  };

  const accessToken = jwt.sign(
    { ...payload, type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, type: TokenType): TokenPayload | null => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    if (payload.type !== type) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
};

export const hashToken = (token: string): string => {
  return jwt.sign({ token }, JWT_SECRET);
};
