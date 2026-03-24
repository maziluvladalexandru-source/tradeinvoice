import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendInvoiceViewedNotification,
  sendInvoicePaidNotification,
} from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { invoiceId, type } = await req.json();

    if (!invoiceId || !type) {
      return NextResponse.json({ error: "Missing invoiceId or type" }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true, user: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const { user, client, invoiceNumber } = invoice;

    if (type === "viewed") {
      await sendInvoiceViewedNotification(user.email, invoiceNumber, client.name);
    } else if (type === "paid") {
      await sendInvoicePaidNotification(user.email, invoiceNumber, client.name);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
