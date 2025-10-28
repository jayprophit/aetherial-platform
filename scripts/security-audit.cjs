#!/usr/bin/env node

/**
 * AETHERIAL Platform - Security Audit Script
 * 
 * This script performs automated security checks including:
 * - Dependency vulnerability scanning
 * - Code security analysis
 * - Configuration validation
 * - Common security misconfigurations
 * - API endpoint security checks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SecurityAuditor {
  constructor() {
    this.findings = [];
    this.criticalCount = 0;
    this.highCount = 0;
    this.mediumCount = 0;
    this.lowCount = 0;
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  addFinding(severity, category, description, recommendation) {
    this.findings.push({
      severity,
      category,
      description,
      recommendation,
      timestamp: new Date().toISOString()
    });

    switch(severity) {
      case 'CRITICAL':
        this.criticalCount++;
        break;
      case 'HIGH':
        this.highCount++;
        break;
      case 'MEDIUM':
        this.mediumCount++;
        break;
      case 'LOW':
        this.lowCount++;
        break;
    }
  }

  // Check for dependency vulnerabilities
  async checkDependencies() {
    this.log('Checking dependencies for known vulnerabilities...');
    
    try {
      const output = execSync('npm audit --json', { encoding: 'utf-8' });
      const auditResults = JSON.parse(output);
      
      if (auditResults.metadata) {
        const { vulnerabilities } = auditResults.metadata;
        
        if (vulnerabilities.critical > 0) {
          this.addFinding(
            'CRITICAL',
            'Dependencies',
            `Found ${vulnerabilities.critical} critical vulnerabilities in dependencies`,
            'Run "npm audit fix" to automatically fix vulnerabilities, or update packages manually'
          );
        }
        
        if (vulnerabilities.high > 0) {
          this.addFinding(
            'HIGH',
            'Dependencies',
            `Found ${vulnerabilities.high} high severity vulnerabilities in dependencies`,
            'Run "npm audit fix" and review package updates'
          );
        }
        
        if (vulnerabilities.moderate > 0) {
          this.addFinding(
            'MEDIUM',
            'Dependencies',
            `Found ${vulnerabilities.moderate} moderate vulnerabilities in dependencies`,
            'Consider updating affected packages'
          );
        }
      }
      
      this.log('Dependency check completed');
    } catch (error) {
      this.log('Error running npm audit: ' + error.message, 'ERROR');
    }
  }

  // Check environment configuration
  checkEnvironmentConfig() {
    this.log('Checking environment configuration...');
    
    const envPath = path.join(__dirname, '../.env');
    
    if (!fs.existsSync(envPath)) {
      this.addFinding(
        'HIGH',
        'Configuration',
        '.env file not found',
        'Create .env file with required environment variables'
      );
      return;
    }
    
    const envContent = fs.readFileSync(envPath, 'utf-8');
    
    // Check for sensitive data exposure
    const requiredVars = [
      'JWT_SECRET',
      'DATABASE_URL',
      'SESSION_SECRET'
    ];
    
    requiredVars.forEach(varName => {
      if (!envContent.includes(varName)) {
        this.addFinding(
          'HIGH',
          'Configuration',
          `Missing required environment variable: ${varName}`,
          `Add ${varName} to .env file with a secure value`
        );
      }
    });
    
    // Check for weak secrets
    if (envContent.includes('JWT_SECRET=secret') || 
        envContent.includes('JWT_SECRET=123456')) {
      this.addFinding(
        'CRITICAL',
        'Configuration',
        'Weak JWT_SECRET detected',
        'Use a strong, randomly generated secret (minimum 32 characters)'
      );
    }
    
    this.log('Environment configuration check completed');
  }

  // Check for common security misconfigurations
  checkSecurityHeaders() {
    this.log('Checking security headers configuration...');
    
    const serverPath = path.join(__dirname, '../server/index.ts');
    
    if (!fs.existsSync(serverPath)) {
      this.log('Server file not found', 'WARNING');
      return;
    }
    
    const serverContent = fs.readFileSync(serverPath, 'utf-8');
    
    const securityHeaders = [
      { name: 'helmet', pattern: /helmet\(\)/ },
      { name: 'CORS', pattern: /cors\(\)/ },
      { name: 'Rate Limiting', pattern: /rateLimit/ }
    ];
    
    securityHeaders.forEach(({ name, pattern }) => {
      if (!pattern.test(serverContent)) {
        this.addFinding(
          'MEDIUM',
          'Security Headers',
          `${name} middleware not detected`,
          `Implement ${name} middleware for enhanced security`
        );
      }
    });
    
    this.log('Security headers check completed');
  }

  // Check for SQL injection vulnerabilities
  checkSQLInjection() {
    this.log('Checking for potential SQL injection vulnerabilities...');
    
    const routesDir = path.join(__dirname, '../server/routes');
    
    if (!fs.existsSync(routesDir)) {
      this.log('Routes directory not found', 'WARNING');
      return;
    }
    
    const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
    
    routeFiles.forEach(file => {
      const filePath = path.join(routesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check for raw SQL queries
      if (content.includes('db.execute(') && content.includes('${')) {
        this.addFinding(
          'HIGH',
          'SQL Injection',
          `Potential SQL injection in ${file}`,
          'Use parameterized queries or ORM methods instead of string concatenation'
        );
      }
    });
    
    this.log('SQL injection check completed');
  }

  // Check authentication implementation
  checkAuthentication() {
    this.log('Checking authentication implementation...');
    
    const authPath = path.join(__dirname, '../server/routes/auth.ts');
    
    if (!fs.existsSync(authPath)) {
      this.addFinding(
        'CRITICAL',
        'Authentication',
        'Authentication module not found',
        'Implement proper authentication system'
      );
      return;
    }
    
    const authContent = fs.readFileSync(authPath, 'utf-8');
    
    // Check for password hashing
    if (!authContent.includes('bcrypt') && !authContent.includes('argon2')) {
      this.addFinding(
        'CRITICAL',
        'Authentication',
        'Password hashing not detected',
        'Implement bcrypt or argon2 for password hashing'
      );
    }
    
    // Check for JWT implementation
    if (!authContent.includes('jsonwebtoken') && !authContent.includes('jwt')) {
      this.addFinding(
        'HIGH',
        'Authentication',
        'JWT implementation not detected',
        'Implement JWT for secure token-based authentication'
      );
    }
    
    this.log('Authentication check completed');
  }

  // Check for exposed sensitive files
  checkSensitiveFiles() {
    this.log('Checking for exposed sensitive files...');
    
    const sensitiveFiles = [
      '.env',
      'config/secrets.json',
      'private.key',
      'id_rsa'
    ];
    
    const gitignorePath = path.join(__dirname, '../.gitignore');
    
    if (!fs.existsSync(gitignorePath)) {
      this.addFinding(
        'HIGH',
        'File Exposure',
        '.gitignore file not found',
        'Create .gitignore to prevent committing sensitive files'
      );
      return;
    }
    
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    
    sensitiveFiles.forEach(file => {
      if (!gitignoreContent.includes(file)) {
        this.addFinding(
          'MEDIUM',
          'File Exposure',
          `${file} not in .gitignore`,
          `Add ${file} to .gitignore to prevent accidental commits`
        );
      }
    });
    
    this.log('Sensitive files check completed');
  }

  // Check CORS configuration
  checkCORS() {
    this.log('Checking CORS configuration...');
    
    const serverPath = path.join(__dirname, '../server/index.ts');
    
    if (!fs.existsSync(serverPath)) {
      return;
    }
    
    const serverContent = fs.readFileSync(serverPath, 'utf-8');
    
    // Check for wildcard CORS
    if (serverContent.includes('origin: "*"') || serverContent.includes("origin: '*'")) {
      this.addFinding(
        'HIGH',
        'CORS',
        'Wildcard CORS origin detected',
        'Restrict CORS to specific trusted domains in production'
      );
    }
    
    this.log('CORS check completed');
  }

  // Check for hardcoded secrets
  checkHardcodedSecrets() {
    this.log('Checking for hardcoded secrets...');
    
    const patterns = [
      { name: 'API Key', regex: /api[_-]?key\s*=\s*['"][a-zA-Z0-9]{20,}['"]/ },
      { name: 'Password', regex: /password\s*=\s*['"][^'"]{8,}['"]/ },
      { name: 'Secret', regex: /secret\s*=\s*['"][^'"]{16,}['"]/ },
      { name: 'Token', regex: /token\s*=\s*['"][a-zA-Z0-9]{20,}['"]/ }
    ];
    
    const checkDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          checkDir(filePath);
        } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
          const content = fs.readFileSync(filePath, 'utf-8');
          
          patterns.forEach(({ name, regex }) => {
            if (regex.test(content)) {
              this.addFinding(
                'HIGH',
                'Hardcoded Secrets',
                `Potential hardcoded ${name} in ${filePath}`,
                'Move secrets to environment variables'
              );
            }
          });
        }
      });
    };
    
    checkDir(path.join(__dirname, '../server'));
    
    this.log('Hardcoded secrets check completed');
  }

  // Generate report
  generateReport() {
    this.log('Generating security audit report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.findings.length,
        critical: this.criticalCount,
        high: this.highCount,
        medium: this.mediumCount,
        low: this.lowCount
      },
      findings: this.findings
    };
    
    // Save JSON report
    const jsonPath = path.join(__dirname, '../security-audit-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    
    // Generate markdown report
    let markdown = '# AETHERIAL Platform - Security Audit Report\n\n';
    markdown += `**Generated**: ${new Date().toISOString()}\n\n`;
    markdown += '## Summary\n\n';
    markdown += `- **Total Findings**: ${this.findings.length}\n`;
    markdown += `- **Critical**: ${this.criticalCount}\n`;
    markdown += `- **High**: ${this.highCount}\n`;
    markdown += `- **Medium**: ${this.mediumCount}\n`;
    markdown += `- **Low**: ${this.lowCount}\n\n`;
    
    if (this.findings.length > 0) {
      markdown += '## Findings\n\n';
      
      ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
        const severityFindings = this.findings.filter(f => f.severity === severity);
        
        if (severityFindings.length > 0) {
          markdown += `### ${severity} Severity\n\n`;
          
          severityFindings.forEach((finding, index) => {
            markdown += `#### ${index + 1}. ${finding.category}\n\n`;
            markdown += `**Description**: ${finding.description}\n\n`;
            markdown += `**Recommendation**: ${finding.recommendation}\n\n`;
          });
        }
      });
    } else {
      markdown += '## ✅ No Security Issues Found\n\n';
      markdown += 'All security checks passed successfully.\n';
    }
    
    const mdPath = path.join(__dirname, '../SECURITY_AUDIT_REPORT.md');
    fs.writeFileSync(mdPath, markdown);
    
    this.log(`Report saved to ${jsonPath} and ${mdPath}`);
    
    return report;
  }

  // Run all checks
  async runAudit() {
    console.log('\n=== AETHERIAL Platform Security Audit ===\n');
    
    await this.checkDependencies();
    this.checkEnvironmentConfig();
    this.checkSecurityHeaders();
    this.checkSQLInjection();
    this.checkAuthentication();
    this.checkSensitiveFiles();
    this.checkCORS();
    this.checkHardcodedSecrets();
    
    const report = this.generateReport();
    
    console.log('\n=== Audit Complete ===\n');
    console.log(`Total Findings: ${this.findings.length}`);
    console.log(`Critical: ${this.criticalCount}`);
    console.log(`High: ${this.highCount}`);
    console.log(`Medium: ${this.mediumCount}`);
    console.log(`Low: ${this.lowCount}\n`);
    
    if (this.criticalCount > 0 || this.highCount > 0) {
      console.log('⚠️  Critical or high severity issues found. Please review the report.');
      process.exit(1);
    } else {
      console.log('✅ No critical or high severity issues found.');
      process.exit(0);
    }
  }
}

// Run the audit
const auditor = new SecurityAuditor();
auditor.runAudit().catch(error => {
  console.error('Audit failed:', error);
  process.exit(1);
});

