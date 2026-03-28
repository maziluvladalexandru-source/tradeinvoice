import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canCreateInvoice } from "@/lib/stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser();

    const quote = await prisma.invoice.findFirst({
      where: { id: params.id, userId: user.id },
      include: { lineItems: true },
    });

    if (!quote) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (quote.type !== "quote") {
      return NextResponse.json(
        { error: "Only quotes can be converted to invoices" },
        { status: 400 }
      );
    }

    // Prevent duplicate conversion — check if an invoice already references this quote
    const existing = await prisma.invoice.findFirst({
      where: {
        userId: user.id,
        type: "invoice",
        referenceInvoice: quote.id,
      },
      select: { id: true, invoiceNumber: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This quote has already been converted", invoiceId: existing.id, invoiceNumber: existing.invoiceNumber },
        { status: 409 }
      );
    }

    // Check monthly invoice limit
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

    // Generate next sequential invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        userId: user.id,
        invoiceNumber: { startsWith: "INV-" },
      },
      orderBy: { invoiceNumber: "desc" },
      select: { invoiceNumber: true },
    });

    let nextNum = 1;
    if (lastInvoice) {
      const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const invoiceNumber = `INV-${String(nextNum).padStart(4, "0")}`;

    // New dates: today as issue date, due in 30 days
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // If deposit was paid on the quote, subtract it from the invoice
    const depositCredit = quote.depositPaid && quote.depositAmount ? quote.depositAmount : 0;

    const newInvoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: quote.clientId,
        invoiceNumber,
        description: quote.description,
        paymentNotes: quote.paymentNotes,
        notesToClient: quote.notesToClient,
        type: "invoice",
        status: "draft",
        subtotal: quote.subtotal,
        taxRate: quote.taxRate,
        taxAmount: quote.taxAmount,
        total: quote.total,
        currency: quote.currency,
        dueDate,
        reverseCharge: quote.reverseCharge,
        invoiceTheme: quote.invoiceTheme,
        invoiceCountry: quote.invoiceCountry,
        language: quote.language,
        referenceInvoice: quote.id,
        paidAmount: depositCredit,
        lineItems: {
          create: quote.lineItems.map((item) => ({
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

    return NextResponse.json(newInvoice);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Convert quote error:", error);
    return NextResponse.json(
      { error: "Failed to convert quote" },
      { status: 500 }
    );
  }
}
