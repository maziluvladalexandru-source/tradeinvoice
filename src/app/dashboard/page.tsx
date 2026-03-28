import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import FloatingCreateButton from "@/components/FloatingCreateButton";
import InvoiceCardActions from "@/components/InvoiceCardActions";
import OnboardingChecklist from "@/components/OnboardingChecklist";
import NewInvoiceButton from "@/components/NewInvoiceButton";
import RevenueDashboard from "@/components/RevenueDashboard";
import DashboardInvoiceList from "@/components/DashboardInvoiceList";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Separate invoices and quotes
  const actualInvoices = invoices.filter((i) => i.type !== "quote");
  const quotes = invoices.filter((i) => i.type === "quote");

  const totalOutstanding = actualInvoices
    .filter((i) => ["sent", "viewed", "overdue"].includes(i.status))
    .reduce((sum, i) => sum + i.total, 0);

  const paidThisMonth = actualInvoices
    .filter(
      (i) => i.status === "paid" && i.paidAt && new Date(i.paidAt) >= monthStart
    )
    .reduce((sum, i) => sum + i.total, 0);

  const overdueCount = actualInvoices.filter((i) => i.status === "overdue").length;

  // Average days to payment (for paid invoices)
  const paidInvoicesWithDates = actualInvoices.filter(
    (i) => i.status === "paid" && i.paidAt && i.sentAt
  );
  const avgDaysToPayment =
    paidInvoicesWithDates.length > 0
      ? Math.round(
          paidInvoicesWithDates.reduce((sum, i) => {
            const sent = new Date(i.sentAt!).getTime();
            const paid = new Date(i.paidAt!).getTime();
            return sum + (paid - sent) / (1000 * 60 * 60 * 24);
          }, 0) / paidInvoicesWithDates.length
        )
      : null;

  // Revenue this month vs last month
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const revenueLastMonth = actualInvoices
    .filter(
      (i) =>
        i.status === "paid" &&
        i.paidAt &&
        new Date(i.paidAt) >= lastMonthStart &&
        new Date(i.paidAt) <= lastMonthEnd
    )
    .reduce((sum, i) => sum + i.total, 0);

  const revenueChange = revenueLastMonth > 0
    ? ((paidThisMonth - revenueLastMonth) / revenueLastMonth) * 100
    : paidThisMonth > 0 ? 100 : 0;

  // Active clients (clients with non-draft invoices in last 90 days)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const activeClientIds = new Set(
    actualInvoices
      .filter((i) => i.status !== "draft" && new Date(i.createdAt) >= ninetyDaysAgo)
      .map((i) => i.clientId)
  );
  const activeClientsCount = activeClientIds.size;

  // Invoices viewed in the last 24 hours
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const recentlyViewedCount = actualInvoices.filter(
    (i) => i.viewedAt && new Date(i.viewedAt) >= twentyFourHoursAgo
  ).length;

  const recentInvoices = actualInvoices.slice(0, 5);
  const recentQuotes = quotes.slice(0, 5);

  // === Revenue Dashboard Data ===
  const paidInvoices = actualInvoices.filter((i) => i.status === "paid");
  const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.total, 0);
  const avgInvoiceValue = paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0;

  // Collection rate: paid / (sent + viewed + paid + overdue)
  const sentOrBeyond = actualInvoices.filter((i) => ["sent", "viewed", "paid", "overdue"].includes(i.status));
  const collectionRate = sentOrBeyond.length > 0 ? (paidInvoices.length / sentOrBeyond.length) * 100 : 0;

  // Monthly data (last 12 months)
  const monthlyData = [];
  for (let m = 0; m < 12; m++) {
    const mStart = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const mEnd = new Date(now.getFullYear(), now.getMonth() - m + 1, 0, 23, 59, 59);
    const label = mStart.toLocaleDateString("en-IE", { month: "short", year: "2-digit" });
    const monthInvoices = actualInvoices.filter((i) => {
      const d = new Date(i.createdAt);
      return d >= mStart && d <= mEnd;
    });
    const invoicesSent = monthInvoices.filter((i) => i.status !== "draft").length;
    const invoicesPaid = monthInvoices.filter((i) => i.status === "paid").length;
    const revenue = monthInvoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
    const outstanding = monthInvoices.filter((i) => ["sent", "viewed", "overdue"].includes(i.status)).reduce((s, i) => s + i.total, 0);
    monthlyData.push({ label, revenue, invoicesSent, invoicesPaid, outstanding });
  }

  // Top 5 clients by revenue
  const clientRevenueMap = new Map<string, { name: string; total: number }>();
  for (const inv of paidInvoices) {
    const key = inv.clientId;
    const existing = clientRevenueMap.get(key);
    if (existing) {
      existing.total += inv.total;
    } else {
      clientRevenueMap.set(key, { name: inv.client.name, total: inv.total });
    }
  }
  const topClients = Array.from(clientRevenueMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Quarter tax summary
  const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  const quarterPaid = paidInvoices.filter((i) => i.paidAt && new Date(i.paidAt) >= quarterStart);
  const quarterVat = quarterPaid.reduce((s, i) => s + i.taxAmount, 0);
  const quarterRevenueExVat = quarterPaid.reduce((s, i) => s + i.subtotal, 0);

  // Expenses this month
  const expenses = await prisma.expense.findMany({
    where: {
      userId: user.id,
      date: { gte: monthStart },
    },
  });
  const expensesThisMonth = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profitThisMonth = paidThisMonth - expensesThisMonth;

  // Recurring invoices data
  const recurringInvoices = actualInvoices.filter((i) => i.isRecurring);
  const recurringCount = recurringInvoices.length;
  const recurringMonthlyValue = recurringInvoices.reduce((sum, i) => {
    const interval = i.recurringInterval || "monthly";
    if (interval === "weekly") return sum + i.total * 4.33;
    if (interval === "quarterly") return sum + i.total / 3;
    if (interval === "yearly") return sum + i.total / 12;
    return sum + i.total; // monthly
  }, 0);

  // Onboarding data
  const hasBusinessName = !!user.businessName;
  const hasSentInvoice = invoices.some((i) => i.sentAt !== null);
  const isNewUser = invoices.length === 0 && !hasBusinessName;

  const fmtDate = (d: Date | string) =>
    new Date(d).toLocaleDateString("en-IE", { day: "numeric", month: "short" });

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

  // Color-coded left border stripe per status
  const statusBorder: Record<string, string> = {
    draft: "border-l-gray-500",
    sent: "border-l-blue-500",
    viewed: "border-l-yellow-500",
    paid: "border-l-green-500",
    overdue: "border-l-red-500",
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-20 md:pb-0">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              {greeting}{user.name ? `, ${user.name}` : ""}
            </p>
          </div>
          <NewInvoiceButton isNewUser={isNewUser} />
        </div>

        {/* Onboarding checklist */}
        <OnboardingChecklist
          hasBusinessName={hasBusinessName}
          invoiceCount={invoices.length}
          hasSentInvoice={hasSentInvoice}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            <p className="text-sm font-medium text-gray-400 mb-1">
              Total Outstanding
            </p>
            <p className="text-lg md:text-2xl font-bold text-white truncate">
              {formatCurrency(totalOutstanding)}
            </p>
          </div>
          <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            <p className="text-sm font-medium text-gray-400 mb-1">
              Paid This Month
            </p>
            <p className="text-lg md:text-2xl font-bold text-green-400 truncate">
              {formatCurrency(paidThisMonth)}
            </p>
            {revenueLastMonth > 0 && (
              <p className={`text-sm mt-1 ${revenueChange >= 0 ? "text-green-500" : "text-red-400"}`}>
                {revenueChange >= 0 ? "\u2191" : "\u2193"} {Math.abs(Math.round(revenueChange))}% vs last month
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
                {overdueCount}
              </p>
              {overdueCount > 0 && (
                <svg className="w-5 h-5 text-red-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
            </div>
          </div>
          {avgDaysToPayment !== null && (
            <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
              <p className="text-sm font-medium text-gray-400 mb-1">
                Avg. Days to Payment
              </p>
              <p className="text-lg md:text-2xl font-bold text-blue-400">
                {avgDaysToPayment}
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
              {activeClientsCount}
            </p>
            <p className="text-sm text-gray-500 mt-1">last 90 days</p>
          </div>
          <Link href="/expenses" className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
            <p className="text-sm font-medium text-gray-400 mb-1">
              Expenses This Month
            </p>
            <p className="text-lg md:text-2xl font-bold text-orange-400 truncate">
              {formatCurrency(expensesThisMonth)}
            </p>
            <p className="text-sm text-gray-500 mt-1 group-hover:text-amber-500 transition-colors">View all &rarr;</p>
          </Link>
          {paidThisMonth > 0 && (
            <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-800/50 hover:border-gray-700/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
              <p className="text-sm font-medium text-gray-400 mb-1">
                Profit This Month
              </p>
              <p className={`text-lg md:text-2xl font-bold truncate ${profitThisMonth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatCurrency(profitThisMonth)}
              </p>
              <p className="text-sm text-gray-500 mt-1">revenue &minus; expenses</p>
            </div>
          )}
        </div>

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
        {recentlyViewedCount > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3">
            <svg className="w-5 h-5 text-yellow-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-sm font-medium text-yellow-300">
              {recentlyViewedCount} invoice{recentlyViewedCount !== 1 ? "s were" : " was"} viewed today
            </p>
          </div>
        )}

        {/* Recurring invoices summary */}
        {recurringCount > 0 && (
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-5 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <h3 className="text-sm font-semibold text-cyan-300">Recurring Invoices</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-white">{recurringCount}</p>
                <p className="text-xs text-gray-400">active recurring</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400">{formatCurrency(recurringMonthlyValue)}</p>
                <p className="text-xs text-gray-400">est. monthly value</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="space-y-1">
                  {recurringInvoices.slice(0, 3).map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-300 truncate">{inv.client.name}</span>
                      <span className="text-gray-400 shrink-0 ml-2">
                        {inv.recurringInterval} &middot; {formatCurrency(inv.total)}
                        {inv.recurringNextDate && (
                          <span className="text-gray-500 ml-1">
                            next {new Date(inv.recurringNextDate).toLocaleDateString("en-IE", { day: "numeric", month: "short" })}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent invoices */}
        <DashboardInvoiceList
          recentInvoices={recentInvoices.map((i) => ({
            id: i.id,
            invoiceNumber: i.invoiceNumber,
            status: i.status,
            type: i.type,
            total: i.total,
            currency: i.currency,
            paidAmount: i.paidAmount,
            dueDate: i.dueDate.toISOString(),
            isRecurring: i.isRecurring,
            scheduledSendAt: i.scheduledSendAt ? i.scheduledSendAt.toISOString() : null,
            client: { name: i.client.name },
          }))}
          totalInvoiceCount={invoices.length}
          statusColors={statusColors}
          statusDot={statusDot}
          statusBorder={statusBorder}
        />
        {/* Recent Quotes */}
        {recentQuotes.length > 0 && (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 mt-8">
            <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                Recent Quotes
                <span className="bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/40 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {quotes.length}
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
                        {quote.client.name}
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
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[quote.status] || ""}`} />
                      {quote.status}
                    </span>
                    <p className="text-base font-bold text-white text-right whitespace-nowrap">
                      {formatCurrency(quote.total, quote.currency)}
                    </p>
                    <InvoiceCardActions invoiceId={quote.id} status={quote.status} type="quote" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Revenue Dashboard */}
        {actualInvoices.length > 0 && (
          <div className="mt-8">
            <RevenueDashboard
              totalRevenue={totalRevenue}
              thisMonthRevenue={paidThisMonth}
              lastMonthRevenue={revenueLastMonth}
              avgInvoiceValue={avgInvoiceValue}
              avgDaysToPayment={avgDaysToPayment}
              collectionRate={collectionRate}
              monthlyData={monthlyData}
              topClients={topClients}
              quarterVat={quarterVat}
              quarterRevenueExVat={quarterRevenueExVat}
              isPro={user.plan === "pro"}
            />
          </div>
        )}
      </div>

      {/* Floating create button & bottom nav (mobile only) */}
      <FloatingCreateButton />
      <BottomNav />
    </div>
  );
}
