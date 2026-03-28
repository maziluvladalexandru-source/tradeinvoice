"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
}

interface BulkInvoiceActionsProps {
  invoices: Invoice[];
  children: (props: {
    selectedIds: Set<string>;
    toggleSelect: (id: string) => void;
    toggleAll: () => void;
    allSelected: boolean;
  }) => React.ReactNode;
}

export default function BulkInvoiceActions({
  invoices,
  children,
}: BulkInvoiceActionsProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === invoices.length) return new Set();
      return new Set(invoices.map((i) => i.id));
    });
  }, [invoices]);

  const clearSelection = () => setSelectedIds(new Set());

  async function bulkAction(action: string) {
    setLoading(action);
    try {
      const res = await fetch("/api/invoices/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, invoiceIds: Array.from(selectedIds) }),
      });
      if (res.ok) {
        setSelectedIds(new Set());
        router.refresh();
      }
    } catch {
      // silent fail
    }
    setLoading(null);
    setShowDeleteConfirm(false);
  }

  function handleDownloadPdfs() {
    selectedIds.forEach((id) => {
      window.open(`/api/invoices/${id}/pdf`, "_blank");
    });
  }

  const count = selectedIds.size;
  const allSelected = invoices.length > 0 && selectedIds.size === invoices.length;

  return (
    <>
      {children({ selectedIds, toggleSelect, toggleAll, allSelected })}

      {/* Floating bulk action bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          count > 0
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 pb-4 md:pb-6">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 px-4 py-3 flex items-center gap-3 flex-wrap">
            {/* Count + deselect */}
            <div className="flex items-center gap-2 mr-auto">
              <span className="text-sm font-semibold text-white">
                {count} invoice{count !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={clearSelection}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                title="Deselect all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mark as Paid */}
            <button
              onClick={() => bulkAction("mark-paid")}
              disabled={loading === "mark-paid"}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading === "mark-paid" ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              Mark as Paid
            </button>

            {/* Send Reminders */}
            <button
              onClick={() => bulkAction("send-reminders")}
              disabled={loading === "send-reminders"}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading === "send-reminders" ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
              Send Reminders
            </button>

            {/* Download PDFs */}
            <button
              onClick={handleDownloadPdfs}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDFs
            </button>

            {/* Delete */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading === "delete"}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading === "delete" ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Delete invoices?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete {count} invoice{count !== 1 ? "s" : ""}? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => bulkAction("delete")}
                disabled={loading === "delete"}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading === "delete" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
