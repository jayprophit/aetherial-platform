import { body, query, param } from 'express-validator';
import { User } from '../../users/entities/user.entity';
import { AppDataSource } from '../../data-source';

const userRepository = AppDataSource.getRepository(User);

// Common validation patterns
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,30}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const DISPLAY_NAME_PATTERN = /^[\p{L}\p{N}\s\-_']+$/u;
const PHONE_PATTERN = /^\+?[1-9]\d{1,14}$/; // E.164 format

// Common validation messages
const MESSAGES = {
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Please provide a valid email address',
    IN_USE: 'Email is already in use',
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    WEAK: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
    MISMATCH: 'Passwords do not match',
  },
  USERNAME: {
    REQUIRED: 'Username is required',
    INVALID: 'Username must be 3-30 characters and can only contain letters, numbers, and underscores',
    IN_USE: 'Username is already taken',
  },
  DISPLAY_NAME: {
    INVALID: 'Display name can only contain letters, numbers, spaces, hyphens, and apostrophes',
    LENGTH: 'Display name must be between 1 and 50 characters',
  },
  TOKEN: {
    REQUIRED: 'Token is required',
    INVALID: 'Invalid or expired token',
  },
  CODE: {
    INVALID: 'Must be a 6-digit number',
  },
};

// Custom validators
const isEmailAvailable = async (email: string) => {
  const user = await userRepository.findOne({ where: { email } });
  if (user) {
    throw new Error(MESSAGES.EMAIL.IN_USE);
  }
  return true;
};

const isUsernameAvailable = async (username: string) => {
  const user = await userRepository.findOne({ where: { username } });
  if (user) {
    throw new Error(MESSAGES.USERNAME.IN_USE);
  }
  return true;
};

export const registerSchema = [
  // Email validation
  body('email')
    .trim()
    .notEmpty().withMessage(MESSAGES.EMAIL.REQUIRED)
    .matches(EMAIL_PATTERN).withMessage(MESSAGES.EMAIL.INVALID)
    .normalizeEmail()
    .custom(isEmailAvailable),
  
  // Username validation
  body('username')
    .trim()
    .notEmpty().withMessage(MESSAGES.USERNAME.REQUIRED)
    .matches(USERNAME_PATTERN).withMessage(MESSAGES.USERNAME.INVALID)
    .custom(isUsernameAvailable),
  
  // Password validation
  body('password')
    .notEmpty().withMessage(MESSAGES.PASSWORD.REQUIRED)
    .matches(PASSWORD_PATTERN).withMessage(MESSAGES.PASSWORD.WEAK)
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error(MESSAGES.PASSWORD.MISMATCH);
      }
      return true;
    }),
  
  // Confirm password validation
  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password'),
  
  // Display name validation
  body('displayName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage(MESSAGES.DISPLAY_NAME.LENGTH)
    .matches(DISPLAY_NAME_PATTERN).withMessage(MESSAGES.DISPLAY_NAME.INVALID),
  
  // Terms acceptance
  body('acceptTerms')
    .isBoolean({ strict: true })
    .withMessage('You must accept the terms and conditions')
    .toBoolean()
    .isBoolean()
    .withMessage('Invalid terms acceptance value')
    .isIn([true])
    .withMessage('You must accept the terms and conditions'),
  
  // Honeypot field (anti-bot)
  body('honeypot')
    .optional()
    .isEmpty()
    .withMessage('Invalid form submission')
];

export const loginSchema = [
  // Email validation
  body('email')
    .trim()
    .notEmpty().withMessage(MESSAGES.EMAIL.REQUIRED)
    .matches(EMAIL_PATTERN).withMessage(MESSAGES.EMAIL.INVALID)
    .normalizeEmail(),
  
  // Password validation
  body('password')
    .notEmpty().withMessage(MESSAGES.PASSWORD.REQUIRED),
  
  // 2FA code validation (if provided)
  body('code')
    .optional()
    .isNumeric().withMessage(MESSAGES.CODE.INVALID)
    .isLength({ min: 6, max: 6 }).withMessage(MESSAGES.CODE.INVALID)
    .toInt(),
  
  // Remember me flag
  body('rememberMe')
    .optional()
    .isBoolean().withMessage('Invalid remember me value')
    .toBoolean(),
  
  // Device info for security
  body('deviceInfo')
    .optional()
    .isObject().withMessage('Invalid device information')
];

export const emailSchema = [
  body('email')
    .trim()
    .notEmpty().withMessage(MESSAGES.EMAIL.REQUIRED)
    .matches(EMAIL_PATTERN).withMessage(MESSAGES.EMAIL.INVALID)
    .normalizeEmail()
];

export const resetPasswordSchema = [
  // Token validation
  body('token')
    .notEmpty().withMessage(MESSAGES.TOKEN.REQUIRED)
    .isJWT().withMessage(MESSAGES.TOKEN.INVALID),
  
  // New password validation
  body('newPassword')
    .notEmpty().withMessage(MESSAGES.PASSWORD.REQUIRED)
    .matches(PASSWORD_PATTERN).withMessage(MESSAGES.PASSWORD.WEAK),
  
  // Confirm password validation
  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error(MESSAGES.PASSWORD.MISMATCH);
      }
      return true;
    })
];

export const verify2FASchema = [
  // 2FA code validation
  body('code')
    .notEmpty().withMessage('2FA code is required')
    .isNumeric().withMessage(MESSAGES.CODE.INVALID)
    .isLength({ min: 6, max: 6 }).withMessage(MESSAGES.CODE.INVALID)
    .toInt(),
  
  // Device verification
  body('deviceId')
    .optional()
    .isString().withMessage('Invalid device ID')
    .trim()
];

export const refreshTokenSchema = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
    .isJWT().withMessage('Invalid refresh token format')
];

export const verifyEmailSchema = [
  param('token')
    .notEmpty().withMessage('Verification token is required')
    .isJWT().withMessage('Invalid verification token')
];

export const changePasswordSchema = [
  // Current password
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  // New password
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .matches(PASSWORD_PATTERN).withMessage(MESSAGES.PASSWORD.WEAK)
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),
  
  // Confirm new password
  body('confirmNewPassword')
    .notEmpty().withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New passwords do not match');
      }
      return true;
    })
];

export const updateProfileSchema = [
  // Email (optional update)
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .matches(EMAIL_PATTERN).withMessage(MESSAGES.EMAIL.INVALID)
    .normalizeEmail()
    .custom(async (email, { req }) => {
      if (email && email !== req.user.email) {
        return isEmailAvailable(email);
      }
      return true;
    }),
  
  // Username (optional update)
  body('username')
    .optional({ checkFalsy: true })
    .trim()
    .matches(USERNAME_PATTERN).withMessage(MESSAGES.USERNAME.INVALID)
    .custom(async (username, { req }) => {
      if (username && username !== req.user.username) {
        return isUsernameAvailable(username);
      }
      return true;
    }),
  
  // Display name (optional)
  body('displayName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage(MESSAGES.DISPLAY_NAME.LENGTH)
    .matches(DISPLAY_NAME_PATTERN).withMessage(MESSAGES.DISPLAY_NAME.INVALID),
  
  // Phone number (optional)
  body('phoneNumber')
    .optional({ checkFalsy: true })
    .trim()
    .matches(PHONE_PATTERN).withMessage('Please provide a valid phone number in international format')
];
