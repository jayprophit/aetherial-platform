import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { MfaService } from "../lib/mfa";
import { AuditLogger } from "../lib/audit";

const router = Router();

// POST /api/mfa/generate - Generate MFA secret and QR code
router.post("/generate", authenticate, async (req, res) => {
  try {
    const secret = MfaService.generateSecret();
    const otpauthUrl = secret.otpauth_url.replace("SecretKey", "Aetherial");
    const qrCode = await MfaService.generateQrCode(otpauthUrl);

    // Temporarily store the secret until it's verified and enabled
    await db.update(users).set({ mfaSecret: secret.base32 }).where(eq(users.id, req.user.userId));

    res.json({ success: true, qrCode, secret: secret.base32 });
  } catch (error) {
    console.error("MFA secret generation error:", error);
    res.status(500).json({ success: false, message: "Failed to generate MFA secret" });
  }
});

// POST /api/mfa/enable - Enable MFA for the user
router.post("/enable", authenticate, async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  try {
    const userResult = await db.select().from(users).where(eq(users.id, req.user.userId));
    const user = userResult[0];

    if (!user || !user.mfaSecret) {
      return res.status(400).json({ success: false, message: "MFA secret not found" });
    }

    const isTokenValid = MfaService.verifyToken(user.mfaSecret, token);

    if (!isTokenValid) {
      return res.status(400).json({ success: false, message: "Invalid MFA token" });
    }

    await db.update(users).set({ mfaEnabled: true }).where(eq(users.id, req.user.userId));

    AuditLogger.log({
      action: "MFA_ENABLE_SUCCESS",
      userId: req.user.userId,
      object: "user",
      objectId: req.user.userId,
      status: "SUCCESS",
    });

    res.json({ success: true, message: "MFA enabled successfully" });
  } catch (error) {
    console.error("MFA enable error:", error);
    res.status(500).json({ success: false, message: "Failed to enable MFA" });
  }
});

// POST /api/mfa/verify - Verify MFA token during login
router.post("/verify", authenticate, async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  try {
    const userResult = await db.select().from(users).where(eq(users.id, req.user.userId));
    const user = userResult[0];

    if (!user || !user.mfaSecret || !user.mfaEnabled) {
      return res.status(400).json({ success: false, message: "MFA is not enabled for this user" });
    }

    const isTokenValid = MfaService.verifyToken(user.mfaSecret, token);

    if (!isTokenValid) {
      AuditLogger.log({
        action: "MFA_VERIFY_FAILURE",
        userId: req.user.userId,
        object: "user",
        objectId: req.user.userId,
        status: "FAILURE",
      });
      return res.status(400).json({ success: false, message: "Invalid MFA token" });
    }

    // If token is valid, the user is considered fully authenticated.
    // The frontend will typically proceed with the login flow.
    AuditLogger.log({
      action: "MFA_VERIFY_SUCCESS",
      userId: req.user.userId,
      object: "user",
      objectId: req.user.userId,
      status: "SUCCESS",
    });

    res.json({ success: true, message: "MFA token verified successfully" });
  } catch (error) {
    console.error("MFA verification error:", error);
    res.status(500).json({ success: false, message: "Failed to verify MFA token" });
  }
});

// POST /api/mfa/disable - Disable MFA for the user
router.post("/disable", authenticate, async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required to disable MFA" });
  }

  try {
    const userResult = await db.select().from(users).where(eq(users.id, req.user.userId));
    const user = userResult[0];

    if (!user || !user.mfaSecret || !user.mfaEnabled) {
      return res.status(400).json({ success: false, message: "MFA is not enabled for this user" });
    }

    const isTokenValid = MfaService.verifyToken(user.mfaSecret, token);

    if (!isTokenValid) {
      return res.status(400).json({ success: false, message: "Invalid MFA token" });
    }

    await db.update(users).set({ mfaEnabled: false, mfaSecret: null }).where(eq(users.id, req.user.userId));

    AuditLogger.log({
      action: "MFA_DISABLE_SUCCESS",
      userId: req.user.userId,
      object: "user",
      objectId: req.user.userId,
      status: "SUCCESS",
    });

    res.json({ success: true, message: "MFA disabled successfully" });
  } catch (error) {
    console.error("MFA disable error:", error);
    res.status(500).json({ success: false, message: "Failed to disable MFA" });
  }
});

export default router;

