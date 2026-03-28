import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();

    if (user.plan !== "pro") {
      return NextResponse.json({ error: "Reports require a Pro plan" }, { status: 403 });
    }

    const url = req.nextUrl;
    const period = url.searchParams.get("period") || "year"; // month | quarter | year
    const year = parseInt(url.searchParams.get("year") || new Date().getFullYear().toString());
    const month = parseInt(url.searchParams.get("month") || (new Date().getMonth() + 1).toString());
    const quarter = parseInt(url.searchParams.get("quarter") || (Math.floor(new Date().getMonth() / 3) + 1).toString());

    let from: Date;
    let to: Date;

    if (period === "month") {
      from = new Date(year, month - 1, 1);
      to = new Date(year, month, 0, 23, 59, 59, 999);
    } else if (period === "quarter") {
      const qStartMonth = (quarter - 1) * 3;
      from = new Date(year, qStartMonth, 1);
      to = new Date(year, qStartMonth + 3, 0, 23, 59, 59, 999);
    } else {
      from = new Date(year, 0, 1);
      to = new Date(year, 11, 31, 23, 59, 59, 999);
    }

    // Revenue: paid invoices in period
    const paidInvoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
        type: "invoice",
        status: "paid",
        paidAt: { gte: from, lte: to },
      },
      select: { total: true, taxAmount: true, paidAt: true },
    });

    const revenue = paidInvoices.reduce((sum, i) => sum + i.total, 0);
    const taxCollected = paidInvoices.reduce((sum, i) => sum + i.taxAmount, 0);
    const revenueBeforeTax = revenue - taxCollected;

    // Expenses in period
    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
        date: { gte: from, lte: to },
      },
      select: { amount: true, category: true, taxDeductible: true, date: true },
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const deductibleExpenses = expenses
      .filter((e) => e.taxDeductible)
      .reduce((sum, e) => sum + e.amount, 0);

    // Expense breakdown by category
    const expenseByCategory: Record<string, number> = {};
    for (const e of expenses) {
      expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
    }

    // Mileage deductions in period
    const mileageEntries = await prisma.mileageEntry.findMany({
      where: {
        userId: user.id,
        date: { gte: from, lte: to },
      },
      select: { distance: true, ratePerKm: true, date: true },
    });

    const totalKm = mileageEntries.reduce((sum, m) => sum + m.distance, 0);
    const mileageDeduction = mileageEntries.reduce((sum, m) => sum + m.distance * m.ratePerKm, 0);

    // Outstanding invoices
    const outstanding = await prisma.invoice.findMany({
      where: {
        userId: user.id,
        type: "invoice",
        status: { in: ["sent", "viewed", "overdue"] },
        createdAt: { gte: from, lte: to },
      },
      select: { total: true },
    });

    const totalOutstanding = outstanding.reduce((sum, i) => sum + i.total, 0);

    // Monthly breakdown for the period
    const monthlyData: Array<{
      month: string;
      revenue: number;
      expenses: number;
      mileageDeduction: number;
      netProfit: number;
    }> = [];

    const months = period === "month" ? 1 : period === "quarter" ? 3 : 12;
    const startMonth = period === "month" ? month - 1 : period === "quarter" ? (quarter - 1) * 3 : 0;

    for (let i = 0; i < months; i++) {
      const mStart = new Date(year, startMonth + i, 1);
      const mEnd = new Date(year, startMonth + i + 1, 0, 23, 59, 59, 999);
      const mLabel = mStart.toLocaleDateString("en-IE", { month: "short", year: "numeric" });

      const mRevenue = paidInvoices
        .filter((inv) => inv.paidAt && inv.paidAt >= mStart && inv.paidAt <= mEnd)
        .reduce((sum, inv) => sum + inv.total, 0);

      const mExpenses = expenses
        .filter((e) => e.date >= mStart && e.date <= mEnd)
        .reduce((sum, e) => sum + e.amount, 0);

      const mMileage = mileageEntries
        .filter((m) => m.date >= mStart && m.date <= mEnd)
        .reduce((sum, m) => sum + m.distance * m.ratePerKm, 0);

      monthlyData.push({
        month: mLabel,
        revenue: mRevenue,
        expenses: mExpenses,
        mileageDeduction: mMileage,
        netProfit: mRevenue - mExpenses,
      });
    }

    const totalDeductions = deductibleExpenses + mileageDeduction;
    const netProfit = revenue - totalExpenses;
    const taxableProfit = revenueBeforeTax - totalDeductions;

    return NextResponse.json({
      period: { type: period, year, month, quarter, from: from.toISOString(), to: to.toISOString() },
      revenue,
      revenueBeforeTax,
      taxCollected,
      invoicesPaid: paidInvoices.length,
      totalExpenses,
      deductibleExpenses,
      expenseByCategory,
      totalKm,
      mileageDeduction,
      totalDeductions,
      netProfit,
      taxableProfit,
      totalOutstanding,
      monthlyData,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Reports error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
