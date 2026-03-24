import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canCreateInvoice } from "@/lib/stripe";
import { generateInvoiceNumber } from "@/lib/utils";

export async function GET() {
  try {
    const user = await requireUser();
    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      include: { client: true, lineItems: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    // Check monthly reset
    const now = new Date();
    const resetAt = new Date(user.invoiceResetAt);
    let invoiceCount = user.invoiceCount;
    if (
      now.getMonth() !== resetAt.getMonth() ||
      now.getFullYear() !== resetAt.getFullYear()
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: { invoiceCount: 0, invoiceResetAt: now },
      });
      invoiceCount = 0;
    }

    if (!canCreateInvoice(user.plan, invoiceCount)) {
      return NextResponse.json(
        {
          error:
            "Monthly invoice limit reached. Upgrade to Pro for unlimited invoices.",
        },
        { status: 403 }
      );
    }

    const { clientId, description, dueDate, lineItems, taxRate, paymentNotes, serviceDate, invoiceNumber } =
      await req.json();

    if (!clientId || !lineItems?.length || !dueDate) {
      return NextResponse.json(
        { error: "Client, line items, and due date are required" },
        { status: 400 }
      );
    }

    const subtotal = lineItems.reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );
    const tax = taxRate ? subtotal * (taxRate / 100) : 0;
    const total = subtotal + tax;

    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        clientId,
        invoiceNumber: invoiceNumber || generateInvoiceNumber(),
        description: description || null,
        paymentNotes: paymentNotes || null,
        serviceDate: serviceDate ? new Date(serviceDate) : null,
        dueDate: new Date(dueDate),
        subtotal,
        taxRate: taxRate || 0,
        taxAmount: tax,
        total,
        lineItems: {
          create: lineItems.map(
            (item: {
              description: string;
              quantity: number;
              unitPrice: number;
            }) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice,
            })
          ),
        },
      },
      include: { client: true, lineItems: true },
    });

    // Increment invoice count
    await prisma.user.update({
      where: { id: user.id },
      data: { invoiceCount: { increment: 1 } },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
