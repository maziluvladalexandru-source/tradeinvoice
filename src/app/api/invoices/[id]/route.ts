import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentReceivedEmail } from "@/lib/resend";
import { formatCurrency } from "@/lib/utils";
import { logSecurityEvent } from "@/lib/security-log";
import { sanitizeString, VALID_INVOICE_STATUSES } from "@/lib/utils";

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
      logSecurityEvent("INVOICE_ACCESS_DENIED", { invoiceId: params.id, userId: user.id });
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get invoice error:", error);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Whitelist updatable fields only
    const data: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (!VALID_INVOICE_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      data.status = body.status;
    }
    if (body.status === "paid") {
      data.paidAt = body.paidAt ? new Date(body.paidAt) : new Date();
    }
    if (body.paidAmount !== undefined) {
      const paidAmount = Number(body.paidAmount);
      if (isNaN(paidAmount) || paidAmount < 0) {
        return NextResponse.json({ error: "Invalid paidAmount" }, { status: 400 });
      }
      // Partial payments are Pro only — free users can only mark as fully paid
      if (user.plan !== "pro" && paidAmount > 0 && paidAmount < invoice.total) {
        return NextResponse.json({ error: "Partial payments require a Pro plan" }, { status: 403 });
      }
      data.paidAmount = paidAmount;
    }
    if (body.description !== undefined) {
      data.description = body.description ? sanitizeString(body.description, 2000) : null;
    }
    if (body.paymentNotes !== undefined) {
      data.paymentNotes = body.paymentNotes ? sanitizeString(body.paymentNotes, 2000) : null;
    }
    if (body.notesToClient !== undefined) {
      data.notesToClient = body.notesToClient ? sanitizeString(body.notesToClient, 2000) : null;
    }
    if (body.remindersEnabled !== undefined) {
      data.remindersEnabled = !!body.remindersEnabled;
    }
    if (body.scheduledSendAt !== undefined) {
      data.scheduledSendAt = body.scheduledSendAt ? new Date(body.scheduledSendAt) : null;
    }

    // Full edit support (draft invoices only)
    if (body.fullEdit && invoice.status === "draft") {
      if (body.clientId) data.clientId = body.clientId;
      if (body.invoiceNumber) data.invoiceNumber = body.invoiceNumber;
      if (body.dueDate) data.dueDate = new Date(body.dueDate);
      if (body.serviceDate !== undefined) data.serviceDate = body.serviceDate ? new Date(body.serviceDate) : null;
      if (body.currency) {
        const { VALID_CURRENCIES } = await import("@/lib/utils");
        if (!VALID_CURRENCIES.includes(body.currency)) {
          return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
        }
        data.currency = body.currency;
      }
      if (body.taxRate !== undefined) {
        const tr = Number(body.taxRate);
        if (!isNaN(tr) && tr >= 0 && tr <= 100) data.taxRate = tr;
      }
      if (body.reverseCharge !== undefined) data.reverseCharge = !!body.reverseCharge;
      if (body.invoiceCountry) data.invoiceCountry = body.invoiceCountry;
      if (body.language) data.language = body.language;
      if (body.invoiceTheme) {
        const validThemes = ["classic", "modern", "minimal"];
        if (!validThemes.includes(body.invoiceTheme)) {
          return NextResponse.json({ error: "Invalid invoice theme" }, { status: 400 });
        }
        data.invoiceTheme = body.invoiceTheme;
      }
      if (body.isRecurring !== undefined) data.isRecurring = !!body.isRecurring;
      if (body.recurringInterval !== undefined) data.recurringInterval = body.recurringInterval || null;
      if (body.referenceInvoice !== undefined) data.referenceInvoice = body.referenceInvoice || null;
      if (body.depositPercent !== undefined) data.depositPercent = body.depositPercent;
      if (body.type) data.type = body.type;

      if (body.lineItems?.length) {
        // Recalculate totals
        const effectiveTaxRate = body.reverseCharge ? 0 : (data.taxRate as number ?? invoice.taxRate);
        const subtotal = body.lineItems.reduce(
          (sum: number, item: { quantity: number; unitPrice: number }) => sum + item.quantity * item.unitPrice, 0
        );
        const taxAmount = subtotal * (effectiveTaxRate / 100);
        data.subtotal = subtotal;
        data.taxAmount = taxAmount;
        data.total = subtotal + taxAmount;

        // Delete old line items and create new ones
        await prisma.lineItem.deleteMany({ where: { invoiceId: params.id } });
        await prisma.lineItem.createMany({
          data: body.lineItems.map((item: { description: string; quantity: number; unitPrice: number }) => ({
            invoiceId: params.id,
            description: sanitizeString(item.description || "", 500),
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        });
      }
    }

    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data,
      include: { client: true, lineItems: true, user: true },
    });

    // Notify contractor when invoice is marked as paid
    if (data.status === "paid" && updated.user) {
      sendPaymentReceivedEmail(
        updated.user.email,
        updated.invoiceNumber,
        updated.client.name,
        formatCurrency(updated.total, updated.currency)
      ).catch(() => {});
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update invoice error:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser();

    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.invoice.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete invoice error:", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
