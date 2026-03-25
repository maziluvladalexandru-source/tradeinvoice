import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser();

    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (invoice.type !== "quote") {
      return NextResponse.json({ error: "Only quotes can be converted to invoices" }, { status: 400 });
    }

    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        type: "invoice",
        invoiceNumber: invoice.invoiceNumber.replace("QTE-", "INV-"),
      },
      include: { client: true, lineItems: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
