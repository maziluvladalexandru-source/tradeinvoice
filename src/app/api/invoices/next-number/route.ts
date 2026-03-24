import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireUser();
    const count = await prisma.invoice.count({
      where: { userId: user.id },
    });
    const nextNumber = `INV-${String(count + 1).padStart(4, "0")}`;
    return NextResponse.json({ nextNumber });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
