import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About TradeInvoice - Simple Invoicing Built by a Tradesperson",
  description:
    "TradeInvoice was built by Vlad Mazilu Alexandru, an expat tradesperson in the Netherlands who needed simple, affordable invoicing. Learn our story and mission.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About TradeInvoice",
    description:
      "Built by a tradesperson, for tradespeople. Learn why TradeInvoice exists and who is behind it.",
    type: "website",
    siteName: "TradeInvoice",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <header className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-400">
          TradeInvoice
        </Link>
        <Link
          href="/auth/login"
          className="bg-amber-500 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-400 transition-colors"
        >
          Sign In
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">
          About TradeInvoice
        </h1>

        <section className="space-y-6 text-gray-300 leading-relaxed">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-bold shrink-0">
              VM
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Vlad Mazilu Alexandru</p>
              <p className="text-gray-400 text-sm">Founder, based in the Netherlands</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Why TradeInvoice exists</h2>
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

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Who it is for</h2>
          <p>
            TradeInvoice is built for plumbers, electricians, builders, painters, cleaners, and
            any other tradesperson or ZZP&apos;er who needs to send invoices without the overhead
            of enterprise software. It works for freelancers in the Netherlands, Germany, the UK,
            and Belgium.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">The mission</h2>
          <p>
            Affordable, no-nonsense invoicing for tradespeople. No per-user fees. No bloat. No
            features you will never use. Just create an invoice, send it, and get paid. That is it.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">What you get</h2>
          <ul className="space-y-3 list-disc list-inside text-gray-300">
            <li>Professional PDF invoices with your branding</li>
            <li>Automatic payment reminders so you do not have to chase clients</li>
            <li>BTW/VAT calculations for NL, UK, DE, and BE</li>
            <li>Time tracking and expense management</li>
            <li>Client portal where customers can view and pay invoices</li>
            <li>20 free invoices per month, no credit card required</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Get in touch</h2>
          <p>
            Have a question or suggestion? Reach out at{" "}
            <a
              href="mailto:support@tradeinvoice.app"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              support@tradeinvoice.app
            </a>{" "}
            or visit the{" "}
            <Link
              href="/contact"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              contact page
            </Link>
            .
          </p>
        </section>

        <div className="mt-16 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3 text-white">
            Try it free. 20 invoices per month, no card needed.
          </h3>
          <Link
            href="/auth/login"
            className="inline-block bg-amber-500 text-gray-900 px-8 py-3 rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 mt-4"
          >
            Start Free
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center mb-4">
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
        &copy; {new Date().getFullYear()} TradeInvoice. Operated by Vlad Mazilu Alexandru, Netherlands.
      </footer>
    </div>
  );
}
