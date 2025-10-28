import { Router } from 'express';
import { db } from '../db';
import { 
  rewardsCatalog, 
  userRewards,
  points,
  pointsTransactions
} from '../../db/schema/points';
import { eq, desc, and, sql } from 'drizzle-orm';

const router = Router();

/**
 * Get rewards catalog
 * GET /api/rewards/catalog
 */
router.get('/catalog', async (req, res) => {
  try {
    const { category, active = 'true' } = req.query;

    let query = db.select().from(rewardsCatalog);

    if (active === 'true') {
      query = query.where(eq(rewardsCatalog.isActive, true));
    }

    const rewards = await query;

    // Filter by category if provided
    const filteredRewards = category 
      ? rewards.filter(r => r.category === category)
      : rewards;

    res.json(filteredRewards);
  } catch (error) {
    console.error('Error fetching rewards catalog:', error);
    res.status(500).json({ error: 'Failed to fetch rewards catalog' });
  }
});

/**
 * Get single reward details
 * GET /api/rewards/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const reward = await db.query.rewardsCatalog.findFirst({
      where: eq(rewardsCatalog.id, parseInt(id)),
    });

    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    res.json(reward);
  } catch (error) {
    console.error('Error fetching reward:', error);
    res.status(500).json({ error: 'Failed to fetch reward' });
  }
});

/**
 * Redeem a reward
 * POST /api/rewards/redeem
 * Body: { rewardId }
 */
router.post('/redeem', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { rewardId } = req.body;

    if (!rewardId) {
      return res.status(400).json({ error: 'Reward ID is required' });
    }

    // Get reward details
    const reward = await db.query.rewardsCatalog.findFirst({
      where: eq(rewardsCatalog.id, rewardId),
    });

    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    if (!reward.isActive) {
      return res.status(400).json({ error: 'Reward is not available' });
    }

    // Check stock
    if (reward.stock !== null && reward.stock <= 0) {
      return res.status(400).json({ error: 'Reward is out of stock' });
    }

    // Get user points
    const userPoints = await db.query.points.findFirst({
      where: eq(points.userId, userId),
    });

    if (!userPoints) {
      return res.status(404).json({ error: 'User points not found' });
    }

    // Check if user has enough points
    if (userPoints.availablePoints < reward.pointsCost) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    // Check maxPerUser limit
    if (reward.maxPerUser) {
      const userRedemptions = await db.select()
        .from(userRewards)
        .where(and(
          eq(userRewards.userId, userId),
          eq(userRewards.rewardId, rewardId)
        ));

      if (userRedemptions.length >= reward.maxPerUser) {
        return res.status(400).json({ error: 'Maximum redemptions reached for this reward' });
      }
    }

    // Calculate expiration date
    const expiresAt = reward.validDays 
      ? new Date(Date.now() + reward.validDays * 24 * 60 * 60 * 1000)
      : null;

    // Create user reward record
    const [userReward] = await db.insert(userRewards).values({
      userId,
      rewardId,
      pointsSpent: reward.pointsCost,
      status: 'active',
      expiresAt,
      rewardSnapshot: {
        name: reward.name,
        description: reward.description,
        rewardType: reward.rewardType,
        rewardValue: reward.rewardValue,
        category: reward.category,
      },
    }).returning();

    // Deduct points
    const balanceBefore = userPoints.availablePoints;
    const balanceAfter = balanceBefore - reward.pointsCost;

    await db.insert(pointsTransactions).values({
      userId,
      type: 'spend',
      category: 'rewards',
      activity: 'redeem_reward',
      points: -reward.pointsCost,
      balanceBefore,
      balanceAfter,
      referenceType: 'reward',
      referenceId: rewardId,
      description: `Redeemed reward: ${reward.name}`,
    });

    await db.update(points)
      .set({
        availablePoints: sql`${points.availablePoints} - ${reward.pointsCost}`,
        usedPoints: sql`${points.usedPoints} + ${reward.pointsCost}`,
        lifetimeSpent: sql`${points.lifetimeSpent} + ${reward.pointsCost}`,
        updatedAt: new Date(),
      })
      .where(eq(points.userId, userId));

    // Update stock if limited
    if (reward.stock !== null) {
      await db.update(rewardsCatalog)
        .set({
          stock: sql`${rewardsCatalog.stock} - 1`,
          updatedAt: new Date(),
        })
        .where(eq(rewardsCatalog.id, rewardId));
    }

    res.json({
      success: true,
      userReward,
      pointsSpent: reward.pointsCost,
      newBalance: balanceAfter,
    });
  } catch (error) {
    console.error('Error redeeming reward:', error);
    res.status(500).json({ error: 'Failed to redeem reward' });
  }
});

/**
 * Get user's redeemed rewards
 * GET /api/rewards/my-rewards
 */
router.get('/my-rewards', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status, limit = 50, offset = 0 } = req.query;

    let query = db.select().from(userRewards)
      .where(eq(userRewards.userId, userId))
      .orderBy(desc(userRewards.redeemedAt))
      .limit(Number(limit))
      .offset(Number(offset));

    const rewards = await query;

    // Filter by status if provided
    const filteredRewards = status 
      ? rewards.filter(r => r.status === status)
      : rewards;

    res.json({
      rewards: filteredRewards,
      total: filteredRewards.length,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    res.status(500).json({ error: 'Failed to fetch user rewards' });
  }
});

/**
 * Use a redeemed reward
 * POST /api/rewards/use/:id
 */
router.post('/use/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const userReward = await db.query.userRewards.findFirst({
      where: and(
        eq(userRewards.id, parseInt(id)),
        eq(userRewards.userId, userId)
      ),
    });

    if (!userReward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    if (userReward.status !== 'active') {
      return res.status(400).json({ error: 'Reward is not active' });
    }

    if (userReward.expiresAt && new Date() > userReward.expiresAt) {
      return res.status(400).json({ error: 'Reward has expired' });
    }

    // Mark as used
    await db.update(userRewards)
      .set({
        status: 'used',
        usedAt: new Date(),
      })
      .where(eq(userRewards.id, parseInt(id)));

    res.json({
      success: true,
      message: 'Reward used successfully',
    });
  } catch (error) {
    console.error('Error using reward:', error);
    res.status(500).json({ error: 'Failed to use reward' });
  }
});

/**
 * Get reward categories
 * GET /api/rewards/categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await db.select({
      category: rewardsCatalog.category,
      count: sql<number>`COUNT(*)`,
    })
      .from(rewardsCatalog)
      .where(eq(rewardsCatalog.isActive, true))
      .groupBy(rewardsCatalog.category);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * Admin: Create reward
 * POST /api/rewards/admin/create
 */
router.post('/admin/create', async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!userId || !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const rewardData = req.body;

    const [newReward] = await db.insert(rewardsCatalog).values(rewardData).returning();

    res.json({
      success: true,
      reward: newReward,
    });
  } catch (error) {
    console.error('Error creating reward:', error);
    res.status(500).json({ error: 'Failed to create reward' });
  }
});

/**
 * Admin: Update reward
 * PUT /api/rewards/admin/:id
 */
router.put('/admin/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!userId || !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { id } = req.params;
    const updateData = req.body;

    await db.update(rewardsCatalog)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(rewardsCatalog.id, parseInt(id)));

    const updatedReward = await db.query.rewardsCatalog.findFirst({
      where: eq(rewardsCatalog.id, parseInt(id)),
    });

    res.json({
      success: true,
      reward: updatedReward,
    });
  } catch (error) {
    console.error('Error updating reward:', error);
    res.status(500).json({ error: 'Failed to update reward' });
  }
});

/**
 * Admin: Delete reward
 * DELETE /api/rewards/admin/:id
 */
router.delete('/admin/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!userId || !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { id } = req.params;

    // Soft delete by marking as inactive
    await db.update(rewardsCatalog)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(rewardsCatalog.id, parseInt(id)));

    res.json({
      success: true,
      message: 'Reward deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting reward:', error);
    res.status(500).json({ error: 'Failed to delete reward' });
  }
});

export default router;

