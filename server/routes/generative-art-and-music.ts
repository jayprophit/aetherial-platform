import { Router } from "express";
import { GenerativeArtAndMusicService } from "../generative-art-and-music";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const generativeArtAndMusicService = new GenerativeArtAndMusicService();

// Generate art
router.post("/art", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const { prompt } = req.body;

  try {
    const result = await generativeArtAndMusicService.generateArt(userId, prompt);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Generate music
router.post("/music", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const { prompt } = req.body;

  try {
    const result = await generativeArtAndMusicService.generateMusic(userId, prompt);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

