import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET team members (owner only)
export async function GET() {
  try {
    const user = await requireUser();

    if (user.plan !== "pro") {
      return NextResponse.json({ error: "Team features require a Pro plan" }, { status: 403 });
    }

    const members = await prisma.teamMember.findMany({
      where: { userId: user.id },
      orderBy: { invitedAt: "desc" },
    });

    return NextResponse.json(members);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get team error:", error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}

// DELETE a team member
export async function DELETE(req: Request) {
  try {
    const user = await requireUser();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member || member.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete team member error:", error);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
