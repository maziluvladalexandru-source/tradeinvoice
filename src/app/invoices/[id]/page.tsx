"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Invoice {
  id: string;
  invoiceNumber: string;
  description: string | null;
  status: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  dueDate: string;
  sentAt: string | null;
  viewedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  paymentNotes: string | null;
  serviceDate: string | null;
  client: { id: string; name: string; email: string; phone: string | null; address: string | null };
  lineItems: { id: string; description: string; quantity: number; unitPrice: number; total: number }[];
  user: { businessName: string | null; email: string };
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/invoices/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setInvoice)
      .catch(() => router.push("/dashboard"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function sendInvoice() {
    if (!invoice) return;
    setSending(true);
    const res = await fetch(`/api/invoices/${invoice.id}/send`, {
      method: "POST",
    });
    if (res.ok) {
      setInvoice({ ...invoice, status: "sent", sentAt: new Date().toISOString() });
    }
    setSending(false);
  }

  async function markPaid() {
    if (!invoice) return;
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid", paidAt: new Date().toISOString() }),
    });
    if (res.ok) {
      setInvoice({ ...invoice, status: "paid", paidAt: new Date().toISOString() });
    }
  }

  async function deleteInvoice() {
    if (!invoice || !confirm("Delete this invoice?")) return;
    const res = await fetch(`/api/invoices/${invoice.id}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard");
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    viewed: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="text-blue-600 font-medium text-sm mb-4 inline-block"
        >
          &larr; Back to Dashboard
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-gray-500 mt-1">
              {invoice.client.name} &middot; {fmtDate(invoice.createdAt)}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${statusColors[invoice.status] || ""}`}
          >
            {invoice.status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {invoice.status === "draft" && (
            <button
              onClick={sendInvoice}
              disabled={sending}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send to Client"}
            </button>
          )}
          {["sent", "viewed", "overdue"].includes(invoice.status) && (
            <button
              onClick={markPaid}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-green-700"
            >
              Mark as Paid
            </button>
          )}
          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            target="_blank"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-gray-200"
          >
            View PDF
          </a>
          <button
            onClick={() => {
              const w = window.open(`/api/invoices/${invoice.id}/pdf`, '_blank');
              if (w) setTimeout(() => w.print(), 500);
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
          {invoice.status === "draft" && (
            <button
              onClick={deleteInvoice}
              className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-red-100"
            >
              Delete
            </button>
          )}
        </div>

        {/* Invoice details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Bill To
                </h3>
                <p className="font-semibold text-gray-900">
                  {invoice.client.name}
                </p>
                <p className="text-gray-600">{invoice.client.email}</p>
                {invoice.client.phone && (
                  <p className="text-gray-600">{invoice.client.phone}</p>
                )}
                {invoice.client.address && (
                  <p className="text-gray-600">{invoice.client.address}</p>
                )}
              </div>
              <div className="md:text-right">
                <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Details
                </h3>
                {invoice.serviceDate && (
                  <p className="text-gray-600">Service: {fmtDate(invoice.serviceDate)}</p>
                )}
                <p className="text-gray-600">Due: {fmtDate(invoice.dueDate)}</p>
                {invoice.description && (
                  <p className="text-gray-600 mt-1">{invoice.description}</p>
                )}
                {invoice.sentAt && (
                  <p className="text-gray-500 text-sm mt-1">
                    Sent: {fmtDate(invoice.sentAt)}
                  </p>
                )}
                {invoice.viewedAt && (
                  <p className="text-gray-500 text-sm">
                    Viewed: {fmtDate(invoice.viewedAt)}
                  </p>
                )}
                {invoice.paidAt && (
                  <p className="text-green-600 text-sm font-medium">
                    Paid: {fmtDate(invoice.paidAt)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Line items table */}
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-center">Qty</th>
                <th className="px-6 py-3 text-right">Unit Price</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {fmt(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {fmt(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{fmt(invoice.subtotal)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>{fmt(invoice.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{fmt(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Notes */}
          {invoice.paymentNotes && (
            <div className="p-6 border-t border-gray-100">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                Payment Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.paymentNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
