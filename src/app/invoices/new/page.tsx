"use client";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950">
          <Navbar />
          <div className="max-w-3xl mx-auto px-4 py-8">
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <NewInvoiceForm />
    </Suspense>
  );
}

// ─── Live Preview Component ─────────────────────────────────────────────────
function InvoicePreview({
  invoiceNumber,
  invoiceType,
  description,
  currency,
  dueDate,
  serviceDate,
  taxRate,
  reverseCharge,
  paymentNotes,
  notesToClient,
  lineItems,
  selectedClient,
  referenceInvoice,
}: {
  invoiceNumber: string;
  invoiceType: string;
  description: string;
  currency: string;
  dueDate: string;
  serviceDate: string;
  taxRate: number;
  reverseCharge: boolean;
  paymentNotes: string;
  notesToClient: string;
  lineItems: LineItem[];
  selectedClient: Client | undefined;
  referenceInvoice: string;
}) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(n);

  const fmtDate = (d: string) => {
    if (!d) return "—";
    return new Date(d + "T00:00:00").toLocaleDateString("en-IE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const docLabel =
    invoiceType === "quote"
      ? "Quote"
      : invoiceType === "credit_note"
      ? "Credit Note"
      : "Invoice";

  const validItems = lineItems.filter((i) => i.description || i.unitPrice > 0);
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-gray-900 text-sm">
      {/* Header */}
      <header className="px-6 pt-6 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-white leading-none">Y</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Your Business</h2>
            <p className="text-gray-400 text-xs">your@email.com</p>
          </div>
        </div>
      </header>

      {/* Invoice Info + Bill To */}
      <div className="px-6 py-5">
        <div className="flex justify-between gap-6">
          {/* Meta */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
              {docLabel}
            </p>
            <p className="text-xl font-bold text-gray-900 font-mono tracking-tight truncate">
              {invoiceNumber || "INV-0000"}
            </p>
            {description && (
              <p className="text-gray-500 text-xs mt-0.5 truncate">
                {description}
              </p>
            )}
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex gap-2">
                <span className="text-gray-400 w-14">Issued</span>
                <span className="text-gray-700 font-medium">
                  {fmtDate(today)}
                </span>
              </div>
              {serviceDate && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-14">Service</span>
                  <span className="text-gray-700 font-medium">
                    {fmtDate(serviceDate)}
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-gray-400 w-14">Due</span>
                <span className="text-gray-700 font-medium">
                  {fmtDate(dueDate)}
                </span>
              </div>
            </div>
            {invoiceType === "credit_note" && referenceInvoice && (
              <p className="text-xs text-gray-400 mt-2">
                Ref: {referenceInvoice}
              </p>
            )}
          </div>

          {/* Bill To */}
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Bill To
            </p>
            {selectedClient ? (
              <>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedClient.name}
                </p>
                <p className="text-gray-500 text-xs">{selectedClient.email}</p>
                {selectedClient.address && (
                  <p className="text-gray-500 text-xs mt-0.5 whitespace-pre-line">
                    {selectedClient.address}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-300 text-xs italic">No client selected</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes to Client */}
      {notesToClient && (
        <div className="px-6 pb-4">
          <div className="bg-blue-50 rounded-lg border border-blue-200/80 p-3">
            <p className="text-[10px] font-semibold text-blue-900 mb-0.5">
              Note
            </p>
            <p className="text-blue-800 text-xs whitespace-pre-line leading-relaxed">
              {notesToClient}
            </p>
          </div>
        </div>
      )}

      {/* Line Items Table */}
      <div className="px-6">
        <table className="w-full">
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50/50">
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 py-2 pr-2">
                Description
              </th>
              <th className="text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500 py-2 px-2 w-12">
                Qty
              </th>
              <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500 py-2 px-2 w-20">
                Price
              </th>
              <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500 py-2 pl-2 w-20">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {validItems.length > 0 ? (
              validItems.map((item, idx) => (
                <tr
                  key={idx}
                  className={
                    idx < validItems.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                >
                  <td className="text-gray-800 text-xs py-2.5 pr-2 truncate max-w-[120px]">
                    {item.description || "—"}
                  </td>
                  <td className="text-gray-500 text-xs text-center py-2.5 px-2 tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="text-gray-500 text-xs text-right py-2.5 px-2 tabular-nums">
                    {fmt(item.unitPrice)}
                  </td>
                  <td className="text-gray-900 text-xs font-medium text-right py-2.5 pl-2 tabular-nums">
                    {fmt(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-300 text-xs py-6 italic"
                >
                  Add line items to see them here
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="border-t border-gray-200 py-4">
          <div className="flex flex-col items-end space-y-1">
            <div className="w-full max-w-[200px] flex justify-between text-xs">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-gray-700 tabular-nums">{fmt(subtotal)}</span>
            </div>
            {taxRate > 0 && (
              <div className="w-full max-w-[200px] flex justify-between text-xs">
                <span className="text-gray-400">VAT ({taxRate}%)</span>
                <span className="text-gray-700 tabular-nums">{fmt(tax)}</span>
              </div>
            )}
            {reverseCharge && (
              <div className="w-full max-w-[200px]">
                <p className="text-[10px] text-amber-600 italic">
                  VAT reverse-charged
                </p>
              </div>
            )}
            <div className="w-full max-w-[200px] flex justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900 tabular-nums">
                {fmt(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Notes */}
      {paymentNotes && (
        <div className="px-6 pb-4">
          <div className="bg-amber-50 rounded-lg border border-amber-200/80 p-3">
            <p className="text-[10px] font-semibold text-amber-900 mb-0.5">
              Payment Notes
            </p>
            <p className="text-amber-800 text-xs whitespace-pre-line leading-relaxed">
              {paymentNotes}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/30">
        <p className="text-[10px] text-gray-400 text-center">
          Generated with TradeInvoice
        </p>
      </div>
    </div>
  );
}

// ─── Main Form ──────────────────────────────────────────────────────────────
function NewInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get("clientId") || "";
  const preselectedType = searchParams.get("type") || "invoice";

  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState(preselectedClientId);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [serviceDate, setServiceDate] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [notesToClient, setNotesToClient] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [currency, setCurrency] = useState("EUR");
  const [invoiceType, setInvoiceType] = useState(
    preselectedType === "quote"
      ? "quote"
      : preselectedType === "credit_note"
      ? "credit_note"
      : "invoice"
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState("monthly");
  const [reverseCharge, setReverseCharge] = useState(false);
  const [referenceInvoice, setReferenceInvoice] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // New client inline form
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");

  // Mobile preview toggle
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const selectedClient = clients.find((c) => c.id === clientId);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => {
        setClients(data);
        if (preselectedClientId) {
          setClientId(preselectedClientId);
        }
      })
      .catch(() => {});

    fetch("/api/invoices/next-number")
      .then((r) => r.json())
      .then((data) => setInvoiceNumber(data.nextNumber))
      .catch(() => {});
  }, [preselectedClientId]);

  function addLineItem() {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
  }

  function removeLineItem(index: number) {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  function updateLineItem(
    index: number,
    field: keyof LineItem,
    value: string | number
  ) {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  }

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  async function handleNewClient() {
    if (!newClientName || !newClientEmail) return;
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newClientName,
        email: newClientEmail,
        phone: newClientPhone || null,
        address: newClientAddress || null,
      }),
    });
    if (res.ok) {
      const client = await res.json();
      setClients([...clients, client]);
      setClientId(client.id);
      setShowNewClient(false);
      setNewClientName("");
      setNewClientEmail("");
      setNewClientPhone("");
      setNewClientAddress("");
    }
  }

  async function handleSubmit(sendNow: boolean) {
    setError("");
    const errors: Record<string, string> = {};
    if (!clientId) errors.clientId = "Select a client to bill";
    if (!invoiceNumber.trim())
      errors.invoiceNumber = "Invoice number is required";
    if (lineItems.length === 0 || !lineItems[0].description)
      errors.lineItems = "Add at least one item";
    if (!dueDate) errors.dueDate = "Set a due date";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          description,
          dueDate,
          taxRate,
          serviceDate: serviceDate || null,
          paymentNotes: paymentNotes || null,
          notesToClient: notesToClient || null,
          invoiceNumber: invoiceNumber || null,
          currency,
          type: invoiceType,
          isRecurring,
          recurringInterval: isRecurring ? recurringInterval : null,
          reverseCharge,
          referenceInvoice:
            invoiceType === "credit_note" ? referenceInvoice || null : null,
          language,
          lineItems: lineItems.filter(
            (item) => item.description && item.unitPrice > 0
          ),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create invoice");
      }

      const invoice = await res.json();

      if (sendNow) {
        await fetch(`/api/invoices/${invoice.id}/send`, { method: "POST" });
      }

      router.push(`/invoices/${invoice.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPreview() {
    // Create the invoice first as draft, then redirect to PDF
    setError("");
    const errors: Record<string, string> = {};
    if (!clientId) errors.clientId = "Select a client to bill";
    if (!invoiceNumber.trim())
      errors.invoiceNumber = "Invoice number is required";
    if (lineItems.length === 0 || !lineItems[0].description)
      errors.lineItems = "Add at least one item";
    if (!dueDate) errors.dueDate = "Set a due date";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          description,
          dueDate,
          taxRate,
          serviceDate: serviceDate || null,
          paymentNotes: paymentNotes || null,
          notesToClient: notesToClient || null,
          invoiceNumber: invoiceNumber || null,
          currency,
          type: invoiceType,
          isRecurring,
          recurringInterval: isRecurring ? recurringInterval : null,
          reverseCharge,
          referenceInvoice:
            invoiceType === "credit_note" ? referenceInvoice || null : null,
          language,
          lineItems: lineItems.filter(
            (item) => item.description && item.unitPrice > 0
          ),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create invoice");
      }

      const invoice = await res.json();
      window.open(`/api/invoices/${invoice.id}/pdf`, "_blank");
      router.push(`/invoices/${invoice.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const formatAmount = (n: number) =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(n);

  const isValid =
    clientId && lineItems.some((i) => i.description && i.unitPrice > 0);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Mobile floating preview toggle - inline media query to bypass Tailwind JIT */}
      <button
        onClick={() => setShowMobilePreview(!showMobilePreview)}
        style={{ position: 'fixed', bottom: '7rem', right: '1rem', zIndex: 9999 }}
        className="bg-amber-500 text-gray-950 rounded-full px-5 py-3 text-base font-bold shadow-lg shadow-amber-500/30 active:scale-95 transition-transform mobile-preview-btn"
      >
        {showMobilePreview ? "✏️ Edit" : "👁️ Preview"}
      </button>

      <div className="max-w-[1440px] mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* ── LEFT: Form (40%) ─────────────────────────────────────── */}
          <div
            className={
              showMobilePreview
                ? "hidden md:block w-full md:w-[45%] md:flex-shrink-0"
                : "w-full md:w-[45%] md:flex-shrink-0"
            }
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Create{" "}
                {invoiceType === "quote"
                  ? "Quote"
                  : invoiceType === "credit_note"
                  ? "Credit Note"
                  : "Invoice"}
              </h1>
              {invoiceNumber && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">
                    #{" "}
                  </label>
                  <input
                    value={invoiceNumber}
                    onChange={(e) => {
                      setInvoiceNumber(e.target.value);
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.invoiceNumber;
                        return next;
                      });
                    }}
                    className={`w-32 px-3 py-1.5 rounded-lg border text-sm font-mono focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white text-center ${
                      fieldErrors.invoiceNumber
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/50 text-red-400 p-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Type & Currency */}
              <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Type
                    </label>
                    <select
                      value={invoiceType}
                      onChange={(e) => setInvoiceType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
                    >
                      <option value="invoice">Invoice</option>
                      <option value="quote">Quote / Estimate</option>
                      <option value="credit_note">Credit Note</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
                    >
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="RON">RON - Romanian Leu</option>
                      <option value="PLN">PLN - Polish Zloty</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      PDF Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
                    >
                      <option value="en">English</option>
                      <option value="nl">Dutch (Nederlands)</option>
                      <option value="de">German (Deutsch)</option>
                    </select>
                  </div>
                  {invoiceType === "credit_note" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Reference Invoice #
                      </label>
                      <input
                        placeholder="e.g. INV-0001"
                        value={referenceInvoice}
                        onChange={(e) => setReferenceInvoice(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
                      />
                    </div>
                  )}
                </div>

                {/* Recurring Toggle */}
                {invoiceType === "invoice" && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">
                          Make Recurring
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Auto-create invoices on a schedule
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsRecurring(!isRecurring)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isRecurring ? "bg-amber-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isRecurring ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    {isRecurring && (
                      <div className="mt-2">
                        <select
                          value={recurringInterval}
                          onChange={(e) => setRecurringInterval(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* Reverse Charge Toggle */}
                {invoiceType !== "quote" && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">
                          VAT Reverse Charge
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          B2B services to EU clients outside your country
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !reverseCharge;
                          setReverseCharge(next);
                          if (next) setTaxRate(0);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          reverseCharge ? "bg-amber-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            reverseCharge ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    {reverseCharge && (
                      <p className="mt-1.5 text-xs text-amber-400">
                        Tax rate set to 0%. &quot;VAT reverse-charged (BTW
                        verlegd)&quot; will appear on the invoice.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Client */}
              <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
                <h2 className="text-base font-semibold text-white mb-3">
                  Client <span className="text-red-500">*</span>
                </h2>
                {!showNewClient ? (
                  <div className="space-y-3">
                    <select
                      value={clientId}
                      onChange={(e) => {
                        setClientId(e.target.value);
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.clientId;
                          return next;
                        });
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white ${
                        fieldErrors.clientId
                          ? "border-red-500"
                          : "border-gray-600"
                      }`}
                    >
                      <option value="">Select a client...</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.email})
                        </option>
                      ))}
                    </select>
                    {fieldErrors.clientId && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.clientId}
                      </p>
                    )}

                    {selectedClient && (
                      <div className="bg-gray-900/60 rounded-xl p-3 border border-gray-700/50">
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          <div>
                            <span className="text-gray-500">Name:</span>{" "}
                            <span className="text-gray-300">
                              {selectedClient.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Email:</span>{" "}
                            <span className="text-gray-300">
                              {selectedClient.email}
                            </span>
                          </div>
                          {selectedClient.phone && (
                            <div>
                              <span className="text-gray-500">Phone:</span>{" "}
                              <span className="text-gray-300">
                                {selectedClient.phone}
                              </span>
                            </div>
                          )}
                          {selectedClient.address && (
                            <div>
                              <span className="text-gray-500">Address:</span>{" "}
                              <span className="text-gray-300">
                                {selectedClient.address}
                              </span>
                            </div>
                          )}
                        </div>
                        {!selectedClient.address && (
                          <div className="mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-xs text-yellow-400">
                            Dutch law requires client address on invoices. Add it
                            in Clients page.
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowNewClient(true)}
                      className="text-amber-500 font-medium text-sm hover:underline"
                    >
                      + Add new client
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Client name *"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
                      />
                      <input
                        placeholder="Client email *"
                        type="email"
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
                      />
                      <input
                        placeholder="Phone (optional)"
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
                      />
                      <input
                        placeholder="Address (required for legal)"
                        value={newClientAddress}
                        onChange={(e) => setNewClientAddress(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleNewClient}
                        className="bg-amber-500 text-gray-950 px-4 py-2 rounded-lg font-medium text-sm"
                      >
                        Save Client
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewClient(false)}
                        className="text-gray-400 px-4 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Details */}
              <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
                <h2 className="text-base font-semibold text-white mb-1">
                  Job Details
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  Describe the work and set dates
                </p>
                <input
                  placeholder="e.g. Bathroom renovation, boiler repair..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500 mb-3"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Service Date
                    </label>
                    <input
                      type="date"
                      value={serviceDate}
                      onChange={(e) => setServiceDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white appearance-none [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:invert"
                      style={{ minHeight: "44px" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => {
                        setDueDate(e.target.value);
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.dueDate;
                          return next;
                        });
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white appearance-none [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:invert ${
                        fieldErrors.dueDate
                          ? "border-red-500"
                          : "border-gray-600"
                      }`}
                      style={{ minHeight: "44px" }}
                    />
                    {fieldErrors.dueDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldErrors.dueDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      disabled={reverseCharge}
                      className={`w-full px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white ${
                        reverseCharge ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{ minHeight: "44px" }}
                    />
                    {reverseCharge && (
                      <p className="text-xs text-amber-400 mt-1">
                        Disabled (reverse charge)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Notes */}
              <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
                <h2 className="text-base font-semibold text-white mb-1">
                  Payment Notes
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  Bank account, payment instructions
                </p>
                <textarea
                  placeholder={
                    "e.g. IBAN: NL91 ABNA 0417 1643 00\nPlease include invoice number as reference"
                  }
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500 resize-none"
                />
              </div>

              {/* Notes to Client */}
              <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
                <h2 className="text-base font-semibold text-white mb-1">
                  Notes to Client
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  Optional message displayed on the invoice
                </p>
                <textarea
                  placeholder={
                    "e.g. Thank you for your business! Work completed as agreed."
                  }
                  value={notesToClient}
                  onChange={(e) => setNotesToClient(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500 resize-none"
                />
              </div>

              {/* Line Items */}
              <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
                <h2 className="text-base font-semibold text-white mb-3">
                  Line Items <span className="text-red-500">*</span>
                </h2>
                {fieldErrors.lineItems && (
                  <p className="text-red-500 text-sm mb-3">
                    {fieldErrors.lineItems}
                  </p>
                )}
                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/40 sm:bg-transparent rounded-xl p-3 sm:p-0 border border-gray-700/50 sm:border-0 space-y-2 sm:space-y-0 sm:flex sm:gap-2 sm:items-start"
                    >
                      <input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(index, "description", e.target.value)
                        }
                        className="w-full sm:flex-1 px-3 py-2.5 rounded-xl border border-gray-600 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
                      />
                      <div className="flex gap-2 items-start">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(
                              index,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="w-16 shrink-0 px-2 py-2.5 rounded-xl border border-gray-600 text-sm text-center focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Price"
                          value={item.unitPrice || ""}
                          onChange={(e) =>
                            updateLineItem(
                              index,
                              "unitPrice",
                              Number(e.target.value)
                            )
                          }
                          className="min-w-0 flex-1 sm:w-24 sm:flex-none px-2 py-2.5 rounded-xl border border-gray-600 text-sm text-right focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeLineItem(index)}
                          className="p-2.5 shrink-0 text-red-400 hover:text-red-300"
                          title="Remove"
                          aria-label="Remove line item"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="mt-3 text-amber-500 font-medium text-sm hover:underline"
                >
                  + Add Line Item
                </button>
              </div>

              {/* Totals */}
              <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
                <div className="space-y-1.5 text-right">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Subtotal</span>
                    <span>{formatAmount(subtotal)}</span>
                  </div>
                  {taxRate > 0 && (
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>Tax ({taxRate}%)</span>
                      <span>{formatAmount(tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-700">
                    <span>Total</span>
                    <span>{formatAmount(total)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pb-6">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={loading || !isValid}
                  className="w-full bg-amber-500 text-gray-950 py-3.5 rounded-xl font-semibold text-base hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {loading
                    ? "Saving..."
                    : `Save ${
                        invoiceType === "quote"
                          ? "Quote"
                          : invoiceType === "credit_note"
                          ? "Credit Note"
                          : "Invoice"
                      } as Draft`}
                </button>
                <p className="text-center text-xs text-gray-500">
                  Save now and finish later. You can send it when you&apos;re
                  ready
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={loading || !isValid}
                    className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-xl font-medium text-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
                  >
                    {loading ? "Creating..." : "Create & Send"}
                  </button>
                  <button
                    onClick={handleDownloadPreview}
                    disabled={loading || !isValid}
                    className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-xl font-medium text-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Live Preview (60%) ─────────────────────────────── */}
          <div
            className={
              !showMobilePreview
                ? "hidden md:block w-full md:w-[55%]"
                : "w-full md:w-[55%]"
            }
          >
            <div className="md:sticky md:top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Live Preview
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Updates as you type
                </div>
              </div>

              <div className="max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl">
                <InvoicePreview
                  invoiceNumber={invoiceNumber}
                  invoiceType={invoiceType}
                  description={description}
                  currency={currency}
                  dueDate={dueDate}
                  serviceDate={serviceDate}
                  taxRate={taxRate}
                  reverseCharge={reverseCharge}
                  paymentNotes={paymentNotes}
                  notesToClient={notesToClient}
                  lineItems={lineItems}
                  selectedClient={selectedClient}
                  referenceInvoice={referenceInvoice}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

