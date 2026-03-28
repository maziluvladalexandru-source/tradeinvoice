import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "./articles";

export const metadata: Metadata = {
  title: "Blog - TradeInvoice | Invoicing Tips for Dutch Tradespeople",
  description:
    "Practical guides on invoicing, BTW/VAT, payment collection, and business tips for ZZP'ers and tradespeople in the Netherlands.",
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
        <p className="text-lg text-gray-400 mb-12 max-w-2xl">
          Practical guides on invoicing, BTW, payments, and running your trade
          business in the Netherlands.
        </p>

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
