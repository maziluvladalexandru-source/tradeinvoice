import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInvoiceViewedNotification } from "@/lib/resend";
import { verifyPortalToken } from "@/lib/portal";

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
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Verify portal token for unauthenticated access
    const token = request.nextUrl.searchParams.get("token");
    if (!token || !verifyPortalToken(invoice.clientId, token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only mark as viewed if currently 'sent' (prevents re-processing)
    if (invoice.status !== "sent") {
      return NextResponse.json({ alreadyViewed: true });
    }

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: "viewed", viewedAt: new Date() },
    });

    // Notify contractor
    sendInvoiceViewedNotification(
      invoice.user.email,
      invoice.invoiceNumber,
      invoice.client.name
    ).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
