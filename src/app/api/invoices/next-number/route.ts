import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireUser();

    // Find the highest existing invoice number to ensure strict sequencing
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        userId: user.id,
        invoiceNumber: { startsWith: "INV-" },
      },
      orderBy: { invoiceNumber: "desc" },
      select: { invoiceNumber: true },
    });

    let nextNum = 1;
    if (lastInvoice) {
      const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    const nextNumber = `INV-${String(nextNum).padStart(4, "0")}`;
    return NextResponse.json({ nextNumber, expectedNumber: nextNum });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
