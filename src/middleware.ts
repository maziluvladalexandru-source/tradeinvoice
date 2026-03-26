import { NextRequest, NextResponse } from "next/server";

const publicPaths = [
  "/",
  "/auth/login",
  "/auth/verify",
  "/api/auth/login",
  "/api/auth/verify",
  "/api/auth/logout",
  "/api/stripe/webhook",
  "/api/cron/reminders",
  "/api/cron/recurring",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (publicPaths.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // Allow public invoice views
  if (pathname.startsWith("/invoice/") && pathname.includes("/view")) {
    return NextResponse.next();
  }

  // Allow static files and API PDF routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes("/pdf")
  ) {
    return NextResponse.next();
  }

  // Check for session cookie
  const session = req.cookies.get("session");
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
