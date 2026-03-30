import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireUser();
    const prefix = user.invoiceNumberPrefix || "INV";
    const format = user.invoiceFormat || "PREFIX-NUMBER";
    const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const year = new Date().getFullYear();

    // Build search pattern based on format
    const searchPrefix = format === "PREFIX-YEAR-NUMBER" ? `${prefix}-${year}-` : `${prefix}-`;

    // Find the highest existing invoice number to ensure strict sequencing
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        userId: user.id,
        invoiceNumber: { startsWith: searchPrefix },
      },
      orderBy: { invoiceNumber: "desc" },
      select: { invoiceNumber: true },
    });

    let nextNum = 1;
    if (lastInvoice) {
      // Extract the trailing number from the invoice
      const pattern = format === "PREFIX-YEAR-NUMBER"
        ? new RegExp(`${escapedPrefix}-\\d{4}-(\\d+)`)
        : new RegExp(`${escapedPrefix}-(\\d+)`);
      const match = lastInvoice.invoiceNumber.match(pattern);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    // If prefix changed and no matching invoices found, also check INV- for continuity
    if (!lastInvoice && prefix !== "INV") {
      const fallbackPrefix = format === "PREFIX-YEAR-NUMBER" ? `INV-${year}-` : "INV-";
      const fallbackInvoice = await prisma.invoice.findFirst({
        where: { userId: user.id, invoiceNumber: { startsWith: fallbackPrefix } },
        orderBy: { invoiceNumber: "desc" },
        select: { invoiceNumber: true },
      });
      if (fallbackInvoice) {
        const fallbackPattern = format === "PREFIX-YEAR-NUMBER"
          ? /INV-\d{4}-(\d+)/
          : /INV-(\d+)/;
        const match = fallbackInvoice.invoiceNumber.match(fallbackPattern);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }
    }

    const paddedNum = String(nextNum).padStart(4, "0");
    const nextNumber = format === "PREFIX-YEAR-NUMBER"
      ? `${prefix}-${year}-${paddedNum}`
      : `${prefix}-${paddedNum}`;
    return NextResponse.json({ nextNumber, expectedNumber: nextNum });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Next invoice number error:", error);
    return NextResponse.json({ error: "Failed to get next number" }, { status: 500 });
  }
}
