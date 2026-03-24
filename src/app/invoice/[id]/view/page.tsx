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
  const pdfUrl = `/api/invoices/${invoice.id}/pdf`;
  const hasStripe = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const businessName = invoice.user.businessName || "TradeInvoice";
  const contactEmail = invoice.user.email;

  return (
    <div className="min-h-screen bg-white">
      {/* Status Banners */}
      {isPaid && (
        <div className="bg-emerald-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-center gap-3">
            <svg className="w-7 h-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold text-lg text-white leading-tight">PAID</p>
              {invoice.paidAt && (
                <p className="text-emerald-100 text-sm">Payment received {formatDate(invoice.paidAt)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {isOverdue && !isPaid && (
        <div className="bg-red-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-center gap-3">
            <svg className="w-7 h-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="font-bold text-lg text-white leading-tight">OVERDUE</p>
              <p className="text-red-100 text-sm">Payment was due {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>
      )}

      {!isPaid && !isOverdue && (
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-2">
            <svg className="w-4.5 h-4.5 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-slate-600 text-sm font-medium">
              Payment due {formatDate(invoice.dueDate)}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Business Header */}
        <header className="mb-10 sm:mb-14">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-2xl font-bold text-white leading-none">
                  {businessName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{businessName}</h2>
                <div className="text-slate-500 text-sm mt-0.5">
                  {invoice.user.businessAddress && (
                    <p>{invoice.user.businessAddress}</p>
                  )}
                  <p>
                    {contactEmail}
                    {invoice.user.businessPhone && ` \u00B7 ${invoice.user.businessPhone}`}
                  </p>
                </div>
              </div>
            </div>
            {(invoice.user.kvkNumber || invoice.user.vatNumber) && (
              <div className="text-xs text-slate-400 sm:text-right space-y-0.5">
                {invoice.user.kvkNumber && <p>KVK: {invoice.user.kvkNumber}</p>}
                {invoice.user.vatNumber && <p>BTW: {invoice.user.vatNumber}</p>}
              </div>
            )}
          </div>
        </header>

        {/* Invoice Title + Meta */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-1">Invoice</h1>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight">
                {invoice.invoiceNumber}
              </p>
              {invoice.description && (
                <p className="text-slate-500 text-sm mt-1.5">{invoice.description}</p>
              )}
            </div>
            <div className="sm:text-right text-sm space-y-1">
              <div className="flex sm:justify-end gap-3">
                <span className="text-slate-400 w-16 sm:w-auto">Issued</span>
                <span className="text-slate-700 font-medium">{formatDate(invoice.createdAt)}</span>
              </div>
              {invoice.serviceDate && (
                <div className="flex sm:justify-end gap-3">
                  <span className="text-slate-400 w-16 sm:w-auto">Service</span>
                  <span className="text-slate-700 font-medium">{formatDate(invoice.serviceDate)}</span>
                </div>
              )}
              <div className="flex sm:justify-end gap-3">
                <span className={`w-16 sm:w-auto ${isOverdue && !isPaid ? "text-red-500" : "text-slate-400"}`}>Due</span>
                <span className={`font-medium ${isOverdue && !isPaid ? "text-red-600" : "text-slate-700"}`}>
                  {formatDate(invoice.dueDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200" />
        </div>

        {/* Bill To */}
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Bill To</p>
          <p className="text-base font-semibold text-slate-900">{invoice.client.name}</p>
          <p className="text-slate-500 text-sm">{invoice.client.email}</p>
          {invoice.client.address && (
            <p className="text-slate-500 text-sm mt-0.5">{invoice.client.address}</p>
          )}
        </div>

        {/* Line Items Table */}
        <div className="mb-8 sm:mb-10">
          {/* Desktop Table */}
          <table className="w-full hidden sm:table">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400 pb-3 pr-4">Description</th>
                <th className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 pb-3 px-4 w-20">Qty</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-slate-400 pb-3 px-4 w-28">Unit Price</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-slate-400 pb-3 pl-4 w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, idx) => (
                <tr key={item.id} className={idx < invoice.lineItems.length - 1 ? "border-b border-slate-100" : ""}>
                  <td className="text-slate-800 text-sm py-4 pr-4">{item.description}</td>
                  <td className="text-slate-500 text-sm text-center py-4 px-4">{item.quantity}</td>
                  <td className="text-slate-500 text-sm text-right py-4 px-4">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="text-slate-900 text-sm font-medium text-right py-4 pl-4">{formatCurrency(item.total, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Line Items */}
          <div className="sm:hidden divide-y divide-slate-100 border-t-2 border-slate-200">
            {invoice.lineItems.map((item) => (
              <div key={item.id} className="py-4">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-slate-800 font-medium text-sm flex-1 pr-4">{item.description}</p>
                  <p className="text-slate-900 font-semibold text-sm tabular-nums">
                    {formatCurrency(item.total, invoice.currency)}
                  </p>
                </div>
                <p className="text-slate-400 text-xs tabular-nums">
                  {item.quantity} &times; {formatCurrency(item.unitPrice, invoice.currency)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t-2 border-slate-200 pt-4 mt-4">
            <div className="flex flex-col items-end space-y-2">
              <div className="w-full max-w-xs flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-700 tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="w-full max-w-xs flex justify-between text-sm">
                  <span className="text-slate-400">VAT ({invoice.taxRate}%)</span>
                  <span className="text-slate-700 tabular-nums">{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                </div>
              )}
              <div className="w-full max-w-xs flex justify-between pt-3 border-t border-slate-200">
                <span className="text-base font-bold text-slate-900">
                  {isPaid ? "Amount Paid" : "Amount Due"}
                </span>
                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Now CTA */}
        {!isPaid && (
          <div className="mb-10 sm:mb-12">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                Total Due
              </p>
              <p className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight tabular-nums mb-1">
                {formatCurrency(invoice.total, invoice.currency)}
              </p>
              {isOverdue ? (
                <p className="text-red-600 text-sm font-medium mb-6">Overdue &mdash; please pay immediately</p>
              ) : (
                <p className="text-slate-500 text-sm mb-6">Due {formatDate(invoice.dueDate)}</p>
              )}

              {hasStripe ? (
                <a
                  href={`mailto:${contactEmail}?subject=Payment for ${invoice.invoiceNumber}&body=I would like to arrange payment for invoice ${invoice.invoiceNumber} (${formatCurrency(invoice.total, invoice.currency)}).`}
                  className="inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-base px-10 py-4 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  Pay Now
                </a>
              ) : (
                <a
                  href={`mailto:${contactEmail}?subject=Payment for ${invoice.invoiceNumber}&body=I would like to arrange payment for invoice ${invoice.invoiceNumber} (${formatCurrency(invoice.total, invoice.currency)}).`}
                  className="inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-base px-10 py-4 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  Arrange Payment
                </a>
              )}
            </div>
          </div>
        )}

        {/* Bank Transfer Details */}
        {!isPaid && invoice.user.bankDetails && (
          <div className="mb-8 sm:mb-10">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Payment Details</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm mb-2">Bank Transfer</p>
                    <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                      {invoice.user.bankDetails}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3 flex items-center gap-3">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Payment Reference:</span>
                <span className="text-sm font-mono font-bold text-slate-900">{invoice.invoiceNumber}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Notes */}
        {!isPaid && invoice.paymentNotes && (
          <div className="mb-8 sm:mb-10">
            <div className="bg-amber-50 rounded-xl border border-amber-200/80 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Payment Notes</p>
                  <p className="text-amber-800 text-sm whitespace-pre-line leading-relaxed">{invoice.paymentNotes}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Download PDF */}
        <div className="text-center mb-10 sm:mb-14">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors py-2 px-4 rounded-lg hover:bg-slate-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </a>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-100 pt-8 pb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white leading-none">
                  {businessName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{businessName}</p>
                <p className="text-xs text-slate-400">{contactEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span>Delivered securely</span>
              </div>
              <span className="text-slate-200">|</span>
              <a
                href="https://tradeinvoice.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-500 transition-colors"
              >
                Powered by <span className="font-semibold">TradeInvoice</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
