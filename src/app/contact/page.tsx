import Link from "next/link";

export default function ContactPage() {
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

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2 text-amber-400">Contact Us</h1>
        <p className="text-gray-400 mb-10">We are here to help.</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
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

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Response Time</h2>
            <p>
              We aim to respond within 24 hours on business days.
            </p>
          </section>

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
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

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
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

      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center mb-4">
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
