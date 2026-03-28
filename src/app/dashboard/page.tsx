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
  draft: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
  sent: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  viewed: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  overdue: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const statusDot: Record<string, string> = {
  draft: "bg-gray-400",
  sent: "bg-blue-400",
  viewed: "bg-yellow-400",
  paid: "bg-green-400",
  overdue: "bg-red-400 animate-pulse",
};

const statusBorder: Record<string, string> = {
  draft: "border-l-gray-500",
  sent: "border-l-blue-500",
  viewed: "border-l-yellow-500",
  paid: "border-l-green-500",
  overdue: "border-l-red-500",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
  });
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-950 pb-20 md:pb-0">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="h-10 w-48 bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-5 w-32 bg-gray-800 rounded-lg animate-pulse mt-2" />
          </div>
          <div className="h-10 w-40 bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-900/50 rounded-2xl p-5 md:p-6 border border-gray-800/50"
            >
              <div className="h-4 w-28 bg-gray-800 rounded animate-pulse mb-3" />
              <div className="h-8 w-36 bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800/50">
          <div className="p-6 border-b border-gray-800/50">
            <div className="h-6 w-40 bg-gray-800 rounded animate-pulse" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 border-b border-gray-800/50 flex items-center gap-3"
            >
              <div className="h-5 w-24 bg-gray-800 rounded animate-pulse" />
              <div className="flex-1" />
              <div className="h-5 w-16 bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-20 bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">
            Failed to load dashboard
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-amber-500 hover:text-amber-400 font-medium"
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

  return (
    <div className="min-h-screen bg-gray-950 pb-20 md:pb-0">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              {greeting}
              {user.name ? `, ${user.name}` : ""}
            </p>
          </div>
          <NewInvoiceButton isNewUser={data.isNewUser} />
        </div>

        {/* Onboarding checklist */}
        <OnboardingChecklist
          hasBusinessName={data.hasBusinessName}
          invoiceCount={data.totalInvoiceCount}
          hasSentInvoice={data.hasSentInvoice}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            <p className="text-sm font-medium text-gray-400 mb-1">
              Total Outstanding
            </p>
            <p className="text-lg md:text-2xl font-bold text-white truncate">
              {fc(stats.totalOutstanding)}
            </p>
          </div>
          <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            <p className="text-sm font-medium text-gray-400 mb-1">
              Paid This Month
            </p>
            <p className="text-lg md:text-2xl font-bold text-green-400 truncate">
              {fc(stats.paidThisMonth)}
            </p>
            {stats.revenueLastMonth > 0 && (
              <p
                className={`text-sm mt-1 ${stats.revenueChange >= 0 ? "text-green-500" : "text-red-400"}`}
              >
                {stats.revenueChange >= 0 ? "\u2191" : "\u2193"}{" "}
                {Math.abs(Math.round(stats.revenueChange))}% vs last month
              </p>
            )}
          </div>
          <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
            <p className="text-sm font-medium text-gray-400 mb-1">
              Overdue Invoices
            </p>
            <div className="flex items-center gap-2">
              <p className="text-lg md:text-2xl font-bold text-red-400">
                {stats.overdueCount}
              </p>
              {stats.overdueCount > 0 && (
                <svg
                  className="w-5 h-5 text-red-400 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              )}
            </div>
          </div>
          {stats.avgDaysToPayment !== null && (
            <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
              <p className="text-sm font-medium text-gray-400 mb-1">
                Avg. Days to Payment
              </p>
              <p className="text-lg md:text-2xl font-bold text-blue-400">
                {stats.avgDaysToPayment}
              </p>
              <p className="text-sm text-gray-500 mt-1">days</p>
            </div>
          )}
          <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
            <p className="text-sm font-medium text-gray-400 mb-1">
              Active Clients
            </p>
            <p className="text-lg md:text-2xl font-bold text-purple-400">
              {stats.activeClientsCount}
            </p>
            <p className="text-sm text-gray-500 mt-1">last 90 days</p>
          </div>
        </div>

        {/* Donut Charts */}
        {data.totalInvoiceCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Invoice Status */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-5 md:p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Invoice Status</h3>
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
                size={180}
              />
            </div>

            {/* Revenue This Month */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-5 md:p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Revenue This Month</h3>
              <DonutChart
                segments={[
                  { label: "Paid", value: data.charts.revenueBreakdown.paid, color: "#22c55e", displayValue: fc(data.charts.revenueBreakdown.paid) },
                  { label: "Outstanding", value: data.charts.revenueBreakdown.outstanding, color: "#f59e0b", displayValue: fc(data.charts.revenueBreakdown.outstanding) },
                  { label: "Overdue", value: data.charts.revenueBreakdown.overdue, color: "#ef4444", displayValue: fc(data.charts.revenueBreakdown.overdue) },
                ]}
                centerText={fc(data.charts.revenueBreakdown.paid + data.charts.revenueBreakdown.outstanding + data.charts.revenueBreakdown.overdue)}
                centerSubtext="total"
                size={180}
              />
            </div>

            {/* Collection Rate */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-5 md:p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Collection Rate</h3>
              <DonutChart
                segments={[
                  { label: "Collected", value: data.charts.totalCollected, color: "#22c55e", displayValue: fc(data.charts.totalCollected) },
                  { label: "Uncollected", value: data.charts.totalInvoiced - data.charts.totalCollected, color: "#374151", displayValue: fc(data.charts.totalInvoiced - data.charts.totalCollected) },
                ]}
                centerText={`${data.charts.collectionRate}%`}
                centerSubtext="collected"
                size={180}
              />
            </div>
          </div>
        )}

        {/* Plan info */}
        {user.plan === "free" && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 mb-8 flex items-center justify-between">
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
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all"
            >
              Upgrade
            </Link>
          </div>
        )}

        {/* Recently viewed banner */}
        {stats.recentlyViewedCount > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3">
            <svg
              className="w-5 h-5 text-yellow-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <p className="text-sm font-medium text-yellow-300">
              {stats.recentlyViewedCount} invoice
              {stats.recentlyViewedCount !== 1 ? "s were" : " was"} viewed today
            </p>
          </div>
        )}

        {/* Recent invoices */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50">
          <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Recent Invoices
            </h2>
            {/* View all link - needs dedicated invoices list page */}
          </div>

          {recentInvoices.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-40 h-40 mx-auto mb-8">
                <svg
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <rect
                    x="50"
                    y="30"
                    width="100"
                    height="130"
                    rx="8"
                    fill="#1f2937"
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <rect
                    x="50"
                    y="30"
                    width="100"
                    height="130"
                    rx="8"
                    fill="url(#emptyGrad)"
                    opacity="0.5"
                  />
                  <path
                    d="M120 30 L150 30 L150 60 Z"
                    fill="#111827"
                    stroke="#374151"
                    strokeWidth="1"
                  />
                  <path
                    d="M120 30 L120 55 C120 57.7614 122.239 60 125 60 L150 60"
                    fill="#1f2937"
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <rect
                    x="68"
                    y="75"
                    width="64"
                    height="6"
                    rx="3"
                    fill="#374151"
                  />
                  <rect
                    x="68"
                    y="90"
                    width="48"
                    height="6"
                    rx="3"
                    fill="#374151"
                  />
                  <rect
                    x="68"
                    y="105"
                    width="56"
                    height="6"
                    rx="3"
                    fill="#374151"
                  />
                  <rect
                    x="68"
                    y="120"
                    width="36"
                    height="6"
                    rx="3"
                    fill="#374151"
                  />
                  <circle
                    cx="140"
                    cy="145"
                    r="24"
                    fill="#f59e0b"
                    opacity="0.15"
                  />
                  <circle
                    cx="140"
                    cy="145"
                    r="18"
                    fill="#f59e0b"
                    opacity="0.25"
                  />
                  <path
                    d="M140 137 L140 153 M132 145 L148 145"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="emptyGrad"
                      x1="100"
                      y1="30"
                      x2="100"
                      y2="160"
                    >
                      <stop stopColor="#f59e0b" stopOpacity="0.05" />
                      <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                No invoices yet
              </h3>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                Create your first invoice to start tracking payments and getting
                paid faster.
              </p>
              <Link
                href="/invoices/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-8 py-3.5 rounded-xl font-semibold text-lg shadow-lg shadow-amber-500/20 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Your First Invoice
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/50">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`p-4 hover:bg-gray-800/50 transition-colors border-l-4 ${statusBorder[invoice.status] || "border-l-gray-600"}`}
                >
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="text-sm text-gray-400">
                          {invoice.clientName}
                        </p>
                      </div>
                      {invoice.isRecurring && (
                        <span className="bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase hidden sm:inline-flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Recurring
                        </span>
                      )}
                      <p className="text-xs text-gray-500 hidden sm:block">
                        Due {fmtDate(invoice.dueDate)}
                      </p>
                    </Link>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[invoice.status] || ""}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDot[invoice.status] || ""}`}
                      />
                      {invoice.status}
                      {invoice.status === "viewed" && (
                        <svg
                          className="w-3.5 h-3.5 ml-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </span>
                    <div className="text-right whitespace-nowrap">
                      <p className="text-base font-bold text-white">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </p>
                      {invoice.paidAmount > 0 &&
                        invoice.paidAmount < invoice.total && (
                          <p className="text-xs text-amber-400">
                            Due:{" "}
                            {formatCurrency(
                              invoice.total - invoice.paidAmount,
                              invoice.currency
                            )}
                          </p>
                        )}
                    </div>
                    <InvoiceCardActions
                      invoiceId={invoice.id}
                      status={invoice.status}
                      type={invoice.type}
                    />
                    <a
                      href={`/api/invoices/${invoice.id}/pdf`}
                      target="_blank"
                      className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-gray-700 transition-colors"
                      title="Download PDF"
                      aria-label="Download PDF"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quotes */}
        {recentQuotes.length > 0 && (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 mt-8">
            <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                Recent Quotes
                <span className="bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/40 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {recentQuotes.length}
                </span>
              </h2>
            </div>
            <div className="divide-y divide-gray-800/50">
              {recentQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className={`p-4 hover:bg-gray-800/50 transition-colors border-l-4 ${statusBorder[quote.status] || "border-l-gray-600"}`}
                >
                  <Link
                    href={`/invoices/${quote.id}`}
                    className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">
                        {quote.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-400">
                        {quote.clientName}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 hidden sm:block">
                      {fmtDate(quote.createdAt)}
                    </p>
                  </Link>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[quote.status] || ""}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDot[quote.status] || ""}`}
                      />
                      {quote.status}
                    </span>
                    <p className="text-base font-bold text-white text-right whitespace-nowrap">
                      {formatCurrency(quote.total, quote.currency)}
                    </p>
                    <InvoiceCardActions
                      invoiceId={quote.id}
                      status={quote.status}
                      type="quote"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <FloatingCreateButton />
      <BottomNav />
    </div>
  );
}
