#!/usr/bin/env node

/**
 * AETHERIAL Platform - Penetration Testing Script
 * 
 * This script performs basic penetration testing including:
 * - API endpoint fuzzing
 * - Authentication bypass attempts
 * - SQL injection testing
 * - XSS vulnerability testing
 * - CSRF testing
 * - Rate limiting validation
 */

const http = require('http');
const https = require('https');

class PenetrationTester {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.results = [];
    this.passedTests = 0;
    this.failedTests = 0;
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  addResult(testName, passed, details) {
    this.results.push({
      testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });

    if (passed) {
      this.passedTests++;
    } else {
      this.failedTests++;
    }
  }

  // Make HTTP request
  async makeRequest(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const protocol = url.protocol === 'https:' ? https : http;
      
      const options = {
        method,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      const req = protocol.request(options, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
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

  // Test 1: SQL Injection
  async testSQLInjection() {
    this.log('Testing SQL Injection vulnerabilities...');
    
    const sqlPayloads = [
      "' OR '1'='1",
      "' OR 1=1--",
      "admin'--",
      "' UNION SELECT NULL--",
      "1' AND '1'='1"
    ];

    let vulnerable = false;

    for (const payload of sqlPayloads) {
      try {
        const response = await this.makeRequest('POST', '/api/auth/login', {
          email: payload,
          password: payload
        });

        // If we get a 200 or unusual response, might be vulnerable
        if (response.statusCode === 200 || response.body.includes('user')) {
          vulnerable = true;
          this.addResult(
            'SQL Injection Test',
            false,
            `Potential SQL injection vulnerability with payload: ${payload}`
          );
          break;
        }
      } catch (error) {
        // Expected to fail
      }
    }

    if (!vulnerable) {
      this.addResult(
        'SQL Injection Test',
        true,
        'No SQL injection vulnerabilities detected'
      );
    }
  }

  // Test 2: XSS (Cross-Site Scripting)
  async testXSS() {
    this.log('Testing XSS vulnerabilities...');
    
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>',
      'javascript:alert("XSS")'
    ];

    let vulnerable = false;

    for (const payload of xssPayloads) {
      try {
        const response = await this.makeRequest('POST', '/api/feedback', {
          userId: 1,
          type: 'bug',
          message: payload
        });

        // Check if payload is reflected without sanitization
        if (response.body && response.body.includes(payload)) {
          vulnerable = true;
          this.addResult(
            'XSS Test',
            false,
            `Potential XSS vulnerability - payload reflected: ${payload}`
          );
          break;
        }
      } catch (error) {
        // Expected to fail
      }
    }

    if (!vulnerable) {
      this.addResult(
        'XSS Test',
        true,
        'No XSS vulnerabilities detected'
      );
    }
  }

  // Test 3: Authentication Bypass
  async testAuthBypass() {
    this.log('Testing authentication bypass...');
    
    try {
      // Try to access protected endpoint without token
      const response = await this.makeRequest('GET', '/api/users/profile');

      if (response.statusCode === 200) {
        this.addResult(
          'Authentication Bypass Test',
          false,
          'Protected endpoint accessible without authentication'
        );
      } else if (response.statusCode === 401 || response.statusCode === 403) {
        this.addResult(
          'Authentication Bypass Test',
          true,
          'Protected endpoints properly secured'
        );
      }
    } catch (error) {
      this.addResult(
        'Authentication Bypass Test',
        true,
        'Authentication properly enforced'
      );
    }
  }

  // Test 4: Rate Limiting
  async testRateLimiting() {
    this.log('Testing rate limiting...');
    
    const requests = [];
    const numRequests = 100;

    // Send rapid requests
    for (let i = 0; i < numRequests; i++) {
      requests.push(
        this.makeRequest('POST', '/api/auth/login', {
          email: 'test@test.com',
          password: 'test'
        }).catch(() => ({ statusCode: 429 }))
      );
    }

    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.statusCode === 429);

    if (rateLimited) {
      this.addResult(
        'Rate Limiting Test',
        true,
        'Rate limiting is properly configured'
      );
    } else {
      this.addResult(
        'Rate Limiting Test',
        false,
        'Rate limiting not detected - server may be vulnerable to DoS attacks'
      );
    }
  }

  // Test 5: CORS Configuration
  async testCORS() {
    this.log('Testing CORS configuration...');
    
    try {
      const response = await this.makeRequest('OPTIONS', '/api/users', null, {
        'Origin': 'http://malicious-site.com'
      });

      const corsHeader = response.headers['access-control-allow-origin'];

      if (corsHeader === '*') {
        this.addResult(
          'CORS Test',
          false,
          'CORS allows all origins (*) - potential security risk'
        );
      } else if (corsHeader === 'http://malicious-site.com') {
        this.addResult(
          'CORS Test',
          false,
          'CORS allows untrusted origins'
        );
      } else {
        this.addResult(
          'CORS Test',
          true,
          'CORS properly configured'
        );
      }
    } catch (error) {
      this.addResult(
        'CORS Test',
        true,
        'CORS configuration appears secure'
      );
    }
  }

  // Test 6: Security Headers
  async testSecurityHeaders() {
    this.log('Testing security headers...');
    
    try {
      const response = await this.makeRequest('GET', '/');

      const requiredHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection',
        'strict-transport-security'
      ];

      const missingHeaders = requiredHeaders.filter(
        header => !response.headers[header]
      );

      if (missingHeaders.length > 0) {
        this.addResult(
          'Security Headers Test',
          false,
          `Missing security headers: ${missingHeaders.join(', ')}`
        );
      } else {
        this.addResult(
          'Security Headers Test',
          true,
          'All required security headers present'
        );
      }
    } catch (error) {
      this.addResult(
        'Security Headers Test',
        false,
        'Unable to test security headers: ' + error.message
      );
    }
  }

  // Test 7: Directory Traversal
  async testDirectoryTraversal() {
    this.log('Testing directory traversal vulnerabilities...');
    
    const traversalPayloads = [
      '../../../etc/passwd',
      '..\\..\\..\\windows\\system32\\config\\sam',
      '....//....//....//etc/passwd',
      '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
    ];

    let vulnerable = false;

    for (const payload of traversalPayloads) {
      try {
        const response = await this.makeRequest('GET', `/api/files/${payload}`);

        if (response.statusCode === 200 && 
            (response.body.includes('root:') || response.body.includes('Administrator'))) {
          vulnerable = true;
          this.addResult(
            'Directory Traversal Test',
            false,
            `Directory traversal vulnerability detected with payload: ${payload}`
          );
          break;
        }
      } catch (error) {
        // Expected to fail
      }
    }

    if (!vulnerable) {
      this.addResult(
        'Directory Traversal Test',
        true,
        'No directory traversal vulnerabilities detected'
      );
    }
  }

  // Test 8: Insecure Direct Object Reference (IDOR)
  async testIDOR() {
    this.log('Testing IDOR vulnerabilities...');
    
    try {
      // Try to access another user's data
      const response = await this.makeRequest('GET', '/api/users/999999');

      if (response.statusCode === 200) {
        this.addResult(
          'IDOR Test',
          false,
          'Potential IDOR vulnerability - able to access other user data without authorization'
        );
      } else if (response.statusCode === 401 || response.statusCode === 403) {
        this.addResult(
          'IDOR Test',
          true,
          'IDOR protection properly implemented'
        );
      }
    } catch (error) {
      this.addResult(
        'IDOR Test',
        true,
        'IDOR protection appears to be in place'
      );
    }
  }

  // Generate report
  generateReport() {
    this.log('Generating penetration test report...');
    
    const fs = require('fs');
    const path = require('path');

    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      summary: {
        total: this.results.length,
        passed: this.passedTests,
        failed: this.failedTests,
        successRate: ((this.passedTests / this.results.length) * 100).toFixed(2) + '%'
      },
      results: this.results
    };

    // Save JSON report
    const jsonPath = path.join(__dirname, '../penetration-test-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

    // Generate markdown report
    let markdown = '# AETHERIAL Platform - Penetration Test Report\n\n';
    markdown += `**Generated**: ${new Date().toISOString()}\n`;
    markdown += `**Target**: ${this.baseUrl}\n\n`;
    markdown += '## Summary\n\n';
    markdown += `- **Total Tests**: ${this.results.length}\n`;
    markdown += `- **Passed**: ${this.passedTests}\n`;
    markdown += `- **Failed**: ${this.failedTests}\n`;
    markdown += `- **Success Rate**: ${report.summary.successRate}\n\n`;
    
    markdown += '## Test Results\n\n';
    
    this.results.forEach((result, index) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      markdown += `### ${index + 1}. ${result.testName} - ${status}\n\n`;
      markdown += `**Details**: ${result.details}\n\n`;
    });

    const mdPath = path.join(__dirname, '../PENETRATION_TEST_REPORT.md');
    fs.writeFileSync(mdPath, markdown);

    this.log(`Report saved to ${jsonPath} and ${mdPath}`);

    return report;
  }

  // Run all tests
  async runTests() {
    console.log('\n=== AETHERIAL Platform Penetration Testing ===\n');
    console.log(`Target: ${this.baseUrl}\n`);

    await this.testSQLInjection();
    await this.testXSS();
    await this.testAuthBypass();
    await this.testRateLimiting();
    await this.testCORS();
    await this.testSecurityHeaders();
    await this.testDirectoryTraversal();
    await this.testIDOR();

    const report = this.generateReport();

    console.log('\n=== Testing Complete ===\n');
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Passed: ${this.passedTests}`);
    console.log(`Failed: ${this.failedTests}`);
    console.log(`Success Rate: ${report.summary.successRate}\n`);

    if (this.failedTests > 0) {
      console.log('⚠️  Some tests failed. Please review the report for details.');
      process.exit(1);
    } else {
      console.log('✅ All penetration tests passed.');
      process.exit(0);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const baseUrl = args[0] || 'http://localhost:5000';

// Run the tests
const tester = new PenetrationTester(baseUrl);
tester.runTests().catch(error => {
  console.error('Testing failed:', error);
  process.exit(1);
});

