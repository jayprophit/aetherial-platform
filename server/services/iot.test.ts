import { describe, it, expect, beforeEach } from 'vitest';
import { IoTDeviceService, IoTAutomationService, IoTAnalyticsService } from './iot';

describe('IoTDeviceService', () => {
  let iotService: IoTDeviceService;

  beforeEach(() => {
    iotService = new IoTDeviceService();
  });

  it('should register a new device', () => {
    const device = iotService.registerDevice('Test Sensor', 'sensor', 1);
    
    expect(device.id).toBeTruthy();
    expect(device.name).toBe('Test Sensor');
    expect(device.type).toBe('sensor');
    expect(device.owner).toBe(1);
    expect(device.apiKey).toBeTruthy();
    expect(device.status).toBe('offline');
  });

  it('should authenticate device with valid API key', () => {
    const device = iotService.registerDevice('Test Sensor', 'sensor', 1);
    const isAuthenticated = iotService.authenticateDevice(device.id, device.apiKey);
    
    expect(isAuthenticated).toBe(true);
  });

  it('should reject invalid API key', () => {
    const device = iotService.registerDevice('Test Sensor', 'sensor', 1);
    const isAuthenticated = iotService.authenticateDevice(device.id, 'invalid-key');
    
    expect(isAuthenticated).toBe(false);
  });

  it('should get device by ID', () => {
    const device = iotService.registerDevice('Test Sensor', 'sensor', 1);
    const retrieved = iotService.getDevice(device.id);
    
    expect(retrieved).toEqual(device);
  });

  it('should get user devices', () => {
    iotService.registerDevice('Sensor 1', 'sensor', 1);
    iotService.registerDevice('Sensor 2', 'sensor', 1);
    iotService.registerDevice('Sensor 3', 'sensor', 2);
    
    const user1Devices = iotService.getUserDevices(1);
    const user2Devices = iotService.getUserDevices(2);
    
    expect(user1Devices).toHaveLength(2);
    expect(user2Devices).toHaveLength(1);
  });

  it('should update device status', () => {
    const device = iotService.registerDevice('Test Sensor', 'sensor', 1);
    iotService.updateDeviceStatus(device.id, 'online');
    
    const updated = iotService.getDevice(device.id);
    expect(updated?.status).toBe('online');
  });

  it('should delete device', () => {
    const device = iotService.registerDevice('Test Sensor', 'sensor', 1);
    const deleted = iotService.deleteDevice(device.id);
    
    expect(deleted).toBe(true);
    expect(iotService.getDevice(device.id)).toBeUndefined();
  });

  it('should record sensor data', () => {
    const device = iotService.registerDevice('Test Sensor', 'sensor', 1);
    const data = { temperature: 25, humidity: 60 };
    
    iotService.recordSensorData(device.id, data, 'environment');
    
    const sensorData = iotService.getSensorData(device.id);
    expect(sensorData).toHaveLength(1);
    expect(sensorData[0].data).toEqual(data);
    expect(sensorData[0].type).toBe('environment');
  });

  it('should get latest sensor reading', () => {
    const device = iotService.registerDevice('Test Sensor', 'sensor', 1);
    
    iotService.recordSensorData(device.id, { temperature: 25 }, 'temp');
    iotService.recordSensorData(device.id, { temperature: 26 }, 'temp');
    
    const latest = iotService.getLatestReading(device.id);
    expect(latest?.data.temperature).toBe(26);
  });

  it('should limit sensor data to 1000 readings', () => {
    const device = iotService.registerDevice('Test Sensor', 'sensor', 1);
    
    // Add 1100 readings
    for (let i = 0; i < 1100; i++) {
      iotService.recordSensorData(device.id, { value: i }, 'test');
    }
    
    const data = iotService.getSensorData(device.id);
    expect(data).toHaveLength(1000);
  });

  it('should get device statistics', () => {
    const device = iotService.registerDevice('Test Sensor', 'sensor', 1);
    iotService.recordSensorData(device.id, { temperature: 25 }, 'temp');
    
    const stats = iotService.getDeviceStats(device.id);
    
    expect(stats.deviceId).toBe(device.id);
    expect(stats.totalReadings).toBe(1);
    expect(stats.lastReading).toBeTruthy();
  });
});

describe('IoTAutomationService', () => {
  let automationService: IoTAutomationService;

  beforeEach(() => {
    automationService = new IoTAutomationService();
  });

  it('should create automation rule', () => {
    const rule = {
      id: 'rule-1',
      name: 'High Temperature Alert',
      deviceId: 'device-1',
      owner: 1,
      condition: {
        field: 'temperature',
        operator: 'greater_than' as const,
        value: 30,
      },
      action: {
        type: 'notification' as const,
        params: { message: 'Temperature too high!' },
      },
      enabled: true,
      createdAt: new Date(),
    };

    automationService.createRule(rule);
    const rules = automationService.getUserRules(1);
    
    expect(rules).toHaveLength(1);
    expect(rules[0]).toEqual(rule);
  });

  it('should delete automation rule', () => {
    const rule = {
      id: 'rule-1',
      name: 'Test Rule',
      deviceId: 'device-1',
      owner: 1,
      condition: { field: 'temp', operator: 'equals' as const, value: 25 },
      action: { type: 'notification' as const, params: {} },
      enabled: true,
      createdAt: new Date(),
    };

    automationService.createRule(rule);
    const deleted = automationService.deleteRule('rule-1');
    
    expect(deleted).toBe(true);
    expect(automationService.getUserRules(1)).toHaveLength(0);
  });

  it('should evaluate rules - greater_than', () => {
    const rule = {
      id: 'rule-1',
      name: 'High Temperature',
      deviceId: 'device-1',
      owner: 1,
      condition: { field: 'temperature', operator: 'greater_than' as const, value: 30 },
      action: { type: 'notification' as const, params: {} },
      enabled: true,
      createdAt: new Date(),
    };

    automationService.createRule(rule);
    
    const sensorData = {
      deviceId: 'device-1',
      timestamp: new Date(),
      data: { temperature: 35 },
      type: 'temp',
    };

    const triggered = automationService.evaluateRules(sensorData);
    expect(triggered).toContain('rule-1');
  });

  it('should not trigger disabled rules', () => {
    const rule = {
      id: 'rule-1',
      name: 'Test Rule',
      deviceId: 'device-1',
      owner: 1,
      condition: { field: 'temperature', operator: 'greater_than' as const, value: 30 },
      action: { type: 'notification' as const, params: {} },
      enabled: false,
      createdAt: new Date(),
    };

    automationService.createRule(rule);
    
    const sensorData = {
      deviceId: 'device-1',
      timestamp: new Date(),
      data: { temperature: 35 },
      type: 'temp',
    };

    const triggered = automationService.evaluateRules(sensorData);
    expect(triggered).not.toContain('rule-1');
  });
});

describe('IoTAnalyticsService', () => {
  let analyticsService: IoTAnalyticsService;

  beforeEach(() => {
    analyticsService = new IoTAnalyticsService();
  });

  it('should calculate average', () => {
    const data = [
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 20 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 25 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 30 }, type: 'temp' },
    ];

    const average = analyticsService.calculateAverage(data, 'temperature');
    expect(average).toBe(25);
  });

  it('should calculate min/max', () => {
    const data = [
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 20 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 25 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 30 }, type: 'temp' },
    ];

    const { min, max } = analyticsService.calculateMinMax(data, 'temperature');
    expect(min).toBe(20);
    expect(max).toBe(30);
  });

  it('should detect anomalies', () => {
    const data = [
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 20 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 21 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 22 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 23 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 24 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 25 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 26 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 27 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 28 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 29 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(), data: { temperature: 100 }, type: 'temp' }, // Anomaly
    ];

    const anomalies = analyticsService.detectAnomalies(data, 'temperature', 2);
    expect(anomalies.length).toBeGreaterThan(0);
    expect(anomalies[0].data.temperature).toBe(100);
  });

  it('should generate time series', () => {
    const now = Date.now();
    const hour = 3600000;
    
    const data = [
      { deviceId: 'device-1', timestamp: new Date(now), data: { temperature: 20 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(now + 1000), data: { temperature: 21 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(now + hour), data: { temperature: 25 }, type: 'temp' },
      { deviceId: 'device-1', timestamp: new Date(now + hour + 1000), data: { temperature: 26 }, type: 'temp' },
    ];

    const series = analyticsService.generateTimeSeries(data, 'temperature', hour);
    
    expect(series).toHaveLength(2);
    expect(series[0].value).toBe(20.5); // Average of 20 and 21
    expect(series[1].value).toBe(25.5); // Average of 25 and 26
  });
});

