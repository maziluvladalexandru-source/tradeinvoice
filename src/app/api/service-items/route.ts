import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/utils";

const VALID_UNITS = ["unit", "hour", "day", "fixed", "m²", "m"];

export async function GET() {
  try {
    const user = await requireUser();
    const items = await prisma.serviceItem.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get service items error:", error);
    return NextResponse.json({ error: "Failed to fetch service items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    if (rateLimit("service-items", user.id, 50, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
    }

    const { name, description, unitPrice, unit } = await req.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (typeof unitPrice !== "number" || unitPrice < 0) {
      return NextResponse.json({ error: "Unit price must be a positive number" }, { status: 400 });
    }

    const sanitizedUnit = unit && VALID_UNITS.includes(unit) ? unit : "unit";

    const item = await prisma.serviceItem.create({
      data: {
        userId: user.id,
        name: sanitizeString(name, 200),
        description: description ? sanitizeString(description, 500) : null,
        unitPrice,
        unit: sanitizedUnit,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create service item error:", error);
    return NextResponse.json({ error: "Failed to create service item" }, { status: 500 });
  }
}
