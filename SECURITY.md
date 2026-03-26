# Security Notes - TradeInvoice

## Known Dependencies
- Next.js 14: 15 known advisories (11 moderate, 4 high). All server-side, mitigated by Vercel hosting. Upgrade to Next.js 16 planned when stable.

## Security Features
- OWASP 2025 Top 10 compliant
- Cloudflare Turnstile CAPTCHA on login
- Rate limiting on all sensitive endpoints
- Input sanitization on all user inputs
- Security headers (CSP, HSTS, X-Frame-Options)
- Session management with DB cleanup on logout
- Magic link one-time use enforcement
- GDPR account deletion support
- Security event logging

## Reporting
Report security issues to: support@tradeinvoice.app
