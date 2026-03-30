import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact - TradeInvoice",
  description:
    "Get in touch with TradeInvoice. Questions about invoicing, your account, or features? We respond within 24 hours on business days.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white premium-glow">
      <header className="border-b border-gray-700/30 bg-[#0a0f1e]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300 transition-colors">
            TradeInvoice
          </Link>
          <Link
            href="/auth/login"
            className="bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-6 py-2.5 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] text-sm"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16 animate-fade-in">
        <div className="mb-12">
          <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Get in Touch
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Contact Us</h1>
          <p className="text-gray-400 text-lg">We are here to help.</p>
        </div>

        <div className="space-y-6">
          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-200 group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Email</h2>
                <p className="text-gray-300">
                  For general inquiries, support, or feedback:{" "}
                  <a
                    href="mailto:support@tradeinvoice.app"
                    className="text-amber-400 hover:text-amber-300 underline transition-colors"
                  >
                    support@tradeinvoice.app
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-200 group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Response Time</h2>
                <p className="text-gray-300">
                  We aim to respond within 24 hours on business days.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-200 group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Data Protection</h2>
                <p className="text-gray-300">
                  For data protection inquiries, including requests to access, correct, or delete your personal data,
                  see our{" "}
                  <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline transition-colors">
                    Privacy Policy
                  </Link>
                  . You can also email us directly at{" "}
                  <a
                    href="mailto:support@tradeinvoice.app"
                    className="text-amber-400 hover:text-amber-300 underline transition-colors"
                  >
                    support@tradeinvoice.app
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-200 group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Security</h2>
                <p className="text-gray-300">
                  If you have found a security vulnerability, please email{" "}
                  <a
                    href="mailto:support@tradeinvoice.app?subject=Security"
                    className="text-amber-400 hover:text-amber-300 underline transition-colors"
                  >
                    support@tradeinvoice.app
                  </a>{" "}
                  with the subject line &quot;Security&quot;. We take all security reports seriously and will respond promptly.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-700/30 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center mb-4">
          <Link href="/terms" className="text-gray-500 hover:text-amber-400 transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-gray-500 hover:text-amber-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/dpa" className="text-gray-500 hover:text-amber-400 transition-colors">
            DPA
          </Link>
          <Link href="/contact" className="text-gray-500 hover:text-amber-400 transition-colors">
            Contact
          </Link>
        </div>
        &copy; {new Date().getFullYear()} TradeInvoice. Operated by Vlad Mazilu Alexandru, Netherlands.
      </footer>
    </div>
  );
}
