import { Router } from "express";
import { getDb } from "../db";
import { user_points, badges, user_badges, users } from "../../drizzle/schema";
import { eq, sql, desc } from "drizzle-orm";

const router = Router();

// Get user points and badges
router.get("/user/:userId", async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const userId = parseInt(req.params.userId);

  const pointsResult = await db.select({ totalPoints: sql<number>`sum(${user_points.points})` }).from(user_points).where(eq(user_points.userId, userId));
  const totalPoints = Number(pointsResult[0].totalPoints) || 0;

  const userBadgesResult = await db.select().from(user_badges).innerJoin(badges, eq(user_badges.badgeId, badges.id)).where(eq(user_badges.userId, userId));

  res.json({
    success: true,
    points: totalPoints,
    badges: userBadgesResult.map(b => b.badges),
  });
});

// Get leaderboards
router.get("/leaderboard", async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const leaderboard = await db.select({
    userId: user_points.userId,
    username: users.username,
    displayName: users.displayName,
    avatar: users.avatar,
    totalPoints: sql<number>`sum(${user_points.points})`,
  })
  .from(user_points)
  .innerJoin(users, eq(user_points.userId, users.id))
  .groupBy(user_points.userId)
  .orderBy(desc(sql<number>`sum(${user_points.points})`))
  .limit(100);

  res.json({ success: true, leaderboard });
});

export default router;

