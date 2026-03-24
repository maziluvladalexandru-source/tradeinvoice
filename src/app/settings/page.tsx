"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}

interface User {
  id: string;
  email: string;
  name: string | null;
  businessName: string | null;
  businessAddress: string | null;
  businessPhone: string | null;
  kvkNumber: string | null;
  vatNumber: string | null;
  plan: string;
  invoiceCount: number;
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded");

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [kvkNumber, setKvkNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  useEffect(() => {
    fetch("/api/user")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((u: User) => {
        setUser(u);
        setName(u.name || "");
        setBusinessName(u.businessName || "");
        setBusinessAddress(u.businessAddress || "");
        setBusinessPhone(u.businessPhone || "");
        setKvkNumber(u.kvkNumber || "");
        setVatNumber(u.vatNumber || "");
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, businessName, businessAddress, businessPhone, kvkNumber, vatNumber }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
    }
    setSaving(false);
  }

  async function handleUpgrade() {
    setUpgrading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    }
    setUpgrading(false);
  }

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

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        {upgraded && (
          <div className="bg-green-900/50 text-green-400 p-4 rounded-xl mb-6 font-medium">
            You&apos;ve been upgraded to Pro! Enjoy unlimited invoices.
          </div>
        )}

        {/* Subscription */}
        <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Subscription
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium text-white">
                {user?.plan === "pro" ? "Pro Plan" : "Free Plan"}
              </p>
              <p className="text-gray-400">
                {user?.plan === "pro"
                  ? "Unlimited invoices per month"
                  : `${user?.invoiceCount || 0}/5 invoices used this month`}
              </p>
            </div>
            {user?.plan !== "pro" && (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="bg-amber-500 text-gray-950 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-amber-400 disabled:opacity-50"
              >
                {upgrading ? "Loading..." : "Upgrade to Pro - €15/mo"}
              </button>
            )}
            {user?.plan === "pro" && (
              <span className="bg-green-900/50 text-green-400 px-4 py-2 rounded-full font-medium">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Profile */}
        <form
          onSubmit={handleSave}
          className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white mb-2">
            Business Details
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            These details appear on your invoices.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Your Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Murphy"
              className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Business Name
            </label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Murphy Plumbing Ltd"
              className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Business Address
            </label>
            <input
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="123 Main St, Dublin"
              className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Business Phone
            </label>
            <input
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              placeholder="+353 1 234 5678"
              className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              KVK Number <span className="text-gray-500">(optional, shown on invoices)</span>
            </label>
            <input
              value={kvkNumber}
              onChange={(e) => setKvkNumber(e.target.value)}
              placeholder="12345678"
              className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              BTW / VAT Number <span className="text-gray-500">(optional, required for VAT-registered businesses)</span>
            </label>
            <input
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              placeholder="NL123456789B01"
              className="w-full px-4 py-3 rounded-xl border border-gray-600 text-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-amber-500 text-gray-950 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-amber-400 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

