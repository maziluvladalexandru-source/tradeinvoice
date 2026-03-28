import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const url = req.nextUrl;
    const clientId = url.searchParams.get("clientId");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const billable = url.searchParams.get("billable");
    const invoiced = url.searchParams.get("invoiced");

    const where: Record<string, unknown> = { userId: user.id };

    if (clientId) where.clientId = clientId;
    if (billable === "true") where.billable = true;
    if (billable === "false") where.billable = false;
    if (invoiced === "true") where.invoiced = true;
    if (invoiced === "false") where.invoiced = false;

    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.gte = new Date(from);
      if (to) dateFilter.lte = new Date(to);
      where.date = dateFilter;
    }

    const entries = await prisma.timeEntry.findMany({
      where,
      include: { client: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(entries);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get time entries error:", error);
    return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    if (user.plan !== "pro") {
      return NextResponse.json({ error: "Time tracking requires a Pro plan" }, { status: 403 });
    }

    if (rateLimit("time-entries", user.id, 60, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { description, date, startTime, endTime, hours, hourlyRate, billable, clientId } = body;

    if (!description || !date || (hours === undefined && !startTime)) {
      return NextResponse.json({ error: "Description, date, and hours (or start time) are required" }, { status: 400 });
    }

    const parsedRate = parseFloat(hourlyRate);
    if (isNaN(parsedRate) || parsedRate <= 0) {
      return NextResponse.json({ error: "Hourly rate must be a positive number" }, { status: 400 });
    }

    let calculatedHours = parseFloat(hours);
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      calculatedHours = Math.round(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 100) / 100;
    }

    if (isNaN(calculatedHours) || calculatedHours <= 0) {
      return NextResponse.json({ error: "Hours must be a positive number" }, { status: 400 });
    }

    if (clientId) {
      const client = await prisma.client.findFirst({ where: { id: clientId, userId: user.id } });
      if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }
    }

    const entry = await prisma.timeEntry.create({
      data: {
        userId: user.id,
        clientId: clientId || null,
        description: sanitizeString(description, 500),
        date: new Date(date),
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        hours: calculatedHours,
        hourlyRate: parsedRate,
        billable: billable !== false,
      },
      include: { client: true },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create time entry error:", error);
    return NextResponse.json({ error: "Failed to create time entry" }, { status: 500 });
  }
}
