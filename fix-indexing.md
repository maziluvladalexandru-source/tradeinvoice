# Google Indexing Fix Plan - TradeInvoice

**Date:** April 9, 2026
**Goal:** Fix all 83 non-indexed pages
**Status:** In Progress

---

## Current State

**Indexed:** 8 pages ✅
**Not Indexed:** 83 pages ❌

### Issues Breakdown

| Issue | Count | Status |
|-------|-------|--------|
| Discovered - not indexed | 77 | MAIN ISSUE |
| Pages with redirects | 2 | /nl and /de |
| Duplicate without canonical | 1 | TBD |
| Alternate with canonical | 3 | OK |

---

## Analysis

### Issue 1: 77 "Discovered But Not Indexed"

**Cause:** Google crawled these pages but didn't add them to index
**Likely Reason:** Low crawl budget, pages not important enough

**Pages affected:**
- Blog posts (partial)
- Invoice templates (many)
- Support pages
- Other content pages

**Solution:** Request Google to crawl them

### Issue 2: 2 Pages with Redirects

**Likely Pages:**
- `/nl` - Redirects to Dutch version
- `/de` - Redirects to German version

**Problem:** Middleware checks for session, might be blocking crawl

**Solution:** Ensure `/nl` and `/de` are in publicPaths (they are ✅)

### Issue 3: 1 Duplicate Without Canonical

**Location:** Unknown - need to identify

**Solution:** Add canonical tag to the page

---

## SEO Configuration Status

### ✅ Robots.txt
- Allows: /, /blog, /about, /terms, /privacy, /contact, /dpa, /invoice-template, /templates, /nl, /de
- Disallows: /dashboard, /invoices, /clients, /expenses, /time-tracking, /reports, /services, /settings, /api/, /auth/, /portal/
- Status: **CORRECT**

### ✅ Sitemap
- Includes: Home, blog posts, templates, tools, localized pages, invoice templates
- Count: ~100+ URLs
- Status: **CORRECT**

### ✅ Middleware
- Allows public paths including /nl and /de
- Allows SEO files (/sitemap.xml, /robots.txt)
- Status: **CORRECT**

### ⚠️ Canonical Tags
- Need to verify all pages have proper canonical tags
- Status: **NEED TO CHECK**

### ⚠️ Meta Tags
- Need to verify no `noindex` tags blocking indexing
- Status: **NEED TO CHECK**

---

## Fixes to Apply

### 1. Add Canonical Tags to All Pages

**Pattern:**
```html
<link rel="canonical" href="https://tradeinvoice.app/page-name" />
```

**Files to update:**
- src/app/layout.tsx (global)
- src/app/blog/[slug]/page.tsx (blog posts)
- src/app/invoice-template/[trade]/page.tsx (templates)
- src/app/invoice-template/[trade]/[country]/page.tsx (country templates)
- All other public pages

### 2. Verify No Noindex Meta Tags

**Check for:**
```html
<meta name="robots" content="noindex" />
```

**Should only be on:**
- /dashboard (protected)
- /invoices (protected)
- /clients (protected)
- /expenses (protected)
- etc. (protected pages)

**Should NOT be on:**
- /blog/*
- /templates
- /about
- /contact
- /pricing
- etc. (public pages)

### 3. Verify Redirect Structure

**Check:**
- `/nl` and `/de` should NOT redirect
- They should serve content directly (with proper language)
- Each should have canonical pointing to itself

### 4. Submit URLs to Google

**Steps:**
1. In Google Search Console
2. Go to Coverage → "Discovered - currently not indexed"
3. Select top 10 URLs
4. Click "Request indexing" for each batch
5. Do this in waves to avoid throttling

---

## Implementation

### Step 1: Add Global Canonical Tag
**File:** `src/app/layout.tsx`

```tsx
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const canonicalUrl = `https://tradeinvoice.app${pathname}`;

  return (
    <html>
      <head>
        <link rel="canonical" href={canonicalUrl} />
        {/* ... rest of head ... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Step 2: Add Canonical to Blog Posts
**File:** `src/app/blog/[slug]/page.tsx`

```tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    alternates: {
      canonical: `https://tradeinvoice.app/blog/${params.slug}`,
    },
  };
}
```

### Step 3: Verify Noindex Tags

**Search in all files for:**
```bash
grep -r "noindex" src/
```

**Result:** Should only find on protected pages

### Step 4: Fix /nl and /de Pages

**Ensure:**
- Both pages have proper `<meta name="robots" content="index, follow" />`
- Both have canonical tags pointing to themselves
- Both render without redirects

---

## Testing Checklist

- [ ] All public pages have canonical tags
- [ ] No `noindex` on public pages
- [ ] /nl and /de render without redirect
- [ ] Sitemap.xml includes all important pages
- [ ] Robots.txt allows all public pages
- [ ] Google Search Console shows no errors
- [ ] Request indexing for top 20 URLs

---

## Expected Results (After Fix)

**Timeline:**
- Week 1: 20-30 additional pages indexed
- Week 2: 50-70 additional pages indexed
- Week 3: 80+ pages indexed

**Target:** 90+ pages indexed within 3 weeks

---

## Priority Pages to Index

1. / (homepage)
2. /blog (blog index)
3. /about
4. /contact
5. /pricing (if exists)
6. /templates
7. /tools
8. Top 5 blog posts
9. /nl (Dutch)
10. /de (German)
11. Invoice templates (top 5 trades)

---

## Monitoring

**Check weekly:**
- Google Search Console Coverage
- New indexed pages
- Any new errors
- Search impressions
- Click-through rate (CTR)

**Tools:**
- Google Search Console (FREE)
- Bing Webmaster Tools (FREE)
- SEMrush (paid, optional)

---

## Notes

- Don't submit 100+ URLs at once - Google throttles requests
- Batch submissions in groups of 10-20 over several days
- Quality matters more than quantity for indexing
- Focus on high-priority pages first
- Monitor for crawl errors

---

**Status:** Ready to implement
**Estimated Time:** 2-3 hours for fixes + 2-3 weeks for indexing
