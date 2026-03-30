import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?error=invalid-invite", req.url));
    }

    const member = await prisma.teamMember.findUnique({ where: { inviteToken: token } });
    if (!member) {
      return NextResponse.redirect(new URL("/auth/login?error=invalid-invite", req.url));
    }

    if (member.acceptedAt) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Check if the current user is logged in
    const user = await getCurrentUser();

    if (user && user.email === member.email) {
      // Link the current user as the team member
      await prisma.teamMember.update({
        where: { id: member.id },
        data: {
          acceptedAt: new Date(),
          memberUserId: user.id,
          inviteToken: null,
        },
      });
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (user && user.email !== member.email) {
      // Wrong account logged in - redirect to login with correct email
      return NextResponse.redirect(new URL(`/auth/login?email=${encodeURIComponent(member.email)}&invite=${token}&error=wrong-account`, req.url));
    }

    // Not logged in - redirect to login with the invite email pre-filled
    return NextResponse.redirect(new URL(`/auth/login?email=${encodeURIComponent(member.email)}&invite=${token}`, req.url));
  } catch (error) {
    console.error("Accept invite error:", error);
    return NextResponse.redirect(new URL("/auth/login?error=invite-failed", req.url));
  }
}
