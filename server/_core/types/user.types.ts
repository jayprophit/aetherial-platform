import { users } from '../../db/schema';

export type User = typeof users.$inferSelect & {
  // Additional user properties can be added here
};

export type UserCreateInput = Omit<
  typeof users.$inferInsert,
  'id' | 'createdAt' | 'updatedAt' | 'isVerified' | 'mfaEnabled' | 'mfaSecret'
> & {
  password: string;
};

export type UserUpdateInput = Partial<Omit<UserCreateInput, 'email' | 'password'>> & {
  currentPassword?: string;
  newPassword?: string;
};

export type UserPublic = Omit<User, 'password' | 'mfaSecret' | 'resetToken' | 'resetTokenExpiry'>;

export interface LoginResponse {
  success: boolean;
  user?: UserPublic;
  accessToken?: string;
  refreshToken?: string;
  requires2FA?: boolean;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: UserPublic;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

export interface AuthTokenPayload {
  userId: number;
  email: string;
  username: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user?: UserPublic;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface Enable2FAResponse {
  success: boolean;
  secret?: string;
  qrCodeUrl?: string;
  manualEntryCode?: string;
  message?: string;
}

export interface Verify2FARequest {
  code: string;
}

export interface Verify2FAResponse {
  success: boolean;
  message: string;
}
