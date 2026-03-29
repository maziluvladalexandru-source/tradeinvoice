import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logSecurityEvent } from "@/lib/security-log";

export async function POST() {
  try {
    const user = await requireUser();

    // Delete all sessions for this user
    const deleted = await prisma.session.deleteMany({ where: { userId: user.id } });
    logSecurityEvent("LOGOUT_ALL_DEVICES", { userId: user.id, sessionsCleared: deleted.count });

    // Clear current session cookie
    const response = NextResponse.json({ success: true, sessionsCleared: deleted.count });
    response.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Logout all error:", error);
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}
