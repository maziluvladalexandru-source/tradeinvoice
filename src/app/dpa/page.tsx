import Link from "next/link";

export default function DataProcessingAgreement() {
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
        <h1 className="text-3xl font-bold mb-2">Data Processing Agreement</h1>
        <p className="text-gray-500 mb-10">Last updated: 26 March 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Scope and Purpose
            </h2>
            <p>
              This Data Processing Agreement (&quot;DPA&quot;) forms part of the Terms of Service between
              TradeInvoice (the &quot;Processor&quot;) and the user (the &quot;Controller&quot;). TradeInvoice
              processes personal data on behalf of its users, who are the data controllers for the client
              data they enter into the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Data Processed
            </h2>
            <p className="mb-3">
              Users enter and manage the following categories of personal data through TradeInvoice:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Client names</li>
              <li>Client email addresses</li>
              <li>Client phone numbers</li>
              <li>Client postal addresses</li>
              <li>Invoice details (descriptions, amounts, dates)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. Purpose of Processing
            </h2>
            <p>
              Processing is limited to providing the invoicing service as described in the Terms of Service.
              This includes storing client data, generating invoices, sending invoices and payment reminders
              via email, and tracking payment status. TradeInvoice does not process personal data for any
              other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Sub-processors
            </h2>
            <p className="mb-4">
              TradeInvoice uses the following sub-processors to deliver the service. The Controller authorises
              the use of these sub-processors:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Vercel Inc.</strong> (USA) - Application hosting and deployment.
              </li>
              <li>
                <strong className="text-white">Neon Inc.</strong> (USA) - PostgreSQL database hosting (EU region).
              </li>
              <li>
                <strong className="text-white">Stripe Inc.</strong> (USA) - Payment processing.
              </li>
              <li>
                <strong className="text-white">Resend Inc.</strong> (USA) - Transactional email delivery.
              </li>
              <li>
                <strong className="text-white">Cloudflare Inc.</strong> (USA) - CAPTCHA and bot protection.
              </li>
            </ul>
            <p className="mt-3">
              We will notify users of any changes to our sub-processors. Each sub-processor is bound by
              data processing agreements that provide at least the same level of protection as this DPA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Data Security Measures
            </h2>
            <p className="mb-3">
              TradeInvoice implements appropriate technical and organisational measures to protect personal data, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Encryption in transit (TLS) for all data transfers</li>
              <li>Encryption at rest for database storage</li>
              <li>Rate limiting and CAPTCHA protection against abuse</li>
              <li>Input sanitisation to prevent injection attacks</li>
              <li>OWASP-recommended security headers</li>
              <li>Secure session management with automatic expiration</li>
              <li>Access control ensuring users can only access their own data</li>
              <li>Security event logging for audit and incident response</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Data Breach Notification
            </h2>
            <p>
              In the event of a personal data breach, TradeInvoice will notify affected users without undue
              delay and no later than 72 hours after becoming aware of the breach, in accordance with
              Article 33 of the GDPR. The notification will include the nature of the breach, the categories
              and approximate number of data subjects affected, and the measures taken to address it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Data Deletion
            </h2>
            <p>
              Upon account termination or deletion, TradeInvoice will delete all personal data associated
              with the user within 30 days, except where retention is required by law (e.g., Dutch fiscal
              law requires invoice records to be retained for 7 years). Users can request account deletion
              at any time through the Settings page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Data Subject Rights
            </h2>
            <p>
              TradeInvoice will assist the Controller in fulfilling data subject requests (access,
              rectification, erasure, portability, restriction, and objection) by providing self-service
              tools in the application (data export, account editing, account deletion) and by responding
              to requests sent to{" "}
              <a
                href="mailto:support@tradeinvoice.app"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                support@tradeinvoice.app
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. International Transfers
            </h2>
            <p>
              Where personal data is transferred outside the European Economic Area, such transfers are
              protected by the EU-US Data Privacy Framework and Standard Contractual Clauses (SCCs) as
              approved by the European Commission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              10. Contact
            </h2>
            <p>
              For questions about this DPA, contact us at{" "}
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
