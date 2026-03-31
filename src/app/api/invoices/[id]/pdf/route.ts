import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCountryConfig, formatComplianceFooter } from "@/lib/country-config";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Theme color configs
const themeColors: Record<string, { primary: string; primaryLight: string; headerBg: string; tableBg: string; bodyFont: string }> = {
  classic: {
    primary: "#1e40af",
    primaryLight: "#dbeafe",
    headerBg: "#1e40af",
    tableBg: "#f9fafb",
    bodyFont: "'Helvetica Neue', Arial, sans-serif",
  },
  modern: {
    primary: "#4f46e5",
    primaryLight: "#e0e7ff",
    headerBg: "#4f46e5",
    tableBg: "#f5f3ff",
    bodyFont: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  minimal: {
    primary: "#374151",
    primaryLight: "#f3f4f6",
    headerBg: "#374151",
    tableBg: "#fafafa",
    bodyFont: "'Georgia', 'Times New Roman', serif",
  },
  bold: {
    primary: "#0f172a",
    primaryLight: "#fef3c7",
    headerBg: "#0f172a",
    tableBg: "#f8fafc",
    bodyFont: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  elegant: {
    primary: "#4a3728",
    primaryLight: "#faf6f1",
    headerBg: "#4a3728",
    tableBg: "#faf8f5",
    bodyFont: "'Georgia', 'Garamond', 'Times New Roman', serif",
  },
  contractor: {
    primary: "#1a1a2e",
    primaryLight: "#fce4ec",
    headerBg: "#1a1a2e",
    tableBg: "#f5f5f7",
    bodyFont: "'Courier New', 'Consolas', monospace",
  },
};

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
    serviceDateEqualsInvoiceDate: "Service date equals invoice date",
    lateFee: "Late Payment Fee",
    daysOverdue: "days overdue",
    totalWithLateFee: "Total with Late Fee",
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
    serviceDateEqualsInvoiceDate: "Leveringsdatum is gelijk aan factuurdatum",
    lateFee: "Vertragingsrente",
    daysOverdue: "dagen te laat",
    totalWithLateFee: "Totaal met vertragingsrente",
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
    serviceDateEqualsInvoiceDate: "Leistungsdatum entspricht Rechnungsdatum",
    lateFee: "Verzugszinsen",
    daysOverdue: "Tage uberfällig",
    totalWithLateFee: "Gesamt mit Verzugszinsen",
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  const user = await requireUser();
  const invoice = await prisma.invoice.findFirst({
    where: { id: params.id, userId: user.id },
    include: { client: true, lineItems: true, user: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const lang = translations[invoice.language] || translations.en;
  const t = (key: string) => lang[key] || translations.en[key] || key;

  // Country-aware config
  const countryConfig = getCountryConfig(invoice.invoiceCountry || "NL");

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

  // Theme support
  const theme = invoice.invoiceTheme || "classic";
  const colors = themeColors[theme] || themeColors.classic;
  const accentColor = isCreditNote ? "#dc2626" : colors.primary;
  const isPro = invoice.user.plan === "pro";
  const showWatermark = !isPro;

  // Minimal theme uses lighter borders and simpler styling
  const isMinimal = theme === "minimal";
  const borderStyle = isMinimal ? "1px solid #e5e7eb" : `3px solid ${accentColor}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${docLabel} ${escapeHtml(invoice.invoiceNumber)}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ${colors.bodyFont}; color: #1f2937; background: white; font-size: 14px; line-height: 1.5; }
        .invoice { max-width: 800px; margin: 0 auto; padding: 48px; position: relative; }

        /* Header */
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: ${borderStyle}; }
        .brand { font-size: ${isMinimal ? "24px" : "28px"}; font-weight: 700; color: ${accentColor}; margin-bottom: 4px; }
        .brand-details { color: #6b7280; font-size: 13px; line-height: 1.7; }
        .invoice-title { font-size: ${isMinimal ? "24px" : "32px"}; font-weight: 800; color: ${accentColor}; text-transform: uppercase; letter-spacing: ${isMinimal ? "0.1em" : "0.02em"}; }
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
        .address-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: ${accentColor}; font-weight: 700; margin-bottom: 10px; padding-bottom: 6px; border-bottom: ${isMinimal ? "1px solid #e5e7eb" : "2px solid #e5e7eb"}; }
        .address-block p { font-size: 13px; line-height: 1.7; color: #374151; }
        .address-block .name { font-weight: 600; font-size: 14px; color: #111827; }

        /* Invoice meta */
        .meta-grid { display: flex; justify-content: flex-end; margin-bottom: 32px; }
        .meta-table { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .meta-row { display: flex; border-bottom: 1px solid #e5e7eb; }
        .meta-row:last-child { border-bottom: none; }
        .meta-label { background: ${colors.tableBg}; padding: 10px 16px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em; width: 160px; }
        .meta-value { padding: 10px 16px; font-size: 13px; font-weight: 500; color: #111827; width: 160px; }

        /* Table */
        table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        thead th { background: ${isCreditNote ? "#dc2626" : colors.headerBg}; color: white; padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; }
        thead th:nth-child(2) { text-align: center; }
        thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
        tbody tr:nth-child(even) { background: ${colors.tableBg}; }

        /* Totals */
        .totals { display: flex; justify-content: flex-end; margin-bottom: 40px; }
        .totals-table { width: 320px; }
        .totals-row { display: flex; justify-content: space-between; padding: 10px 16px; font-size: 14px; }
        .totals-row.subtotal { background: ${colors.tableBg}; border-radius: 6px 6px 0 0; }
        .totals-row.tax { background: ${colors.tableBg}; }
        .totals-row.total { background: ${isCreditNote ? "#dc2626" : colors.headerBg}; color: white; border-radius: 0 0 6px 6px; padding: 14px 16px; font-size: 18px; font-weight: 700; }
        .totals-row.paid { background: #d1fae5; border-radius: 0; }
        .totals-row.balance { background: #fef3c7; border-radius: 0 0 6px 6px; font-weight: 700; }
        .totals-label { color: inherit; }
        .totals-value { font-weight: 600; }

        /* Payment section */
        .payment-section { background: ${colors.tableBg}; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 32px; }
        .payment-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: ${accentColor}; font-weight: 700; margin-bottom: 12px; }
        .payment-terms { font-size: 13px; color: #374151; line-height: 1.7; }
        .payment-terms strong { color: #111827; }

        /* Reverse charge notice */
        .reverse-charge { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; }
        .reverse-charge p { font-size: 13px; color: #92400e; font-weight: 600; }

        /* Footer */
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; }
        .footer p { color: #9ca3af; font-size: 12px; line-height: 1.8; }
        .footer .business-name { color: ${accentColor}; font-weight: 600; font-size: 13px; }

        /* Watermark for free users */
        .watermark { text-align: center; margin-top: 32px; padding: 16px 24px; background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; }
        .watermark p { font-size: 15px; color: #6b7280; letter-spacing: 0.02em; }
        .watermark a { color: #4f46e5; text-decoration: none; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="invoice">
        <!-- Header -->
        <div class="header">
          <div>
            ${logoUrl && isPro ? `<img src="${logoUrl}" alt="Logo" style="max-height: 60px; max-width: 200px; margin-bottom: 8px;" />` : ""}
            <div class="brand">${businessName}</div>
            <div class="brand-details">
              ${invoice.user.businessAddress ? `${escapeHtml(invoice.user.businessAddress)}<br>` : ""}
              ${invoice.user.businessPhone ? `${escapeHtml(invoice.user.businessPhone)}<br>` : ""}
              ${escapeHtml(invoice.user.email)}
              ${kvkNumber ? `<br>${escapeHtml(countryConfig.businessRegLabel)}: ${escapeHtml(kvkNumber)}` : ""}
              ${btwNumber ? `<br>${escapeHtml(countryConfig.taxIdLabel)}: ${escapeHtml(btwNumber)}` : ""}
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
            ${invoice.client.vatNumber ? `<p>${escapeHtml(countryConfig.taxIdLabel)}: ${escapeHtml(invoice.client.vatNumber)}</p>` : ""}
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
              <div class="meta-label">${escapeHtml(countryConfig.serviceDateLabel)}</div>
              <div class="meta-value">${formatDate(invoice.serviceDate)}${
                invoice.invoiceCountry === "DE" &&
                invoice.serviceDate &&
                formatDate(invoice.serviceDate) === formatDate(invoice.createdAt)
                  ? `<br><span style="font-size: 11px; color: #6b7280; font-style: italic;">${escapeHtml(countryConfig.serviceDateNote)}</span>`
                  : ""
              }</div>
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
        <div style="background: ${colors.primaryLight}; border: 1px solid ${accentColor}33; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: ${accentColor}; font-weight: 700; margin-bottom: 8px;">${t("noteToClient")}</p>
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
            ${(() => {
              if (invoice.status !== "overdue" || !invoice.user.lateFeeEnabled) return "";
              const dueDate = new Date(invoice.dueDate);
              const now = new Date();
              const graceDays = invoice.user.lateFeeGraceDays || 0;
              const graceDate = new Date(dueDate.getTime() + graceDays * 86400000);
              const daysOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / 86400000));
              const daysAccruing = Math.max(0, Math.floor((now.getTime() - graceDate.getTime()) / 86400000));
              if (daysAccruing <= 0) return "";
              const monthsOverdue = daysAccruing / 30;
              const rate = invoice.user.lateFeeRate || 2.0;
              const outstandingAmount = invoice.total - (invoice.paidAmount || 0);
              const lateFee = Math.round(outstandingAmount * (rate / 100) * monthsOverdue * 100) / 100;
              const totalWithFee = outstandingAmount + lateFee;
              return `
              <div style="margin-top: 8px; padding-top: 8px; border-top: 2px solid #fee2e2;">
                <div class="totals-row" style="color: #991b1b; font-size: 12px;">
                  <span class="totals-label">${daysOverdue} ${t("daysOverdue")}</span>
                  <span class="totals-value"></span>
                </div>
                <div class="totals-row" style="color: #991b1b;">
                  <span class="totals-label">${t("lateFee")} (${rate}%/mo)</span>
                  <span class="totals-value">${formatCurrency(lateFee, invoice.currency)}</span>
                </div>
                <div class="totals-row total" style="background: #dc2626; margin-top: 4px;">
                  <span class="totals-label">${t("totalWithLateFee")}</span>
                  <span class="totals-value">${formatCurrency(totalWithFee, invoice.currency)}</span>
                </div>
              </div>`;
            })()}
          </div>
        </div>

        ${invoice.reverseCharge ? `
        <!-- Reverse Charge Notice -->
        <div class="reverse-charge">
          <p>${escapeHtml(countryConfig.reverseChargeText)}</p>
        </div>` : ""}

        <!-- Payment Instructions -->
        <div class="payment-section">
          <div class="payment-title">${t("paymentInstructions")}</div>
          <div class="payment-terms">
            <strong>${t("paymentDueBy")} ${formatDate(invoice.dueDate)}</strong><br>
            ${t("reference")}: <strong>${escapeHtml(invoice.invoiceNumber)}</strong>
            ${bankDetails ? (() => {
              try {
                const bd = JSON.parse(bankDetails);
                if (bd.iban !== undefined) {
                  const ibanFmt = bd.iban.replace(/(.{4})/g, "$1 ").trim();
                  let html = `<br><br><strong>${t("bankDetails")}:</strong><br>`;
                  if (bd.iban) html += `IBAN: <strong>${escapeHtml(ibanFmt)}</strong><br>`;
                  if (bd.bic) html += `BIC: ${escapeHtml(bd.bic)}<br>`;
                  if (bd.bankName) html += `Bank: ${escapeHtml(bd.bankName)}<br>`;
                  if (bd.accountHolder) html += `Name: ${escapeHtml(bd.accountHolder)}`;
                  else if (invoice.user.businessName) html += `Name: ${escapeHtml(invoice.user.businessName)}`;
                  return html;
                }
              } catch {}
              return `<br><br><strong>${t("bankDetails")}:</strong><br>${escapeHtml(bankDetails).replace(/\n/g, "<br>")}`;
            })() : ""}
            ${invoice.paymentNotes ? `<br><br><strong>${t("paymentNotes")}:</strong><br>${escapeHtml(invoice.paymentNotes).replace(/\n/g, "<br>")}` : ""}
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p class="business-name">${businessName}</p>
          ${(kvkNumber || btwNumber) ? `<p>${escapeHtml(formatComplianceFooter(countryConfig, kvkNumber, btwNumber))}</p>` : ""}
          ${invoice.invoiceCountry === "BE" && invoice.type === "credit_note" && invoice.referenceInvoice
            ? `<p style="color: #92400e; font-weight: 600; margin-top: 8px;">${escapeHtml(countryConfig.creditNoteText)}</p>`
            : ""}
          <p>${t("thankYou")}</p>
        </div>

        ${showWatermark ? `
        <!-- Free tier watermark -->
        <div class="watermark">
          <p>Invoice created with <a href="https://tradeinvoice.app">TradeInvoice.app</a></p>
          <p style="font-size: 12px; margin-top: 4px;">Free invoicing for tradespeople - upgrade to remove this notice</p>
        </div>` : ""}
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
