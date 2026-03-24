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
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(item.description)}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.unitPrice, invoice.currency)}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.total, invoice.currency)}</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${escapeHtml(invoice.invoiceNumber)}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1f2937; background: white; }
        .invoice { max-width: 800px; margin: 0 auto; padding: 48px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
        .brand { font-size: 28px; font-weight: 700; color: #1e40af; }
        .invoice-badge { background: #eff6ff; color: #1e40af; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; }
        .info-grid { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .info-block h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px; }
        .info-block p { font-size: 14px; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        thead th { background: #f9fafb; padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
        thead th:nth-child(2) { text-align: center; }
        thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
        .totals { display: flex; justify-content: flex-end; }
        .totals-table { width: 280px; }
        .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
        .totals-row.total { border-top: 2px solid #1e40af; padding-top: 12px; margin-top: 8px; font-size: 20px; font-weight: 700; color: #1e40af; }
        .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-sent { background: #dbeafe; color: #1e40af; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
        .status-draft { background: #f3f4f6; color: #374151; }
        .status-viewed { background: #fef3c7; color: #92400e; }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div>
            <div class="brand">${escapeHtml(invoice.user.businessName || "TradeInvoice")}</div>
            ${invoice.user.businessAddress ? `<p style="color: #6b7280; font-size: 14px; margin-top: 4px;">${escapeHtml(invoice.user.businessAddress)}</p>` : ""}
            ${invoice.user.businessPhone ? `<p style="color: #6b7280; font-size: 14px;">${escapeHtml(invoice.user.businessPhone)}</p>` : ""}
            <p style="color: #6b7280; font-size: 14px;">${escapeHtml(invoice.user.email)}</p>
          </div>
          <div style="text-align: right;">
            <div class="invoice-badge">INVOICE</div>
            <p style="margin-top: 8px; font-size: 18px; font-weight: 600;">${escapeHtml(invoice.invoiceNumber)}</p>
            <span class="status status-${invoice.status}">${invoice.status}</span>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-block">
            <h3>Bill To</h3>
            <p><strong>${escapeHtml(invoice.client.name)}</strong></p>
            <p>${escapeHtml(invoice.client.email)}</p>
            ${invoice.client.address ? `<p>${escapeHtml(invoice.client.address)}</p>` : ""}
            ${invoice.client.phone ? `<p>${escapeHtml(invoice.client.phone)}</p>` : ""}
          </div>
          <div class="info-block" style="text-align: right;">
            <h3>Invoice Details</h3>
            <p>Date: ${formatDate(invoice.createdAt)}</p>
            <p>Due: ${formatDate(invoice.dueDate)}</p>
            ${invoice.description ? `<p style="margin-top: 8px; color: #6b7280;">${escapeHtml(invoice.description)}</p>` : ""}
          </div>
        </div>

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

        <div class="totals">
          <div class="totals-table">
            <div class="totals-row">
              <span>Subtotal</span>
              <span>${formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            ${
              invoice.taxRate > 0
                ? `<div class="totals-row">
                    <span>Tax (${invoice.taxRate}%)</span>
                    <span>${formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                  </div>`
                : ""
            }
            <div class="totals-row total">
              <span>Total</span>
              <span>${formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p style="margin-top: 4px;">Generated by TradeInvoice</p>
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
