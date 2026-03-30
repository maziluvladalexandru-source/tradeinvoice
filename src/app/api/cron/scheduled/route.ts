import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/resend";
import { formatCurrency, formatDate, appUrl } from "@/lib/utils";

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
        formatDate(invoice.dueDate),
        invoice.clientId
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
