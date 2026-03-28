import Link from "next/link";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-amber-500"
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
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Blog
            </Link>
            <Link
              href="/auth/login"
              className="bg-amber-500 text-gray-900 px-5 py-2 rounded-xl font-semibold text-sm hover:bg-amber-400 transition-colors"
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
