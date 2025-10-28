import { Router } from "express";
import { getDb } from "../db";
import { quests, user_quests } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Get all quests
router.get("/", async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const allQuests = await db.select().from(quests);
  res.json({ success: true, quests: allQuests });
});

// Get user's quests
router.get("/user/:userId", async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const userId = parseInt(req.params.userId);
  const userQuests = await db.select().from(user_quests).where(eq(user_quests.userId, userId));

  res.json({ success: true, userQuests });
});

export default router;

