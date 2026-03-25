import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser();
    const { name, businessName, businessAddress, businessPhone, kvkNumber, vatNumber, bankDetails, logoUrl } =
      await req.json();

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || null,
        businessName: businessName || null,
        businessAddress: businessAddress || null,
        businessPhone: businessPhone || null,
        kvkNumber: kvkNumber || null,
        vatNumber: vatNumber || null,
        bankDetails: bankDetails || null,
        ...(logoUrl !== undefined ? { logoUrl: logoUrl || null } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
