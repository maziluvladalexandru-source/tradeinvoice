import Link from "next/link";

export default function TermsOfService() {
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
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-10">Last updated: 24 March 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Services
            </h2>
            <p>
              TradeInvoice provides an online invoicing platform designed for
              tradespeople and small businesses. Our service allows you to
              create, send, and track invoices, as well as send automated
              payment reminders to your clients.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Subscription Plans
            </h2>
            <p className="mb-3">
              We offer the following plans:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Free</strong> — Up to 20 invoices
                per month at no cost.
              </li>
              <li>
                <strong className="text-white">Pro</strong> — €15 per month for
                unlimited invoices, priority support, and all features.
              </li>
            </ul>
            <p className="mt-3">
              We reserve the right to change pricing with 30 days&apos; notice
              to existing subscribers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. Payment and Refund Policy
            </h2>
            <p className="mb-3">
              Pro subscriptions are billed monthly via Stripe. Payment is due at
              the start of each billing cycle. All payments are processed in
              euros (€).
            </p>
            <p>
              Monthly subscription fees are non-refundable. You may cancel your
              subscription at any time, and you will retain access to Pro
              features until the end of your current billing period. No partial
              refunds will be issued for unused portions of a billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. User Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                You are responsible for the accuracy of the information you
                enter, including client details and invoice amounts.
              </li>
              <li>
                You must not use the service for any unlawful purpose or to send
                fraudulent invoices.
              </li>
              <li>
                You are responsible for maintaining the security of your account
                and email address used for sign-in.
              </li>
              <li>
                You must comply with all applicable tax and invoicing laws in
                your jurisdiction.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Data Handling
            </h2>
            <p>
              We store your data securely and use it solely to provide and
              improve the service. For full details on how we collect, use, and
              protect your data, please see our{" "}
              <Link
                href="/privacy"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Limitation of Liability
            </h2>
            <p>
              TradeInvoice is provided &quot;as is&quot; without warranties of
              any kind. We are not liable for any indirect, incidental, or
              consequential damages arising from your use of the service. Our
              total liability is limited to the amount you have paid us in the
              12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Termination
            </h2>
            <p>
              We may suspend or terminate your account if you violate these
              terms. You may delete your account at any time by contacting us.
              Upon termination, your data will be deleted in accordance with our
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Governing Law
            </h2>
            <p>
              These terms are governed by and construed in accordance with the
              laws of the Netherlands. Any disputes shall be subject to the
              exclusive jurisdiction of the courts of the Netherlands.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Contact
            </h2>
            <p>
              If you have questions about these terms, contact us at{" "}
              <a
                href="mailto:support@tradeinvoice.app"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                support@tradeinvoice.app
              </a>
              .
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
