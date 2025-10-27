import express from 'express';
import { getDb } from '../db';
import { platformSections } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';
import { requireSuperAdmin } from '../middleware/admin';

const router = express.Router();

// GET /api/platform/sections - Get all platform sections
router.get('/sections', async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const sections = await db.select().from(platformSections);

    res.json({ sections });
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
});

// GET /api/platform/sections/:key - Get specific section status
router.get('/sections/:key', async (req, res) => {
  try {
    const sectionKey = req.params.key;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const [section] = await db
      .select()
      .from(platformSections)
      .where(eq(platformSections.sectionKey, sectionKey))
      .limit(1);

    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json({ section });
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ error: 'Failed to fetch section' });
  }
});

// POST /api/platform/sections - Create platform section (owner only)
router.post('/sections', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const {
      sectionKey,
      sectionName,
      description,
      isEnabled = true,
      icon,
      displayOrder = 0,
    } = req.body;

    if (!sectionKey || !sectionName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const [section] = await db.insert(platformSections).values({
      sectionKey,
      sectionName,
      description,
      isEnabled,
      icon,
      displayOrder,
    });

    res.status(201).json({ section });
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({ error: 'Failed to create section' });
  }
});

// PUT /api/platform/sections/:key/toggle - Toggle section on/off (owner only)
router.put('/sections/:key/toggle', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const sectionKey = req.params.key;
    const { isEnabled } = req.body;

    if (typeof isEnabled !== 'boolean') {
      return res.status(400).json({ error: 'isEnabled must be a boolean' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    await db
      .update(platformSections)
      .set({ isEnabled })
      .where(eq(platformSections.sectionKey, sectionKey));

    const [updated] = await db
      .select()
      .from(platformSections)
      .where(eq(platformSections.sectionKey, sectionKey));

    res.json({ 
      message: `Section ${isEnabled ? 'enabled' : 'disabled'} successfully`,
      section: updated 
    });
  } catch (error) {
    console.error('Toggle section error:', error);
    res.status(500).json({ error: 'Failed to toggle section' });
  }
});

// PUT /api/platform/sections/:key/maintenance - Set maintenance mode (owner only)
router.put('/sections/:key/maintenance', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const sectionKey = req.params.key;
    const { inMaintenance, maintenanceMessage, maintenanceStartAt, maintenanceEndAt } = req.body;

    if (typeof inMaintenance !== 'boolean') {
      return res.status(400).json({ error: 'inMaintenance must be a boolean' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const updateData: any = { inMaintenance };
    if (maintenanceMessage) updateData.maintenanceMessage = maintenanceMessage;
    if (maintenanceStartAt) updateData.maintenanceStartAt = new Date(maintenanceStartAt);
    if (maintenanceEndAt) updateData.maintenanceEndAt = new Date(maintenanceEndAt);

    await db
      .update(platformSections)
      .set(updateData)
      .where(eq(platformSections.sectionKey, sectionKey));

    const [updated] = await db
      .select()
      .from(platformSections)
      .where(eq(platformSections.sectionKey, sectionKey));

    res.json({ 
      message: `Maintenance mode ${inMaintenance ? 'enabled' : 'disabled'} for section`,
      section: updated 
    });
  } catch (error) {
    console.error('Set maintenance error:', error);
    res.status(500).json({ error: 'Failed to set maintenance mode' });
  }
});

// PUT /api/platform/maintenance - Set platform-wide maintenance mode (owner only)
router.put('/maintenance', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { inMaintenance, maintenanceMessage } = req.body;

    if (typeof inMaintenance !== 'boolean') {
      return res.status(400).json({ error: 'inMaintenance must be a boolean' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Update all sections
    await db
      .update(platformSections)
      .set({ 
        inMaintenance,
        maintenanceMessage: maintenanceMessage || 'Platform is currently under maintenance. Please check back soon.',
      });

    res.json({ 
      message: `Platform-wide maintenance mode ${inMaintenance ? 'enabled' : 'disabled'}`,
    });
  } catch (error) {
    console.error('Set platform maintenance error:', error);
    res.status(500).json({ error: 'Failed to set platform maintenance mode' });
  }
});

// PUT /api/platform/sections/:key - Update section details (owner only)
router.put('/sections/:key', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const sectionKey = req.params.key;
    const updateData = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    await db
      .update(platformSections)
      .set(updateData)
      .where(eq(platformSections.sectionKey, sectionKey));

    const [updated] = await db
      .select()
      .from(platformSections)
      .where(eq(platformSections.sectionKey, sectionKey));

    res.json({ section: updated });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ error: 'Failed to update section' });
  }
});

export default router;

