import { Request, Response, NextFunction } from 'express';

/**
 * Performance Monitoring Middleware
 * 
 * Tracks request processing time and logs slow requests
 */

interface PerformanceMetrics {
  path: string;
  method: string;
  duration: number;
  statusCode: number;
  timestamp: Date;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private slowRequestThreshold: number = 1000; // 1 second
  private maxMetricsSize: number = 1000;

  logRequest(metric: PerformanceMetrics) {
    this.metrics.push(metric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetricsSize) {
      this.metrics.shift();
    }

    // Log slow requests
    if (metric.duration > this.slowRequestThreshold) {
      console.warn(
        `[SLOW REQUEST] ${metric.method} ${metric.path} took ${metric.duration}ms`
      );
    }
  }

  getMetrics() {
    return this.metrics;
  }

  getAverageResponseTime() {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / this.metrics.length;
  }

  getSlowRequests(threshold?: number) {
    const limit = threshold || this.slowRequestThreshold;
    return this.metrics.filter(m => m.duration > limit);
  }

  getMetricsByPath() {
    const pathMetrics: { [key: string]: { count: number; avgDuration: number } } = {};

    this.metrics.forEach(metric => {
      if (!pathMetrics[metric.path]) {
        pathMetrics[metric.path] = { count: 0, avgDuration: 0 };
      }
      pathMetrics[metric.path].count++;
    });

    Object.keys(pathMetrics).forEach(path => {
      const pathRequests = this.metrics.filter(m => m.path === path);
      const totalDuration = pathRequests.reduce((sum, m) => sum + m.duration, 0);
      pathMetrics[path].avgDuration = totalDuration / pathRequests.length;
    });

    return pathMetrics;
  }

  clearMetrics() {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Express middleware to track request performance
 */
export function performanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  // Capture the original end function
  const originalEnd = res.end;

  // Override the end function to capture when response is sent
  res.end = function(...args: any[]) {
    const duration = Date.now() - startTime;

    performanceMonitor.logRequest({
      path: req.path,
      method: req.method,
      duration,
      statusCode: res.statusCode,
      timestamp: new Date()
    });

    // Call the original end function
    return originalEnd.apply(res, args);
  };

  next();
}

/**
 * Memory usage monitoring
 */
export function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    rss: Math.round(usage.rss / 1024 / 1024), // MB
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
    external: Math.round(usage.external / 1024 / 1024), // MB
  };
}

/**
 * CPU usage monitoring
 */
export function getCPUUsage() {
  const usage = process.cpuUsage();
  return {
    user: Math.round(usage.user / 1000), // milliseconds
    system: Math.round(usage.system / 1000), // milliseconds
  };
}

/**
 * Get performance statistics
 */
export function getPerformanceStats() {
  return {
    averageResponseTime: Math.round(performanceMonitor.getAverageResponseTime()),
    totalRequests: performanceMonitor.getMetrics().length,
    slowRequests: performanceMonitor.getSlowRequests().length,
    metricsByPath: performanceMonitor.getMetricsByPath(),
    memory: getMemoryUsage(),
    cpu: getCPUUsage(),
    uptime: Math.round(process.uptime()),
  };
}

