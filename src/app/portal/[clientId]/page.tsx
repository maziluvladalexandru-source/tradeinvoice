import { prisma } from "@/lib/prisma";
import { verifyPortalToken } from "@/lib/portal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-amber-100 text-amber-700",
    paid: "bg-emerald-100 text-emerald-700",
    overdue: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm">This portal link is invalid or has expired. Please use the link from your invoice email.</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-contain flex-shrink-0 shadow-sm" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-xl font-bold text-white leading-none">
                  {businessName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{businessName}</h1>
              <p className="text-gray-500 text-sm">Invoices for {client.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Total Invoiced</p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatCurrency(totalInvoiced, currency)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-600 tabular-nums">{formatCurrency(totalPaid, currency)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">Outstanding</p>
            <p className="text-2xl font-bold text-amber-600 tabular-nums">{formatCurrency(outstanding, currency)}</p>
          </div>
        </div>

        {/* Invoices List */}
        {invoices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-gray-500 font-medium">No invoices yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Desktop Table */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-6">Invoice</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-4">Date</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-4">Due</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-4">Amount</th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-4">Status</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-gray-900 font-mono">{inv.invoiceNumber}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-500">{formatDate(inv.createdAt)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm ${inv.status === "overdue" ? "text-red-600 font-medium" : "text-gray-500"}`}>
                        {formatDate(inv.dueDate)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-semibold text-gray-900 tabular-nums">
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
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          View
                        </a>
                        <span className="text-gray-200">|</span>
                        <a
                          href={`/api/invoices/${inv.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
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
            <div className="sm:hidden divide-y divide-gray-100">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 font-mono">{inv.invoiceNumber}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(inv.createdAt)}</p>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-lg font-bold text-gray-900 tabular-nums">
                      {formatCurrency(inv.total, inv.currency)}
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href={`/invoice/${inv.id}/view`}
                        className="text-xs font-medium text-blue-600"
                      >
                        View
                      </a>
                      <a
                        href={`/api/invoices/${inv.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-400"
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
          <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Secure portal</span>
            </div>
            <span className="text-gray-200">|</span>
            <a
              href="https://tradeinvoice.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500 transition-colors"
            >
              Powered by <span className="font-semibold">TradeInvoice</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
