import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - TradeInvoice",
  description:
    "Get in touch with TradeInvoice. Questions about invoicing, your account, or features? We respond within 24 hours on business days.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
