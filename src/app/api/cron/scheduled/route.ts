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

  // Cleanup: delete stale sessions (keep 5 most recent per user)
  let sessionsDeleted = 0;
  try {
    const users = await prisma.user.findMany({ select: { id: true } });
    for (const u of users) {
      const sessions = await prisma.session.findMany({ where: { userId: u.id }, orderBy: { expiresAt: "desc" }, select: { id: true } });
      if (sessions.length > 5) {
        const toDelete = sessions.slice(5).map(s => s.id);
        await prisma.session.deleteMany({ where: { id: { in: toDelete } } });
        sessionsDeleted += toDelete.length;
      }
    }
  } catch (e) {
    console.error("Session cleanup error:", e);
  }

  return NextResponse.json({ success: true, results, sessionsDeleted });
}
