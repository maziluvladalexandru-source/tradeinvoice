#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔗 Adding canonical tags to public pages...\n');

const pagesAndCanonicals = [
  {
    file: 'src/app/about/page.tsx',
    canonical: 'https://tradeinvoice.app/about',
  },
  {
    file: 'src/app/contact/page.tsx',
    canonical: 'https://tradeinvoice.app/contact',
  },
  {
    file: 'src/app/nl/page.tsx',
    canonical: 'https://tradeinvoice.app/nl',
  },
  {
    file: 'src/app/de/page.tsx',
    canonical: 'https://tradeinvoice.app/de',
  },
  {
    file: 'src/app/blog/page.tsx',
    canonical: 'https://tradeinvoice.app/blog',
  },
  {
    file: 'src/app/tools/page.tsx',
    canonical: 'https://tradeinvoice.app/tools',
  },
];

pagesAndCanonicals.forEach(({ file, canonical }) => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file} not found, skipping`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has canonical
  if (content.includes('canonical') && content.includes('alternates')) {
    console.log(`✅ ${file} already has canonical, skipping`);
    return;
  }

  // Check if it's a client component
  const isClientComponent = content.includes('"use client"');

  if (isClientComponent) {
    // For client components, add metadata via root layout (already done)
    console.log(`ℹ️  ${file} is client component, using root layout canonical`);
    return;
  }

  // For server components, add generateMetadata
  const imports = `import type { Metadata } from "next";

`;

  const metadata = `
export const metadata: Metadata = {
  alternates: {
    canonical: "${canonical}",
  },
};

`;

  // Add imports if not present
  if (!content.includes("import type { Metadata }")) {
    content = imports + content;
  }

  // Add metadata export before the component
  if (!content.includes('export const metadata')) {
    const componentStart = content.indexOf('export default function') || content.indexOf('export function');
    if (componentStart !== -1) {
      content = content.slice(0, componentStart) + metadata + content.slice(componentStart);
    }
  }

  fs.writeFileSync(filePath, content);
  console.log(`✅ ${file} → ${canonical}`);
});

console.log('\n✨ Canonical tags added!\n');
console.log('📝 Notes:');
console.log('- Root layout.tsx already has global canonical handling');
console.log('- Client components use layout canonical');
console.log('- Server components now have individual metadata\n');
