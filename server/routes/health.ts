import { Router } from 'express';
import { HealthMonitor, createDefaultHealthChecks } from '../services/healthMonitor';
import { requireAdmin } from '../middleware/admin';

const router = Router();

// Initialize health monitor
const healthMonitor = new HealthMonitor({
  checkInterval: 60000, // 1 minute
  reportInterval: 300000, // 5 minutes
  reportDuration: 86400000, // 24 hours
  version: '1.0.0',
  alertThresholds: {
    errorCount: 3,
    warningCount: 5,
    responseTime: 5000
  }
});

// Register default health checks
createDefaultHealthChecks(healthMonitor);

// Start scheduler
healthMonitor.startScheduler();

// Public health check endpoint (basic status)
router.get('/status', async (req, res) => {
  try {
    const result = await healthMonitor.performHealthCheck();
    
    const basicStatus = {
      status: result.status,
      timestamp: result.timestamp,
      uptime: process.uptime(),
      version: '1.0.0'
    };

    res.status(result.status === 'healthy' ? 200 : 503).json(basicStatus);
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Detailed health check (admin only)
router.get('/detailed', requireAdmin, async (req, res) => {
  try {
    const checkIds = req.query.checks ? String(req.query.checks).split(',') : undefined;
    const result = await healthMonitor.performHealthCheck(checkIds);
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get health report (admin only)
router.get('/report', requireAdmin, async (req, res) => {
  try {
    const report = await healthMonitor.generateStatusReport();
    res.json(report);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to generate health report',
      message: error.message
    });
  }
});

// Get health history (admin only)
router.get('/history', requireAdmin, async (req, res) => {
  try {
    const checkId = req.query.checkId as string | undefined;
    const duration = req.query.duration ? parseInt(req.query.duration as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

    const history = checkId
      ? await healthMonitor.getCheckHistory(checkId, { duration, limit })
      : await healthMonitor.getCheckHistory('all', { duration, limit });

    res.json({
      checkId: checkId || 'all',
      history
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to retrieve health history',
      message: error.message
    });
  }
});

// Get health trends (admin only)
router.get('/trends', requireAdmin, async (req, res) => {
  try {
    const duration = req.query.duration ? parseInt(req.query.duration as string) : undefined;
    const groupBy = req.query.groupBy as 'hour' | 'day' | 'week' | undefined;

    const trends = await healthMonitor.analyzeHealthTrends({ duration, groupBy });

    res.json(trends);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to analyze health trends',
      message: error.message
    });
  }
});

// Clear health history (admin only)
router.delete('/history', requireAdmin, async (req, res) => {
  try {
    const checkId = req.query.checkId as string | undefined;
    await healthMonitor.clearHistory(checkId);

    res.json({
      success: true,
      message: checkId ? `History cleared for check: ${checkId}` : 'All history cleared'
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to clear health history',
      message: error.message
    });
  }
});

// Readiness probe (for Kubernetes)
router.get('/ready', async (req, res) => {
  try {
    const result = await healthMonitor.performHealthCheck(['database']);
    
    if (result.status === 'healthy') {
      res.status(200).json({ ready: true });
    } else {
      res.status(503).json({ ready: false, reason: 'Database not ready' });
    }
  } catch (error: any) {
    res.status(503).json({ ready: false, reason: error.message });
  }
});

// Liveness probe (for Kubernetes)
router.get('/live', (req, res) => {
  res.status(200).json({ alive: true });
});

export default router;
export { healthMonitor };

