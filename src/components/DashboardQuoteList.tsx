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
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 mt-8">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          Recent Quotes
          <span className="bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/40 px-2 py-0.5 rounded-full text-xs font-semibold">
            {totalQuoteCount}
          </span>
        </h2>
      </div>
      <div className="divide-y divide-white/10">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className={`p-4 hover:bg-white/5 transition-colors border-l-4 ${statusBorder[quote.status] || "border-l-gray-600"}`}
          >
            <Link
              href={`/invoices/${quote.id}`}
              className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">
                  {quote.invoiceNumber}
                </p>
                <p className="text-sm text-gray-400">
                  {quote.client.name}
                </p>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                {fmtDate(quote.createdAt)}
              </p>
            </Link>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[quote.status] || ""}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[quote.status] || ""}`} />
                {quote.status}
              </span>
              <p className="text-base font-bold text-white text-right whitespace-nowrap">
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
