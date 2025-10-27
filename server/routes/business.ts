import express from 'express';
import { getDb } from '../db';
import { businessRegistrations } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = express.Router();

// POST /api/business/register - Register as a business
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const {
      businessName,
      businessType,
      businessEmail,
      businessPhone,
      businessAddress,
      taxId,
      website,
      description,
      logo,
    } = req.body;

    if (!businessName || !businessType || !businessEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Check if user already has a business registration
    const [existing] = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, userId))
      .limit(1);

    if (existing) {
      return res.status(400).json({ error: 'Business already registered' });
    }

    const [registration] = await db.insert(businessRegistrations).values({
      userId,
      businessName,
      businessType,
      businessEmail,
      businessPhone,
      businessAddress,
      taxId,
      website,
      description,
      logo,
      status: 'pending',
    });

    res.status(201).json({ 
      message: 'Business registration submitted for review',
      registration 
    });
  } catch (error) {
    console.error('Business registration error:', error);
    res.status(500).json({ error: 'Failed to register business' });
  }
});

// GET /api/business/status - Get current user's business registration status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const [registration] = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, userId))
      .limit(1);

    if (!registration) {
      return res.json({ registered: false });
    }

    res.json({ 
      registered: true,
      status: registration.status,
      businessType: registration.businessType,
      registration 
    });
  } catch (error) {
    console.error('Get business status error:', error);
    res.status(500).json({ error: 'Failed to fetch business status' });
  }
});

// GET /api/business/registrations - Get all business registrations (admin only)
router.get('/registrations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    let query = db.select().from(businessRegistrations);

    if (status) {
      query = query.where(eq(businessRegistrations.status, status as string));
    }

    const registrations = await query;

    res.json({ registrations });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// PUT /api/business/registrations/:id - Update business registration status (admin only)
router.put('/registrations/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const registrationId = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const updateData: any = { status };
    if (status === 'approved') {
      updateData.verifiedAt = new Date();
    }

    await db
      .update(businessRegistrations)
      .set(updateData)
      .where(eq(businessRegistrations.id, registrationId));

    const [updated] = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.id, registrationId));

    res.json({ registration: updated });
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({ error: 'Failed to update registration' });
  }
});

// PUT /api/business/profile - Update business profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const updateData = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    await db
      .update(businessRegistrations)
      .set(updateData)
      .where(eq(businessRegistrations.userId, userId));

    const [updated] = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, userId));

    res.json({ registration: updated });
  } catch (error) {
    console.error('Update business profile error:', error);
    res.status(500).json({ error: 'Failed to update business profile' });
  }
});

export default router;

