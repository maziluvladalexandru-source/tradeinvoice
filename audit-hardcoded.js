#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Files to scan
const srcFiles = glob.sync('src/**/*.{tsx,ts}', { 
  ignore: ['src/**/*.d.ts', 'node_modules/**'],
  cwd: __dirname 
});

console.log(`📋 Scanning ${srcFiles.length} files for hardcoded English text...\n`);

const suspiciousPatterns = [
  /['"`](Loading|loading|LOADING)['"` ]/,
  /['"`](Saving|saving|SAVING)['"` ]/,
  /['"`](Error|error|ERROR)['"` ]/,
  /['"`](Success|success|SUCCESS)['"` ]/,
  /['"`](Confirm|confirm|CONFIRM)['"` ]/,
  /['"`](Cancel|cancel|CANCEL)['"` ]/,
  /['"`](Delete|delete|DELETE)['"` ]/,
  /['"`](Edit|edit|EDIT)['"` ]/,
  /['"`](Save|save|SAVE)['"` ]/,
  /['"`](Add|add|ADD)['"` ]/,
  /['"`](Back|back|BACK)['"` ]/,
  /['"`](Next|next|NEXT)['"` ]/,
  /['"`](Previous|previous|PREVIOUS)['"` ]/,
  /['"`](Filter|filter|FILTER)['"` ]/,
  /['"`](Search|search|SEARCH)['"` ]/,
  /['"`](No results|no results|NO RESULTS)['"` ]/,
  /['"`](Are you sure|are you sure|ARE YOU SURE)['"` ]/,
  /['"`](Please|please|PLEASE)['"` ]/,
  /['"`](Required|required|REQUIRED)['"` ]/,
  /['"`](Optional|optional|OPTIONAL)['"` ]/,
];

const findings = [];

srcFiles.forEach((file) => {
  try {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      // Skip comments
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
      
      // Skip if it's already using t()
      if (line.includes('t(') || line.includes('t("') || line.includes("t('")) return;
      
      // Check patterns
      suspiciousPatterns.forEach(pattern => {
        if (pattern.test(line)) {
          findings.push({
            file,
            line: idx + 1,
            content: line.trim(),
            type: 'suspicious'
          });
        }
      });
    });
  } catch (e) {
    // Ignore read errors
  }
});

if (findings.length === 0) {
  console.log('✅ No obvious hardcoded English text found!');
  console.log('\nNote: This is a pattern-based scan. Some false positives possible.');
  process.exit(0);
}

console.log(`⚠️  Found ${findings.length} suspicious patterns:\n`);

// Group by file
const byFile = {};
findings.forEach(f => {
  if (!byFile[f.file]) byFile[f.file] = [];
  byFile[f.file].push(f);
});

Object.keys(byFile).sort().forEach(file => {
  console.log(`📄 ${file}`);
  byFile[file].forEach(f => {
    console.log(`  Line ${f.line}: ${f.content.substring(0, 80)}...`);
  });
  console.log();
});

process.exit(0);
