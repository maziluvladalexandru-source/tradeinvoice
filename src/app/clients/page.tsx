"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface StatusBreakdown {
  draft: number;
  sent: number;
  viewed: number;
  paid: number;
  overdue: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  invoiceCount: number;
  totalInvoiced: number;
  currency: string;
  lastInvoiceDate: string | null;
  statusBreakdown: StatusBreakdown;
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "totalInvoiced" | "lastInvoiceDate" | "invoiceCount">("name");

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, address }),
    });
    if (res.ok) {
      const client = await res.json();
      setClients([...clients, { ...client, invoiceCount: 0, totalInvoiced: 0, currency: "EUR", lastInvoiceDate: null, statusBreakdown: { draft: 0, sent: 0, viewed: 0, paid: 0, overdue: 0 } }]);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setShowForm(false);
    }
    setSaving(false);
  }

  const filtered = clients
    .filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "totalInvoiced") return b.totalInvoiced - a.totalInvoiced;
      if (sortBy === "invoiceCount") return b.invoiceCount - a.invoiceCount;
      if (sortBy === "lastInvoiceDate") {
        if (!a.lastInvoiceDate) return 1;
        if (!b.lastInvoiceDate) return -1;
        return new Date(b.lastInvoiceDate).getTime() - new Date(a.lastInvoiceDate).getTime();
      }
      return 0;
    });

  const totalRevenue = clients.reduce((sum, c) => sum + c.totalInvoiced, 0);
  const totalInvoices = clients.reduce((sum, c) => sum + c.invoiceCount, 0);
  const totalOverdue = clients.reduce((sum, c) => sum + c.statusBreakdown.overdue, 0);
  const primaryCurrency = clients[0]?.currency || "EUR";

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Clients</h1>
            <p className="text-gray-400 mt-1">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-500 text-gray-950 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-amber-400"
          >
            {showForm ? "Cancel" : "+ Add Client"}
          </button>
        </div>

        {/* Summary Cards */}
        {clients.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Total Clients</p>
              <p className="text-2xl font-bold text-white mt-1">{clients.length}</p>
            </div>
            <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Total Invoiced</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{formatCurrency(totalRevenue, primaryCurrency)}</p>
            </div>
            <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Total Invoices</p>
              <p className="text-2xl font-bold text-white mt-1">{totalInvoices}</p>
            </div>
            <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Overdue</p>
              <p className={`text-2xl font-bold mt-1 ${totalOverdue > 0 ? "text-red-400" : "text-green-400"}`}>
                {totalOverdue}
              </p>
            </div>
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 mb-8 space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Client name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
              />
              <input
                placeholder="Email *"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
              />
              <input
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
              />
              <input
                placeholder="Address (optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-amber-500 text-gray-950 px-6 py-3 rounded-xl font-semibold hover:bg-amber-400 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Client"}
            </button>
          </form>
        )}

        {/* Search & Sort */}
        {clients.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="name">Sort by Name</option>
              <option value="totalInvoiced">Sort by Revenue</option>
              <option value="invoiceCount">Sort by Invoices</option>
              <option value="lastInvoiceDate">Sort by Recent</option>
            </select>
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-center py-12">Loading...</p>
        ) : clients.length === 0 ? (
          <div className="bg-gray-800/60 rounded-2xl p-16 border border-gray-700 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No clients yet</h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Add your first client to start sending invoices and tracking payments.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-block bg-amber-500 text-gray-950 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-amber-400 transition-colors"
            >
              Add Your First Client
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-800/60 rounded-2xl p-12 border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">No clients match your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((client) => (
              <div
                key={client.id}
                className="bg-gray-800/60 rounded-2xl border border-gray-700 p-5 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Client info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-400 font-bold text-lg">{client.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-lg truncate">{client.name}</p>
                      <p className="text-sm text-gray-400 truncate">{client.email}</p>
                      {(client.phone || client.address) && (
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                          {client.phone && <p className="text-xs text-gray-500">{client.phone}</p>}
                          {client.address && <p className="text-xs text-gray-500">{client.address}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: New Invoice button */}
                  <Link
                    href={`/invoices/new?clientId=${client.id}`}
                    className="bg-amber-500 text-gray-950 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-400 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    + New Invoice
                  </Link>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-700/50">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Invoiced</p>
                    <p className="text-lg font-bold text-white mt-0.5">
                      {client.invoiceCount > 0
                        ? formatCurrency(client.totalInvoiced, client.currency)
                        : "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Invoices</p>
                    <p className="text-lg font-bold text-white mt-0.5">{client.invoiceCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Last Invoice</p>
                    <p className="text-sm font-medium text-gray-300 mt-1">
                      {client.lastInvoiceDate ? timeAgo(client.lastInvoiceDate) : "Never"}
                    </p>
                    {client.lastInvoiceDate && (
                      <p className="text-xs text-gray-500">{formatDate(client.lastInvoiceDate)}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {client.statusBreakdown.paid > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/15 text-green-400">
                          {client.statusBreakdown.paid} paid
                        </span>
                      )}
                      {client.statusBreakdown.sent > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/15 text-blue-400">
                          {client.statusBreakdown.sent} sent
                        </span>
                      )}
                      {client.statusBreakdown.viewed > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/15 text-yellow-400">
                          {client.statusBreakdown.viewed} viewed
                        </span>
                      )}
                      {client.statusBreakdown.draft > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/15 text-gray-400">
                          {client.statusBreakdown.draft} draft
                        </span>
                      )}
                      {client.statusBreakdown.overdue > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/15 text-red-400">
                          {client.statusBreakdown.overdue} overdue
                        </span>
                      )}
                      {client.invoiceCount === 0 && (
                        <span className="text-xs text-gray-500">No invoices yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
