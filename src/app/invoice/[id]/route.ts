import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public invoice view - marks as viewed
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { client: true, lineItems: true, user: true },
  });

  if (!invoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  // Mark as viewed if sent
  if (invoice.status === "sent") {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: "viewed", viewedAt: new Date() },
    });
  }

  // Redirect to the public invoice page
  return NextResponse.redirect(new URL(`/invoice/${params.id}/view`, req.url));
}
