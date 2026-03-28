import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCountryConfig } from "@/lib/country-config";
import { portalUrl } from "@/lib/portal";
import { notFound } from "next/navigation";
import PayNowButton from "./PayNowButton";
import ViewTracker from "./ViewTracker";

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

  const shouldTrackView = invoice.status === "sent";
  const isPaid = invoice.status === "paid";
  const isOverdue =
    invoice.status === "overdue" ||
    (!isPaid && new Date(invoice.dueDate) < new Date());
  const pdfUrl = `/api/invoices/${invoice.id}/pdf`;
  const businessName = invoice.user.businessName || "TradeInvoice";
  const contactEmail = invoice.user.email;
  const hasBankDetails = !!invoice.user.bankDetails;
  const isQuote = invoice.type === "quote";
  const docLabel = isQuote ? "Quote" : "Invoice";
  const logoUrl = invoice.user.logoUrl || null;
  const countryConfig = getCountryConfig(invoice.invoiceCountry || "NL");

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldTrackView && <ViewTracker invoiceId={invoice.id} />}
      {/* Paid Confirmation */}
      {isPaid && (
        <div className="bg-emerald-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Payment Received</h2>
            <p className="text-emerald-100 text-base">
              Thank you for your payment
              {invoice.paidAt && <> on {formatDate(invoice.paidAt)}</>}
            </p>
          </div>
        </div>
      )}

      {/* Overdue Banner */}
      {isOverdue && !isPaid && (
        <div className="bg-red-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-center gap-3">
            <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="font-bold text-white leading-tight">Payment Overdue</p>
              <p className="text-red-100 text-sm">Was due {formatDate(invoice.dueDate)} &mdash; please pay as soon as possible</p>
            </div>
          </div>
        </div>
      )}

      {/* Due Date Banner */}
      {!isPaid && !isOverdue && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600 text-sm font-medium">
              Payment due {formatDate(invoice.dueDate)}
            </span>
          </div>
        </div>
      )}

      {/* Invoice Card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Business Header */}
          <header className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-14 h-14 rounded-xl object-contain flex-shrink-0 shadow-sm" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-2xl font-bold text-white leading-none">
                      {businessName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{businessName}</h2>
                  <div className="text-gray-500 text-sm mt-0.5 space-y-0.5">
                    {invoice.user.businessAddress && (
                      <p>{invoice.user.businessAddress}</p>
                    )}
                    <p>
                      {contactEmail}
                      {invoice.user.businessPhone && ` · ${invoice.user.businessPhone}`}
                    </p>
                  </div>
                </div>
              </div>
              {(invoice.user.kvkNumber || invoice.user.vatNumber) && (
                <div className="text-xs text-gray-400 sm:text-right space-y-0.5 pl-[4.5rem] sm:pl-0">
                  {invoice.user.kvkNumber && <p>{countryConfig.businessRegLabel}: {invoice.user.kvkNumber}</p>}
                  {invoice.user.vatNumber && <p>{countryConfig.taxIdLabel}: {invoice.user.vatNumber}</p>}
                </div>
              )}
            </div>
          </header>

          {/* Invoice Info + Bill To */}
          <div className="px-6 sm:px-10 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-6 sm:gap-10">
              {/* Invoice Meta */}
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">{docLabel}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-mono tracking-tight mb-1">
                  {invoice.invoiceNumber}
                </p>
                {invoice.description && (
                  <p className="text-gray-500 text-sm">{invoice.description}</p>
                )}
                <div className="mt-4 space-y-1.5 text-sm">
                  <div className="flex gap-3">
                    <span className="text-gray-400 w-16">Issued</span>
                    <span className="text-gray-700 font-medium">{formatDate(invoice.createdAt)}</span>
                  </div>
                  {invoice.serviceDate && (
                    <div className="flex gap-3">
                      <span className="text-gray-400 w-20">{countryConfig.serviceDateLabel}</span>
                      <span className="text-gray-700 font-medium">{formatDate(invoice.serviceDate)}</span>
                    </div>
                  )}
                  {invoice.invoiceCountry === "DE" &&
                    invoice.serviceDate &&
                    formatDate(invoice.serviceDate) === formatDate(invoice.createdAt) && (
                    <p className="text-xs text-amber-600 italic ml-0">
                      {countryConfig.serviceDateNote}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <span className={`w-16 ${isOverdue && !isPaid ? "text-red-500" : "text-gray-400"}`}>Due</span>
                    <span className={`font-medium ${isOverdue && !isPaid ? "text-red-600" : "text-gray-700"}`}>
                      {formatDate(invoice.dueDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Bill To</p>
                <p className="text-base font-semibold text-gray-900">{invoice.client.name}</p>
                <p className="text-gray-500 text-sm">{invoice.client.email}</p>
                {invoice.client.address && (
                  <p className="text-gray-500 text-sm mt-0.5 whitespace-pre-line">{invoice.client.address}</p>
                )}
                {invoice.client.vatNumber && (
                  <p className="text-gray-400 text-xs mt-1">{countryConfig.taxIdLabel}: {invoice.client.vatNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes to Client */}
          {invoice.notesToClient && (
            <div className="px-6 sm:px-10 pb-4">
              <div className="bg-blue-50 rounded-xl border border-blue-200/80 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">Note from {invoice.user.businessName || 'Sender'}</p>
                    <p className="text-blue-800 text-sm whitespace-pre-line leading-relaxed">{invoice.notesToClient}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Line Items */}
          <div className="px-6 sm:px-10">
            {/* Desktop Table */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="border-y border-gray-200 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 pr-4">Description</th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-4 w-20">Qty</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-4 w-28">Unit Price</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 pl-4 w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item, idx) => (
                  <tr key={item.id} className={idx < invoice.lineItems.length - 1 ? "border-b border-gray-100" : ""}>
                    <td className="text-gray-800 text-sm py-4 pr-4">{item.description}</td>
                    <td className="text-gray-500 text-sm text-center py-4 px-4 tabular-nums">{item.quantity}</td>
                    <td className="text-gray-500 text-sm text-right py-4 px-4 tabular-nums">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                    <td className="text-gray-900 text-sm font-medium text-right py-4 pl-4 tabular-nums">{formatCurrency(item.total, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Line Items */}
            <div className="sm:hidden divide-y divide-gray-100 border-y border-gray-200">
              {invoice.lineItems.map((item) => (
                <div key={item.id} className="py-4">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-gray-800 font-medium text-sm flex-1 pr-4">{item.description}</p>
                    <p className="text-gray-900 font-semibold text-sm tabular-nums">
                      {formatCurrency(item.total, invoice.currency)}
                    </p>
                  </div>
                  <p className="text-gray-400 text-xs tabular-nums">
                    {item.quantity} &times; {formatCurrency(item.unitPrice, invoice.currency)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 py-6">
              <div className="flex flex-col items-end space-y-2">
                <div className="w-full max-w-xs flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-gray-700 tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                </div>
                {invoice.taxRate > 0 && (
                  <div className="w-full max-w-xs flex justify-between text-sm">
                    <span className="text-gray-400">VAT ({invoice.taxRate}%)</span>
                    <span className="text-gray-700 tabular-nums">{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                  </div>
                )}
                <div className="w-full max-w-xs flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-base font-bold text-gray-900">
                    {isPaid ? "Amount Paid" : "Amount Due"}
                  </span>
                  <span className="text-2xl font-bold text-gray-900 tabular-nums">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                </div>
                {invoice.depositPercent && invoice.depositAmount && (
                  <div className="w-full max-w-xs mt-2">
                    {invoice.depositPaid ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-bold text-emerald-800">Deposit Paid</span>
                        </div>
                        <p className="text-emerald-700 text-sm font-semibold tabular-nums">
                          {formatCurrency(invoice.depositAmount, invoice.currency)}
                          <span className="text-emerald-500 font-normal"> ({invoice.depositPercent}%)</span>
                        </p>
                        {invoice.depositPaidAt && (
                          <p className="text-emerald-500 text-xs mt-1">Paid on {formatDate(invoice.depositPaidAt)}</p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">Deposit Required</p>
                        <p className="text-xl font-bold text-amber-800 tabular-nums">
                          {formatCurrency(invoice.depositAmount, invoice.currency)}
                        </p>
                        <p className="text-amber-600 text-xs mt-0.5">
                          {invoice.depositPercent}% of {formatCurrency(invoice.total, invoice.currency)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pay Now / Pay Deposit CTA */}
          {!isPaid && (
            <div className="px-6 sm:px-10 pb-8 sm:pb-10">
              {invoice.depositPercent && invoice.depositAmount && !invoice.depositPaid ? (
                <div className="bg-slate-900 rounded-xl p-6 sm:p-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">
                    Deposit Required
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight tabular-nums mb-1">
                    {formatCurrency(invoice.depositAmount, invoice.currency)}
                  </p>
                  <p className="text-slate-400 text-sm mb-6">
                    {invoice.depositPercent}% of {formatCurrency(invoice.total, invoice.currency)}
                  </p>

                  <PayNowButton invoiceId={invoice.id} paymentUrl={invoice.paymentUrl || null} label="Pay Deposit" isDeposit />

                  {hasBankDetails && (
                    <p className="text-slate-500 text-xs mt-4">
                      Or pay by bank transfer &mdash; details below
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900 rounded-xl p-6 sm:p-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                    {invoice.depositPaid ? "Remaining Balance" : "Total Due"}
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight tabular-nums mb-1">
                    {formatCurrency(invoice.depositPaid && invoice.depositAmount ? invoice.total - invoice.depositAmount : invoice.total, invoice.currency)}
                  </p>
                  {isOverdue ? (
                    <p className="text-red-400 text-sm font-medium mb-6">Overdue &mdash; please pay immediately</p>
                  ) : (
                    <p className="text-slate-400 text-sm mb-6">Due {formatDate(invoice.dueDate)}</p>
                  )}

                  <PayNowButton invoiceId={invoice.id} paymentUrl={invoice.paymentUrl || null} />

                  {hasBankDetails && (
                    <p className="text-slate-500 text-xs mt-4">
                      Or pay by bank transfer &mdash; details below
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Paid Thank You */}
          {isPaid && (
            <div className="px-6 sm:px-10 pb-8 sm:pb-10">
              <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 sm:p-8 text-center">
                <svg className="w-12 h-12 text-emerald-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-emerald-900 mb-1">This invoice has been paid</h3>
                <p className="text-emerald-700 text-sm">
                  Thank you for your prompt payment of {formatCurrency(invoice.total, invoice.currency)}
                  {invoice.paidAt && <> on {formatDate(invoice.paidAt)}</>}.
                </p>
              </div>
            </div>
          )}

          {/* Bank Transfer Details */}
          {!isPaid && hasBankDetails && (
            <div className="px-6 sm:px-10 pb-8 sm:pb-10">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Payment Details</h3>
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm mb-2">Bank Transfer</p>
                      {(() => {
                        try {
                          const bd = JSON.parse(invoice.user.bankDetails!);
                          if (bd.iban !== undefined) {
                            const ibanFmt = bd.iban.replace(/(.{4})/g, "$1 ").trim();
                            return (
                              <div className="space-y-1 text-sm text-gray-600">
                                {bd.iban && <div className="flex gap-2"><span className="text-gray-400 w-12">IBAN</span><span className="font-mono font-medium text-gray-900">{ibanFmt}</span></div>}
                                {bd.bic && <div className="flex gap-2"><span className="text-gray-400 w-12">BIC</span><span className="font-mono">{bd.bic}</span></div>}
                                {bd.bankName && <div className="flex gap-2"><span className="text-gray-400 w-12">Bank</span><span>{bd.bankName}</span></div>}
                                {(bd.accountHolder || invoice.user.businessName) && <div className="flex gap-2"><span className="text-gray-400 w-12">Name</span><span>{bd.accountHolder || invoice.user.businessName}</span></div>}
                              </div>
                            );
                          }
                        } catch {}
                        return <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{invoice.user.bankDetails}</p>;
                      })()}
                    </div>
                  </div>
                </div>
                <div className="bg-white border-t border-gray-200 px-5 sm:px-6 py-3 flex items-center gap-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Reference:</span>
                  <span className="text-sm font-mono font-bold text-gray-900">{invoice.invoiceNumber}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Notes */}
          {!isPaid && invoice.paymentNotes && (
            <div className="px-6 sm:px-10 pb-8 sm:pb-10">
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
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 mt-6 mb-4">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors py-2 px-4 rounded-lg hover:bg-white hover:shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </a>
          <span className="text-gray-200">|</span>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors py-2 px-4 rounded-lg hover:bg-white hover:shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Contact
          </a>
        </div>

        {/* Portal Link */}
        <div className="text-center mb-2">
          <a
            href={portalUrl(invoice.clientId)}
            className="text-xs text-gray-400 hover:text-gray-500 transition-colors underline"
          >
            View all invoices from {businessName}
          </a>
        </div>

        {/* Footer */}
        <footer className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-7 h-7 rounded-lg object-contain flex-shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white leading-none">
                  {businessName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm font-semibold text-gray-600">{businessName}</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Delivered securely</span>
            </div>
            <span className="text-gray-200">|</span>
            <a
              href="https://tradeinvoice.com"
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
