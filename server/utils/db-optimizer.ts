/**
 * Database Query Optimization Utilities
 * 
 * Provides utilities for optimizing database queries and monitoring performance
 */

import { db } from '../db';

/**
 * Query performance tracker
 */
class QueryPerformanceTracker {
  private queries: Array<{
    sql: string;
    duration: number;
    timestamp: Date;
  }> = [];

  private slowQueryThreshold = 100; // 100ms

  track(sql: string, duration: number) {
    this.queries.push({
      sql,
      duration,
      timestamp: new Date()
    });

    // Keep only last 1000 queries
    if (this.queries.length > 1000) {
      this.queries.shift();
    }

    // Log slow queries
    if (duration > this.slowQueryThreshold) {
      console.warn(`[SLOW QUERY] ${duration}ms: ${sql.substring(0, 100)}...`);
    }
  }

  getSlowQueries(threshold?: number) {
    const limit = threshold || this.slowQueryThreshold;
    return this.queries.filter(q => q.duration > limit);
  }

  getAverageQueryTime() {
    if (this.queries.length === 0) return 0;
    const total = this.queries.reduce((sum, q) => sum + q.duration, 0);
    return total / this.queries.length;
  }

  getStats() {
    return {
      totalQueries: this.queries.length,
      averageQueryTime: Math.round(this.getAverageQueryTime()),
      slowQueries: this.getSlowQueries().length,
      slowQueryThreshold: this.slowQueryThreshold
    };
  }
}

export const queryTracker = new QueryPerformanceTracker();

/**
 * Wrap database query with performance tracking
 */
export async function trackQuery<T>(
  queryFn: () => Promise<T>,
  queryName: string
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await queryFn();
    const duration = Date.now() - startTime;
    queryTracker.track(queryName, duration);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    queryTracker.track(`${queryName} (ERROR)`, duration);
    throw error;
  }
}

/**
 * Pagination helper for large result sets
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  maxPageSize?: number;
}

export function getPaginationParams(options: PaginationOptions = {}) {
  const page = Math.max(1, options.page || 1);
  const maxPageSize = options.maxPageSize || 100;
  const pageSize = Math.min(options.pageSize || 20, maxPageSize);
  const offset = (page - 1) * pageSize;

  return {
    limit: pageSize,
    offset,
    page,
    pageSize
  };
}

/**
 * Batch processing helper for large operations
 */
export async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
  }

  return results;
}

/**
 * Cache key generator for consistent caching
 */
export function generateCacheKey(prefix: string, params: any): string {
  const paramString = JSON.stringify(params);
  return `${prefix}:${paramString}`;
}

/**
 * Database connection pool monitoring
 */
export function getConnectionPoolStats() {
  // Note: This is a placeholder. Actual implementation depends on database driver
  return {
    active: 0,
    idle: 0,
    waiting: 0,
    total: 0
  };
}

/**
 * Index recommendations based on query patterns
 */
export function getIndexRecommendations() {
  const slowQueries = queryTracker.getSlowQueries();
  const recommendations: string[] = [];

  // Analyze slow queries for common patterns
  slowQueries.forEach(query => {
    if (query.sql.includes('WHERE') && !query.sql.includes('INDEX')) {
      recommendations.push(`Consider adding index for: ${query.sql.substring(0, 100)}...`);
    }
  });

  return recommendations;
}

/**
 * Query result caching decorator
 */
export function withCache<T>(
  cacheKey: string,
  ttl: number = 300000 // 5 minutes default
) {
  const cache = new Map<string, { data: T; expiry: number }>();

  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const key = `${cacheKey}:${JSON.stringify(args)}`;
      const cached = cache.get(key);

      if (cached && cached.expiry > Date.now()) {
        return cached.data;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(key, {
        data: result,
        expiry: Date.now() + ttl
      });

      return result;
    };

    return descriptor;
  };
}

