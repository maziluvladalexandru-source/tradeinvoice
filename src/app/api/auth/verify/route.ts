import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken, createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logSecurityEvent } from "@/lib/security-log";
import { sendWelcomeEmail } from "@/lib/resend";

// Track recently used tokens to prevent replay attacks
const usedTokens = new Map<string, number>();

// Clean up expired entries every 10 minutes
setInterval(() => {
  const cutoff = Date.now() - 5 * 60 * 1000;
  for (const [key, ts] of Array.from(usedTokens)) {
    if (ts < cutoff) usedTokens.delete(key);
  }
}, 10 * 60 * 1000);

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login?error=missing_token", req.url));
  }

  // Prevent token replay: reject if this token was already used
  if (usedTokens.has(token)) {
    logSecurityEvent("MAGIC_LINK_REPLAY", { ip: req.headers.get("x-forwarded-for") || "unknown" });
    return NextResponse.redirect(new URL("/auth/login?error=invalid_token", req.url));
  }

  const email = await verifyMagicLinkToken(token);
  if (!email) {
    logSecurityEvent("MAGIC_LINK_INVALID", { ip: req.headers.get("x-forwarded-for") || "unknown" });
    return NextResponse.redirect(new URL("/auth/login?error=invalid_token", req.url));
  }

  // Mark token as used
  usedTokens.set(token, Date.now());

  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email },
    });
    sendWelcomeEmail(email).catch((err) =>
      console.error("Failed to send welcome email:", err)
    );
  }

  const sessionToken = await createSession(user.id);

  logSecurityEvent("SESSION_CREATED", { userId: user.id, email });

  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 90 * 24 * 60 * 60, // 90 days
    path: "/",
  });

  return response;
}

