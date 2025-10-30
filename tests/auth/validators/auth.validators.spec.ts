import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from '../../../server/auth/dto/register.dto';
import { LoginDto } from '../../../server/auth/dto/login.dto';
import { ResetPasswordDto } from '../../../server/auth/dto/reset-password.dto';
import { ChangePasswordDto } from '../../../server/auth/dto/change-password.dto';
import { UpdateProfileDto } from '../../../server/auth/dto/update-profile.dto';
import { Verify2FADto } from '../../../server/auth/dto/verify-2fa.dto';
import { RequestEmailVerificationDto } from '../../../server/auth/dto/request-email-verification.dto';
import { Disable2FADto } from '../../../server/auth/dto/disable-2fa.dto';

// Helper function to validate DTOs
const validateDto = async (dto: any, DtoClass: any): Promise<{ valid: boolean; errors?: string[] }> => {
  const instance = plainToInstance(DtoClass, dto);
  const errors = await validate(instance, { 
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: false
  });
  
  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors.flatMap(error => {
        if (error.constraints) {
          return Object.values(error.constraints);
        }
        // Handle nested validation errors
        if (error.children && error.children.length > 0) {
          return error.children.flatMap((child: any) => 
            child.constraints ? Object.values(child.constraints) : []
          );
        }
        return [];
      }),
    };
  }
  
  return { valid: true };
};

describe('Auth Validators', () => {
  // Common test data
  const validEmail = 'test@example.com';
  const validUsername = 'testuser';
  const validPassword = 'Test@1234';
  const validDisplayName = 'Test User';
  const validPhoneNumber = '+1234567890';
  const valid2FACode = '123456';
  const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  // Common error messages
  const ERROR_MESSAGES = {
    EMAIL: {
      IS_EMAIL: 'email must be an email',
      NOT_EMPTY: 'email should not be empty',
      IS_STRING: 'email must be a string'
    },
    PASSWORD: {
      MATCHES: 'password must match /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':\"\\\\|,.<>\\/?]).{8,}$/',
      NOT_EMPTY: 'password should not be empty',
      IS_STRING: 'password must be a string',
      MIN_LENGTH: 'password must be longer than or equal to 8 characters',
      MAX_LENGTH: 'password must be shorter than or equal to 100 characters'
    },
    USERNAME: {
      MATCHES: 'username must match /^[a-zA-Z0-9_]{3,30}$/',
      NOT_EMPTY: 'username should not be empty',
      IS_STRING: 'username must be a string',
      MIN_LENGTH: 'username must be longer than or equal to 3 characters',
      MAX_LENGTH: 'username must be shorter than or equal to 30 characters'
    },
    DISPLAY_NAME: {
      MATCHES: 'displayName must match /^[\\p{L}\\p{N}\\s\\-_\']+$/u',
      IS_STRING: 'displayName must be a string',
      MIN_LENGTH: 'displayName must be longer than or equal to 2 characters',
      MAX_LENGTH: 'displayName must be shorter than or equal to 100 characters'
    },
    PHONE_NUMBER: {
      MATCHES: 'phoneNumber must match a valid phone number format',
      IS_STRING: 'phoneNumber must be a string'
    },
    CODE: {
      NOT_EMPTY: 'code should not be empty',
      IS_STRING: 'code must be a string',
      LENGTH: 'code must be exactly 6 characters',
      IS_NUMBER_STRING: 'code must be a number string'
    },
    CURRENT_PASSWORD: {
      NOT_EMPTY: 'currentPassword should not be empty',
      IS_STRING: 'currentPassword must be a string'
    },
    NEW_PASSWORD: {
      NOT_EMPTY: 'newPassword should not be empty',
      IS_STRING: 'newPassword must be a string'
    },
    CONFIRM_PASSWORD: {
      NOT_EMPTY: 'confirmPassword should not be empty',
      IS_STRING: 'confirmPassword must be a string',
      MATCH: 'confirmPassword must match password'
    },
    ACCEPT_TERMS: {
      IS_BOOLEAN: 'acceptTerms must be a boolean value',
      IS_NOT_EMPTY: 'acceptTerms should not be empty',
      IS_TRUE: 'You must accept the terms and conditions'
    },
    TOKEN: {
      NOT_EMPTY: 'token should not be empty',
      IS_STRING: 'token must be a string',
      IS_JWT: 'token must be a jwt string'
    }
  };

  describe('RegisterDto', () => {
    it('should validate a valid registration', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = validUsername;
      dto.password = validPassword;
      dto.confirmPassword = validPassword;
      dto.displayName = validDisplayName;
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email format', async () => {
      const dto = new RegisterDto();
      dto.email = 'invalid-email';
      dto.username = validUsername;
      dto.password = validPassword;
      dto.confirmPassword = validPassword;
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.EMAIL.IS_EMAIL);
    });

    it('should reject missing required fields', async () => {
      const dto = new RegisterDto();
      const result = await validateDto(dto, RegisterDto);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.EMAIL.NOT_EMPTY);
      expect(result.errors).toContain(ERROR_MESSAGES.USERNAME.NOT_EMPTY);
      expect(result.errors).toContain(ERROR_MESSAGES.PASSWORD.NOT_EMPTY);
      expect(result.errors).toContain(ERROR_MESSAGES.ACCEPT_TERMS.IS_NOT_EMPTY);
    });

    it('should reject weak passwords', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = validUsername;
      dto.password = 'weak';
      dto.confirmPassword = 'weak';
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.PASSWORD.MATCHES);
    });

    it('should reject non-matching passwords', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = validUsername;
      dto.password = validPassword;
      dto.confirmPassword = 'Different@1234';
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.CONFIRM_PASSWORD.MATCH);
    });

    it('should reject invalid username format', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = 'user@name';
      dto.password = validPassword;
      dto.confirmPassword = validPassword;
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.USERNAME.MATCHES);
    });
  });

  describe('LoginDto', () => {
    it('should validate a valid login', async () => {
      const dto = new LoginDto();
      dto.email = validEmail;
      dto.password = validPassword;

      const result = await validateDto(dto, LoginDto);
      expect(result.valid).toBe(true);
    });

    it('should reject missing email', async () => {
      const dto = new LoginDto();
      dto.password = validPassword;

      const result = await validateDto(dto, LoginDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.EMAIL.NOT_EMPTY);
    });

    it('should reject missing password', async () => {
      const dto = new LoginDto();
      dto.email = validEmail;

      const result = await validateDto(dto, LoginDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.PASSWORD.NOT_EMPTY);
    });
  });

  describe('ResetPasswordDto', () => {
    it('should validate a valid password reset', async () => {
      const dto = new ResetPasswordDto();
      dto.token = validJWT;
      dto.newPassword = 'NewPassword@123';
      dto.confirmPassword = 'NewPassword@123';

      const result = await validateDto(dto, ResetPasswordDto);
      expect(result.valid).toBe(true);
    });

    it('should reject missing token', async () => {
      const dto = new ResetPasswordDto();
      dto.newPassword = 'NewPassword@123';
      dto.confirmPassword = 'NewPassword@123';

      const result = await validateDto(dto, ResetPasswordDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.TOKEN.NOT_EMPTY);
    });

    it('should reject non-matching passwords', async () => {
      const dto = new ResetPasswordDto();
      dto.token = validJWT;
      dto.newPassword = 'NewPassword@123';
      dto.confirmPassword = 'Different@123';

      const result = await validateDto(dto, ResetPasswordDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.CONFIRM_PASSWORD.MATCH);
    });
  });

  describe('ChangePasswordDto', () => {
    it('should validate a valid password change', async () => {
      const dto = new ChangePasswordDto();
      dto.currentPassword = 'Current@123';
      dto.newPassword = 'NewPassword@123';

      const result = await validateDto(dto, ChangePasswordDto);
      expect(result.valid).toBe(true);
    });

    it('should reject missing current password', async () => {
      const dto = new ChangePasswordDto();
      dto.newPassword = 'NewPassword@123';

      const result = await validateDto(dto, ChangePasswordDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.CURRENT_PASSWORD.NOT_EMPTY);
    });

    it('should reject missing new password', async () => {
      const dto = new ChangePasswordDto();
      dto.currentPassword = 'Current@123';

      const result = await validateDto(dto, ChangePasswordDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.NEW_PASSWORD.NOT_EMPTY);
    });
  });

  describe('UpdateProfileDto', () => {
    it('should validate a valid profile update', async () => {
      const dto = new UpdateProfileDto();
      dto.displayName = 'Updated Name';
      dto.phoneNumber = validPhoneNumber;

      const result = await validateDto(dto, UpdateProfileDto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid phone number format', async () => {
      const dto = new UpdateProfileDto();
      dto.phoneNumber = '123';

      const result = await validateDto(dto, UpdateProfileDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.PHONE_NUMBER.MATCHES);
    });
  });

  describe('Verify2FADto', () => {
    it('should validate a valid 2FA verification', async () => {
      const dto = new Verify2FADto();
      dto.code = valid2FACode;

      const result = await validateDto(dto, Verify2FADto);
      expect(result.valid).toBe(true);
    });

    it('should reject empty code', async () => {
      const dto = new Verify2FADto();
      dto.code = '';

      const result = await validateDto(dto, Verify2FADto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.CODE.NOT_EMPTY);
    });

    it('should reject invalid code length', async () => {
      const dto = new Verify2FADto();
      dto.code = '12345'; // Too short

      const result = await validateDto(dto, Verify2FADto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.CODE.LENGTH);
    });
  });

  describe('RequestEmailVerificationDto', () => {
    it('should validate a valid email verification request', async () => {
      const dto = new RequestEmailVerificationDto();
      dto.email = validEmail;

      const result = await validateDto(dto, RequestEmailVerificationDto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email format', async () => {
      const dto = new RequestEmailVerificationDto();
      dto.email = 'invalid-email';

      const result = await validateDto(dto, RequestEmailVerificationDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.EMAIL.IS_EMAIL);
    });
  });

  describe('Disable2FADto', () => {
    it('should validate a valid 2FA disable request', async () => {
      const dto = new Disable2FADto();
      dto.code = valid2FACode;

      const result = await validateDto(dto, Disable2FADto);
      expect(result.valid).toBe(true);
    });

    it('should reject empty code', async () => {
      const dto = new Disable2FADto();
      dto.code = '';

      const result = await validateDto(dto, Disable2FADto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.CODE.NOT_EMPTY);
    });
  });
  const valid2FACode = '123456';
  const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  
  // Common error messages
  const ERROR_MESSAGES = {
    EMAIL: {
      IS_EMAIL: 'email must be an email',
      NOT_EMPTY: 'email should not be empty',
      IS_STRING: 'email must be a string'
    },
    PASSWORD: {
      MATCHES: 'password must match /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':\"\\\\|,.<>\\/?]).{8,}$/',
      NOT_EMPTY: 'password should not be empty',
      IS_STRING: 'password must be a string',
      MIN_LENGTH: 'password must be longer than or equal to 8 characters',
      MAX_LENGTH: 'password must be shorter than or equal to 100 characters'
    },
    USERNAME: {
      MATCHES: 'username must match /^[a-zA-Z0-9_]{3,30}$/',
      NOT_EMPTY: 'username should not be empty',
      IS_STRING: 'username must be a string',
      MIN_LENGTH: 'username must be longer than or equal to 3 characters',
      MAX_LENGTH: 'username must be shorter than or equal to 30 characters'
    },
    DISPLAY_NAME: {
      MATCHES: 'displayName must match /^[\\p{L}\\p{N}\\s\\-_\']+$/u',
      IS_STRING: 'displayName must be a string',
      MIN_LENGTH: 'displayName must be longer than or equal to 2 characters',
      MAX_LENGTH: 'displayName must be shorter than or equal to 100 characters'
    },
    PHONE_NUMBER: {
      MATCHES: 'phoneNumber must match a valid phone number format',
      IS_STRING: 'phoneNumber must be a string'
    },
    CODE: {
      NOT_EMPTY: 'code should not be empty',
      IS_STRING: 'code must be a string',
      LENGTH: 'code must be exactly 6 characters',
      IS_NUMBER_STRING: 'code must be a number string'
    },
    CURRENT_PASSWORD: {
      NOT_EMPTY: 'currentPassword should not be empty',
      IS_STRING: 'currentPassword must be a string'
    },
    NEW_PASSWORD: {
      NOT_EMPTY: 'newPassword should not be empty',
      IS_STRING: 'newPassword must be a string'
    },
    CONFIRM_PASSWORD: {
      NOT_EMPTY: 'confirmPassword should not be empty',
      IS_STRING: 'confirmPassword must be a string',
      MATCH: 'confirmPassword must match password'
    },
    ACCEPT_TERMS: {
      IS_BOOLEAN: 'acceptTerms must be a boolean value',
      IS_NOT_EMPTY: 'acceptTerms should not be empty',
      IS_TRUE: 'You must accept the terms and conditions'
    },
    TOKEN: {
      NOT_EMPTY: 'token should not be empty',
      IS_STRING: 'token must be a string',
      IS_JWT: 'token must be a jwt string'
    }
  };

  describe('RegisterDto', () => {
    it('should validate a valid registration', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = validUsername;
      dto.password = validPassword;
      dto.confirmPassword = validPassword;
      dto.displayName = validDisplayName;
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email format', async () => {
      const dto = new RegisterDto();
      dto.email = 'invalid-email';
      dto.username = validUsername;
      dto.password = validPassword;
      dto.confirmPassword = validPassword;
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.EMAIL.IS_EMAIL);
    });

    it('should reject missing required fields', async () => {
      const dto = new RegisterDto();
      const result = await validateDto(dto, RegisterDto);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.EMAIL.NOT_EMPTY);
      expect(result.errors).toContain(ERROR_MESSAGES.USERNAME.NOT_EMPTY);
      expect(result.errors).toContain(ERROR_MESSAGES.PASSWORD.NOT_EMPTY);
      expect(result.errors).toContain(ERROR_MESSAGES.ACCEPT_TERMS.IS_NOT_EMPTY);
    });

    it('should reject weak passwords', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = validUsername;
      dto.password = 'weak';
      dto.confirmPassword = 'weak';
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.PASSWORD.MATCHES);
    });

    it('should reject mismatched passwords', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = validUsername;
      dto.password = validPassword;
      dto.confirmPassword = 'Different@1234';
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.CONFIRM_PASSWORD.MATCH);
    });

    it('should reject invalid usernames', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = 'u$er';
      dto.password = validPassword;
      dto.confirmPassword = validPassword;
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.USERNAME.MATCHES);
    });

    it('should reject when terms are not accepted', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = validUsername;
      dto.password = validPassword;
      dto.confirmPassword = validPassword;
      dto.acceptTerms = false;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.ACCEPT_TERMS.IS_TRUE);
    });
  });

  describe('LoginDto', () => {
    it('should validate a valid login', async () => {
      const dto = new LoginDto();
      dto.email = validEmail;
      dto.password = validPassword;
      dto.rememberMe = false;

      const result = await validateDto(dto, LoginDto);
      expect(result.valid).toBe(true);
    });

    it('should validate with 2FA code', async () => {
      const dto = new LoginDto();
      dto.email = validEmail;
      dto.password = validPassword;
      dto.code = valid2FACode;
      dto.rememberMe = true;

      const result = await validateDto(dto, LoginDto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email format', async () => {
      const dto = new LoginDto();
      dto.email = 'invalid-email';
      dto.password = validPassword;

      const result = await validateDto(dto, LoginDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.EMAIL.IS_EMAIL);
    });

    it('should reject missing required fields', async () => {
      const dto = new LoginDto();
      const result = await validateDto(dto, LoginDto);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.EMAIL.NOT_EMPTY);
      expect(result.errors).toContain(ERROR_MESSAGES.PASSWORD.NOT_EMPTY);
    });
  });

  describe('ResetPasswordDto', () => {
    it('should validate a valid reset password request', async () => {
      const dto = new ResetPasswordDto();
      dto.token = validJWT;
      dto.newPassword = 'New@Pass123';
      dto.confirmPassword = 'New@Pass123';

      const result = await validateDto(dto, ResetPasswordDto);
      expect(result.valid).toBe(true);
    });

    it('should reject mismatched passwords', async () => {
      const dto = new ResetPasswordDto();
      dto.token = validJWT;
      dto.newPassword = 'New@Pass123';
      dto.confirmPassword = 'Different@123';

      const result = await validateDto(dto, ResetPasswordDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.CONFIRM_PASSWORD.MATCH);
    });

    it('should reject weak passwords', async () => {
      const dto = new ResetPasswordDto();
      dto.token = validJWT;
      dto.newPassword = 'weak';
      dto.confirmPassword = 'weak';

      const result = await validateDto(dto, ResetPasswordDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.PASSWORD.MATCHES);
    });
  });

  describe('ChangePasswordDto', () => {
    it('should validate a valid password change', async () => {
      const dto = new ChangePasswordDto();
      dto.currentPassword = 'Current@123';
      dto.newPassword = 'New@Pass123';
      dto.confirmNewPassword = 'New@Pass123';

      const result = await validateDto(dto, ChangePasswordDto);
      expect(result.valid).toBe(true);
    });

    it('should reject when current password is missing', async () => {
      const dto = new ChangePasswordDto();
      dto.newPassword = 'New@Pass123';
      dto.confirmNewPassword = 'New@Pass123';

      const result = await validateDto(dto, ChangePasswordDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.CURRENT_PASSWORD.NOT_EMPTY);
    });

    it('should reject when new passwords do not match', async () => {
      const dto = new ChangePasswordDto();
      dto.currentPassword = 'Current@123';
      dto.newPassword = 'New@Pass123';
      dto.confirmNewPassword = 'Different@123';

      const result = await validateDto(dto, ChangePasswordDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('confirmNewPassword must match newPassword');
    });
  });

  describe('UpdateProfileDto', () => {
    it('should validate a valid profile update', async () => {
      const dto = new UpdateProfileDto();
      dto.email = 'new.email@example.com';
      dto.displayName = 'New Display Name';
      dto.phoneNumber = '+12345678901';

      const result = await validateDto(dto, UpdateProfileDto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email format', async () => {
      const dto = new UpdateProfileDto();
      dto.email = 'invalid-email';

      const result = await validateDto(dto, UpdateProfileDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.EMAIL.IS_EMAIL);
    });

    it('should reject invalid phone number format', async () => {
      const dto = new UpdateProfileDto();
      dto.phoneNumber = '123';

      const result = await validateDto(dto, UpdateProfileDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.PHONE_NUMBER.MATCHES);
    });
  });

  describe('Verify2FADto', () => {
    it('should validate a valid 2FA verification', async () => {
      const dto = new Verify2FADto();
      dto.code = valid2FACode;

      const result = await validateDto(dto, Verify2FADto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid 2FA code format', async () => {
      const dto = new Verify2FADto();
      dto.code = '123';

      const result = await validateDto(dto, Verify2FADto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.CODE.LENGTH);
    });

    it('should reject empty 2FA code', async () => {
      const dto = new Verify2FADto();
      dto.code = '';

      const result = await validateDto(dto, Verify2FADto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.CODE.NOT_EMPTY);
    });
  });

  describe('RequestEmailVerificationDto', () => {
    it('should validate a valid email verification request', async () => {
      const dto = new RequestEmailVerificationDto();
      dto.email = validEmail;

      const result = await validateDto(dto, RequestEmailVerificationDto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email format', async () => {
      const dto = new RequestEmailVerificationDto();
      dto.email = 'invalid-email';

      const result = await validateDto(dto, RequestEmailVerificationDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.EMAIL.IS_EMAIL);
    });
  });

  describe('Disable2FADto', () => {
    it('should validate a valid 2FA disable request', async () => {
      const dto = new Disable2FADto();
      dto.password = validPassword;

      const result = await validateDto(dto, Disable2FADto);
      expect(result.valid).toBe(true);
    });

    it('should reject empty password', async () => {
      const dto = new Disable2FADto();
      dto.password = '';

      const result = await validateDto(dto, Disable2FADto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(ERROR_MESSAGES.PASSWORD.NOT_EMPTY);
    });
  });

    it('should reject invalid email format', async () => {
      const dto = new RegisterDto();
      dto.email = 'invalid-email';
      dto.username = validUsername;
      dto.password = validPassword;
      dto.confirmPassword = validPassword;
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Please provide a valid email address');
    });

    it('should reject invalid username format', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = 'user@name';
      dto.password = validPassword;
      dto.confirmPassword = validPassword;
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Username must be 3-30 characters and can only contain letters, numbers, and underscores');
    });

    it('should reject weak password', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = validUsername;
      dto.password = 'weak';
      dto.confirmPassword = 'weak';
      dto.acceptTerms = true;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
    });

    it('should reject when terms are not accepted', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = validUsername;
      dto.password = validPassword;
      dto.confirmPassword = validPassword;
      dto.acceptTerms = false;

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('You must accept the terms and conditions');
    });

    it('should detect honeypot field', async () => {
      const dto = new RegisterDto();
      dto.email = validEmail;
      dto.username = validUsername;
      dto.password = validPassword;
      dto.confirmPassword = validPassword;
      dto.acceptTerms = true;
      dto.honeypot = 'bot';

      const result = await validateDto(dto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid form submission');
    });
  });

  describe('LoginDto', () => {
    it('should validate a valid login', async () => {
      const dto = new LoginDto();
      dto.email = validEmail;
      dto.password = validPassword;

      const result = await validateDto(dto, LoginDto);
      expect(result.valid).toBe(true);
    });

    it('should validate login with 2FA code', async () => {
      const dto = new LoginDto();
      dto.email = validEmail;
      dto.password = validPassword;
      dto.code = valid2FACode;

      const result = await validateDto(dto, LoginDto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email format', async () => {
      const dto = new LoginDto();
      dto.email = 'invalid-email';
      dto.password = validPassword;

      const result = await validateDto(dto, LoginDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Please provide a valid email address');
    });

    it('should reject empty password', async () => {
      const dto = new LoginDto();
      dto.email = validEmail;
      dto.password = '';

      const result = await validateDto(dto, LoginDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });
  });

  describe('ResetPasswordDto', () => {
    it('should validate a valid reset password request', async () => {
      const dto = new ResetPasswordDto();
      dto.token = validJWT;
      dto.newPassword = 'New@Pass123';
      dto.confirmPassword = 'New@Pass123';

      const result = await validateDto(dto, ResetPasswordDto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid JWT token', async () => {
      const dto = new ResetPasswordDto();
      dto.token = 'invalid-token';
      dto.newPassword = 'New@Pass123';
      dto.confirmPassword = 'New@Pass123';

      const result = await validateDto(dto, ResetPasswordDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid or expired token');
    });

    it('should reject mismatched passwords', async () => {
      const dto = new ResetPasswordDto();
      dto.token = validJWT;
      dto.newPassword = 'New@Pass123';
      dto.confirmPassword = 'Different@123';

      const result = await validateDto(dto, ResetPasswordDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Passwords do not match');
    });
  });

  describe('ChangePasswordDto', () => {
    it('should validate a valid password change', async () => {
      const dto = new ChangePasswordDto();
      dto.currentPassword = 'Old@Pass123';
      dto.newPassword = 'New@Pass123';
      dto.confirmNewPassword = 'New@Pass123';

      const result = await validateDto(dto, ChangePasswordDto);
      expect(result.valid).toBe(true);
    });

    it('should reject when new password is same as current', async () => {
      const dto = new ChangePasswordDto();
      dto.currentPassword = 'Same@Pass123';
      dto.newPassword = 'Same@Pass123';
      dto.confirmNewPassword = 'Same@Pass123';

      const result = await validateDto(dto, ChangePasswordDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('New password must be different from current password');
    });
  });

  describe('UpdateProfileDto', () => {
    it('should validate a valid profile update', async () => {
      const dto = new UpdateProfileDto();
      dto.email = 'new.email@example.com';
      dto.username = 'newusername';
      dto.displayName = 'New Display Name';
      dto.phoneNumber = validPhoneNumber;

      const result = await validateDto(dto, UpdateProfileDto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid phone number format', async () => {
      const dto = new UpdateProfileDto();
      dto.phoneNumber = '123';

      const result = await validateDto(dto, UpdateProfileDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Please provide a valid phone number in international format');
    });
  });

  describe('Verify2FADto', () => {
    it('should validate a valid 2FA code', async () => {
      const dto = new Verify2FADto();
      dto.code = valid2FACode;

      const result = await validateDto(dto, Verify2FADto);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid 2FA code format', async () => {
      const dto = new Verify2FADto();
      dto.code = '12345'; // Too short

      const result = await validateDto(dto, Verify2FADto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Must be a 6-digit number');
    });
  });

    it('should validate username format', async () => {
      const invalidUsernameDto = {
        email: 'test@example.com',
        username: 'user@name', // Invalid characters
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
      };

      const result = await validate(invalidUsernameDto, RegisterDto);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'username must contain only letters, numbers, underscores, and hyphens',
      );
    });
  });
});
