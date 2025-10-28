#!/usr/bin/env node

/**
 * AETHERIAL Platform - Load Testing Script
 * 
 * This script performs comprehensive load testing including:
 * - Gradual load increase (ramp-up testing)
 * - Sustained load testing
 * - Peak load testing
 * - User journey simulation
 * - Real-world traffic patterns
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

class LoadTester {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.results = {
      tests: [],
      summary: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalDuration: 0,
        averageResponseTime: 0,
        requestsPerSecond: 0
      }
    };
    this.activeRequests = 0;
    this.maxConcurrency = 0;
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  // Make HTTP request
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
          'User-Agent': 'AETHERIAL-LoadTester/1.0'
        }
      };

      this.activeRequests++;
      this.maxConcurrency = Math.max(this.maxConcurrency, this.activeRequests);

      const req = protocol.request(options, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          this.activeRequests--;
          const duration = Date.now() - startTime;
          resolve({
            statusCode: res.statusCode,
            duration,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        });
      });

      req.on('error', (error) => {
        this.activeRequests--;
        reject(error);
      });

      req.setTimeout(30000, () => {
        req.destroy();
        this.activeRequests--;
        reject(new Error('Request timeout'));
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  // Simulate user journey
  async simulateUserJourney() {
    const journey = [
      { method: 'GET', path: '/', name: 'Homepage' },
      { method: 'GET', path: '/api/users', name: 'User List' },
      { method: 'GET', path: '/api/marketplace/listings', name: 'Marketplace' },
      { method: 'GET', path: '/api/quests', name: 'Quests' },
      { method: 'GET', path: '/api/leaderboard', name: 'Leaderboard' }
    ];

    const results = [];
    for (const step of journey) {
      try {
        const result = await this.makeRequest(step.method, step.path);
        results.push({ ...step, ...result });
      } catch (error) {
        results.push({ ...step, success: false, error: error.message });
      }
      // Small delay between steps to simulate user behavior
      await this.sleep(100);
    }

    return results;
  }

  // Sleep helper
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Calculate statistics
  calculateStats(durations) {
    if (durations.length === 0) return {};

    const sorted = durations.slice().sort((a, b) => a - b);
    const sum = durations.reduce((a, b) => a + b, 0);
    
    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: Math.round(sum / durations.length),
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }

  // Ramp-up test: Gradually increase load
  async rampUpTest(maxUsers = 100, rampUpTime = 60000, testDuration = 120000) {
    this.log(`Starting ramp-up test: 0 -> ${maxUsers} users over ${rampUpTime/1000}s`);
    
    const startTime = Date.now();
    const endTime = startTime + rampUpTime + testDuration;
    const userIncrement = maxUsers / (rampUpTime / 1000);
    
    let currentUsers = 0;
    const durations = [];
    let successCount = 0;
    let errorCount = 0;
    const userPromises = [];

    const spawnUser = async () => {
      while (Date.now() < endTime) {
        try {
          const result = await this.makeRequest('GET', '/api/users');
          durations.push(result.duration);
          if (result.success) successCount++;
          else errorCount++;
        } catch (error) {
          errorCount++;
        }
        await this.sleep(Math.random() * 2000 + 1000); // Random delay 1-3s
      }
    };

    // Gradually spawn users
    while (Date.now() < startTime + rampUpTime) {
      const targetUsers = Math.floor((Date.now() - startTime) / 1000 * userIncrement);
      while (currentUsers < targetUsers && currentUsers < maxUsers) {
        userPromises.push(spawnUser());
        currentUsers++;
      }
      await this.sleep(1000);
    }

    // Maintain max users for test duration
    this.log(`Reached ${maxUsers} concurrent users, maintaining load...`);
    
    // Wait for test to complete
    await this.sleep(testDuration);
    
    // Wait for all requests to complete
    await Promise.allSettled(userPromises);

    const totalDuration = Date.now() - startTime;
    const stats = this.calculateStats(durations);
    
    const result = {
      name: 'Ramp-up Test',
      maxUsers,
      rampUpTime,
      testDuration,
      totalRequests: durations.length,
      successCount,
      errorCount,
      totalDuration,
      maxConcurrency: this.maxConcurrency,
      throughput: Math.round((durations.length / totalDuration) * 1000),
      ...stats
    };

    this.results.tests.push(result);
    this.log(`Ramp-up test complete: ${result.throughput} req/s, ${result.avg}ms avg`);
    
    return result;
  }

  // Sustained load test: Constant load over time
  async sustainedLoadTest(concurrentUsers = 50, duration = 60000) {
    this.log(`Starting sustained load test: ${concurrentUsers} users for ${duration/1000}s`);
    
    const startTime = Date.now();
    const endTime = startTime + duration;
    const durations = [];
    let successCount = 0;
    let errorCount = 0;

    const simulateUser = async () => {
      while (Date.now() < endTime) {
        try {
          const result = await this.makeRequest('GET', '/api/users');
          durations.push(result.duration);
          if (result.success) successCount++;
          else errorCount++;
        } catch (error) {
          errorCount++;
        }
        await this.sleep(Math.random() * 1000 + 500); // Random delay 0.5-1.5s
      }
    };

    // Spawn all users at once
    const userPromises = Array(concurrentUsers).fill(null).map(() => simulateUser());
    
    // Wait for all users to complete
    await Promise.allSettled(userPromises);

    const totalDuration = Date.now() - startTime;
    const stats = this.calculateStats(durations);
    
    const result = {
      name: 'Sustained Load Test',
      concurrentUsers,
      duration,
      totalRequests: durations.length,
      successCount,
      errorCount,
      totalDuration,
      maxConcurrency: this.maxConcurrency,
      throughput: Math.round((durations.length / totalDuration) * 1000),
      ...stats
    };

    this.results.tests.push(result);
    this.log(`Sustained load test complete: ${result.throughput} req/s, ${result.avg}ms avg`);
    
    return result;
  }

  // Spike test: Sudden increase in load
  async spikeTest(normalUsers = 10, spikeUsers = 100, spikeDuration = 30000) {
    this.log(`Starting spike test: ${normalUsers} -> ${spikeUsers} users`);
    
    const durations = [];
    let successCount = 0;
    let errorCount = 0;

    const simulateUser = async (duration) => {
      const endTime = Date.now() + duration;
      while (Date.now() < endTime) {
        try {
          const result = await this.makeRequest('GET', '/api/users');
          durations.push(result.duration);
          if (result.success) successCount++;
          else errorCount++;
        } catch (error) {
          errorCount++;
        }
        await this.sleep(Math.random() * 1000 + 500);
      }
    };

    // Start with normal load
    this.log('Phase 1: Normal load');
    const normalPromises = Array(normalUsers).fill(null).map(() => 
      simulateUser(10000)
    );
    await Promise.allSettled(normalPromises);

    // Spike
    this.log('Phase 2: Spike!');
    const spikePromises = Array(spikeUsers).fill(null).map(() => 
      simulateUser(spikeDuration)
    );
    await Promise.allSettled(spikePromises);

    // Return to normal
    this.log('Phase 3: Return to normal');
    const recoveryPromises = Array(normalUsers).fill(null).map(() => 
      simulateUser(10000)
    );
    await Promise.allSettled(recoveryPromises);

    const stats = this.calculateStats(durations);
    
    const result = {
      name: 'Spike Test',
      normalUsers,
      spikeUsers,
      spikeDuration,
      totalRequests: durations.length,
      successCount,
      errorCount,
      maxConcurrency: this.maxConcurrency,
      ...stats
    };

    this.results.tests.push(result);
    this.log(`Spike test complete: ${result.avg}ms avg during spike`);
    
    return result;
  }

  // User journey test
  async userJourneyTest(concurrentUsers = 20, iterations = 10) {
    this.log(`Starting user journey test: ${concurrentUsers} users, ${iterations} iterations`);
    
    const durations = [];
    let successCount = 0;
    let errorCount = 0;

    const runJourneys = async () => {
      for (let i = 0; i < iterations; i++) {
        const journeyResults = await this.simulateUserJourney();
        journeyResults.forEach(step => {
          if (step.duration) durations.push(step.duration);
          if (step.success) successCount++;
          else errorCount++;
        });
        await this.sleep(Math.random() * 2000 + 1000);
      }
    };

    const userPromises = Array(concurrentUsers).fill(null).map(() => runJourneys());
    await Promise.allSettled(userPromises);

    const stats = this.calculateStats(durations);
    
    const result = {
      name: 'User Journey Test',
      concurrentUsers,
      iterations,
      totalRequests: durations.length,
      successCount,
      errorCount,
      ...stats
    };

    this.results.tests.push(result);
    this.log(`User journey test complete: ${result.successCount}/${result.totalRequests} successful`);
    
    return result;
  }

  // Generate report
  generateReport() {
    this.log('Generating load test report...');
    
    // Calculate summary
    this.results.tests.forEach(test => {
      this.results.summary.totalRequests += test.totalRequests || 0;
      this.results.summary.successfulRequests += test.successCount || 0;
      this.results.summary.failedRequests += test.errorCount || 0;
    });

    if (this.results.summary.totalRequests > 0) {
      this.results.summary.successRate = Math.round(
        (this.results.summary.successfulRequests / this.results.summary.totalRequests) * 100
      );
    }

    // Save JSON report
    const jsonPath = path.join(__dirname, '../load-test-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));

    // Generate markdown report
    let markdown = '# AETHERIAL Platform - Load Test Report\n\n';
    markdown += `**Generated**: ${new Date().toISOString()}\n`;
    markdown += `**Target**: ${this.baseUrl}\n\n`;
    
    markdown += '## Summary\n\n';
    markdown += `- **Total Requests**: ${this.results.summary.totalRequests}\n`;
    markdown += `- **Successful**: ${this.results.summary.successfulRequests}\n`;
    markdown += `- **Failed**: ${this.results.summary.failedRequests}\n`;
    markdown += `- **Success Rate**: ${this.results.summary.successRate}%\n\n`;
    
    markdown += '## Test Results\n\n';
    
    this.results.tests.forEach(test => {
      markdown += `### ${test.name}\n\n`;
      markdown += '| Metric | Value |\n';
      markdown += '|--------|-------|\n';
      
      Object.entries(test).forEach(([key, value]) => {
        if (key !== 'name') {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          markdown += `| ${label} | ${value} |\n`;
        }
      });
      
      markdown += '\n';
    });

    markdown += '## Recommendations\n\n';
    
    const avgResponseTimes = this.results.tests
      .filter(t => t.avg)
      .map(t => t.avg);
    
    if (avgResponseTimes.length > 0) {
      const overallAvg = Math.round(
        avgResponseTimes.reduce((a, b) => a + b, 0) / avgResponseTimes.length
      );
      
      if (overallAvg > 1000) {
        markdown += '- ⚠️ **High Response Times**: Average response time exceeds 1 second. Consider optimizing database queries, adding caching, or scaling infrastructure.\n';
      } else if (overallAvg > 500) {
        markdown += '- ⚡ **Moderate Response Times**: Response times are acceptable but could be improved with caching and optimization.\n';
      } else {
        markdown += '- ✅ **Good Response Times**: Response times are within acceptable ranges.\n';
      }
    }

    if (this.results.summary.successRate < 95) {
      markdown += '- ⚠️ **Low Success Rate**: Error rate is high. Investigate server logs and error responses.\n';
    } else if (this.results.summary.successRate < 99) {
      markdown += '- ⚡ **Moderate Success Rate**: Some errors detected. Review error logs for patterns.\n';
    } else {
      markdown += '- ✅ **High Success Rate**: System is handling load reliably.\n';
    }

    const mdPath = path.join(__dirname, '../LOAD_TEST_REPORT.md');
    fs.writeFileSync(mdPath, markdown);

    this.log(`Report saved to ${jsonPath} and ${mdPath}`);

    return this.results;
  }

  // Run all load tests
  async runAllTests() {
    console.log('\n=== AETHERIAL Platform Load Testing ===\n');
    console.log(`Target: ${this.baseUrl}\n`);

    try {
      // Run tests sequentially to avoid interference
      await this.sustainedLoadTest(20, 30000); // 20 users for 30 seconds
      await this.sleep(5000); // Cool down
      
      await this.rampUpTest(50, 30000, 30000); // Ramp to 50 users over 30s, maintain 30s
      await this.sleep(5000);
      
      await this.spikeTest(10, 50, 20000); // Spike from 10 to 50 users
      await this.sleep(5000);
      
      await this.userJourneyTest(10, 5); // 10 users, 5 journeys each

      const report = this.generateReport();

      console.log('\n=== Load Testing Complete ===\n');
      console.log(`Total Requests: ${report.summary.totalRequests}`);
      console.log(`Success Rate: ${report.summary.successRate}%\n`);

      if (report.summary.successRate < 95) {
        console.log('⚠️  Success rate below 95%. Review the report for details.');
        process.exit(1);
      } else {
        console.log('✅ Load testing completed successfully.');
        process.exit(0);
      }
    } catch (error) {
      console.error('Load testing failed:', error);
      process.exit(1);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const baseUrl = args[0] || 'http://localhost:5000';

// Run the load tests
const tester = new LoadTester(baseUrl);
tester.runAllTests();

