import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { v4 as uuid } from "uuid";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required. Set it in Vercel dashboard.");
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createMagicLinkToken(email: string): Promise<string> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(JWT_SECRET);
  return token;
}

export async function verifyMagicLinkToken(
  token: string
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.email as string;
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = uuid();
  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

export async function getSession() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    const { logSecurityEvent } = await import("./security-log");
    logSecurityEvent("AUTH_FAILURE", { reason: "no valid session" });
    throw new Error("Unauthorized");
  }
  return user;
}

