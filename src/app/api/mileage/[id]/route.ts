import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();

    if (user.plan !== "pro") {
      return NextResponse.json({ error: "Mileage tracking requires a Pro plan" }, { status: 403 });
    }

    const entry = await prisma.mileageEntry.findUnique({ where: { id: params.id } });

    if (!entry || entry.userId !== user.id) {
      return NextResponse.json({ error: "Mileage entry not found" }, { status: 404 });
    }

    await prisma.mileageEntry.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete mileage entry error:", error);
    return NextResponse.json({ error: "Failed to delete mileage entry" }, { status: 500 });
  }
}
