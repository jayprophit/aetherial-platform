/**
 * Frontend Performance Optimization Utilities
 * 
 * Provides utilities for optimizing frontend performance
 */

/**
 * Debounce function to limit function execution rate
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(img: HTMLImageElement) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement;
        const src = image.dataset.src;
        if (src) {
          image.src = src;
          image.removeAttribute('data-src');
          observer.unobserve(image);
        }
      }
    });
  });

  observer.observe(img);
}

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string) {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`[RENDER] ${componentName}: ${duration.toFixed(2)}ms`);
  };
}

/**
 * Performance mark for custom metrics
 */
export function mark(name: string) {
  if (performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure time between two marks
 */
export function measure(name: string, startMark: string, endMark: string) {
  if (performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const measures = performance.getEntriesByName(name);
      if (measures.length > 0) {
        const duration = measures[0].duration;
        console.log(`[MEASURE] ${name}: ${duration.toFixed(2)}ms`);
        return duration;
      }
    } catch (error) {
      console.warn(`Failed to measure ${name}:`, error);
    }
  }
  return 0;
}

/**
 * Get Web Vitals metrics
 */
export interface WebVitals {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

export function getWebVitals(): WebVitals {
  const vitals: WebVitals = {};

  // Get navigation timing
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    vitals.TTFB = navigation.responseStart - navigation.requestStart;
  }

  // Get paint timing
  const paintEntries = performance.getEntriesByType('paint');
  paintEntries.forEach((entry) => {
    if (entry.name === 'first-contentful-paint') {
      vitals.FCP = entry.startTime;
    }
  });

  return vitals;
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    const vitals = getWebVitals();
    Object.entries(vitals).forEach(([name, value]) => {
      onPerfEntry({ name, value });
    });
  }
}

/**
 * Memoize expensive function results
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Request Idle Callback wrapper with fallback
 */
export function requestIdleCallback(callback: () => void, options?: { timeout?: number }) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    return setTimeout(callback, 1);
  }
}

/**
 * Prefetch resources
 */
export function prefetchResource(url: string, as: string = 'fetch') {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Preload critical resources
 */
export function preloadResource(url: string, as: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get device memory (if available)
 */
export function getDeviceMemory(): number | undefined {
  return (navigator as any).deviceMemory;
}

/**
 * Get network information (if available)
 */
export function getNetworkInfo() {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  
  return null;
}

/**
 * Adaptive loading based on network conditions
 */
export function shouldLoadHighQuality(): boolean {
  const networkInfo = getNetworkInfo();
  
  if (!networkInfo) {
    return true; // Default to high quality if info not available
  }
  
  // Don't load high quality on slow connections or when save data is enabled
  if (networkInfo.saveData || networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g') {
    return false;
  }
  
  return true;
}

/**
 * Virtual scrolling helper
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  return { startIndex, endIndex };
}

/**
 * Image optimization helper
 */
export function getOptimizedImageUrl(
  url: string,
  width: number,
  quality: number = 80
): string {
  // This is a placeholder - implement based on your CDN/image service
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString()
  });
  
  return `${url}?${params.toString()}`;
}

/**
 * Performance observer for monitoring
 */
export class PerformanceMonitor {
  private observer: PerformanceObserver | null = null;

  start(callback: (entries: PerformanceEntryList) => void) {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

      this.observer.observe({
        entryTypes: ['measure', 'navigation', 'resource', 'paint']
      });
    }
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * Bundle size analyzer helper
 */
export function logBundleSize() {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const scripts = resources.filter(r => r.initiatorType === 'script');
  
  let totalSize = 0;
  scripts.forEach(script => {
    const size = script.transferSize || 0;
    totalSize += size;
    console.log(`[BUNDLE] ${script.name}: ${(size / 1024).toFixed(2)} KB`);
  });
  
  console.log(`[BUNDLE] Total: ${(totalSize / 1024).toFixed(2)} KB`);
}

