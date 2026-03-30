import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

const VALID_CATEGORIES = ["materials", "fuel", "tools", "subcontractor", "office", "other"] as const;

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const url = req.nextUrl;
    const category = url.searchParams.get("category");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    const where: Record<string, unknown> = { userId: user.id };

    if (category && VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
      where.category = category;
    }

    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.gte = new Date(from);
      if (to) dateFilter.lte = new Date(to);
      where.date = dateFilter;
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: "desc" },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get expenses error:", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    if (rateLimit("expenses", user.id, 60, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { description, amount, category, date, receiptUrl, vendor, taxDeductible, notes } = body;

    if (!description || !amount || !category || !date) {
      return NextResponse.json({ error: "Description, amount, category, and date are required" }, { status: 400 });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    // Receipt upload is Pro only
    if (receiptUrl && user.plan !== "pro") {
      return NextResponse.json({ error: "Receipt upload requires a Pro plan" }, { status: 403 });
    }

    // Validate receipt is an image data URI
    if (receiptUrl && typeof receiptUrl === "string" && !receiptUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "Receipt must be an image" }, { status: 400 });
    }
    // Validate receipt size (base64 ~1.37x original, so 5MB file ≈ 6.85MB base64)
    if (receiptUrl && receiptUrl.length > 7 * 1024 * 1024) {
      return NextResponse.json({ error: "Receipt image too large. Maximum 5MB." }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        userId: user.id,
        description: sanitizeString(description, 200),
        amount: parsedAmount,
        category,
        date: new Date(date),
        receiptUrl: receiptUrl || null,
        vendor: vendor ? sanitizeString(vendor, 100) : null,
        taxDeductible: taxDeductible !== false,
        notes: notes ? sanitizeString(notes, 500) : null,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create expense error:", error);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
