import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
