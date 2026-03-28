import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/utils";

export async function GET() {
  try {
    const user = await requireUser();

    const timer = await prisma.activeTimer.findUnique({
      where: { userId: user.id },
      include: { client: true },
    });

    return NextResponse.json(timer);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get active timer error:", error);
    return NextResponse.json({ error: "Failed to fetch active timer" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireUser();

    if (user.plan !== "pro") {
      return NextResponse.json({ error: "Time tracking requires a Pro plan" }, { status: 403 });
    }

    const body = await req.json();
    const { startTime, description, clientId, hourlyRate } = body;

    if (!startTime) {
      return NextResponse.json({ error: "Start time is required" }, { status: 400 });
    }

    if (clientId) {
      const client = await prisma.client.findFirst({ where: { id: clientId, userId: user.id } });
      if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }
    }

    const timer = await prisma.activeTimer.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        startTime: new Date(startTime),
        description: sanitizeString(description || "", 500),
        clientId: clientId || null,
        hourlyRate: parseFloat(hourlyRate) || 50,
      },
      update: {
        startTime: new Date(startTime),
        description: sanitizeString(description || "", 500),
        clientId: clientId || null,
        hourlyRate: parseFloat(hourlyRate) || 50,
      },
      include: { client: true },
    });

    return NextResponse.json(timer);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Save active timer error:", error);
    return NextResponse.json({ error: "Failed to save active timer" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await requireUser();

    await prisma.activeTimer.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete active timer error:", error);
    return NextResponse.json({ error: "Failed to delete active timer" }, { status: 500 });
  }
}
