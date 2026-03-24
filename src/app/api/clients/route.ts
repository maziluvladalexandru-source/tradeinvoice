import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireUser();
    const clients = await prisma.client.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      include: {
        invoices: {
          select: {
            id: true,
            total: true,
            currency: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const enriched = clients.map((client) => {
      const invoices = client.invoices;
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        createdAt: client.createdAt,
        invoiceCount: invoices.length,
        totalInvoiced: invoices.reduce((sum, inv) => sum + inv.total, 0),
        currency: invoices[0]?.currency || "EUR",
        lastInvoiceDate: invoices[0]?.createdAt || null,
        statusBreakdown: {
          draft: invoices.filter((i) => i.status === "draft").length,
          sent: invoices.filter((i) => i.status === "sent").length,
          viewed: invoices.filter((i) => i.status === "viewed").length,
          paid: invoices.filter((i) => i.status === "paid").length,
          overdue: invoices.filter((i) => i.status === "overdue").length,
        },
      };
    });

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { name, email, phone, address } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        userId: user.id,
        name,
        email,
        phone: phone || null,
        address: address || null,
      },
    });

    return NextResponse.json(client);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
