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
          reminders chase your clients for you. One flat price, your whole team.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-amber-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          Start Free – 5 Invoices on Us
        </Link>
        <p className="mt-4 text-gray-500">
          No credit card required.
        </p>

        {/* Trust badges */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            {
              icon: "⚡",
              text: "Your money in 2 business days. Guaranteed.",
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
              desc: "Add client, line items, and send. No fuss, no complicated forms.",
            },
            {
              title: "Auto Payment Reminders",
              desc: "Automatic email reminders chase your clients at 7 days, 3 days, and when overdue.",
            },
            {
              title: "Track Everything",
              desc: "See which invoices are sent, viewed, paid, or overdue at a glance.",
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
              <li>✓ 5 invoices per month</li>
              <li>✓ Payment reminders</li>
              <li>✓ Unlimited team members</li>
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
              <li>✓ Unlimited team members</li>
              <li>✓ Priority support</li>
            </ul>
            <Link
              href="/auth/login"
              className="block w-full bg-amber-500 text-gray-900 py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-2">
          See How We Compare
        </h2>
        <p className="text-center text-gray-400 mb-10">
          Built for trades. Priced for trades.
        </p>
        <div className="overflow-x-auto">
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
                  Fast responses
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

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Stop Chasing Payments. Start Getting Paid.
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Join tradespeople across Ireland and the UK who invoice smarter with
          TradeInvoice.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-amber-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          Start Free – 5 Invoices on Us
        </Link>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} TradeInvoice. All rights reserved.
      </footer>
    </div>
  );
}

