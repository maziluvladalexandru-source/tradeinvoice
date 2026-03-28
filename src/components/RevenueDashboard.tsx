"use client";

import { useState } from "react";
import UpgradeModal from "./UpgradeModal";

interface MonthData {
  label: string;
  revenue: number;
  invoicesSent: number;
  invoicesPaid: number;
  outstanding: number;
}

interface ClientRevenue {
  name: string;
  total: number;
}

interface RevenueDashboardProps {
  totalRevenue: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  avgInvoiceValue: number;
  avgDaysToPayment: number | null;
  collectionRate: number;
  monthlyData: MonthData[];
  topClients: ClientRevenue[];
  quarterVat: number;
  quarterRevenueExVat: number;
  isPro: boolean;
  currency?: string;
}

function fmt(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(amount);
}

export default function RevenueDashboard({
  totalRevenue,
  thisMonthRevenue,
  lastMonthRevenue,
  avgInvoiceValue,
  avgDaysToPayment,
  collectionRate,
  monthlyData,
  topClients,
  quarterVat,
  quarterRevenueExVat,
  isPro,
  currency = "EUR",
}: RevenueDashboardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const revenueChange = lastMonthRevenue > 0
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : thisMonthRevenue > 0 ? 100 : 0;

  // Chart data — last 6 months
  const chartData = monthlyData.slice(0, 6).reverse();
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  // Top clients max
  const maxClientRevenue = Math.max(...topClients.map((c) => c.total), 1);

  // Trend arrow
  const trendUp = thisMonthRevenue >= lastMonthRevenue;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Revenue Insights</h2>
        <div className="h-px flex-1 bg-white/10" />
        {trendUp ? (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Trending up
          </span>
        ) : (
          <span className="flex items-center gap-1 text-sm font-medium text-red-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Trending down
          </span>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-amber-500/20 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
          <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Total Revenue</p>
          <p className="text-base md:text-xl font-bold text-amber-400 truncate">{fmt(totalRevenue, currency)}</p>
          <p className="text-xs text-gray-500 mt-1">all time</p>
        </div>

        <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-emerald-500/20 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">This Month</p>
          <p className="text-base md:text-xl font-bold text-emerald-400 truncate">{fmt(thisMonthRevenue, currency)}</p>
          {lastMonthRevenue > 0 && (
            <p className={`text-xs mt-1 ${revenueChange >= 0 ? "text-emerald-500" : "text-red-400"}`}>
              {revenueChange >= 0 ? "↑" : "↓"} {Math.abs(Math.round(revenueChange))}% vs last month
            </p>
          )}
        </div>

        <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-blue-500/20 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
          <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Avg Invoice</p>
          <p className="text-base md:text-xl font-bold text-blue-400 truncate">{fmt(avgInvoiceValue, currency)}</p>
          <p className="text-xs text-gray-500 mt-1">per invoice</p>
        </div>

        <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-purple-500/20 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
          <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Avg Days to Pay</p>
          <p className="text-base md:text-xl font-bold text-purple-400">{avgDaysToPayment ?? "—"}</p>
          <p className="text-xs text-gray-500 mt-1">days</p>
        </div>

        <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-cyan-500/20 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
          <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Collection Rate</p>
          <p className="text-base md:text-xl font-bold text-cyan-400">{Math.round(collectionRate)}%</p>
          <p className="text-xs text-gray-500 mt-1">paid / sent</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Monthly Revenue</h3>
          <div className="space-y-3">
            {chartData.map((month) => (
              <div key={month.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-12 shrink-0 text-right">{month.label}</span>
                <div className="flex-1 h-7 bg-white/5 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500/80 to-amber-400/60 rounded-lg transition-all duration-500"
                    style={{ width: `${Math.max((month.revenue / maxRevenue) * 100, 0)}%` }}
                  />
                  {month.revenue > 0 && (
                    <span className="absolute inset-0 flex items-center px-3 text-xs font-medium text-white">
                      {fmt(month.revenue, currency)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {chartData.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">No revenue data yet</p>
          )}
        </div>

        {/* Top Clients */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Top Clients by Revenue</h3>
          <div className="space-y-3">
            {topClients.map((client, i) => (
              <div key={client.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-5 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white truncate">{client.name}</span>
                    <span className="text-sm font-semibold text-amber-400 shrink-0 ml-2">{fmt(client.total, currency)}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-400/60 rounded-full"
                      style={{ width: `${(client.total / maxClientRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {topClients.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">No client data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors rounded-2xl"
        >
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Monthly Breakdown</h3>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${showBreakdown ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showBreakdown && (
          <div className="px-6 pb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="text-left py-2 pr-4 font-medium">Month</th>
                    <th className="text-right py-2 px-4 font-medium">Sent</th>
                    <th className="text-right py-2 px-4 font-medium">Paid</th>
                    <th className="text-right py-2 px-4 font-medium">Revenue</th>
                    <th className="text-right py-2 pl-4 font-medium">Outstanding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {monthlyData.map((m) => (
                    <tr key={m.label} className="text-gray-300 hover:bg-white/5 transition-colors">
                      <td className="py-2.5 pr-4 text-white font-medium">{m.label}</td>
                      <td className="py-2.5 px-4 text-right">{m.invoicesSent}</td>
                      <td className="py-2.5 px-4 text-right text-emerald-400">{m.invoicesPaid}</td>
                      <td className="py-2.5 px-4 text-right font-medium text-amber-400">{fmt(m.revenue, currency)}</td>
                      <td className="py-2.5 pl-4 text-right text-red-400">{fmt(m.outstanding, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {monthlyData.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
            )}
          </div>
        )}
      </div>

      {/* Tax Summary — Pro Feature */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 relative">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Tax Summary</h3>
          <span className="text-xs text-gray-500">This Quarter</span>
          {!isPro && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors ml-auto"
            >
              🔒 Pro
            </button>
          )}
        </div>

        {isPro ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">VAT Collected</p>
              <p className="text-lg font-bold text-amber-400">{fmt(quarterVat, currency)}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Revenue excl. VAT</p>
              <p className="text-lg font-bold text-emerald-400">{fmt(quarterRevenueExVat, currency)}</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 blur-sm pointer-events-none select-none">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1">VAT Collected</p>
                <p className="text-lg font-bold text-gray-600">€0,000.00</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Revenue excl. VAT</p>
                <p className="text-lg font-bold text-gray-600">€0,000.00</p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setShowUpgrade(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                Upgrade to Pro to Unlock
              </button>
            </div>
          </div>
        )}
      </div>

      {showUpgrade && <UpgradeModal feature="Tax Summary" onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
