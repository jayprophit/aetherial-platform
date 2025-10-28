import { Router } from 'express';
import { getPerformanceStats, performanceMonitor } from '../middleware/performance';

const router = Router();

/**
 * GET /api/performance/stats
 * Get current performance statistics
 */
router.get('/stats', (req, res) => {
  try {
    const stats = getPerformanceStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve performance stats' });
  }
});

/**
 * GET /api/performance/metrics
 * Get detailed performance metrics
 */
router.get('/metrics', (req, res) => {
  try {
    const metrics = performanceMonitor.getMetrics();
    res.json({
      total: metrics.length,
      metrics: metrics.slice(-100) // Return last 100 metrics
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

/**
 * GET /api/performance/slow-requests
 * Get slow requests
 */
router.get('/slow-requests', (req, res) => {
  try {
    const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : undefined;
    const slowRequests = performanceMonitor.getSlowRequests(threshold);
    res.json({
      total: slowRequests.length,
      threshold: threshold || 1000,
      requests: slowRequests
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve slow requests' });
  }
});

/**
 * POST /api/performance/clear
 * Clear performance metrics (admin only)
 */
router.post('/clear', (req, res) => {
  try {
    performanceMonitor.clearMetrics();
    res.json({ message: 'Performance metrics cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear metrics' });
  }
});

export default router;

