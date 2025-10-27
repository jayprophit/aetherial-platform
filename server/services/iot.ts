import crypto from 'crypto';
import { EventEmitter } from 'events';

/**
 * IoT Device
 */
export interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'gateway' | 'controller';
  status: 'online' | 'offline' | 'error';
  owner: number; // User ID
  apiKey: string;
  metadata: any;
  lastSeen: Date;
  createdAt: Date;
}

/**
 * Sensor Data
 */
export interface SensorData {
  deviceId: string;
  timestamp: Date;
  data: any;
  type: string;
}

/**
 * IoT Device Management Service
 */
export class IoTDeviceService extends EventEmitter {
  private devices: Map<string, IoTDevice>;
  private sensorData: Map<string, SensorData[]>;

  constructor() {
    super();
    this.devices = new Map();
    this.sensorData = new Map();
  }

  /**
   * Register a new IoT device
   */
  registerDevice(name: string, type: IoTDevice['type'], owner: number, metadata?: any): IoTDevice {
    const device: IoTDevice = {
      id: crypto.randomUUID(),
      name,
      type,
      status: 'offline',
      owner,
      apiKey: this.generateApiKey(),
      metadata: metadata || {},
      lastSeen: new Date(),
      createdAt: new Date(),
    };

    this.devices.set(device.id, device);
    this.emit('device:registered', device);

    return device;
  }

  /**
   * Generate API key for device authentication
   */
  private generateApiKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Authenticate device with API key
   */
  authenticateDevice(deviceId: string, apiKey: string): boolean {
    const device = this.devices.get(deviceId);
    return device?.apiKey === apiKey;
  }

  /**
   * Get device by ID
   */
  getDevice(deviceId: string): IoTDevice | undefined {
    return this.devices.get(deviceId);
  }

  /**
   * Get all devices for a user
   */
  getUserDevices(userId: number): IoTDevice[] {
    return Array.from(this.devices.values()).filter(d => d.owner === userId);
  }

  /**
   * Update device status
   */
  updateDeviceStatus(deviceId: string, status: IoTDevice['status']): void {
    const device = this.devices.get(deviceId);
    if (device) {
      device.status = status;
      device.lastSeen = new Date();
      this.emit('device:status', { deviceId, status });
    }
  }

  /**
   * Delete device
   */
  deleteDevice(deviceId: string): boolean {
    const deleted = this.devices.delete(deviceId);
    if (deleted) {
      this.sensorData.delete(deviceId);
      this.emit('device:deleted', { deviceId });
    }
    return deleted;
  }

  /**
   * Record sensor data
   */
  recordSensorData(deviceId: string, data: any, type: string): void {
    const sensorData: SensorData = {
      deviceId,
      timestamp: new Date(),
      data,
      type,
    };

    if (!this.sensorData.has(deviceId)) {
      this.sensorData.set(deviceId, []);
    }

    const deviceData = this.sensorData.get(deviceId)!;
    deviceData.push(sensorData);

    // Keep only last 1000 readings per device
    if (deviceData.length > 1000) {
      deviceData.shift();
    }

    this.updateDeviceStatus(deviceId, 'online');
    this.emit('sensor:data', sensorData);
  }

  /**
   * Get sensor data for a device
   */
  getSensorData(deviceId: string, limit?: number): SensorData[] {
    const data = this.sensorData.get(deviceId) || [];
    return limit ? data.slice(-limit) : data;
  }

  /**
   * Get latest sensor reading
   */
  getLatestReading(deviceId: string): SensorData | undefined {
    const data = this.sensorData.get(deviceId);
    return data && data.length > 0 ? data[data.length - 1] : undefined;
  }

  /**
   * Get device statistics
   */
  getDeviceStats(deviceId: string): any {
    const device = this.devices.get(deviceId);
    const data = this.sensorData.get(deviceId) || [];

    if (!device) return null;

    return {
      deviceId,
      name: device.name,
      type: device.type,
      status: device.status,
      totalReadings: data.length,
      lastReading: data.length > 0 ? data[data.length - 1] : null,
      uptime: this.calculateUptime(device),
    };
  }

  /**
   * Calculate device uptime
   */
  private calculateUptime(device: IoTDevice): number {
    const now = new Date().getTime();
    const lastSeen = device.lastSeen.getTime();
    const diff = now - lastSeen;

    // If last seen within 5 minutes, consider online
    return diff < 300000 ? 100 : 0;
  }
}

/**
 * IoT Automation Service
 */
export class IoTAutomationService {
  private rules: Map<string, AutomationRule>;

  constructor() {
    this.rules = new Map();
  }

  /**
   * Create automation rule
   */
  createRule(rule: AutomationRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Delete automation rule
   */
  deleteRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  /**
   * Get all rules for a user
   */
  getUserRules(userId: number): AutomationRule[] {
    return Array.from(this.rules.values()).filter(r => r.owner === userId);
  }

  /**
   * Evaluate rules against sensor data
   */
  evaluateRules(sensorData: SensorData): string[] {
    const triggeredRules: string[] = [];

    for (const rule of this.rules.values()) {
      if (rule.deviceId === sensorData.deviceId && rule.enabled) {
        if (this.evaluateCondition(rule.condition, sensorData.data)) {
          triggeredRules.push(rule.id);
        }
      }
    }

    return triggeredRules;
  }

  /**
   * Evaluate a condition
   */
  private evaluateCondition(condition: RuleCondition, data: any): boolean {
    const value = data[condition.field];

    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'greater_than':
        return value > condition.value;
      case 'less_than':
        return value < condition.value;
      case 'greater_or_equal':
        return value >= condition.value;
      case 'less_or_equal':
        return value <= condition.value;
      default:
        return false;
    }
  }
}

/**
 * Automation Rule
 */
export interface AutomationRule {
  id: string;
  name: string;
  deviceId: string;
  owner: number;
  condition: RuleCondition;
  action: RuleAction;
  enabled: boolean;
  createdAt: Date;
}

/**
 * Rule Condition
 */
export interface RuleCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_or_equal' | 'less_or_equal';
  value: any;
}

/**
 * Rule Action
 */
export interface RuleAction {
  type: 'notification' | 'webhook' | 'device_control';
  params: any;
}

/**
 * IoT Analytics Service
 */
export class IoTAnalyticsService {
  /**
   * Calculate average value from sensor data
   */
  calculateAverage(data: SensorData[], field: string): number {
    if (data.length === 0) return 0;

    const sum = data.reduce((acc, d) => acc + (d.data[field] || 0), 0);
    return sum / data.length;
  }

  /**
   * Calculate min/max values
   */
  calculateMinMax(data: SensorData[], field: string): { min: number; max: number } {
    if (data.length === 0) return { min: 0, max: 0 };

    const values = data.map(d => d.data[field] || 0);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  /**
   * Detect anomalies in sensor data
   */
  detectAnomalies(data: SensorData[], field: string, threshold: number = 2): SensorData[] {
    if (data.length < 10) return [];

    const values = data.map(d => d.data[field] || 0);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return data.filter(d => {
      const value = d.data[field] || 0;
      return Math.abs(value - mean) > threshold * stdDev;
    });
  }

  /**
   * Generate time series data
   */
  generateTimeSeries(data: SensorData[], field: string, interval: number = 3600000): any[] {
    const series: any[] = [];
    const grouped = new Map<number, number[]>();

    // Group data by time interval
    for (const d of data) {
      const bucket = Math.floor(d.timestamp.getTime() / interval) * interval;
      if (!grouped.has(bucket)) {
        grouped.set(bucket, []);
      }
      grouped.get(bucket)!.push(d.data[field] || 0);
    }

    // Calculate average for each bucket
    for (const [timestamp, values] of grouped) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      series.push({
        timestamp: new Date(timestamp),
        value: avg,
        count: values.length,
      });
    }

    return series.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

// Export singleton instances
export const iotDeviceService = new IoTDeviceService();
export const iotAutomationService = new IoTAutomationService();
export const iotAnalyticsService = new IoTAnalyticsService();

