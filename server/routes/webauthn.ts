import { Router } from "express";
import { getRegistrationOptions, verifyRegistration, getAuthenticationOptions, verifyAuthentication } from "../webauthn";
import { authenticateToken } from "../middleware/auth";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Get registration options
router.get("/register", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const username = req.user!.username;

  try {
    const options = await getRegistrationOptions(userId, username);
    res.json(options);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Verify registration
router.post("/register", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    await verifyRegistration(userId, req.body);
    res.json({ success: true, message: "Registration successful" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get authentication options
router.post("/login", async (req, res) => {
  const { username } = req.body;

  try {
    const options = await getAuthenticationOptions(username);
    res.json(options);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Verify authentication
router.post("/login/verify", async (req, res) => {
  const { username, response } = req.body;

  try {
    const { userId } = await verifyAuthentication(username, response);
    const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

