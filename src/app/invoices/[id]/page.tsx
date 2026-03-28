"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import UpgradeModal, { ProBadge } from "@/components/UpgradeModal";

interface Invoice {
  id: string;
  invoiceNumber: string;
  description: string | null;
  type: string;
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
  notesToClient: string | null;
  serviceDate: string | null;
  remindersEnabled: boolean;
  isRecurring: boolean;
  recurringInterval: string | null;
  reverseCharge: boolean;
  referenceInvoice: string | null;
  language: string;
  paidAmount: number;
  client: { id: string; name: string; email: string; phone: string | null; address: string | null; vatNumber: string | null };
  lineItems: { id: string; description: string; quantity: number; unitPrice: number; total: number }[];
  user: { businessName: string | null; email: string; plan?: string; businessAddress?: string | null; businessPhone?: string | null; kvkNumber?: string | null; vatNumber?: string | null; bankDetails?: string | null; logoUrl?: string | null };
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("");
  const isPro = userPlan === "pro";
  const [markingPaid, setMarkingPaid] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [paidDate, setPaidDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [duplicating, setDuplicating] = useState(false);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    fetch(`/api/invoices/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setInvoice)
      .catch(() => router.push("/dashboard"))
      .finally(() => setLoading(false));
    fetch("/api/user")
      .then((r) => r.json())
      .then((u) => setUserPlan(u.plan || "free"))
      .catch(() => {});
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
    setMarkingPaid(true);
    const paidAt = new Date(paidDate + "T12:00:00").toISOString();
    const newPaidAmount = (invoice.paidAmount || 0) + paymentAmount;
    const isFullyPaid = newPaidAmount >= invoice.total;
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: isFullyPaid ? "paid" : invoice.status,
        paidAt: isFullyPaid ? paidAt : invoice.paidAt,
        paidAmount: newPaidAmount,
      }),
    });
    if (res.ok) {
      setInvoice({
        ...invoice,
        status: isFullyPaid ? "paid" : invoice.status,
        paidAt: isFullyPaid ? paidAt : invoice.paidAt,
        paidAmount: newPaidAmount,
      });
      setShowPaidModal(false);
    }
    setMarkingPaid(false);
  }

  async function duplicateInvoice() {
    if (!invoice) return;
    setDuplicating(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/duplicate`, { method: "POST" });
      if (res.ok) {
        const dup = await res.json();
        router.push(`/invoices/${dup.id}`);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to duplicate invoice");
      }
    } catch {
      alert("Failed to duplicate invoice");
    }
    setDuplicating(false);
  }

  async function convertToInvoice() {
    if (!invoice) return;
    setConverting(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/convert`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json();
        setInvoice({ ...invoice, type: "invoice", invoiceNumber: updated.invoiceNumber });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to convert");
      }
    } catch {
      alert("Failed to convert quote to invoice");
    }
    setConverting(false);
  }

  async function deleteInvoice() {
    if (!invoice || !confirm("Delete this invoice?")) return;
    const res = await fetch(`/api/invoices/${invoice.id}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard");
  }

  async function toggleReminders() {
    if (!invoice) return;
    const newVal = !invoice.remindersEnabled;
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remindersEnabled: newVal }),
    });
    if (res.ok) {
      setInvoice({ ...invoice, remindersEnabled: newVal });
    }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency: invoice?.currency || "EUR" }).format(n);
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
  const fmtDateTime = (d: string) =>
    new Date(d).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/40",
    sent: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/40",
    viewed: "bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-400/40",
    paid: "bg-green-500/20 text-green-300 ring-1 ring-green-400/40",
    overdue: "bg-red-500/20 text-red-300 ring-1 ring-red-400/40",
  };

  const statusDot: Record<string, string> = {
    draft: "bg-gray-400",
    sent: "bg-blue-400",
    viewed: "bg-yellow-400",
    paid: "bg-green-400",
    overdue: "bg-red-400 animate-pulse",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  const timelineEvents = [
    { label: "Invoice created", date: invoice.createdAt, icon: "create", always: true },
    { label: "Sent to client", date: invoice.sentAt, icon: "send", always: false },
    { label: "Viewed by client", date: invoice.viewedAt, icon: "view", always: false },
    { label: "Payment received", date: invoice.paidAt, icon: "paid", always: false },
  ].filter((e) => e.always || e.date);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="text-amber-500 font-medium text-sm mb-4 inline-block hover:text-amber-400 transition-colors"
        >
          &larr; Back to Dashboard
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">
                {invoice.invoiceNumber}
              </h1>
              {invoice.type === "quote" && (
                <span className="bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/40 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  Quote
                </span>
              )}
              {invoice.type === "credit_note" && (
                <span className="bg-orange-500/20 text-orange-300 ring-1 ring-orange-400/40 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  Credit Note
                </span>
              )}
              {invoice.reverseCharge && (
                <span className="bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/40 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  Reverse Charge
                </span>
              )}
              {invoice.isRecurring && (
                <span className="bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                  Recurring ({invoice.recurringInterval})
                </span>
              )}
            </div>
            <p className="text-gray-400 mt-1">
              {invoice.client.name} &middot; {fmtDate(invoice.createdAt)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusColors[invoice.status] || ""}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusDot[invoice.status] || ""}`} />
              {invoice.status}
            </span>
            {invoice.paidAmount > 0 && invoice.paidAmount < invoice.total && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/40">
                Partially Paid
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {invoice.status === "draft" && (
            <button
              onClick={sendInvoice}
              disabled={sending}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-blue-400 disabled:opacity-50 transition-colors"
            >
              {sending ? "Sending..." : "Send to Client"}
            </button>
          )}
          {["sent", "viewed", "overdue"].includes(invoice.status) && (
            <button
              onClick={() => {
                setPaidDate(new Date().toISOString().split("T")[0]);
                setPaymentAmount(invoice.total - (invoice.paidAmount || 0));
                setShowPaidModal(true);
              }}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-green-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {invoice.paidAmount > 0 ? "Record Payment" : "Mark as Paid"}
            </button>
          )}
          {invoice.type === "quote" && (
            <button
              onClick={convertToInvoice}
              disabled={converting}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-green-400 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {converting ? "Converting..." : "Convert to Invoice"}
            </button>
          )}
          <button
            onClick={duplicateInvoice}
            disabled={duplicating}
            className="bg-amber-500/15 text-amber-400 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-amber-500/25 ring-1 ring-amber-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {duplicating ? "Duplicating..." : "Duplicate"}
          </button>
          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            target="_blank"
            className="bg-gray-800 text-gray-300 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-gray-700 border border-gray-700 transition-colors"
          >
            View PDF
          </a>
          <button
            onClick={() => {
              const w = window.open(`/api/invoices/${invoice.id}/pdf`, '_blank');
              if (w) setTimeout(() => w.print(), 500);
            }}
            className="bg-purple-500/20 text-purple-300 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-purple-500/30 ring-1 ring-purple-500/40 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
          {invoice.status === "draft" && (
            <button
              onClick={deleteInvoice}
              className="bg-red-500/10 text-red-400 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-red-500/20 ring-1 ring-red-500/30 transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        {/* Invoice details */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-800">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  From
                </h3>
                <p className="font-semibold text-white">
                  {invoice.user.businessName || "Your Business"}
                </p>
                <p className="text-gray-400">{invoice.user.email}</p>
                {invoice.user.businessPhone && (
                  <p className="text-gray-400">{invoice.user.businessPhone}</p>
                )}
                {invoice.user.businessAddress && (
                  <p className="text-gray-400">{invoice.user.businessAddress}</p>
                )}
                {(invoice.user.kvkNumber || invoice.user.vatNumber) && (
                  <div className="mt-2 text-xs text-gray-500">
                    {invoice.user.kvkNumber && <span>KVK: {invoice.user.kvkNumber}</span>}
                    {invoice.user.kvkNumber && invoice.user.vatNumber && <span> | </span>}
                    {invoice.user.vatNumber && <span>BTW: {invoice.user.vatNumber}</span>}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Bill To
                </h3>
                <p className="font-semibold text-white">
                  {invoice.client.name}
                </p>
                <p className="text-gray-400">{invoice.client.email}</p>
                {invoice.client.phone && (
                  <p className="text-gray-400">{invoice.client.phone}</p>
                )}
                {invoice.client.address && (
                  <p className="text-gray-400">{invoice.client.address}</p>
                )}
                {invoice.client.vatNumber && (
                  <p className="text-gray-400 text-sm mt-1">VAT: {invoice.client.vatNumber}</p>
                )}
              </div>
            </div>
            <div className="mt-4 md:text-right">
              <div>
                <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Details
                </h3>
                {invoice.serviceDate && (
                  <p className="text-gray-400">Service: {fmtDate(invoice.serviceDate)}</p>
                )}
                <p className="text-gray-400">Due: {fmtDate(invoice.dueDate)}</p>
                {invoice.paidAt && (
                  <p className="text-green-400 font-medium">Paid: {fmtDate(invoice.paidAt)}</p>
                )}
                {invoice.description && (
                  <p className="text-gray-400 mt-1">{invoice.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Line items table */}
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-center">Qty</th>
                <th className="px-6 py-3 text-right">Unit Price</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {invoice.lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-white">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">
                    {fmt(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-white">
                    {fmt(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="p-6 border-t border-gray-800 bg-gray-800/30">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{fmt(invoice.subtotal)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>{fmt(invoice.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-700">
                <span>Total</span>
                <span>{fmt(invoice.total)}</span>
              </div>
              {invoice.paidAmount > 0 && invoice.paidAmount < invoice.total && (
                <>
                  <div className="flex justify-between text-green-400 pt-1">
                    <span>Amount Paid</span>
                    <span>{fmt(invoice.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-amber-400">
                    <span>Balance Due</span>
                    <span>{fmt(invoice.total - invoice.paidAmount)}</span>
                  </div>
                </>
              )}
            </div>
            {invoice.reverseCharge && (
              <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-400">
                VAT reverse-charged (BTW verlegd) — Article 44 EU VAT Directive
              </div>
            )}
            {invoice.referenceInvoice && (
              <div className="mt-3 text-sm text-gray-400">
                Reference Invoice: <span className="text-white font-medium">{invoice.referenceInvoice}</span>
              </div>
            )}
          </div>

          {/* Bank Details */}
          {invoice.user.bankDetails && (
            <div className="p-6 border-t border-gray-800">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                Payment Information
              </h3>
              <p className="text-gray-300 whitespace-pre-line">{invoice.user.bankDetails}</p>
            </div>
          )}

          {/* Payment Notes */}
          {invoice.paymentNotes && (
            <div className="p-6 border-t border-gray-800">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                Payment Notes
              </h3>
              <p className="text-gray-300 whitespace-pre-line">{invoice.paymentNotes}</p>
            </div>
          )}

          {/* Notes to Client */}
          {invoice.notesToClient && (
            <div className="p-6 border-t border-gray-800">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                Notes to Client
              </h3>
              <p className="text-gray-300 whitespace-pre-line">{invoice.notesToClient}</p>
            </div>
          )}

          {/* Reminder Toggle (Pro) */}
          {invoice.status !== "paid" && invoice.status !== "draft" && (
            <div className="p-6 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white flex items-center gap-2">
                    Payment Reminders
                    {!isPro && <ProBadge onClick={() => { setUpgradeFeature("Payment reminders"); setShowUpgradeModal(true); }} />}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Automatically remind client before due date</p>
                </div>
                <button
                  onClick={() => {
                    if (!isPro) { setUpgradeFeature("Payment reminders"); setShowUpgradeModal(true); return; }
                    toggleReminders();
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    invoice.remindersEnabled && isPro ? "bg-amber-500" : "bg-gray-600"
                  } ${!isPro ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      invoice.remindersEnabled && isPro ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timeline / Activity */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Activity Timeline</h2>
          </div>
          <div className="p-6">
            <div className="relative">
              {timelineEvents.map((event, i) => {
                const isLast = i === timelineEvents.length - 1;
                const isCompleted = !!event.date;
                return (
                  <div key={event.icon} className="flex gap-4 relative">
                    {/* Vertical line */}
                    {!isLast && (
                      <div className={`absolute left-[15px] top-8 w-0.5 h-full ${isCompleted ? "bg-gray-700" : "bg-gray-800"}`} />
                    )}
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.icon === "paid" && isCompleted
                          ? "bg-green-500/20 ring-1 ring-green-500/40"
                          : event.icon === "view" && isCompleted
                          ? "bg-yellow-500/20 ring-1 ring-yellow-500/40"
                          : event.icon === "send" && isCompleted
                          ? "bg-blue-500/20 ring-1 ring-blue-500/40"
                          : isCompleted
                          ? "bg-gray-700 ring-1 ring-gray-600"
                          : "bg-gray-800 ring-1 ring-gray-700"
                      }`}>
                        {event.icon === "create" && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                        {event.icon === "send" && (
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                        {event.icon === "view" && (
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                        {event.icon === "paid" && (
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    {/* Content */}
                    <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                      <p className={`font-medium ${isCompleted ? "text-white" : "text-gray-600"}`}>
                        {event.label}
                      </p>
                      {event.date ? (
                        <p className="text-sm text-gray-500 mt-0.5">
                          {fmtDateTime(event.date)}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-700 mt-0.5">Pending</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

        {/* Mark as Paid Modal */}
        {showPaidModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-1">Record Payment</h3>
              <p className="text-sm text-gray-400 mb-5">
                {invoice.paidAmount > 0
                  ? `Already paid: ${fmt(invoice.paidAmount)} of ${fmt(invoice.total)}`
                  : "Enter the payment amount and date"}
              </p>
              <label className="block text-sm font-medium text-gray-400 mb-1">Payment Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-800 text-white mb-4"
              />
              <label className="block text-sm font-medium text-gray-400 mb-1">Payment Date</label>
              <input
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-800 text-white mb-5"
              />
              {paymentAmount > 0 && paymentAmount < (invoice.total - (invoice.paidAmount || 0)) && (
                <p className="text-sm text-amber-400 mb-4">This is a partial payment. Status will remain until fully paid.</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={markPaid}
                  disabled={markingPaid || !paidDate || paymentAmount <= 0}
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-400 disabled:opacity-50 transition-colors"
                >
                  {markingPaid ? "Saving..." : "Confirm Payment"}
                </button>
                <button
                  onClick={() => setShowPaidModal(false)}
                  className="px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      {showUpgradeModal && (
        <UpgradeModal feature={upgradeFeature} onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
}
