"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

/* ──────────────── Flag SVGs ──────────────── */
function FlagNL() {
  return (
    <svg width="24" height="16" viewBox="0 0 32 22" className="rounded-sm" role="img" aria-label="Netherlands flag">
      <rect width="32" height="7.33" fill="#AE1C28" />
      <rect y="7.33" width="32" height="7.34" fill="#FFF" />
      <rect y="14.67" width="32" height="7.33" fill="#21468B" />
    </svg>
  );
}
function FlagUK() {
  return (
    <svg width="24" height="16" viewBox="0 0 60 30" className="rounded-sm" role="img" aria-label="United Kingdom flag">
      <clipPath id="uk-tools"><rect width="60" height="30" /></clipPath>
      <g clipPath="url(#uk-tools)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFF" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0V30M0,15H60" stroke="#FFF" strokeWidth="10" />
        <path d="M30,0V30M0,15H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
function FlagDE() {
  return (
    <svg width="24" height="16" viewBox="0 0 32 22" className="rounded-sm" role="img" aria-label="Germany flag">
      <rect width="32" height="7.33" fill="#000" />
      <rect y="7.33" width="32" height="7.34" fill="#DD0000" />
      <rect y="14.67" width="32" height="7.33" fill="#FFCC00" />
    </svg>
  );
}
function FlagBE() {
  return (
    <svg width="24" height="16" viewBox="0 0 32 22" className="rounded-sm" role="img" aria-label="Belgium flag">
      <rect width="10.67" height="22" fill="#000" />
      <rect x="10.67" width="10.66" height="22" fill="#FAE042" />
      <rect x="21.33" width="10.67" height="22" fill="#ED2939" />
    </svg>
  );
}

/* ──────────────── Countries ──────────────── */
const countries = [
  { code: "NL", name: "Netherlands", rate: 21, flag: <FlagNL /> },
  { code: "UK", name: "United Kingdom", rate: 20, flag: <FlagUK /> },
  { code: "DE", name: "Germany", rate: 19, flag: <FlagDE /> },
  { code: "BE", name: "Belgium", rate: 21, flag: <FlagBE /> },
];

/* ══════════════════════════════════════════════════════════════════════
   TOOL A: BTW / VAT Calculator
   ══════════════════════════════════════════════════════════════════════ */
function VATCalculator() {
  const [amount, setAmount] = useState("");
  const [isInclusive, setIsInclusive] = useState(false);
  const [countryIdx, setCountryIdx] = useState(0);

  const country = countries[countryIdx];
  const rate = country.rate;

  const result = useMemo(() => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val < 0) return null;
    if (isInclusive) {
      const excl = val / (1 + rate / 100);
      const vat = val - excl;
      return { excl, vat, incl: val };
    } else {
      const vat = val * (rate / 100);
      return { excl: val, vat, incl: val + vat };
    }
  }, [amount, isInclusive, rate]);

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-amber-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 text-xl">%</div>
        <div>
          <h2 className="text-xl font-bold text-white">BTW / VAT Calculator</h2>
          <p className="text-gray-500 text-sm">Calculate VAT instantly for NL, UK, DE, BE</p>
        </div>
      </div>

      {/* Country selector */}
      <div className="flex gap-2 mb-4">
        {countries.map((c, i) => (
          <button
            key={c.code}
            onClick={() => setCountryIdx(i)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              i === countryIdx
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                : "bg-white/5 border border-white/10 text-gray-400 hover:border-white/20"
            }`}
          >
            {c.flag}
            <span>{c.code}</span>
            <span className="text-xs opacity-60">{c.rate}%</span>
          </button>
        ))}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setIsInclusive(!isInclusive)}
        className="mb-4 text-sm px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:border-amber-500/30 transition-colors"
      >
        {isInclusive ? "Amount is incl. BTW" : "Amount is excl. BTW"}
        <span className="ml-2 text-amber-400 text-xs">(click to toggle)</span>
      </button>

      {/* Input */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">&euro;</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
        />
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-xl p-5">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Amount excl. BTW</span>
            <span className="text-white font-semibold">&euro;{result.excl.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">BTW ({rate}%)</span>
            <span className="text-amber-400 font-semibold">&euro;{result.vat.toFixed(2)}</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between">
            <span className="text-gray-300 font-medium">Amount incl. BTW</span>
            <span className="text-white font-bold text-lg">&euro;{result.incl.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   TOOL B: Invoice Number Generator
   ══════════════════════════════════════════════════════════════════════ */
const formats = [
  { label: "INV-0001", prefix: "INV-", digits: 4 },
  { label: "2026-001", prefix: `${new Date().getFullYear()}-`, digits: 3 },
  { label: "COMPANY-001", prefix: "COMPANY-", digits: 3 },
];

function generateNumber(format: typeof formats[number]): string {
  const num = Math.floor(Math.random() * (10 ** format.digits - 1)) + 1;
  return format.prefix + String(num).padStart(format.digits, "0");
}

function InvoiceNumberGenerator() {
  const [formatIdx, setFormatIdx] = useState(0);
  const [number, setNumber] = useState(() => generateNumber(formats[0]));
  const [copied, setCopied] = useState(false);

  const regenerate = (idx?: number) => {
    const fi = idx !== undefined ? idx : formatIdx;
    setNumber(generateNumber(formats[fi]));
    setCopied(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-amber-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 text-xl">#</div>
        <div>
          <h2 className="text-xl font-bold text-white">Invoice Number Generator</h2>
          <p className="text-gray-500 text-sm">Generate professional invoice numbers instantly</p>
        </div>
      </div>

      {/* Format selector */}
      <div className="flex gap-2 mb-5">
        {formats.map((f, i) => (
          <button
            key={f.label}
            onClick={() => { setFormatIdx(i); regenerate(i); }}
            className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all ${
              i === formatIdx
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                : "bg-white/5 border border-white/10 text-gray-400 hover:border-white/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Generated number */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 flex items-center justify-between mb-5">
        <span className="text-2xl font-mono font-bold text-white">{number}</span>
        <div className="flex gap-2">
          <button
            onClick={() => regenerate()}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
            title="Generate new"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={copy}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              copied
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                : "bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Best practices */}
      <div className="space-y-2 text-sm text-gray-400">
        <p className="text-gray-300 font-medium mb-2">Best practices for invoice numbering:</p>
        <ul className="space-y-1.5 list-none">
          <li className="flex gap-2"><span className="text-amber-400">&#10003;</span> Use sequential numbers so no gaps appear</li>
          <li className="flex gap-2"><span className="text-amber-400">&#10003;</span> Each invoice number must be unique</li>
          <li className="flex gap-2"><span className="text-amber-400">&#10003;</span> Include a prefix or year for easy filing</li>
          <li className="flex gap-2"><span className="text-amber-400">&#10003;</span> Never reuse a number, even for cancelled invoices</li>
          <li className="flex gap-2"><span className="text-amber-400">&#10003;</span> Required by Dutch (KVK) and EU tax law</li>
        </ul>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   TOOL C: Payment Due Date Calculator
   ══════════════════════════════════════════════════════════════════════ */
const paymentTerms = [
  { label: "Due on receipt", days: 0 },
  { label: "Net 14", days: 14 },
  { label: "Net 30", days: 30 },
  { label: "Net 45", days: 45 },
  { label: "Net 60", days: 60 },
];

function PaymentDueDateCalculator() {
  const today = new Date().toISOString().split("T")[0];
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [termIdx, setTermIdx] = useState(2); // Net 30 default

  const result = useMemo(() => {
    if (!invoiceDate) return null;
    const start = new Date(invoiceDate + "T00:00:00");
    const term = paymentTerms[termIdx];
    const due = new Date(start);
    due.setDate(due.getDate() + term.days);

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const overdue = diffDays < 0;

    return {
      dueDate: due,
      daysRemaining: Math.abs(diffDays),
      overdue,
      isToday: diffDays === 0,
    };
  }, [invoiceDate, termIdx]);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-amber-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 text-xl">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Payment Due Date Calculator</h2>
          <p className="text-gray-500 text-sm">Calculate when invoices are due</p>
        </div>
      </div>

      {/* Invoice date */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5">Invoice date</label>
        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors [color-scheme:dark]"
        />
      </div>

      {/* Payment terms */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1.5">Payment terms</label>
        <div className="flex flex-wrap gap-2">
          {paymentTerms.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTermIdx(i)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                i === termIdx
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Due date</span>
            <span className="text-white font-semibold">{formatDate(result.dueDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Status</span>
            {result.overdue ? (
              <span className="text-red-400 font-semibold">
                Overdue by {result.daysRemaining} day{result.daysRemaining !== 1 ? "s" : ""}
              </span>
            ) : result.isToday ? (
              <span className="text-amber-400 font-semibold">Due today</span>
            ) : (
              <span className="text-emerald-400 font-semibold">
                {result.daysRemaining} day{result.daysRemaining !== 1 ? "s" : ""} remaining
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════ */
export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-400">
            TradeInvoice
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</Link>
            <Link href="/templates" className="text-gray-400 hover:text-white text-sm transition-colors">Templates</Link>
            <Link
              href="/auth/login"
              className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-amber-400 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 sm:py-24 text-center px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Free Invoice <span className="text-amber-400">Tools</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            BTW calculator, invoice number generator, and payment due date calculator. No sign-up required. 100% free.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VATCalculator />
        <InvoiceNumberGenerator />
        <PaymentDueDateCalculator />
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #1e1b4b 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Need more than a calculator?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
            Create professional invoices in 60 seconds. Auto payment reminders. Multi-country support.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-amber-500 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02]"
          >
            Start Free - 20 Invoices/Month
          </Link>
          <p className="mt-4 text-gray-500 text-sm">No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0f1a] border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-xl font-bold text-amber-400 mb-1">TradeInvoice</div>
              <p className="text-gray-600 text-sm">Simple invoicing for tradespeople</p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center text-sm">
              <Link href="/blog" className="text-gray-500 hover:text-gray-300 transition-colors">Blog</Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-300 transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} TradeInvoice. Operated by Vlad Mazilu Alexandru, Netherlands.
          </div>
        </div>
      </footer>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Free Invoice Tools - BTW Calculator, Invoice Number Generator",
            description: "Free online BTW/VAT calculator, invoice number generator, and payment due date calculator for freelancers and small businesses.",
            url: "https://tradeinvoice.app/tools",
            isPartOf: { "@type": "WebSite", name: "TradeInvoice", url: "https://tradeinvoice.app" },
          }),
        }}
      />
    </div>
  );
}
