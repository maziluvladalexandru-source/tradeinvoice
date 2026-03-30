import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Invoicing Built by a Tradesperson | TradeInvoice",
  description:
    "TradeInvoice was built by Vlad Mazilu Alexandru, an expat tradesperson in the Netherlands who needed simple, affordable invoicing. Learn our story and mission.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About TradeInvoice",
    description:
      "Built by a tradesperson, for tradespeople. Learn why TradeInvoice exists and who is behind it.",
    url: "https://tradeinvoice.app/about",
    type: "website",
    siteName: "TradeInvoice",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "About TradeInvoice",
    description:
      "Built by a tradesperson, for tradespeople. Learn why TradeInvoice exists and who is behind it.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
