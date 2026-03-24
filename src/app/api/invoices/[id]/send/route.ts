import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/resend";
import { formatCurrency, appUrl } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser();

    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, userId: user.id },
      include: { client: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const viewUrl = appUrl(`/invoice/${invoice.id}`);

    await sendInvoiceEmail(
      invoice.client.email,
      invoice.client.name,
      invoice.invoiceNumber,
      formatCurrency(invoice.total, invoice.currency),
      viewUrl
    );

    await prisma.invoice.update({
      where: { id: params.id },
      data: {
        status: "sent",
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send invoice error:", error);
    return NextResponse.json(
      { error: "Failed to send invoice" },
      { status: 500 }
    );
  }
}
