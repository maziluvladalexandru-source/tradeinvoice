import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeString(str: string, maxLength: number = 500): string {
  return str.replace(/[<>]/g, "").trim().slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatCurrency(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export async function getNextInvoiceNumber(prefix: string = "INV"): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 9000) + 1000);
  return `${prefix}-${year}${month}-${random}`;
}

export const VALID_CURRENCIES = ["EUR", "GBP", "USD", "RON", "PLN", "CHF"] as const;

export const VALID_INVOICE_STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"] as const;

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatDate(date: Date | string, locale: string = "en-GB"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://tradeinvoice.app";

export function appUrl(path: string = ""): string {
  return `${BASE_URL}${path}`;
}
