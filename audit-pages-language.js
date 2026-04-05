#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('📋 COMPREHENSIVE LANGUAGE AUDIT - ALL PAGES\n');

// Load translation files
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf-8'));
const nl = JSON.parse(fs.readFileSync('messages/nl.json', 'utf-8'));
const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf-8'));

const issues = {
  missingEnKeys: [],
  missingNlKeys: [],
  missingDeKeys: [],
  emptyNlValues: [],
  emptyDeValues: [],
  missingInPages: [],
};

// Flatten objects
function flattenObj(obj, prefix = '') {
  let result = {};
  for (const key in obj) {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result = { ...result, ...flattenObj(value, fullKey) };
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

const enFlat = flattenObj(en);
const nlFlat = flattenObj(nl);
const deFlat = flattenObj(de);

console.log(`📊 Translation Keys Summary:`);
console.log(`  EN: ${Object.keys(enFlat).length} keys`);
console.log(`  NL: ${Object.keys(nlFlat).length} keys`);
console.log(`  DE: ${Object.keys(deFlat).length} keys\n`);

// Check for missing/empty translations
for (const key in enFlat) {
  if (!(key in nlFlat)) {
    issues.missingNlKeys.push(key);
  } else if (!nlFlat[key] || String(nlFlat[key]).trim() === '') {
    issues.emptyNlValues.push(key);
  }
  
  if (!(key in deFlat)) {
    issues.missingDeKeys.push(key);
  } else if (!deFlat[key] || String(deFlat[key]).trim() === '') {
    issues.emptyDeValues.push(key);
  }
}

// Scan pages for hardcoded text patterns
console.log('📄 Scanning pages for hardcoded English text...\n');

const pageFiles = glob.sync('src/app/**/page.tsx', { 
  ignore: ['node_modules/**', '.next/**'],
  cwd: __dirname 
});

const englishWords = [
  'Loading', 'loading', 'Saving', 'saving', 'Error', 'error',
  'Success', 'success', 'Delete', 'delete', 'Edit', 'edit',
  'Cancel', 'cancel', 'Save', 'save', 'Add', 'add',
  'Back', 'back', 'Next', 'next', 'Previous', 'previous',
  'Filter', 'filter', 'Search', 'search', 'No results',
  'Are you sure', 'Please', 'Required', 'Optional',
  'Create', 'create', 'Update', 'update', 'Submit', 'submit',
  'Close', 'close', 'Open', 'open', 'Show', 'show',
  'Hide', 'hide', 'Download', 'download', 'Upload', 'upload',
  'Confirm', 'confirm', 'Yes', 'yes', 'No', 'no',
];

const pageIssues = {};

pageFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');
    const hardcodedLines = [];
    
    lines.forEach((line, idx) => {
      // Skip comments, imports, and lines with t()
      if (line.trim().startsWith('//') || 
          line.trim().startsWith('*') ||
          line.includes('import ') ||
          line.includes('t(') ||
          line.includes('t(') ||
          line.includes('const t =') ||
          line.includes('useTranslations')) {
        return;
      }
      
      // Check for string literals with English words
      for (const word of englishWords) {
        if (new RegExp(`['\"\`]${word}['\"\`]`).test(line)) {
          // Skip if it's actually using t()
          if (!line.includes('t(')) {
            hardcodedLines.push({
              line: idx + 1,
              content: line.trim().substring(0, 100),
              word
            });
          }
        }
      }
    });
    
    if (hardcodedLines.length > 0) {
      pageIssues[file] = hardcodedLines;
    }
  } catch (e) {}
});

// Report
console.log('═'.repeat(70));
console.log('LANGUAGE AUDIT RESULTS');
console.log('═'.repeat(70));

if (issues.missingNlKeys.length > 0) {
  console.log(`\n❌ MISSING NL KEYS (${issues.missingNlKeys.length}):`);
  issues.missingNlKeys.slice(0, 10).forEach(k => console.log(`  - ${k}`));
  if (issues.missingNlKeys.length > 10) {
    console.log(`  ... and ${issues.missingNlKeys.length - 10} more`);
  }
}

if (issues.missingDeKeys.length > 0) {
  console.log(`\n❌ MISSING DE KEYS (${issues.missingDeKeys.length}):`);
  issues.missingDeKeys.slice(0, 10).forEach(k => console.log(`  - ${k}`));
  if (issues.missingDeKeys.length > 10) {
    console.log(`  ... and ${issues.missingDeKeys.length - 10} more`);
  }
}

if (issues.emptyNlValues.length > 0) {
  console.log(`\n⚠️  EMPTY NL VALUES (${issues.emptyNlValues.length}):`);
  issues.emptyNlValues.slice(0, 5).forEach(k => console.log(`  - ${k}`));
  if (issues.emptyNlValues.length > 5) {
    console.log(`  ... and ${issues.emptyNlValues.length - 5} more`);
  }
}

if (issues.emptyDeValues.length > 0) {
  console.log(`\n⚠️  EMPTY DE VALUES (${issues.emptyDeValues.length}):`);
  issues.emptyDeValues.slice(0, 5).forEach(k => console.log(`  - ${k}`));
  if (issues.emptyDeValues.length > 5) {
    console.log(`  ... and ${issues.emptyDeValues.length - 5} more`);
  }
}

if (Object.keys(pageIssues).length > 0) {
  console.log(`\n⚠️  HARDCODED ENGLISH TEXT IN PAGES (${Object.keys(pageIssues).length} files):`);
  Object.entries(pageIssues).slice(0, 10).forEach(([file, lines]) => {
    console.log(`\n  📄 ${file}`);
    lines.slice(0, 3).forEach(l => {
      console.log(`    Line ${l.line}: "${l.word}" → ${l.content}`);
    });
    if (lines.length > 3) {
      console.log(`    ... and ${lines.length - 3} more hardcoded strings`);
    }
  });
  if (Object.keys(pageIssues).length > 10) {
    console.log(`\n  ... and ${Object.keys(pageIssues).length - 10} more files with hardcoded text`);
  }
}

// Summary
const totalIssues = 
  issues.missingNlKeys.length + 
  issues.missingDeKeys.length + 
  issues.emptyNlValues.length + 
  issues.emptyDeValues.length +
  Object.keys(pageIssues).length;

console.log(`\n${'═'.repeat(70)}`);
console.log(`SUMMARY`);
console.log('═'.repeat(70));
console.log(`Missing NL keys: ${issues.missingNlKeys.length}`);
console.log(`Missing DE keys: ${issues.missingDeKeys.length}`);
console.log(`Empty NL values: ${issues.emptyNlValues.length}`);
console.log(`Empty DE values: ${issues.emptyDeValues.length}`);
console.log(`Pages with hardcoded text: ${Object.keys(pageIssues).length}`);
console.log(`\nTOTAL ISSUES: ${totalIssues}`);
console.log('═'.repeat(70));

if (totalIssues === 0) {
  console.log('\n✅ All pages appear to be properly translated!');
  process.exit(0);
} else {
  console.log('\n⚠️  Issues found. Review above and fix before full deployment.');
  
  // Show what's most important to fix
  console.log('\n🔧 PRIORITY FIXES:\n');
  
  if (issues.missingNlKeys.length > 0) {
    console.log('1. Add these missing NL keys:');
    issues.missingNlKeys.slice(0, 3).forEach(k => {
      console.log(`   "${k}": "${enFlat[k]}",`);
    });
  }
  
  if (issues.missingDeKeys.length > 0) {
    console.log('\n2. Add these missing DE keys:');
    issues.missingDeKeys.slice(0, 3).forEach(k => {
      console.log(`   "${k}": "${enFlat[k]}",`);
    });
  }
  
  if (Object.keys(pageIssues).length > 0) {
    console.log('\n3. Fix hardcoded text in these pages:');
    Object.keys(pageIssues).slice(0, 5).forEach(f => {
      console.log(`   - ${f}`);
    });
  }
  
  process.exit(1);
}
