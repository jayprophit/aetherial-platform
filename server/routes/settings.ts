import express from 'express';
import { getDb } from '../db';
import { featureToggles, systemSettings, cloudSettings } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin, requireSuperAdmin } from '../middleware/admin';

const router = express.Router();

// ============================================
// FEATURE TOGGLES
// ============================================

// GET /api/settings/features - Get all feature toggles (public + authenticated)
router.get('/features', async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const features = await db.select().from(featureToggles).where(eq(featureToggles.isActive, true));

    // Filter based on user role
    const userRole = (req as any).user?.role || 'public';
    const filteredFeatures = features.map(feature => ({
      featureKey: feature.featureKey,
      featureName: feature.featureName,
      category: feature.category,
      enabled: 
        (userRole === 'owner' || userRole === 'super_admin') ? feature.enabledForOwner :
        userRole === 'admin' ? feature.enabledForAdmin :
        userRole === 'user' ? feature.enabledForUsers :
        feature.enabledForPublic,
    }));

    res.json({ features: filteredFeatures });
  } catch (error) {
    console.error('Get features error:', error);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

// GET /api/settings/features/all - Get all feature toggles with full details (admin only)
router.get('/features/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const features = await db.select().from(featureToggles);
    res.json({ features });
  } catch (error) {
    console.error('Get all features error:', error);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

// POST /api/settings/features - Create feature toggle (admin only)
router.post('/features', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      featureKey,
      featureName,
      description,
      category,
      enabledForPublic = false,
      enabledForUsers = true,
      enabledForAdmin = true,
      enabledForOwner = true,
      requiresSetup = false,
      setupInstructions,
    } = req.body;

    if (!featureKey || !featureName || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const [feature] = await db.insert(featureToggles).values({
      featureKey,
      featureName,
      description,
      category,
      enabledForPublic,
      enabledForUsers,
      enabledForAdmin,
      enabledForOwner,
      requiresSetup,
      setupInstructions,
    });

    res.status(201).json({ feature });
  } catch (error) {
    console.error('Create feature error:', error);
    res.status(500).json({ error: 'Failed to create feature' });
  }
});

// PUT /api/settings/features/:id - Update feature toggle (admin only)
router.put('/features/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const featureId = parseInt(req.params.id);
    const updateData = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    await db.update(featureToggles).set(updateData).where(eq(featureToggles.id, featureId));

    const [updatedFeature] = await db.select().from(featureToggles).where(eq(featureToggles.id, featureId));

    res.json({ feature: updatedFeature });
  } catch (error) {
    console.error('Update feature error:', error);
    res.status(500).json({ error: 'Failed to update feature' });
  }
});

// DELETE /api/settings/features/:id - Delete feature toggle (super admin only)
router.delete('/features/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const featureId = parseInt(req.params.id);

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    await db.delete(featureToggles).where(eq(featureToggles.id, featureId));

    res.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Delete feature error:', error);
    res.status(500).json({ error: 'Failed to delete feature' });
  }
});

// ============================================
// SYSTEM SETTINGS
// ============================================

// GET /api/settings/system - Get all system settings
router.get('/system', async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const isAdmin = (req as any).user?.role === 'admin' || (req as any).user?.role === 'super_admin';
    
    let settings;
    if (isAdmin) {
      settings = await db.select().from(systemSettings);
    } else {
      settings = await db.select().from(systemSettings).where(eq(systemSettings.isPublic, true));
    }

    res.json({ settings });
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// POST /api/settings/system - Create system setting (admin only)
router.post('/system', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      settingKey,
      settingName,
      settingValue,
      settingType,
      category,
      description,
      isPublic = false,
    } = req.body;

    if (!settingKey || !settingName || !settingType || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const [setting] = await db.insert(systemSettings).values({
      settingKey,
      settingName,
      settingValue,
      settingType,
      category,
      description,
      isPublic,
    });

    res.status(201).json({ setting });
  } catch (error) {
    console.error('Create setting error:', error);
    res.status(500).json({ error: 'Failed to create setting' });
  }
});

// PUT /api/settings/system/:key - Update system setting (admin only)
router.put('/system/:key', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settingKey = req.params.key;
    const { settingValue } = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    await db.update(systemSettings)
      .set({ settingValue })
      .where(eq(systemSettings.settingKey, settingKey));

    const [updatedSetting] = await db.select().from(systemSettings).where(eq(systemSettings.settingKey, settingKey));

    res.json({ setting: updatedSetting });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// ============================================
// CLOUD HOSTING SETTINGS
// ============================================

// GET /api/settings/cloud - Get cloud hosting settings (admin only)
router.get('/cloud', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const settings = await db.select().from(cloudSettings).where(eq(cloudSettings.isActive, true));

    res.json({ settings });
  } catch (error) {
    console.error('Get cloud settings error:', error);
    res.status(500).json({ error: 'Failed to fetch cloud settings' });
  }
});

// POST /api/settings/cloud - Create cloud hosting config (super admin only)
router.post('/cloud', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const {
      provider,
      region,
      instanceType,
      storageType,
      storageSize,
      bandwidth,
      autoScaling = false,
      minInstances = 1,
      maxInstances = 10,
      cdnEnabled = false,
      cdnProvider,
      backupEnabled = true,
      backupFrequency = 'daily',
      monitoringEnabled = true,
    } = req.body;

    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const [setting] = await db.insert(cloudSettings).values({
      provider,
      region,
      instanceType,
      storageType,
      storageSize,
      bandwidth,
      autoScaling,
      minInstances,
      maxInstances,
      cdnEnabled,
      cdnProvider,
      backupEnabled,
      backupFrequency,
      monitoringEnabled,
    });

    res.status(201).json({ setting });
  } catch (error) {
    console.error('Create cloud setting error:', error);
    res.status(500).json({ error: 'Failed to create cloud setting' });
  }
});

// PUT /api/settings/cloud/:id - Update cloud hosting config (super admin only)
router.put('/cloud/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const settingId = parseInt(req.params.id);
    const updateData = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    await db.update(cloudSettings).set(updateData).where(eq(cloudSettings.id, settingId));

    const [updatedSetting] = await db.select().from(cloudSettings).where(eq(cloudSettings.id, settingId));

    res.json({ setting: updatedSetting });
  } catch (error) {
    console.error('Update cloud setting error:', error);
    res.status(500).json({ error: 'Failed to update cloud setting' });
  }
});

export default router;

