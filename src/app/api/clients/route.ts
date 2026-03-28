import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString, isValidEmail } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

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
        vatNumber: client.vatNumber,
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

    if (rateLimit("clients", user.id, 20, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
    }

    const { name, email, phone, address, vatNumber } = await req.json();

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

    // Check for duplicate client email
    const existingClient = await prisma.client.findFirst({
      where: { userId: user.id, email: sanitizedEmail },
    });
    if (existingClient) {
      return NextResponse.json(
        { error: "A client with this email already exists" },
        { status: 409 }
      );
    }

    const client = await prisma.client.create({
      data: {
        userId: user.id,
        name: sanitizeString(name, 200),
        email: sanitizedEmail,
        phone: phone ? sanitizeString(phone, 30) : null,
        address: address ? sanitizeString(address, 500) : null,
        vatNumber: vatNumber ? sanitizeString(vatNumber, 50) : null,
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
