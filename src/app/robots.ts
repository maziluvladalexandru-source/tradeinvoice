import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/about", "/terms", "/privacy", "/contact", "/dpa", "/invoice-template", "/templates", "/nl", "/de"],
        disallow: ["/dashboard", "/invoices", "/clients", "/expenses", "/time-tracking", "/reports", "/services", "/settings", "/api/", "/auth/", "/portal/"],
      },
    ],
    sitemap: "https://tradeinvoice.app/sitemap.xml",
  };
}
