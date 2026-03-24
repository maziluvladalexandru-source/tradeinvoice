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

  const isPaid = invoice.status === "paid";
  const isOverdue =
    invoice.status === "overdue" ||
    (!isPaid && new Date(invoice.dueDate) < new Date());
  const effectiveStatus = isPaid
    ? "paid"
    : isOverdue
      ? "overdue"
      : invoice.status;

  const pdfUrl = `/api/invoices/${invoice.id}/pdf`;
  const hasStripe = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Status Banner */}
      <StatusBanner status={effectiveStatus} dueDate={invoice.dueDate} />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Business Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <svg
              className="w-7 h-7 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {invoice.user.businessName || "TradeInvoice"}
          </h1>
          <div className="mt-2 text-gray-400 text-sm space-y-0.5">
            {invoice.user.businessAddress && (
              <p>{invoice.user.businessAddress}</p>
            )}
            <p>
              {invoice.user.email}
              {invoice.user.businessPhone &&
                ` · ${invoice.user.businessPhone}`}
            </p>
            {(invoice.user.kvkNumber || invoice.user.vatNumber) && (
              <p className="text-gray-500">
                {invoice.user.kvkNumber && (
                  <span>KVK: {invoice.user.kvkNumber}</span>
                )}
                {invoice.user.kvkNumber && invoice.user.vatNumber && (
                  <span> · </span>
                )}
                {invoice.user.vatNumber && (
                  <span>BTW: {invoice.user.vatNumber}</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Main Invoice Card */}
        <div className="bg-gray-900/80 rounded-2xl border border-gray-800 overflow-hidden backdrop-blur-sm">
          {/* Invoice Number + Total Header */}
          <div className="p-6 sm:p-8 border-b border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Invoice
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {invoice.invoiceNumber}
                </p>
                {invoice.description && (
                  <p className="text-gray-400 text-sm mt-2">
                    {invoice.description}
                  </p>
                )}
              </div>
              <div className="sm:text-right">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Amount Due
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-amber-500">
                  {formatCurrency(invoice.total, invoice.currency)}
                </p>
              </div>
            </div>
          </div>

          {/* Client + Dates */}
          <div className="p-6 sm:p-8 border-b border-gray-800 grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                Bill To
              </p>
              <p className="font-semibold text-white text-lg">
                {invoice.client.name}
              </p>
              <p className="text-gray-400 text-sm">{invoice.client.email}</p>
              {invoice.client.address && (
                <p className="text-gray-400 text-sm mt-1">
                  {invoice.client.address}
                </p>
              )}
            </div>
            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                Invoice Details
              </p>
              <div className="space-y-1 text-sm">
                <p className="text-gray-300">
                  <span className="text-gray-500">Issued: </span>
                  {formatDate(invoice.createdAt)}
                </p>
                {invoice.serviceDate && (
                  <p className="text-gray-300">
                    <span className="text-gray-500">Service: </span>
                    {formatDate(invoice.serviceDate)}
                  </p>
                )}
                <p
                  className={
                    isOverdue && !isPaid
                      ? "text-red-400 font-semibold"
                      : "text-gray-300"
                  }
                >
                  <span
                    className={
                      isOverdue && !isPaid ? "text-red-400/70" : "text-gray-500"
                    }
                  >
                    Due:{" "}
                  </span>
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-xs uppercase tracking-widest text-gray-500">
                  <th className="px-6 sm:px-8 py-4 text-left font-medium">
                    Description
                  </th>
                  <th className="px-4 py-4 text-center font-medium">Qty</th>
                  <th className="px-4 py-4 text-right font-medium">Price</th>
                  <th className="px-6 sm:px-8 py-4 text-right font-medium">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {invoice.lineItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 sm:px-8 py-4 text-gray-200">
                      {item.description}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-400">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 text-right text-gray-400">
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="px-6 sm:px-8 py-4 text-right font-medium text-white">
                      {formatCurrency(item.total, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="p-6 sm:p-8 bg-gray-800/30 border-t border-gray-800">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>
                    {formatCurrency(invoice.taxAmount, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-bold text-amber-500 pt-3 border-t border-gray-700">
                <span>Total</span>
                <span>{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isPaid && (
            <div className="p-6 sm:p-8 border-t border-gray-800">
              <div className="flex flex-col sm:flex-row gap-3">
                {hasStripe ? (
                  <a
                    href={`mailto:${invoice.user.email}?subject=Payment for ${invoice.invoiceNumber}&body=I would like to arrange payment for invoice ${invoice.invoiceNumber} (${formatCurrency(invoice.total, invoice.currency)}).`}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    Pay Now
                  </a>
                ) : (
                  <a
                    href={`mailto:${invoice.user.email}?subject=Payment for ${invoice.invoiceNumber}&body=I would like to arrange payment for invoice ${invoice.invoiceNumber} (${formatCurrency(invoice.total, invoice.currency)}).`}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    Contact to Pay
                  </a>
                )}
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold px-6 py-4 rounded-xl border border-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Download PDF
                </a>
              </div>
            </div>
          )}

          {/* Paid state - just show PDF download */}
          {isPaid && (
            <div className="p-6 sm:p-8 border-t border-gray-800 text-center">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold px-6 py-4 rounded-xl border border-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download PDF
              </a>
            </div>
          )}

          {/* Bank Transfer Details */}
          {!isPaid && invoice.user.bankDetails && (
            <div className="p-6 sm:p-8 border-t border-gray-800">
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mt-0.5">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      Bank Transfer Details
                    </h3>
                    <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                      {invoice.user.bankDetails}
                    </p>
                    <p className="text-gray-500 text-xs mt-3">
                      Reference: {invoice.invoiceNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Notes */}
          {!isPaid && invoice.paymentNotes && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <div className="bg-amber-500/5 rounded-xl p-5 border border-amber-500/10">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-amber-500/70 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-500/90 mb-1">
                      Payment Notes
                    </h3>
                    <p className="text-gray-400 text-sm whitespace-pre-line">
                      {invoice.paymentNotes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center pb-8">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            <span>Secured by</span>
            <span className="text-amber-500/80 font-semibold">
              TradeInvoice
            </span>
          </div>
          <p className="text-gray-700 text-xs mt-2">
            This invoice was generated and delivered securely.
          </p>
        </footer>
      </div>
    </div>
  );
}

function StatusBanner({
  status,
  dueDate,
}: {
  status: string;
  dueDate: Date;
}) {
  const config: Record<
    string,
    { bg: string; text: string; icon: string; label: string; sublabel?: string }
  > = {
    paid: {
      bg: "bg-green-500/10 border-green-500/20",
      text: "text-green-400",
      icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      label: "Paid",
      sublabel: "This invoice has been paid. Thank you!",
    },
    overdue: {
      bg: "bg-red-500/10 border-red-500/20",
      text: "text-red-400",
      icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
      label: "Overdue",
      sublabel: `Payment was due ${formatDate(dueDate)}. Please pay as soon as possible.`,
    },
    viewed: {
      bg: "bg-amber-500/10 border-amber-500/20",
      text: "text-amber-400",
      icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
      label: "Payment Due",
      sublabel: `Please pay by ${formatDate(dueDate)}`,
    },
    sent: {
      bg: "bg-blue-500/10 border-blue-500/20",
      text: "text-blue-400",
      icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
      label: "Payment Due",
      sublabel: `Please pay by ${formatDate(dueDate)}`,
    },
    draft: {
      bg: "bg-gray-500/10 border-gray-500/20",
      text: "text-gray-400",
      icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
      label: "Draft",
    },
  };

  const c = config[status] || config.draft;

  return (
    <div className={`border-b ${c.bg}`}>
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center gap-2">
        <svg
          className={`w-5 h-5 ${c.text}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
        </svg>
        <span className={`font-semibold ${c.text}`}>{c.label}</span>
        {c.sublabel && (
          <span className="text-gray-400 text-sm hidden sm:inline">
            — {c.sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
