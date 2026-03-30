import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = { userId: user.id };

    if (status && status !== "all") {
      where.status = status;
    }

    if (from || to) {
      const createdAt: Record<string, Date> = {};
      if (from) createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        createdAt.lte = toDate;
      }
      where.createdAt = createdAt;
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Invoice Number",
      "Date",
      "Due Date",
      "Client Name",
      "Status",
      "Currency",
      "Subtotal",
      "Tax Rate",
      "Tax Amount",
      "Total",
      "Paid Amount",
      "Outstanding",
    ];

    const rows = invoices.map((inv) => [
      escapeCsvField(inv.invoiceNumber),
      inv.createdAt.toISOString().split("T")[0],
      inv.dueDate.toISOString().split("T")[0],
      escapeCsvField(inv.client.name),
      inv.status,
      inv.currency,
      inv.subtotal.toFixed(2),
      inv.taxRate.toFixed(2),
      inv.taxAmount.toFixed(2),
      inv.total.toFixed(2),
      inv.paidAmount.toFixed(2),
      (inv.total - inv.paidAmount).toFixed(2),
    ]);

    const csv =
      headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    const today = new Date().toISOString().split("T")[0];

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=invoices-export-${today}.csv`,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Export invoices error:", error);
    return NextResponse.json(
      { error: "Failed to export invoices" },
      { status: 500 }
    );
  }
}
