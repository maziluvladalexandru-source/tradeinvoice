"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  invoiceId: string;
  status: string;
  type?: string;
}

export default function InvoiceCardActions({ invoiceId, status, type }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSend() {
    setLoading("send");
    try {
      await fetch(`/api/invoices/${invoiceId}/send`, { method: "POST" });
      router.refresh();
    } catch {
      // silent fail
    }
    setLoading(null);
  }

  async function handleMarkPaid() {
    setLoading("paid");
    try {
      await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", paidAt: new Date().toISOString() }),
      });
      router.refresh();
    } catch {
      // silent fail
    }
    setLoading(null);
  }

  async function handleDuplicate() {
    setLoading("dup");
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.id) {
        router.push(`/invoices/${data.id}`);
      } else {
        router.refresh();
      }
    } catch {
      // silent fail
    }
    setLoading(null);
  }

  async function handleConvert() {
    setLoading("convert");
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/convert`, { method: "POST" });
      const data = await res.json();
      if (data.id) {
        router.push(`/invoices/${data.id}`);
      } else if (res.status === 409 && data.invoiceId) {
        router.push(`/invoices/${data.invoiceId}`);
      } else {
        router.refresh();
      }
    } catch {
      // silent fail
    }
    setLoading(null);
  }

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
      {type === "quote" && (
        <button
          onClick={handleConvert}
          disabled={loading === "convert"}
          className="p-1.5 rounded-md text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-colors disabled:opacity-50"
          title="Convert to Invoice"
          aria-label="Convert to invoice"
        >
          {loading === "convert" ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </button>
      )}
      {status === "draft" && type !== "quote" && (
        <button
          onClick={handleSend}
          disabled={loading === "send"}
          className="p-1.5 rounded-md text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors disabled:opacity-50"
          title="Send"
          aria-label="Send invoice"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      )}
      {status !== "paid" && type !== "quote" && (
        <button
          onClick={handleMarkPaid}
          disabled={loading === "paid"}
          className="p-1.5 rounded-md text-green-400 hover:bg-green-500/20 hover:text-green-300 transition-colors disabled:opacity-50"
          title="Mark Paid"
          aria-label="Mark as paid"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      )}
      <button
        onClick={handleDuplicate}
        disabled={loading === "dup"}
        className="p-1.5 rounded-md text-gray-400 hover:bg-gray-600/40 hover:text-gray-300 transition-colors disabled:opacity-50"
        title="Duplicate"
        aria-label="Duplicate invoice"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
}
