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
        <p className="text-gray-500 mb-10">Last updated: 26 March 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          {/* 1. Data Controller */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Data Controller
            </h2>
            <p>
              The controller responsible for the processing of your personal data is:
            </p>
            <ul className="list-none space-y-1 ml-2 mt-3">
              <li><strong className="text-white">Name:</strong> TradeInvoice (operated by Vlad Mazilu Alexandru)</li>
              <li><strong className="text-white">Address:</strong> Veen, Netherlands</li>
              <li>
                <strong className="text-white">Email:</strong>{" "}
                <a href="mailto:support@tradeinvoice.app" className="text-amber-400 hover:text-amber-300 underline">
                  support@tradeinvoice.app
                </a>
              </li>
            </ul>
          </section>

          {/* 2. Data We Collect and Legal Basis */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Data We Collect and Legal Basis
            </h2>
            <p className="mb-4">
              Under Article 6 of the GDPR, we process personal data based on the following legal grounds:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Account registration (email, name)</p>
                <p className="text-sm text-gray-400">Legal basis: Art. 6(1)(b) - necessary for the performance of the contract (providing the invoicing service).</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Business details (company name, address, KVK number, BTW/VAT number)</p>
                <p className="text-sm text-gray-400">Legal basis: Art. 6(1)(b) - necessary for the performance of the contract (generating invoices with your business information).</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Invoice data (client names, emails, addresses, line items, amounts)</p>
                <p className="text-sm text-gray-400">Legal basis: Art. 6(1)(b) - necessary for the performance of the contract (creating and sending invoices).</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Payment processing (email, subscription status)</p>
                <p className="text-sm text-gray-400">Legal basis: Art. 6(1)(b) - necessary for the performance of the contract (managing your subscription).</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Email notifications (invoice delivery, payment reminders)</p>
                <p className="text-sm text-gray-400">Legal basis: Art. 6(1)(b) - necessary for the performance of the contract (delivering invoices and reminders on your behalf).</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Security logging (IP addresses, login attempts, security events)</p>
                <p className="text-sm text-gray-400">Legal basis: Art. 6(1)(f) - legitimate interest in maintaining the security of our service and protecting user accounts.</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Session cookie</p>
                <p className="text-sm text-gray-400">Legal basis: Art. 6(1)(b) - strictly necessary for authentication and keeping you logged in.</p>
              </div>
            </div>
          </section>

          {/* 3. Third-Party Processors */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. Third-Party Processors
            </h2>
            <p className="mb-4">
              We share personal data with the following third-party processors, solely to operate the service:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Vercel Inc. (USA)</p>
                <p className="text-sm text-gray-400">Purpose: Hosting and deployment of the application.</p>
                <p className="text-sm text-gray-400">Data processed: All application data transmitted through the platform.</p>
                <p className="text-sm text-gray-400">EU data region available.</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Neon Inc. (USA)</p>
                <p className="text-sm text-gray-400">Purpose: PostgreSQL database hosting.</p>
                <p className="text-sm text-gray-400">Data processed: All stored user data, invoice data, and client data.</p>
                <p className="text-sm text-gray-400">Database hosted in EU region (eu-west-2).</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Stripe Inc. (USA)</p>
                <p className="text-sm text-gray-400">Purpose: Subscription payment processing.</p>
                <p className="text-sm text-gray-400">Data processed: Email address, subscription status. We do not store credit card details.</p>
                <p className="text-sm text-gray-400">PCI DSS compliant. Certified under the EU-US Data Privacy Framework.</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Resend Inc. (USA)</p>
                <p className="text-sm text-gray-400">Purpose: Transactional email delivery (magic links, invoices, reminders).</p>
                <p className="text-sm text-gray-400">Data processed: Email addresses, invoice details included in emails.</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white font-medium mb-1">Cloudflare Inc. (USA)</p>
                <p className="text-sm text-gray-400">Purpose: CAPTCHA and bot protection (Cloudflare Turnstile).</p>
                <p className="text-sm text-gray-400">Data processed: IP address, browser information.</p>
                <p className="text-sm text-gray-400">Certified under the EU-US Data Privacy Framework.</p>
              </div>
            </div>
          </section>

          {/* 4. International Data Transfers */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. International Data Transfers
            </h2>
            <p>
              Some of our third-party processors are based in the United States. Transfers of personal data
              to these processors are protected under the EU-US Data Privacy Framework and, where applicable,
              Standard Contractual Clauses (SCCs) approved by the European Commission. We ensure that all
              international transfers provide an adequate level of data protection as required by the GDPR.
            </p>
          </section>

          {/* 5. Data Retention */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Data Retention
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Active accounts:</strong> Your data is retained for as long as your account remains active.
              </li>
              <li>
                <strong className="text-white">Deleted accounts:</strong> Upon account deletion, your personal data is deleted within 30 days.
              </li>
              <li>
                <strong className="text-white">Invoice records:</strong> Invoice data may be retained for up to 7 years as required by Dutch fiscal law (Belastingdienst).
              </li>
              <li>
                <strong className="text-white">Security logs:</strong> Retained for 12 months, then automatically deleted.
              </li>
              <li>
                <strong className="text-white">Session data:</strong> Deleted on logout or after 90 days of inactivity.
              </li>
            </ul>
          </section>

          {/* 6. Your Rights */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Your Rights Under GDPR (Articles 15-22)
            </h2>
            <p className="mb-4">
              As a data subject, you have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-3 ml-2">
              <li>
                <strong className="text-white">Right of access (Art. 15)</strong> - You can export a copy of all your personal data from the Settings page.
              </li>
              <li>
                <strong className="text-white">Right to rectification (Art. 16)</strong> - You can edit your personal and business details at any time in Settings.
              </li>
              <li>
                <strong className="text-white">Right to erasure (Art. 17)</strong> - You can delete your account and all associated data from Settings.
              </li>
              <li>
                <strong className="text-white">Right to restriction of processing (Art. 18)</strong> - Contact us at{" "}
                <a href="mailto:support@tradeinvoice.app" className="text-amber-400 hover:text-amber-300 underline">
                  support@tradeinvoice.app
                </a>{" "}
                to request restriction of processing.
              </li>
              <li>
                <strong className="text-white">Right to data portability (Art. 20)</strong> - You can export all your data as a machine-readable JSON file from Settings.
              </li>
              <li>
                <strong className="text-white">Right to object (Art. 21)</strong> - Contact us at{" "}
                <a href="mailto:support@tradeinvoice.app" className="text-amber-400 hover:text-amber-300 underline">
                  support@tradeinvoice.app
                </a>{" "}
                to object to any processing based on legitimate interest.
              </li>
            </ul>
            <p className="mt-4">
              We will respond to all data subject requests within 30 days as required by the GDPR.
            </p>
          </section>

          {/* 7. Right to Lodge a Complaint */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Right to Lodge a Complaint
            </h2>
            <p>
              If you believe that our processing of your personal data infringes the GDPR, you have the
              right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).
              You can reach them at{" "}
              <a
                href="https://autoriteitpersoonsgegevens.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                autoriteitpersoonsgegevens.nl
              </a>
              .
            </p>
          </section>

          {/* 8. Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Cookies
            </h2>
            <p className="mb-3">
              We use one strictly necessary session cookie for authentication. This cookie keeps you logged
              in and is essential for the service to function. It does not track you across websites.
            </p>
            <p className="mb-3">
              We do not use analytics cookies. We do not use tracking cookies. We do not use advertising cookies.
            </p>
            <p>
              Stripe may load scripts on pages where payment functionality is used, solely for the purpose
              of processing payments securely.
            </p>
          </section>

          {/* 9. Security */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Security
            </h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data.
              These include encryption in transit (TLS), rate limiting, CAPTCHA protection, input sanitisation,
              OWASP-recommended security headers, and secure session management. While no method of electronic
              storage is entirely secure, we take reasonable steps to protect your data against unauthorised
              access, alteration, or destruction.
            </p>
          </section>

          {/* 10. Children */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              10. Children
            </h2>
            <p>
              TradeInvoice is not intended for use by children under 16 years of age. We do not knowingly
              collect personal data from children. If you believe a child has provided us with personal data,
              please contact us at{" "}
              <a href="mailto:support@tradeinvoice.app" className="text-amber-400 hover:text-amber-300 underline">
                support@tradeinvoice.app
              </a>{" "}
              and we will delete it promptly.
            </p>
          </section>

          {/* 11. Changes to This Policy */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of significant changes
              via email. Continued use of the service after changes constitutes acceptance of the updated policy.
              The &quot;Last updated&quot; date at the top of this page indicates when the policy was last revised.
            </p>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              12. Contact
            </h2>
            <p>
              For any questions about this privacy policy or your personal data, contact us at{" "}
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
