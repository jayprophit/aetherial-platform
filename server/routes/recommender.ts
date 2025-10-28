import { Router } from "express";
import { RecommenderService } from "../recommender";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const recommenderService = new RecommenderService();

// Get recommendations for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const recommendations = await recommenderService.getRecommendations(userId);
    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

