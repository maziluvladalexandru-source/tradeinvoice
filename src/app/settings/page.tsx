"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import UpgradeModal, { ProBadge } from "@/components/UpgradeModal";
import { toast } from "@/components/Toast";

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
  bankDetails: string | null;
  logoUrl: string | null;
  plan: string;
  invoiceCount: number;
}

interface BankDetailsStructured {
  iban: string;
  bankName: string;
  bic: string;
  accountHolder: string;
}

function formatIBAN(value: string): string {
  const clean = value.replace(/\s/g, "").toUpperCase();
  return clean.replace(/(.{4})/g, "$1 ").trim();
}

function parseBankDetails(raw: string | null): BankDetailsStructured {
  if (!raw) return { iban: "", bankName: "", bic: "", accountHolder: "" };
  try {
    const parsed = JSON.parse(raw);
    if (parsed.iban !== undefined) return parsed;
  } catch {
    // Legacy format: parse from text
  }
  const lines = raw.split("\n");
  let iban = "";
  let bankName = "";
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.startsWith("iban:")) iban = line.replace(/^iban:\s*/i, "").trim();
    else if (lower.startsWith("bank:")) bankName = line.replace(/^bank:\s*/i, "").trim();
  }
  return { iban, bankName, bic: "", accountHolder: "" };
}

function serializeBankDetails(details: BankDetailsStructured): string {
  return JSON.stringify(details);
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
  const [logoUrl, setLogoUrl] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);

  // Structured bank details
  const [iban, setIban] = useState("");
  const [bankName, setBankName] = useState("");
  const [bic, setBic] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("");

  const isPro = user?.plan === "pro";

  function showProPrompt(feature: string) {
    setUpgradeFeature(feature);
    setShowUpgradeModal(true);
  }

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
        setLogoUrl(u.logoUrl || "");
        const bd = parseBankDetails(u.bankDetails);
        setIban(bd.iban);
        setBankName(bd.bankName);
        setBic(bd.bic);
        setAccountHolder(bd.accountHolder);
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const bankDetails = serializeBankDetails({ iban: iban.replace(/\s/g, ""), bankName, bic, accountHolder });
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, businessName, businessAddress, businessPhone, kvkNumber, vatNumber, bankDetails }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      toast("Settings saved successfully");
    } else {
      toast("Failed to save settings", "error");
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

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      toast("Please upload a JPG or PNG image", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast("Logo must be under 2MB", "error");
      return;
    }

    setLogoUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl: base64 }),
      });
      if (res.ok) {
        setLogoUrl(base64);
        const updated = await res.json();
        setUser(updated);
        toast("Logo uploaded");
      }
      setLogoUploading(false);
    };
    reader.readAsDataURL(file);
  }

  async function removeLogo() {
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoUrl: "" }),
    });
    if (res.ok) {
      setLogoUrl("");
      const updated = await res.json();
      setUser(updated);
      toast("Logo removed");
    }
  }

  const hasBankDetails = iban || bankName;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 pb-20 md:pb-0">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="h-10 w-32 bg-gray-800 rounded-xl animate-pulse mb-8" />
          {/* Skeleton cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50 mb-6 space-y-4">
              <div className="h-5 w-40 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-800/50 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-12 bg-gray-800/30 rounded-xl animate-pulse" />
                <div className="h-12 bg-gray-800/30 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-20 md:pb-0">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Settings</h1>

        {upgraded && (
          <div className="bg-green-900/50 text-green-400 p-4 rounded-xl mb-6 font-medium">
            You&apos;ve been upgraded to Pro! Enjoy unlimited invoices.
          </div>
        )}

        {/* Subscription */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
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
                  : `${user?.invoiceCount || 0}/20 invoices used this month`}
              </p>
            </div>
            {user?.plan !== "pro" && (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold text-lg shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {upgrading ? "Loading..." : "Upgrade to Pro - \u20AC15/mo"}
              </button>
            )}
            {user?.plan === "pro" && (
              <span className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full font-medium border border-emerald-500/20">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Logo Upload */}
        <div className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 mb-6 relative ${!isPro ? "overflow-hidden" : ""}`}>
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            Invoice Logo
            {!isPro && <ProBadge onClick={() => showProPrompt("Custom branding & logo")} />}
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Upload your business logo to display on invoices and client views. JPG or PNG, max 2MB.
          </p>
          {!isPro && (
            <div
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center cursor-pointer z-10"
              onClick={() => showProPrompt("Custom branding & logo")}
            >
              <div className="text-center">
                <span className="text-2xl mb-2 block">🔒</span>
                <p className="text-amber-400 font-semibold text-sm">Upgrade to Pro to add your logo</p>
              </div>
            </div>
          )}
          <div className={logoUrl ? "flex items-center gap-6" : ""}>
            {logoUrl ? (
              <>
                <div className="relative">
                  <img src={logoUrl} alt="Business logo" className="w-20 h-20 rounded-xl object-contain border border-gray-600 bg-white p-1" />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-400"
                    title="Remove logo"
                    aria-label="Remove logo"
                  >
                    &times;
                  </button>
                </div>
                <div>
                  <label className="cursor-pointer bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-4 py-2 rounded-lg font-medium text-sm shadow-lg shadow-amber-500/20 transition-all inline-block">
                    {logoUploading ? "Uploading..." : "Upload Logo"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={logoUploading}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Logo will appear on all your invoices</p>
                </div>
              </>
            ) : (
              <label className="w-full py-8 rounded-2xl border-2 border-dashed border-gray-700 hover:border-amber-500/30 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                <span className="text-sm text-gray-400">Drag &amp; drop or click to upload</span>
                <span className="text-xs text-gray-500">{logoUploading ? "Uploading..." : "JPG or PNG, max 2MB"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={logoUploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Profile */}
        <form
          onSubmit={handleSave}
          className="space-y-6"
        >
          {/* Business Information */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              Business Information
            </h2>
            <p className="text-sm text-gray-400">
              These details appear on your invoices and client communications.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Your Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Murphy"
                  className="w-full px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white placeholder-gray-500 transition-all"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white placeholder-gray-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Business Address
              </label>
              <input
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="123 Main St, Amsterdam"
                className="w-full px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white placeholder-gray-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Business Phone
              </label>
              <input
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="+31 20 123 4567"
                className="w-full px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white placeholder-gray-500 transition-all"
              />
            </div>
          </div>

          {/* Tax & Registration */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Tax &amp; Registration
            </h2>
            <p className="text-sm text-gray-400">
              Registration numbers shown on invoices for legal compliance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Business Registration Number
                </label>
                <input
                  value={kvkNumber}
                  onChange={(e) => setKvkNumber(e.target.value)}
                  placeholder="12345678"
                  className="w-full px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white placeholder-gray-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  KVK (NL), Companies House (UK), Handelsregister (DE)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tax ID / VAT Number
                </label>
                <input
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  placeholder="NL123456789B01"
                  className="w-full px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white placeholder-gray-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  BTW-id (NL), VAT number (UK), USt-IdNr (DE)
                </p>
              </div>
            </div>
          </div>

          {/* Bank / Payment Details */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              Payment Details
            </h2>
            <p className="text-sm text-gray-400">
              Bank account details shown on all your invoices so clients know where to pay.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                IBAN
              </label>
              <input
                value={formatIBAN(iban)}
                onChange={(e) => setIban(e.target.value.replace(/\s/g, "").toUpperCase())}
                placeholder="NL91 ABNA 0417 1643 00"
                maxLength={42}
                className="w-full px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white placeholder-gray-500 transition-all font-mono tracking-wider"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Bank Name
                </label>
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="ABN AMRO"
                  className="w-full px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white placeholder-gray-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  BIC/SWIFT <span className="text-gray-600">(optional)</span>
                </label>
                <input
                  value={bic}
                  onChange={(e) => setBic(e.target.value.toUpperCase())}
                  placeholder="ABNANL2A"
                  maxLength={11}
                  className="w-full px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white placeholder-gray-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Account Holder Name <span className="text-gray-600">(optional, defaults to business name)</span>
              </label>
              <input
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder={businessName || "Your business name"}
                className="w-full px-4 py-3 rounded-xl border border-gray-800/50 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none bg-gray-900/50 text-white placeholder-gray-500 transition-all"
              />
            </div>

            {/* Invoice Preview */}
            {hasBankDetails && (
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preview on invoice</p>
                <div className="bg-white rounded-xl p-4 text-gray-900">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Information</p>
                  <div className="space-y-1 text-sm">
                    {iban && (
                      <div className="flex gap-2">
                        <span className="text-gray-400 w-14 flex-shrink-0">IBAN</span>
                        <span className="font-mono font-medium">{formatIBAN(iban)}</span>
                      </div>
                    )}
                    {bic && (
                      <div className="flex gap-2">
                        <span className="text-gray-400 w-14 flex-shrink-0">BIC</span>
                        <span className="font-mono font-medium">{bic}</span>
                      </div>
                    )}
                    {bankName && (
                      <div className="flex gap-2">
                        <span className="text-gray-400 w-14 flex-shrink-0">Bank</span>
                        <span className="font-medium">{bankName}</span>
                      </div>
                    )}
                    {(accountHolder || businessName) && (
                      <div className="flex gap-2">
                        <span className="text-gray-400 w-14 flex-shrink-0">Name</span>
                        <span className="font-medium">{accountHolder || businessName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3.5 rounded-xl font-semibold text-lg shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Data Export */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 mt-6">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Data Export
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Download all your data (profile, clients, invoices) as a JSON file. This is your right under GDPR Article 20.
          </p>
          <a
            href="/api/user/export"
            download
            className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
          >
            Export My Data
          </a>
        </div>

        {/* Delete Account */}
        <div className="bg-red-500/5 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 mt-6">
          <h2 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285zm0 13.036h.008v.008H12v-.008z" />
            </svg>
            Danger Zone
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-red-500/20 transition-all"
          >
            Delete My Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-red-400 mb-4">Delete Account</h3>
              <p className="text-gray-300 mb-4">
                This will permanently delete your account, all invoices, all clients, and all data.
                This cannot be undone.
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Type <span className="font-mono text-red-400 font-bold">DELETE</span> to confirm.
              </p>
              {deleteError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm">
                  {deleteError}
                </div>
              )}
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 mb-4 focus:ring-2 focus:ring-red-500 outline-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation("");
                    setDeleteError("");
                  }}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setDeleting(true);
                    setDeleteError("");
                    try {
                      const res = await fetch("/api/user/delete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ confirmation: deleteConfirmation }),
                      });
                      if (!res.ok) {
                        const data = await res.json();
                        setDeleteError(data.error || "Failed to delete account");
                        return;
                      }
                      window.location.href = "/";
                    } catch {
                      setDeleteError("Something went wrong. Please try again.");
                    } finally {
                      setDeleting(false);
                    }
                  }}
                  disabled={deleteConfirmation !== "DELETE" || deleting}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? "Deleting..." : "Delete Forever"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
      {showUpgradeModal && (
        <UpgradeModal feature={upgradeFeature} onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
}
