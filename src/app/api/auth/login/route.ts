import { NextRequest, NextResponse } from "next/server";
import { createMagicLinkToken } from "@/lib/auth";
import { sendMagicLink } from "@/lib/resend";
import { appUrl } from "@/lib/utils";
import { logSecurityEvent } from "@/lib/security-log";
import { rateLimit } from "@/lib/rate-limit";

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET || "1x0000000000000000000000000000000AA";

async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: TURNSTILE_SECRET, response: token }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, turnstileToken } = await req.json();

    // Verify Turnstile CAPTCHA (only if real keys are configured)
    const hasRealTurnstile = process.env.TURNSTILE_SECRET && !process.env.TURNSTILE_SECRET.startsWith("1x000");
    if (hasRealTurnstile) {
      if (!turnstileToken || typeof turnstileToken !== "string") {
        return NextResponse.json({ error: "CAPTCHA verification required" }, { status: 403 });
      }
      const turnstileValid = await verifyTurnstile(turnstileToken);
      if (!turnstileValid) {
        logSecurityEvent("TURNSTILE_FAILED", { ip: req.headers.get("x-forwarded-for") || "unknown" });
        return NextResponse.json({ error: "CAPTCHA verification failed" }, { status: 403 });
      }
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (rateLimit("login", cleanEmail, 5, 15 * 60 * 1000)) {
      logSecurityEvent("LOGIN_RATE_LIMITED", { email: cleanEmail, ip: req.headers.get("x-forwarded-for") || "unknown" });
      return NextResponse.json(
        { error: "Too many login attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }

    const token = await createMagicLinkToken(cleanEmail);
    const url = appUrl(`/api/auth/verify?token=${token}`);

    await sendMagicLink(cleanEmail, url);

    logSecurityEvent("LOGIN_ATTEMPT", { email: cleanEmail, ip: req.headers.get("x-forwarded-for") || "unknown" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500 }
    );
  }
}
