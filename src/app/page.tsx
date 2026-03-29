"use client";

import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";

/* ──────────────────────────── Scroll animation hook ──────────────────────────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-8");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
}

/* ──────────────────────────── SVG Flag components ──────────────────────────── */
function FlagNL() {
  return (
    <svg width="32" height="22" viewBox="0 0 32 22" className="rounded-sm shadow-sm" role="img" aria-label="Netherlands flag">
      <rect width="32" height="7.33" fill="#AE1C28" />
      <rect y="7.33" width="32" height="7.34" fill="#FFF" />
      <rect y="14.67" width="32" height="7.33" fill="#21468B" />
    </svg>
  );
}
function FlagUK() {
  return (
    <svg width="32" height="22" viewBox="0 0 60 30" className="rounded-sm shadow-sm" role="img" aria-label="United Kingdom flag">
      <clipPath id="uk"><rect width="60" height="30" /></clipPath>
      <g clipPath="url(#uk)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFF" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#uk)" />
        <path d="M30,0V30M0,15H60" stroke="#FFF" strokeWidth="10" />
        <path d="M30,0V30M0,15H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
function FlagDE() {
  return (
    <svg width="32" height="22" viewBox="0 0 32 22" className="rounded-sm shadow-sm" role="img" aria-label="Germany flag">
      <rect width="32" height="7.33" fill="#000" />
      <rect y="7.33" width="32" height="7.34" fill="#DD0000" />
      <rect y="14.67" width="32" height="7.33" fill="#FFCC00" />
    </svg>
  );
}
function FlagBE() {
  return (
    <svg width="32" height="22" viewBox="0 0 32 22" className="rounded-sm shadow-sm" role="img" aria-label="Belgium flag">
      <rect width="10.67" height="22" fill="#000" />
      <rect x="10.67" width="10.66" height="22" fill="#FAE042" />
      <rect x="21.33" width="10.67" height="22" fill="#ED2939" />
    </svg>
  );
}

/* ──────────────────────────── Invoice mockup ──────────────────────────── */
function InvoiceMockup() {
  return (
    <div className="relative animate-float">
      <div className="w-[280px] md:w-[320px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl shadow-amber-500/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Invoice</div>
            <div className="text-white font-bold text-lg">#INV-0042</div>
          </div>
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
            PAID
          </div>
        </div>
        {/* Line items */}
        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Kitchen renovation</span>
            <span className="text-white font-medium">€2,400</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Materials</span>
            <span className="text-white font-medium">€850</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Plumbing work</span>
            <span className="text-white font-medium">€600</span>
          </div>
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Subtotal</span>
            <span>€3,850</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>VAT 21%</span>
            <span>€808.50</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span className="text-amber-400">Total</span>
            <span className="text-amber-400">€4,658.50</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── Feature icons (SVG) ──────────────────────────── */
function IconInvoice() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconReceipt() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

/* ──────────────────────────── Check icon ──────────────────────────── */
function Check({ color = "text-emerald-400" }: { color?: string }) {
  return (
    <svg className={`w-5 h-5 ${color} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
function Cross() {
  return (
    <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/* ──────────────────────────── PAGE ──────────────────────────── */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do I need accounting software to use TradeInvoice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nope. TradeInvoice works on its own. You don't need Xero, QuickBooks, or anything else. Just create an invoice, send it, and get paid.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data safe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All data is encrypted and payments go through Stripe. We never see or store any card details.",
        },
      },
      {
        "@type": "Question",
        name: "Can I cancel anytime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. No contracts, no cancellation fees. Downgrade to free or cancel from your settings whenever you want.",
        },
      },
      {
        "@type": "Question",
        name: "Do my clients need to sign up to pay?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. They get an email with a link. They click it, see the invoice, and pay. No account needed.",
        },
      },
      {
        "@type": "Question",
        name: "What happens after my 20 free invoices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can upgrade to Pro for \u20ac15/month for unlimited invoices. Or just wait. Your free plan resets every month, 20 fresh invoices, no cost, no expiry.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 tracking-tight">
            TradeInvoice
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/blog"
              className="text-gray-400 hover:text-white transition-colors font-medium text-sm sm:text-base"
            >
              Blog
            </Link>
            <a
              href="#pricing"
              onClick={(e) => handleSmoothScroll(e, "pricing")}
              className="hidden sm:block text-gray-400 hover:text-white transition-colors font-medium text-sm sm:text-base"
            >
              Pricing
            </a>
            <Link
              href="/auth/login"
              className="bg-amber-500 text-gray-900 px-5 py-2.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-amber-400 transition-all hover:shadow-lg hover:shadow-amber-500/25"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}
      >
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                Built for tradespeople, not accountants
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
                Get Paid Faster.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                  No Per-User Fees.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Create professional invoices in 60 seconds. Automatic payment
                reminders chase your clients for you. One flat price, no hidden fees, no nonsense.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  href="/auth/login"
                  className="inline-block bg-amber-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] animate-pulse-glow"
                >
                  Start Free - 20 Invoices/Month
                </Link>
                <span className="text-gray-500 text-sm">No credit card required</span>
              </div>
            </div>
            {/* Right: invoice mockup */}
            <div className="hidden lg:flex justify-center lg:justify-end">
              <InvoiceMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 2. TRUST BAR ═══════════════ */}
      <section className="bg-[#0f172a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <span className="text-gray-500 text-sm font-medium">Available across Europe</span>
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="flex items-center gap-2">
                <FlagNL />
                <span className="text-gray-400 text-sm">Netherlands</span>
              </div>
              <div className="flex items-center gap-2">
                <FlagUK />
                <span className="text-gray-400 text-sm">United Kingdom</span>
              </div>
              <div className="flex items-center gap-2">
                <FlagDE />
                <span className="text-gray-400 text-sm">Germany</span>
              </div>
              <div className="flex items-center gap-2">
                <FlagBE />
                <span className="text-gray-400 text-sm">Belgium</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 3. HOW IT WORKS ═══════════════ */}
      <section className="bg-[#faf9f6] py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1e293b] mb-3">
                Three steps. That&apos;s it.
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                From creating your invoice to getting paid, the whole process takes minutes.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400" />

            {[
              {
                step: "1",
                title: "Create Invoice in 60 Seconds",
                desc: "Add your client, line items, and due date. A professional PDF gets generated automatically. No templates needed.",
                icon: (
                  <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Send to Client Instantly",
                desc: "One click sends a clean invoice straight to your client's inbox. Reminders follow up automatically at 7 days, 3 days, and when overdue.",
                icon: (
                  <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Get Paid & Get Notified",
                desc: "Your client pays online. You get an email the moment the money lands. No more guessing who paid and who didn't.",
                icon: (
                  <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <Reveal key={item.step} className={`delay-${i * 100}`}>
                <div className="relative bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="mx-auto w-14 h-14 bg-amber-50 border-2 border-amber-300 rounded-full flex items-center justify-center text-lg font-bold text-amber-600 mb-5 relative z-10">
                    {item.step}
                  </div>
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-[#1e293b] mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. FEATURES GRID ═══════════════ */}
      <section className="bg-[#0f172a] py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                FEATURES
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Everything You Need to Get Paid
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                No bloat. No learning curve. Just the tools that actually matter.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <IconInvoice />,
                title: "Professional Invoices",
                desc: "Clean, branded PDF invoices that make you look polished. Add your logo, customize colors, and include all the details your clients need.",
                color: "text-amber-400",
              },
              {
                icon: <IconBell />,
                title: "Auto Payment Reminders",
                desc: "Your clients get polite nudges at 7 days, 3 days, and when overdue. You never have to send that awkward follow-up text again.",
                color: "text-amber-400",
              },
              {
                icon: <IconGlobe />,
                title: "Multi-Country Support",
                desc: "Generate invoices in English, Dutch, or German. Perfect for working across borders in the EU with proper VAT handling.",
                color: "text-amber-400",
              },
              {
                icon: <IconClock />,
                title: "Time Tracking",
                desc: "Track your hours directly in the app. Convert tracked time into invoice line items with a single click.",
                color: "text-emerald-400",
              },
              {
                icon: <IconReceipt />,
                title: "Expense Tracking",
                desc: "Log project expenses and materials. Keep a clear record of costs so nothing slips through the cracks.",
                color: "text-emerald-400",
              },
              {
                icon: <IconChart />,
                title: "Financial Reports",
                desc: "See your revenue, outstanding payments, and overdue invoices at a glance. Know exactly where your business stands.",
                color: "text-emerald-400",
              },
            ].map((feature, i) => (
              <Reveal key={feature.title} className={`delay-${(i % 3) * 100}`}>
                <div className="group bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 hover:bg-white/[0.06] h-full">
                  <div className={`${feature.color} mb-4`}>{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 5. SOCIAL PROOF ═══════════════ */}
      <section className="bg-[#f8fafc] py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1e293b] mb-3">
                Built for Tradespeople Across Europe
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                TradeInvoice is designed for tradespeople across Europe.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid sm:grid-cols-3 gap-8 mb-16">
              {[
                { number: "4", label: "Countries Supported", color: "text-amber-500" },
                { number: "60s", label: "Average Invoice Creation Time", color: "text-emerald-500" },
                { number: "€15", label: "Flat Monthly Price", color: "text-blue-500" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-4xl sm:text-5xl font-extrabold ${stat.color} mb-2`}>{stat.number}</div>
                  <div className="text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100 text-center">
              <p className="text-lg sm:text-xl text-[#1e293b] font-medium leading-relaxed">
                Built for tradespeople. Simple, honest, no nonsense.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ 6. PRICING ═══════════════ */}
      <section
        id="pricing"
        className="py-20 sm:py-28"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                PRICING
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Simple, Honest Pricing
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                No surprises. No per-user fees. Ever.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <Reveal>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-white">€0</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "20 invoices per month",
                    "Payment reminders",
                    "Professional PDF invoices",
                    "Client management",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/login"
                  className="block w-full bg-white/10 text-white py-3.5 rounded-xl font-semibold text-center hover:bg-white/20 transition-all border border-white/10"
                >
                  Get Started
                </Link>
              </div>
            </Reveal>

            {/* Pro */}
            <Reveal>
              <div className="relative bg-amber-500/[0.07] backdrop-blur-sm border-2 border-amber-500/50 rounded-2xl p-8 h-full flex flex-col shadow-lg shadow-amber-500/10">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  MOST POPULAR
                </span>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-amber-400">€15</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Unlimited invoices",
                    "Payment reminders",
                    "Multi-language invoices",
                    "Partial payment tracking",
                    "Priority email support",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                      <Check color="text-amber-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/login"
                  className="block w-full bg-gradient-to-r from-amber-500 to-amber-400 text-gray-900 py-3.5 rounded-xl font-bold text-center hover:from-amber-400 hover:to-amber-300 transition-all shadow-lg shadow-amber-500/25"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 7. COMPARISON TABLE ═══════════════ */}
      <section className="bg-[#f8fafc] py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                COMPARE
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1e293b] mb-3">
                Why Tradespeople Choose Us
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                No bloated features you will never use. No per-user fees eating into your margins.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 px-4 sm:px-6 text-left text-gray-400 font-medium">&nbsp;</th>
                    <th className="py-4 px-4 sm:px-6 text-center">
                      <span className="text-amber-500 font-bold">TradeInvoice</span>
                    </th>
                    <th className="py-4 px-4 sm:px-6 text-center text-gray-500 font-medium">Jobber</th>
                    <th className="py-4 px-4 sm:px-6 text-center text-gray-500 font-medium">Invoice2go</th>
                  </tr>
                </thead>
                <tbody className="text-[#1e293b]">
                  {[
                    {
                      label: "Price",
                      us: "€15/mo",
                      usColor: "text-amber-500 font-bold",
                      c1: "From €40/mo",
                      c2: "From €5.99/mo",
                    },
                    {
                      label: "Per-user fees",
                      us: "check",
                      c1: "cross",
                      c2: "cross",
                    },
                    {
                      label: "Unlimited invoices",
                      us: "check",
                      c1: "cross",
                      c2: "cross",
                    },
                    {
                      label: "Auto reminders",
                      us: "check",
                      c1: "check",
                      c2: "cross",
                    },
                  ].map((row, i) => (
                    <tr key={row.label} className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-gray-50/50" : ""}`}>
                      <td className="py-3.5 px-4 sm:px-6 font-medium">{row.label}</td>
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        {row.us === "check" ? (
                          <span className="inline-flex justify-center"><Check /></span>
                        ) : row.us === "cross" ? (
                          <span className="inline-flex justify-center"><Cross /></span>
                        ) : (
                          <span className={row.usColor}>{row.us}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center text-gray-500">
                        {row.c1 === "check" ? (
                          <span className="inline-flex justify-center"><Check color="text-gray-400" /></span>
                        ) : row.c1 === "cross" ? (
                          <span className="inline-flex justify-center"><Cross /></span>
                        ) : (
                          row.c1
                        )}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center text-gray-500">
                        {row.c2 === "check" ? (
                          <span className="inline-flex justify-center"><Check color="text-gray-400" /></span>
                        ) : row.c2 === "cross" ? (
                          <span className="inline-flex justify-center"><Cross /></span>
                        ) : (
                          row.c2
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ 8. FAQ ═══════════════ */}
      <section className="bg-[#0f172a] py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-400">
                Everything you need to know before getting started.
              </p>
            </div>
          </Reveal>

          <div className="space-y-3">
            {[
              {
                q: "Do I need accounting software to use TradeInvoice?",
                a: "Nope. TradeInvoice works on its own. You don't need Xero, QuickBooks, or anything else. Just create an invoice, send it, and get paid.",
              },
              {
                q: "Is my data safe?",
                a: "Yes. All data is encrypted and payments go through Stripe. We never see or store any card details.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. No contracts, no cancellation fees. Downgrade to free or cancel from your settings whenever you want.",
              },
              {
                q: "Do my clients need to sign up to pay?",
                a: "No. They get an email with a link. They click it, see the invoice, and pay. No account needed.",
              },
              {
                q: "What happens after my 20 free invoices?",
                a: "You can upgrade to Pro for €15/month for unlimited invoices. Or just wait. Your free plan resets every month, 20 fresh invoices, no cost, no expiry.",
              },
            ].map((faq) => (
              <Reveal key={faq.q}>
                <details className="group bg-white/[0.03] border border-white/10 rounded-xl hover:border-amber-500/20 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer p-5 sm:p-6 text-white font-semibold list-none text-sm sm:text-base">
                    {faq.q}
                    <svg
                      className="w-5 h-5 text-amber-400 shrink-0 ml-4 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 9. FINAL CTA ═══════════════ */}
      <section
        className="py-20 sm:py-28"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #1e1b4b 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to get paid faster?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
              Stop chasing payments. Start getting paid on time.
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-amber-500 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02]"
            >
              Start Free - 20 Invoices/Month
            </Link>
            <p className="mt-4 text-gray-500 text-sm">
              No credit card required. No strings attached.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ 10. FOOTER ═══════════════ */}
      <footer className="bg-[#0a0f1a] border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-xl font-bold text-amber-400 mb-1">TradeInvoice</div>
              <p className="text-gray-600 text-sm">Simple invoicing for tradespeople</p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center text-sm">
              <Link href="/about" className="text-gray-500 hover:text-gray-300 transition-colors">
                About
              </Link>
              <Link href="/blog" className="text-gray-500 hover:text-gray-300 transition-colors">
                Blog
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/dpa" className="text-gray-500 hover:text-gray-300 transition-colors">
                DPA
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-300 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>Also available in:</span>
            <Link href="/nl" className="text-amber-400 hover:text-amber-300 transition-colors">Nederlands</Link>
            <span className="text-gray-700">|</span>
            <Link href="/de" className="text-amber-400 hover:text-amber-300 transition-colors">Deutsch</Link>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} TradeInvoice. Operated by Vlad Mazilu Alexandru, Netherlands.
          </div>
        </div>
      </footer>
    </div>
  );
}
