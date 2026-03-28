import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/utils";

const VALID_UNITS = ["unit", "hour", "day", "fixed", "m²", "m"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const item = await prisma.serviceItem.findUnique({ where: { id: params.id } });

    if (!item || item.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { name, description, unitPrice, unit } = await req.json();

    const data: Record<string, unknown> = {};
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }
      data.name = sanitizeString(name, 200);
    }
    if (description !== undefined) {
      data.description = description ? sanitizeString(description, 500) : null;
    }
    if (unitPrice !== undefined) {
      if (typeof unitPrice !== "number" || unitPrice < 0) {
        return NextResponse.json({ error: "Unit price must be a positive number" }, { status: 400 });
      }
      data.unitPrice = unitPrice;
    }
    if (unit !== undefined) {
      data.unit = VALID_UNITS.includes(unit) ? unit : "unit";
    }

    const updated = await prisma.serviceItem.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update service item error:", error);
    return NextResponse.json({ error: "Failed to update service item" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const item = await prisma.serviceItem.findUnique({ where: { id: params.id } });

    if (!item || item.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.serviceItem.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete service item error:", error);
    return NextResponse.json({ error: "Failed to delete service item" }, { status: 500 });
  }
}
