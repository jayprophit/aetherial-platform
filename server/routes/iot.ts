import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  iotDeviceService,
  iotAutomationService,
  iotAnalyticsService,
} from '../services/iot';

const router = express.Router();

// POST /api/iot/devices - Register a new IoT device
router.post('/devices', authenticateToken, async (req, res) => {
  try {
    const { name, type, metadata } = req.body;
    const userId = (req as any).user.id;

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const device = iotDeviceService.registerDevice(name, type, userId, metadata);

    res.json({ device, message: 'Device registered successfully' });
  } catch (error) {
    console.error('Register device error:', error);
    res.status(500).json({ error: 'Failed to register device' });
  }
});

// GET /api/iot/devices - Get all devices for current user
router.get('/devices', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const devices = iotDeviceService.getUserDevices(userId);

    res.json({ devices, count: devices.length });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ error: 'Failed to get devices' });
  }
});

// GET /api/iot/devices/:id - Get device by ID
router.get('/devices/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const device = iotDeviceService.getDevice(id);

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ device });
  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({ error: 'Failed to get device' });
  }
});

// DELETE /api/iot/devices/:id - Delete device
router.delete('/devices/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = iotDeviceService.deleteDevice(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({ error: 'Failed to delete device' });
  }
});

// POST /api/iot/devices/:id/data - Record sensor data
router.post('/devices/:id/data', async (req, res) => {
  try {
    const { id } = req.params;
    const { apiKey, data, type } = req.body;

    if (!apiKey || !data || !type) {
      return res.status(400).json({ error: 'API key, data, and type are required' });
    }

    // Authenticate device
    if (!iotDeviceService.authenticateDevice(id, apiKey)) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    iotDeviceService.recordSensorData(id, data, type);

    res.json({ message: 'Data recorded successfully' });
  } catch (error) {
    console.error('Record data error:', error);
    res.status(500).json({ error: 'Failed to record data' });
  }
});

// GET /api/iot/devices/:id/data - Get sensor data
router.get('/devices/:id/data', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;

    const data = iotDeviceService.getSensorData(id, limit ? parseInt(limit as string) : undefined);

    res.json({ data, count: data.length });
  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({ error: 'Failed to get data' });
  }
});

// GET /api/iot/devices/:id/latest - Get latest sensor reading
router.get('/devices/:id/latest', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const latest = iotDeviceService.getLatestReading(id);

    if (!latest) {
      return res.status(404).json({ error: 'No data available' });
    }

    res.json({ data: latest });
  } catch (error) {
    console.error('Get latest reading error:', error);
    res.status(500).json({ error: 'Failed to get latest reading' });
  }
});

// GET /api/iot/devices/:id/stats - Get device statistics
router.get('/devices/:id/stats', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const stats = iotDeviceService.getDeviceStats(id);

    if (!stats) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// POST /api/iot/automation/rules - Create automation rule
router.post('/automation/rules', authenticateToken, async (req, res) => {
  try {
    const { name, deviceId, condition, action } = req.body;
    const userId = (req as any).user.id;

    if (!name || !deviceId || !condition || !action) {
      return res.status(400).json({ error: 'Name, deviceId, condition, and action are required' });
    }

    const rule = {
      id: crypto.randomUUID(),
      name,
      deviceId,
      owner: userId,
      condition,
      action,
      enabled: true,
      createdAt: new Date(),
    };

    iotAutomationService.createRule(rule);

    res.json({ rule, message: 'Rule created successfully' });
  } catch (error) {
    console.error('Create rule error:', error);
    res.status(500).json({ error: 'Failed to create rule' });
  }
});

// GET /api/iot/automation/rules - Get automation rules
router.get('/automation/rules', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const rules = iotAutomationService.getUserRules(userId);

    res.json({ rules, count: rules.length });
  } catch (error) {
    console.error('Get rules error:', error);
    res.status(500).json({ error: 'Failed to get rules' });
  }
});

// DELETE /api/iot/automation/rules/:id - Delete automation rule
router.delete('/automation/rules/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = iotAutomationService.deleteRule(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    res.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    console.error('Delete rule error:', error);
    res.status(500).json({ error: 'Failed to delete rule' });
  }
});

// GET /api/iot/analytics/:deviceId/average - Calculate average
router.get('/analytics/:deviceId/average', authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { field } = req.query;

    if (!field) {
      return res.status(400).json({ error: 'Field is required' });
    }

    const data = iotDeviceService.getSensorData(deviceId);
    const average = iotAnalyticsService.calculateAverage(data, field as string);

    res.json({ deviceId, field, average });
  } catch (error) {
    console.error('Calculate average error:', error);
    res.status(500).json({ error: 'Failed to calculate average' });
  }
});

// GET /api/iot/analytics/:deviceId/minmax - Calculate min/max
router.get('/analytics/:deviceId/minmax', authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { field } = req.query;

    if (!field) {
      return res.status(400).json({ error: 'Field is required' });
    }

    const data = iotDeviceService.getSensorData(deviceId);
    const minmax = iotAnalyticsService.calculateMinMax(data, field as string);

    res.json({ deviceId, field, ...minmax });
  } catch (error) {
    console.error('Calculate min/max error:', error);
    res.status(500).json({ error: 'Failed to calculate min/max' });
  }
});

// GET /api/iot/analytics/:deviceId/anomalies - Detect anomalies
router.get('/analytics/:deviceId/anomalies', authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { field, threshold } = req.query;

    if (!field) {
      return res.status(400).json({ error: 'Field is required' });
    }

    const data = iotDeviceService.getSensorData(deviceId);
    const anomalies = iotAnalyticsService.detectAnomalies(
      data,
      field as string,
      threshold ? parseFloat(threshold as string) : undefined
    );

    res.json({ deviceId, field, anomalies, count: anomalies.length });
  } catch (error) {
    console.error('Detect anomalies error:', error);
    res.status(500).json({ error: 'Failed to detect anomalies' });
  }
});

// GET /api/iot/analytics/:deviceId/timeseries - Generate time series
router.get('/analytics/:deviceId/timeseries', authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { field, interval } = req.query;

    if (!field) {
      return res.status(400).json({ error: 'Field is required' });
    }

    const data = iotDeviceService.getSensorData(deviceId);
    const series = iotAnalyticsService.generateTimeSeries(
      data,
      field as string,
      interval ? parseInt(interval as string) : undefined
    );

    res.json({ deviceId, field, series, count: series.length });
  } catch (error) {
    console.error('Generate time series error:', error);
    res.status(500).json({ error: 'Failed to generate time series' });
  }
});

export default router;

