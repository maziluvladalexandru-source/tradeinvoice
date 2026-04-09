#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Scanning for pages missing canonical tags...\n');

const publicPages = glob.sync('src/app/**/page.tsx', {
  ignore: [
    'src/app/api/**',
    'src/app/dashboard/**',
    'src/app/invoices/**',
    'src/app/clients/**',
    'src/app/expenses/**',
    'src/app/time-tracking/**',
    'src/app/reports/**',
    'src/app/services/**',
    'src/app/settings/**',
  ],
  cwd: __dirname,
});

console.log(`Found ${publicPages.length} public pages\n`);

const pagesMissingCanonical = [];

publicPages.forEach(file => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
  
  // Check if it has generateMetadata with alternates.canonical OR has metadata export with alternates.canonical
  const hasCanonical = 
    content.includes('alternates') && content.includes('canonical') ||
    content.includes('rel="canonical"');
  
  if (!hasCanonical) {
    pagesMissingCanonical.push(file);
  }
});

console.log(`❌ Pages missing canonical: ${pagesMissingCanonical.length}`);
pagesMissingCanonical.slice(0, 20).forEach(p => {
  console.log(`  - ${p}`);
});
if (pagesMissingCanonical.length > 20) {
  console.log(`  ... and ${pagesMissingCanonical.length - 20} more`);
}

console.log('\n📋 Pages TO FIX:\n');

// Map pages to canonical URLs
const pageMap = {
  'src/app/about/page.tsx': '/about',
  'src/app/contact/page.tsx': '/contact',
  'src/app/blog/[slug]/page.tsx': '/blog/[slug]',
  'src/app/nl/page.tsx': '/nl',
  'src/app/de/page.tsx': '/de',
  'src/app/page.tsx': '/',
  'src/app/privacy/page.tsx': '/privacy',
  'src/app/terms/page.tsx': '/terms',
  'src/app/dpa/page.tsx': '/dpa',
  'src/app/templates/page.tsx': '/templates',
  'src/app/tools/page.tsx': '/tools',
  'src/app/invoice-template/[trade]/page.tsx': '/invoice-template/[trade]',
  'src/app/invoice-template/[trade]/[country]/page.tsx': '/invoice-template/[trade]/[country]',
};

pagesMissingCanonical.forEach(page => {
  const canonicalUrl = pageMap[page] || page.replace('src/app/', '/').replace('/page.tsx', '');
  console.log(`${page}\n  → Add canonical: https://tradeinvoice.app${canonicalUrl}\n`);
});

console.log('\n✅ SOLUTION:\n');
console.log('Add this to each page\'s generateMetadata or metadata export:\n');
console.log('  alternates: {');
console.log('    canonical: "https://tradeinvoice.app/your-page-path",');
console.log('  }');
console.log('\nOr add to root layout.tsx for global handling.\n');

console.log('🔍 ALSO CHECK:\n');
console.log('1. Verify /nl and /de have proper language meta tags');
console.log('2. Check for any noindex meta tags on public pages');
console.log('3. Ensure all blog posts have individual canonical tags');
console.log('4. Verify invoice template pages have canonical tags\n');
