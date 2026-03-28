import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/terms", "/privacy", "/contact", "/dpa"],
        disallow: ["/dashboard", "/invoices", "/clients", "/expenses", "/time-tracking", "/reports", "/services", "/settings", "/api/", "/auth/"],
      },
    ],
    sitemap: "https://tradeinvoice.app/sitemap.xml",
  };
}
