import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free BTW Calculator & Invoice Tools | TradeInvoice",
  description:
    "Free online BTW/VAT calculator for Netherlands, UK, Germany & Belgium. Invoice number generator and payment due date calculator. No sign-up required.",
  alternates: {
    canonical: "/tools",
  },
  robots: {
    index: true,
    follow: true,
  },
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
    title: "Free BTW Calculator & Invoice Tools | TradeInvoice",
    description:
      "Free online BTW/VAT calculator, invoice number generator, and payment due date calculator. No sign-up required.",
    url: "https://tradeinvoice.app/tools",
    siteName: "TradeInvoice",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free BTW Calculator & Invoice Tools | TradeInvoice",
    description:
      "Free online BTW/VAT calculator, invoice number generator, and payment due date calculator. No sign-up required.",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
