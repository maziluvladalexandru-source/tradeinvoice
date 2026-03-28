import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentReminder } from "@/lib/resend";
import { formatCurrency } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const { action, invoiceIds } = body;

    if (!action || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return NextResponse.json(
        { error: "action and invoiceIds[] are required" },
        { status: 400 }
      );
    }

    if (!["mark-paid", "send-reminders", "delete"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Verify all invoices belong to the user
    const invoices = await prisma.invoice.findMany({
      where: { id: { in: invoiceIds }, userId: user.id },
      include: { client: true },
    });

    if (invoices.length !== invoiceIds.length) {
      return NextResponse.json(
        { error: "Some invoices not found or unauthorized" },
        { status: 403 }
      );
    }

    if (action === "mark-paid") {
      await prisma.invoice.updateMany({
        where: { id: { in: invoiceIds }, userId: user.id },
        data: { status: "paid", paidAt: new Date() },
      });
      return NextResponse.json({
        success: true,
        message: `${invoices.length} invoice(s) marked as paid`,
      });
    }

    if (action === "send-reminders") {
      const eligible = invoices.filter((inv) =>
        ["sent", "overdue"].includes(inv.status)
      );

      if (eligible.length === 0) {
        return NextResponse.json(
          { error: "No eligible invoices (must be sent or overdue)" },
          { status: 400 }
        );
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tradeinvoice.app";
      const results = await Promise.allSettled(
        eligible.map((inv) =>
          sendPaymentReminder(
            inv.client.email,
            inv.client.name,
            inv.invoiceNumber,
            formatCurrency(inv.total, inv.currency),
            "Payment reminder",
            `${baseUrl}/invoices/${inv.id}/view`
          )
        )
      );

      const sent = results.filter((r) => r.status === "fulfilled").length;
      return NextResponse.json({
        success: true,
        message: `${sent} reminder(s) sent`,
        sent,
        total: eligible.length,
      });
    }

    if (action === "delete") {
      await prisma.invoice.deleteMany({
        where: { id: { in: invoiceIds }, userId: user.id },
      });
      return NextResponse.json({
        success: true,
        message: `${invoices.length} invoice(s) deleted`,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Bulk action error:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk action" },
      { status: 500 }
    );
  }
}
