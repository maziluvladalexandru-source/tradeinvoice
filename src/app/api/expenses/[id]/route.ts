import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/utils";

const VALID_CATEGORIES = ["materials", "fuel", "tools", "subcontractor", "office", "other"] as const;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const expense = await prisma.expense.findUnique({ where: { id: params.id } });

    if (!expense || expense.userId !== user.id) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.description !== undefined) data.description = sanitizeString(body.description, 200);
    if (body.amount !== undefined) {
      const parsedAmount = parseFloat(body.amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
      }
      data.amount = parsedAmount;
    }
    if (body.category !== undefined) {
      if (!VALID_CATEGORIES.includes(body.category)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
      data.category = body.category;
    }
    if (body.date !== undefined) data.date = new Date(body.date);
    if (body.vendor !== undefined) data.vendor = body.vendor ? sanitizeString(body.vendor, 100) : null;
    if (body.taxDeductible !== undefined) data.taxDeductible = !!body.taxDeductible;
    if (body.notes !== undefined) data.notes = body.notes ? sanitizeString(body.notes, 500) : null;

    if (body.receiptUrl !== undefined) {
      if (body.receiptUrl && user.plan !== "pro") {
        return NextResponse.json({ error: "Receipt upload requires a Pro plan" }, { status: 403 });
      }
      if (body.receiptUrl && typeof body.receiptUrl === "string" && !body.receiptUrl.startsWith("data:image/")) {
        return NextResponse.json({ error: "Receipt must be an image" }, { status: 400 });
      }
      if (body.receiptUrl && body.receiptUrl.length > 7 * 1024 * 1024) {
        return NextResponse.json({ error: "Receipt image too large. Maximum 5MB." }, { status: 400 });
      }
      data.receiptUrl = body.receiptUrl || null;
    }

    const updated = await prisma.expense.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update expense error:", error);
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const expense = await prisma.expense.findUnique({ where: { id: params.id } });

    if (!expense || expense.userId !== user.id) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    await prisma.expense.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete expense error:", error);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
