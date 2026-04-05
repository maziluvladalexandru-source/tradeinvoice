#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔒 SECURITY AUDIT - TradeInvoice\n');

const findings = {
  criticalRisks: [],
  highRisks: [],
  mediumRisks: [],
  lowRisks: [],
  warnings: [],
};

// 1. Check for hardcoded secrets
console.log('📋 Scanning for hardcoded secrets...');
const secretPatterns = [
  { name: 'API Keys', regex: /(['\"])sk_[a-zA-Z0-9_-]{20,}(['\"])/ },
  { name: 'Private Keys', regex: /-----BEGIN PRIVATE KEY-----/ },
  { name: 'JWT Secrets', regex: /jwt.*secret/i },
  { name: 'Database URLs', regex: /postgresql:\/\/.*@.*/ },
  { name: 'Auth tokens', regex: /Bearer\s+[a-zA-Z0-9._-]{50,}/ },
];

const filesToCheck = glob.sync('src/**/*.{ts,tsx,js}', { 
  ignore: ['node_modules/**', '.next/**'],
  cwd: __dirname 
});

filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    secretPatterns.forEach(pattern => {
      if (pattern.regex.test(content) && !content.includes('REDACTED')) {
        findings.criticalRisks.push({
          file,
          type: pattern.name,
          severity: 'CRITICAL'
        });
      }
    });
  } catch (e) {}
});

// 2. Check for SQL injection vulnerabilities
console.log('📋 Scanning for SQL injection patterns...');
const sqlPatterns = [
  { name: 'String concatenation in queries', regex: /query\s*\(\s*[`'"].*\$\{/ },
  { name: 'Direct string interpolation', regex: /SELECT.*\$\{.*\}/ },
];

filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    if (content.includes('prisma')) return; // Prisma is safe
    sqlPatterns.forEach(pattern => {
      if (pattern.regex.test(content)) {
        findings.highRisks.push({
          file,
          type: pattern.name,
          severity: 'HIGH'
        });
      }
    });
  } catch (e) {}
});

// 3. Check for XSS vulnerabilities (dangerouslySetInnerHTML)
console.log('📋 Scanning for XSS vulnerabilities...');
filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('dangerouslySetInnerHTML')) {
        findings.highRisks.push({
          file,
          line: idx + 1,
          type: 'dangerouslySetInnerHTML usage',
          severity: 'HIGH',
          content: line.trim()
        });
      }
    });
  } catch (e) {}
});

// 4. Check for missing authentication checks
console.log('📋 Scanning for missing auth checks...');
const apiRoutes = glob.sync('src/app/api/**/*.ts', { 
  ignore: ['node_modules/**'],
  cwd: __dirname 
});

apiRoutes.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    
    // Check if route has auth check
    const hasAuth = content.includes('getSession') || 
                    content.includes('getUser') ||
                    content.includes('authMiddleware') ||
                    content.includes('requireAuth') ||
                    content.includes('Stripe') ||
                    content.includes('webhook') ||
                    content.includes('public'); // Known public routes
    
    if (!hasAuth && !file.includes('webhook') && !file.includes('auth/login')) {
      findings.mediumRisks.push({
        file,
        type: 'Possibly missing authentication check',
        severity: 'MEDIUM'
      });
    }
  } catch (e) {}
});

// 5. Check for CORS misconfiguration
console.log('📋 Scanning for CORS issues...');
filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    if (content.includes('Access-Control-Allow-Origin') && content.includes('*')) {
      findings.highRisks.push({
        file,
        type: 'CORS allows all origins (*)',
        severity: 'HIGH'
      });
    }
  } catch (e) {}
});

// 6. Check for exposed environment variables
console.log('📋 Scanning for exposed env variables...');
filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('process.env') && !line.includes('NEXT_PUBLIC')) {
        // This is OK - private env vars should use process.env
      }
      if (line.includes('NEXT_PUBLIC') && /SECRET|KEY|PASSWORD|TOKEN/i.test(line)) {
        findings.criticalRisks.push({
          file,
          line: idx + 1,
          type: 'Secret exposed via NEXT_PUBLIC_*',
          severity: 'CRITICAL',
          content: line.trim()
        });
      }
    });
  } catch (e) {}
});

// 7. Check for unvalidated redirects
console.log('📋 Scanning for unvalidated redirects...');
filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if ((line.includes('redirect(') || line.includes('router.push(')) && 
          line.includes('params') && !line.includes('validate')) {
        findings.mediumRisks.push({
          file,
          line: idx + 1,
          type: 'Possibly unvalidated redirect',
          severity: 'MEDIUM',
          content: line.trim()
        });
      }
    });
  } catch (e) {}
});

// 8. Check dependencies
console.log('📋 Checking package.json for known vulnerabilities...');
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
  const knownVulnerable = {
    'node-fetch': '< 2.6.7',
    'axios': '< 0.21.2',
    'lodash': '< 4.17.21',
  };
  
  Object.entries(knownVulnerable).forEach(([dep, minVersion]) => {
    if (pkg.dependencies[dep] || pkg.devDependencies[dep]) {
      findings.lowRisks.push({
        type: `Dependency ${dep} should be version ${minVersion} or higher`,
        severity: 'LOW'
      });
    }
  });
} catch (e) {}

// Report
console.log('\n');
console.log('═'.repeat(60));
console.log('SECURITY AUDIT RESULTS');
console.log('═'.repeat(60));

if (findings.criticalRisks.length > 0) {
  console.log(`\n🔴 CRITICAL RISKS (${findings.criticalRisks.length}):`);
  findings.criticalRisks.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.type}`);
    if (f.file) console.log(`     File: ${f.file}`);
    if (f.line) console.log(`     Line: ${f.line}`);
  });
}

if (findings.highRisks.length > 0) {
  console.log(`\n🟠 HIGH RISKS (${findings.highRisks.length}):`);
  findings.highRisks.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.type}`);
    if (f.file) console.log(`     File: ${f.file}`);
    if (f.line) console.log(`     Line: ${f.line}`);
  });
}

if (findings.mediumRisks.length > 0) {
  console.log(`\n🟡 MEDIUM RISKS (${findings.mediumRisks.length}):`);
  findings.mediumRisks.slice(0, 10).forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.type}`);
    if (f.file) console.log(`     File: ${f.file}`);
    if (f.line) console.log(`     Line: ${f.line}`);
  });
  if (findings.mediumRisks.length > 10) {
    console.log(`  ... and ${findings.mediumRisks.length - 10} more`);
  }
}

if (findings.lowRisks.length > 0) {
  console.log(`\n🟢 LOW RISKS (${findings.lowRisks.length}):`);
  findings.lowRisks.slice(0, 5).forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.type}`);
  });
  if (findings.lowRisks.length > 5) {
    console.log(`  ... and ${findings.lowRisks.length - 5} more`);
  }
}

const total = findings.criticalRisks.length + findings.highRisks.length + 
              findings.mediumRisks.length + findings.lowRisks.length;

console.log(`\n${'═'.repeat(60)}`);
console.log(`TOTAL ISSUES: ${total}`);
console.log('═'.repeat(60));

if (findings.criticalRisks.length > 0) {
  console.log('\n⚠️  CRITICAL: Fix before deployment!');
  process.exit(1);
}

if (findings.highRisks.length > 0) {
  console.log('\n⚠️  HIGH: Fix as soon as possible!');
}

console.log('\n✅ Security audit complete. Review results above.');
process.exit(0);
