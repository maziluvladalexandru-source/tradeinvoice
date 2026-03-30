import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Invoicing Tips for Dutch Tradespeople | TradeInvoice",
  description:
    "Practical guides on invoicing, BTW/VAT, payment collection, and business tips for ZZP'ers and tradespeople in the Netherlands.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog - TradeInvoice",
    description:
      "Practical guides on invoicing, BTW/VAT, payment collection, and business tips for ZZP'ers and tradespeople in the Netherlands.",
    url: "https://tradeinvoice.app/blog",
    type: "website",
    siteName: "TradeInvoice",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - TradeInvoice",
    description:
      "Practical guides on invoicing, BTW/VAT, payment collection, and business tips for ZZP'ers and tradespeople in the Netherlands.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <header className="border-b border-gray-700/30 bg-[#0a0f1e]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M12 2L2 12l10 10 10-10L12 2z"
                fill="currentColor"
                opacity="0.2"
              />
              <path
                d="M12 2L2 12l10 10 10-10L12 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M8 11h8M8 14h5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            TradeInvoice
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/blog"
              className="text-gray-400 hover:text-amber-400 transition-colors text-sm font-medium"
            >
              Blog
            </Link>
            <Link
              href="/auth/login"
              className="bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-5 py-2 rounded-xl font-semibold text-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02]"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
