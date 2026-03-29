import type { Metadata } from "next";
import Link from "next/link";
import { trades } from "../invoice-template/trades";

export const metadata: Metadata = {
  title: "Free Invoice Template for Tradespeople | TradeInvoice",
  description:
    "Download a free professional invoice template for tradespeople in the Netherlands. Includes KVK, BTW, IBAN fields. Or create your own invoice online in 60 seconds.",
  alternates: {
    canonical: "/templates",
  },
  keywords: [
    "free invoice template",
    "free invoice template Netherlands",
    "factuur template gratis",
    "invoice template ZZP",
    "factuur voorbeeld",
    "gratis factuur template",
    "invoice template plumber",
    "invoice template electrician",
    "trade invoice template",
  ],
  openGraph: {
    title: "Free Invoice Template for Tradespeople | TradeInvoice",
    description:
      "Download a free professional invoice template or create your own online in 60 seconds. Built for plumbers, electricians, builders and contractors in the Netherlands.",
    url: "https://tradeinvoice.app/templates",
    type: "website",
    siteName: "TradeInvoice",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Template for Tradespeople | TradeInvoice",
    description:
      "Download a free professional invoice template or create your own online in 60 seconds. Built for plumbers, electricians, builders and contractors in the Netherlands.",
  },
};

function InvoiceTemplatePreview() {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden">
      {/* Invoice Header */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">INVOICE</div>
            <div className="text-sm text-gray-500 mt-1">#INV-2026-014</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              Jan de Vries Loodgieterij
            </div>
            <div className="text-sm text-gray-500">
              Prinsengracht 456, Amsterdam
            </div>
            <div className="text-sm text-gray-500">KVK: 12345678</div>
            <div className="text-sm text-gray-500">BTW: NL123456789B01</div>
          </div>
        </div>
      </div>

      {/* Client + Date */}
      <div className="px-8 py-5 border-b border-gray-100">
        <div className="flex justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Bill To
            </div>
            <div className="text-sm font-medium text-gray-900">
              Maria van den Berg
            </div>
            <div className="text-sm text-gray-500">
              Herengracht 789, Amsterdam
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Date
            </div>
            <div className="text-sm text-gray-900">25 March 2026</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-3 mb-1">
              Due Date
            </div>
            <div className="text-sm text-gray-900">8 April 2026</div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="px-8 py-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="text-left pb-3 font-medium">Description</th>
              <th className="text-right pb-3 font-medium">Qty</th>
              <th className="text-right pb-3 font-medium">Rate</th>
              <th className="text-right pb-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-50">
              <td className="py-3">Kitchen sink tap replacement</td>
              <td className="py-3 text-right">2 hrs</td>
              <td className="py-3 text-right">$60.00</td>
              <td className="py-3 text-right font-medium">$120.00</td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-3">
                Materials: copper pipe, compression fittings
              </td>
              <td className="py-3 text-right">1</td>
              <td className="py-3 text-right">$34.50</td>
              <td className="py-3 text-right font-medium">$34.50</td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-3">Waste pipe installation</td>
              <td className="py-3 text-right">1.5 hrs</td>
              <td className="py-3 text-right">$60.00</td>
              <td className="py-3 text-right font-medium">$90.00</td>
            </tr>
            <tr>
              <td className="py-3">Call-out fee (evening)</td>
              <td className="py-3 text-right">1</td>
              <td className="py-3 text-right">$45.00</td>
              <td className="py-3 text-right font-medium">$45.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="px-8 py-5 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Subtotal</span>
          <span>$289.50</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>BTW / VAT (21%)</span>
          <span>$60.80</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-300 pt-3">
          <span>Total</span>
          <span>$350.30</span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="px-8 py-4 border-t border-gray-200 bg-amber-50">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          Payment Details
        </div>
        <div className="text-sm text-gray-700">
          IBAN: NL91 ABNA 0417 1643 00
        </div>
        <div className="text-sm text-gray-700">
          Payment term: 14 days
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-400">
          TradeInvoice
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/auth/login"
            className="bg-amber-500 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-400 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-amber-400">
          Free Invoice Template for Tradespeople
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Download our professional invoice template or create your own online
          in 60 seconds. Compliant with Dutch tax rules, including KVK, BTW, and
          IBAN fields.
        </p>
      </section>

      {/* Invoice Preview */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <InvoiceTemplatePreview />
      </section>

      {/* What a Proper Invoice Needs */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          What a Proper Dutch Invoice Must Include
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          The Dutch tax authority (Belastingdienst) requires every invoice to
          have specific fields. Missing any of these can lead to fines or
          rejected BTW deductions.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Business Details */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              Your Business Details
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">KVK number</strong> - Your
                  8-digit Chamber of Commerce registration number
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">BTW-id</strong> - Your VAT
                  identification number (NL + 9 digits + B + 2 digits)
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">Business name and address</strong>{" "}
                  - Full legal name or trade name
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">IBAN</strong> - Your Dutch bank
                  account number for receiving payment
                </span>
              </li>
            </ul>
          </div>

          {/* Invoice Details */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              Invoice Specifics
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">Sequential invoice number</strong>{" "}
                  - Must be unique and in order (e.g. 2026-001, 2026-002)
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">Invoice date</strong> - The date
                  the invoice is issued
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">Detailed descriptions</strong> -
                  What work was done, where, and when
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">Payment terms</strong> - Due date
                  (14 or 30 days is standard in NL)
                </span>
              </li>
            </ul>
          </div>

          {/* Client Details */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              Client Information
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">Client name</strong> - Full name
                  or company name
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">Client address</strong> - Street,
                  city, and postal code
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">Client VAT number</strong> - Required
                  for B2B and cross-border invoices
                </span>
              </li>
            </ul>
          </div>

          {/* Tax Details */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              BTW / VAT Breakdown
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">Subtotal</strong> - Amount before
                  tax
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">BTW rate and amount</strong> - Show
                  21% or 9% rate with calculated amount
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">Total including BTW</strong> - The
                  final amount your client pays
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Browse Templates by Trade */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          Browse Templates by Trade
        </h2>
        <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
          Find an invoice template tailored to your specific trade, with
          realistic line items, pricing guides, and industry-specific advice.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {trades.map((trade) => (
            <Link
              key={trade.slug}
              href={`/invoice-template/${trade.slug}`}
              className="bg-[#111827] border border-gray-700/50 rounded-xl p-4 hover:border-amber-500/50 transition-colors text-center group"
            >
              <div className="text-white font-medium text-sm group-hover:text-amber-400 transition-colors">
                {trade.namePlural}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-3xl p-10 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Create Your Free Invoice Now
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Stop wasting time with Word documents and spreadsheets. TradeInvoice
            lets you create compliant, professional invoices in 60 seconds - with
            automatic BTW calculations, payment reminders, and more.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-amber-500 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors"
          >
            Create Your Free Invoice Now
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Free plan available. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center mb-4">
          <Link
            href="/blog"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/terms"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/dpa"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            DPA
          </Link>
          <Link
            href="/contact"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            Contact
          </Link>
        </div>
        &copy; {new Date().getFullYear()} TradeInvoice. Operated by Vlad Mazilu
        Alexandru, Netherlands.
      </footer>
    </div>
  );
}
