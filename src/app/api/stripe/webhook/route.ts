import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendPaymentReceivedEmail } from "@/lib/resend";
import { formatCurrency } from "@/lib/utils";
import { logSecurityEvent } from "@/lib/security-log";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripeClient();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    logSecurityEvent("STRIPE_WEBHOOK_INVALID_SIG", { ip: req.headers.get("x-forwarded-for") || "unknown" });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  logSecurityEvent("STRIPE_WEBHOOK", { eventType: event.type, eventId: event.id });

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Handle Pro subscription upgrade
      const userId = session.metadata?.userId;
      if (userId && session.subscription) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "pro",
            stripeSubscriptionId: session.subscription as string,
          },
        });
      }

      // Handle invoice payment via payment link
      const invoiceId = session.metadata?.invoiceId;
      if (invoiceId && session.payment_status === "paid") {
        const isDeposit = session.metadata?.isDeposit === "true";

        if (isDeposit) {
          // Mark deposit as paid
          const invoice = await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
              depositPaid: true,
              depositPaidAt: new Date(),
              paidAmount: { increment: (await prisma.invoice.findUnique({ where: { id: invoiceId }, select: { depositAmount: true } }))?.depositAmount || 0 },
              paymentUrl: null, // Clear so remaining balance gets a new payment link
            },
            include: { client: true, user: true },
          });
          await sendPaymentReceivedEmail(
            invoice.user.email,
            invoice.invoiceNumber,
            invoice.client.name,
            formatCurrency(invoice.total, invoice.currency)
          );
        } else {
          const invoice = await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: "paid", paidAt: new Date() },
            include: { client: true, user: true },
          });
          await sendPaymentReceivedEmail(
            invoice.user.email,
            invoice.invoiceNumber,
            invoice.client.name,
            formatCurrency(invoice.total, invoice.currency)
          );
        }
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const user = await prisma.user.findFirst({
        where: { stripeSubscriptionId: sub.id },
      });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: "free",
            stripeSubscriptionId: null,
          },
        });
      }
      break;
    }
    case "invoice.paid": {
      const stripeInvoice = event.data.object as Stripe.Invoice;
      const invoiceId = stripeInvoice.metadata?.invoiceId;
      if (invoiceId) {
        const invoice = await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: "paid", paidAt: new Date() },
          include: { client: true, user: true },
        });
        await sendPaymentReceivedEmail(
          invoice.user.email,
          invoice.invoiceNumber,
          invoice.client.name,
          formatCurrency(invoice.total, invoice.currency)
        );
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
