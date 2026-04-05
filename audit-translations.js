#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load all translation files
const enMessages = JSON.parse(fs.readFileSync(path.join(__dirname, 'messages/en.json'), 'utf-8'));
const nlMessages = JSON.parse(fs.readFileSync(path.join(__dirname, 'messages/nl.json'), 'utf-8'));
const deMessages = JSON.parse(fs.readFileSync(path.join(__dirname, 'messages/de.json'), 'utf-8'));

const issues = {
  missingNLKeys: [],
  missingDEKeys: [],
  emptyNLValues: [],
  emptyDEValues: [],
  extraENKeys: [],
  extraNLKeys: [],
  extraDEKeys: [],
};

function flattenObj(obj, prefix = '') {
  let result = {};
  for (const key in obj) {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      result = { ...result, ...flattenObj(value, fullKey) };
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

const enFlat = flattenObj(enMessages);
const nlFlat = flattenObj(nlMessages);
const deFlat = flattenObj(deMessages);

console.log('🔍 TRANSLATION AUDIT REPORT\n');
console.log(`Total EN keys: ${Object.keys(enFlat).length}`);
console.log(`Total NL keys: ${Object.keys(nlFlat).length}`);
console.log(`Total DE keys: ${Object.keys(deFlat).length}\n`);

// Check for missing keys in NL
for (const key in enFlat) {
  if (!(key in nlFlat)) {
    issues.missingNLKeys.push(key);
  } else if (!nlFlat[key] || nlFlat[key].trim() === '') {
    issues.emptyNLValues.push(key);
  }
}

// Check for missing keys in DE
for (const key in enFlat) {
  if (!(key in deFlat)) {
    issues.missingDEKeys.push(key);
  } else if (!deFlat[key] || deFlat[key].trim() === '') {
    issues.emptyDEValues.push(key);
  }
}

// Check for extra keys
for (const key in nlFlat) {
  if (!(key in enFlat)) {
    issues.extraNLKeys.push(key);
  }
}

for (const key in deFlat) {
  if (!(key in enFlat)) {
    issues.extraDEKeys.push(key);
  }
}

// Report
if (issues.missingNLKeys.length > 0) {
  console.log(`❌ MISSING NL KEYS (${issues.missingNLKeys.length}):`);
  issues.missingNLKeys.forEach(k => console.log(`  - ${k}`));
  console.log();
}

if (issues.missingDEKeys.length > 0) {
  console.log(`❌ MISSING DE KEYS (${issues.missingDEKeys.length}):`);
  issues.missingDEKeys.forEach(k => console.log(`  - ${k}`));
  console.log();
}

if (issues.emptyNLValues.length > 0) {
  console.log(`⚠️  EMPTY NL VALUES (${issues.emptyNLValues.length}):`);
  issues.emptyNLValues.forEach(k => console.log(`  - ${k}`));
  console.log();
}

if (issues.emptyDEValues.length > 0) {
  console.log(`⚠️  EMPTY DE VALUES (${issues.emptyDEValues.length}):`);
  issues.emptyDEValues.forEach(k => console.log(`  - ${k}`));
  console.log();
}

if (issues.extraNLKeys.length > 0) {
  console.log(`⚠️  EXTRA NL KEYS (${issues.extraNLKeys.length}):`);
  issues.extraNLKeys.forEach(k => console.log(`  - ${k}`));
  console.log();
}

if (issues.extraDEKeys.length > 0) {
  console.log(`⚠️  EXTRA DE KEYS (${issues.extraDEKeys.length}):`);
  issues.extraDEKeys.forEach(k => console.log(`  - ${k}`));
  console.log();
}

// Summary
const totalIssues = 
  issues.missingNLKeys.length + 
  issues.missingDEKeys.length + 
  issues.emptyNLValues.length + 
  issues.emptyDEValues.length;

console.log(`\n📊 TOTAL ISSUES: ${totalIssues}`);

if (totalIssues === 0) {
  console.log('✅ All translation keys are complete!');
} else {
  console.log(`⚠️  Fix these issues before shipping!\n`);
  
  // Show what needs fixing
  console.log('🔧 QUICK FIX:\n');
  
  if (issues.missingNLKeys.length > 0) {
    console.log('Add these to messages/nl.json:');
    issues.missingNLKeys.slice(0, 5).forEach(k => {
      console.log(`  "${k}": "${enFlat[k]}",`);
    });
    if (issues.missingNLKeys.length > 5) {
      console.log(`  ... and ${issues.missingNLKeys.length - 5} more`);
    }
  }
}

process.exit(totalIssues > 0 ? 1 : 0);
