#!/usr/bin/env node

/**
 * AETHERIAL Platform - Stress Testing Script
 * 
 * This script performs stress testing to find system breaking points:
 * - Gradually increase load until system fails
 * - Test resource exhaustion scenarios
 * - Identify maximum capacity
 * - Test recovery after stress
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

class StressTester {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.results = {
      breakingPoint: null,
      maxSuccessfulLoad: 0,
      tests: [],
      recommendations: []
    };
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  async makeRequest(method, path) {
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
          'Content-Type': 'application/json'
        }
      };

      const req = protocol.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            duration: Date.now() - startTime,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        });
      });

      req.on('error', (error) => reject(error));
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });

      req.end();
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Test with increasing load until failure
  async findBreakingPoint(startUsers = 10, increment = 10, maxUsers = 500) {
    this.log('Starting breaking point test...');
    
    let currentUsers = startUsers;
    let lastSuccessfulLoad = 0;
    const testResults = [];

    while (currentUsers <= maxUsers) {
      this.log(`Testing with ${currentUsers} concurrent users...`);
      
      const result = await this.testLoad(currentUsers, 10000); // 10 second test
      testResults.push(result);

      // Check if system is still healthy
      const errorRate = (result.errorCount / result.totalRequests) * 100;
      const avgResponseTime = result.avgDuration;

      this.log(`Result: ${result.successCount}/${result.totalRequests} successful, ${avgResponseTime}ms avg, ${errorRate.toFixed(1)}% errors`);

      if (errorRate > 10 || avgResponseTime > 5000) {
        this.log(`Breaking point found at ${currentUsers} concurrent users`, 'WARN');
        this.results.breakingPoint = currentUsers;
        this.results.maxSuccessfulLoad = lastSuccessfulLoad;
        break;
      }

      lastSuccessfulLoad = currentUsers;
      currentUsers += increment;

      // Cool down between tests
      await this.sleep(5000);
    }

    if (!this.results.breakingPoint) {
      this.log(`System handled ${maxUsers} users without breaking`, 'INFO');
      this.results.maxSuccessfulLoad = maxUsers;
    }

    this.results.tests.push({
      name: 'Breaking Point Test',
      results: testResults,
      breakingPoint: this.results.breakingPoint,
      maxSuccessfulLoad: this.results.maxSuccessfulLoad
    });

    return this.results.breakingPoint;
  }

  // Test specific load level
  async testLoad(concurrentUsers, duration) {
    const endTime = Date.now() + duration;
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
        await this.sleep(Math.random() * 500);
      }
    };

    const userPromises = Array(concurrentUsers).fill(null).map(() => simulateUser());
    await Promise.allSettled(userPromises);

    const avgDuration = durations.length > 0 
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    return {
      concurrentUsers,
      totalRequests: durations.length,
      successCount,
      errorCount,
      avgDuration,
      throughput: Math.round((durations.length / duration) * 1000)
    };
  }

  // Memory stress test
  async memoryStressTest(duration = 60000) {
    this.log('Starting memory stress test...');
    
    const startTime = Date.now();
    const endTime = startTime + duration;
    const results = [];

    // Continuously make requests to stress memory
    const stressMemory = async () => {
      while (Date.now() < endTime) {
        try {
          // Request endpoints that return large payloads
          await this.makeRequest('GET', '/api/users');
          await this.makeRequest('GET', '/api/marketplace/listings');
          await this.makeRequest('GET', '/api/quests');
        } catch (error) {
          // Continue even on errors
        }
      }
    };

    // Run with high concurrency
    const promises = Array(100).fill(null).map(() => stressMemory());
    await Promise.allSettled(promises);

    this.log('Memory stress test complete');
    
    this.results.tests.push({
      name: 'Memory Stress Test',
      duration,
      concurrentUsers: 100,
      status: 'completed'
    });
  }

  // Connection stress test
  async connectionStressTest() {
    this.log('Starting connection stress test...');
    
    const maxConnections = 1000;
    const connections = [];
    let successfulConnections = 0;
    let failedConnections = 0;

    // Try to open many connections simultaneously
    for (let i = 0; i < maxConnections; i++) {
      connections.push(
        this.makeRequest('GET', '/health')
          .then(() => successfulConnections++)
          .catch(() => failedConnections++)
      );
    }

    await Promise.allSettled(connections);

    this.log(`Connection test: ${successfulConnections} successful, ${failedConnections} failed`);

    this.results.tests.push({
      name: 'Connection Stress Test',
      maxConnections,
      successfulConnections,
      failedConnections,
      connectionSuccessRate: Math.round((successfulConnections / maxConnections) * 100)
    });
  }

  // Recovery test: Test system recovery after stress
  async recoveryTest() {
    this.log('Starting recovery test...');
    
    // Phase 1: High stress
    this.log('Phase 1: Applying high stress...');
    await this.testLoad(200, 30000);
    
    // Phase 2: Cool down
    this.log('Phase 2: Cooling down...');
    await this.sleep(10000);
    
    // Phase 3: Test normal operation
    this.log('Phase 3: Testing recovery...');
    const recoveryResult = await this.testLoad(20, 20000);
    
    const recovered = recoveryResult.errorCount === 0 && recoveryResult.avgDuration < 1000;
    
    this.log(recovered ? 'System recovered successfully' : 'System recovery incomplete', 
             recovered ? 'INFO' : 'WARN');

    this.results.tests.push({
      name: 'Recovery Test',
      recovered,
      postRecoveryErrorRate: (recoveryResult.errorCount / recoveryResult.totalRequests) * 100,
      postRecoveryAvgDuration: recoveryResult.avgDuration
    });

    return recovered;
  }

  // Generate recommendations
  generateRecommendations() {
    const { breakingPoint, maxSuccessfulLoad } = this.results;

    if (breakingPoint) {
      if (breakingPoint < 50) {
        this.results.recommendations.push(
          '⚠️ **Critical**: System breaks under low load (<50 users). Immediate optimization required.',
          'Consider: Database connection pooling, caching, query optimization, horizontal scaling.'
        );
      } else if (breakingPoint < 100) {
        this.results.recommendations.push(
          '⚡ **Warning**: System capacity is limited (<100 users). Optimization recommended.',
          'Consider: Adding caching layer, optimizing slow queries, increasing server resources.'
        );
      } else if (breakingPoint < 500) {
        this.results.recommendations.push(
          '✅ **Good**: System handles moderate load (100-500 users).',
          'Consider: Load balancing, caching for further improvement.'
        );
      } else {
        this.results.recommendations.push(
          '🚀 **Excellent**: System handles high load (>500 users).',
          'Current infrastructure is well-optimized for production use.'
        );
      }
    }

    // Check connection test results
    const connectionTest = this.results.tests.find(t => t.name === 'Connection Stress Test');
    if (connectionTest && connectionTest.connectionSuccessRate < 90) {
      this.results.recommendations.push(
        '⚠️ **Connection Limit**: System struggling with concurrent connections.',
        'Consider: Increasing connection pool size, implementing connection queuing.'
      );
    }

    // Check recovery
    const recoveryTest = this.results.tests.find(t => t.name === 'Recovery Test');
    if (recoveryTest && !recoveryTest.recovered) {
      this.results.recommendations.push(
        '⚠️ **Recovery Issue**: System not recovering properly after stress.',
        'Consider: Implementing circuit breakers, better error handling, resource cleanup.'
      );
    }
  }

  // Generate report
  generateReport() {
    this.log('Generating stress test report...');
    
    this.generateRecommendations();

    // Save JSON report
    const jsonPath = path.join(__dirname, '../stress-test-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));

    // Generate markdown report
    let markdown = '# AETHERIAL Platform - Stress Test Report\n\n';
    markdown += `**Generated**: ${new Date().toISOString()}\n`;
    markdown += `**Target**: ${this.baseUrl}\n\n`;
    
    markdown += '## Summary\n\n';
    if (this.results.breakingPoint) {
      markdown += `- **Breaking Point**: ${this.results.breakingPoint} concurrent users\n`;
      markdown += `- **Max Successful Load**: ${this.results.maxSuccessfulLoad} concurrent users\n`;
    } else {
      markdown += `- **Max Tested Load**: ${this.results.maxSuccessfulLoad} concurrent users (no breaking point found)\n`;
    }
    markdown += '\n';
    
    markdown += '## Test Results\n\n';
    this.results.tests.forEach(test => {
      markdown += `### ${test.name}\n\n`;
      markdown += '| Metric | Value |\n';
      markdown += '|--------|-------|\n';
      
      Object.entries(test).forEach(([key, value]) => {
        if (key !== 'name' && key !== 'results') {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          markdown += `| ${label} | ${typeof value === 'object' ? JSON.stringify(value) : value} |\n`;
        }
      });
      
      markdown += '\n';
    });

    markdown += '## Recommendations\n\n';
    this.results.recommendations.forEach(rec => {
      markdown += `${rec}\n\n`;
    });

    const mdPath = path.join(__dirname, '../STRESS_TEST_REPORT.md');
    fs.writeFileSync(mdPath, markdown);

    this.log(`Report saved to ${jsonPath} and ${mdPath}`);

    return this.results;
  }

  // Run all stress tests
  async runAllTests() {
    console.log('\n=== AETHERIAL Platform Stress Testing ===\n');
    console.log(`Target: ${this.baseUrl}\n`);

    try {
      await this.findBreakingPoint(10, 20, 300);
      await this.sleep(10000);
      
      await this.connectionStressTest();
      await this.sleep(10000);
      
      await this.memoryStressTest(30000);
      await this.sleep(10000);
      
      await this.recoveryTest();

      const report = this.generateReport();

      console.log('\n=== Stress Testing Complete ===\n');
      if (report.breakingPoint) {
        console.log(`Breaking Point: ${report.breakingPoint} users`);
        console.log(`Max Successful Load: ${report.maxSuccessfulLoad} users\n`);
      }

      console.log('Recommendations:');
      report.recommendations.forEach(rec => console.log(`  ${rec}`));

      process.exit(0);
    } catch (error) {
      console.error('Stress testing failed:', error);
      process.exit(1);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const baseUrl = args[0] || 'http://localhost:5000';

// Run the stress tests
const tester = new StressTester(baseUrl);
tester.runAllTests();

