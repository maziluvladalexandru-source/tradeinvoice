import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canCreateInvoice } from "@/lib/stripe";
import { generateInvoiceNumber } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { error: "Monthly invoice limit reached. Upgrade to Pro for unlimited invoices." },
        { status: 403 }
      );
    }

    const original = await prisma.invoice.findFirst({
      where: { id: params.id, userId: user.id },
      include: { lineItems: true },
    });

    if (!original) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const duplicate = await prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: original.clientId,
        invoiceNumber: generateInvoiceNumber(),
        description: original.description,
        paymentNotes: original.paymentNotes,
        serviceDate: null,
        dueDate,
        subtotal: original.subtotal,
        taxRate: original.taxRate,
        taxAmount: original.taxAmount,
        total: original.total,
        lineItems: {
          create: original.lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
      include: { client: true, lineItems: true },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { invoiceCount: { increment: 1 } },
    });

    return NextResponse.json(duplicate);
  } catch (error) {
    console.error("Duplicate invoice error:", error);
    return NextResponse.json(
      { error: "Failed to duplicate invoice" },
      { status: 500 }
    );
  }
}
