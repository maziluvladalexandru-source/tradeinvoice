import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-400">TradeInvoice</h1>
        <Link
          href="/auth/login"
          className="bg-amber-500 text-gray-900 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-amber-400 transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
          Get Paid Faster. No Per-User Fees.
          <br />
          <span className="text-amber-400">
            Built for Tradespeople, Not Accountants.
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Create professional invoices in 60 seconds. Automatic payment
          reminders chase your clients for you. One flat price, no hidden fees, no nonsense.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-amber-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          Start Free – 20 Invoices/Month
        </Link>
        <p className="mt-4 text-gray-500">
          No credit card required. No strings attached.
        </p>

        {/* Trust badges */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            {
              icon: "⚡",
              text: "Fast Stripe payouts to your bank account.",
            },
            {
              icon: "♾️",
              text: "No invoice limits on paid plans.",
            },
            {
              icon: "🤝",
              text: "Email support on all plans.",
            },
          ].map((item) => (
            <div
              key={item.text}
              className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 text-center"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm font-medium text-gray-300">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Create in 60 Seconds",
              desc: "Add your client, add line items, hit send. That's it. No complicated forms.",
            },
            {
              title: "Auto Payment Reminders",
              desc: "Your clients get reminded at 7 days, 3 days, and when overdue. You don't have to lift a finger.",
            },
            {
              title: "Track Everything",
              desc: "See which invoices are sent, viewed, paid, or overdue. All in one place.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-2">
          How It Works
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Three steps. That&apos;s it.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              emoji: "📝",
              title: "Create Invoice in 60 Seconds",
              desc: "Add your client, line items, and due date. A professional PDF gets generated automatically. No templates needed.",
            },
            {
              step: "2",
              emoji: "📨",
              title: "Send to Client Instantly",
              desc: "One click sends a clean invoice straight to your client's inbox. Reminders follow up automatically.",
            },
            {
              step: "3",
              emoji: "💰",
              title: "Get Paid & Get Notified",
              desc: "Your client pays online. You get an email the moment the money lands. No more guessing who paid and who didn't.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {item.step}
              </div>
              <div className="text-4xl mb-4 mt-2">{item.emoji}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built For You */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-2">
          Everything You Need to Get Paid
        </h2>
        <p className="text-center text-gray-400 mb-12">
          No bloat. No learning curve. Just the tools that actually matter.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              emoji: "🔔",
              title: "Automatic Reminders",
              desc: "Your clients get polite nudges at 7 days, 3 days, and when overdue. You never have to send that awkward follow-up text again.",
            },
            {
              emoji: "📱",
              title: "Works on Any Device",
              desc: "Create and send invoices from your phone on the job site, or from your laptop at home. No app to download.",
            },
            {
              emoji: "🌍",
              title: "Multi-Language Invoices",
              desc: "Generate invoices in English, Dutch, or German. Perfect for working across borders in the EU.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-2">
          Simple, Honest Pricing
        </h2>
        <p className="text-center text-gray-400 mb-4">
          No surprises. No per-user fees. Ever.
        </p>
        <div className="flex justify-center mb-10">
          <span className="inline-block bg-amber-500/20 text-amber-400 border border-amber-500/40 text-sm font-bold px-4 py-1.5 rounded-full">
            No Per-User Fees
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold mb-1">Free</h3>
            <p className="text-4xl font-extrabold mb-1">€0</p>
            <p className="text-gray-500 text-sm mb-6">/month</p>
            <ul className="text-gray-400 text-sm space-y-2 mb-8 text-left">
              <li>✓ 20 invoices per month</li>
              <li>✓ Payment reminders</li>
              <li>✓ Professional PDF invoices</li>
              <li>✓ Client management</li>
            </ul>
            <Link
              href="/auth/login"
              className="block w-full bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
          {/* Pro */}
          <div className="bg-amber-500/10 border-2 border-amber-500 rounded-2xl p-8 text-center relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </span>
            <h3 className="text-xl font-bold mb-1">Pro</h3>
            <p className="text-4xl font-extrabold mb-1">€15</p>
            <p className="text-gray-500 text-sm mb-6">/month</p>
            <ul className="text-gray-400 text-sm space-y-2 mb-8 text-left">
              <li>✓ Unlimited invoices</li>
              <li>✓ Payment reminders</li>
              <li>✓ Multi-language invoices</li>
              <li>✓ Partial payment tracking</li>
              <li>✓ Email support</li>
            </ul>
            <Link
              href="/auth/login"
              className="block w-full bg-amber-500 text-gray-900 py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-500/20 text-amber-400 border border-amber-500/40 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            COMPARE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Why Tradespeople Choose Us Over the Alternatives
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            No bloated features you will never use. No per-user fees eating into your margins.
          </p>
        </div>
        <div className="overflow-x-auto bg-gray-800/50 border border-gray-700 rounded-2xl p-2">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-500 font-medium">
                  &nbsp;
                </th>
                <th className="py-3 px-4 text-center text-amber-400 font-bold">
                  TradeInvoice
                </th>
                <th className="py-3 px-4 text-center text-gray-400 font-medium">
                  Jobber
                </th>
                <th className="py-3 px-4 text-center text-gray-400 font-medium">
                  Invoice2go
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 font-medium">Price</td>
                <td className="py-3 px-4 text-center font-bold text-amber-400">
                  €15/mo
                </td>
                <td className="py-3 px-4 text-center">From €40/mo</td>
                <td className="py-3 px-4 text-center">From €5.99/mo</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 font-medium">Per-user fees</td>
                <td className="py-3 px-4 text-center font-bold text-green-400">
                  None
                </td>
                <td className="py-3 px-4 text-center text-red-400">
                  Yes
                </td>
                <td className="py-3 px-4 text-center text-red-400">
                  Yes (limits vary)
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 font-medium">Invoice limits</td>
                <td className="py-3 px-4 text-center font-bold text-green-400">
                  Unlimited (Pro)
                </td>
                <td className="py-3 px-4 text-center text-red-400">
                  Tier-limited
                </td>
                <td className="py-3 px-4 text-center text-red-400">
                  Tier-limited
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Support</td>
                <td className="py-3 px-4 text-center font-bold text-green-400">
                  Email support
                </td>
                <td className="py-3 px-4 text-center text-gray-500">
                  Chat / email
                </td>
                <td className="py-3 px-4 text-center text-gray-500">
                  Email only
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Everything you need to know before getting started.
        </p>
        <div className="space-y-4">
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
            <details
              key={faq.q}
              className="group bg-gray-800/50 border border-gray-700 rounded-2xl"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 text-white font-semibold list-none">
                {faq.q}
                <svg
                  className="w-5 h-5 text-amber-400 shrink-0 ml-4 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Stop Chasing Payments. Start Getting Paid.
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Simple invoicing built for tradespeople in the Netherlands, UK, and Ireland.
          Create your first invoice in 60 seconds.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-amber-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          Start Free – 20 Invoices/Month
        </Link>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-4 mb-2 flex-wrap">
          <Link href="/terms" className="hover:text-gray-400 transition-colors">
            Terms of Service
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/dpa" className="hover:text-gray-400 transition-colors">
            DPA
          </Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">
            Contact
          </Link>
        </div>
        © {new Date().getFullYear()} TradeInvoice. All rights reserved.
      </footer>
    </div>
  );
}


