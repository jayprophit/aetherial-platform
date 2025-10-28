import { Router } from "express";
import { LiveStreamingService } from "../live-streaming";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const liveStreamingService = new LiveStreamingService();

// Create a new live stream
router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const { title } = req.body;

  try {
    const result = await liveStreamingService.createStream(userId, title);
    res.json({ success: true, streamId: result.lastID });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get all live streams
router.get("/", async (req, res) => {
  try {
    const streams = await liveStreamingService.getStreams();
    res.json({ success: true, streams });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get a specific live stream
router.get("/:streamId", async (req, res) => {
  const streamId = parseInt(req.params.streamId, 10);

  try {
    const stream = await liveStreamingService.getStream(streamId);
    res.json({ success: true, stream });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

