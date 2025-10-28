import { Router } from "express";
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import {
  hashPassword,
  comparePassword,
  generateToken,
  isValidEmail,
  isValidPassword,
  generateUsername,
} from "../lib/auth";
import { authenticate } from "../middleware/auth";
import { AuditLogger } from "../lib/audit";
import { MfaService } from "../lib/mfa";
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/auth/register - Register new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
      });
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);
    const username = displayName || generateUsername(email);

    const result = await db.insert(users).values({
      email,
      password: hashedPassword,
      username,
      displayName: username,
    }).returning({ insertedId: users.id });

    const userId = result[0].insertedId;

    AuditLogger.log({
      action: "REGISTER_SUCCESS",
      userId: String(userId),
      object: "user",
      objectId: String(userId),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      status: "SUCCESS",
    });

    const token = generateToken({
      userId,
      email,
      displayName: username,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: userId,
        email,
        username,
        displayName: username,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/auth/login - Login user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userResult.length === 0) {
      AuditLogger.log({
        action: "LOGIN_FAILURE",
        object: "user",
        context: { email, reason: "User not found" },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        status: "FAILURE",
      });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = userResult[0];

    const isPasswordValid = await comparePassword(password, user.password || '');

    if (!isPasswordValid) {
      AuditLogger.log({
        action: "LOGIN_FAILURE",
        userId: String(user.id),
        object: "user",
        objectId: String(user.id),
        context: { email, reason: "Invalid password" },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        status: "FAILURE",
      });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.mfaEnabled) {
      const mfaToken = generateToken({ userId: user.id, email: user.email, mfaRequired: true }, '15m');

      AuditLogger.log({
        action: "LOGIN_MFA_REQUIRED",
        userId: String(user.id),
        object: "user",
        objectId: String(user.id),
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        status: "SUCCESS",
      });

      return res.json({
        success: true,
        mfaRequired: true,
        mfaToken,
        message: "MFA token required",
      });
    }

    AuditLogger.log({
      action: "LOGIN_SUCCESS",
      userId: String(user.id),
      object: "user",
      objectId: String(user.id),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      status: "SUCCESS",
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/auth/verify-mfa - Verify MFA token and complete login
router.post("/verify-mfa", async (req: Request, res: Response) => {
  const { mfaToken, mfaCode } = req.body;

  if (!mfaToken || !mfaCode) {
    return res.status(400).json({ success: false, message: "MFA token and code are required" });
  }

  try {
    const decoded = jwt.verify(mfaToken, process.env.JWT_SECRET as string) as { userId: number; mfaRequired: boolean };

    if (!decoded || !decoded.mfaRequired) {
      return res.status(401).json({ success: false, message: "Invalid MFA token" });
    }

    const userResult = await db.select().from(users).where(eq(users.id, decoded.userId));
    const user = userResult[0];

    if (!user || !user.mfaSecret || !user.mfaEnabled) {
      return res.status(400).json({ success: false, message: "MFA is not enabled for this user" });
    }

    const isTokenValid = MfaService.verifyToken(user.mfaSecret, mfaCode);

    if (!isTokenValid) {
      AuditLogger.log({
        action: "MFA_VERIFY_FAILURE",
        userId: String(user.id),
        object: "user",
        objectId: String(user.id),
        status: "FAILURE",
      });
      return res.status(400).json({ success: false, message: "Invalid MFA token" });
    }

    const finalToken = generateToken({ userId: user.id, email: user.email, displayName: user.displayName });

    AuditLogger.log({
      action: "MFA_VERIFY_SUCCESS",
      userId: String(user.id),
      object: "user",
      objectId: String(user.id),
      status: "SUCCESS",
    });

    res.json({
      success: true,
      message: "Login successful",
      token: finalToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled,
      },
    });

  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired MFA token" });
  }
});

// GET /api/auth/me - Get current user
router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        displayName: users.displayName,
        bio: users.bio,
        avatar: users.avatar,
        coverImage: users.coverImage,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        mfaEnabled: users.mfaEnabled,
      })
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: userResult[0],
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/auth/logout - Logout user
router.post("/logout", authenticate, async (req: Request, res: Response) => {
  AuditLogger.log({
    action: "LOGOUT_SUCCESS",
    userId: req.user.userId,
    object: "user",
    objectId: req.user.userId,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    status: "SUCCESS",
  });

  res.json({
    success: true,
    message: "Logout successful",
  });
});

// POST /api/auth/change-password - Change password
router.post("/change-password", authenticate, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
      });
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult[0];

    const isPasswordValid = await comparePassword(currentPassword, user.password || '');

    if (!isPasswordValid) {
      AuditLogger.log({
        action: "CHANGE_PASSWORD_FAILURE",
        userId: req.user.userId,
        object: "user",
        objectId: req.user.userId,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        status: "FAILURE",
        context: { reason: "Incorrect current password" },
      });
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, req.user.userId));

    AuditLogger.log({
      action: "CHANGE_PASSWORD_SUCCESS",
      userId: req.user.userId,
      object: "user",
      objectId: req.user.userId,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      status: "SUCCESS",
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

