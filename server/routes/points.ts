import { Router } from 'express';
import { db } from '../db';
import { 
  points, 
  pointsTransactions, 
  pointsEarningRules,
  insertPointsTransactionSchema 
} from '../../db/schema/points';
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';

const router = Router();

/**
 * Get user's points balance and stats
 * GET /api/points
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userPoints = await db.query.points.findFirst({
      where: eq(points.userId, userId),
    });

    if (!userPoints) {
      // Create initial points record
      const [newPoints] = await db.insert(points).values({
        userId,
        totalPoints: 0,
        availablePoints: 0,
        usedPoints: 0,
        lifetimeEarned: 0,
        lifetimeSpent: 0,
        membershipTier: 'bronze',
      }).returning();

      return res.json(newPoints);
    }

    res.json(userPoints);
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ error: 'Failed to fetch points' });
  }
});

/**
 * Get points transaction history
 * GET /api/points/transactions
 */
router.get('/transactions', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { limit = 50, offset = 0, type, category } = req.query;

    let query = db.select().from(pointsTransactions)
      .where(eq(pointsTransactions.userId, userId))
      .orderBy(desc(pointsTransactions.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    const transactions = await query;

    res.json({
      transactions,
      total: transactions.length,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * Award points to user
 * POST /api/points/award
 * Body: { category, activity, points, referenceType?, referenceId?, description? }
 */
router.post('/award', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { category, activity, points: pointsAmount, referenceType, referenceId, description } = req.body;

    if (!category || !activity || !pointsAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get current points
    const userPoints = await db.query.points.findFirst({
      where: eq(points.userId, userId),
    });

    if (!userPoints) {
      return res.status(404).json({ error: 'User points not found' });
    }

    const balanceBefore = userPoints.availablePoints;
    const balanceAfter = balanceBefore + pointsAmount;

    // Create transaction
    await db.insert(pointsTransactions).values({
      userId,
      type: 'earn',
      category,
      activity,
      points: pointsAmount,
      balanceBefore,
      balanceAfter,
      referenceType,
      referenceId,
      description: description || `Earned ${pointsAmount} points for ${activity}`,
    });

    // Update user points
    await db.update(points)
      .set({
        totalPoints: sql`${points.totalPoints} + ${pointsAmount}`,
        availablePoints: sql`${points.availablePoints} + ${pointsAmount}`,
        lifetimeEarned: sql`${points.lifetimeEarned} + ${pointsAmount}`,
        updatedAt: new Date(),
      })
      .where(eq(points.userId, userId));

    // Get updated points
    const updatedPoints = await db.query.points.findFirst({
      where: eq(points.userId, userId),
    });

    res.json({
      success: true,
      pointsAwarded: pointsAmount,
      newBalance: updatedPoints?.availablePoints,
      transaction: {
        type: 'earn',
        category,
        activity,
        points: pointsAmount,
      },
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    res.status(500).json({ error: 'Failed to award points' });
  }
});

/**
 * Spend points
 * POST /api/points/spend
 * Body: { points, category, activity, referenceType?, referenceId?, description? }
 */
router.post('/spend', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { points: pointsAmount, category, activity, referenceType, referenceId, description } = req.body;

    if (!pointsAmount || !category || !activity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get current points
    const userPoints = await db.query.points.findFirst({
      where: eq(points.userId, userId),
    });

    if (!userPoints) {
      return res.status(404).json({ error: 'User points not found' });
    }

    if (userPoints.availablePoints < pointsAmount) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    const balanceBefore = userPoints.availablePoints;
    const balanceAfter = balanceBefore - pointsAmount;

    // Create transaction
    await db.insert(pointsTransactions).values({
      userId,
      type: 'spend',
      category,
      activity,
      points: -pointsAmount,
      balanceBefore,
      balanceAfter,
      referenceType,
      referenceId,
      description: description || `Spent ${pointsAmount} points on ${activity}`,
    });

    // Update user points
    await db.update(points)
      .set({
        availablePoints: sql`${points.availablePoints} - ${pointsAmount}`,
        usedPoints: sql`${points.usedPoints} + ${pointsAmount}`,
        lifetimeSpent: sql`${points.lifetimeSpent} + ${pointsAmount}`,
        updatedAt: new Date(),
      })
      .where(eq(points.userId, userId));

    // Get updated points
    const updatedPoints = await db.query.points.findFirst({
      where: eq(points.userId, userId),
    });

    res.json({
      success: true,
      pointsSpent: pointsAmount,
      newBalance: updatedPoints?.availablePoints,
      transaction: {
        type: 'spend',
        category,
        activity,
        points: -pointsAmount,
      },
    });
  } catch (error) {
    console.error('Error spending points:', error);
    res.status(500).json({ error: 'Failed to spend points' });
  }
});

/**
 * Get points earning rules
 * GET /api/points/rules
 */
router.get('/rules', async (req, res) => {
  try {
    const rules = await db.select()
      .from(pointsEarningRules)
      .where(eq(pointsEarningRules.isActive, true));

    res.json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
});

/**
 * Get points leaderboard
 * GET /api/points/leaderboard
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 100, period = 'all' } = req.query;

    const leaderboard = await db.select({
      userId: points.userId,
      totalPoints: points.totalPoints,
      membershipTier: points.membershipTier,
    })
      .from(points)
      .orderBy(desc(points.totalPoints))
      .limit(Number(limit));

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

/**
 * Get points analytics
 * GET /api/points/analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get points by category
    const byCategory = await db.select({
      category: pointsTransactions.category,
      totalPoints: sql<number>`SUM(CASE WHEN ${pointsTransactions.type} = 'earn' THEN ${pointsTransactions.points} ELSE 0 END)`,
      transactions: sql<number>`COUNT(*)`,
    })
      .from(pointsTransactions)
      .where(eq(pointsTransactions.userId, userId))
      .groupBy(pointsTransactions.category);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await db.select({
      date: sql<string>`DATE(${pointsTransactions.createdAt})`,
      earned: sql<number>`SUM(CASE WHEN ${pointsTransactions.type} = 'earn' THEN ${pointsTransactions.points} ELSE 0 END)`,
      spent: sql<number>`SUM(CASE WHEN ${pointsTransactions.type} = 'spend' THEN ABS(${pointsTransactions.points}) ELSE 0 END)`,
    })
      .from(pointsTransactions)
      .where(and(
        eq(pointsTransactions.userId, userId),
        gte(pointsTransactions.createdAt, thirtyDaysAgo)
      ))
      .groupBy(sql`DATE(${pointsTransactions.createdAt})`)
      .orderBy(sql`DATE(${pointsTransactions.createdAt})`);

    res.json({
      byCategory,
      recentActivity,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;

