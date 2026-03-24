import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInvoicePaidNotification } from "@/lib/resend";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser();
    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, userId: user.id },
      include: { client: true, lineItems: true, user: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser();
    const data = await req.json();

    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data,
      include: { client: true, lineItems: true, user: true },
    });

    // Notify contractor when invoice is marked as paid
    if (data.status === "paid" && updated.user) {
      sendInvoicePaidNotification(
        updated.user.email,
        updated.invoiceNumber,
        updated.client.name
      ).catch(() => {});
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(
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

    await prisma.invoice.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
