import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function PublicInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { client: true, lineItems: true, user: true },
  });

  if (!invoice) notFound();

  // Mark as viewed and notify contractor
  if (invoice.status === "sent") {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: "viewed", viewedAt: new Date() },
    });

    // Fire-and-forget notification to contractor
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    fetch(`${appUrl}/api/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId: invoice.id, type: "viewed" }),
    }).catch(() => {});
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    viewed: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-blue-700">
                  {invoice.user.businessName || "TradeInvoice"}
                </h1>
                {invoice.user.businessAddress && (
                  <p className="text-gray-500 text-sm mt-1">
                    {invoice.user.businessAddress}
                  </p>
                )}
                {invoice.user.businessPhone && (
                  <p className="text-gray-500 text-sm">
                    {invoice.user.businessPhone}
                  </p>
                )}
                <p className="text-gray-500 text-sm">{invoice.user.email}</p>
                {invoice.user.kvkNumber && (
                  <p className="text-gray-500 text-sm">KVK: {invoice.user.kvkNumber}</p>
                )}
                {invoice.user.vatNumber && (
                  <p className="text-gray-500 text-sm">BTW: {invoice.user.vatNumber}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">INVOICE</p>
                <p className="text-xl font-bold text-gray-900">
                  {invoice.invoiceNumber}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[invoice.status] || ""}`}
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>

          {/* Client + dates */}
          <div className="p-8 border-b border-gray-100 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                Bill To
              </h3>
              <p className="font-semibold text-gray-900">
                {invoice.client.name}
              </p>
              <p className="text-gray-600">{invoice.client.email}</p>
              {invoice.client.address && (
                <p className="text-gray-600">{invoice.client.address}</p>
              )}
            </div>
            <div className="md:text-right">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                Details
              </h3>
              <p className="text-gray-600">
                Issued: {formatDate(invoice.createdAt)}
              </p>
              {invoice.serviceDate && (
                <p className="text-gray-600">
                  Service: {formatDate(invoice.serviceDate)}
                </p>
              )}
              <p className="text-gray-600">
                Due: {formatDate(invoice.dueDate)}
              </p>
              {invoice.description && (
                <p className="text-gray-500 mt-2">{invoice.description}</p>
              )}
            </div>
          </div>

          {/* Line items */}
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-8 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-8 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-8 py-4 text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-600">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-8 py-4 text-right font-medium text-gray-900">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="p-8 bg-gray-50 border-t border-gray-100">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-bold text-blue-700 pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Notes & Bank Details */}
          {(invoice.paymentNotes || invoice.user.bankDetails) && (
            <div className="p-8 border-t border-gray-100">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-3">
                Payment Information
              </h3>
              {invoice.user.bankDetails && (
                <p className="text-gray-700 whitespace-pre-line mb-2">{invoice.user.bankDetails}</p>
              )}
              {invoice.paymentNotes && (
                <p className="text-gray-600 whitespace-pre-line text-sm">{invoice.paymentNotes}</p>
              )}
            </div>
          )}

          <div className="p-6 text-center text-gray-400 text-sm">
            Powered by TradeInvoice
          </div>
        </div>
      </div>
    </div>
  );
}
