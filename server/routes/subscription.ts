/**
 * AETHERIAL Subscription API Routes
 * 
 * Military-Grade Subscription Management
 * 
 * Endpoints:
 * - GET /api/subscription/tiers - Get all membership tiers
 * - GET /api/subscription/current - Get current subscription
 * - GET /api/subscription/usage - Get usage statistics
 * - POST /api/subscription/upgrade - Upgrade subscription
 * - POST /api/subscription/cancel - Cancel subscription
 * - GET /api/subscription/billing-history - Get billing history
 * 
 * @module routes/subscription
 */

import { Router } from 'express';
import { db } from '../db';
import { subscriptions, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getAllTiers, getTier, hasPermission, isWithinLimit, getRemainingQuota } from '../config/membership-tiers';

const router = Router();

/**
 * Get all membership tiers
 */
router.get('/tiers', async (req, res) => {
  try {
    const tiers = getAllTiers();
    
    res.json({
      success: true,
      tiers
    });
  } catch (error) {
    console.error('Failed to load tiers:', error);
    res.status(500).json({ error: 'Failed to load tiers' });
  }
});

/**
 * Get current subscription
 */
router.get('/current', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get subscription from database
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);
    
    if (!subscription) {
      // Return free tier as default
      return res.json({
        success: true,
        subscription: {
          id: 0,
          userId,
          tier: 'free',
          billingCycle: 'monthly',
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: false,
          paymentMethod: 'none'
        }
      });
    }
    
    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Failed to load subscription:', error);
    res.status(500).json({ error: 'Failed to load subscription' });
  }
});

/**
 * Get usage statistics
 */
router.get('/usage', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get current subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);
    
    const tier = subscription ? getTier(subscription.tier) : getTier('free');
    
    if (!tier) {
      return res.status(500).json({ error: 'Invalid tier' });
    }
    
    // Calculate usage (in production, fetch from database)
    // For now, return mock data
    const usage = {
      storage: {
        used: 0.5,
        limit: tier.limits.storage
      },
      apiCalls: {
        used: 250,
        limit: tier.limits.apiCalls
      },
      projects: {
        used: 2,
        limit: tier.limits.projects
      },
      teamMembers: {
        used: 1,
        limit: tier.limits.teamMembers
      },
      aiRequests: {
        used: 45,
        limit: tier.limits.aiRequests
      }
    };
    
    res.json({
      success: true,
      usage
    });
  } catch (error) {
    console.error('Failed to load usage:', error);
    res.status(500).json({ error: 'Failed to load usage' });
  }
});

/**
 * Upgrade subscription
 */
router.post('/upgrade', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { tierId, billingCycle } = req.body;
    
    if (!tierId || !billingCycle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const tier = getTier(tierId);
    
    if (!tier) {
      return res.status(400).json({ error: 'Invalid tier' });
    }
    
    // If upgrading to free tier, just update subscription
    if (tierId === 'free') {
      await db
        .update(subscriptions)
        .set({
          tier: tierId,
          billingCycle,
          status: 'active',
          updatedAt: new Date()
        })
        .where(eq(subscriptions.userId, userId));
      
      return res.json({
        success: true,
        message: 'Subscription updated'
      });
    }
    
    // For paid tiers, create payment session
    // In production, integrate with Stripe/PayPal
    const price = billingCycle === 'monthly' ? tier.price.monthly : tier.price.yearly;
    
    // Mock payment URL - in production, create actual Stripe checkout session
    const checkoutUrl = `/payment/checkout?tier=${tierId}&cycle=${billingCycle}&price=${price}`;
    
    res.json({
      success: true,
      checkoutUrl
    });
  } catch (error) {
    console.error('Failed to upgrade subscription:', error);
    res.status(500).json({ error: 'Failed to upgrade subscription' });
  }
});

/**
 * Cancel subscription
 */
router.post('/cancel', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Update subscription status
    await db
      .update(subscriptions)
      .set({
        status: 'cancelled',
        autoRenew: false,
        updatedAt: new Date()
      })
      .where(eq(subscriptions.userId, userId));
    
    res.json({
      success: true,
      message: 'Subscription cancelled. You will retain access until the end of your billing period.'
    });
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

/**
 * Get billing history
 */
router.get('/billing-history', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // In production, fetch from payment provider (Stripe, etc.)
    // For now, return mock data
    const history = [
      {
        id: 1,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 29.00,
        status: 'paid',
        description: 'Pro Plan - Monthly',
        invoiceUrl: '/invoices/1'
      }
    ];
    
    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Failed to load billing history:', error);
    res.status(500).json({ error: 'Failed to load billing history' });
  }
});

/**
 * Check permission middleware
 */
export function requirePermission(permission: string) {
  return async (req: any, res: any, next: any) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get user's subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);
    
    const tier = subscription ? subscription.tier : 'free';
    
    if (!hasPermission(tier, permission)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        requiredPermission: permission,
        currentTier: tier
      });
    }
    
    next();
  };
}

/**
 * Check limit middleware
 */
export function checkLimit(limitType: string) {
  return async (req: any, res: any, next: any) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get user's subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);
    
    const tier = subscription ? subscription.tier : 'free';
    
    // Get current usage (in production, fetch from database)
    const currentUsage = 0; // TODO: Implement usage tracking
    
    if (!isWithinLimit(tier, limitType as any, currentUsage)) {
      const remaining = getRemainingQuota(tier, limitType as any, currentUsage);
      
      return res.status(429).json({ 
        error: 'Limit exceeded',
        limitType,
        currentTier: tier,
        remaining
      });
    }
    
    next();
  };
}

export default router;

