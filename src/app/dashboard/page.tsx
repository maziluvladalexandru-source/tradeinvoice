import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/Navbar";
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

  const totalOutstanding = invoices
    .filter((i) => ["sent", "viewed", "overdue"].includes(i.status))
    .reduce((sum, i) => sum + i.total, 0);

  const paidThisMonth = invoices
    .filter(
      (i) => i.status === "paid" && i.paidAt && new Date(i.paidAt) >= monthStart
    )
    .reduce((sum, i) => sum + i.total, 0);

  const overdueCount = invoices.filter((i) => i.status === "overdue").length;

  const recentInvoices = invoices.slice(0, 5);

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

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
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
                Free Plan: {user.invoiceCount}/5 invoices used this month
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
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No invoices yet</h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                Create your first invoice to start tracking payments and getting paid faster.
              </p>
              <Link
                href="/invoices/new"
                className="inline-block bg-amber-500 text-gray-950 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-amber-400 transition-colors"
              >
                Create Your First Invoice
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-400">
                        {invoice.client.name}
                      </p>
                    </div>
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
                    <p className="font-semibold text-white w-28 text-right">
                      {formatCurrency(invoice.total)}
                    </p>
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
      </div>
    </div>
  );
}
