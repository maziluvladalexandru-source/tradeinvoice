import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
  });
}

export function getStripeClient() {
  return getStripe();
}

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    invoicesPerMonth: 5,
    priceId: null,
  },
  pro: {
    name: "Pro",
    price: 15,
    invoicesPerMonth: Infinity,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
} as const;

export function canCreateInvoice(
  plan: string,
  invoiceCount: number
): boolean {
  if (plan === "pro") return true;
  return invoiceCount < PLANS.free.invoicesPerMonth;
}


