"use client";

import Link from "next/link";
import { useCallback } from "react";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
  ScrollReveal,
  AnimatedCounter,
  FloatingOrb,
  GlowCard,
  motion,
} from "@/components/animations";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { BentoGrid } from "@/components/ui/bento-grid";
import type { BentoItem } from "@/components/ui/bento-grid";
import { CreativePricing } from "@/components/ui/creative-pricing";
// GradientText available from "@/components/ui/gradient-text" if needed
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import { GlowCard as SpotlightCard } from "@/components/spotlight-card";
import { TestimonialsColumn } from "@/components/testimonials-columns-1";
import { FileText, Bell, Globe, Clock, Receipt, BarChart3, Zap, Star, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  SVG Flag components                                                */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Invoice mockup                                                     */
/* ------------------------------------------------------------------ */
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
        <div className="space-y-3 mb-5">
          {[
            { label: "Kitchen renovation", amount: "\u20AC2,400" },
            { label: "Materials", amount: "\u20AC850" },
            { label: "Plumbing work", amount: "\u20AC600" },
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
            <span>\u20AC3,850</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>VAT 21%</span>
            <span>\u20AC808.50</span>
          </div>
          <motion.div
            className="flex justify-between font-bold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-amber-400">Total</span>
            <span className="text-amber-400">\u20AC4,658.50</span>
          </motion.div>
        </div>
      </motion.div>
      <div className="absolute -inset-4 bg-amber-500/5 rounded-3xl blur-2xl -z-10 animate-breathe" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Check / Cross icons                                                */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Testimonials data                                                  */
/* ------------------------------------------------------------------ */
const testimonialsCol1 = [
  { text: "Finally, invoicing software that doesn't need a manual. I create an invoice faster than I can write a quote on paper.", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23f59e0b' rx='20'/%3E%3Ctext x='20' y='26' fill='white' text-anchor='middle' font-size='16' font-family='sans-serif'%3EJK%3C/text%3E%3C/svg%3E", name: "Jan Kuiper", role: "Plumber, Amsterdam" },
  { text: "The automatic payment reminders are a game changer. I used to lose hours chasing clients. Now they pay on time without me lifting a finger.", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%236366f1' rx='20'/%3E%3Ctext x='20' y='26' fill='white' text-anchor='middle' font-size='16' font-family='sans-serif'%3EMS%3C/text%3E%3C/svg%3E", name: "Mark Stevens", role: "Electrician, London" },
  { text: "No per-user fees! My old software charged me for every team member. TradeInvoice is just flat pricing. Simple.", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%2310b981' rx='20'/%3E%3Ctext x='20' y='26' fill='white' text-anchor='middle' font-size='16' font-family='sans-serif'%3ETB%3C/text%3E%3C/svg%3E", name: "Thomas Bakker", role: "Builder, Rotterdam" },
];
const testimonialsCol2 = [
  { text: "I moved to the Netherlands as a ZZP'er and needed something simple for my BTW invoices. TradeInvoice was exactly what I needed.", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23ec4899' rx='20'/%3E%3Ctext x='20' y='26' fill='white' text-anchor='middle' font-size='16' font-family='sans-serif'%3EAP%3C/text%3E%3C/svg%3E", name: "Anna Petrova", role: "Painter, Utrecht" },
  { text: "My clients love the professional invoices. They look way better than my old Excel templates and include proper VAT calculations.", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23f97316' rx='20'/%3E%3Ctext x='20' y='26' fill='white' text-anchor='middle' font-size='16' font-family='sans-serif'%3EHM%3C/text%3E%3C/svg%3E", name: "Hans Mueller", role: "Contractor, Berlin" },
  { text: "The time tracking feature is brilliant. I track hours on the job and convert them to invoice lines with one click.", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%238b5cf6' rx='20'/%3E%3Ctext x='20' y='26' fill='white' text-anchor='middle' font-size='16' font-family='sans-serif'%3ESD%3C/text%3E%3C/svg%3E", name: "Sophie Dubois", role: "Electrician, Brussels" },
];
const testimonialsCol3 = [
  { text: "Switched from Invoice2go and saving almost 30 euros a month. TradeInvoice does everything I need for a fraction of the cost.", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%2306b6d4' rx='20'/%3E%3Ctext x='20' y='26' fill='white' text-anchor='middle' font-size='16' font-family='sans-serif'%3EPJ%3C/text%3E%3C/svg%3E", name: "Pieter Jansen", role: "HVAC Technician, Den Haag" },
  { text: "20 free invoices a month is perfect for my side work. When I went full-time, upgrading to Pro was a no-brainer.", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23ef4444' rx='20'/%3E%3Ctext x='20' y='26' fill='white' text-anchor='middle' font-size='16' font-family='sans-serif'%3EJW%3C/text%3E%3C/svg%3E", name: "James Wilson", role: "Carpenter, Manchester" },
  { text: "Clean, fast, no bloat. I open it, make an invoice, send it. That is exactly what I need after a long day on site.", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%2314b8a6' rx='20'/%3E%3Ctext x='20' y='26' fill='white' text-anchor='middle' font-size='16' font-family='sans-serif'%3EKV%3C/text%3E%3C/svg%3E", name: "Koen Vermeer", role: "Roofer, Eindhoven" },
];

/* ------------------------------------------------------------------ */
/*  BentoGrid items                                                    */
/* ------------------------------------------------------------------ */
const featureItems: BentoItem[] = [
  {
    title: "Professional Invoices",
    meta: "PDF + Branding",
    description: "Clean, branded PDF invoices that make you look polished. Add your logo, customize colors, and include all the details your clients need.",
    icon: <FileText className="w-4 h-4 text-amber-500" />,
    status: "Core",
    tags: ["PDF", "Branding", "Custom"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Auto Payment Reminders",
    meta: "Set & forget",
    description: "Polite nudges at 7 days, 3 days, and when overdue. No more awkward follow-up texts.",
    icon: <Bell className="w-4 h-4 text-amber-500" />,
    status: "Active",
    tags: ["Automation", "Email"],
  },
  {
    title: "Multi-Country Support",
    meta: "NL, UK, DE, BE",
    description: "Invoices in English, Dutch, or German. Proper VAT handling across EU borders.",
    icon: <Globe className="w-4 h-4 text-blue-500" />,
    status: "Live",
    tags: ["EU", "VAT", "Languages"],
    colSpan: 2,
  },
  {
    title: "Time Tracking",
    meta: "Built-in",
    description: "Track hours on the job and convert them to invoice line items with one click.",
    icon: <Clock className="w-4 h-4 text-emerald-500" />,
    tags: ["Tracking", "Billing"],
  },
  {
    title: "Expense Tracking",
    meta: "Per project",
    description: "Log project expenses and materials. Keep a clear record so nothing slips through.",
    icon: <Receipt className="w-4 h-4 text-emerald-500" />,
    tags: ["Expenses", "Materials"],
  },
  {
    title: "Financial Reports",
    meta: "Real-time",
    description: "Revenue, outstanding payments, and overdue invoices at a glance.",
    icon: <BarChart3 className="w-4 h-4 text-purple-500" />,
    status: "Pro",
    tags: ["Analytics", "Reports"],
    colSpan: 2,
  },
];

/* ------------------------------------------------------------------ */
/*  Pricing tiers                                                      */
/* ------------------------------------------------------------------ */
const pricingTiers = [
  {
    name: "Free",
    icon: <Zap className="w-6 h-6" />,
    price: 0,
    description: "Perfect for getting started",
    features: [
      "20 invoices per month",
      "Payment reminders",
      "Professional PDFs",
      "Client management",
    ],
    color: "emerald",
  },
  {
    name: "Pro",
    icon: <Star className="w-6 h-6" />,
    price: 15,
    description: "For full-time tradespeople",
    features: [
      "Unlimited invoices",
      "Multi-language support",
      "Partial payment tracking",
      "Priority email support",
      "Financial reports",
    ],
    popular: true,
    color: "amber",
  },
  {
    name: "Business",
    icon: <Sparkles className="w-6 h-6" />,
    price: 29,
    description: "For growing teams",
    features: [
      "Everything in Pro",
      "Multiple team members",
      "Team management",
      "API access",
      "Custom branding",
    ],
    color: "blue",
  },
];

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
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

      {/* ═══════════════ 1. HERO with BackgroundPaths ═══════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated SVG path background */}
        <div className="absolute inset-0 z-0">
          <BackgroundPaths />
        </div>

        {/* Hero content overlay */}
        <div className="relative z-10 min-h-screen flex items-center pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-0">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: copy */}
              <div className="text-center lg:text-left">
                <FadeIn delay={0.1}>
                  <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                    Built for tradespeople, not accountants
                  </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-2">
                    Get Paid Faster.
                  </h1>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 flex flex-wrap items-baseline gap-x-4 justify-center lg:justify-start">
                    <span className="text-white">Invoice for</span>
                    <AnimatedTextCycle
                      words={["Plumbers", "Electricians", "Builders", "Contractors"]}
                      interval={3000}
                      className="text-amber-400"
                    />
                  </div>
                </FadeIn>

                <FadeIn delay={0.45}>
                  <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    Create professional invoices in 60 seconds. Automatic payment
                    reminders chase your clients for you. One flat price, no hidden fees, no nonsense.
                  </p>
                </FadeIn>

                <FadeIn delay={0.6}>
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
            {/* Connecting line (desktop) */}
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
                <SpotlightCard glowColor="orange" customSize className="!w-full !aspect-auto p-8 text-center h-full rounded-2xl">
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
                </SpotlightCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. FEATURES (BentoGrid) ═══════════════ */}
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

          <FadeIn>
            <BentoGrid items={featureItems} />
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ 5. TESTIMONIALS ═══════════════ */}
      <section className="bg-[#0a0f1e] py-20 sm:py-28 border-t border-gray-700/20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                TESTIMONIALS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Trusted by Tradespeople Across Europe
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                See what contractors, plumbers, and electricians are saying.
              </p>
            </div>
          </ScrollReveal>

          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[600px]">
            <TestimonialsColumn
              testimonials={testimonialsCol1}
              duration={15}
              className="hidden md:block"
            />
            <TestimonialsColumn
              testimonials={testimonialsCol2}
              duration={19}
            />
            <TestimonialsColumn
              testimonials={testimonialsCol3}
              duration={17}
              className="hidden lg:block"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ 6. SOCIAL PROOF ═══════════════ */}
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
              { number: 15, label: "Flat Monthly Price", color: "text-blue-400", prefix: "\u20AC" },
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

      {/* ═══════════════ 7. PRICING (CreativePricing) ═══════════════ */}
      <section
        id="pricing"
        className="py-20 sm:py-28 border-t border-gray-700/20 relative bg-[#0a0f1e]"
      >
        <FloatingOrb color="amber" size="md" className="top-20 right-[10%]" delay={2} />
        <FloatingOrb color="purple" size="sm" className="bottom-20 left-[10%]" delay={5} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal>
            <CreativePricing
              tag="Simple Pricing"
              title="Honest, Flat Pricing"
              description="No surprises. No per-user fees. Ever."
              tiers={pricingTiers}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════ 8. COMPARISON TABLE ═══════════════ */}
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
                    { label: "Price", us: "\u20AC15/mo", usColor: "text-amber-400 font-bold", c1: "From \u20AC40/mo", c2: "From \u20AC5.99/mo" },
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

      {/* ═══════════════ 9. FAQ ═══════════════ */}
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
              { q: "What happens after my 20 free invoices?", a: "You can upgrade to Pro for \u20AC15/month for unlimited invoices. Or just wait. Your free plan resets every month, 20 fresh invoices, no cost, no expiry." },
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

      {/* ═══════════════ 10. FINAL CTA ═══════════════ */}
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

      {/* ═══════════════ 11. FOOTER ═══════════════ */}
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
              &copy; {new Date().getFullYear()} TradeInvoice. Operated by Vlad Mazilu Alexandru, Netherlands.
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
}
