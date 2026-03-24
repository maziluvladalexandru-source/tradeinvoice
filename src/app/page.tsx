import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-700">TradeInvoice</h1>
        <Link
          href="/auth/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Invoicing Made Simple
          <br />
          <span className="text-blue-600">for Tradespeople</span>
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Create and send professional invoices in under 60 seconds. Built for
          plumbers, electricians, builders, and contractors.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Get Started Free
        </Link>
        <p className="mt-4 text-gray-500">
          3 free invoices per month. No credit card required.
        </p>

        <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Create in 60 Seconds",
              desc: "Add client, line items, and send. No fuss, no complicated forms.",
            },
            {
              title: "Auto Payment Reminders",
              desc: "Automatic email reminders at 7 days, 3 days, and when overdue.",
            },
            {
              title: "Track Everything",
              desc: "See which invoices are sent, viewed, paid, or overdue at a glance.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
