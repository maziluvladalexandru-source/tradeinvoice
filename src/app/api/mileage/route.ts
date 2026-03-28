import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();

    if (user.plan !== "pro") {
      return NextResponse.json({ error: "Mileage tracking requires a Pro plan" }, { status: 403 });
    }

    const url = req.nextUrl;
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const clientId = url.searchParams.get("clientId");

    const where: Record<string, unknown> = { userId: user.id };

    if (clientId) {
      where.clientId = clientId;
    }

    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.gte = new Date(from);
      if (to) dateFilter.lte = new Date(to);
      where.date = dateFilter;
    }

    const entries = await prisma.mileageEntry.findMany({
      where,
      orderBy: { date: "desc" },
      include: { client: { select: { id: true, name: true } } },
    });

    return NextResponse.json(entries);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get mileage entries error:", error);
    return NextResponse.json({ error: "Failed to fetch mileage entries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    if (user.plan !== "pro") {
      return NextResponse.json({ error: "Mileage tracking requires a Pro plan" }, { status: 403 });
    }

    if (rateLimit("mileage", user.id, 60, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { date, fromLocation, toLocation, distance, purpose, clientId, ratePerKm, billable } = body;

    if (!date || !fromLocation || !toLocation || !distance || !purpose) {
      return NextResponse.json({ error: "Date, from, to, distance, and purpose are required" }, { status: 400 });
    }

    const parsedDistance = parseFloat(distance);
    if (isNaN(parsedDistance) || parsedDistance <= 0) {
      return NextResponse.json({ error: "Distance must be a positive number" }, { status: 400 });
    }

    const parsedRate = ratePerKm !== undefined ? parseFloat(ratePerKm) : 0.23;
    if (isNaN(parsedRate) || parsedRate < 0) {
      return NextResponse.json({ error: "Rate must be a non-negative number" }, { status: 400 });
    }

    // Validate clientId if provided
    if (clientId) {
      const client = await prisma.client.findUnique({ where: { id: clientId } });
      if (!client || client.userId !== user.id) {
        return NextResponse.json({ error: "Client not found" }, { status: 400 });
      }
    }

    const entry = await prisma.mileageEntry.create({
      data: {
        userId: user.id,
        date: new Date(date),
        fromLocation: sanitizeString(fromLocation, 200),
        toLocation: sanitizeString(toLocation, 200),
        distance: parsedDistance,
        purpose: sanitizeString(purpose, 300),
        clientId: clientId || null,
        ratePerKm: parsedRate,
        billable: !!billable,
      },
      include: { client: { select: { id: true, name: true } } },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create mileage entry error:", error);
    return NextResponse.json({ error: "Failed to create mileage entry" }, { status: 500 });
  }
}
