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

  const recentInvoices = actualInvoices.slice(0, 5);
  const recentQuotes = quotes.slice(0, 5);

  // Onboarding data
  const hasBusinessName = !!user.businessName;
  const hasSentInvoice = invoices.some((i) => i.sentAt !== null);
  const isNewUser = invoices.length === 0 && !hasBusinessName;

  const fmtDate = (d: Date | string) =>
    new Date(d).toLocaleDateString("en-IE", { day: "numeric", month: "short" });

  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/40",
    sent: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/40",
    viewed: "bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-400/40",
    paid: "bg-green-500/20 text-green-300 ring-1 ring-green-400/40",
    overdue: "bg-red-500/20 text-red-300 ring-1 ring-red-400/40",
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
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back{user.name ? `, ${user.name}` : ""}
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
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <p className="text-sm font-medium text-gray-400 mb-1">
              Total Outstanding
            </p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(totalOutstanding)}
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <p className="text-sm font-medium text-gray-400 mb-1">
              Paid This Month
            </p>
            <p className="text-3xl font-bold text-green-400">
              {formatCurrency(paidThisMonth)}
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
            <p className="text-sm font-medium text-gray-400 mb-1">
              Overdue Invoices
            </p>
            <p className="text-3xl font-bold text-red-400">
              {overdueCount}
            </p>
          </div>
        </div>

        {/* Plan info */}
        {user.plan === "free" && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-8 flex items-center justify-between">
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
              className="bg-amber-500 text-gray-950 px-4 py-2 rounded-lg font-medium text-sm hover:bg-amber-400"
            >
              Upgrade
            </Link>
          </div>
        )}

        {/* Recent invoices */}
        <div className="bg-gray-800/60 rounded-2xl border border-gray-700">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Recent Invoices
            </h2>
            {invoices.length > 5 && (
              <Link
                href="/invoices/new"
                className="text-amber-500 font-medium text-sm"
              >
                View all
              </Link>
            )}
          </div>

          {recentInvoices.length === 0 ? (
            <div className="p-16 text-center">
              {/* Empty state SVG illustration */}
              <div className="w-40 h-40 mx-auto mb-8">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  {/* Paper/document shape */}
                  <rect x="50" y="30" width="100" height="130" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2" />
                  <rect x="50" y="30" width="100" height="130" rx="8" fill="url(#emptyGrad)" opacity="0.5" />
                  {/* Folded corner */}
                  <path d="M120 30 L150 30 L150 60 Z" fill="#111827" stroke="#374151" strokeWidth="1" />
                  <path d="M120 30 L120 55 C120 57.7614 122.239 60 125 60 L150 60" fill="#1f2937" stroke="#374151" strokeWidth="2" />
                  {/* Content lines */}
                  <rect x="68" y="75" width="64" height="6" rx="3" fill="#374151" />
                  <rect x="68" y="90" width="48" height="6" rx="3" fill="#374151" />
                  <rect x="68" y="105" width="56" height="6" rx="3" fill="#374151" />
                  <rect x="68" y="120" width="36" height="6" rx="3" fill="#374151" />
                  {/* Amber accent circle with plus */}
                  <circle cx="140" cy="145" r="24" fill="#f59e0b" opacity="0.15" />
                  <circle cx="140" cy="145" r="18" fill="#f59e0b" opacity="0.25" />
                  <path d="M140 137 L140 153 M132 145 L148 145" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="emptyGrad" x1="100" y1="30" x2="100" y2="160">
                      <stop stopColor="#f59e0b" stopOpacity="0.05" />
                      <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No invoices yet</h3>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                Create your first invoice to start tracking payments and getting paid faster.
              </p>
              <Link
                href="/invoices/new"
                className="inline-flex items-center gap-2 bg-amber-500 text-gray-950 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Invoice
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`p-4 hover:bg-gray-700/50 transition-colors border-l-4 ${statusBorder[invoice.status] || "border-l-gray-600"}`}
                >
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-400">
                        {invoice.client.name}
                      </p>
                    </div>
                    {invoice.isRecurring && (
                      <span className="bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase hidden sm:inline-flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Recurring
                      </span>
                    )}
                    <p className="text-xs text-gray-500 hidden sm:block">
                      Due {fmtDate(invoice.dueDate)}
                    </p>
                  </Link>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[invoice.status] || ""}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[invoice.status] || ""}`} />
                      {invoice.status}
                      {invoice.status === "viewed" && (
                        <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </span>
                    {/* Prominent total amount */}
                    <p className="text-base font-bold text-white text-right whitespace-nowrap">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </p>
                    {/* Quick actions */}
                    <InvoiceCardActions invoiceId={invoice.id} status={invoice.status} />
                    <a
                      href={`/api/invoices/${invoice.id}/pdf`}
                      target="_blank"
                      className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-gray-700 transition-colors"
                      title="Download PDF"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
          <div className="bg-gray-800/60 rounded-2xl border border-gray-700 mt-8">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                Recent Quotes
                <span className="bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/40 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {quotes.length}
                </span>
              </h2>
            </div>
            <div className="divide-y divide-gray-700">
              {recentQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className={`p-4 hover:bg-gray-700/50 transition-colors border-l-4 ${statusBorder[quote.status] || "border-l-gray-600"}`}
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating create button & bottom nav (mobile only) */}
      <FloatingCreateButton />
      <BottomNav />
    </div>
  );
}
