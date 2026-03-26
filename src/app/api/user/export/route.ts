import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireUser();

    const clients = await prisma.client.findMany({
      where: { userId: user.id },
    });

    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      include: { lineItems: true },
    });

    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        businessName: user.businessName,
        businessAddress: user.businessAddress,
        businessPhone: user.businessPhone,
        kvkNumber: user.kvkNumber,
        vatNumber: user.vatNumber,
        bankDetails: user.bankDetails,
        plan: user.plan,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      clients: clients.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      invoices: invoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        clientId: inv.clientId,
        description: inv.description,
        paymentNotes: inv.paymentNotes,
        notesToClient: inv.notesToClient,
        serviceDate: inv.serviceDate,
        type: inv.type,
        status: inv.status,
        subtotal: inv.subtotal,
        taxRate: inv.taxRate,
        taxAmount: inv.taxAmount,
        total: inv.total,
        currency: inv.currency,
        dueDate: inv.dueDate,
        sentAt: inv.sentAt,
        viewedAt: inv.viewedAt,
        paidAt: inv.paidAt,
        isRecurring: inv.isRecurring,
        recurringInterval: inv.recurringInterval,
        recurringNextDate: inv.recurringNextDate,
        remindersEnabled: inv.remindersEnabled,
        paymentUrl: inv.paymentUrl,
        reverseCharge: inv.reverseCharge,
        referenceInvoice: inv.referenceInvoice,
        language: inv.language,
        paidAmount: inv.paidAmount,
        createdAt: inv.createdAt,
        updatedAt: inv.updatedAt,
        lineItems: inv.lineItems.map((li) => ({
          id: li.id,
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          total: li.total,
        })),
      })),
    };

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `tradeinvoice-data-export-${dateStr}.json`;

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Data export error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
