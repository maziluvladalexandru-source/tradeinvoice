import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";
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
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const stripe = getStripeClient();

    // Create a one-time price for this invoice amount
    const amountInCents = Math.round(invoice.total * 100);

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: invoice.currency.toLowerCase(),
            product_data: {
              name: `Invoice ${invoice.invoiceNumber}`,
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
          url: appUrl(`/invoice/${invoice.id}/view?paid=true`),
        },
      },
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
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
