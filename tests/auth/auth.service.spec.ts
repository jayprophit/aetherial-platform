import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { AuthService } from '../../server/auth/auth.service';
import { UsersService } from '../../server/users/users.service';
import { TestApp, setupTestApp } from '../test-utils';
import * as bcrypt from 'bcrypt';
import { User } from '../../server/users/entities/user.entity';

describe('AuthService', () => {
  let app: TestApp;
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeAll(async () => {
    app = await setupTestApp();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config = {
                'JWT_SECRET': 'test-secret',
                'JWT_EXPIRES_IN': '1h',
                'REFRESH_TOKEN_EXPIRES_IN': '7d',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        isActive: true,
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      
      const result = await authService.validateUser('test@example.com', 'password123');
      
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
      });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      
      const result = await authService.validateUser('nonexistent@example.com', 'password123');
      
      expect(result).toBeNull();
      expect(usersService.findOneByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });

    it('should return null if password is invalid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('correctpassword', 10),
        isActive: true,
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      
      const result = await authService.validateUser('test@example.com', 'wrongpassword');
      
      expect(result).toBeNull();
    });

    it('should return null if user is inactive', async () => {
      const mockUser = {
        id: '1',
        email: 'inactive@example.com',
        password: await bcrypt.hash('password123', 10),
        isActive: false,
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      
      const result = await authService.validateUser('inactive@example.com', 'password123');
      
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
      };

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      jest.spyOn(authService as any, 'getTokens').mockResolvedValue(mockTokens);
      
      const result = await authService.login(mockUser);
      
      expect(result).toEqual({
        user: mockUser,
        tokens: mockTokens,
      });
      expect(authService['getTokens']).toHaveBeenCalledWith('1', 'test@example.com');
    });
  });

  describe('register', () => {
    const registerDto = {
      email: 'newuser@example.com',
      password: 'Password123!',
      username: 'newuser',
      displayName: 'New User',
      confirmPassword: 'Password123!',
    };

    const mockUser = {
      id: '2',
      email: 'newuser@example.com',
      username: 'newuser',
      displayName: 'New User',
      isEmailVerified: false,
      isActive: true,
    } as User;

    const mockTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    beforeEach(() => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as any);
      jest.spyOn(authService as any, 'getTokens').mockResolvedValue(mockTokens);
    });

    it('should create a new user and return tokens', async () => {
      const result = await authService.register(registerDto);
      
      expect(usersService.findOneByEmail).toHaveBeenCalledWith('newuser@example.com');
      expect(usersService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        username: registerDto.username,
        displayName: registerDto.displayName,
        password: expect.any(String),
      });
      expect(result).toEqual({
        user: mockUser,
        tokens: mockTokens,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue({
        id: '1',
        email: 'existing@example.com',
      } as any);
      
      await expect(authService.register({
        ...registerDto,
        email: 'existing@example.com'
      })).rejects.toThrow(ConflictException);
    });

    it('should hash the password before saving', async () => {
      const passwordHash = await bcrypt.hash(registerDto.password, 10);
      const createSpy = jest.spyOn(usersService, 'create').mockImplementation(async (dto) => ({
        ...mockUser,
        password: dto.password,
      }));

      await authService.register(registerDto);
      
      const savedPassword = createSpy.mock.calls[0][0].password;
      expect(savedPassword).not.toBe(registerDto.password);
      expect(await bcrypt.compare(registerDto.password, savedPassword)).toBe(true);
    });

    it('should throw BadRequestException if password is weak', async () => {
      const weakPasswordDto = {
        ...registerDto,
        password: 'weak',
        confirmPassword: 'weak',
      };

      await expect(authService.register(weakPasswordDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const mismatchPasswordDto = {
        ...registerDto,
        confirmPassword: 'Different123!',
      };

      await expect(authService.register(mismatchPasswordDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshTokens', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      refreshToken: 'valid-refresh-token',
      isActive: true,
    } as User;

    const mockTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    beforeEach(() => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ 
        sub: '1', 
        email: 'test@example.com',
        jti: 'token-id',
      });
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser as any);
      jest.spyOn(authService as any, 'getTokens').mockResolvedValue(mockTokens);
      jest.spyOn(usersService, 'update').mockResolvedValue(undefined);
    });

    it('should return new tokens if refresh token is valid', async () => {
      const result = await authService.refreshTokens('1', 'valid-refresh-token');
      
      expect(result).toEqual({
        user: {
          id: '1',
          email: 'test@example.com',
        },
        tokens: mockTokens,
      });
      expect(usersService.update).toHaveBeenCalledWith('1', {
        refreshToken: 'new-refresh-token',
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      await expect(authService.refreshTokens('1', 'invalid-token'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      
      await expect(authService.refreshTokens('1', 'valid-token'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if refresh token does not match', async () => {
      const userWithDifferentToken = { ...mockUser, refreshToken: 'different-token' };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(userWithDifferentToken as any);
      
      await expect(authService.refreshTokens('1', 'stale-refresh-token'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if user is inactive', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(inactiveUser as any);
      
      await expect(authService.refreshTokens('1', 'valid-token'))
        .rejects.toThrow(ForbiddenException);
    });

    it('should throw UnauthorizedException if token has been revoked', async () => {
      jest.spyOn(authService as any, 'isTokenRevoked').mockResolvedValue(true);
      
      await expect(authService.refreshTokens('1', 'revoked-token'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should set refresh token to null and revoke all tokens', async () => {
      const revokeAllTokensSpy = jest.spyOn(authService as any, 'revokeAllTokens');
      
      await authService.logout('1');
      
      expect(usersService.update).toHaveBeenCalledWith('1', { refreshToken: null });
      expect(revokeAllTokensSpy).toHaveBeenCalledWith('1');
    });
  });

  describe('verifyEmail', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      isEmailVerified: false,
      emailVerificationToken: 'valid-token',
      save: jest.fn().mockResolvedValue(true),
    } as any;

    beforeEach(() => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
    });

    it('should verify email with valid token', async () => {
      await authService.verifyEmail('1', 'valid-token');
      
      expect(mockUser.isEmailVerified).toBe(true);
      expect(mockUser.emailVerificationToken).toBeNull();
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
      
      await expect(authService.verifyEmail('nonexistent', 'token'))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if email is already verified', async () => {
      const verifiedUser = { ...mockUser, isEmailVerified: true };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(verifiedUser);
      
      await expect(authService.verifyEmail('1', 'valid-token'))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      await expect(authService.verifyEmail('1', 'invalid-token'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('requestPasswordReset', () => {
    const mockUser = {
      id: '1',
      email: 'user@example.com',
      generatePasswordResetToken: jest.fn().mockResolvedValue('reset-token'),
      save: jest.fn().mockResolvedValue(true),
    } as any;

    beforeEach(() => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(authService as any, 'sendPasswordResetEmail').mockResolvedValue(undefined);
    });

    it('should generate and send password reset token', async () => {
      await authService.requestPasswordReset('user@example.com');
      
      expect(usersService.findOneByEmail).toHaveBeenCalledWith('user@example.com');
      expect(mockUser.generatePasswordResetToken).toHaveBeenCalled();
      expect(mockUser.save).toHaveBeenCalled();
      expect(authService['sendPasswordResetEmail']).toHaveBeenCalledWith(
        'user@example.com',
        'reset-token'
      );
    });

    it('should not throw if email does not exist (security measure)', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      
      await expect(authService.requestPasswordReset('nonexistent@example.com'))
        .resolves.not.toThrow();
    });
  });

  describe('resetPassword', () => {
    const mockUser = {
      id: '1',
      email: 'user@example.com',
      passwordResetToken: 'valid-token',
      passwordResetExpires: new Date(Date.now() + 3600000), // 1 hour from now
      save: jest.fn().mockResolvedValue(true),
    } as any;

    const resetPasswordDto = {
      token: 'valid-token',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    };

    beforeEach(() => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
    });

    it('should reset password with valid token', async () => {
      await authService.resetPassword('1', resetPasswordDto);
      
      expect(mockUser.password).not.toBe(resetPasswordDto.newPassword);
      expect(await bcrypt.compare(resetPasswordDto.newPassword, mockUser.password)).toBe(true);
      expect(mockUser.passwordResetToken).toBeNull();
      expect(mockUser.passwordResetExpires).toBeNull();
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const invalidDto = {
        ...resetPasswordDto,
        confirmPassword: 'Mismatched123!',
      };
      
      await expect(authService.resetPassword('1', invalidDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const invalidTokenUser = { ...mockUser, passwordResetToken: 'different-token' };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(invalidTokenUser);
      
      await expect(authService.resetPassword('1', resetPasswordDto))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is expired', async () => {
      const expiredTokenUser = {
        ...mockUser,
        passwordResetExpires: new Date(Date.now() - 3600000), // 1 hour ago
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(expiredTokenUser);
      
      await expect(authService.resetPassword('1', resetPasswordDto))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
