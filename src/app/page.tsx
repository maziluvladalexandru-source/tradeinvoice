"use client";

import Link from "next/link";
import { useCallback } from "react";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
  ScrollReveal,
  AnimatedCounter,
  GradientText,
  FloatingOrb,
  GlowCard,
  motion,
} from "@/components/animations";

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
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <motion.div
        className="w-[280px] md:w-[320px] bg-[#111827]/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-amber-500/10 hover:border-amber-500/30 transition-all duration-300"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.03, rotateY: 4, transition: { type: "spring", stiffness: 300 } }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Invoice</div>
            <div className="text-white font-bold text-lg">#INV-0042</div>
          </div>
          <motion.div
            className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 500 }}
          >
            PAID
          </motion.div>
        </div>
        {/* Line items */}
        <div className="space-y-3 mb-5">
          {[
            { label: "Kitchen renovation", amount: "€2,400" },
            { label: "Materials", amount: "€850" },
            { label: "Plumbing work", amount: "€600" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex justify-between text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white font-medium">{item.amount}</span>
            </motion.div>
          ))}
        </div>
        <div className="border-t border-gray-700/50 pt-3">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Subtotal</span>
            <span>€3,850</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>VAT 21%</span>
            <span>€808.50</span>
          </div>
          <motion.div
            className="flex justify-between font-bold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-amber-400">Total</span>
            <span className="text-amber-400">€4,658.50</span>
          </motion.div>
        </div>
      </motion.div>
      {/* Glow behind card */}
      <div className="absolute -inset-4 bg-amber-500/5 rounded-3xl blur-2xl -z-10 animate-breathe" />
    </motion.div>
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
    <div className="min-h-screen overflow-x-hidden bg-[#0a0f1e]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ═══════════════ HEADER ═══════════════ */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-gray-700/30"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 tracking-tight hover:text-amber-300 transition-colors">
            TradeInvoice
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/blog"
              className="text-gray-400 hover:text-amber-400 transition-colors font-medium text-sm sm:text-base"
            >
              Blog
            </Link>
            <a
              href="#pricing"
              onClick={(e) => handleSmoothScroll(e, "pricing")}
              className="hidden sm:block text-gray-400 hover:text-amber-400 transition-colors font-medium text-sm sm:text-base"
            >
              Pricing
            </a>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-5 py-2.5 rounded-xl font-semibold text-sm sm:text-base hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section
        className="relative min-h-screen flex items-center pt-20 overflow-hidden gradient-mesh"
      >
        {/* Background grid pattern */}
        <div className="absolute inset-0 dot-grid" />

        {/* Animated floating orbs */}
        <FloatingOrb color="amber" size="xl" className="top-1/4 left-[15%]" delay={0} />
        <FloatingOrb color="purple" size="lg" className="bottom-1/4 right-[20%]" delay={3} />
        <FloatingOrb color="blue" size="md" className="top-[60%] left-[60%]" delay={6} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <FadeIn delay={0.1}>
                <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                  Built for tradespeople, not accountants
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
                  Get Paid Faster.
                  <br />
                  <GradientText className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1]">
                    No Per-User Fees.
                  </GradientText>
                </h1>
              </FadeIn>

              <FadeIn delay={0.35}>
                <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Create professional invoices in 60 seconds. Automatic payment
                  reminders chase your clients for you. One flat price, no hidden fees, no nonsense.
                </p>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/auth/login"
                      className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 animate-pulse-glow btn-press"
                    >
                      Start Free - 20 Invoices/Month
                    </Link>
                  </motion.div>
                  <span className="text-gray-500 text-sm">No credit card required</span>
                </div>
              </FadeIn>
            </div>

            {/* Right: invoice mockup */}
            <div className="hidden lg:flex justify-center lg:justify-end">
              <InvoiceMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 2. TRUST BAR ═══════════════ */}
      <section className="bg-[#0a0f1e] border-y border-gray-700/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <span className="text-gray-500 text-sm font-medium">Available across Europe</span>
              <StaggerChildren staggerDelay={0.1} className="flex items-center gap-6 sm:gap-8">
                {[
                  { Flag: FlagNL, name: "Netherlands" },
                  { Flag: FlagUK, name: "United Kingdom" },
                  { Flag: FlagDE, name: "Germany" },
                  { Flag: FlagBE, name: "Belgium" },
                ].map((c) => (
                  <StaggerItem key={c.name}>
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.08, y: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <c.Flag />
                      <span className="text-gray-400 text-sm">{c.name}</span>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════ 3. HOW IT WORKS ═══════════════ */}
      <section className="bg-[#0a0f1e] py-20 sm:py-28 relative">
        <div className="absolute inset-0 dot-grid-amber" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Three steps. That&apos;s it.
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                From creating your invoice to getting paid, the whole process takes minutes.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-emerald-400/40"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>

            {[
              {
                step: "1",
                title: "Create Invoice in 60 Seconds",
                desc: "Add your client, line items, and due date. A professional PDF gets generated automatically. No templates needed.",
                icon: (
                  <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Send to Client Instantly",
                desc: "One click sends a clean invoice straight to your client's inbox. Reminders follow up automatically at 7 days, 3 days, and when overdue.",
                icon: (
                  <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Get Paid & Get Notified",
                desc: "Your client pays online. You get an email the moment the money lands. No more guessing who paid and who didn't.",
                icon: (
                  <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.15} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <GlowCard className="p-8 text-center h-full">
                  <motion.div
                    className="mx-auto w-14 h-14 bg-amber-500/10 border-2 border-amber-500/30 rounded-full flex items-center justify-center text-lg font-bold text-amber-400 mb-5 relative z-10"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.step}
                  </motion.div>
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </GlowCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. FEATURES GRID ═══════════════ */}
      <section className="bg-[#0a0f1e] py-20 sm:py-28 border-t border-gray-700/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
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
          </ScrollReveal>

          <StaggerChildren staggerDelay={0.1} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <IconInvoice />, title: "Professional Invoices", desc: "Clean, branded PDF invoices that make you look polished. Add your logo, customize colors, and include all the details your clients need.", color: "text-amber-400" },
              { icon: <IconBell />, title: "Auto Payment Reminders", desc: "Your clients get polite nudges at 7 days, 3 days, and when overdue. You never have to send that awkward follow-up text again.", color: "text-amber-400" },
              { icon: <IconGlobe />, title: "Multi-Country Support", desc: "Generate invoices in English, Dutch, or German. Perfect for working across borders in the EU with proper VAT handling.", color: "text-amber-400" },
              { icon: <IconClock />, title: "Time Tracking", desc: "Track your hours directly in the app. Convert tracked time into invoice line items with a single click.", color: "text-emerald-400" },
              { icon: <IconReceipt />, title: "Expense Tracking", desc: "Log project expenses and materials. Keep a clear record of costs so nothing slips through the cracks.", color: "text-emerald-400" },
              { icon: <IconChart />, title: "Financial Reports", desc: "See your revenue, outstanding payments, and overdue invoices at a glance. Know exactly where your business stands.", color: "text-emerald-400" },
            ].map((feature) => (
              <StaggerItem key={feature.title}>
                <GlowCard className="p-6 h-full group" glowColor={feature.color.includes("emerald") ? "emerald" : "amber"}>
                  <motion.div
                    className={`${feature.color} mb-4 w-12 h-12 rounded-xl bg-white/[0.03] border border-gray-700/50 flex items-center justify-center group-hover:border-amber-500/30 transition-colors relative z-10`}
                    whileHover={{ rotate: -8, scale: 1.1 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-2 relative z-10">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed relative z-10">{feature.desc}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══════════════ 5. SOCIAL PROOF ═══════════════ */}
      <section className="bg-[#0a0f1e] py-20 sm:py-28 border-t border-gray-700/20 relative">
        <div className="absolute inset-0 dot-grid-amber" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Built for Tradespeople Across Europe
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                TradeInvoice is designed for tradespeople across Europe.
              </p>
            </div>
          </ScrollReveal>

          <StaggerChildren staggerDelay={0.15} className="grid sm:grid-cols-3 gap-8 mb-16">
            {[
              { number: 4, label: "Countries Supported", color: "text-amber-400", suffix: "" },
              { number: 60, label: "Average Invoice Creation Time", color: "text-emerald-400", suffix: "s" },
              { number: 15, label: "Flat Monthly Price", color: "text-blue-400", prefix: "€" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <GlowCard className="text-center p-8">
                  <div className={`text-4xl sm:text-5xl font-extrabold ${stat.color} mb-2`}>
                    <AnimatedCounter
                      value={stat.number}
                      prefix={stat.prefix || ""}
                      suffix={stat.suffix || ""}
                      duration={1.2}
                    />
                  </div>
                  <div className="text-gray-400 font-medium relative z-10">{stat.label}</div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <FadeIn>
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-8 sm:p-10 text-center">
              <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
                Built for tradespeople. Simple, honest, no nonsense.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ 6. PRICING ═══════════════ */}
      <section
        id="pricing"
        className="py-20 sm:py-28 border-t border-gray-700/20 gradient-mesh relative"
      >
        <FloatingOrb color="amber" size="md" className="top-20 right-[10%]" delay={2} />
        <FloatingOrb color="purple" size="sm" className="bottom-20 left-[10%]" delay={5} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal>
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
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <FadeIn direction="left" delay={0.1}>
              <motion.div
                className="bg-[#111827] border border-gray-700/50 rounded-2xl p-8 h-full flex flex-col hover:border-gray-600/50 transition-all duration-200"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
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
                  ].map((f, i) => (
                    <motion.li
                      key={f}
                      className="flex items-center gap-3 text-gray-300 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                    >
                      <Check />
                      {f}
                    </motion.li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/auth/login"
                    className="block w-full bg-white/5 text-white py-3.5 rounded-xl font-semibold text-center hover:bg-white/10 transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </motion.div>
            </FadeIn>

            {/* Pro */}
            <FadeIn direction="right" delay={0.2}>
              <motion.div
                className="relative bg-amber-500/[0.07] border-2 border-amber-500/50 rounded-2xl p-8 h-full flex flex-col shadow-lg shadow-amber-500/10 animate-border-glow"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/20"
                  initial={{ scale: 0, y: 10 }}
                  whileInView={{ scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                >
                  MOST POPULAR
                </motion.span>
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
                  ].map((f, i) => (
                    <motion.li
                      key={f}
                      className="flex items-center gap-3 text-gray-300 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                    >
                      <Check color="text-amber-400" />
                      {f}
                    </motion.li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/auth/login"
                    className="block w-full bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 py-3.5 rounded-xl font-bold text-center hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 btn-press"
                  >
                    Upgrade to Pro
                  </Link>
                </motion.div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════ 7. COMPARISON TABLE ═══════════════ */}
      <section className="bg-[#0a0f1e] py-20 sm:py-28 border-t border-gray-700/20 relative">
        <div className="absolute inset-0 dot-grid-amber" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                COMPARE
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Why Tradespeople Choose Us
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                No bloated features you will never use. No per-user fees eating into your margins.
              </p>
            </div>
          </ScrollReveal>

          <FadeIn>
            <div className="overflow-x-auto bg-[#111827] rounded-2xl border border-gray-700/50">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="py-4 px-4 sm:px-6 text-left text-gray-500 font-medium">&nbsp;</th>
                    <th className="py-4 px-4 sm:px-6 text-center">
                      <span className="text-amber-400 font-bold">TradeInvoice</span>
                    </th>
                    <th className="py-4 px-4 sm:px-6 text-center text-gray-500 font-medium">Jobber</th>
                    <th className="py-4 px-4 sm:px-6 text-center text-gray-500 font-medium">Invoice2go</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {[
                    { label: "Price", us: "€15/mo", usColor: "text-amber-400 font-bold", c1: "From €40/mo", c2: "From €5.99/mo" },
                    { label: "Per-user fees", us: "check", c1: "cross", c2: "cross" },
                    { label: "Unlimited invoices", us: "check", c1: "cross", c2: "cross" },
                    { label: "Auto reminders", us: "check", c1: "check", c2: "cross" },
                  ].map((row, i) => (
                    <motion.tr
                      key={row.label}
                      className={`border-b border-gray-700/30 ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-white/[0.03] transition-colors`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-medium text-gray-300">{row.label}</td>
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
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ 8. FAQ ═══════════════ */}
      <section className="bg-[#0a0f1e] py-20 sm:py-28 border-t border-gray-700/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-400">
                Everything you need to know before getting started.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {[
              { q: "Do I need accounting software to use TradeInvoice?", a: "Nope. TradeInvoice works on its own. You don't need Xero, QuickBooks, or anything else. Just create an invoice, send it, and get paid." },
              { q: "Is my data safe?", a: "Yes. All data is encrypted and payments go through Stripe. We never see or store any card details." },
              { q: "Can I cancel anytime?", a: "Yes. No contracts, no cancellation fees. Downgrade to free or cancel from your settings whenever you want." },
              { q: "Do my clients need to sign up to pay?", a: "No. They get an email with a link. They click it, see the invoice, and pay. No account needed." },
              { q: "What happens after my 20 free invoices?", a: "You can upgrade to Pro for €15/month for unlimited invoices. Or just wait. Your free plan resets every month, 20 fresh invoices, no cost, no expiry." },
            ].map((faq, i) => (
              <FadeIn key={faq.q} delay={i * 0.08}>
                <details className="group bg-[#111827] border border-gray-700/50 rounded-xl hover:border-amber-500/30 transition-all duration-200">
                  <summary className="flex items-center justify-between cursor-pointer p-5 sm:p-6 text-white font-semibold list-none text-sm sm:text-base">
                    {faq.q}
                    <svg
                      className="w-5 h-5 text-amber-400 shrink-0 ml-4 transition-transform duration-200 group-open:rotate-180"
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 9. FINAL CTA ═══════════════ */}
      <section className="py-20 sm:py-28 border-t border-gray-700/20 gradient-mesh relative overflow-hidden">
        <FloatingOrb color="amber" size="lg" className="top-10 left-[20%]" delay={1} />
        <FloatingOrb color="purple" size="md" className="bottom-10 right-[20%]" delay={4} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to get paid faster?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
              Stop chasing payments. Start getting paid on time.
            </p>
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/auth/login"
                className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-10 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 animate-pulse-glow btn-press"
              >
                Start Free - 20 Invoices/Month
              </Link>
            </motion.div>
            <p className="mt-4 text-gray-500 text-sm">
              No credit card required. No strings attached.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════ 10. FOOTER ═══════════════ */}
      <footer className="bg-[#0a0f1e] border-t border-gray-700/30 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="text-xl font-bold text-amber-400 mb-1">TradeInvoice</div>
                <p className="text-gray-500 text-sm">Simple invoicing for tradespeople</p>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center text-sm">
                <Link href="/about" className="text-gray-500 hover:text-amber-400 transition-colors">About</Link>
                <Link href="/blog" className="text-gray-500 hover:text-amber-400 transition-colors">Blog</Link>
                <Link href="/terms" className="text-gray-500 hover:text-amber-400 transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="text-gray-500 hover:text-amber-400 transition-colors">Privacy Policy</Link>
                <Link href="/dpa" className="text-gray-500 hover:text-amber-400 transition-colors">DPA</Link>
                <Link href="/contact" className="text-gray-500 hover:text-amber-400 transition-colors">Contact</Link>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>Also available in:</span>
              <Link href="/nl" className="text-amber-400 hover:text-amber-300 transition-colors">Nederlands</Link>
              <span className="text-gray-700">|</span>
              <Link href="/de" className="text-amber-400 hover:text-amber-300 transition-colors">Deutsch</Link>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700/30 text-center text-gray-600 text-sm">
              © {new Date().getFullYear()} TradeInvoice. Operated by Vlad Mazilu Alexandru, Netherlands.
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
}
