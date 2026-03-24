import Link from "next/link";

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: 24 March 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. What Data We Collect
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Account information</strong> —
                Your email address used to sign in.
              </li>
              <li>
                <strong className="text-white">Business details</strong> — Your
                business name, address, VAT number, and other details you
                provide for invoices.
              </li>
              <li>
                <strong className="text-white">Invoice data</strong> — Client
                names, email addresses, invoice line items, amounts, and payment
                status.
              </li>
              <li>
                <strong className="text-white">Usage data</strong> — Basic
                analytics such as page views and feature usage to improve the
                service.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. How We Use Your Data
            </h2>
            <p>We use your data to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
              <li>Provide and operate the invoicing service.</li>
              <li>
                Send invoices and payment reminders to your clients on your
                behalf.
              </li>
              <li>Process subscription payments.</li>
              <li>Communicate with you about your account and service updates.</li>
              <li>Improve and develop the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. Third-Party Services
            </h2>
            <p className="mb-3">
              We share data with the following third-party providers, only as
              necessary to operate the service:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Stripe</strong> — Payment
                processing. Stripe handles your payment information securely. We
                do not store your credit card details.
              </li>
              <li>
                <strong className="text-white">Resend</strong> — Email delivery.
                Used to send magic link sign-in emails, invoices, and payment
                reminders.
              </li>
              <li>
                <strong className="text-white">Neon</strong> — Database storage.
                Your account and invoice data is stored securely in a
                Neon-hosted PostgreSQL database.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active. If you
              delete your account, we will delete your personal data and invoice
              records within 30 days. We may retain anonymised, aggregated data
              for analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Your Rights (GDPR)
            </h2>
            <p className="mb-3">
              If you are located in the European Economic Area, you have the
              following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Access</strong> — Request a copy
                of the personal data we hold about you.
              </li>
              <li>
                <strong className="text-white">Rectification</strong> — Request
                correction of inaccurate data.
              </li>
              <li>
                <strong className="text-white">Deletion</strong> — Request
                deletion of your account and all associated data.
              </li>
              <li>
                <strong className="text-white">Portability</strong> — Request an
                export of your data in a machine-readable format.
              </li>
              <li>
                <strong className="text-white">Objection</strong> — Object to
                processing of your data for certain purposes.
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:support@tradeinvoice.app"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                support@tradeinvoice.app
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Cookies
            </h2>
            <p>
              We use essential cookies only, required for authentication and
              session management. We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Security
            </h2>
            <p>
              We take reasonable measures to protect your data, including
              encryption in transit (TLS) and at rest. However, no method of
              electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. We will notify you of
              significant changes via email. Continued use of the service after
              changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Contact
            </h2>
            <p>
              For privacy-related questions, contact us at{" "}
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
