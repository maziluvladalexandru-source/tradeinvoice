"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import FloatingCreateButton from "@/components/FloatingCreateButton";
import InvoiceCardActions from "@/components/InvoiceCardActions";
import OnboardingChecklist from "@/components/OnboardingChecklist";
import NewInvoiceButton from "@/components/NewInvoiceButton";
import DonutChart from "@/components/DonutChart";
import Link from "next/link";

interface DashboardData {
  user: {
    name: string | null;
    plan: string;
    invoiceCount: number;
    businessName: string | null;
  };
  greeting: string;
  primaryCurrency: string;
  stats: {
    totalOutstanding: number;
    paidThisMonth: number;
    overdueCount: number;
    avgDaysToPayment: number | null;
    revenueLastMonth: number;
    revenueChange: number;
    activeClientsCount: number;
    recentlyViewedCount: number;
  };
  recentInvoices: {
    id: string;
    invoiceNumber: string;
    status: string;
    type: string;
    total: number;
    currency: string;
    dueDate: string;
    isRecurring: boolean;
    paidAmount: number;
    clientName: string;
    viewedAt: string | null;
  }[];
  recentQuotes: {
    id: string;
    invoiceNumber: string;
    status: string;
    type: string;
    total: number;
    currency: string;
    createdAt: string;
    clientName: string;
  }[];
  charts: {
    statusCounts: Record<string, number>;
    revenueBreakdown: { paid: number; outstanding: number; overdue: number };
    collectionRate: number;
    totalCollected: number;
    totalInvoiced: number;
  };
  totalInvoiceCount: number;
  hasBusinessName: boolean;
  hasSentInvoice: boolean;
  isNewUser: boolean;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/15 text-gray-400 ring-1 ring-gray-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold",
  sent: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold",
  viewed: "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold",
  paid: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold",
  overdue: "bg-red-500/15 text-red-400 ring-1 ring-red-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold",
};

const statusDot: Record<string, string> = {
  draft: "bg-gray-400",
  sent: "bg-blue-400",
  viewed: "bg-yellow-400",
  paid: "bg-green-400",
  overdue: "bg-red-400 animate-pulse",
};

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] pb-24 md:pb-0 premium-glow">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <div className="h-10 w-48 bg-gray-700/40 rounded-xl skeleton" />
            <div className="h-5 w-32 bg-gray-700/30 rounded-lg skeleton mt-3" />
          </div>
          <div className="h-11 w-40 bg-gray-700/40 rounded-xl skeleton" />
        </div>
        {/* Hero skeleton */}
        <div className="bg-[#111827] rounded-2xl p-8 border border-gray-700/50 mb-6 animate-fade-in">
          <div className="flex justify-between">
            <div>
              <div className="h-4 w-32 bg-gray-700/30 rounded-lg skeleton mb-3" />
              <div className="h-12 w-56 bg-gray-700/40 rounded-xl skeleton" />
            </div>
            <div>
              <div className="h-4 w-28 bg-gray-700/30 rounded-lg skeleton mb-3" />
              <div className="h-10 w-44 bg-gray-700/40 rounded-xl skeleton" />
            </div>
          </div>
          <div className="h-2 w-full bg-gray-700/30 rounded-full skeleton mt-6" />
        </div>
        {/* Secondary stats skeleton */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111827] rounded-xl p-4 border border-gray-700/50 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-3 w-20 bg-gray-700/30 rounded-lg skeleton mb-3" />
              <div className="h-7 w-16 bg-gray-700/40 rounded-lg skeleton" />
            </div>
          ))}
        </div>
        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-[#111827] rounded-2xl border border-gray-700/50 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="h-4 w-24 bg-gray-700/30 rounded-lg skeleton" />
                <div className="flex-1" />
                <div className="h-4 w-16 bg-gray-700/30 rounded-lg skeleton" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 bg-[#111827] rounded-2xl border border-gray-700/50 p-6">
            <div className="h-32 w-32 mx-auto bg-gray-700/30 rounded-full skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (res.status === 401) {
          router.push("/auth/login");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((d) => {
        if (d) setData(d);
      })
      .catch(() => setError(true));
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center premium-glow">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-400 text-lg font-medium mb-4">
            Failed to load dashboard
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 btn-press"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return <LoadingSkeleton />;

  const { user, greeting, stats, recentInvoices, recentQuotes, primaryCurrency } = data;
  const fc = (amount: number) => formatCurrency(amount, primaryCurrency);
  const collectionRate = data.charts.collectionRate;
  const totalForProgress = stats.totalOutstanding + stats.paidThisMonth;
  const paidPercent = totalForProgress > 0 ? (stats.paidThisMonth / totalForProgress) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0a0f1e] pb-24 md:pb-0 premium-glow">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Dashboard
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full mt-2" />
            <p className="text-gray-400 mt-1.5">
              {greeting}
              {user.name ? `, ${user.name}` : ""}
            </p>
          </div>
          <NewInvoiceButton isNewUser={data.isNewUser} />
        </div>

        {/* ROW 1 -- Hero Metric */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#111827] to-[#0d1321] rounded-2xl p-6 md:p-8 border border-gray-700/50 hover:border-amber-500/30 mb-6 shadow-xl shadow-black/20 transition-all duration-300 animate-slide-up card-hover">
          {/* Ambient amber glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/[0.06] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1.5">Total Outstanding</p>
              <p className="text-4xl md:text-5xl font-extrabold text-amber-400 tracking-tight tabular-nums">
                {fc(stats.totalOutstanding)}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1.5">Paid This Month</p>
              <p className="text-3xl font-bold text-emerald-400 tabular-nums">
                {fc(stats.paidThisMonth)}
              </p>
              {stats.revenueLastMonth > 0 && (
                <p className={`text-sm mt-1.5 font-medium ${stats.revenueChange >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                  {stats.revenueChange >= 0 ? "\u2191" : "\u2193"}{" "}
                  {Math.abs(Math.round(stats.revenueChange))}% vs last month
                </p>
              )}
            </div>
          </div>
          {/* Collection progress bar */}
          <div className="relative mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-medium">
              <span>Collection progress</span>
              <span className="tabular-nums">{Math.round(paidPercent)}% collected</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${paidPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* ROW 2 -- Secondary Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          <div className={`bg-[#111827] rounded-xl p-4 border border-gray-700/50 hover:border-red-500/30 transition-all duration-200 card-hover stagger-item ${stats.overdueCount > 0 ? "border-t-2 border-t-red-500" : "border-t-2 border-t-gray-700/30"}`}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Overdue</p>
            <p className={`text-xl font-bold mt-1 tabular-nums ${stats.overdueCount > 0 ? "text-red-400" : "text-gray-600"}`}>
              {stats.overdueCount}
              {stats.overdueCount > 0 && (
                <svg className="w-4 h-4 text-red-400 animate-pulse inline ml-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
            </p>
          </div>
          <div className="bg-[#111827] rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-200 border-t-2 border-t-blue-500/40 card-hover stagger-item">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Days to Pay</p>
            <p className="text-xl font-bold text-blue-400 mt-1 tabular-nums">
              {stats.avgDaysToPayment !== null ? stats.avgDaysToPayment : "--"}
            </p>
          </div>
          <div className="bg-[#111827] rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200 border-t-2 border-t-purple-500/40 card-hover stagger-item">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Clients</p>
            <p className="text-xl font-bold text-purple-400 mt-1 tabular-nums">{stats.activeClientsCount}</p>
          </div>
        </div>

        {/* Plan info */}
        {user.plan === "free" && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6 flex items-center justify-between hover:border-amber-500/30 transition-all duration-200">
            <div>
              <p className="font-medium text-amber-400">
                Free Plan: {user.invoiceCount}/20 invoices used this month
              </p>
              <p className="text-sm text-amber-500/70">
                Upgrade to Pro for unlimited invoices
              </p>
            </div>
            <Link
              href="/settings"
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.02] btn-press"
            >
              Upgrade
            </Link>
          </div>
        )}

        {/* ROW 3 -- Two Columns: Recent Invoices + Quick Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Left: Recent Invoices (3/5 = 60%) */}
          <div className="lg:col-span-3 bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-amber-500/20 transition-all duration-300 shadow-lg shadow-black/10">
            <div className="px-5 py-4 border-b border-gray-700/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recent Invoices</h2>
              {recentInvoices.length > 0 && (
                <Link href="/invoices" className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors duration-200">
                  View All
                </Link>
              )}
            </div>

            {recentInvoices.length === 0 ? (
              <div className="p-12 text-center animate-fade-in">
                <div className="w-28 h-28 mx-auto mb-6">
                  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <rect x="50" y="30" width="100" height="130" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2" />
                    <rect x="68" y="75" width="64" height="6" rx="3" fill="#374151" />
                    <rect x="68" y="90" width="48" height="6" rx="3" fill="#374151" />
                    <rect x="68" y="105" width="56" height="6" rx="3" fill="#374151" />
                    <circle cx="140" cy="145" r="18" fill="#f59e0b" opacity="0.2" />
                    <path d="M140 137 L140 153 M132 145 L148 145" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No invoices yet</h3>
                <p className="text-gray-400 text-sm mb-6">Create your first invoice to start tracking payments.</p>
                <Link
                  href="/invoices/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.02] btn-press"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Invoice
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-700/30">
                {recentInvoices.slice(0, 5).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="group px-5 py-3 hover:bg-white/[0.03] transition-all duration-200"
                  >
                    {/* Desktop row - fixed columns for alignment */}
                    <div className="hidden sm:grid items-center gap-3" style={{ gridTemplateColumns: "1fr 90px 100px 80px" }}>
                      <Link href={`/invoices/${invoice.id}`} className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-sm group-hover:text-amber-400 transition-colors duration-200">{invoice.invoiceNumber}</span>
                          <span className="text-gray-500 text-sm truncate">{invoice.clientName}</span>
                        </div>
                      </Link>
                      <span className={`inline-flex items-center gap-1 capitalize whitespace-nowrap ${statusColors[invoice.status] || ""}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[invoice.status] || ""}`} />
                        {invoice.status}
                      </span>
                      <span className="text-sm font-semibold text-white text-right tabular-nums">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </span>
                      {/* Hover-only actions */}
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-end gap-0.5">
                        <InvoiceCardActions invoiceId={invoice.id} status={invoice.status} type={invoice.type} />
                        <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-gray-700/50 transition-all duration-200" title="Download PDF" aria-label="Download PDF">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    {/* Mobile row */}
                    <div className="sm:hidden">
                      <Link href={`/invoices/${invoice.id}`} className="block">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-white text-sm">{invoice.invoiceNumber}</span>
                            <span className="text-gray-500 text-sm ml-2 truncate">{invoice.clientName}</span>
                          </div>
                          <span className="text-sm font-semibold text-white whitespace-nowrap tabular-nums">
                            {formatCurrency(invoice.total, invoice.currency)}
                          </span>
                        </div>
                      </Link>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className={`inline-flex items-center gap-1 capitalize ${statusColors[invoice.status] || ""}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[invoice.status] || ""}`} />
                          {invoice.status}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <InvoiceCardActions invoiceId={invoice.id} status={invoice.status} type={invoice.type} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Quick Insights (2/5 = 40%) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Mini Donut: Invoice Status */}
            {data.totalInvoiceCount > 0 && (
              <div className="bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-amber-500/20 p-5 transition-all duration-300 shadow-lg shadow-black/10 card-hover">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Invoice Status</h3>
                <div className="flex justify-center">
                  <DonutChart
                    segments={[
                      { label: "Draft", value: data.charts.statusCounts.draft || 0, color: "#6b7280", displayValue: String(data.charts.statusCounts.draft || 0) },
                      { label: "Sent", value: data.charts.statusCounts.sent || 0, color: "#3b82f6", displayValue: String(data.charts.statusCounts.sent || 0) },
                      { label: "Viewed", value: data.charts.statusCounts.viewed || 0, color: "#eab308", displayValue: String(data.charts.statusCounts.viewed || 0) },
                      { label: "Paid", value: data.charts.statusCounts.paid || 0, color: "#22c55e", displayValue: String(data.charts.statusCounts.paid || 0) },
                      { label: "Overdue", value: data.charts.statusCounts.overdue || 0, color: "#ef4444", displayValue: String(data.charts.statusCounts.overdue || 0) },
                    ]}
                    centerText={String(data.totalInvoiceCount)}
                    centerSubtext="invoices"
                    size={140}
                  />
                </div>
              </div>
            )}

            {/* Revenue This Month */}
            <div className="bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-emerald-500/20 p-5 transition-all duration-300 shadow-lg shadow-black/10 card-hover">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Revenue This Month</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-white tabular-nums">{fc(stats.paidThisMonth)}</p>
                {stats.revenueLastMonth > 0 && (
                  <span className={`text-sm font-medium ${stats.revenueChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {stats.revenueChange >= 0 ? "\u2191" : "\u2193"} {Math.abs(Math.round(stats.revenueChange))}%
                  </span>
                )}
              </div>
            </div>

            {/* Collection Rate */}
            <div className="bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-emerald-500/20 p-5 transition-all duration-300 shadow-lg shadow-black/10 card-hover">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Collection Rate</h3>
              <p className="text-2xl font-bold text-white mb-2 tabular-nums">{collectionRate}%</p>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${collectionRate}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1.5 font-medium">
                <span className="tabular-nums">{fc(data.charts.totalCollected)} collected</span>
                <span className="tabular-nums">{fc(data.charts.totalInvoiced)} invoiced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Quotes */}
        {recentQuotes.length > 0 && (
          <div className="bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-purple-500/20 mb-6 transition-all duration-300 shadow-lg shadow-black/10">
            <div className="px-5 py-4 border-b border-gray-700/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                Recent Quotes
                <span className="bg-purple-500/15 text-purple-300 ring-1 ring-purple-400/30 px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums">
                  {recentQuotes.length}
                </span>
              </h2>
            </div>
            <div className="divide-y divide-gray-700/30">
              {recentQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="group px-5 py-3 hover:bg-white/[0.03] transition-all duration-200"
                >
                  <div className="grid items-center gap-3" style={{ gridTemplateColumns: "1fr 90px 100px 40px" }}>
                    <Link href={`/invoices/${quote.id}`} className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm group-hover:text-amber-400 transition-colors duration-200">{quote.invoiceNumber}</span>
                        <span className="text-gray-500 text-sm truncate">{quote.clientName}</span>
                      </div>
                    </Link>
                    <span className={`inline-flex items-center gap-1 capitalize whitespace-nowrap ${statusColors[quote.status] || ""}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[quote.status] || ""}`} />
                      {quote.status}
                    </span>
                    <span className="text-sm font-semibold text-white text-right tabular-nums">
                      {formatCurrency(quote.total, quote.currency)}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex justify-end">
                      <InvoiceCardActions invoiceId={quote.id} status={quote.status} type="quote" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROW 4 -- Onboarding (bottom, auto-hides when complete) */}
        <OnboardingChecklist
          hasBusinessName={data.hasBusinessName}
          invoiceCount={data.totalInvoiceCount}
          hasSentInvoice={data.hasSentInvoice}
        />
      </div>

      <FloatingCreateButton />
      <BottomNav />
    </div>
  );
}
