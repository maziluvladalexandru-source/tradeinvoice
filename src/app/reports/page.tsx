"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import UpgradeModal from "@/components/UpgradeModal";
import DonutChart from "@/components/DonutChart";

interface ReportData {
  period: { type: string; year: number; month: number; quarter: number; from: string; to: string };
  revenue: number;
  revenueBeforeTax: number;
  taxCollected: number;
  invoicesPaid: number;
  totalExpenses: number;
  deductibleExpenses: number;
  expenseByCategory: Record<string, number>;
  totalKm: number;
  mileageDeduction: number;
  totalDeductions: number;
  netProfit: number;
  taxableProfit: number;
  totalOutstanding: number;
  monthlyData: Array<{
    month: string;
    revenue: number;
    expenses: number;
    mileageDeduction: number;
    netProfit: number;
  }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  materials: "Materials",
  fuel: "Fuel / Mileage",
  tools: "Tools & Equipment",
  subcontractor: "Subcontractor",
  office: "Office / Admin",
  other: "Other",
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState("free");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("year");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);

  const fmtCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(amount);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ period, year: year.toString(), month: month.toString(), quarter: quarter.toString() });
      const res = await fetch(`/api/reports?${params}`);
      if (res.status === 403) {
        setShowUpgrade(true);
        setLoading(false);
        return;
      }
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  }, [period, year, month, quarter]);

  useEffect(() => {
    fetch("/api/user").then((r) => r.json()).then((u) => {
      if (u.plan) setUserPlan(u.plan);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (userPlan === "pro") fetchReport();
  }, [userPlan, fetchReport]);

  function exportCSV() {
    if (!data) return;
    const lines: string[] = [];
    lines.push("Profit & Loss Report");
    lines.push(`Period: ${data.period.from.split("T")[0]} to ${data.period.to.split("T")[0]}`);
    lines.push("");
    lines.push("INCOME");
    lines.push(`Revenue (incl. tax),${data.revenue.toFixed(2)}`);
    lines.push(`Tax Collected (VAT),${data.taxCollected.toFixed(2)}`);
    lines.push(`Revenue (excl. tax),${data.revenueBeforeTax.toFixed(2)}`);
    lines.push(`Invoices Paid,${data.invoicesPaid}`);
    lines.push("");
    lines.push("EXPENSES");
    lines.push(`Total Expenses,${data.totalExpenses.toFixed(2)}`);
    for (const [cat, amount] of Object.entries(data.expenseByCategory)) {
      lines.push(`  ${CATEGORY_LABELS[cat] || cat},${amount.toFixed(2)}`);
    }
    lines.push("");
    lines.push("MILEAGE");
    lines.push(`Total Distance (km),${data.totalKm.toFixed(1)}`);
    lines.push(`Mileage Deduction,${data.mileageDeduction.toFixed(2)}`);
    lines.push("");
    lines.push("DEDUCTIONS");
    lines.push(`Deductible Expenses,${data.deductibleExpenses.toFixed(2)}`);
    lines.push(`Mileage Deduction,${data.mileageDeduction.toFixed(2)}`);
    lines.push(`Total Deductions,${data.totalDeductions.toFixed(2)}`);
    lines.push("");
    lines.push("PROFIT");
    lines.push(`Net Profit,${data.netProfit.toFixed(2)}`);
    lines.push(`Taxable Profit (estimated),${data.taxableProfit.toFixed(2)}`);
    lines.push(`Outstanding,${data.totalOutstanding.toFixed(2)}`);

    if (data.monthlyData.length > 1) {
      lines.push("");
      lines.push("MONTHLY BREAKDOWN");
      lines.push("Month,Revenue,Expenses,Mileage Deduction,Net Profit");
      for (const m of data.monthlyData) {
        lines.push(`${m.month},${m.revenue.toFixed(2)},${m.expenses.toFixed(2)},${m.mileageDeduction.toFixed(2)},${m.netProfit.toFixed(2)}`);
      }
    }

    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pnl-report-${data.period.type}-${data.period.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0a0f1e] pb-24 md:pb-0 premium-glow">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Reports</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full mt-2" />
            <p className="text-gray-400 mt-1">Profit &amp; Loss overview</p>
          </div>
          {data && (
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          )}
        </div>

        {userPlan !== "pro" ? (
          <div className="bg-[#111827] backdrop-blur-sm rounded-2xl border border-gray-700/50 p-16 text-center">
            <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">Profit &amp; Loss Reports</h3>
            <p className="text-gray-400 mb-4">Track revenue, expenses, mileage deductions, and net profit.</p>
            <p className="text-sm text-gray-500 mb-6">Filter by month, quarter, or year. Export as CSV for your accountant.</p>
            <button
              onClick={() => setShowUpgrade(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 transition-all"
            >
              Upgrade to Pro
            </button>
          </div>
        ) : (
          <>
            {/* Period Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex gap-1 bg-[#111827] rounded-xl p-1 border border-gray-700/50">
                {(["month", "quarter", "year"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      period === p
                        ? "bg-amber-500/15 text-amber-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50"
              >
                {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              {period === "month" && (
                <select
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              )}

              {period === "quarter" && (
                <select
                  value={quarter}
                  onChange={(e) => setQuarter(parseInt(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50"
                >
                  {[1, 2, 3, 4].map((q) => (
                    <option key={q} value={q}>Q{q}</option>
                  ))}
                </select>
              )}
            </div>

            {loading ? (
              <div className="p-16 text-center">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
              </div>
            ) : data ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="relative overflow-hidden bg-[#111827] backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 border-l-4 border-l-emerald-500 hover:border-white/20 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                    <p className="text-sm font-medium text-gray-400 mb-1">Revenue</p>
                    <p className="text-lg md:text-2xl font-bold text-emerald-400 truncate tabular-nums">{fmtCurrency(data.revenue)}</p>
                    <p className="text-sm text-gray-500 mt-1">{data.invoicesPaid} invoice{data.invoicesPaid !== 1 ? "s" : ""} paid</p>
                  </div>
                  <div className="relative overflow-hidden bg-[#111827] backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 border-l-4 border-l-red-500 hover:border-white/20 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
                    <p className="text-sm font-medium text-gray-400 mb-1">Expenses</p>
                    <p className="text-lg md:text-2xl font-bold text-red-400 truncate tabular-nums">{fmtCurrency(data.totalExpenses)}</p>
                    <p className="text-sm text-gray-500 mt-1">{fmtCurrency(data.deductibleExpenses)} deductible</p>
                  </div>
                  <div className="relative overflow-hidden bg-[#111827] backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 border-l-4 border-l-blue-500 hover:border-white/20 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
                    <p className="text-sm font-medium text-gray-400 mb-1">Mileage Deduction</p>
                    <p className="text-lg md:text-2xl font-bold text-blue-400 truncate tabular-nums">{fmtCurrency(data.mileageDeduction)}</p>
                    <p className="text-sm text-gray-500 mt-1">{data.totalKm.toFixed(1)} km</p>
                  </div>
                  <div className="relative overflow-hidden bg-[#111827] backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 border-l-4 border-l-amber-500 hover:border-white/20 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
                    <p className="text-sm font-medium text-gray-400 mb-1">Net Profit</p>
                    <p className={`text-lg md:text-2xl font-bold truncate tabular-nums ${data.netProfit >= 0 ? "text-amber-400" : "text-red-400"}`}>
                      {fmtCurrency(data.netProfit)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{fmtCurrency(data.totalOutstanding)} outstanding</p>
                  </div>
                </div>

                {/* Revenue vs Expenses Donut */}
                {(data.revenue > 0 || data.totalExpenses > 0) && (
                  <div className="bg-[#111827] backdrop-blur-sm rounded-2xl border border-gray-700/50 border-t-[3px] border-t-amber-500/60 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4">Profit Overview</h2>
                    <div className="flex justify-center">
                      <DonutChart
                        segments={[
                          { label: "Revenue", value: data.revenue, color: "#22c55e", displayValue: fmtCurrency(data.revenue) },
                          { label: "Expenses", value: data.totalExpenses, color: "#ef4444", displayValue: fmtCurrency(data.totalExpenses) },
                        ]}
                        centerText={fmtCurrency(data.netProfit)}
                        centerSubtext="net profit"
                        size={200}
                      />
                    </div>
                  </div>
                )}

                {/* P&L Statement */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-[#111827] backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Profit &amp; Loss Statement</h2>
                    <div className="space-y-3">
                      <div className="pb-3 border-b border-white/10">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Income</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Revenue (incl. VAT)</span>
                          <span className="text-emerald-400 font-semibold tabular-nums">{fmtCurrency(data.revenue)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-400">VAT Collected</span>
                          <span className="text-gray-300 tabular-nums">-{fmtCurrency(data.taxCollected)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1 pt-1 border-t border-white/5">
                          <span className="text-gray-300 font-medium">Revenue (excl. VAT)</span>
                          <span className="text-white font-semibold tabular-nums">{fmtCurrency(data.revenueBeforeTax)}</span>
                        </div>
                      </div>

                      <div className="pb-3 border-b border-white/10">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Expenses</p>
                        {Object.entries(data.expenseByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
                          <div key={cat} className="flex justify-between text-sm mt-1">
                            <span className="text-gray-400">{CATEGORY_LABELS[cat] || cat}</span>
                            <span className="text-red-400 tabular-nums">-{fmtCurrency(amount)}</span>
                          </div>
                        ))}
                        {Object.keys(data.expenseByCategory).length === 0 && (
                          <p className="text-sm text-gray-500">No expenses</p>
                        )}
                        <div className="flex justify-between text-sm mt-1 pt-1 border-t border-white/5">
                          <span className="text-gray-300 font-medium">Total Expenses</span>
                          <span className="text-red-400 font-semibold tabular-nums">-{fmtCurrency(data.totalExpenses)}</span>
                        </div>
                      </div>

                      <div className="pb-3 border-b border-white/10">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Deductions</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Mileage ({data.totalKm.toFixed(1)} km)</span>
                          <span className="text-blue-400 tabular-nums">{fmtCurrency(data.mileageDeduction)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-400">Deductible Expenses</span>
                          <span className="text-blue-400 tabular-nums">{fmtCurrency(data.deductibleExpenses)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1 pt-1 border-t border-white/5">
                          <span className="text-gray-300 font-medium">Total Deductions</span>
                          <span className="text-blue-400 font-semibold tabular-nums">{fmtCurrency(data.totalDeductions)}</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <div className="flex justify-between">
                          <span className="text-white font-semibold">Net Profit</span>
                          <span className={`text-lg font-bold tabular-nums ${data.netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {fmtCurrency(data.netProfit)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-gray-400">Estimated Taxable Profit</span>
                          <span className="text-amber-400 font-semibold tabular-nums">{fmtCurrency(data.taxableProfit)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Breakdown */}
                  {data.monthlyData.length > 1 && (
                    <div className="bg-[#111827] backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                      <h2 className="text-lg font-semibold text-white mb-4">Monthly Breakdown</h2>
                      <div className="space-y-3">
                        <div className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-white/10">
                          <span>Month</span>
                          <span className="text-right">Revenue</span>
                          <span className="text-right">Expenses</span>
                          <span className="text-right">Mileage</span>
                          <span className="text-right">Profit</span>
                        </div>
                        {data.monthlyData.map((m) => (
                          <div key={m.month} className="grid grid-cols-5 gap-2 text-sm py-1.5 border-b border-white/5">
                            <span className="text-gray-300 font-medium">{m.month}</span>
                            <span className={`text-right ${m.revenue === 0 ? "text-gray-500" : "text-emerald-400"}`}>{fmtCurrency(m.revenue)}</span>
                            <span className={`text-right ${m.expenses === 0 ? "text-gray-500" : "text-red-400"}`}>{fmtCurrency(m.expenses)}</span>
                            <span className={`text-right ${m.mileageDeduction === 0 ? "text-gray-500" : "text-blue-400"}`}>{fmtCurrency(m.mileageDeduction)}</span>
                            <span className={`text-right font-semibold ${m.netProfit === 0 ? "text-gray-500" : m.netProfit > 0 ? "text-white" : "text-red-400"}`}>
                              {fmtCurrency(m.netProfit)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Simple bar chart */}
                      <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">Revenue vs Expenses</h3>
                        <div className="flex items-end gap-1 h-32">
                          {data.monthlyData.map((m) => {
                            const maxVal = Math.max(...data.monthlyData.map((d) => Math.max(d.revenue, d.expenses)), 1);
                            const revH = (m.revenue / maxVal) * 100;
                            const expH = (m.expenses / maxVal) * 100;
                            return (
                              <div key={m.month} className="flex-1 flex items-end gap-0.5">
                                <div
                                  className="flex-1 bg-emerald-500/30 rounded-t transition-all"
                                  style={{ height: `${revH}%`, minHeight: m.revenue > 0 ? "4px" : "0" }}
                                  title={`Revenue: ${fmtCurrency(m.revenue)}`}
                                />
                                <div
                                  className="flex-1 bg-red-500/30 rounded-t transition-all"
                                  style={{ height: `${expH}%`, minHeight: m.expenses > 0 ? "4px" : "0" }}
                                  title={`Expenses: ${fmtCurrency(m.expenses)}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500/50" /> Revenue
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500/50" /> Expenses
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </>
        )}
      </div>

      {showUpgrade && <UpgradeModal feature="Profit & Loss Reports" onClose={() => setShowUpgrade(false)} />}
      <BottomNav />
    </div>
  );
}
