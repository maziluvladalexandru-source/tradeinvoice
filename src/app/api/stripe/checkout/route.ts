import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getStripeClient, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { appUrl } from "@/lib/utils";

export async function POST() {
  try {
    const user = await requireUser();

    // Create or get Stripe customer
    const stripe = getStripeClient();
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const priceId = PLANS.pro.priceId;
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: appUrl("/settings?upgraded=true"),
      cancel_url: appUrl("/settings"),
      metadata: { userId: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
