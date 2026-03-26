import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString, isValidEmail } from "@/lib/utils";

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
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get clients error:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
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

    const sanitizedEmail = email.trim().slice(0, 254);
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        userId: user.id,
        name: sanitizeString(name, 200),
        email: sanitizedEmail,
        phone: phone ? sanitizeString(phone, 30) : null,
        address: address ? sanitizeString(address, 500) : null,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create client error:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
