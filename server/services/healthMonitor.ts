import { db } from '../db';
import { eq, desc, and, gte } from 'drizzle-orm';

// Types
interface HealthConfig {
  checkInterval: number; // milliseconds
  reportInterval: number; // milliseconds
  reportDuration: number; // milliseconds
  version: string;
  alertThresholds: {
    errorCount: number;
    warningCount: number;
    responseTime: number;
  };
}

interface CheckStatus {
  status: 'healthy' | 'warning' | 'error';
  message: string;
  duration?: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface HealthResult {
  status: 'healthy' | 'warning' | 'error';
  timestamp: number;
  checks: Record<string, CheckStatus>;
  meta: {
    totalChecks: number;
    healthyChecks: number;
    warningChecks: number;
    errorChecks: number;
    duration: number;
  };
}

interface HealthCheck {
  id: string;
  name: string;
  check: () => Promise<CheckStatus>;
  dependencies?: string[];
  timeout?: number;
}

interface HealthReport {
  currentStatus: HealthResult;
  historicalData: HealthResult[];
  trends: HealthTrends;
  meta: {
    generatedAt: number;
    timespan: number;
    version: string;
  };
}

interface HealthTrends {
  uptimePercentage: number;
  averageResponseTime: number;
  errorRate: number;
  warningRate: number;
  statusChanges: number;
}

interface HistoryOptions {
  duration?: number;
  limit?: number;
  checkId?: string;
}

interface TrendAnalysisOptions extends HistoryOptions {
  groupBy?: 'hour' | 'day' | 'week';
}

// Health Monitor Service
class HealthMonitor {
  private checks: Map<string, HealthCheck> = new Map();
  private dependencies: Map<string, string[]> = new Map();
  private config: HealthConfig;
  private schedulerInterval?: NodeJS.Timeout;
  private reportInterval?: NodeJS.Timeout;
  private history: HealthHistory;
  private alerts: AlertManager;
  private reporting: ReportingService;

  constructor(config?: Partial<HealthConfig>) {
    this.config = {
      checkInterval: config?.checkInterval || 60000, // 1 minute
      reportInterval: config?.reportInterval || 300000, // 5 minutes
      reportDuration: config?.reportDuration || 86400000, // 24 hours
      version: config?.version || '1.0.0',
      alertThresholds: config?.alertThresholds || {
        errorCount: 3,
        warningCount: 5,
        responseTime: 5000
      }
    };

    this.history = new HealthHistory();
    this.alerts = new AlertManager(this.config.alertThresholds);
    this.reporting = new ReportingService();
  }

  // Register health checks
  registerCheck(check: HealthCheck): void {
    this.checks.set(check.id, check);
    if (check.dependencies) {
      this.dependencies.set(check.id, check.dependencies);
    }
  }

  unregisterCheck(checkId: string): void {
    this.checks.delete(checkId);
    this.dependencies.delete(checkId);
  }

  // Perform health checks
  async performHealthCheck(
    checkIds?: string[],
    options?: { scheduler?: boolean }
  ): Promise<HealthResult> {
    const startTime = process.hrtime();
    const results = new Map<string, CheckStatus>();

    const checksToRun = checkIds
      ? Array.from(this.checks.entries()).filter(([id]) => checkIds.includes(id))
      : Array.from(this.checks.entries());

    // Run checks in parallel
    await Promise.all(
      checksToRun.map(async ([id, check]) => {
        try {
          const checkStartTime = process.hrtime();
          const timeout = check.timeout || 10000;

          const result = await Promise.race([
            check.check(),
            new Promise<CheckStatus>((_, reject) =>
              setTimeout(() => reject(new Error('Check timeout')), timeout)
            )
          ]);

          const duration = this.calculateDuration(checkStartTime);
          results.set(id, { ...result, duration });
        } catch (error: any) {
          results.set(id, {
            status: 'error',
            message: error.message || 'Check failed',
            timestamp: Date.now()
          });
        }
      })
    );

    return this.aggregateResults(results);
  }

  private calculateDuration(startTime: [number, number]): number {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    return seconds * 1000 + nanoseconds / 1000000;
  }

  private aggregateResults(results: Map<string, CheckStatus>): HealthResult {
    const aggregated: HealthResult = {
      status: 'healthy',
      timestamp: Date.now(),
      checks: Object.fromEntries(results),
      meta: {
        totalChecks: results.size,
        healthyChecks: 0,
        warningChecks: 0,
        errorChecks: 0,
        duration: 0
      }
    };

    for (const status of results.values()) {
      switch (status.status) {
        case 'healthy':
          aggregated.meta.healthyChecks++;
          break;
        case 'warning':
          aggregated.meta.warningChecks++;
          if (aggregated.status === 'healthy') {
            aggregated.status = 'warning';
          }
          break;
        case 'error':
          aggregated.meta.errorChecks++;
          aggregated.status = 'error';
          break;
      }
      aggregated.meta.duration += status.duration || 0;
    }

    return aggregated;
  }

  // Scheduling
  startScheduler(): void {
    this.schedulerInterval = setInterval(() => {
      this.runScheduledChecks();
    }, this.config.checkInterval);

    this.reportInterval = setInterval(() => {
      this.generateStatusReport();
    }, this.config.reportInterval);
  }

  private async runScheduledChecks(): Promise<void> {
    try {
      const result = await this.performHealthCheck(undefined, { scheduler: true });
      await this.processScheduledResult(result);
    } catch (error) {
      console.error('Scheduled health check failed:', error);
    }
  }

  private async processScheduledResult(result: HealthResult): Promise<void> {
    await this.history.recordResult(result);
    await this.detectStatusChanges(result);

    if (this.shouldGenerateReport(result)) {
      await this.generateStatusReport();
    }
  }

  private async detectStatusChanges(result: HealthResult): Promise<void> {
    const previousResult = await this.history.getLastResult();
    if (!previousResult) return;

    for (const [checkId, status] of Object.entries(result.checks)) {
      const previousStatus = previousResult.checks[checkId];
      if (previousStatus && previousStatus.status !== status.status) {
        await this.handleStatusChange(checkId, previousStatus, status);
      }
    }
  }

  private async handleStatusChange(
    checkId: string,
    previousStatus: CheckStatus,
    currentStatus: CheckStatus
  ): Promise<void> {
    console.log(`Health check ${checkId} status changed: ${previousStatus.status} -> ${currentStatus.status}`);

    if (this.shouldAlertOnChange(previousStatus.status, currentStatus.status)) {
      await this.alerts.sendStatusChangeAlert(checkId, previousStatus, currentStatus);
    }
  }

  private shouldAlertOnChange(previousStatus: string, currentStatus: string): boolean {
    return (
      (previousStatus === 'healthy' && currentStatus !== 'healthy') ||
      (previousStatus !== 'healthy' && currentStatus === 'healthy')
    );
  }

  // Reporting
  async generateStatusReport(): Promise<HealthReport> {
    const currentStatus = await this.performHealthCheck();
    const historicalData = await this.history.getHistory({
      duration: this.config.reportDuration
    });

    const trends = this.reporting.analyzeTrends(historicalData);

    const report: HealthReport = {
      currentStatus,
      historicalData,
      trends,
      meta: {
        generatedAt: Date.now(),
        timespan: this.config.reportDuration,
        version: this.config.version
      }
    };

    return report;
  }

  private shouldGenerateReport(result: HealthResult): boolean {
    return (
      result.status !== 'healthy' ||
      result.meta.errorChecks > 0 ||
      result.meta.warningChecks > 0
    );
  }

  // History Management
  async getCheckHistory(checkId: string, options?: HistoryOptions): Promise<HealthResult[]> {
    return this.history.getCheckHistory(checkId, options);
  }

  async clearHistory(checkId?: string, options?: HistoryOptions): Promise<void> {
    await this.history.clearHistory(checkId, options);
  }

  // Analytics
  async analyzeHealthTrends(options?: TrendAnalysisOptions): Promise<HealthTrends> {
    const historicalData = await this.history.getHistory(options);
    return this.reporting.analyzeTrends(historicalData);
  }

  // Cleanup
  async shutdown(): Promise<void> {
    if (this.schedulerInterval) clearInterval(this.schedulerInterval);
    if (this.reportInterval) clearInterval(this.reportInterval);

    this.checks.clear();
    this.dependencies.clear();
  }
}

// Health History Manager
class HealthHistory {
  private results: HealthResult[] = [];
  private maxHistorySize = 1000;

  async recordResult(result: HealthResult): Promise<void> {
    this.results.push(result);
    if (this.results.length > this.maxHistorySize) {
      this.results.shift();
    }
  }

  async getLastResult(): Promise<HealthResult | null> {
    return this.results[this.results.length - 1] || null;
  }

  async getHistory(options?: HistoryOptions): Promise<HealthResult[]> {
    let filtered = [...this.results];

    if (options?.duration) {
      const cutoff = Date.now() - options.duration;
      filtered = filtered.filter(r => r.timestamp >= cutoff);
    }

    if (options?.limit) {
      filtered = filtered.slice(-options.limit);
    }

    return filtered;
  }

  async getCheckHistory(checkId: string, options?: HistoryOptions): Promise<HealthResult[]> {
    const history = await this.getHistory(options);
    return history.filter(r => checkId in r.checks);
  }

  async clearHistory(checkId?: string, options?: HistoryOptions): Promise<void> {
    if (!checkId) {
      this.results = [];
    } else {
      // Keep results but remove specific check data
      this.results.forEach(result => {
        delete result.checks[checkId];
      });
    }
  }
}

// Alert Manager
class AlertManager {
  constructor(private thresholds: HealthConfig['alertThresholds']) {}

  async sendStatusChangeAlert(
    checkId: string,
    previousStatus: CheckStatus,
    currentStatus: CheckStatus
  ): Promise<void> {
    console.log(`[ALERT] Health check ${checkId} changed from ${previousStatus.status} to ${currentStatus.status}`);
    // TODO: Integrate with notification system
  }

  async shutdown(): Promise<void> {
    // Cleanup
  }
}

// Reporting Service
class ReportingService {
  analyzeTrends(historicalData: HealthResult[]): HealthTrends {
    if (historicalData.length === 0) {
      return {
        uptimePercentage: 100,
        averageResponseTime: 0,
        errorRate: 0,
        warningRate: 0,
        statusChanges: 0
      };
    }

    const healthyCount = historicalData.filter(r => r.status === 'healthy').length;
    const totalDuration = historicalData.reduce((sum, r) => sum + r.meta.duration, 0);
    const errorCount = historicalData.reduce((sum, r) => sum + r.meta.errorChecks, 0);
    const warningCount = historicalData.reduce((sum, r) => sum + r.meta.warningChecks, 0);
    const totalChecks = historicalData.reduce((sum, r) => sum + r.meta.totalChecks, 0);

    let statusChanges = 0;
    for (let i = 1; i < historicalData.length; i++) {
      if (historicalData[i].status !== historicalData[i - 1].status) {
        statusChanges++;
      }
    }

    return {
      uptimePercentage: (healthyCount / historicalData.length) * 100,
      averageResponseTime: totalDuration / historicalData.length,
      errorRate: (errorCount / totalChecks) * 100,
      warningRate: (warningCount / totalChecks) * 100,
      statusChanges
    };
  }

  async shutdown(): Promise<void> {
    // Cleanup
  }
}

// Create default health checks
export function createDefaultHealthChecks(healthMonitor: HealthMonitor): void {
  // Database health check
  healthMonitor.registerCheck({
    id: 'database',
    name: 'Database Connection',
    check: async () => {
      try {
        await db.execute('SELECT 1');
        return {
          status: 'healthy',
          message: 'Database connection is healthy',
          timestamp: Date.now()
        };
      } catch (error: any) {
        return {
          status: 'error',
          message: `Database error: ${error.message}`,
          timestamp: Date.now()
        };
      }
    },
    timeout: 5000
  });

  // Memory health check
  healthMonitor.registerCheck({
    id: 'memory',
    name: 'Memory Usage',
    check: async () => {
      const used = process.memoryUsage();
      const heapUsedPercent = (used.heapUsed / used.heapTotal) * 100;

      if (heapUsedPercent > 90) {
        return {
          status: 'error',
          message: `High memory usage: ${heapUsedPercent.toFixed(2)}%`,
          timestamp: Date.now(),
          metadata: { heapUsedPercent }
        };
      } else if (heapUsedPercent > 75) {
        return {
          status: 'warning',
          message: `Elevated memory usage: ${heapUsedPercent.toFixed(2)}%`,
          timestamp: Date.now(),
          metadata: { heapUsedPercent }
        };
      }

      return {
        status: 'healthy',
        message: `Memory usage: ${heapUsedPercent.toFixed(2)}%`,
        timestamp: Date.now(),
        metadata: { heapUsedPercent }
      };
    }
  });

  // CPU health check
  healthMonitor.registerCheck({
    id: 'cpu',
    name: 'CPU Usage',
    check: async () => {
      const cpuUsage = process.cpuUsage();
      const totalUsage = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds

      return {
        status: 'healthy',
        message: `CPU usage: ${totalUsage.toFixed(2)}s`,
        timestamp: Date.now(),
        metadata: { totalUsage }
      };
    }
  });
}

export { HealthMonitor, HealthConfig, HealthCheck, HealthResult, CheckStatus, HealthReport, HealthTrends };

