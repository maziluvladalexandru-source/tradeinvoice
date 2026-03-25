import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = { created: 0 };

  // Find all recurring invoices where recurringNextDate is due
  const recurringInvoices = await prisma.invoice.findMany({
    where: {
      isRecurring: true,
      recurringNextDate: { lte: now },
      type: "invoice",
    },
    include: { lineItems: true },
  });

  for (const invoice of recurringInvoices) {
    // Create a new invoice based on the recurring one
    const dueDate = new Date();
    if (invoice.recurringInterval === "weekly") dueDate.setDate(dueDate.getDate() + 7);
    else if (invoice.recurringInterval === "monthly") dueDate.setMonth(dueDate.getMonth() + 1);
    else if (invoice.recurringInterval === "quarterly") dueDate.setMonth(dueDate.getMonth() + 3);
    else if (invoice.recurringInterval === "yearly") dueDate.setFullYear(dueDate.getFullYear() + 1);
    else dueDate.setMonth(dueDate.getMonth() + 1);

    await prisma.invoice.create({
      data: {
        userId: invoice.userId,
        clientId: invoice.clientId,
        invoiceNumber: generateInvoiceNumber(),
        description: invoice.description,
        paymentNotes: invoice.paymentNotes,
        notesToClient: invoice.notesToClient,
        type: "invoice",
        currency: invoice.currency,
        dueDate,
        subtotal: invoice.subtotal,
        taxRate: invoice.taxRate,
        taxAmount: invoice.taxAmount,
        total: invoice.total,
        lineItems: {
          create: invoice.lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
    });

    // Update the next recurring date on the original invoice
    const nextDate = new Date(invoice.recurringNextDate!);
    if (invoice.recurringInterval === "weekly") nextDate.setDate(nextDate.getDate() + 7);
    else if (invoice.recurringInterval === "monthly") nextDate.setMonth(nextDate.getMonth() + 1);
    else if (invoice.recurringInterval === "quarterly") nextDate.setMonth(nextDate.getMonth() + 3);
    else if (invoice.recurringInterval === "yearly") nextDate.setFullYear(nextDate.getFullYear() + 1);
    else nextDate.setMonth(nextDate.getMonth() + 1);

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { recurringNextDate: nextDate },
    });

    // Increment user invoice count
    await prisma.user.update({
      where: { id: invoice.userId },
      data: { invoiceCount: { increment: 1 } },
    });

    results.created++;
  }

  return NextResponse.json({ success: true, results });
}
