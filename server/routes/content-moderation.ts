import { Router } from "express";
import { ContentModerationService } from "../content-moderation";

const router = Router();
const cmService = new ContentModerationService();

// Moderate a piece of text
router.post("/", async (req, res) => {
  const { text } = req.body;

  try {
    const result = await cmService.moderate(text);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

