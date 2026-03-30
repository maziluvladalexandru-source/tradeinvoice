"use client";

import Link from "next/link";
import { ScrollReveal, FadeIn, PageTransition } from "@/components/animations";
import { GradientText } from "@/components/ui/gradient-text";
import { GlowCard as SpotlightCard } from "@/components/spotlight-card";
import { BentoGrid } from "@/components/ui/bento-grid";
import type { BentoItem } from "@/components/ui/bento-grid";
import { FileText, Bell, Globe, Clock, Receipt, CheckCircle } from "lucide-react";

const valueItems: BentoItem[] = [
  {
    title: "Professional PDF Invoices",
    meta: "Branded",
    description: "Clean invoices with your logo, colors, and all the details your clients need.",
    icon: <FileText className="w-4 h-4 text-amber-500" />,
    status: "Core",
    tags: ["PDF", "Branding"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Auto Payment Reminders",
    meta: "Set & forget",
    description: "No more chasing clients. Reminders go out automatically.",
    icon: <Bell className="w-4 h-4 text-amber-500" />,
    status: "Active",
    tags: ["Automation"],
  },
  {
    title: "BTW/VAT Calculations",
    meta: "NL, UK, DE, BE",
    description: "Proper VAT handling for invoicing across EU borders.",
    icon: <Globe className="w-4 h-4 text-blue-500" />,
    tags: ["EU", "VAT"],
  },
  {
    title: "Time & Expense Tracking",
    meta: "Built-in",
    description: "Track hours and log expenses directly in the app.",
    icon: <Clock className="w-4 h-4 text-emerald-500" />,
    tags: ["Tracking"],
    colSpan: 2,
  },
  {
    title: "Client Portal",
    meta: "Self-service",
    description: "Customers can view and pay invoices online. No sign-up required.",
    icon: <Receipt className="w-4 h-4 text-purple-500" />,
    tags: ["Payments"],
  },
  {
    title: "20 Free Invoices/Month",
    meta: "No card needed",
    description: "Get started for free. No credit card, no strings attached.",
    icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    status: "Free",
    tags: ["Free tier"],
    colSpan: 2,
    hasPersistentHover: true,
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-[#0a0f1e] text-white premium-glow">
      <header className="border-b border-gray-700/30 bg-[#0a0f1e]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300 transition-colors">
            TradeInvoice
          </Link>
          <Link
            href="/auth/login"
            className="bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-6 py-2.5 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] text-sm"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero section */}
        <FadeIn>
        <div className="mb-12">
          <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Our Story
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            About{" "}
            <GradientText as="span" className="!bg-[#0a0f1e] text-3xl md:text-4xl font-extrabold">
              TradeInvoice
            </GradientText>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Built by a tradesperson who got tired of overpriced, overcomplicated invoicing software.
          </p>
        </div>
        </FadeIn>

        <section className="space-y-8">
          {/* Founder card with SpotlightCard */}
          <ScrollReveal>
          <SpotlightCard glowColor="orange" customSize className="!w-full !aspect-auto rounded-2xl">
            <div className="p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-bold shrink-0">
                VM
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Vlad Mazilu Alexandru</p>
                <p className="text-gray-400 text-sm">Founder, based in the Netherlands</p>
              </div>
            </div>
          </SpotlightCard>
          </ScrollReveal>

          {/* Content sections */}
          <ScrollReveal delay={0.1}>
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-8 space-y-8 hover:border-amber-500/30 transition-all duration-200">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                Why TradeInvoice exists
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed pl-11">
                <p>
                  I moved to the Netherlands as a tradesperson. I registered my KVK, got my BTW number,
                  and started working. Then came the invoicing. Every tool I found was either too
                  expensive, too complicated, or built for accountants and agencies instead of people
                  who actually work with their hands.
                </p>
                <p>
                  I just needed to send a clean invoice with the right fields, get a reminder sent
                  when a client was late, and move on. So I built TradeInvoice to solve exactly that
                  problem.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700/30 pt-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </span>
                Who it is for
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                TradeInvoice is built for plumbers, electricians, builders, painters, cleaners, and
                any other tradesperson or ZZP&apos;er who needs to send invoices without the overhead
                of enterprise software. It works for freelancers in the Netherlands, Germany, the UK,
                and Belgium.
              </p>
            </div>

            <div className="border-t border-gray-700/30 pt-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                The mission
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                Affordable, no-nonsense invoicing for tradespeople. No per-user fees. No bloat. No
                features you will never use. Just create an invoice, send it, and get paid. That is it.
              </p>
            </div>
          </div>
          </ScrollReveal>

          {/* What you get - BentoGrid */}
          <ScrollReveal delay={0.2}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
              <GradientText as="span" className="!bg-[#0a0f1e] text-xl font-bold">
                What you get
              </GradientText>
            </h2>
          </div>
          <BentoGrid items={valueItems} />
          </ScrollReveal>

          {/* Get in touch */}
          <ScrollReveal delay={0.3}>
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-200">
            <h2 className="text-xl font-bold text-white mb-4">Get in touch</h2>
            <p className="text-gray-300 leading-relaxed">
              Have a question or suggestion? Reach out at{" "}
              <a
                href="mailto:support@tradeinvoice.app"
                className="text-amber-400 hover:text-amber-300 transition-colors underline"
              >
                support@tradeinvoice.app
              </a>{" "}
              or visit the{" "}
              <Link
                href="/contact"
                className="text-amber-400 hover:text-amber-300 transition-colors underline"
              >
                contact page
              </Link>
              .
            </p>
          </div>
          </ScrollReveal>
        </section>

        {/* CTA */}
        <ScrollReveal delay={0.4} scale>
        <div className="mt-16 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-10 text-center hover:border-amber-500/40 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-3 text-white">
            Try it free. 20 invoices per month, no card needed.
          </h3>
          <Link
            href="/auth/login"
            className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-8 py-3.5 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] mt-4"
          >
            Start Free
          </Link>
        </div>
        </ScrollReveal>
      </main>

      <footer className="border-t border-gray-700/30 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center mb-4">
          <Link href="/blog" className="text-gray-500 hover:text-amber-400 transition-colors">
            Blog
          </Link>
          <Link href="/terms" className="text-gray-500 hover:text-amber-400 transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-gray-500 hover:text-amber-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/dpa" className="text-gray-500 hover:text-amber-400 transition-colors">
            DPA
          </Link>
          <Link href="/contact" className="text-gray-500 hover:text-amber-400 transition-colors">
            Contact
          </Link>
        </div>
        &copy; {new Date().getFullYear()} TradeInvoice. Operated by Vlad Mazilu Alexandru, Netherlands.
      </footer>
    </div>
    </PageTransition>
  );
}
