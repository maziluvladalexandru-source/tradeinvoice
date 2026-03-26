import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logSecurityEvent } from "@/lib/security-log";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { confirmation } = await req.json();

    if (confirmation !== "DELETE") {
      return NextResponse.json(
        { error: "You must type DELETE to confirm account deletion" },
        { status: 400 }
      );
    }

    logSecurityEvent("ACCOUNT_DELETION", {
      userId: user.id,
      email: user.email,
      ip: req.headers.get("x-forwarded-for") || "unknown",
    });

    // Delete in order respecting foreign keys
    // 1. LineItems for user's invoices
    await prisma.lineItem.deleteMany({
      where: { invoice: { userId: user.id } },
    });

    // 2. Invoices
    await prisma.invoice.deleteMany({
      where: { userId: user.id },
    });

    // 3. Clients
    await prisma.client.deleteMany({
      where: { userId: user.id },
    });

    // 4. Sessions
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    // 5. User record
    await prisma.user.delete({
      where: { id: user.id },
    });

    // Clear session cookie
    const cookieStore = cookies();
    cookieStore.set("session", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json({ success: true, redirect: "/" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
