import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canCreateInvoice } from "@/lib/stripe";
import { getNextInvoiceNumber, sanitizeString, VALID_CURRENCIES } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() {
  try {
    const user = await requireUser();
    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      include: { client: true, lineItems: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get invoices error:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    if (rateLimit("invoices", user.id, 50, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
    }

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

    const {
      clientId, description, dueDate, lineItems, taxRate, paymentNotes,
      notesToClient, serviceDate, invoiceNumber, type, currency,
      isRecurring, recurringInterval, reverseCharge, referenceInvoice, language,
      invoiceTheme, invoiceCountry, scheduledSendAt, depositPercent,
    } = await req.json();

    // Validate invoiceCountry
    const validCountries = ["NL", "UK", "DE", "BE"];
    const validatedCountry = invoiceCountry && validCountries.includes(invoiceCountry) ? invoiceCountry : "NL";

    if (!clientId || !lineItems?.length || !dueDate) {
      return NextResponse.json(
        { error: "Client, line items, and due date are required" },
        { status: 400 }
      );
    }

    // Validate currency
    const validatedCurrency = currency && VALID_CURRENCIES.includes(currency) ? currency : "EUR";

    // Validate taxRate
    const validatedTaxRate = typeof taxRate === "number" && taxRate >= 0 && taxRate <= 100 ? taxRate : 0;

    // Validate and sanitize line items
    for (const item of lineItems) {
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        return NextResponse.json({ error: "Line item quantities must be positive numbers" }, { status: 400 });
      }
      if (typeof item.unitPrice !== "number" || item.unitPrice <= 0) {
        return NextResponse.json({ error: "Line item prices must be positive numbers" }, { status: 400 });
      }
      item.description = sanitizeString(item.description || "", 500);
    }

    const subtotal = lineItems.reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );
    const effectiveTaxRate = reverseCharge ? 0 : validatedTaxRate;
    const tax = subtotal * (effectiveTaxRate / 100);
    const total = subtotal + tax;

    // Calculate recurring next date
    let recurringNextDate: Date | null = null;
    if (isRecurring && recurringInterval) {
      recurringNextDate = new Date(dueDate);
      if (recurringInterval === "weekly") recurringNextDate.setDate(recurringNextDate.getDate() + 7);
      else if (recurringInterval === "monthly") recurringNextDate.setMonth(recurringNextDate.getMonth() + 1);
      else if (recurringInterval === "quarterly") recurringNextDate.setMonth(recurringNextDate.getMonth() + 3);
      else if (recurringInterval === "yearly") recurringNextDate.setFullYear(recurringNextDate.getFullYear() + 1);
    }

    const invoiceType = type === "quote" ? "quote" : type === "credit_note" ? "credit_note" : "invoice";
    let invoiceNum = invoiceNumber || await getNextInvoiceNumber(user.id);

    // Prefix based on type
    if (invoiceType === "quote") {
      invoiceNum = invoiceNum.replace("INV-", "QTE-");
    } else if (invoiceType === "credit_note") {
      invoiceNum = invoiceNum.replace("INV-", "CN-");
    }

    // Gap warning check (non-blocking)
    let gapWarning: string | null = null;
    if (invoiceNumber && invoiceType === "invoice") {
      const match = invoiceNumber.match(/INV-(\d+)/);
      if (match) {
        const inputNum = parseInt(match[1], 10);
        const lastInvoice = await prisma.invoice.findFirst({
          where: { userId: user.id, invoiceNumber: { startsWith: "INV-" } },
          orderBy: { invoiceNumber: "desc" },
          select: { invoiceNumber: true },
        });
        if (lastInvoice) {
          const lastMatch = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
          if (lastMatch) {
            const lastNum = parseInt(lastMatch[1], 10);
            if (inputNum > lastNum + 1) {
              gapWarning = `Invoice number creates a gap (expected INV-${String(lastNum + 1).padStart(4, "0")})`;
            }
          }
        }
      }
    }

    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        clientId,
        invoiceNumber: invoiceNum,
        description: description ? sanitizeString(description, 2000) : null,
        paymentNotes: paymentNotes ? sanitizeString(paymentNotes, 2000) : null,
        notesToClient: notesToClient ? sanitizeString(notesToClient, 2000) : null,
        serviceDate: serviceDate ? new Date(serviceDate) : new Date(),
        type: invoiceType,
        currency: validatedCurrency,
        dueDate: new Date(dueDate),
        subtotal,
        taxRate: reverseCharge ? 0 : validatedTaxRate,
        taxAmount: tax,
        total,
        isRecurring: !!isRecurring,
        recurringInterval: isRecurring ? recurringInterval : null,
        recurringNextDate,
        reverseCharge: !!reverseCharge,
        referenceInvoice: referenceInvoice || null,
        invoiceCountry: validatedCountry,
        language: language || "en",
        invoiceTheme: invoiceTheme && ["classic", "modern", "minimal"].includes(invoiceTheme) ? invoiceTheme : "classic",
        scheduledSendAt: scheduledSendAt ? new Date(scheduledSendAt) : null,
        depositPercent: invoiceType === "quote" && typeof depositPercent === "number" && depositPercent >= 1 && depositPercent <= 99 ? depositPercent : null,
        depositAmount: invoiceType === "quote" && typeof depositPercent === "number" && depositPercent >= 1 && depositPercent <= 99 ? Math.round(total * depositPercent) / 100 : null,
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

    return NextResponse.json({ ...invoice, gapWarning });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
