import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Factuur Software voor ZZP en MKB | TradeInvoice",
  description:
    "Maak professionele facturen in 60 seconden. Automatische betalingsherinneringen. Speciaal gebouwd voor vakmensen in Nederland. Gratis beginnen.",
  keywords: [
    "factuur software",
    "facturatie ZZP",
    "factuur maken",
    "gratis factureren",
    "betalingsherinnering",
    "factuur programma",
    "MKB facturatie",
    "BTW factuur",
    "factuur template",
    "online factureren",
  ],
  openGraph: {
    title: "TradeInvoice - Factuur Software voor ZZP en MKB",
    description:
      "Maak professionele facturen in 60 seconden. Automatische betalingsherinneringen. Speciaal gebouwd voor vakmensen in Nederland.",
    url: "https://tradeinvoice.app/nl",
    siteName: "TradeInvoice",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeInvoice - Factuur Software voor ZZP en MKB",
    description:
      "Maak professionele facturen in 60 seconden. Automatische betalingsherinneringen. Speciaal gebouwd voor vakmensen in Nederland.",
  },
  alternates: {
    canonical: "https://tradeinvoice.app/nl",
    languages: {
      en: "https://tradeinvoice.app",
      nl: "https://tradeinvoice.app/nl",
      de: "https://tradeinvoice.app/de",
      "x-default": "https://tradeinvoice.app",
    },
  },
};

export default function NLLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
