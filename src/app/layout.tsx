import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import { ToastProvider } from "@/components/Toast";
import { TimerProvider } from "@/components/TimerContext";
import GlobalTimerBar from "@/components/GlobalTimerBar";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://tradeinvoice.app"),
  title: "TradeInvoice - Simple Invoicing for Tradespeople",
  description:
    "Create professional invoices in 60 seconds. Auto payment reminders. No per-user fees. Built for plumbers, electricians, builders and contractors.",
  keywords: [
    "invoice software",
    "invoicing for tradespeople",
    "plumber invoicing",
    "electrician invoicing",
    "builder invoicing",
    "contractor invoicing",
    "trade invoice",
    "simple invoicing",
    "payment reminders",
    "Netherlands invoicing",
    "ZZP invoicing",
  ],
  authors: [{ name: "TradeInvoice" }],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      nl: "/nl",
      de: "/de",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "TradeInvoice - Simple Invoicing for Tradespeople",
    description:
      "Create professional invoices in 60 seconds. Auto payment reminders. No per-user fees. Built for plumbers, electricians, builders and contractors.",
    type: "website",
    locale: "en_US",
    siteName: "TradeInvoice",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeInvoice - Simple Invoicing for Tradespeople",
    description:
      "Create professional invoices in 60 seconds. Auto payment reminders. No per-user fees. Built for plumbers, electricians, builders and contractors.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} className={cn("dark font-sans", inter.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "TradeInvoice",
              url: "https://tradeinvoice.app",
              description:
                "Simple invoicing for tradespeople in the Netherlands, UK, Germany and Belgium",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "TradeInvoice",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-[#0a0f1e]`}>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <TimerProvider>
              <GlobalTimerBar />
              {children}
            </TimerProvider>
            <CookieBanner />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
