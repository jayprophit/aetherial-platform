import { Router } from "express";
import { CloudGamingService } from "../cloud-gaming";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const cloudGamingService = new CloudGamingService();

// Create a new cloud gaming session
router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const { gameId } = req.body;

  try {
    const result = await cloudGamingService.createSession(userId, gameId);
    res.json({ success: true, sessionId: result.lastID });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get a specific cloud gaming session
router.get("/:sessionId", async (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10);

  try {
    const session = await cloudGamingService.getSession(sessionId);
    res.json({ success: true, session });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// End a cloud gaming session
router.post("/:sessionId/end", authenticateToken, async (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10);

  try {
    await cloudGamingService.endSession(sessionId);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

