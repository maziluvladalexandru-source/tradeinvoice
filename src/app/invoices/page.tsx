"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { formatCurrency } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  type: string;
  total: number;
  currency: string;
  paidAmount: number;
  dueDate: string;
  createdAt: string;
  isRecurring: boolean;
  client: { name: string };
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/15 text-gray-300 ring-1 ring-gray-500/30",
  sent: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
  viewed: "bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-500/30",
  paid: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  overdue: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
};

const statusDot: Record<string, string> = {
  draft: "bg-gray-400",
  sent: "bg-blue-400",
  viewed: "bg-yellow-400",
  paid: "bg-emerald-400",
  overdue: "bg-red-400 animate-pulse",
};

const statusBorder: Record<string, string> = {
  draft: "border-l-gray-600",
  sent: "border-l-blue-500",
  viewed: "border-l-yellow-500",
  paid: "border-l-emerald-500",
  overdue: "border-l-red-500",
};

type SortField = "date" | "amount" | "status";
type SortDir = "asc" | "desc";

const statusOrder: Record<string, number> = { draft: 0, sent: 1, viewed: 2, overdue: 3, paid: 4 };

export default function InvoicesListPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInvoices(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = invoices;

    if (statusFilter !== "all") {
      list = list.filter((i) => i.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.client.name.toLowerCase().includes(q)
      );
    }

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === "amount") {
        cmp = a.total - b.total;
      } else if (sortField === "status") {
        cmp = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return list;
  }, [invoices, statusFilter, search, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  async function handleDuplicate(id: string) {
    setDuplicating(id);
    try {
      const res = await fetch(`/api/invoices/${id}/duplicate`, { method: "POST" });
      if (res.ok) {
        const newInv = await res.json();
        router.push(`/invoices/${newInv.id}`);
      }
    } catch {
      // ignore
    } finally {
      setDuplicating(null);
    }
  }

  async function handleMarkPaid(id: string) {
    setMarkingPaid(id);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", paidAt: new Date().toISOString() }),
      });
      if (res.ok) {
        setInvoices((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: "paid" } : i))
        );
      }
    } catch {
      // ignore
    } finally {
      setMarkingPaid(null);
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return (
      <svg className="w-3.5 h-3.5 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDir === "desc" ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Invoice
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by invoice number or client name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white placeholder-gray-500 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white transition-all"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="viewed">Viewed</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Sort buttons */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => toggleSort("date")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sortField === "date" ? "bg-amber-500/15 text-amber-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
            Date <SortIcon field="date" />
          </button>
          <button onClick={() => toggleSort("amount")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sortField === "amount" ? "bg-amber-500/15 text-amber-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
            Amount <SortIcon field="amount" />
          </button>
          <button onClick={() => toggleSort("status")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sortField === "status" ? "bg-amber-500/15 text-amber-400" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
            Status <SortIcon field="status" />
          </button>
          <span className="ml-auto text-xs text-gray-500 self-center">
            {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Invoice list */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 mt-4 text-sm">Loading invoices...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm">
                {invoices.length === 0
                  ? "No invoices yet. Create your first invoice to get started."
                  : "No invoices match your search."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/50">
              {filtered.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`p-4 hover:bg-gray-800/30 transition-colors border-l-4 ${statusBorder[invoice.status] || "border-l-gray-600"}`}
                >
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{invoice.invoiceNumber}</p>
                          {invoice.isRecurring && (
                            <span className="bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40 px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase hidden sm:inline">
                              Recurring
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{invoice.client.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 hidden sm:block whitespace-nowrap">
                        Due {fmtDate(invoice.dueDate)}
                      </p>
                    </Link>

                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${statusColors[invoice.status] || ""}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[invoice.status] || ""}`} />
                      {invoice.status}
                    </span>

                    <div className="text-right whitespace-nowrap min-w-[80px]">
                      <p className="text-base font-bold text-white">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </p>
                      {invoice.paidAmount > 0 && invoice.paidAmount < invoice.total && (
                        <p className="text-xs text-amber-400">
                          Due: {formatCurrency(invoice.total - invoice.paidAmount, invoice.currency)}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-2">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                        title="View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </Link>
                      <a
                        href={`/api/invoices/${invoice.id}/pdf`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                        title="Download PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </a>
                      {invoice.status !== "paid" && (
                        <button
                          onClick={() => handleMarkPaid(invoice.id)}
                          disabled={markingPaid === invoice.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-gray-800/50 transition-colors disabled:opacity-50"
                          title="Mark as paid"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDuplicate(invoice.id)}
                        disabled={duplicating === invoice.id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-gray-800/50 transition-colors disabled:opacity-50"
                        title="Duplicate"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.5a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
