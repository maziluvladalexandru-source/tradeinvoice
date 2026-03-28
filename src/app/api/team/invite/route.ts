import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidEmail, sanitizeString, appUrl } from "@/lib/utils";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    if (user.plan !== "pro") {
      return NextResponse.json({ error: "Team features require a Pro plan" }, { status: 403 });
    }

    const body = await req.json();
    const { email, name, role } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (email === user.email) {
      return NextResponse.json({ error: "You cannot invite yourself" }, { status: 400 });
    }

    // Check limit: max 3 team members on Pro
    const existingCount = await prisma.teamMember.count({ where: { userId: user.id } });
    if (existingCount >= 3) {
      return NextResponse.json({ error: "Pro plan is limited to 3 team members" }, { status: 400 });
    }

    // Check if already invited
    const existing = await prisma.teamMember.findUnique({
      where: { userId_email: { userId: user.id, email } },
    });
    if (existing) {
      return NextResponse.json({ error: "This person is already on your team" }, { status: 400 });
    }

    const inviteToken = uuid();
    const member = await prisma.teamMember.create({
      data: {
        userId: user.id,
        email,
        name: name ? sanitizeString(name, 100) : null,
        role: role === "admin" ? "admin" : "member",
        inviteToken,
      },
    });

    // Send invite email via Resend
    try {
      const { sendTeamInviteEmail } = await import("@/lib/team-email");
      const acceptUrl = appUrl(`/api/team/accept?token=${inviteToken}`);
      await sendTeamInviteEmail(email, user.businessName || user.name || "TradeInvoice", acceptUrl);
    } catch (emailError) {
      console.error("Failed to send invite email:", emailError);
      // Don't fail the invite if email fails - the invite link still works
    }

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Team invite error:", error);
    return NextResponse.json({ error: "Failed to send invite" }, { status: 500 });
  }
}
