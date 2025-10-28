import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { createGame } from "../gameEngine";

const router = Router();

// Create a new game
router.post("/", authenticateToken, async (req, res) => {
  const { gameType, players } = req.body;

  try {
    await createGame(gameType, players);
    res.json({ success: true, message: "Game created successfully" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

