import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canCreateInvoice } from "@/lib/stripe";
import { getNextInvoiceNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    if (user.plan !== "pro") {
      return NextResponse.json({ error: "Time tracking requires a Pro plan" }, { status: 403 });
    }

    const { entryIds, taxRate: rawTaxRate, currency } = await req.json();

    if (!entryIds?.length) {
      return NextResponse.json({ error: "Select at least one time entry" }, { status: 400 });
    }

    const entries = await prisma.timeEntry.findMany({
      where: { id: { in: entryIds }, userId: user.id, invoiced: false },
      include: { client: true },
    });

    if (entries.length !== entryIds.length) {
      return NextResponse.json({ error: "Some entries not found or already invoiced" }, { status: 400 });
    }

    // Verify all entries have the same client
    const clientIds = new Set(entries.map((e) => e.clientId));
    if (clientIds.size !== 1 || !entries[0].clientId) {
      return NextResponse.json({ error: "All entries must belong to the same client" }, { status: 400 });
    }

    const clientId = entries[0].clientId;

    // Check invoice limits
    const now = new Date();
    const resetAt = new Date(user.invoiceResetAt);
    let invoiceCount = user.invoiceCount;
    if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { invoiceCount: 0, invoiceResetAt: now },
      });
      invoiceCount = 0;
    }

    if (!canCreateInvoice(user.plan, invoiceCount)) {
      return NextResponse.json({ error: "Monthly invoice limit reached" }, { status: 403 });
    }

    const taxRate = typeof rawTaxRate === "number" && rawTaxRate >= 0 && rawTaxRate <= 100 ? rawTaxRate : 0;
    const validCurrencies = ["EUR", "GBP", "USD", "PLN"];
    const validCurrency = currency && validCurrencies.includes(currency) ? currency : "EUR";

    const lineItems = entries.map((entry) => ({
      description: `${entry.description} - ${entry.hours}h @ €${entry.hourlyRate}/hr`,
      quantity: entry.hours,
      unitPrice: entry.hourlyRate,
      total: entry.hours * entry.hourlyRate,
    }));

    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        clientId,
        invoiceNumber: await getNextInvoiceNumber(user.id),
        description: `Time tracking invoice - ${entries.length} entries`,
        dueDate,
        subtotal,
        taxRate,
        taxAmount,
        total,
        currency: validCurrency,
        lineItems: {
          create: lineItems,
        },
      },
      include: { client: true, lineItems: true },
    });

    // Mark entries as invoiced
    await prisma.timeEntry.updateMany({
      where: { id: { in: entryIds } },
      data: { invoiced: true, invoiceId: invoice.id },
    });

    // Increment invoice count
    await prisma.user.update({
      where: { id: user.id },
      data: { invoiceCount: { increment: 1 } },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Generate invoice from time entries error:", error);
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
}
