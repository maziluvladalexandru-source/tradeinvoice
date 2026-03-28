import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TradeInvoice - Rechnungssoftware fur Handwerker | Kostenlos Starten",
  description:
    "Professionelle Rechnungen in 60 Sekunden erstellen. Automatische Zahlungserinnerungen. Speziell fur Handwerker und Freiberufler. Kostenlos starten.",
  keywords: [
    "Rechnungssoftware",
    "Rechnung erstellen",
    "kostenlos Rechnung",
    "Zahlungserinnerung",
    "Handwerker Rechnung",
    "Freiberufler Rechnung",
    "Rechnungsprogramm",
    "Online Rechnung",
    "Rechnungsvorlage",
    "MwSt Rechnung",
  ],
  openGraph: {
    title: "TradeInvoice - Rechnungssoftware fur Handwerker",
    description:
      "Professionelle Rechnungen in 60 Sekunden erstellen. Automatische Zahlungserinnerungen. Speziell fur Handwerker und Freiberufler.",
    url: "https://tradeinvoice.app/de",
    siteName: "TradeInvoice",
    type: "website",
    locale: "de_DE",
  },
  alternates: {
    canonical: "https://tradeinvoice.app/de",
    languages: {
      en: "https://tradeinvoice.app",
      nl: "https://tradeinvoice.app/nl",
      de: "https://tradeinvoice.app/de",
    },
  },
};

export default function DELayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
