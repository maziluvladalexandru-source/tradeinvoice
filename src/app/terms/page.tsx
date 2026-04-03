import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - TradeInvoice",
  description:
    "Terms of Service for TradeInvoice. Read our terms covering subscriptions, usage, invoicing features, and your rights as a user.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <header className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-400 tracking-tight">
          TradeInvoice
        </Link>
        <Link
          href="/auth/login"
          className="bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-6 py-3 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20"
        >
          Sign In
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2 gradient-text bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">Terms of Service</h1>
        <p className="text-gray-400 mb-10">Last updated: 24 March 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
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

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Subscription Plans
            </h2>
            <p className="mb-3">
              We offer the following plans:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white">Free</strong>  -  Up to 20 invoices
                per month at no cost.
              </li>
              <li>
                <strong className="text-white">Pro</strong>  -  &euro;15 per month for
                unlimited invoices, priority email support, and all features.
              </li>
            </ul>
            <p className="mt-3">
              We reserve the right to change pricing with 30 days&apos; notice
              to existing subscribers.
            </p>
          </section>

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              3. Payment and Refund Policy
            </h2>
            <p className="mb-3">
              Pro subscriptions are billed monthly via Stripe. Payment is due at
              the start of each billing cycle. All payments are processed in
              euros (&euro;).
            </p>
            <p>
              You may cancel your subscription at any time, and you will retain
              access to Pro features until the end of your current billing
              period. Outside of the 14-day cooling-off period described below,
              no partial refunds will be issued for unused portions of a billing
              cycle.
            </p>
          </section>

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Right of Withdrawal (EU Cooling-Off Period)
            </h2>
            <p className="mb-3">
              Under EU consumer protection law, you have the right to withdraw
              from your Pro subscription within 14 days of purchase, without
              giving any reason. To exercise this right, contact us at{" "}
              <a
                href="mailto:support@tradeinvoice.app"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                support@tradeinvoice.app
              </a>
              . We will refund your payment within 14 days of receiving your
              withdrawal request.
            </p>
            <p className="mb-3">
              If you have actively used the Pro features during the 14-day
              period, we may deduct a proportional amount for the service
              already provided.
            </p>
            <p>
              After the 14-day cooling-off period, the standard cancellation
              policy applies: cancel anytime, retain access until the end of
              your billing period, no partial refunds.
            </p>
          </section>

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              5. User Responsibilities
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

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Data Handling
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

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              TradeInvoice is provided &quot;as is&quot; without warranties of
              any kind. We are not liable for any indirect, incidental, or
              consequential damages arising from your use of the service. Our
              total liability is limited to the amount you have paid us in the
              12 months preceding the claim.
            </p>
          </section>

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Termination
            </h2>
            <p>
              We may suspend or terminate your account if you violate these
              terms. You may delete your account at any time by contacting us.
              Upon termination, your data will be deleted in accordance with our
              Privacy Policy.
            </p>
          </section>

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Governing Law
            </h2>
            <p>
              These terms are governed by and construed in accordance with the
              laws of the Netherlands. Any disputes shall be subject to the
              exclusive jurisdiction of the courts of the Netherlands.
            </p>
          </section>

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              10. Contact
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

      <footer className="border-t border-gray-700/50 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center mb-4">
          <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-all duration-200">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-all duration-200">
            Privacy Policy
          </Link>
          <Link href="/dpa" className="text-gray-500 hover:text-gray-300 transition-all duration-200">
            DPA
          </Link>
          <Link href="/contact" className="text-gray-500 hover:text-gray-300 transition-all duration-200">
            Contact
          </Link>
        </div>
        &copy; {new Date().getFullYear()} TradeInvoice. Operated by Vlad Mazilu Alexandru, Netherlands.
      </footer>
    </div>
  );
}
