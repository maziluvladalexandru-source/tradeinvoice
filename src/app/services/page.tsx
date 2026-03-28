"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

interface ServiceItem {
  id: string;
  name: string;
  description: string | null;
  unitPrice: number;
  unit: string;
}

const UNITS = [
  { value: "unit", label: "Unit" },
  { value: "hour", label: "Hour" },
  { value: "day", label: "Day" },
  { value: "fixed", label: "Fixed" },
  { value: "m²", label: "m²" },
  { value: "m", label: "Metre" },
];

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(amount);
}

export default function ServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState<number | string>("");
  const [unit, setUnit] = useState("unit");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/service-items");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setDescription("");
    setUnitPrice("");
    setUnit("unit");
    setFormError("");
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(item: ServiceItem) {
    setName(item.name);
    setDescription(item.description || "");
    setUnitPrice(item.unitPrice);
    setUnit(item.unit);
    setEditingId(item.id);
    setShowForm(true);
    setFormError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!unitPrice || Number(unitPrice) < 0) {
      setFormError("Enter a valid price");
      return;
    }

    setSaving(true);
    try {
      const body = { name: name.trim(), description: description.trim() || null, unitPrice: Number(unitPrice), unit };

      if (editingId) {
        const res = await fetch(`/api/service-items/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json();
          setFormError(data.error || "Failed to update");
          return;
        }
        const updated = await res.json();
        setItems(items.map((i) => (i.id === editingId ? updated : i)));
      } else {
        const res = await fetch("/api/service-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json();
          setFormError(data.error || "Failed to create");
          return;
        }
        const created = await res.json();
        setItems([...items, created].sort((a, b) => a.name.localeCompare(b.name)));
      }
      resetForm();
    } catch {
      setFormError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/service-items/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== id));
        setDeleteConfirm(null);
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Service Library</h1>
            <p className="text-gray-500 text-sm mt-2">
              Save commonly used items to quickly add them to invoices
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 mb-8 animate-fade-in">
            <h2 className="text-base font-semibold text-white mb-4">
              {editingId ? "Edit Service Item" : "New Service Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Boiler repair"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-700/50 text-sm focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all outline-none bg-gray-800/50 text-white placeholder-gray-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Standard boiler service and repair"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-700/50 text-sm focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all outline-none bg-gray-800/50 text-white placeholder-gray-500"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-700/50 text-sm focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all outline-none bg-gray-800/50 text-white placeholder-gray-500"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-700/50 text-sm focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all outline-none bg-gray-800/50 text-white"
                  >
                    {UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {formError && <p className="text-red-400 text-sm">{formError}</p>}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900/50 rounded-2xl p-5 border border-gray-800/50">
                <div className="h-5 w-40 bg-gray-800 rounded animate-pulse mb-2" />
                <div className="h-4 w-24 bg-gray-800/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-800/50 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="relative text-white font-semibold text-lg mb-2">No saved items yet</h3>
            <p className="relative text-gray-500 text-sm mb-6">
              Add your commonly used services and materials to speed up invoice creation.
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="relative text-amber-500 font-medium text-sm hover:underline"
            >
              + Add your first item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-gray-800/50 flex items-center gap-4 group hover:border-gray-700/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium text-sm truncate">{item.name}</h3>
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-800/80 px-2 py-0.5 rounded-full shrink-0">
                      per {item.unit}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{item.description}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="text-white font-semibold text-sm tabular-nums">
                    {formatPrice(item.unitPrice)}
                  </span>
                </div>
                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 text-gray-400 hover:text-amber-400 transition-colors rounded-lg hover:bg-gray-800/50"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  {deleteConfirm === item.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800/50"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
