import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/Navbar";
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

  const overdueAmount = invoices
    .filter((i) => i.status === "overdue")
    .reduce((sum, i) => sum + i.total, 0);

  const recentInvoices = invoices.slice(0, 5);

  const statusColors: Record<string, string> = {
    draft: "bg-gray-700 text-gray-300",
    sent: "bg-blue-900/50 text-blue-400",
    viewed: "bg-yellow-900/50 text-yellow-400",
    paid: "bg-green-900/50 text-green-400",
    overdue: "bg-red-900/50 text-red-400",
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
          <Link
            href="/invoices/new"
            className="bg-amber-500 text-gray-950 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-amber-400 transition-colors"
          >
            + New Invoice
          </Link>
        </div>

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
              Overdue Amount
            </p>
            <p className="text-3xl font-bold text-red-400">
              {formatCurrency(overdueAmount)}
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
            <div className="p-12 text-center">
              <p className="text-gray-400 text-lg mb-4">
                No invoices yet. Create your first one!
              </p>
              <Link
                href="/invoices/new"
                className="inline-block bg-amber-500 text-gray-950 px-6 py-3 rounded-xl font-semibold hover:bg-amber-400"
              >
                + Create Invoice
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {recentInvoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/invoices/${invoice.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-white">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-400">
                        {invoice.client.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[invoice.status] || ""}`}
                    >
                      {invoice.status}
                    </span>
                    <p className="font-semibold text-white w-28 text-right">
                      {formatCurrency(invoice.total)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
