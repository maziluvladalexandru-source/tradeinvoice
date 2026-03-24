import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPaymentReminder, sendOverdueInvoiceEmail } from "@/lib/resend";
import { formatCurrency, appUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
  // Simple API key auth for cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = { reminded7: 0, reminded3: 0, remindedOverdue: 0, markedOverdue: 0 };

  // Get all sent/viewed invoices that aren't paid
  const invoices = await prisma.invoice.findMany({
    where: {
      status: { in: ["sent", "viewed"] },
    },
    include: { client: true, user: true },
  });

  for (const invoice of invoices) {
    const dueDate = new Date(invoice.dueDate);
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    const viewUrl = appUrl(`/invoice/${invoice.id}`);
    const totalFormatted = formatCurrency(invoice.total, invoice.currency);

    // Mark overdue
    if (daysUntilDue < 0 && invoice.status !== "overdue") {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: "overdue" },
      });
      results.markedOverdue++;
    }

    // 7-day reminder
    if (daysUntilDue <= 7 && daysUntilDue > 3 && !invoice.reminder7Sent) {
      await sendPaymentReminder(
        invoice.client.email,
        invoice.client.name,
        invoice.invoiceNumber,
        totalFormatted,
        "Payment due in 7 days",
        viewUrl
      );
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { reminder7Sent: true },
      });
      results.reminded7++;
    }

    // 3-day reminder
    if (daysUntilDue <= 3 && daysUntilDue > 0 && !invoice.reminder3Sent) {
      await sendPaymentReminder(
        invoice.client.email,
        invoice.client.name,
        invoice.invoiceNumber,
        totalFormatted,
        "Payment due in 3 days",
        viewUrl
      );
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { reminder3Sent: true },
      });
      results.reminded3++;
    }

    // Overdue reminder — use the urgent overdue template
    if (daysUntilDue < 0 && !invoice.reminderOverdueSent) {
      const daysOverdue = Math.abs(daysUntilDue);
      const dueDateFormatted = dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      await sendOverdueInvoiceEmail(
        invoice.client.email,
        invoice.client.name,
        invoice.invoiceNumber,
        totalFormatted,
        dueDateFormatted,
        daysOverdue,
        viewUrl,
        invoice.user.businessName || undefined
      );
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { reminderOverdueSent: true },
      });
      results.remindedOverdue++;
    }
  }

  return NextResponse.json({ success: true, results });
}
