"use client";

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
    <Suspense fallback={<div className="min-h-screen bg-gray-950"><Navbar /><div className="max-w-3xl mx-auto px-4 py-8"><p className="text-gray-400">Loading...</p></div></div>}>
      <NewInvoiceForm />
    </Suspense>
  );
}

function NewInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get("clientId") || "";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // New client inline form
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");

  // Selected client details
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
    setLineItems([...lineItems, { description: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeLineItem(index: number) {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  function updateLineItem(index: number, field: keyof LineItem, value: string | number) {
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
          lineItems: lineItems.filter((item) => item.description && item.unitPrice > 0),
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

  const formatEur = (n: number) =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);

  const isValid = clientId && lineItems.some((i) => i.description && i.unitPrice > 0);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">
            Create Invoice
          </h1>
          {invoiceNumber && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Invoice #</label>
              <input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-36 px-3 py-2 rounded-lg border border-gray-600 text-base font-mono focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white text-center"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Client */}
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              Client
            </h2>
            {!showNewClient ? (
              <div className="space-y-3">
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
                >
                  <option value="">Select a client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>

                {/* Show selected client details */}
                {selectedClient && (
                  <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/50">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>{" "}
                        <span className="text-gray-300">{selectedClient.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>{" "}
                        <span className="text-gray-300">{selectedClient.email}</span>
                      </div>
                      {selectedClient.phone && (
                        <div>
                          <span className="text-gray-500">Phone:</span>{" "}
                          <span className="text-gray-300">{selectedClient.phone}</span>
                        </div>
                      )}
                      {selectedClient.address && (
                        <div>
                          <span className="text-gray-500">Address:</span>{" "}
                          <span className="text-gray-300">{selectedClient.address}</span>
                        </div>
                      )}
                    </div>
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
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Client name *"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
                  />
                  <input
                    placeholder="Client email *"
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
                  />
                  <input
                    placeholder="Phone (optional)"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
                  />
                  <input
                    placeholder="Address (optional)"
                    value={newClientAddress}
                    onChange={(e) => setNewClientAddress(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleNewClient}
                    className="bg-amber-500 text-gray-950 px-4 py-2 rounded-lg font-medium"
                  >
                    Save Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewClient(false)}
                    className="text-gray-400 px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-1">
              Job Details
            </h2>
            <p className="text-sm text-gray-500 mb-4">Describe the work and set dates</p>
            <input
              placeholder="e.g. Bathroom renovation, boiler repair..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500 mb-4"
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Service Date
                </label>
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Default: 30 days from today</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Notes */}
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-1">
              Payment Notes
            </h2>
            <p className="text-sm text-gray-500 mb-4">Bank account, payment instructions, or other notes shown on the invoice</p>
            <textarea
              placeholder={"e.g. IBAN: NL91 ABNA 0417 1643 00\nPlease include invoice number as reference"}
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-600 text-base focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500 resize-none"
            />
          </div>

          {/* Notes to Client */}
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-1">
              Notes to Client
            </h2>
            <p className="text-sm text-gray-500 mb-4">Optional message displayed prominently on the invoice for your client</p>
            <textarea
              placeholder={"e.g. Thank you for your business! Work completed as agreed."}
              value={notesToClient}
              onChange={(e) => setNotesToClient(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-600 text-base focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500 resize-none"
            />
          </div>

          {/* Line Items */}
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              Line Items
            </h2>
            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(index, "description", e.target.value)
                    }
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-600 text-base focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(index, "quantity", Number(e.target.value))
                    }
                    className="w-20 px-3 py-3 rounded-xl border border-gray-600 text-base text-center focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
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
                    className="w-28 px-3 py-3 rounded-xl border border-gray-600 text-base text-right focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="p-3 text-red-400 hover:text-red-300"
                    title="Remove"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLineItem}
              className="mt-4 text-amber-500 font-medium hover:underline"
            >
              + Add Line Item
            </button>
          </div>

          {/* Totals */}
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <div className="space-y-2 text-right">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatEur(subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Tax ({taxRate}%)</span>
                  <span>{formatEur(tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-700">
                <span>Total</span>
                <span>{formatEur(total)}</span>
              </div>
            </div>
          </div>

          {/* Actions - Save as Draft is now primary/prominent */}
          <div className="space-y-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading || !isValid}
              className="w-full bg-amber-500 text-gray-950 py-4 rounded-xl font-semibold text-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {loading ? "Saving..." : "Save as Draft"}
            </button>
            <p className="text-center text-xs text-gray-500">
              Save now and finish later — you can send it when you&apos;re ready
            </p>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading || !isValid}
              className="w-full bg-gray-800 text-gray-300 py-3 rounded-xl font-medium text-base hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
            >
              {loading ? "Creating..." : "Create & Send Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
