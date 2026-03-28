"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/components/Toast";

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
  vatNumber: string | null;
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

function getCountryFlag(address: string | null): string | null {
  if (!address) return null;
  const lower = address.toLowerCase();
  if (/\bnl\b|netherland|amsterdam|rotterdam|utrecht|den haag/.test(lower)) return "\u{1F1F3}\u{1F1F1}";
  if (/\buk\b|\bgb\b|united kingdom|england|london|manchester|birmingham|scotland|wales/.test(lower)) return "\u{1F1EC}\u{1F1E7}";
  if (/\bde\b|germany|deutschland|berlin|munich|hamburg|frankfurt/.test(lower)) return "\u{1F1E9}\u{1F1EA}";
  if (/\bbe\b|belgium|belgi[eë]|brussels|bruxelles|antwerp/.test(lower)) return "\u{1F1E7}\u{1F1EA}";
  if (/\bfr\b|france|paris|lyon|marseille/.test(lower)) return "\u{1F1EB}\u{1F1F7}";
  if (/\bie\b|ireland|dublin|cork|galway/.test(lower)) return "\u{1F1EE}\u{1F1EA}";
  if (/\bus\b|usa|united states|new york|california/.test(lower)) return "\u{1F1FA}\u{1F1F8}";
  return null;
}

function SkeletonCard() {
  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800/50 p-5">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-gray-800 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-56 bg-gray-800/50 rounded animate-pulse" />
        </div>
        <div className="h-9 w-28 bg-gray-800 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-700/50">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-16 bg-gray-800/50 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [vatNumber, setVatNumber] = useState("");
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
      body: JSON.stringify({ name, email, phone, address, vatNumber: vatNumber || null }),
    });
    if (res.ok) {
      const client = await res.json();
      setClients([...clients, { ...client, invoiceCount: 0, totalInvoiced: 0, currency: "EUR", lastInvoiceDate: null, statusBreakdown: { draft: 0, sent: 0, viewed: 0, paid: 0, overdue: 0 } }]);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setVatNumber("");
      setShowForm(false);
      toast("Client added");
    } else {
      toast("Failed to add client", "error");
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
    <div className="min-h-screen bg-gray-950 pb-20 md:pb-0">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Clients</h1>
            <p className="text-gray-400 mt-1">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold text-lg shadow-lg shadow-amber-500/20 transition-all"
          >
            {showForm ? "Cancel" : "+ Add Client"}
          </button>
        </div>

        {/* Summary Cards */}
        {clients.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
              <div className="relative">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                  Total Clients
                </p>
                <p className="text-2xl font-bold text-white mt-1">{clients.length}</p>
              </div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
              <div className="relative">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Total Invoiced
                </p>
                <p className="text-2xl font-bold text-amber-400 mt-1">{formatCurrency(totalRevenue, primaryCurrency)}</p>
              </div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
              <div className="relative">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  Total Invoices
                </p>
                <p className="text-2xl font-bold text-white mt-1">{totalInvoices}</p>
              </div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
              <div className="relative">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                  Overdue
                </p>
                <p className={`text-2xl font-bold mt-1 ${totalOverdue > 0 ? "text-red-400" : "text-green-400"}`}>
                  {totalOverdue}
                </p>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 mb-8 space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Client name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900 text-white placeholder-gray-500 transition-all"
              />
              <input
                placeholder="Email *"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900 text-white placeholder-gray-500 transition-all"
              />
              <input
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900 text-white placeholder-gray-500 transition-all"
              />
              <input
                placeholder="Address (optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900 text-white placeholder-gray-500 transition-all"
              />
              <input
                placeholder="VAT number (optional)"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900 text-white placeholder-gray-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Client"}
            </button>
          </form>
        )}

        {/* Search & Sort */}
        {clients.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 w-full pl-10 px-4 py-2.5 rounded-xl border border-gray-800/50 bg-gray-900/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2.5 rounded-xl border border-gray-800/50 bg-gray-900/50 text-gray-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all"
            >
              <option value="name">Sort by Name</option>
              <option value="totalInvoiced">Sort by Revenue</option>
              <option value="invoiceCount">Sort by Invoices</option>
              <option value="lastInvoiceDate">Sort by Recent</option>
            </select>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : clients.length === 0 ? (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-16 border border-gray-800/50 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            <div className="relative">
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
                className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-8 py-3 rounded-xl font-semibold text-lg shadow-lg shadow-amber-500/20 transition-all"
              >
                Add Your First Client
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-800/50 text-center">
            <p className="text-gray-400 text-lg">No clients match your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((client) => {
              const flag = getCountryFlag(client.address);
              return (
                <div
                  key={client.id}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-5 hover:border-gray-700/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Client info */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                        <span className="text-amber-400 font-bold text-lg">{client.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-lg truncate flex items-center gap-2">
                          {client.name}
                          {flag && <span className="text-base" title="Detected country">{flag}</span>}
                        </p>
                        <p className="text-sm text-gray-400 truncate">{client.email}</p>
                        {(client.phone || client.address || client.vatNumber) && (
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                            {client.phone && <p className="text-xs text-gray-500">{client.phone}</p>}
                            {client.address && <p className="text-xs text-gray-500">{client.address}</p>}
                            {client.vatNumber && <p className="text-xs text-gray-500">VAT: {client.vatNumber}</p>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: New Invoice button */}
                    <Link
                      href={`/invoices/new?clientId=${client.id}`}
                      className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm shadow-amber-500/20 transition-all whitespace-nowrap flex-shrink-0"
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
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {client.statusBreakdown.paid} paid
                          </span>
                        )}
                        {client.statusBreakdown.sent > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {client.statusBreakdown.sent} sent
                          </span>
                        )}
                        {client.statusBreakdown.viewed > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            {client.statusBreakdown.viewed} viewed
                          </span>
                        )}
                        {client.statusBreakdown.draft > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                            {client.statusBreakdown.draft} draft
                          </span>
                        )}
                        {client.statusBreakdown.overdue > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
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
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
