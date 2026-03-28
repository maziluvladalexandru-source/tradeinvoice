import { createHash } from "crypto";

export function generatePortalToken(clientId: string): string {
  const secret = process.env.JWT_SECRET || "fallback-secret";
  return createHash("sha256")
    .update(clientId + secret)
    .digest("hex")
    .slice(0, 32);
}

export function verifyPortalToken(clientId: string, token: string): boolean {
  return generatePortalToken(clientId) === token;
}

export function portalUrl(clientId: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const token = generatePortalToken(clientId);
  return `${base}/portal/${clientId}?token=${token}`;
}
