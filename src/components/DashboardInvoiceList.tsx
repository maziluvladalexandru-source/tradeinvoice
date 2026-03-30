"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import BulkInvoiceActions from "@/components/BulkInvoiceActions";
import InvoiceCardActions from "@/components/InvoiceCardActions";

interface SerializedInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  type: string;
  total: number;
  currency: string;
  paidAmount: number;
  dueDate: string;
  isRecurring: boolean;
  scheduledSendAt: string | null;
  client: { name: string };
}

interface DashboardInvoiceListProps {
  recentInvoices: SerializedInvoice[];
  totalInvoiceCount: number;
  statusColors: Record<string, string>;
  statusDot: Record<string, string>;
  statusBorder: Record<string, string>;
}

export default function DashboardInvoiceList({
  recentInvoices,
  totalInvoiceCount,
  statusColors,
  statusDot,
  statusBorder,
}: DashboardInvoiceListProps) {
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IE", { day: "numeric", month: "short" });
  return (
    <BulkInvoiceActions invoices={recentInvoices.map((i) => ({ id: i.id, invoiceNumber: i.invoiceNumber, status: i.status }))}>
      {({ selectedIds, toggleSelect, toggleAll, allSelected }) => (
        <div className="bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-amber-500/20 transition-all duration-300 shadow-lg shadow-black/10">
          <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {recentInvoices.length > 0 && (
                <label className="flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-700/50 bg-[#111827] text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0 cursor-pointer transition-colors duration-200"
                  />
                </label>
              )}
              <h2 className="text-xl font-semibold text-white">
                Recent Invoices
              </h2>
            </div>
            {totalInvoiceCount > 5 && (
              <Link
                href="/invoices"
                className="text-amber-500 hover:text-amber-400 font-medium text-sm transition-colors duration-200"
              >
                View all
              </Link>
            )}
          </div>

          {recentInvoices.length === 0 ? (
            <div className="p-16 text-center animate-fade-in">
              <div className="w-40 h-40 mx-auto mb-8">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect x="50" y="30" width="100" height="130" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2" />
                  <rect x="50" y="30" width="100" height="130" rx="8" fill="url(#emptyGrad)" opacity="0.5" />
                  <path d="M120 30 L150 30 L150 60 Z" fill="#111827" stroke="#374151" strokeWidth="1" />
                  <path d="M120 30 L120 55 C120 57.7614 122.239 60 125 60 L150 60" fill="#1f2937" stroke="#374151" strokeWidth="2" />
                  <rect x="68" y="75" width="64" height="6" rx="3" fill="#374151" />
                  <rect x="68" y="90" width="48" height="6" rx="3" fill="#374151" />
                  <rect x="68" y="105" width="56" height="6" rx="3" fill="#374151" />
                  <rect x="68" y="120" width="36" height="6" rx="3" fill="#374151" />
                  <circle cx="140" cy="145" r="24" fill="#f59e0b" opacity="0.15" />
                  <circle cx="140" cy="145" r="18" fill="#f59e0b" opacity="0.25" />
                  <path d="M140 137 L140 153 M132 145 L148 145" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="emptyGrad" x1="100" y1="30" x2="100" y2="160">
                      <stop stopColor="#f59e0b" stopOpacity="0.05" />
                      <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No invoices yet</h3>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                Create your first invoice to start tracking payments and getting paid faster.
              </p>
              <Link
                href="/invoices/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-8 py-3.5 rounded-xl font-semibold text-lg shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.02] btn-press"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Invoice
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-700/30">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`group p-4 hover:bg-white/[0.03] transition-all duration-200 border-l-4 ${statusBorder[invoice.status] || "border-l-gray-600"} ${selectedIds.has(invoice.id) ? "bg-amber-500/5" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <label className="flex items-center cursor-pointer shrink-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(invoice.id)}
                        onChange={() => toggleSelect(invoice.id)}
                        className="w-4 h-4 rounded border-gray-700/50 bg-[#111827] text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0 cursor-pointer transition-colors duration-200"
                      />
                    </label>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white group-hover:text-amber-400 transition-colors duration-200">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="text-sm text-gray-400">
                          {invoice.client.name}
                        </p>
                      </div>
                      {invoice.isRecurring && (
                        <span className="bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase hidden sm:inline-flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Recurring
                        </span>
                      )}
                      {invoice.scheduledSendAt && invoice.status === "draft" && (
                        <span className="bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase hidden sm:inline-flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Scheduled
                        </span>
                      )}
                      <p className="text-xs text-gray-500 hidden sm:block font-medium">
                        Due {fmtDate(invoice.dueDate)}
                      </p>
                    </Link>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[invoice.status] || ""}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[invoice.status] || ""}`} />
                      {invoice.status}
                      {invoice.status === "viewed" && (
                        <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </span>
                    <div className="text-right whitespace-nowrap">
                      <p className="text-base font-bold text-white tabular-nums">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </p>
                      {invoice.paidAmount > 0 && invoice.paidAmount < invoice.total && (
                        <p className="text-xs text-amber-400 tabular-nums font-medium">
                          Due: {formatCurrency(invoice.total - invoice.paidAmount, invoice.currency)}
                        </p>
                      )}
                    </div>
                    <InvoiceCardActions invoiceId={invoice.id} status={invoice.status} type={invoice.type} />
                    <a
                      href={`/api/invoices/${invoice.id}/pdf`}
                      target="_blank"
                      className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-gray-700/50 transition-all duration-200"
                      title="Download PDF"
                      aria-label="Download PDF"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </BulkInvoiceActions>
  );
}
