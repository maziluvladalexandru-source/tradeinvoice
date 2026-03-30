import { prisma } from "@/lib/prisma";
import { verifyPortalToken } from "@/lib/portal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    sent: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    viewed: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    paid: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    overdue: "bg-red-500/15 text-red-400 border border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[status] || "bg-gray-700/50 text-gray-400 border border-gray-600/30"}`}>
      {status}
    </span>
  );
}

export default async function CustomerPortalPage({
  params,
  searchParams,
}: {
  params: { clientId: string };
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  if (!token || !verifyPortalToken(params.clientId, token)) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
        <div className="bg-[#111827] rounded-2xl border border-gray-700/50 p-8 sm:p-12 max-w-md w-full text-center shadow-2xl shadow-black/20 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm">This portal link is invalid or has expired. Please use the link from your invoice email.</p>
        </div>
      </div>
    );
  }

  const client = await prisma.client.findUnique({
    where: { id: params.clientId },
    include: {
      user: {
        select: {
          businessName: true,
          logoUrl: true,
          email: true,
        },
      },
      invoices: {
        where: { type: "invoice", status: { not: "draft" } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          invoiceNumber: true,
          createdAt: true,
          dueDate: true,
          total: true,
          status: true,
          currency: true,
          paidAt: true,
        },
      },
    },
  });

  if (!client) notFound();

  const businessName = client.user.businessName || "Business";
  const logoUrl = client.user.logoUrl || null;
  const invoices = client.invoices;
  const currency = invoices[0]?.currency || "EUR";

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0);
  const outstanding = totalInvoiced - totalPaid;

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Header */}
      <header className="bg-[#111827] border-b border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-contain flex-shrink-0 shadow-lg shadow-black/20" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                <span className="text-xl font-bold text-gray-900 leading-none">
                  {businessName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{businessName}</h1>
              <p className="text-gray-400 text-sm">Invoices for {client.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111827] rounded-2xl border border-gray-700/50 p-5 transition-all duration-200 hover:border-gray-600/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Total Invoiced</p>
            <p className="text-2xl font-bold text-white tabular-nums">{formatCurrency(totalInvoiced, currency)}</p>
          </div>
          <div className="bg-[#111827] rounded-2xl border border-gray-700/50 p-5 transition-all duration-200 hover:border-emerald-500/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-400 tabular-nums">{formatCurrency(totalPaid, currency)}</p>
          </div>
          <div className="bg-[#111827] rounded-2xl border border-gray-700/50 p-5 transition-all duration-200 hover:border-amber-500/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">Outstanding</p>
            <p className="text-2xl font-bold text-amber-400 tabular-nums">{formatCurrency(outstanding, currency)}</p>
          </div>
        </div>

        {/* Invoices List */}
        {invoices.length === 0 ? (
          <div className="bg-[#111827] rounded-2xl border border-gray-700/50 p-12 text-center">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-gray-400 font-medium">No invoices yet</p>
          </div>
        ) : (
          <div className="bg-[#111827] rounded-2xl border border-gray-700/50 overflow-hidden">
            {/* Desktop Table */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-6">Invoice</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-4">Date</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-4">Due</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-4">Amount</th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-4">Status</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-white font-mono">{inv.invoiceNumber}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-400">{formatDate(inv.createdAt)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm ${inv.status === "overdue" ? "text-red-400 font-medium" : "text-gray-400"}`}>
                        {formatDate(inv.dueDate)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-semibold text-white tabular-nums">
                        {formatCurrency(inv.total, inv.currency)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/invoice/${inv.id}/view`}
                          className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          View
                        </a>
                        <span className="text-gray-700">|</span>
                        <a
                          href={`/api/invoices/${inv.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          PDF
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-700/30">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-white font-mono">{inv.invoiceNumber}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(inv.createdAt)}</p>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-lg font-bold text-white tabular-nums">
                      {formatCurrency(inv.total, inv.currency)}
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href={`/invoice/${inv.id}/view`}
                        className="text-xs font-medium text-amber-400"
                      >
                        View
                      </a>
                      <a
                        href={`/api/invoices/${inv.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-500"
                      >
                        PDF
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 mt-4">
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Secure portal</span>
            </div>
            <span className="text-gray-700">|</span>
            <a
              href="https://tradeinvoice.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              Powered by <span className="font-semibold text-amber-500">TradeInvoice</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
