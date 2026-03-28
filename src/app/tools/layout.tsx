import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Invoice Tools - BTW Calculator, Invoice Number Generator | TradeInvoice",
  description:
    "Free online BTW/VAT calculator for Netherlands, UK, Germany & Belgium. Invoice number generator and payment due date calculator. No sign-up required.",
  keywords: [
    "btw calculator",
    "vat calculator",
    "vat calculator Netherlands",
    "btw berekenen",
    "invoice number generator",
    "factuurnummer generator",
    "payment terms calculator",
    "betaaltermijn berekenen",
    "free invoice tools",
  ],
  openGraph: {
    title: "Free Invoice Tools - BTW Calculator, Invoice Number Generator | TradeInvoice",
    description:
      "Free online BTW/VAT calculator, invoice number generator, and payment due date calculator. No sign-up required.",
    url: "https://tradeinvoice.app/tools",
    siteName: "TradeInvoice",
    type: "website",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
