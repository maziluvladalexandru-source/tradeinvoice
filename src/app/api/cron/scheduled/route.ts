import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/resend";
import { formatCurrency, formatDate, appUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = { sent: 0, failed: 0 };

  const invoices = await prisma.invoice.findMany({
    where: {
      status: "draft",
      scheduledSendAt: { lte: now },
    },
    include: { client: true, user: true },
  });

  for (const invoice of invoices) {
    try {
      const viewUrl = appUrl(`/invoice/${invoice.id}`);

      await sendInvoiceEmail(
        invoice.client.email,
        invoice.client.name,
        invoice.invoiceNumber,
        formatCurrency(invoice.total, invoice.currency),
        viewUrl,
        invoice.user.businessName || undefined,
        formatDate(invoice.dueDate)
      );

      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: "sent",
          sentAt: new Date(),
          scheduledSendAt: null,
        },
      });

      results.sent++;
    } catch (error) {
      console.error(`Failed to send scheduled invoice ${invoice.id}:`, error);
      results.failed++;
    }
  }

  return NextResponse.json({ success: true, results });
}
