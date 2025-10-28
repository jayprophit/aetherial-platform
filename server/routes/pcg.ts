import { Router } from "express";
import { generateLandscape, generateQuest } from "../pcg";

const router = Router();

// Generate a new landscape
router.get("/landscape", async (req, res) => {
  const { width, height } = req.query;
  const landscape = generateLandscape(parseInt(width as string), parseInt(height as string));
  res.json({ success: true, landscape });
});

// Generate a new quest
router.post("/quest", async (req, res) => {
  const { prompt } = req.body;
  try {
    const quest = await generateQuest(prompt);
    res.json({ success: true, quest });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

