import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString, isValidEmail } from "@/lib/utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser();
    const client = await prisma.client.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!client) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { name, email, phone, address, vatNumber } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const sanitizedEmail = email.trim().slice(0, 254);
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check for duplicate email (excluding this client)
    const existing = await prisma.client.findFirst({
      where: { userId: user.id, email: sanitizedEmail, id: { not: params.id } },
    });
    if (existing) {
      return NextResponse.json({ error: "A client with this email already exists" }, { status: 409 });
    }

    const updated = await prisma.client.update({
      where: { id: params.id },
      data: {
        name: sanitizeString(name, 200),
        email: sanitizedEmail,
        phone: phone ? sanitizeString(phone, 30) : null,
        address: address ? sanitizeString(address, 500) : null,
        vatNumber: vatNumber ? sanitizeString(vatNumber, 50) : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update client error:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser();
    const client = await prisma.client.findFirst({
      where: { id: params.id, userId: user.id },
      include: { _count: { select: { invoices: true } } },
    });
    if (!client) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (client._count.invoices > 0) {
      return NextResponse.json(
        { error: `Cannot delete client with ${client._count.invoices} invoice(s). Delete invoices first.` },
        { status: 400 }
      );
    }

    await prisma.client.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete client error:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
