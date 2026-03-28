import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const entry = await prisma.timeEntry.findUnique({ where: { id: params.id } });

    if (!entry || entry.userId !== user.id) {
      return NextResponse.json({ error: "Time entry not found" }, { status: 404 });
    }

    if (entry.invoiced) {
      return NextResponse.json({ error: "Cannot edit an invoiced time entry" }, { status: 400 });
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.description !== undefined) data.description = sanitizeString(body.description, 500);
    if (body.date !== undefined) data.date = new Date(body.date);
    if (body.hours !== undefined) {
      const h = parseFloat(body.hours);
      if (isNaN(h) || h <= 0) return NextResponse.json({ error: "Hours must be positive" }, { status: 400 });
      data.hours = h;
    }
    if (body.hourlyRate !== undefined) {
      const r = parseFloat(body.hourlyRate);
      if (isNaN(r) || r <= 0) return NextResponse.json({ error: "Rate must be positive" }, { status: 400 });
      data.hourlyRate = r;
    }
    if (body.billable !== undefined) data.billable = !!body.billable;
    if (body.clientId !== undefined) data.clientId = body.clientId || null;
    if (body.startTime !== undefined) data.startTime = body.startTime ? new Date(body.startTime) : null;
    if (body.endTime !== undefined) data.endTime = body.endTime ? new Date(body.endTime) : null;

    const updated = await prisma.timeEntry.update({
      where: { id: params.id },
      data,
      include: { client: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update time entry error:", error);
    return NextResponse.json({ error: "Failed to update time entry" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const entry = await prisma.timeEntry.findUnique({ where: { id: params.id } });

    if (!entry || entry.userId !== user.id) {
      return NextResponse.json({ error: "Time entry not found" }, { status: 404 });
    }

    if (entry.invoiced) {
      return NextResponse.json({ error: "Cannot delete an invoiced time entry" }, { status: 400 });
    }

    await prisma.timeEntry.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete time entry error:", error);
    return NextResponse.json({ error: "Failed to delete time entry" }, { status: 500 });
  }
}
