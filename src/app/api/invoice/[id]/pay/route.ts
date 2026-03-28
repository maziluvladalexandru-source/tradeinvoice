import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";
import { logSecurityEvent } from "@/lib/security-log";
import { appUrl } from "@/lib/utils";

// Simple in-memory rate limit: max 3 payment link creations per invoice per hour
const payRateLimit = new Map<string, number[]>();

function isRateLimited(invoiceId: string): boolean {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const attempts = (payRateLimit.get(invoiceId) || []).filter((t) => t > hourAgo);
  payRateLimit.set(invoiceId, attempts);
  if (attempts.length >= 3) return true;
  attempts.push(now);
  return false;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { client: true, user: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "paid") {
      return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });
    }

    // Return existing payment link if available (no rate limit needed)
    if (invoice.paymentUrl) {
      return NextResponse.json({ url: invoice.paymentUrl });
    }

    // Rate limit new payment link creation
    if (isRateLimited(params.id)) {
      logSecurityEvent("PAYMENT_RATE_LIMITED", { invoiceId: params.id, ip: request.headers.get("x-forwarded-for") || "unknown" });
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const stripe = getStripeClient();

    // Check if this is a deposit payment
    const isDeposit = request.nextUrl.searchParams.get("deposit") === "true";
    const isDepositPayment = isDeposit && invoice.depositPercent && invoice.depositAmount && !invoice.depositPaid;

    // Create a one-time price for this invoice amount
    const amountInCents = Math.round((isDepositPayment ? invoice.depositAmount! : invoice.total) * 100);
    const productName = isDepositPayment
      ? `Deposit - ${invoice.invoiceNumber}`
      : `Invoice ${invoice.invoiceNumber}`;

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: invoice.currency.toLowerCase(),
            product_data: {
              name: productName,
              description: invoice.description || `Payment to ${invoice.user.businessName || invoice.user.email}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      after_completion: {
        type: "redirect",
        redirect: {
          url: appUrl(`/invoice/${invoice.id}/view?${isDepositPayment ? "deposit_paid=true" : "paid=true"}`),
        },
      },
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        isDeposit: isDepositPayment ? "true" : "false",
      },
    });

    // Store the payment link URL on the invoice
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paymentUrl: paymentLink.url },
    });

    return NextResponse.json({ url: paymentLink.url });
  } catch (error) {
    console.error("Payment link creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment link" },
      { status: 500 }
    );
  }
}
