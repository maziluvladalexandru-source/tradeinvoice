import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TradeInvoice - Factuur Software voor ZZP en MKB | Gratis Beginnen",
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
