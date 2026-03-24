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
  const businessName = invoice.user.businessName || "TradeInvoice";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Banner */}
      <StatusBanner status={effectiveStatus} dueDate={invoice.dueDate} />

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Business Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-gray-200 shadow-sm mb-4">
            <span className="text-2xl font-bold text-gray-700">
              {businessName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {businessName}
          </h1>
          <div className="mt-1.5 text-gray-500 text-sm space-y-0.5">
            {invoice.user.businessAddress && (
              <p>{invoice.user.businessAddress}</p>
            )}
            <p>
              {invoice.user.email}
              {invoice.user.businessPhone &&
                ` \u00B7 ${invoice.user.businessPhone}`}
            </p>
            {(invoice.user.kvkNumber || invoice.user.vatNumber) && (
              <p className="text-gray-400 text-xs">
                {invoice.user.kvkNumber && (
                  <span>KVK: {invoice.user.kvkNumber}</span>
                )}
                {invoice.user.kvkNumber && invoice.user.vatNumber && (
                  <span> \u00B7 </span>
                )}
                {invoice.user.vatNumber && (
                  <span>BTW: {invoice.user.vatNumber}</span>
                )}
              </p>
            )}
          </div>
        </header>

        {/* Amount + Due Date Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center mb-6">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
            {isPaid ? "Amount Paid" : "Amount Due"}
          </p>
          <p className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {formatCurrency(invoice.total, invoice.currency)}
          </p>
          {!isPaid && (
            <p className={`mt-2 text-sm font-medium ${isOverdue ? "text-red-600" : "text-gray-500"}`}>
              {isOverdue
                ? `Overdue \u2014 was due ${formatDate(invoice.dueDate)}`
                : `Due ${formatDate(invoice.dueDate)}`}
            </p>
          )}
          {isPaid && invoice.paidAt && (
            <p className="mt-2 text-sm text-green-600 font-medium">
              Paid on {formatDate(invoice.paidAt)}
            </p>
          )}

          {/* Pay Now Button */}
          {!isPaid && (
            <div className="mt-6 flex flex-col gap-3">
              {hasStripe ? (
                <a
                  href={`mailto:${invoice.user.email}?subject=Payment for ${invoice.invoiceNumber}&body=I would like to arrange payment for invoice ${invoice.invoiceNumber} (${formatCurrency(invoice.total, invoice.currency)}).`}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base px-8 py-3.5 rounded-lg transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  Pay Now
                </a>
              ) : (
                <a
                  href={`mailto:${invoice.user.email}?subject=Payment for ${invoice.invoiceNumber}&body=I would like to arrange payment for invoice ${invoice.invoiceNumber} (${formatCurrency(invoice.total, invoice.currency)}).`}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base px-8 py-3.5 rounded-lg transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  Contact to Pay
                </a>
              )}
            </div>
          )}
        </div>

        {/* Invoice Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Invoice Meta */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                  Invoice
                </p>
                <p className="text-base font-semibold text-gray-900 font-mono">
                  {invoice.invoiceNumber}
                </p>
                {invoice.description && (
                  <p className="text-gray-500 text-sm mt-1">
                    {invoice.description}
                  </p>
                )}
              </div>
              <div className="sm:text-right text-sm text-gray-600 space-y-0.5">
                <p>
                  <span className="text-gray-400">Issued:</span>{" "}
                  {formatDate(invoice.createdAt)}
                </p>
                {invoice.serviceDate && (
                  <p>
                    <span className="text-gray-400">Service:</span>{" "}
                    {formatDate(invoice.serviceDate)}
                  </p>
                )}
                <p className={isOverdue && !isPaid ? "text-red-600 font-medium" : ""}>
                  <span className={isOverdue && !isPaid ? "text-red-400" : "text-gray-400"}>
                    Due:
                  </span>{" "}
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50/50">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
              Billed To
            </p>
            <p className="font-semibold text-gray-900">
              {invoice.client.name}
            </p>
            <p className="text-gray-500 text-sm">{invoice.client.email}</p>
            {invoice.client.address && (
              <p className="text-gray-500 text-sm mt-0.5">
                {invoice.client.address}
              </p>
            )}
          </div>

          {/* Line Items */}
          <div className="divide-y divide-gray-100">
            {/* Header - hidden on mobile, shown on sm+ */}
            <div className="hidden sm:grid sm:grid-cols-12 px-6 sm:px-8 py-3 text-xs font-medium uppercase tracking-wider text-gray-400 bg-gray-50/50">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {invoice.lineItems.map((item) => (
              <div key={item.id} className="px-6 sm:px-8 py-4">
                {/* Mobile layout */}
                <div className="sm:hidden">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-gray-900 font-medium text-sm">{item.description}</p>
                    <p className="text-gray-900 font-semibold text-sm ml-4">
                      {formatCurrency(item.total, invoice.currency)}
                    </p>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {item.quantity} &times; {formatCurrency(item.unitPrice, invoice.currency)}
                  </p>
                </div>

                {/* Desktop layout */}
                <div className="hidden sm:grid sm:grid-cols-12 items-center">
                  <div className="col-span-6 text-gray-800 text-sm">
                    {item.description}
                  </div>
                  <div className="col-span-2 text-center text-gray-500 text-sm">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-right text-gray-500 text-sm">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </div>
                  <div className="col-span-2 text-right text-gray-900 font-medium text-sm">
                    {formatCurrency(item.total, invoice.currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-200">
            <div className="max-w-xs ml-auto space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Transfer Details */}
        {!isPaid && invoice.user.bankDetails && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Bank Transfer Details
                </h3>
                <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                  {invoice.user.bankDetails}
                </p>
                <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Reference:</span>
                  <span className="text-sm font-mono font-semibold text-gray-900">{invoice.invoiceNumber}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Notes */}
        {!isPaid && invoice.paymentNotes && (
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-amber-900 mb-1">
                  Payment Notes
                </h3>
                <p className="text-amber-800 text-sm whitespace-pre-line">
                  {invoice.paymentNotes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Download PDF */}
        <div className="text-center mb-8">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </a>
        </div>

        {/* Trust Badge Footer */}
        <footer className="pb-8">
          <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-gray-400 text-sm">Secured by</span>
            <span className="text-gray-600 text-sm font-semibold">TradeInvoice</span>
          </div>
          <p className="text-gray-400 text-xs text-center mt-1">
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
      bg: "bg-green-50 border-green-200",
      text: "text-green-700",
      icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      label: "Paid",
      sublabel: "This invoice has been paid. Thank you!",
    },
    overdue: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-700",
      icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
      label: "Overdue",
      sublabel: `Payment was due ${formatDate(dueDate)}. Please pay as soon as possible.`,
    },
    viewed: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
      label: "Payment Due",
      sublabel: `Please pay by ${formatDate(dueDate)}`,
    },
    sent: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
      label: "Payment Due",
      sublabel: `Please pay by ${formatDate(dueDate)}`,
    },
    draft: {
      bg: "bg-gray-50 border-gray-200",
      text: "text-gray-600",
      icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
      label: "Draft",
    },
  };

  const c = config[status] || config.draft;

  return (
    <div className={`border-b ${c.bg}`}>
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-center gap-2">
        <svg
          className={`w-5 h-5 ${c.text}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
        </svg>
        <span className={`font-semibold text-sm ${c.text}`}>{c.label}</span>
        {c.sublabel && (
          <span className="text-gray-500 text-sm hidden sm:inline">
            &mdash; {c.sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
