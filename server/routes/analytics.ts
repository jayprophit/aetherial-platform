import { Router } from "express";
import { AnalyticsService } from "../analytics";

const router = Router();
const analyticsService = new AnalyticsService();

// Get daily active users
router.get("/dau", async (req, res) => {
  try {
    const result = await analyticsService.getDailyActiveUsers();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get monthly active users
router.get("/mau", async (req, res) => {
  try {
    const result = await analyticsService.getMonthlyActiveUsers();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get new users
router.get("/new-users", async (req, res) => {
  try {
    const result = await analyticsService.getNewUsers();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

