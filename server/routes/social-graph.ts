import { Router } from "express";
import { SocialGraphService } from "../social-graph";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const socialGraphService = new SocialGraphService();

// Get followers
router.get("/followers", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const followers = await socialGraphService.getFollowers(userId);
    res.json({ success: true, followers });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get following
router.get("/following", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const following = await socialGraphService.getFollowing(userId);
    res.json({ success: true, following });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get friends
router.get("/friends", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const friends = await socialGraphService.getFriends(userId);
    res.json({ success: true, friends });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get social feed
router.get("/feed", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const feed = await socialGraphService.getSocialFeed(userId);
    res.json({ success: true, feed });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

