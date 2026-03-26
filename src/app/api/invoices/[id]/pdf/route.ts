import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Multi-language translations
const translations: Record<string, Record<string, string>> = {
  en: {
    invoice: "Invoice",
    quote: "Quote",
    credit_note: "Credit Note",
    invoiceUpper: "INVOICE",
    quoteUpper: "QUOTE",
    credit_noteUpper: "CREDIT NOTE",
    from: "From",
    to: "To",
    invoiceDate: "Invoice Date",
    quoteDate: "Quote Date",
    creditNoteDate: "Credit Note Date",
    serviceDate: "Service Date",
    dueDate: "Due Date",
    paidDate: "Paid Date",
    description: "Description",
    qty: "Qty",
    unitPrice: "Unit Price",
    amount: "Amount",
    subtotal: "Subtotal (excl. VAT)",
    vat: "VAT",
    total: "Total (incl. VAT)",
    paymentInstructions: "Payment Instructions",
    paymentDueBy: "Payment due by",
    reference: "Reference",
    bankDetails: "Bank Details",
    paymentNotes: "Payment Notes",
    noteToClient: "Note to Client",
    thankYou: "Thank you for your business!",
    amountPaid: "Amount Paid",
    balanceDue: "Balance Due",
    referenceInvoice: "Reference Invoice",
    reverseChargeNote: "VAT reverse-charged (BTW verlegd) — Article 44 EU VAT Directive",
  },
  nl: {
    invoice: "Factuur",
    quote: "Offerte",
    credit_note: "Creditnota",
    invoiceUpper: "FACTUUR",
    quoteUpper: "OFFERTE",
    credit_noteUpper: "CREDITNOTA",
    from: "Van",
    to: "Aan",
    invoiceDate: "Factuurdatum",
    quoteDate: "Offertedatum",
    creditNoteDate: "Creditnotadatum",
    serviceDate: "Leveringsdatum",
    dueDate: "Vervaldatum",
    paidDate: "Betaaldatum",
    description: "Omschrijving",
    qty: "Aantal",
    unitPrice: "Prijs per stuk",
    amount: "Bedrag",
    subtotal: "Subtotaal (excl. BTW)",
    vat: "BTW",
    total: "Totaal (incl. BTW)",
    paymentInstructions: "Betaalinstructies",
    paymentDueBy: "Betaling voor",
    reference: "Referentie",
    bankDetails: "Bankgegevens",
    paymentNotes: "Betaalopmerkingen",
    noteToClient: "Opmerking voor klant",
    thankYou: "Bedankt voor uw vertrouwen!",
    amountPaid: "Betaald bedrag",
    balanceDue: "Openstaand bedrag",
    referenceInvoice: "Referentiefactuur",
    reverseChargeNote: "BTW verlegd — Artikel 44 EU BTW-richtlijn",
  },
  de: {
    invoice: "Rechnung",
    quote: "Angebot",
    credit_note: "Gutschrift",
    invoiceUpper: "RECHNUNG",
    quoteUpper: "ANGEBOT",
    credit_noteUpper: "GUTSCHRIFT",
    from: "Von",
    to: "An",
    invoiceDate: "Rechnungsdatum",
    quoteDate: "Angebotsdatum",
    creditNoteDate: "Gutschriftdatum",
    serviceDate: "Leistungsdatum",
    dueDate: "Fälligkeitsdatum",
    paidDate: "Bezahlt am",
    description: "Beschreibung",
    qty: "Menge",
    unitPrice: "Einzelpreis",
    amount: "Betrag",
    subtotal: "Zwischensumme (exkl. MwSt)",
    vat: "MwSt",
    total: "Gesamt (inkl. MwSt)",
    paymentInstructions: "Zahlungsanweisungen",
    paymentDueBy: "Zahlbar bis",
    reference: "Referenz",
    bankDetails: "Bankverbindung",
    paymentNotes: "Zahlungshinweise",
    noteToClient: "Hinweis für den Kunden",
    thankYou: "Vielen Dank für Ihr Vertrauen!",
    amountPaid: "Bezahlter Betrag",
    balanceDue: "Offener Betrag",
    referenceInvoice: "Referenzrechnung",
    reverseChargeNote: "Steuerschuldnerschaft des Leistungsempfängers — Artikel 44 EU-MwSt-Richtlinie",
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { client: true, lineItems: true, user: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const lang = translations[invoice.language] || translations.en;
  const t = (key: string) => lang[key] || translations.en[key] || key;

  const lineItemsHtml = invoice.lineItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${escapeHtml(item.description)}</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px;">${item.quantity}</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px;">${formatCurrency(item.unitPrice, invoice.currency)}</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px;">${formatCurrency(item.total, invoice.currency)}</td>
      </tr>
    `
    )
    .join("");

  const kvkNumber = invoice.user.kvkNumber || null;
  const btwNumber = invoice.user.vatNumber || null;
  const bankDetails = invoice.user.bankDetails || null;

  const businessName = escapeHtml(invoice.user.businessName || "TradeInvoice");
  const docType = invoice.type as string;
  const docLabel = t(docType);
  const docLabelUpper = t(docType + "Upper");
  const dateLabel = t(docType + "Date");
  const logoUrl = invoice.user.logoUrl || null;

  const isCreditNote = invoice.type === "credit_note";
  const isPartiallyPaid = invoice.paidAmount > 0 && invoice.paidAmount < invoice.total;
  const isFullyPaid = invoice.status === "paid";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${docLabel} ${escapeHtml(invoice.invoiceNumber)}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1f2937; background: white; font-size: 14px; line-height: 1.5; }
        .invoice { max-width: 800px; margin: 0 auto; padding: 48px; }

        /* Header */
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 3px solid ${isCreditNote ? "#dc2626" : "#1e40af"}; }
        .brand { font-size: 28px; font-weight: 700; color: ${isCreditNote ? "#dc2626" : "#1e40af"}; margin-bottom: 4px; }
        .brand-details { color: #6b7280; font-size: 13px; line-height: 1.7; }
        .invoice-title { font-size: 32px; font-weight: 800; color: ${isCreditNote ? "#dc2626" : "#1e40af"}; text-transform: uppercase; letter-spacing: 0.02em; }
        .invoice-number { font-size: 16px; font-weight: 600; color: #374151; margin-top: 4px; }
        .status { display: inline-block; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8px; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-sent { background: #dbeafe; color: #1e40af; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
        .status-draft { background: #f3f4f6; color: #374151; }
        .status-viewed { background: #fef3c7; color: #92400e; }

        /* Address blocks */
        .addresses { display: flex; justify-content: space-between; margin-bottom: 32px; }
        .address-block { width: 48%; }
        .address-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: ${isCreditNote ? "#dc2626" : "#1e40af"}; font-weight: 700; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid #e5e7eb; }
        .address-block p { font-size: 13px; line-height: 1.7; color: #374151; }
        .address-block .name { font-weight: 600; font-size: 14px; color: #111827; }

        /* Invoice meta */
        .meta-grid { display: flex; justify-content: flex-end; margin-bottom: 32px; }
        .meta-table { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .meta-row { display: flex; border-bottom: 1px solid #e5e7eb; }
        .meta-row:last-child { border-bottom: none; }
        .meta-label { background: #f9fafb; padding: 10px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em; width: 160px; }
        .meta-value { padding: 10px 16px; font-size: 13px; font-weight: 500; color: #111827; width: 160px; }

        /* Table */
        table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        thead th { background: ${isCreditNote ? "#dc2626" : "#1e40af"}; color: white; padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; }
        thead th:nth-child(2) { text-align: center; }
        thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
        tbody tr:nth-child(even) { background: #f9fafb; }

        /* Totals */
        .totals { display: flex; justify-content: flex-end; margin-bottom: 40px; }
        .totals-table { width: 320px; }
        .totals-row { display: flex; justify-content: space-between; padding: 10px 16px; font-size: 14px; }
        .totals-row.subtotal { background: #f9fafb; border-radius: 6px 6px 0 0; }
        .totals-row.tax { background: #f9fafb; }
        .totals-row.total { background: ${isCreditNote ? "#dc2626" : "#1e40af"}; color: white; border-radius: 0 0 6px 6px; padding: 14px 16px; font-size: 18px; font-weight: 700; }
        .totals-row.paid { background: #d1fae5; border-radius: 0; }
        .totals-row.balance { background: #fef3c7; border-radius: 0 0 6px 6px; font-weight: 700; }
        .totals-label { color: inherit; }
        .totals-value { font-weight: 600; }

        /* Payment section */
        .payment-section { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 32px; }
        .payment-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: ${isCreditNote ? "#dc2626" : "#1e40af"}; font-weight: 700; margin-bottom: 12px; }
        .payment-terms { font-size: 13px; color: #374151; line-height: 1.7; }
        .payment-terms strong { color: #111827; }

        /* Reverse charge notice */
        .reverse-charge { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; }
        .reverse-charge p { font-size: 13px; color: #92400e; font-weight: 600; }

        /* Footer */
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; }
        .footer p { color: #9ca3af; font-size: 12px; line-height: 1.8; }
        .footer .business-name { color: ${isCreditNote ? "#dc2626" : "#1e40af"}; font-weight: 600; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="invoice">
        <!-- Header -->
        <div class="header">
          <div>
            ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-height: 60px; max-width: 200px; margin-bottom: 8px;" />` : ""}
            <div class="brand">${businessName}</div>
            <div class="brand-details">
              ${invoice.user.businessAddress ? `${escapeHtml(invoice.user.businessAddress)}<br>` : ""}
              ${invoice.user.businessPhone ? `${escapeHtml(invoice.user.businessPhone)}<br>` : ""}
              ${escapeHtml(invoice.user.email)}
              ${kvkNumber ? `<br>KVK: ${escapeHtml(kvkNumber)}` : ""}
              ${btwNumber ? `<br>BTW: ${escapeHtml(btwNumber)}` : ""}
            </div>
          </div>
          <div style="text-align: right;">
            <div class="invoice-title">${docLabelUpper}</div>
            <div class="invoice-number">${escapeHtml(invoice.invoiceNumber)}</div>
            <span class="status status-${invoice.status}">${invoice.status}</span>
          </div>
        </div>

        <!-- Addresses -->
        <div class="addresses">
          <div class="address-block">
            <div class="address-label">${t("from")}</div>
            <p class="name">${businessName}</p>
            ${invoice.user.businessAddress ? `<p>${escapeHtml(invoice.user.businessAddress)}</p>` : ""}
            <p>${escapeHtml(invoice.user.email)}</p>
            ${invoice.user.businessPhone ? `<p>${escapeHtml(invoice.user.businessPhone)}</p>` : ""}
          </div>
          <div class="address-block">
            <div class="address-label">${t("to")}</div>
            <p class="name">${escapeHtml(invoice.client.name)}</p>
            <p>${escapeHtml(invoice.client.email)}</p>
            ${invoice.client.address ? `<p>${escapeHtml(invoice.client.address)}</p>` : ""}
            ${invoice.client.phone ? `<p>${escapeHtml(invoice.client.phone)}</p>` : ""}
          </div>
        </div>

        <!-- Invoice Meta -->
        <div class="meta-grid">
          <div class="meta-table">
            <div class="meta-row">
              <div class="meta-label">${dateLabel}</div>
              <div class="meta-value">${formatDate(invoice.createdAt)}</div>
            </div>
            ${invoice.serviceDate ? `<div class="meta-row">
              <div class="meta-label">${t("serviceDate")}</div>
              <div class="meta-value">${formatDate(invoice.serviceDate)}</div>
            </div>` : ""}
            <div class="meta-row">
              <div class="meta-label">${t("dueDate")}</div>
              <div class="meta-value">${formatDate(invoice.dueDate)}</div>
            </div>
            ${invoice.paidAt ? `<div class="meta-row">
              <div class="meta-label">${t("paidDate")}</div>
              <div class="meta-value" style="color: #065f46; font-weight: 600;">${formatDate(invoice.paidAt)}</div>
            </div>` : ""}
            ${invoice.referenceInvoice ? `<div class="meta-row">
              <div class="meta-label">${t("referenceInvoice")}</div>
              <div class="meta-value" style="font-weight: 600;">${escapeHtml(invoice.referenceInvoice)}</div>
            </div>` : ""}
          </div>
        </div>

        ${invoice.description ? `<p style="margin-bottom: 24px; color: #6b7280; font-size: 14px;"><strong>${t("description")}:</strong> ${escapeHtml(invoice.description)}</p>` : ""}

        ${invoice.notesToClient ? `
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: #1e40af; font-weight: 700; margin-bottom: 8px;">${t("noteToClient")}</p>
          <p style="font-size: 14px; color: #1e3a5f; line-height: 1.7; white-space: pre-line;">${escapeHtml(invoice.notesToClient)}</p>
        </div>` : ""}

        <!-- Line Items -->
        <table>
          <thead>
            <tr>
              <th>${t("description")}</th>
              <th>${t("qty")}</th>
              <th>${t("unitPrice")}</th>
              <th>${t("amount")}</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
          <div class="totals-table">
            <div class="totals-row subtotal">
              <span class="totals-label">${t("subtotal")}</span>
              <span class="totals-value">${formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            ${
              invoice.taxRate > 0
                ? `<div class="totals-row tax">
                    <span class="totals-label">${t("vat")} (${invoice.taxRate}%)</span>
                    <span class="totals-value">${formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                  </div>`
                : `<div class="totals-row tax">
                    <span class="totals-label">${t("vat")} (0%)</span>
                    <span class="totals-value">${formatCurrency(0, invoice.currency)}</span>
                  </div>`
            }
            <div class="totals-row total" ${isPartiallyPaid ? 'style="border-radius: 0;"' : ""}>
              <span class="totals-label">${t("total")}</span>
              <span class="totals-value">${formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
            ${isPartiallyPaid || (isFullyPaid && invoice.paidAmount > 0) ? `
              <div class="totals-row paid">
                <span class="totals-label" style="color: #065f46;">${t("amountPaid")}</span>
                <span class="totals-value" style="color: #065f46;">${formatCurrency(invoice.paidAmount, invoice.currency)}</span>
              </div>` : ""}
            ${isPartiallyPaid ? `
              <div class="totals-row balance">
                <span class="totals-label" style="color: #92400e;">${t("balanceDue")}</span>
                <span class="totals-value" style="color: #92400e;">${formatCurrency(invoice.total - invoice.paidAmount, invoice.currency)}</span>
              </div>` : ""}
          </div>
        </div>

        ${invoice.reverseCharge ? `
        <!-- Reverse Charge Notice -->
        <div class="reverse-charge">
          <p>${t("reverseChargeNote")}</p>
        </div>` : ""}

        <!-- Payment Instructions -->
        <div class="payment-section">
          <div class="payment-title">${t("paymentInstructions")}</div>
          <div class="payment-terms">
            <strong>${t("paymentDueBy")} ${formatDate(invoice.dueDate)}</strong><br>
            ${t("reference")}: <strong>${escapeHtml(invoice.invoiceNumber)}</strong>
            ${bankDetails ? `<br><br><strong>${t("bankDetails")}:</strong><br>${escapeHtml(bankDetails).replace(/\n/g, "<br>")}` : ""}
            ${invoice.paymentNotes ? `<br><br><strong>${t("paymentNotes")}:</strong><br>${escapeHtml(invoice.paymentNotes).replace(/\n/g, "<br>")}` : ""}
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p class="business-name">${businessName}</p>
          ${kvkNumber ? `<p>KVK: ${escapeHtml(kvkNumber)}</p>` : ""}
          ${btwNumber ? `<p>BTW: ${escapeHtml(btwNumber)}</p>` : ""}
          <p>${t("thankYou")}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 });
  }
}
