# Full Audit Report - TradeInvoice
**Date:** 2026-03-30
**Scope:** Security, Visual, Performance, Code Quality

---

## CRITICAL Issues

### SEC-1: Cron routes publicly accessible; CRON_SECRET not validated at startup
- **Files:** `src/middleware.ts:11-13`, `src/app/api/cron/reminders/route.ts:9`, `src/app/api/cron/recurring/route.ts:8`, `src/app/api/cron/scheduled/route.ts:8`
- **Description:** Middleware allowlists cron paths without session check. If `CRON_SECRET` is unset, the bearer check evaluates against `"Bearer undefined"`. The reminders cron iterates ALL invoices across all users -- triggering it manually sends emails to every client in the database.
- **Fix:** Validate `CRON_SECRET` at startup. Add guard: if secret is unset, return 500. Add `/api/cron/scheduled` to publicPaths.

### SEC-2: Invoice PDF endpoint has no authentication
- **Files:** `src/app/api/invoices/[id]/pdf/route.ts:148-157`
- **Description:** No `requireUser()` call. Middleware grants blanket access to paths containing `/pdf`. Anyone with an invoice ID can retrieve full invoice data including business name, address, IBAN, BIC, VAT number, client details, and financial totals.
- **Fix:** Add `requireUser()` and ownership check, or use short-lived signed tokens.

### SEC-3: Portal token is permanent, never expires, never rotates
- **Files:** `src/lib/portal.ts:3-13`
- **Description:** `generatePortalToken` produces a deterministic HMAC-SHA256 from `clientId + JWT_SECRET`. Token never expires, cannot be revoked. Anyone who intercepts the portal URL retains permanent access.
- **Fix:** Replace with time-bounded JWT or store per-client token with expiry in database.

### SEC-4: `/api/invoice/[id]/pay` and `/api/invoice/[id]/viewed` -- no auth, no ownership check
- **Files:** `src/app/api/invoice/[id]/pay/route.ts`, `src/app/api/invoice/[id]/viewed/route.ts`
- **Description:** Fully unauthenticated. Pay route creates Stripe payment links for any invoice by ID. Viewed route updates status and triggers email notification. Email bombing vector.
- **Fix:** Gate behind portal token verification.

### SEC-5: Turnstile CAPTCHA bypassable by omitting token
- **Files:** `src/app/api/auth/login/route.ts:29-36`
- **Description:** CAPTCHA check skipped when no `turnstileToken` in request body. Combined with in-memory rate limiter (ineffective in serverless), this allows unlimited login attempts.
- **Fix:** Make Turnstile token mandatory in production.

### PERF-1: BackgroundPaths -- 24 simultaneous SVG path animations, Math.random() on every render
- **Files:** `src/components/ui/background-paths.tsx:6-17`
- **Description:** 2 instances x 12 paths = 24 infinite animations. `Math.random()` in transition config prevents React deduplication. No `prefers-reduced-motion` check. First screen users see on mobile.
- **Fix:** Move path configs outside component, use deterministic durations, add reduced-motion check.

### VIS-1: BentoGrid cards have `bg-white` base class -- SSR flash in dark mode
- **Files:** `src/components/ui/bento-grid.tsx:76`
- **Description:** Cards use `bg-white dark:bg-black`. On first paint before hydration, dark class may not be applied. Also `bg-black` inconsistent with app's `bg-[#111827]`. Unused Lucide imports.
- **Fix:** Replace with `bg-[#111827]`, remove unused imports.

### PERF-2: `testimonials-columns-1.tsx` imports from `"motion/react"` not `"framer-motion"`
- **Files:** `src/components/testimonials-columns-1.tsx:4`
- **Description:** All other files use `"framer-motion"`. This potentially loads a duplicate animation library, doubling bundle size for the homepage.
- **Fix:** Change import to `"framer-motion"`.

### VIS-2: Blog article page renders duplicate headers (layout header + Navbar)
- **Files:** `src/app/blog/layout.tsx:35-85`, `src/app/blog/[slug]/page.tsx:265`
- **Description:** Blog layout has sticky header. Article page also renders `<Navbar />`. Two headers stack on top of each other.
- **Fix:** Remove `<Navbar />` from blog article page.

---

## HIGH Priority Issues

### SEC-6: In-memory rate limiter non-functional in serverless
- **Files:** `src/lib/rate-limit.ts`
- **Description:** Rate limiter uses module-level Map. In Vercel serverless, each invocation may run in separate process. Rate limits not enforced at scale.
- **Fix:** Replace with Redis-backed distributed limiter (e.g. @upstash/ratelimit).

### SEC-7: User GET endpoint returns full user record including Stripe IDs and IBAN
- **Files:** `src/app/api/user/route.ts:7-10`
- **Description:** Returns complete Prisma user object. Includes `stripeCustomerId`, `stripeSubscriptionId`, `bankDetails` (raw IBAN).
- **Fix:** Select only needed fields, omit sensitive data.

### SEC-8: Team invite acceptance doesn't verify email matches logged-in user
- **Files:** `src/app/api/team/accept/route.ts:24-34`
- **Description:** Logged-in user can accept another user's team invitation if they have the invite link.
- **Fix:** Check `user.email === member.email` before linking.

### SEC-9: Currency/theme not validated in fullEdit PATCH path
- **Files:** `src/app/api/invoices/[id]/route.ts:91-99`
- **Description:** POST creation validates currency against `VALID_CURRENCIES` and theme against whitelist, but PATCH full-edit does not.
- **Fix:** Apply same whitelist checks in PATCH path.

### SEC-10: receiptUrl not validated as image data URI
- **Files:** `src/app/api/expenses/route.ts:74-77`, `src/app/api/expenses/[id]/route.ts:39-46`
- **Description:** Accepts any string up to 7MB. No check that value is a `data:image/...` URI.
- **Fix:** Add prefix validation like `logoUrl` check in user route.

### SEC-11: HTML injection in email templates via unescaped user data
- **Files:** `src/lib/resend.ts:113-114,186,220-221`, `src/lib/team-email.ts:32,41`
- **Description:** `clientName`, `businessName`, `invoiceNumber` interpolated into HTML emails without escaping.
- **Fix:** Apply HTML entity escaping to all interpolated values.

### PERF-3: Dead code -- shape-landing-hero.tsx, creative-pricing.tsx never imported
- **Files:** `src/components/ui/shape-landing-hero.tsx`, `src/components/ui/creative-pricing.tsx`
- **Description:** Neither imported anywhere. creative-pricing.tsx loads a Google Font. shape-landing-hero.tsx has 5 infinite animations.
- **Fix:** Delete both files.

### PERF-4: Dead components -- DashboardInvoiceList, DashboardQuoteList, RevenueDashboard
- **Files:** `src/components/DashboardInvoiceList.tsx`, `src/components/DashboardQuoteList.tsx`, `src/components/RevenueDashboard.tsx`
- **Description:** None imported anywhere. Dead code from earlier dashboard version.
- **Fix:** Delete all three files.

### PERF-5: GlowCard injects duplicate `<style>` block per instance via dangerouslySetInnerHTML
- **Files:** `src/components/spotlight-card.tsx:108-166`
- **Description:** Identical CSS injected for every card. Homepage renders 6+ cards, each with its own style tag forcing CSS reparse.
- **Fix:** Move styles to globals.css.

### PERF-6: GradientText calls `motion.create()` inside render function
- **Files:** `src/components/ui/gradient-text.tsx:20`
- **Description:** Creates new motion component on every render, causing unmount/remount cycle.
- **Fix:** Cache motion components at module level.

### PERF-7: InvoiceMockup runs infinite animation while hidden on mobile via CSS display:none
- **Files:** `src/app/page.tsx:82-83,437-439`
- **Description:** CSS `display:none` doesn't stop framer-motion JS animation loop. Wastes CPU on every mobile page load.
- **Fix:** Use conditional rendering instead of CSS hiding.

### PERF-8: FloatingOrb infinite animations without viewport check
- **Files:** `src/app/page.tsx:860-861`
- **Description:** Two large blurred orbs animate permanently. No `whileInView` or viewport activation.
- **Fix:** Add viewport-based activation or replace with CSS animation.

### VIS-3: FloatingCreateButton obscured by CookieBanner on first visit
- **Files:** `src/components/FloatingCreateButton.tsx:9`, `src/components/CookieBanner.tsx:24`
- **Description:** FAB at `z-40 bottom-20`, cookie banner at `z-50 bottom-0`. Banner overlaps FAB on first visit.
- **Fix:** Increase FAB z-index or adjust bottom offset when banner visible.

### VIS-4: Dashboard stats grid-cols-3 truncates labels on 390px
- **Files:** `src/app/dashboard/page.tsx:283`
- **Description:** "Avg. Days to Pay" label overflows at ~111px column width on small phones.
- **Fix:** Use `grid-cols-2 md:grid-cols-3` or smaller font on mobile.

---

## MEDIUM Priority Issues

### SEC-12: Session cookie missing `__Host-` prefix
- **Files:** `src/app/api/auth/verify/route.ts:52-58`

### SEC-13: Magic link replay protection in-memory only
- **Files:** `src/app/api/auth/verify/route.ts:7-15`

### SEC-14: CRON_SECRET, STRIPE_WEBHOOK_SECRET not validated at startup
- **Files:** Various

### SEC-15: Bulk invoiceIds array unbounded in size
- **Files:** `src/app/api/invoices/bulk/route.ts:13-14`

### VIS-5: Login page "Sign up free" links back to same page
- **Files:** `src/app/auth/login/page.tsx:270`

### VIS-6: DonutChart SVG text uses className for fill -- unreliable cross-browser
- **Files:** `src/components/DonutChart.tsx:132,143`

### VIS-7: spotlight-card.tsx backgroundAttachment: 'fixed' breaks on iOS Safari
- **Files:** `src/components/spotlight-card.tsx:91`

### VIS-8: Blog markdown-to-HTML with dangerouslySetInnerHTML (XSS risk with future content)
- **Files:** `src/app/blog/[slug]/page.tsx:43-225`

### VIS-9: de/page.tsx and nl/page.tsx duplicate SVG flag clipPath IDs
- **Files:** `src/app/de/page.tsx:50`, `src/app/nl/page.tsx:51`

---

## LOW Priority Issues

### L-1: Toast counter resets on every render (useRef needed)
- **Files:** `src/components/Toast.tsx:30`

### L-2: DonutChart mouse events unreliable on touch
- **Files:** `src/components/DonutChart.tsx:127-128`

### L-3: global-error.tsx renders without CSS
- **Files:** `src/app/global-error.tsx:9-11`

### L-4: PDF download link missing rel="noreferrer"
- **Files:** `src/app/dashboard/page.tsx:407`
