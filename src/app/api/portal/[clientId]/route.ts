import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPortalToken } from "@/lib/portal";

export async function GET(
  req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token || !verifyPortalToken(params.clientId, token)) {
    return NextResponse.json({ error: "Invalid or missing token" }, { status: 403 });
  }

  const client = await prisma.client.findUnique({
    where: { id: params.clientId },
    include: {
      user: {
        select: {
          businessName: true,
          logoUrl: true,
          email: true,
        },
      },
      invoices: {
        where: { type: "invoice", status: { not: "draft" } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          invoiceNumber: true,
          createdAt: true,
          dueDate: true,
          total: true,
          status: true,
          currency: true,
          paidAt: true,
        },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const totalInvoiced = client.invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = client.invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  const outstanding = totalInvoiced - totalPaid;

  return NextResponse.json({
    client: {
      name: client.name,
      email: client.email,
    },
    business: {
      name: client.user.businessName || "Business",
      logoUrl: client.user.logoUrl,
      email: client.user.email,
    },
    invoices: client.invoices,
    totals: {
      invoiced: totalInvoiced,
      paid: totalPaid,
      outstanding,
    },
    currency: client.invoices[0]?.currency || "EUR",
  });
}
