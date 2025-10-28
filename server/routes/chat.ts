import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { sendMessage } from "../chat";
import { WebSocketManager } from "../websocket";

const router = Router();

// Send a new message
router.post("/", authenticateToken, async (req, res) => {
  const senderId = req.user!.userId;
  const { recipientId, channelId, message } = req.body;
  const wsManager = req.app.locals.wsManager as WebSocketManager;

  try {
    await sendMessage(wsManager, senderId, recipientId, channelId, message);
    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

