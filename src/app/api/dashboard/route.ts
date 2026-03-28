import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireUser();

    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const hour = now.getHours();
    const greeting =
      hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const actualInvoices = invoices.filter((i) => i.type !== "quote");
    const quotes = invoices.filter((i) => i.type === "quote");

    const totalOutstanding = actualInvoices
      .filter((i) => ["sent", "viewed", "overdue"].includes(i.status))
      .reduce((sum, i) => sum + i.total, 0);

    const paidThisMonth = actualInvoices
      .filter(
        (i) => i.status === "paid" && i.paidAt && new Date(i.paidAt) >= monthStart
      )
      .reduce((sum, i) => sum + i.total, 0);

    const overdueCount = actualInvoices.filter(
      (i) => i.status === "overdue"
    ).length;

    const paidInvoicesWithDates = actualInvoices.filter(
      (i) => i.status === "paid" && i.paidAt && i.sentAt
    );
    const avgDaysToPayment =
      paidInvoicesWithDates.length > 0
        ? Math.round(
            paidInvoicesWithDates.reduce((sum, i) => {
              const sent = new Date(i.sentAt!).getTime();
              const paid = new Date(i.paidAt!).getTime();
              return sum + (paid - sent) / (1000 * 60 * 60 * 24);
            }, 0) / paidInvoicesWithDates.length
          )
        : null;

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const revenueLastMonth = actualInvoices
      .filter(
        (i) =>
          i.status === "paid" &&
          i.paidAt &&
          new Date(i.paidAt) >= lastMonthStart &&
          new Date(i.paidAt) <= lastMonthEnd
      )
      .reduce((sum, i) => sum + i.total, 0);

    const revenueChange =
      revenueLastMonth > 0
        ? ((paidThisMonth - revenueLastMonth) / revenueLastMonth) * 100
        : paidThisMonth > 0
          ? 100
          : 0;

    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const activeClientIds = new Set(
      actualInvoices
        .filter(
          (i) => i.status !== "draft" && new Date(i.createdAt) >= ninetyDaysAgo
        )
        .map((i) => i.clientId)
    );
    const activeClientsCount = activeClientIds.size;

    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentlyViewedCount = actualInvoices.filter(
      (i) => i.viewedAt && new Date(i.viewedAt) >= twentyFourHoursAgo
    ).length;

    // Status counts for donut chart
    const statusCounts: Record<string, number> = { draft: 0, sent: 0, viewed: 0, paid: 0, overdue: 0 };
    for (const inv of actualInvoices) {
      if (statusCounts[inv.status] !== undefined) statusCounts[inv.status]++;
    }

    // Revenue breakdown for donut chart (this month only)
    const paidThisMonthTotal = actualInvoices
      .filter((i) => i.status === "paid" && i.paidAt && new Date(i.paidAt) >= monthStart)
      .reduce((sum, i) => sum + i.total, 0);
    const overdueTotal = actualInvoices
      .filter((i) => i.status === "overdue" && new Date(i.createdAt) >= monthStart)
      .reduce((sum, i) => sum + i.total, 0);
    const outstandingNonOverdue = actualInvoices
      .filter((i) => ["sent", "viewed"].includes(i.status) && new Date(i.createdAt) >= monthStart)
      .reduce((sum, i) => sum + i.total, 0);

    // Collection rate (count-based: paid / total sent+viewed+paid+overdue)
    const collectionEligible = actualInvoices.filter((i) =>
      ["sent", "viewed", "paid", "overdue"].includes(i.status)
    );
    const totalInvoiced = collectionEligible.reduce((sum, i) => sum + i.total, 0);
    const totalCollected = actualInvoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.total, 0);
    const collectionRate = totalInvoiced > 0
      ? Math.round((totalCollected / totalInvoiced) * 100)
      : 0;

    const recentInvoices = actualInvoices.slice(0, 10).map((i) => ({
      id: i.id,
      invoiceNumber: i.invoiceNumber,
      status: i.status,
      type: i.type,
      total: i.total,
      currency: i.currency,
      dueDate: i.dueDate.toISOString(),
      isRecurring: i.isRecurring,
      paidAmount: i.paidAmount,
      clientName: i.client.name,
      viewedAt: i.viewedAt?.toISOString() ?? null,
    }));

    const recentQuotes = quotes.slice(0, 10).map((q) => ({
      id: q.id,
      invoiceNumber: q.invoiceNumber,
      status: q.status,
      type: q.type,
      total: q.total,
      currency: q.currency,
      createdAt: q.createdAt.toISOString(),
      clientName: q.client.name,
    }));

    // Determine primary currency (most-used across invoices)
    const currencyCounts: Record<string, number> = {};
    for (const inv of actualInvoices) {
      currencyCounts[inv.currency] = (currencyCounts[inv.currency] || 0) + 1;
    }
    const primaryCurrency = Object.entries(currencyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "EUR";

    return NextResponse.json({
      user: {
        name: user.name,
        plan: user.plan,
        invoiceCount: user.invoiceCount,
        businessName: user.businessName,
      },
      greeting,
      primaryCurrency,
      stats: {
        totalOutstanding,
        paidThisMonth,
        overdueCount,
        avgDaysToPayment,
        revenueLastMonth,
        revenueChange,
        activeClientsCount,
        recentlyViewedCount,
      },
      recentInvoices,
      recentQuotes,
      charts: {
        statusCounts,
        revenueBreakdown: {
          paid: paidThisMonthTotal,
          outstanding: outstandingNonOverdue,
          overdue: overdueTotal,
        },
        collectionRate,
        totalCollected,
        totalInvoiced,
      },
      totalInvoiceCount: invoices.length,
      hasBusinessName: !!user.businessName,
      hasSentInvoice: invoices.some((i) => i.sentAt !== null),
      isNewUser: invoices.length === 0 && !user.businessName,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
