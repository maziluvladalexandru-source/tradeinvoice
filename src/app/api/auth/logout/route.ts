import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { logSecurityEvent } from "@/lib/security-log";

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    // Find session to log the user before deleting
    const session = await prisma.session.findUnique({ where: { token }, select: { userId: true } });
    await prisma.session.deleteMany({ where: { token } });
    logSecurityEvent("LOGOUT", { userId: session?.userId || "unknown" });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
