"use client";

import Link from "next/link";
import InvoiceCardActions from "./InvoiceCardActions";

interface Quote {
  id: string;
  invoiceNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  client: { name: string };
}

export default function DashboardQuoteList({
  quotes,
  totalQuoteCount,
  statusColors,
  statusDot,
  statusBorder,
}: {
  quotes: Quote[];
  totalQuoteCount: number;
  statusColors: Record<string, string>;
  statusDot: Record<string, string>;
  statusBorder: Record<string, string>;
}) {
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IE", { day: "numeric", month: "short" });

  const formatCurrency = (amount: number, currency: string = "EUR") =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(amount);

  if (quotes.length === 0) return null;

  return (
    <div className="bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-purple-500/20 mt-8 transition-all duration-300 shadow-lg shadow-black/10">
      <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          Recent Quotes
          <span className="bg-purple-500/15 text-purple-300 ring-1 ring-purple-400/30 px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums">
            {totalQuoteCount}
          </span>
        </h2>
      </div>
      <div className="divide-y divide-gray-700/30">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className={`group p-4 hover:bg-white/[0.03] transition-all duration-200 border-l-4 ${statusBorder[quote.status] || "border-l-gray-600"}`}
          >
            <Link
              href={`/invoices/${quote.id}`}
              className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white group-hover:text-amber-400 transition-colors duration-200">
                  {quote.invoiceNumber}
                </p>
                <p className="text-sm text-gray-400">
                  {quote.client.name}
                </p>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block font-medium">
                {fmtDate(quote.createdAt)}
              </p>
            </Link>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[quote.status] || ""}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[quote.status] || ""}`} />
                {quote.status}
              </span>
              <p className="text-base font-bold text-white text-right whitespace-nowrap tabular-nums">
                {formatCurrency(quote.total, quote.currency)}
              </p>
              <InvoiceCardActions invoiceId={quote.id} status={quote.status} type="quote" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
