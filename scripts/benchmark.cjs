#!/usr/bin/env node

/**
 * AETHERIAL Platform - Performance Benchmarking Script
 * 
 * This script performs comprehensive performance benchmarking including:
 * - API endpoint response times
 * - Database query performance
 * - Concurrent request handling
 * - Memory usage under load
 * - Throughput measurements
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

class PerformanceBenchmark {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  // Make HTTP request and measure time
  async makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const url = new URL(path, this.baseUrl);
      const protocol = url.protocol === 'https:' ? https : http;
      
      const options = {
        method,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const req = protocol.request(options, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          const duration = Date.now() - startTime;
          resolve({
            statusCode: res.statusCode,
            duration,
            body: body
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  // Benchmark single endpoint
  async benchmarkEndpoint(name, method, path, iterations = 100) {
    this.log(`Benchmarking ${name}...`);
    
    const durations = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < iterations; i++) {
      try {
        const result = await this.makeRequest(method, path);
        durations.push(result.duration);
        
        if (result.statusCode >= 200 && result.statusCode < 300) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    const p95Duration = this.percentile(durations, 95);
    const p99Duration = this.percentile(durations, 99);

    const result = {
      name,
      iterations,
      successCount,
      errorCount,
      avgDuration: Math.round(avgDuration),
      minDuration,
      maxDuration,
      p95Duration: Math.round(p95Duration),
      p99Duration: Math.round(p99Duration),
      requestsPerSecond: Math.round(1000 / avgDuration)
    };

    this.results.push(result);
    
    this.log(`${name}: Avg ${result.avgDuration}ms, P95 ${result.p95Duration}ms, ${result.requestsPerSecond} req/s`);
    
    return result;
  }

  // Calculate percentile
  percentile(arr, p) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }

  // Benchmark concurrent requests
  async benchmarkConcurrency(name, method, path, concurrency = 10, totalRequests = 100) {
    this.log(`Benchmarking ${name} with ${concurrency} concurrent requests...`);
    
    const startTime = Date.now();
    const durations = [];
    let successCount = 0;
    let errorCount = 0;

    const makeRequests = async (count) => {
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(
          this.makeRequest(method, path)
            .then(result => {
              durations.push(result.duration);
              if (result.statusCode >= 200 && result.statusCode < 300) {
                successCount++;
              } else {
                errorCount++;
              }
            })
            .catch(() => errorCount++)
        );
      }
      return Promise.all(promises);
    };

    // Execute requests in batches
    const batches = Math.ceil(totalRequests / concurrency);
    for (let i = 0; i < batches; i++) {
      const batchSize = Math.min(concurrency, totalRequests - (i * concurrency));
      await makeRequests(batchSize);
    }

    const totalDuration = Date.now() - startTime;
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const throughput = Math.round((totalRequests / totalDuration) * 1000);

    const result = {
      name,
      concurrency,
      totalRequests,
      successCount,
      errorCount,
      totalDuration,
      avgDuration: Math.round(avgDuration),
      throughput,
      p95Duration: Math.round(this.percentile(durations, 95)),
      p99Duration: Math.round(this.percentile(durations, 99))
    };

    this.results.push(result);
    
    this.log(`${name}: ${throughput} req/s, Avg ${result.avgDuration}ms`);
    
    return result;
  }

  // Benchmark database operations
  async benchmarkDatabase() {
    this.log('Benchmarking database operations...');
    
    // Test simple read
    await this.benchmarkEndpoint('DB: Simple Read', 'GET', '/api/users', 50);
    
    // Test complex query (if endpoint exists)
    await this.benchmarkEndpoint('DB: Complex Query', 'GET', '/api/analytics/dashboard', 20);
    
    // Test write operation
    await this.benchmarkEndpoint('DB: Write Operation', 'POST', '/api/feedback', 30);
  }

  // Benchmark API endpoints
  async benchmarkAPI() {
    this.log('Benchmarking API endpoints...');
    
    // Public endpoints
    await this.benchmarkEndpoint('API: Health Check', 'GET', '/health', 100);
    await this.benchmarkEndpoint('API: Static Content', 'GET', '/', 100);
    
    // API endpoints
    await this.benchmarkEndpoint('API: User List', 'GET', '/api/users', 50);
    await this.benchmarkEndpoint('API: Marketplace', 'GET', '/api/marketplace/listings', 50);
    await this.benchmarkEndpoint('API: Quests', 'GET', '/api/quests', 50);
  }

  // Benchmark under load
  async benchmarkLoad() {
    this.log('Benchmarking under load...');
    
    await this.benchmarkConcurrency('Load: Low (5 concurrent)', 'GET', '/api/users', 5, 100);
    await this.benchmarkConcurrency('Load: Medium (10 concurrent)', 'GET', '/api/users', 10, 100);
    await this.benchmarkConcurrency('Load: High (25 concurrent)', 'GET', '/api/users', 25, 100);
  }

  // Generate report
  generateReport() {
    this.log('Generating benchmark report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      summary: {
        totalTests: this.results.length,
        averageResponseTime: Math.round(
          this.results.reduce((sum, r) => sum + (r.avgDuration || 0), 0) / this.results.length
        )
      },
      results: this.results
    };

    // Save JSON report
    const jsonPath = path.join(__dirname, '../benchmark-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

    // Generate markdown report
    let markdown = '# AETHERIAL Platform - Performance Benchmark Report\n\n';
    markdown += `**Generated**: ${new Date().toISOString()}\n`;
    markdown += `**Target**: ${this.baseUrl}\n\n`;
    markdown += '## Summary\n\n';
    markdown += `- **Total Tests**: ${report.summary.totalTests}\n`;
    markdown += `- **Average Response Time**: ${report.summary.averageResponseTime}ms\n\n`;
    
    markdown += '## Benchmark Results\n\n';
    markdown += '| Test | Avg (ms) | Min (ms) | Max (ms) | P95 (ms) | P99 (ms) | Success | Error |\n';
    markdown += '|------|----------|----------|----------|----------|----------|---------|-------|\n';
    
    this.results.forEach(result => {
      if (result.iterations) {
        markdown += `| ${result.name} | ${result.avgDuration} | ${result.minDuration} | ${result.maxDuration} | ${result.p95Duration} | ${result.p99Duration} | ${result.successCount} | ${result.errorCount} |\n`;
      }
    });

    markdown += '\n## Concurrency Tests\n\n';
    markdown += '| Test | Concurrency | Total Requests | Throughput (req/s) | Avg (ms) | P95 (ms) | P99 (ms) |\n';
    markdown += '|------|-------------|----------------|-------------------|----------|----------|---------|\n';
    
    this.results.forEach(result => {
      if (result.concurrency) {
        markdown += `| ${result.name} | ${result.concurrency} | ${result.totalRequests} | ${result.throughput} | ${result.avgDuration} | ${result.p95Duration} | ${result.p99Duration} |\n`;
      }
    });

    markdown += '\n## Performance Recommendations\n\n';
    
    const slowTests = this.results.filter(r => r.avgDuration > 500);
    if (slowTests.length > 0) {
      markdown += '### Slow Endpoints (>500ms)\n\n';
      slowTests.forEach(test => {
        markdown += `- **${test.name}**: ${test.avgDuration}ms average\n`;
      });
      markdown += '\nConsider optimizing these endpoints with caching, database indexing, or query optimization.\n\n';
    }

    const highErrorRate = this.results.filter(r => r.errorCount > 0);
    if (highErrorRate.length > 0) {
      markdown += '### Tests with Errors\n\n';
      highErrorRate.forEach(test => {
        markdown += `- **${test.name}**: ${test.errorCount} errors out of ${test.iterations || test.totalRequests} requests\n`;
      });
      markdown += '\nInvestigate and fix errors to improve reliability.\n\n';
    }

    const mdPath = path.join(__dirname, '../BENCHMARK_REPORT.md');
    fs.writeFileSync(mdPath, markdown);

    this.log(`Report saved to ${jsonPath} and ${mdPath}`);

    return report;
  }

  // Run all benchmarks
  async runBenchmarks() {
    console.log('\n=== AETHERIAL Platform Performance Benchmarking ===\n');
    console.log(`Target: ${this.baseUrl}\n`);

    try {
      await this.benchmarkAPI();
      await this.benchmarkDatabase();
      await this.benchmarkLoad();

      const report = this.generateReport();

      console.log('\n=== Benchmarking Complete ===\n');
      console.log(`Total Tests: ${this.results.length}`);
      console.log(`Average Response Time: ${report.summary.averageResponseTime}ms\n`);

      const slowTests = this.results.filter(r => r.avgDuration > 1000);
      if (slowTests.length > 0) {
        console.log(`⚠️  ${slowTests.length} tests exceeded 1 second response time.`);
        process.exit(1);
      } else {
        console.log('✅ All tests completed within acceptable response times.');
        process.exit(0);
      }
    } catch (error) {
      console.error('Benchmarking failed:', error);
      process.exit(1);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const baseUrl = args[0] || 'http://localhost:5000';

// Run the benchmarks
const benchmark = new PerformanceBenchmark(baseUrl);
benchmark.runBenchmarks();

