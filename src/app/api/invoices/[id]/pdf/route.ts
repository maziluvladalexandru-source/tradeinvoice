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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { client: true, lineItems: true, user: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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
  const isQuote = invoice.type === "quote";
  const docLabel = isQuote ? "Quote" : "Invoice";
  const docLabelUpper = isQuote ? "QUOTE" : "INVOICE";
  const logoUrl = invoice.user.logoUrl || null;

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
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 3px solid #1e40af; }
        .brand { font-size: 28px; font-weight: 700; color: #1e40af; margin-bottom: 4px; }
        .brand-details { color: #6b7280; font-size: 13px; line-height: 1.7; }
        .invoice-title { font-size: 32px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.02em; }
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
        .address-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #1e40af; font-weight: 700; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid #e5e7eb; }
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
        thead th { background: #1e40af; color: white; padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; }
        thead th:nth-child(2) { text-align: center; }
        thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
        tbody tr:nth-child(even) { background: #f9fafb; }

        /* Totals */
        .totals { display: flex; justify-content: flex-end; margin-bottom: 40px; }
        .totals-table { width: 320px; }
        .totals-row { display: flex; justify-content: space-between; padding: 10px 16px; font-size: 14px; }
        .totals-row.subtotal { background: #f9fafb; border-radius: 6px 6px 0 0; }
        .totals-row.tax { background: #f9fafb; }
        .totals-row.total { background: #1e40af; color: white; border-radius: 0 0 6px 6px; padding: 14px 16px; font-size: 18px; font-weight: 700; }
        .totals-label { color: inherit; }
        .totals-value { font-weight: 600; }

        /* Payment section */
        .payment-section { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 32px; }
        .payment-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: #1e40af; font-weight: 700; margin-bottom: 12px; }
        .payment-terms { font-size: 13px; color: #374151; line-height: 1.7; }
        .payment-terms strong { color: #111827; }

        /* Footer */
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; }
        .footer p { color: #9ca3af; font-size: 12px; line-height: 1.8; }
        .footer .business-name { color: #1e40af; font-weight: 600; font-size: 13px; }
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
            <div class="address-label">From</div>
            <p class="name">${businessName}</p>
            ${invoice.user.businessAddress ? `<p>${escapeHtml(invoice.user.businessAddress)}</p>` : ""}
            <p>${escapeHtml(invoice.user.email)}</p>
            ${invoice.user.businessPhone ? `<p>${escapeHtml(invoice.user.businessPhone)}</p>` : ""}
          </div>
          <div class="address-block">
            <div class="address-label">To</div>
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
              <div class="meta-label">${docLabel} Date</div>
              <div class="meta-value">${formatDate(invoice.createdAt)}</div>
            </div>
            ${invoice.serviceDate ? `<div class="meta-row">
              <div class="meta-label">Service Date</div>
              <div class="meta-value">${formatDate(invoice.serviceDate)}</div>
            </div>` : ""}
            <div class="meta-row">
              <div class="meta-label">Due Date</div>
              <div class="meta-value">${formatDate(invoice.dueDate)}</div>
            </div>
            ${invoice.paidAt ? `<div class="meta-row">
              <div class="meta-label">Paid Date</div>
              <div class="meta-value" style="color: #065f46; font-weight: 600;">${formatDate(invoice.paidAt)}</div>
            </div>` : ""}
          </div>
        </div>

        ${invoice.description ? `<p style="margin-bottom: 24px; color: #6b7280; font-size: 14px;"><strong>Description:</strong> ${escapeHtml(invoice.description)}</p>` : ""}

        ${invoice.notesToClient ? `
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: #1e40af; font-weight: 700; margin-bottom: 8px;">Note to Client</p>
          <p style="font-size: 14px; color: #1e3a5f; line-height: 1.7; white-space: pre-line;">${escapeHtml(invoice.notesToClient)}</p>
        </div>` : ""}

        <!-- Line Items -->
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
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
              <span class="totals-label">Subtotal (excl. VAT)</span>
              <span class="totals-value">${formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            ${
              invoice.taxRate > 0
                ? `<div class="totals-row tax">
                    <span class="totals-label">VAT (${invoice.taxRate}%)</span>
                    <span class="totals-value">${formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                  </div>`
                : `<div class="totals-row tax">
                    <span class="totals-label">VAT (0%)</span>
                    <span class="totals-value">${formatCurrency(0, invoice.currency)}</span>
                  </div>`
            }
            <div class="totals-row total">
              <span class="totals-label">Total (incl. VAT)</span>
              <span class="totals-value">${formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        <!-- Payment Instructions -->
        <div class="payment-section">
          <div class="payment-title">Payment Instructions</div>
          <div class="payment-terms">
            <strong>Payment due by ${formatDate(invoice.dueDate)}</strong><br>
            Reference: <strong>${escapeHtml(invoice.invoiceNumber)}</strong>
            ${bankDetails ? `<br><br><strong>Bank Details:</strong><br>${escapeHtml(bankDetails).replace(/\n/g, "<br>")}` : ""}
            ${invoice.paymentNotes ? `<br><br><strong>Payment Notes:</strong><br>${escapeHtml(invoice.paymentNotes).replace(/\n/g, "<br>")}` : ""}
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p class="business-name">${businessName}</p>
          ${kvkNumber ? `<p>KVK: ${escapeHtml(kvkNumber)}</p>` : ""}
          ${btwNumber ? `<p>BTW: ${escapeHtml(btwNumber)}</p>` : ""}
          <p>Thank you for your business!</p>
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
}
