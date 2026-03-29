import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireUser();
    const prefix = user.invoiceNumberPrefix || "INV";

    // Find the highest existing invoice number to ensure strict sequencing
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        userId: user.id,
        invoiceNumber: { startsWith: `${prefix}-` },
      },
      orderBy: { invoiceNumber: "desc" },
      select: { invoiceNumber: true },
    });

    let nextNum = 1;
    if (lastInvoice) {
      const match = lastInvoice.invoiceNumber.match(new RegExp(`${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(\\d+)`));
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    // If prefix changed and no matching invoices found, also check INV- for continuity
    if (!lastInvoice && prefix !== "INV") {
      const fallbackInvoice = await prisma.invoice.findFirst({
        where: { userId: user.id, invoiceNumber: { startsWith: "INV-" } },
        orderBy: { invoiceNumber: "desc" },
        select: { invoiceNumber: true },
      });
      if (fallbackInvoice) {
        const match = fallbackInvoice.invoiceNumber.match(/INV-(\d+)/);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }
    }

    const nextNumber = `${prefix}-${String(nextNum).padStart(4, "0")}`;
    return NextResponse.json({ nextNumber, expectedNumber: nextNum });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Next invoice number error:", error);
    return NextResponse.json({ error: "Failed to get next number" }, { status: 500 });
  }
}
