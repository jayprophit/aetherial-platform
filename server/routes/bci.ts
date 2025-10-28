import { Router } from "express";
import { BCIService } from "../bci";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const bciService = new BCIService();

// Register a new BCI device
router.post("/register", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const { deviceId } = req.body;

  try {
    const result = await bciService.registerDevice(userId, deviceId);
    res.json({ success: true, deviceId: result.lastID });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get the BCI device for a user
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const device = await bciService.getDevice(userId);
    res.json({ success: true, device });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

