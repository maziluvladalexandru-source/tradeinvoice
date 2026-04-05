"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import FloatingCreateButton from "@/components/FloatingCreateButton";
import InvoiceCardActions from "@/components/InvoiceCardActions";
import OnboardingChecklist from "@/components/OnboardingChecklist";
import NewInvoiceButton from "@/components/NewInvoiceButton";
import DonutChart from "@/components/DonutChart";
import Link from "next/link";
import {
  motion,
  PageTransition,
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/animations";

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
    outstandingByCurrency?: Record<string, number>;
    paidThisMonthByCurrency?: Record<string, number>;
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
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111827] rounded-xl p-4 border border-gray-700/50 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-3 w-20 bg-gray-700/30 rounded-lg skeleton mb-3" />
              <div className="h-7 w-16 bg-gray-700/40 rounded-lg skeleton" />
            </div>
          ))}
        </div>
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
  const t = useTranslations("dashboard");
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: t("statusDraft"),
      sent: t("statusSent"),
      viewed: t("statusViewed"),
      paid: t("statusPaid"),
      overdue: t("statusOverdue"),
    };
    return statusMap[status] || status;
  };

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
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </motion.div>
          <p className="text-red-400 text-lg font-medium mb-4">Failed to load dashboard</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 btn-press"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Retry
          </motion.button>
        </motion.div>
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
      <PageTransition>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">{t("title")}</h1>
                <motion.div
                  className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full mt-2"
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
                <p className="text-gray-400 mt-1.5">
                  {greeting}
                  {user.name ? `, ${user.name}` : ""}
                </p>
              </div>
              <NewInvoiceButton isNewUser={data.isNewUser} />
            </div>
          </FadeIn>

          {/* ROW 1 -- Hero Metric */}
          <FadeIn delay={0.1}>
            <motion.div
              className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#111827] to-[#0d1321] rounded-2xl p-6 md:p-8 border border-gray-700/50 hover:border-amber-500/30 mb-6 shadow-xl shadow-black/20 transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/[0.06] rounded-full blur-3xl pointer-events-none animate-breathe" />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1.5">{t("outstanding")}</p>
                  <p className="text-4xl md:text-5xl font-extrabold text-amber-400 tracking-tight tabular-nums">
                    {fc(stats.totalOutstanding)}
                  </p>
                  {stats.outstandingByCurrency && Object.keys(stats.outstandingByCurrency).length > 1 && (
                    <div className="flex flex-wrap gap-x-3 mt-1.5">
                      {Object.entries(stats.outstandingByCurrency).map(([cur, amt]) => (
                        <span key={cur} className="text-xs text-gray-500 tabular-nums">{formatCurrency(amt, cur)}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="sm:text-right">
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1.5">{t("paidCount")}</p>
                  <p className="text-3xl font-bold text-emerald-400 tabular-nums">
                    {fc(stats.paidThisMonth)}
                  </p>
                  {stats.paidThisMonthByCurrency && Object.keys(stats.paidThisMonthByCurrency).length > 1 && (
                    <div className="flex flex-wrap gap-x-3 mt-1">
                      {Object.entries(stats.paidThisMonthByCurrency).map(([cur, amt]) => (
                        <span key={cur} className="text-xs text-gray-500 tabular-nums">{formatCurrency(amt, cur)}</span>
                      ))}
                    </div>
                  )}
                  {stats.revenueLastMonth > 0 && (
                    <motion.p
                      className={`text-sm mt-1.5 font-medium ${stats.revenueChange >= 0 ? "text-emerald-500" : "text-red-400"}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {stats.revenueChange >= 0 ? "\u2191" : "\u2193"}{" "}
                      {Math.abs(Math.round(stats.revenueChange))}% {t('dashboard.vsLastMonth')}
                    </motion.p>
                  )}
                </div>
              </div>
              {/* Collection progress bar */}
              <div className="relative mt-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-medium">
                  <span>{t('dashboard.collectionProgress')}</span>
                  <span className="tabular-nums">{Math.round(paidPercent)}% {t('dashboard.collected')}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${paidPercent}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                  />
                </div>
              </div>
            </motion.div>
          </FadeIn>

          {/* ROW 2 -- Secondary Stats */}
          <StaggerChildren staggerDelay={0.1} delay={0.2} className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
            {[
              { label: t("overdue"), value: stats.overdueCount, color: stats.overdueCount > 0 ? "text-red-400" : "text-gray-600", border: stats.overdueCount > 0 ? "border-t-red-500" : "border-t-gray-700/30", hover: "hover:border-red-500/30", hasAlert: stats.overdueCount > 0 },
              { label: t("avgDaysToPay"), value: stats.avgDaysToPayment, color: "text-blue-400", border: "border-t-blue-500/40", hover: "hover:border-blue-500/30" },
              { label: t("activeClients"), value: stats.activeClientsCount, color: "text-purple-400", border: "border-t-purple-500/40", hover: "hover:border-purple-500/30" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <motion.div
                  className={`bg-[#111827] rounded-xl p-4 border border-gray-700/50 ${stat.hover} transition-all duration-200 border-t-2 ${stat.border}`}
                  whileHover={{ y: -2, transition: { type: "spring", stiffness: 400 } }}
                >
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-xl font-bold mt-1 tabular-nums ${stat.color}`}>
                    {stat.value !== null ? stat.value : "--"}
                    {stat.hasAlert && (
                      <svg className="w-4 h-4 text-red-400 animate-pulse inline ml-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    )}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Plan info */}
          {user.plan === "free" && (
            <FadeIn delay={0.3}>
              <motion.div
                className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6 flex items-center justify-between hover:border-amber-500/30 transition-all duration-200"
                whileHover={{ scale: 1.005 }}
              >
                <div>
                  <p className="font-medium text-amber-400">
                    Free Plan: {user.invoiceCount}/20 invoices used this month
                  </p>
                  <p className="text-sm text-amber-500/70">
                    Upgrade to Pro for unlimited invoices
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/settings"
                    className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 btn-press"
                  >
                    Upgrade
                  </Link>
                </motion.div>
              </motion.div>
            </FadeIn>
          )}

          {/* ROW 3 -- Two Columns: Recent Invoices + Quick Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            {/* Left: Recent Invoices (3/5 = 60%) */}
            <FadeIn delay={0.15} className="lg:col-span-3">
              <div className="bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-amber-500/20 transition-all duration-300 shadow-lg shadow-black/10 h-full">
                <div className="px-5 py-4 border-b border-gray-700/50 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">{t("recentInvoices")}</h2>
                  {recentInvoices.length > 0 && (
                    <Link href="/invoices" className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors duration-200">
                      {t("viewAll")}
                    </Link>
                  )}
                </div>

                {recentInvoices.length === 0 ? (
                  <div className="p-12 text-center">
                    <motion.div
                      className="w-28 h-28 mx-auto mb-6"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <rect x="50" y="30" width="100" height="130" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2" />
                        <rect x="68" y="75" width="64" height="6" rx="3" fill="#374151" />
                        <rect x="68" y="90" width="48" height="6" rx="3" fill="#374151" />
                        <rect x="68" y="105" width="56" height="6" rx="3" fill="#374151" />
                        <circle cx="140" cy="145" r="18" fill="#f59e0b" opacity="0.2" />
                        <path d="M140 137 L140 153 M132 145 L148 145" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">{t("noInvoices")}</h3>
                    <p className="text-gray-400 text-sm mb-6">{t("createFirstDesc")}</p>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href="/invoices/new"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all duration-200 btn-press"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Your First Invoice
                      </Link>
                    </motion.div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700/30">
                    {recentInvoices.slice(0, 5).map((invoice, idx) => (
                      <motion.div
                        key={invoice.id}
                        className="group px-5 py-3 hover:bg-white/[0.03] transition-all duration-200"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.06, type: "spring", stiffness: 300, damping: 24 }}
                      >
                        {/* Desktop row */}
                        <div className="hidden sm:grid items-center gap-3" style={{ gridTemplateColumns: "1fr 90px 100px 80px" }}>
                          <Link href={`/invoices/${invoice.id}`} className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white text-sm group-hover:text-amber-400 transition-colors duration-200">{invoice.invoiceNumber}</span>
                              <span className="text-gray-500 text-sm truncate">{invoice.clientName}</span>
                            </div>
                          </Link>
                          <span className={`inline-flex items-center gap-1 capitalize whitespace-nowrap ${statusColors[invoice.status] || ""}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[invoice.status] || ""}`} />
                            {getStatusLabel(invoice.status)}
                          </span>
                          <span className="text-sm font-semibold text-white text-right tabular-nums">
                            {formatCurrency(invoice.total, invoice.currency)}
                          </span>
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
                              {getStatusLabel(invoice.status)}
                            </span>
                            <div className="flex items-center gap-0.5">
                              <InvoiceCardActions invoiceId={invoice.id} status={invoice.status} type={invoice.type} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Right: Quick Insights (2/5 = 40%) */}
            <StaggerChildren staggerDelay={0.12} delay={0.25} className="lg:col-span-2 space-y-4">
              {/* Mini Donut: Invoice Status */}
              {data.totalInvoiceCount > 0 && (
                <StaggerItem>
                  <motion.div
                    className="bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-amber-500/20 p-5 transition-all duration-300 shadow-lg shadow-black/10"
                    whileHover={{ y: -2 }}
                  >
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('dashboard.invoiceStatus')}</h3>
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
                  </motion.div>
                </StaggerItem>
              )}

              {/* Revenue This Month */}
              <StaggerItem>
                <motion.div
                  className="bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-emerald-500/20 p-5 transition-all duration-300 shadow-lg shadow-black/10"
                  whileHover={{ y: -2 }}
                >
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Revenue This Month</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-white tabular-nums">{fc(stats.paidThisMonth)}</p>
                    {stats.revenueLastMonth > 0 && (
                      <span className={`text-sm font-medium ${stats.revenueChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {stats.revenueChange >= 0 ? "\u2191" : "\u2193"} {Math.abs(Math.round(stats.revenueChange))}%
                      </span>
                    )}
                  </div>
                </motion.div>
              </StaggerItem>

              {/* Collection Rate */}
              <StaggerItem>
                <motion.div
                  className="bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-emerald-500/20 p-5 transition-all duration-300 shadow-lg shadow-black/10"
                  whileHover={{ y: -2 }}
                >
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Collection Rate</h3>
                  <p className="text-2xl font-bold text-white mb-2 tabular-nums">{collectionRate}%</p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${collectionRate}%` }}
                      transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1.5 font-medium">
                    <span className="tabular-nums">{fc(data.charts.totalCollected)} {t('collected')}</span>
                    <span className="tabular-nums">{fc(data.charts.totalInvoiced)} {t('invoiced')}</span>
                  </div>
                </motion.div>
              </StaggerItem>
            </StaggerChildren>
          </div>

          {/* Recent Quotes */}
          {recentQuotes.length > 0 && (
            <FadeIn delay={0.3}>
              <div className="bg-[#111827] rounded-2xl border border-gray-700/50 hover:border-purple-500/20 mb-6 transition-all duration-300 shadow-lg shadow-black/10">
                <div className="px-5 py-4 border-b border-gray-700/50 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    {t('recentQuotes')}
                    <motion.span
                      className="bg-purple-500/15 text-purple-300 ring-1 ring-purple-400/30 px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, delay: 0.4 }}
                    >
                      {recentQuotes.length}
                    </motion.span>
                  </h2>
                </div>
                <div className="divide-y divide-gray-700/30">
                  {recentQuotes.map((quote, idx) => (
                    <motion.div
                      key={quote.id}
                      className="group px-5 py-3 hover:bg-white/[0.03] transition-all duration-200"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.06 }}
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
                          {getStatusLabel(quote.status)}
                        </span>
                        <span className="text-sm font-semibold text-white text-right tabular-nums">
                          {formatCurrency(quote.total, quote.currency)}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex justify-end">
                          <InvoiceCardActions invoiceId={quote.id} status={quote.status} type="quote" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {/* ROW 4 -- Onboarding */}
          <OnboardingChecklist
            hasBusinessName={data.hasBusinessName}
            invoiceCount={data.totalInvoiceCount}
            hasSentInvoice={data.hasSentInvoice}
          />
        </div>
      </PageTransition>

      <FloatingCreateButton />
      <BottomNav />
    </div>
  );
}
