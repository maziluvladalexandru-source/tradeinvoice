"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import UpgradeModal from "@/components/UpgradeModal";
import { useToast } from "@/components/Toast";
import { useTimer } from "@/components/TimerContext";

interface Client {
  id: string;
  name: string;
}

interface TimeEntry {
  id: string;
  description: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  hours: number;
  hourlyRate: number;
  billable: boolean;
  invoiced: boolean;
  invoiceId: string | null;
  clientId: string | null;
  client: Client | null;
}

type FilterRange = "all" | "week" | "month";
type FilterBillable = "all" | "billable" | "non-billable";

export default function TimeTrackingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPro, setIsPro] = useState(true);

  // Filters
  const [filterClient, setFilterClient] = useState("");
  const [filterRange, setFilterRange] = useState<FilterRange>("all");
  const [filterBillable, setFilterBillable] = useState<FilterBillable>("all");

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    date: new Date().toISOString().split("T")[0],
    hours: "",
    hourlyRate: "50",
    billable: true,
    clientId: "",
  });

  // Timer (shared via context - persists across pages)
  const {
    timerRunning,
    timerElapsed,
    timerDescription,
    setTimerDescription,
    timerClientId,
    setTimerClientId,
    timerRate,
    setTimerRate,
    startTimer,
    stopTimer,
  } = useTimer();

  // Selection for invoice generation
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterClient) params.set("clientId", filterClient);
      if (filterBillable === "billable") params.set("billable", "true");
      if (filterBillable === "non-billable") params.set("billable", "false");

      if (filterRange === "week") {
        const now = new Date();
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        params.set("from", start.toISOString());
      } else if (filterRange === "month") {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        params.set("from", start.toISOString());
      }

      const res = await fetch(`/api/time-entries?${params}`);
      if (res.status === 403) {
        setIsPro(false);
        setShowUpgrade(true);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEntries(data);
    } catch {
      toast("Failed to load time entries", "error");
    } finally {
      setLoading(false);
    }
  }, [filterClient, filterRange, filterBillable, toast]);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch("/api/clients");
      if (res.ok) setClients(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchEntries();
    fetchClients();
  }, [fetchEntries, fetchClients]);

  function formatTimer(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  async function handleStartTimer() {
    if (!isPro) { setShowUpgrade(true); return; }
    startTimer();
  }

  async function handleStopTimer() {
    const saved = await stopTimer();
    if (saved) fetchEntries();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      description: formData.description,
      date: new Date(formData.date).toISOString(),
      hours: parseFloat(formData.hours),
      hourlyRate: parseFloat(formData.hourlyRate),
      billable: formData.billable,
      clientId: formData.clientId || null,
    };

    try {
      const url = editingId ? `/api/time-entries/${editingId}` : "/api/time-entries";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 403) { setShowUpgrade(true); return; }
      if (!res.ok) {
        const data = await res.json();
        toast(data.error || "Failed to save", "error");
        return;
      }
      toast(editingId ? "Entry updated" : "Entry added", "success");
      setShowForm(false);
      setEditingId(null);
      setFormData({ description: "", date: new Date().toISOString().split("T")[0], hours: "", hourlyRate: formData.hourlyRate, billable: true, clientId: "" });
      fetchEntries();
    } catch {
      toast("Failed to save time entry", "error");
    }
  }

  function handleEdit(entry: TimeEntry) {
    setEditingId(entry.id);
    setFormData({
      description: entry.description,
      date: new Date(entry.date).toISOString().split("T")[0],
      hours: entry.hours.toString(),
      hourlyRate: entry.hourlyRate.toString(),
      billable: entry.billable,
      clientId: entry.clientId || "",
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/time-entries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("Entry deleted", "success");
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      fetchEntries();
    } catch {
      toast("Failed to delete entry", "error");
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  async function handleGenerateInvoice() {
    if (selectedIds.size === 0) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/time-entries/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryIds: Array.from(selectedIds) }),
      });
      if (res.status === 403) { setShowUpgrade(true); setGenerating(false); return; }
      if (!res.ok) {
        const data = await res.json();
        toast(data.error || "Failed to generate invoice", "error");
        setGenerating(false);
        return;
      }
      const invoice = await res.json();
      toast("Invoice created from time entries", "success");
      router.push(`/invoices/${invoice.id}`);
    } catch {
      toast("Failed to generate invoice", "error");
    } finally {
      setGenerating(false);
    }
  }

  // Group entries by date
  const grouped = entries.reduce<Record<string, TimeEntry[]>>((acc, entry) => {
    const key = new Date(entry.date).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  // Totals
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const allEntries = entries;
  const weekHours = allEntries.filter((e) => new Date(e.date) >= weekStart).reduce((s, e) => s + e.hours, 0);
  const monthHours = allEntries.filter((e) => new Date(e.date) >= monthStart).reduce((s, e) => s + e.hours, 0);
  const unbilledAmount = allEntries.filter((e) => e.billable && !e.invoiced).reduce((s, e) => s + e.hours * e.hourlyRate, 0);

  // Uninvoiced entries for selection
  const uninvoicedEntries = entries.filter((e) => !e.invoiced && e.billable);

  if (!isPro && !loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Time Tracking</h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Track time spent on jobs and automatically generate invoices from logged hours. Available on the Pro plan.
            </p>
            <button
              onClick={() => setShowUpgrade(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-8 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
            >
              Upgrade to Pro
            </button>
          </div>
        </main>
        <BottomNav />
        {showUpgrade && <UpgradeModal feature="Time Tracking" onClose={() => setShowUpgrade(false)} />}
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Time Tracking</h1>
            <p className="text-gray-400 mt-1">Track hours and generate invoices from logged time</p>
          </div>
          <button
            onClick={() => { setEditingId(null); setFormData({ description: "", date: new Date().toISOString().split("T")[0], hours: "", hourlyRate: formData.hourlyRate, billable: true, clientId: "" }); setShowForm(!showForm); }}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Entry
          </button>
        </div>

        {/* Timer */}
        <div className={`relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl border p-6 mb-8 transition-all duration-300 ${timerRunning ? "border-amber-500/30 shadow-lg shadow-amber-500/10" : "border-white/10"}`}>
          {timerRunning && <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />}
          <div className="relative flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="What are you working on?"
                value={timerDescription}
                onChange={(e) => setTimerDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timerClientId}
                onChange={(e) => {
                  const client = clients.find(c => c.id === e.target.value);
                  setTimerClientId(e.target.value, client?.name || "");
                }}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-gray-300 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              >
                <option value="">No client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-sm">&euro;</span>
                <input
                  type="number"
                  value={timerRate}
                  onChange={(e) => setTimerRate(e.target.value)}
                  className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  min="0"
                  step="0.01"
                />
                <span className="text-gray-500 text-sm">/hr</span>
              </div>
              <div className={`text-2xl font-mono text-white min-w-[100px] text-center ${timerRunning ? "animate-pulse" : ""}`}>
                {formatTimer(timerElapsed)}
              </div>
              {!timerRunning ? (
                <button
                  onClick={handleStartTimer}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Start
                </button>
              ) : (
                <button
                  onClick={handleStopTimer}
                  className="bg-red-500 hover:bg-red-400 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-white/20 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            <p className="relative text-gray-400 text-sm mb-1">This Week</p>
            <p className="relative text-2xl font-bold text-white">{weekHours.toFixed(1)}h</p>
          </div>
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-white/20 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            <p className="relative text-gray-400 text-sm mb-1">This Month</p>
            <p className="relative text-2xl font-bold text-white">{monthHours.toFixed(1)}h</p>
          </div>
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-white/20 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            <p className="relative text-gray-400 text-sm mb-1">Unbilled</p>
            <p className="relative text-2xl font-bold text-amber-400">&euro;{unbilledAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-300 text-sm focus:outline-none focus:border-amber-500/50"
          >
            <option value="">All Clients</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {(["all", "week", "month"] as FilterRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRange(r)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${filterRange === r ? "bg-amber-500/15 text-amber-400" : "text-gray-400 hover:bg-white/10/60 hover:text-white"}`}
              >
                {r === "all" ? "All Time" : r === "week" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {(["all", "billable", "non-billable"] as FilterBillable[]).map((b) => (
              <button
                key={b}
                onClick={() => setFilterBillable(b)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${filterBillable === b ? "bg-amber-500/15 text-amber-400" : "text-gray-400 hover:bg-white/10/60 hover:text-white"}`}
              >
                {b === "all" ? "All" : b === "billable" ? "Billable" : "Non-billable"}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Invoice Button */}
        {selectedIds.size > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-amber-400 font-medium">
              {selectedIds.size} {selectedIds.size === 1 ? "entry" : "entries"} selected
              {" "}&middot;{" "}
              &euro;{uninvoicedEntries.filter((e) => selectedIds.has(e.id)).reduce((s, e) => s + e.hours * e.hourlyRate, 0).toFixed(2)}
            </p>
            <button
              onClick={handleGenerateInvoice}
              disabled={generating}
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Invoice"}
            </button>
          </div>
        )}

        {/* Manual Entry Form */}
        {showForm && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">{editingId ? "Edit Entry" : "Add Time Entry"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Boiler repair at 42 Main St"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Hours</label>
                  <input
                    type="number"
                    required
                    step="0.25"
                    min="0.25"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="2.5"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Hourly Rate (&euro;)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Client</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">No client</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.billable}
                    onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 text-amber-500 focus:ring-amber-500/50 bg-white/10"
                  />
                  <span className="text-sm text-gray-300">Billable</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
                >
                  {editingId ? "Update Entry" : "Add Entry"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="bg-white/10 text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Time Entries List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-2xl border border-white/10 p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-32 mb-4" />
                <div className="space-y-3">
                  <div className="h-12 bg-white/10 rounded-xl" />
                  <div className="h-12 bg-white/10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No time entries yet</p>
            <p className="text-gray-600 text-sm mt-1">Start the timer or add an entry manually</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([dateLabel, dateEntries]) => (
              <div key={dateLabel}>
                <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2"><span className="w-1 h-4 bg-amber-500/40 rounded-full" />{dateLabel}</h3>
                <div className="space-y-2">
                  {dateEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`bg-white/5 backdrop-blur-sm rounded-xl border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 ${
                        entry.invoiced ? "border-white/5 opacity-60" : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      {!entry.invoiced && entry.billable && (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(entry.id)}
                          onChange={() => toggleSelect(entry.id)}
                          className="w-4 h-4 rounded border-gray-600 text-amber-500 focus:ring-amber-500/50 bg-white/10 mt-1 shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{entry.description}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {entry.client && (
                            <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-md">{entry.client.name}</span>
                          )}
                          {!entry.billable && (
                            <span className="text-xs bg-white/10 text-gray-500 px-2 py-0.5 rounded-md">Non-billable</span>
                          )}
                          {entry.invoiced && (
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md">Invoiced</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-white font-medium">{entry.hours}h</p>
                          <p className="text-xs text-gray-500">&euro;{entry.hourlyRate}/hr</p>
                        </div>
                        <p className="text-amber-400 font-semibold min-w-[80px] text-right">
                          &euro;{(entry.hours * entry.hourlyRate).toFixed(2)}
                        </p>
                        {!entry.invoiced && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(entry)}
                              className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
      {showUpgrade && <UpgradeModal feature="Time Tracking" onClose={() => setShowUpgrade(false)} />}
    </>
  );
}
