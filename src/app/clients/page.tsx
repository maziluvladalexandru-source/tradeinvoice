"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
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
      setClients([...clients, client]);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setShowForm(false);
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Clients</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-500 text-gray-950 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-amber-400"
          >
            {showForm ? "Cancel" : "+ Add Client"}
          </button>
        </div>

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

        {loading ? (
          <p className="text-gray-400 text-center py-12">Loading...</p>
        ) : clients.length === 0 ? (
          <div className="bg-gray-800/60 rounded-2xl p-12 border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">
              No clients yet. Add your first client to get started.
            </p>
          </div>
        ) : (
          <div className="bg-gray-800/60 rounded-2xl border border-gray-700 divide-y divide-gray-700">
            {clients.map((client) => (
              <div key={client.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{client.name}</p>
                  <p className="text-sm text-gray-400">{client.email}</p>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {client.phone && <p>{client.phone}</p>}
                  {client.address && <p>{client.address}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
