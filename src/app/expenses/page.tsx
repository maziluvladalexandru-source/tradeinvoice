"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import UpgradeModal from "@/components/UpgradeModal";
import { useToast } from "@/components/Toast";
import DonutChart from "@/components/DonutChart";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  receiptUrl: string | null;
  vendor: string | null;
  taxDeductible: boolean;
  notes: string | null;
}

interface MileageEntry {
  id: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  distance: number;
  purpose: string;
  clientId: string | null;
  ratePerKm: number;
  billable: boolean;
  client: { id: string; name: string } | null;
}

interface ClientOption {
  id: string;
  name: string;
}

const CATEGORIES = [
  { value: "materials", label: "Materials", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { value: "fuel", label: "Fuel / Mileage", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { value: "tools", label: "Tools & Equipment", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  { value: "subcontractor", label: "Subcontractor", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { value: "office", label: "Office / Admin", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { value: "other", label: "Other", icon: "M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" },
];

const CATEGORY_COLORS: Record<string, string> = {
  materials: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  fuel: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  tools: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  subcontractor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  office: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const CATEGORY_BORDER_LEFT: Record<string, string> = {
  materials: "border-l-orange-500",
  fuel: "border-l-yellow-500",
  tools: "border-l-blue-500",
  subcontractor: "border-l-purple-500",
  office: "border-l-cyan-500",
  other: "border-l-gray-500",
};

const TIME_FILTERS = [
  { value: "all", label: "All Time" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
];

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState<"expenses" | "mileage">("expenses");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [mileageEntries, setMileageEntries] = useState<MileageEntry[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [mileageLoading, setMileageLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showMileageForm, setShowMileageForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("month");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("Receipt Upload");
  const [userPlan, setUserPlan] = useState("free");
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
  const { toast } = useToast();

  // Expense form state
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "materials",
    date: new Date().toISOString().split("T")[0],
    vendor: "",
    taxDeductible: true,
    notes: "",
    receiptUrl: "",
  });

  // Mileage form state
  const [mileageForm, setMileageForm] = useState({
    date: new Date().toISOString().split("T")[0],
    fromLocation: "",
    toLocation: "",
    distance: "",
    purpose: "",
    clientId: "",
    ratePerKm: "0.23",
    billable: false,
  });

  const getDateRange = useCallback(() => {
    const now = new Date();
    let from = "";
    const to = now.toISOString();
    if (timeFilter === "month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    } else if (timeFilter === "quarter") {
      const qStart = Math.floor(now.getMonth() / 3) * 3;
      from = new Date(now.getFullYear(), qStart, 1).toISOString();
    } else if (timeFilter === "year") {
      from = new Date(now.getFullYear(), 0, 1).toISOString();
    }
    return { from, to };
  }, [timeFilter]);

  const fetchExpenses = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set("category", categoryFilter);
      const { from, to } = getDateRange();
      if (from) params.set("from", from);
      if (to && timeFilter !== "all") params.set("to", to);

      const res = await fetch(`/api/expenses?${params}`);
      if (res.ok) {
        setExpenses(await res.json());
      }
    } catch {
      toast("Failed to load expenses", "error");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, getDateRange, timeFilter, toast]);

  const fetchMileage = useCallback(async () => {
    if (userPlan !== "pro") return;
    setMileageLoading(true);
    try {
      const params = new URLSearchParams();
      const { from, to } = getDateRange();
      if (from) params.set("from", from);
      if (to && timeFilter !== "all") params.set("to", to);

      const res = await fetch(`/api/mileage?${params}`);
      if (res.ok) {
        setMileageEntries(await res.json());
      }
    } catch {
      toast("Failed to load mileage entries", "error");
    } finally {
      setMileageLoading(false);
    }
  }, [getDateRange, timeFilter, toast, userPlan]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    if (activeTab === "mileage" && userPlan === "pro") {
      fetchMileage();
    }
  }, [activeTab, fetchMileage, userPlan]);

  useEffect(() => {
    fetch("/api/user").then((r) => r.json()).then((u) => {
      if (u.plan) setUserPlan(u.plan);
    }).catch(() => {});
    fetch("/api/clients").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setClients(data.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
    }).catch(() => {});
  }, []);

  function resetForm() {
    setForm({
      description: "",
      amount: "",
      category: "materials",
      date: new Date().toISOString().split("T")[0],
      vendor: "",
      taxDeductible: true,
      notes: "",
      receiptUrl: "",
    });
    setEditingId(null);
  }

  function resetMileageForm() {
    setMileageForm({
      date: new Date().toISOString().split("T")[0],
      fromLocation: "",
      toLocation: "",
      distance: "",
      purpose: "",
      clientId: "",
      ratePerKm: "0.23",
      billable: false,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingId ? `/api/expenses/${editingId}` : "/api/expenses";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          receiptUrl: form.receiptUrl || undefined,
        }),
      });

      if (res.status === 403) {
        setUpgradeFeature("Receipt Upload");
        setShowUpgrade(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        toast(data.error || "Failed to save expense", "error");
        return;
      }

      toast(editingId ? "Expense updated" : "Expense added", "success");
      resetForm();
      setShowForm(false);
      fetchExpenses();
    } catch {
      toast("Failed to save expense", "error");
    }
  }

  async function handleMileageSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/mileage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...mileageForm,
          distance: parseFloat(mileageForm.distance),
          ratePerKm: parseFloat(mileageForm.ratePerKm),
          clientId: mileageForm.clientId || null,
        }),
      });

      if (res.status === 403) {
        setUpgradeFeature("Mileage Tracking");
        setShowUpgrade(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        toast(data.error || "Failed to save mileage entry", "error");
        return;
      }

      toast("Mileage entry added", "success");
      resetMileageForm();
      setShowMileageForm(false);
      fetchMileage();
    } catch {
      toast("Failed to save mileage entry", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this expense?")) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Expense deleted", "success");
        fetchExpenses();
      }
    } catch {
      toast("Failed to delete expense", "error");
    }
  }

  async function handleDeleteMileage(id: string) {
    if (!confirm("Delete this mileage entry?")) return;
    try {
      const res = await fetch(`/api/mileage/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Mileage entry deleted", "success");
        fetchMileage();
      }
    } catch {
      toast("Failed to delete mileage entry", "error");
    }
  }

  function handleEdit(expense: Expense) {
    setForm({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date).toISOString().split("T")[0],
      vendor: expense.vendor || "",
      taxDeductible: expense.taxDeductible,
      notes: expense.notes || "",
      receiptUrl: expense.receiptUrl || "",
    });
    setEditingId(expense.id);
    setShowForm(true);
  }

  function handleReceiptUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("Receipt image too large. Maximum 5MB.", "error");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast("Please upload an image file", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, receiptUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  // Totals
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryBreakdown = CATEGORIES.map((cat) => {
    const catExpenses = expenses.filter((e) => e.category === cat.value);
    return {
      ...cat,
      total: catExpenses.reduce((sum, e) => sum + e.amount, 0),
      count: catExpenses.length,
    };
  }).filter((c) => c.count > 0);

  // Mileage totals
  const totalKm = mileageEntries.reduce((sum, e) => sum + e.distance, 0);
  const totalDeduction = mileageEntries.reduce((sum, e) => sum + e.distance * e.ratePerKm, 0);
  const billableKm = mileageEntries.filter((e) => e.billable).reduce((sum, e) => sum + e.distance, 0);

  const fmtCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(amount);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });

  const getCategoryLabel = (value: string) =>
    CATEGORIES.find((c) => c.value === value)?.label || value;

  return (
    <div className="min-h-screen bg-[#0a0f1e] pb-20 md:pb-0 premium-glow">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Expenses</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full mt-2" />
            <p className="text-gray-400 mt-1">Track job costs, receipts &amp; deductions</p>
          </div>
          {activeTab === "expenses" ? (
            <button
              onClick={() => { resetForm(); setShowForm(!showForm); }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Expense
            </button>
          ) : (
            <button
              onClick={() => {
                if (userPlan !== "pro") {
                  setUpgradeFeature("Mileage Tracking");
                  setShowUpgrade(true);
                  return;
                }
                resetMileageForm();
                setShowMileageForm(!showMileageForm);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Log Mileage
            </button>
          )}
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-1 bg-[#111827] rounded-xl p-1 border border-gray-700/50 mb-10 w-fit">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "expenses"
                ? "bg-amber-500/15 text-amber-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab("mileage")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "mileage"
                ? "bg-amber-500/15 text-amber-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Mileage
            {userPlan !== "pro" && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">Pro</span>
            )}
          </button>
        </div>

        {activeTab === "expenses" ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="relative overflow-hidden bg-[#111827] backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 col-span-1 sm:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
                <p className="text-sm font-medium text-gray-400 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-red-400">{fmtCurrency(totalExpenses)}</p>
                <p className="text-sm text-gray-500 mt-1">{TIME_FILTERS.find((f) => f.value === timeFilter)?.label}</p>
              </div>
              {categoryBreakdown.slice(0, 3).map((cat) => (
                <div key={cat.value} className="relative overflow-hidden bg-[#111827] backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
                  <p className="text-sm font-medium text-gray-400 mb-1">{cat.label}</p>
                  <p className="text-xl font-bold text-white">{fmtCurrency(cat.total)}</p>
                  <p className="text-sm text-gray-500 mt-1">{cat.count} expense{cat.count !== 1 ? "s" : ""}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex gap-1 bg-[#111827] rounded-xl p-1 border border-gray-700/50">
                {TIME_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setTimeFilter(f.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      timeFilter === f.value
                        ? "bg-amber-500/15 text-amber-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
              <div className="bg-[#111827] backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 p-6 mb-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  {editingId ? "Edit Expense" : "New Expense"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Description *</label>
                      <input
                        type="text"
                        required
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="e.g. Screws and fixings for kitchen job"
                        className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Vendor / Supplier</label>
                      <input
                        type="text"
                        value={form.vendor}
                        onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                        placeholder="e.g. Screwfix, Toolstation"
                        className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Amount (EUR) *</label>
                      <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        placeholder="0.00"
                        className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Date *</label>
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  {/* Category Picker */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setForm({ ...form, category: cat.value })}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                            form.category === cat.value
                              ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                              : "bg-white/10/30 border-white/10 text-gray-400 hover:border-gray-600"
                          }`}
                        >
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
                          </svg>
                          <span className="truncate">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={2}
                      placeholder="Job reference, PO number, etc."
                      className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Receipt Upload */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Receipt Photo
                        {userPlan !== "pro" && (
                          <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">Pro</span>
                        )}
                      </label>
                      {userPlan === "pro" ? (
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d1321] border border-gray-700/50 text-gray-300 hover:border-gray-600 transition-all text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {form.receiptUrl ? "Change Receipt" : "Upload Receipt"}
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={handleReceiptUpload}
                              className="hidden"
                            />
                          </label>
                          {form.receiptUrl && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-green-400">Receipt attached</span>
                              <button
                                type="button"
                                onClick={() => setForm({ ...form, receiptUrl: "" })}
                                className="text-gray-500 hover:text-red-400 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setUpgradeFeature("Receipt Upload"); setShowUpgrade(true); }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10/30 border border-white/10/30 text-gray-500 text-sm cursor-pointer hover:border-amber-500/30 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Upload Receipt (Pro)
                        </button>
                      )}
                    </div>

                    {/* Tax Deductible Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.taxDeductible}
                        onChange={(e) => setForm({ ...form, taxDeductible: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-600 bg-white/10 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                      />
                      <span className="text-sm text-gray-300">Tax Deductible</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
                    >
                      {editingId ? "Update Expense" : "Save Expense"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); resetForm(); }}
                      className="px-6 py-2.5 rounded-xl font-semibold text-gray-400 bg-[#111827] border border-gray-700/50 hover:border-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Category Breakdown */}
            {categoryBreakdown.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-10">
                <div className="bg-[#111827] backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Spending by Category</h2>
                  <div className="space-y-3">
                    {categoryBreakdown.sort((a, b) => b.total - a.total).map((cat) => {
                      const pct = totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0;
                      return (
                        <div key={cat.value}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-300">{cat.label}</span>
                            <span className="text-sm font-semibold text-white">{fmtCurrency(cat.total)}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-[#111827] backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 p-6 flex items-center justify-center">
                  <DonutChart
                    segments={categoryBreakdown.sort((a, b) => b.total - a.total).map((cat) => ({
                      label: cat.label,
                      value: cat.total,
                      color: { materials: "#f97316", fuel: "#eab308", tools: "#3b82f6", subcontractor: "#a855f7", office: "#06b6d4", other: "#6b7280" }[cat.value] || "#6b7280",
                      displayValue: fmtCurrency(cat.total),
                    }))}
                    centerText={fmtCurrency(totalExpenses)}
                    centerSubtext="total expenses"
                    size={180}
                  />
                </div>
              </div>
            )}

            {/* Expenses List */}
            <div className="bg-[#111827] backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">
                  Expenses
                  <span className="ml-2 text-sm font-normal text-gray-500">({expenses.length})</span>
                </h2>
              </div>

              {loading ? (
                <div className="p-16 text-center">
                  <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
                </div>
              ) : expenses.length === 0 ? (
                <div className="p-16 text-center">
                  <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">No expenses yet</h3>
                  <p className="text-gray-400 mb-6">Start tracking your job costs and business expenses.</p>
                  <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Your First Expense
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/10/50">
                  {expenses.map((expense) => (
                    <div key={expense.id} className={`p-4 border-l-4 ${CATEGORY_BORDER_LEFT[expense.category] || CATEGORY_BORDER_LEFT.other} hover:bg-white/5 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-white truncate">{expense.description}</p>
                            {expense.receiptUrl && (
                              <button
                                onClick={() => setViewingReceipt(expense.receiptUrl)}
                                className="shrink-0 text-green-400 hover:text-green-300 transition-colors"
                                title="View receipt"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.other}`}>
                              {getCategoryLabel(expense.category)}
                            </span>
                            <span className="text-gray-500">{fmtDate(expense.date)}</span>
                            {expense.vendor && (
                              <span className="text-gray-500">
                                <span className="text-gray-600 mr-1">@</span>{expense.vendor}
                              </span>
                            )}
                            {expense.taxDeductible && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Tax deductible</span>
                            )}
                          </div>
                          {expense.notes && (
                            <p className="text-sm text-gray-500 mt-1 truncate">{expense.notes}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-white">{fmtCurrency(expense.amount)}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-white/10 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* ==================== MILEAGE TAB ==================== */
          <>
            {userPlan !== "pro" ? (
              <div className="relative overflow-hidden bg-[#111827] backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 p-16 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
                <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">Mileage Tracking</h3>
                <p className="text-gray-400 mb-4">Log business travel for tax deductions and client billing.</p>
                <p className="text-sm text-gray-500 mb-6">Track every kilometre, calculate deductions at the standard Dutch rate of {fmtCurrency(0.23)}/km.</p>
                <button
                  onClick={() => { setUpgradeFeature("Mileage Tracking"); setShowUpgrade(true); }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
                >
                  Upgrade to Pro
                </button>
              </div>
            ) : (
              <>
                {/* Mileage Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  <div className="relative overflow-hidden bg-[#111827] backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
                    <p className="text-sm font-medium text-gray-400 mb-1">Total Distance</p>
                    <p className="text-2xl font-bold text-blue-400">{totalKm.toFixed(1)} km</p>
                    <p className="text-sm text-gray-500 mt-1">{TIME_FILTERS.find((f) => f.value === timeFilter)?.label}</p>
                  </div>
                  <div className="relative overflow-hidden bg-[#111827] backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                    <p className="text-sm font-medium text-gray-400 mb-1">Tax Deduction</p>
                    <p className="text-2xl font-bold text-emerald-400">{fmtCurrency(totalDeduction)}</p>
                    <p className="text-sm text-gray-500 mt-1">at standard rates</p>
                  </div>
                  <div className="relative overflow-hidden bg-[#111827] backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
                    <p className="text-sm font-medium text-gray-400 mb-1">Billable</p>
                    <p className="text-2xl font-bold text-amber-400">{billableKm.toFixed(1)} km</p>
                    <p className="text-sm text-gray-500 mt-1">{mileageEntries.filter((e) => e.billable).length} trip{mileageEntries.filter((e) => e.billable).length !== 1 ? "s" : ""}</p>
                  </div>
                </div>

                {/* Tax Info Note */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-10 flex items-start gap-3 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                  <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-emerald-300 font-medium">Tax Deduction Info</p>
                    <p className="text-sm text-gray-400 mt-0.5">In the Netherlands, you can deduct {fmtCurrency(0.23)} per km for business travel. Keep a mileage log for your tax filing. This summary can be used as supporting documentation.</p>
                  </div>
                </div>

                {/* Time Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex gap-1 bg-[#111827] rounded-xl p-1 border border-gray-700/50">
                    {TIME_FILTERS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setTimeFilter(f.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          timeFilter === f.value
                            ? "bg-amber-500/15 text-amber-400"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Mileage Form */}
                {showMileageForm && (
                  <div className="bg-[#111827] backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 p-6 mb-10">
                    <h2 className="text-lg font-semibold text-white mb-4">Log Mileage</h2>
                    <form onSubmit={handleMileageSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Date *</label>
                          <input
                            type="date"
                            required
                            value={mileageForm.date}
                            onChange={(e) => setMileageForm({ ...mileageForm, date: e.target.value })}
                            className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">From *</label>
                          <input
                            type="text"
                            required
                            value={mileageForm.fromLocation}
                            onChange={(e) => setMileageForm({ ...mileageForm, fromLocation: e.target.value })}
                            placeholder="e.g. Office, Amsterdam"
                            className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">To *</label>
                          <input
                            type="text"
                            required
                            value={mileageForm.toLocation}
                            onChange={(e) => setMileageForm({ ...mileageForm, toLocation: e.target.value })}
                            placeholder="e.g. Client site, Rotterdam"
                            className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Distance (km) *</label>
                          <input
                            type="number"
                            required
                            min="0.1"
                            step="0.1"
                            value={mileageForm.distance}
                            onChange={(e) => setMileageForm({ ...mileageForm, distance: e.target.value })}
                            placeholder="0.0"
                            className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Purpose *</label>
                          <input
                            type="text"
                            required
                            value={mileageForm.purpose}
                            onChange={(e) => setMileageForm({ ...mileageForm, purpose: e.target.value })}
                            placeholder="e.g. Client visit - John Smith"
                            className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Rate per km</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={mileageForm.ratePerKm}
                            onChange={(e) => setMileageForm({ ...mileageForm, ratePerKm: e.target.value })}
                            className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-sm font-medium text-gray-400 mb-1">Client (optional)</label>
                          <select
                            value={mileageForm.clientId}
                            onChange={(e) => setMileageForm({ ...mileageForm, clientId: e.target.value })}
                            className="w-full bg-[#0d1321] border border-gray-700/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                          >
                            <option value="">No client</option>
                            {clients.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer mt-6">
                          <input
                            type="checkbox"
                            checked={mileageForm.billable}
                            onChange={(e) => setMileageForm({ ...mileageForm, billable: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-600 bg-white/10 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                          />
                          <span className="text-sm text-gray-300">Billable to client</span>
                        </label>
                      </div>

                      {mileageForm.distance && (
                        <div className="bg-white/10/30 rounded-xl px-4 py-3 text-sm border border-white/10/30">
                          <span className="text-gray-400">Deduction: </span>
                          <span className="text-emerald-400 font-semibold">
                            {fmtCurrency(parseFloat(mileageForm.distance || "0") * parseFloat(mileageForm.ratePerKm || "0.23"))}
                          </span>
                          <span className="text-gray-500 ml-2">({mileageForm.distance} km x {fmtCurrency(parseFloat(mileageForm.ratePerKm || "0.23"))}/km)</span>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
                        >
                          Save Mileage
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowMileageForm(false); resetMileageForm(); }}
                          className="px-6 py-2.5 rounded-xl font-semibold text-gray-400 bg-[#111827] border border-gray-700/50 hover:border-gray-600 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Mileage List */}
                <div className="bg-[#111827] backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                  <div className="p-6 border-b border-gray-700/50">
                    <h2 className="text-xl font-semibold text-white">
                      Mileage Log
                      <span className="ml-2 text-sm font-normal text-gray-500">({mileageEntries.length})</span>
                    </h2>
                  </div>

                  {mileageLoading ? (
                    <div className="p-16 text-center">
                      <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
                    </div>
                  ) : mileageEntries.length === 0 ? (
                    <div className="p-16 text-center">
                      <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <h3 className="text-xl font-semibold text-white mb-2">No mileage entries yet</h3>
                      <p className="text-gray-400 mb-6">Start logging your business travel to track deductions.</p>
                      <button
                        onClick={() => { resetMileageForm(); setShowMileageForm(true); }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Log Your First Trip
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/10/50">
                      {mileageEntries.map((entry) => (
                        <div key={entry.id} className="p-4 border-l-4 border-l-blue-500 hover:bg-white/5 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-white truncate">{entry.fromLocation} → {entry.toLocation}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20">
                                  {entry.distance} km
                                </span>
                                <span className="text-gray-500">{fmtDate(entry.date)}</span>
                                <span className="text-gray-400">{entry.purpose}</span>
                                {entry.client && (
                                  <span className="text-gray-500">
                                    <span className="text-gray-600 mr-1">@</span>{entry.client.name}
                                  </span>
                                )}
                                {entry.billable && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Billable</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-lg font-bold text-emerald-400">{fmtCurrency(entry.distance * entry.ratePerKm)}</p>
                              <p className="text-xs text-gray-500">{fmtCurrency(entry.ratePerKm)}/km</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleDeleteMileage(entry.id)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Receipt Viewer Modal */}
      {viewingReceipt && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setViewingReceipt(null)}
        >
          <div className="relative max-w-2xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setViewingReceipt(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={viewingReceipt}
              alt="Receipt"
              className="max-h-[80vh] rounded-xl border border-white/10 object-contain"
            />
          </div>
        </div>
      )}

      {showUpgrade && <UpgradeModal feature={upgradeFeature} onClose={() => setShowUpgrade(false)} />}
      <BottomNav />
    </div>
  );
}
