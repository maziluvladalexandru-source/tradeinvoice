import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNextInvoiceNumber, formatCurrency, formatDate, appUrl } from "@/lib/utils";
import { sendInvoiceEmail } from "@/lib/resend";

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = { created: 0, sent: 0, errors: 0 };

  // Find all recurring invoices where recurringNextDate is due
  const recurringInvoices = await prisma.invoice.findMany({
    where: {
      isRecurring: true,
      recurringNextDate: { lte: now },
      type: "invoice",
    },
    include: { lineItems: true, client: true, user: true },
  });

  for (const invoice of recurringInvoices) {
    try {
      // Calculate due date based on interval
      const dueDate = new Date();
      if (invoice.recurringInterval === "weekly") dueDate.setDate(dueDate.getDate() + 7);
      else if (invoice.recurringInterval === "monthly") dueDate.setMonth(dueDate.getMonth() + 1);
      else if (invoice.recurringInterval === "quarterly") dueDate.setMonth(dueDate.getMonth() + 3);
      else if (invoice.recurringInterval === "yearly") dueDate.setFullYear(dueDate.getFullYear() + 1);
      else dueDate.setMonth(dueDate.getMonth() + 1);

      // Create new invoice with status "sent" and sentAt timestamp
      const newInvoice = await prisma.invoice.create({
        data: {
          userId: invoice.userId,
          clientId: invoice.clientId,
          invoiceNumber: await getNextInvoiceNumber(invoice.userId),
          description: invoice.description,
          paymentNotes: invoice.paymentNotes,
          notesToClient: invoice.notesToClient,
          type: "invoice",
          status: "sent",
          sentAt: now,
          currency: invoice.currency,
          dueDate,
          subtotal: invoice.subtotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          total: invoice.total,
          invoiceTheme: invoice.invoiceTheme,
          invoiceCountry: invoice.invoiceCountry,
          language: invoice.language,
          reverseCharge: invoice.reverseCharge,
          remindersEnabled: invoice.remindersEnabled,
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

      results.created++;

      // Send invoice email to client
      try {
        const viewUrl = appUrl(`/invoice/${newInvoice.id}`);
        await sendInvoiceEmail(
          invoice.client.email,
          invoice.client.name,
          newInvoice.invoiceNumber,
          formatCurrency(newInvoice.total, newInvoice.currency),
          viewUrl,
          invoice.user.businessName || undefined,
          formatDate(dueDate),
          invoice.clientId
        );
        results.sent++;
      } catch (emailError) {
        console.error(`Failed to send recurring invoice email for ${newInvoice.invoiceNumber}:`, emailError);
        results.errors++;
      }

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
    } catch (error) {
      console.error(`Failed to process recurring invoice ${invoice.id}:`, error);
      results.errors++;
    }
  }

  return NextResponse.json({ success: true, results });
}
