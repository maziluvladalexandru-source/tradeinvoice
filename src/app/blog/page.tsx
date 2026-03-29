import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "./articles";

export const metadata: Metadata = {
  title: "Blog - TradeInvoice | Invoicing Tips for Dutch Tradespeople",
  description:
    "Practical guides on invoicing, BTW/VAT, payment collection, and business tips for ZZP'ers and tradespeople in the Netherlands.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog - TradeInvoice",
    description:
      "Practical guides on invoicing, BTW/VAT, payment collection, and business tips for ZZP'ers and tradespeople in the Netherlands.",
    type: "website",
    siteName: "TradeInvoice",
  },
};

export default function BlogIndex() {
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

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-amber-400">Blog</h1>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl">
          Practical guides on invoicing, BTW, payments, and running your trade
          business in the Netherlands.
        </p>

        {/* Free template banner */}
        <Link
          href="/templates"
          className="block mb-12 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-amber-400 font-semibold mb-1">Free Resource</div>
              <div className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                Free Invoice Template for Tradespeople
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Download our professional template or create your own invoice online in 60 seconds.
              </div>
            </div>
            <div className="text-amber-400 text-2xl flex-shrink-0 ml-4">&rarr;</div>
          </div>
        </Link>

        <div className="space-y-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block group bg-[#111827] border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-amber-500/30 hover:bg-[#111827]/80 transition-all duration-200"
            >
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-white group-hover:text-amber-400 transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-400 leading-relaxed">{article.excerpt}</p>
            </Link>
          ))}
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
