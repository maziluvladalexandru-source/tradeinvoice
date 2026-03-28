export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

export function sanitizeString(str: string, maxLength: number): string {
  return stripHtml(str).trim().slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const VALID_CURRENCIES = ["EUR", "GBP", "USD", "PLN"] as const;

export const VALID_INVOICE_STATUSES = ["draft", "sent", "viewed", "paid", "overdue"] as const;

export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** @deprecated Use getNextInvoiceNumber(userId) for sequential INV-XXXX format */
export function generateInvoiceNumber(): string {
  // Fallback only – prefer getNextInvoiceNumber() which queries the DB
  return `INV-${String(Date.now()).slice(-4)}`;
}

export async function getNextInvoiceNumber(userId: string): Promise<string> {
  // Dynamic import to avoid circular deps in non-server contexts
  const { prisma } = await import("@/lib/prisma");
  const lastInvoice = await prisma.invoice.findFirst({
    where: { userId, invoiceNumber: { startsWith: "INV-" } },
    orderBy: { invoiceNumber: "desc" },
    select: { invoiceNumber: true },
  });
  let nextNum = 1;
  if (lastInvoice) {
    const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
    if (match) nextNum = parseInt(match[1], 10) + 1;
  }
  return `INV-${String(nextNum).padStart(4, "0")}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "sent":
      return "bg-blue-100 text-blue-800";
    case "viewed":
      return "bg-yellow-100 text-yellow-800";
    case "paid":
      return "bg-green-100 text-green-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function appUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}${path}`;
}
