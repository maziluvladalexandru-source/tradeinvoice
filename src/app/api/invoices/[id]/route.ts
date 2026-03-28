import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInvoicePaidNotification } from "@/lib/resend";
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

    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data,
      include: { client: true, lineItems: true, user: true },
    });

    // Notify contractor when invoice is marked as paid
    if (data.status === "paid" && updated.user) {
      sendInvoicePaidNotification(
        updated.user.email,
        updated.invoiceNumber,
        updated.client.name
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
