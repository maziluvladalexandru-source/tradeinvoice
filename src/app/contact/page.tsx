import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
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

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-10">We are here to help.</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-3">Email</h2>
            <p>
              For general inquiries, support, or feedback:{" "}
              <a
                href="mailto:support@tradeinvoice.app"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                support@tradeinvoice.app
              </a>
            </p>
          </section>

          <section className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-3">Response Time</h2>
            <p>
              We aim to respond within 24 hours on business days.
            </p>
          </section>

          <section className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-3">Data Protection</h2>
            <p>
              For data protection inquiries, including requests to access, correct, or delete your personal data,
              see our{" "}
              <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline">
                Privacy Policy
              </Link>
              . You can also email us directly at{" "}
              <a
                href="mailto:support@tradeinvoice.app"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                support@tradeinvoice.app
              </a>
              .
            </p>
          </section>

          <section className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-3">Security</h2>
            <p>
              If you have found a security vulnerability, please email{" "}
              <a
                href="mailto:support@tradeinvoice.app?subject=Security"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                support@tradeinvoice.app
              </a>{" "}
              with the subject line &quot;Security&quot;. We take all security reports seriously and will respond promptly.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} TradeInvoice. All rights reserved.
      </footer>
    </div>
  );
}
