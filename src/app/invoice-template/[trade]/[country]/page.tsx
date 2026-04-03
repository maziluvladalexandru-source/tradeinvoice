import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  trades,
  getTradeBySlug,
  countries,
  getCountryBySlug,
  TradeData,
  CountryData,
} from "../../trades";

export function generateStaticParams() {
  const params: { trade: string; country: string }[] = [];
  for (const trade of trades) {
    for (const country of countries) {
      params.push({ trade: trade.slug, country: country.slug });
    }
  }
  return params;
}

export function generateMetadata({
  params,
}: {
  params: { trade: string; country: string };
}): Metadata {
  const trade = getTradeBySlug(params.trade);
  const country = getCountryBySlug(params.country);
  if (!trade || !country) return {};

  const title = `${trade.name} Invoice Template ${country.name} - ${country.vatName} Compliant | TradeInvoice`;
  const description = `Free ${trade.name.toLowerCase()} invoice template for the ${country.name}. ${country.vatName}-compliant with ${country.registrationName} requirements. Create professional invoices in 60 seconds.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/invoice-template/${trade.slug}/${country.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: [
      `${trade.name.toLowerCase()} invoice template ${country.name.toLowerCase()}`,
      `${trade.name.toLowerCase()} invoice ${country.name.toLowerCase()}`,
      `${trade.name.toLowerCase()} ${country.vatName.toLowerCase()} invoice`,
      ...trade.keywords,
    ],
    openGraph: {
      title,
      description,
      url: `https://tradeinvoice.app/invoice-template/${trade.slug}/${country.slug}`,
      type: "website",
      siteName: "TradeInvoice",
      locale: country.locale === "nl" ? "nl_NL" : country.locale === "de" ? "de_DE" : "en_GB",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CountryInvoiceMockup({
  trade,
  country,
}: {
  trade: TradeData;
  country: CountryData;
}) {
  const subtotal = trade.sampleLineItems.reduce((sum, item) => {
    const num = parseFloat(
      item.amount.replace("\u20ac", "").replace(".", "").replace(",", ".")
    );
    return sum + num;
  }, 0);
  const vat = subtotal * (country.vatRate / 100);
  const total = subtotal + vat;

  const fmt = (n: number) => `${country.currencySymbol}${n.toFixed(2)}`;

  const companyDetails: Record<string, { name: string; address: string; reg: string; tax: string }> = {
    netherlands: {
      name: `De Vries ${trade.name} Services`,
      address: "Prinsengracht 456, Amsterdam",
      reg: "KVK: 12345678",
      tax: "BTW: NL123456789B01",
    },
    uk: {
      name: `Smith ${trade.name} Services Ltd`,
      address: "12 High Street, London SE1 7PB",
      reg: "Company No: 12345678",
      tax: "VAT: GB123456789",
    },
    germany: {
      name: `M\u00fcller ${trade.name} GmbH`,
      address: "Hauptstra\u00dfe 42, 10115 Berlin",
      reg: "HRB 12345, Amtsgericht Berlin",
      tax: "USt-IdNr: DE123456789",
    },
  };

  const details = companyDetails[country.slug] || companyDetails.netherlands;

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden border border-gray-700/30">
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">INVOICE</div>
            <div className="text-sm text-gray-500 mt-1">#INV-2026-042</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {details.name}
            </div>
            <div className="text-sm text-gray-500">{details.address}</div>
            <div className="text-sm text-gray-500">{details.reg}</div>
            <div className="text-sm text-gray-500">{details.tax}</div>
          </div>
        </div>
      </div>

      <div className="px-8 py-5 border-b border-gray-100">
        <div className="flex justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Bill To
            </div>
            <div className="text-sm font-medium text-gray-900">
              Sample Client Ltd
            </div>
            <div className="text-sm text-gray-500">{details.address}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Date
            </div>
            <div className="text-sm text-gray-900">25 March 2026</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-3 mb-1">
              Due Date
            </div>
            <div className="text-sm text-gray-900">8 April 2026</div>
          </div>
        </div>
      </div>

      <div className="px-8 py-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="text-left pb-3 font-medium">Description</th>
              <th className="text-right pb-3 font-medium">Qty</th>
              <th className="text-right pb-3 font-medium">Rate</th>
              <th className="text-right pb-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {trade.sampleLineItems.map((item, i) => {
              const amount = parseFloat(
                item.amount
                  .replace("\u20ac", "")
                  .replace(".", "")
                  .replace(",", ".")
              );
              const rate = parseFloat(
                item.rate
                  .replace("\u20ac", "")
                  .replace(".", "")
                  .replace(",", ".")
              );
              return (
                <tr
                  key={i}
                  className={
                    i < trade.sampleLineItems.length - 1
                      ? "border-b border-gray-50"
                      : ""
                  }
                >
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-right">{item.qty}</td>
                  <td className="py-3 text-right">
                    {country.currencySymbol}
                    {rate.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-medium">
                    {country.currencySymbol}
                    {amount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-5 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Subtotal</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>
            {country.vatName} ({country.vatRate}%)
          </span>
          <span>{fmt(vat)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-300 pt-3">
          <span>Total</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      <div className="px-8 py-4 border-t border-gray-200 bg-amber-50">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          Payment Details
        </div>
        <div className="text-sm text-gray-700">
          {country.slug === "uk"
            ? "Sort Code: 12-34-56 | Account: 12345678"
            : "IBAN: NL91 ABNA 0417 1643 00"}
        </div>
        <div className="text-sm text-gray-700">Payment term: 30 days</div>
      </div>
    </div>
  );
}

export default function CountryTradeTemplatePage({
  params,
}: {
  params: { trade: string; country: string };
}) {
  const trade = getTradeBySlug(params.trade);
  const country = getCountryBySlug(params.country);
  if (!trade || !country) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Free ${trade.name} Invoice Template for ${country.name}`,
    description: `${trade.name} invoice template compliant with ${country.name} ${country.vatName} requirements.`,
    url: `https://tradeinvoice.app/invoice-template/${trade.slug}/${country.slug}`,
    publisher: {
      "@type": "Organization",
      name: "TradeInvoice",
      url: "https://tradeinvoice.app",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://tradeinvoice.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Templates",
          item: "https://tradeinvoice.app/templates",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${trade.name} Invoice Template`,
          item: `https://tradeinvoice.app/invoice-template/${trade.slug}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: country.name,
          item: `https://tradeinvoice.app/invoice-template/${trade.slug}/${country.slug}`,
        },
      ],
    },
  };

  const otherCountries = countries.filter((c) => c.slug !== country.slug);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-400 tracking-tight">
          TradeInvoice
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="text-gray-400 hover:text-white transition-all duration-200"
          >
            Blog
          </Link>
          <Link
            href="/templates"
            className="text-gray-400 hover:text-white transition-all duration-200"
          >
            Templates
          </Link>
          <Link
            href="/auth/login"
            className="bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-6 py-3 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 py-2" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href="/templates"
              className="hover:text-amber-400 transition-colors"
            >
              Templates
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/invoice-template/${trade.slug}`}
              className="hover:text-amber-400 transition-colors"
            >
              {trade.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-300">{country.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-12 text-center">
        <div className="text-5xl mb-4">{country.flag}</div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 gradient-text bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Free {trade.name} Invoice Template for {country.name}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4">
          {country.vatName}-compliant {trade.name.toLowerCase()} invoice
          template with {country.registrationName} requirements built in. Create
          professional invoices in 60 seconds.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          {otherCountries.map((c) => (
            <Link
              key={c.slug}
              href={`/invoice-template/${trade.slug}/${c.slug}`}
              className="hover:text-amber-400 transition-colors"
            >
              {c.flag} {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Invoice Mockup */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <CountryInvoiceMockup trade={trade} country={country} />
      </section>

      {/* Country-Specific Requirements */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          {trade.name} Invoice Requirements in {country.name}
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Ensure your {trade.name.toLowerCase()} invoices meet all{" "}
          {country.name} legal requirements set by the{" "}
          {country.taxAuthority}.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Legal Requirements */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              {country.flag} Legal Requirements ({country.name})
            </h3>
            <ul className="space-y-3">
              {country.legalRequirements.map((req, i) => (
                <li key={i} className="flex gap-3">
                  <CheckIcon />
                  <span className="text-gray-300">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* VAT & Tax Info */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              {country.vatName} & Tax Information
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-white font-medium mb-1">
                  {country.vatName} Rate
                </div>
                <div className="text-gray-400 text-sm">
                  Standard rate: {country.vatRate}%
                </div>
              </div>
              <div>
                <div className="text-white font-medium mb-1">Currency</div>
                <div className="text-gray-400 text-sm">
                  {country.currency} ({country.currencySymbol})
                </div>
              </div>
              <div>
                <div className="text-white font-medium mb-1">
                  Registration Body
                </div>
                <div className="text-gray-400 text-sm">
                  {country.registrationBody}
                </div>
              </div>
              <div>
                <div className="text-white font-medium mb-1">
                  Tax Authority
                </div>
                <a
                  href={country.taxAuthorityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                >
                  {country.taxAuthority} (official website) &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              Payment Terms & Late Payment
            </h3>
            <p className="text-gray-300 text-sm">{country.paymentTerms}</p>
          </div>

          {/* Common Services */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              Common {trade.name} Line Items
            </h3>
            <ul className="space-y-3">
              {trade.commonServices.slice(0, 6).map((service, i) => (
                <li key={i} className="flex gap-3">
                  <CheckIcon />
                  <span className="text-gray-300">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Guide */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {trade.name} Pricing in {country.name}
        </h2>
        <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-white font-medium mb-1">Hourly Rate</div>
              <div className="text-gray-400 text-sm">
                {trade.pricingAdvice.hourlyRange.replace(
                  /\u20ac/g,
                  country.currencySymbol
                )}
              </div>
            </div>
            <div>
              <div className="text-white font-medium mb-1">Per-Job Pricing</div>
              <div className="text-gray-400 text-sm">
                {trade.pricingAdvice.perJobTips.replace(
                  /\u20ac/g,
                  country.currencySymbol
                )}
              </div>
            </div>
            <div>
              <div className="text-white font-medium mb-1">Materials Markup</div>
              <div className="text-gray-400 text-sm">
                {trade.pricingAdvice.materialsMarkup}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-3xl p-10 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Create Your Free {trade.name} Invoice for {country.name}
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            {country.vatName}-compliant invoices with automatic tax calculations.
            Built for {trade.namePlural.toLowerCase()} operating in{" "}
            {country.name}. Free plan available.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-10 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02]"
          >
            Create Your Free Invoice
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Free plan available. No credit card required.
          </p>
        </div>
      </section>

      {/* Other Countries */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {trade.name} Invoice Templates for Other Countries
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {otherCountries.map((c) => (
            <Link
              key={c.slug}
              href={`/invoice-template/${trade.slug}/${c.slug}`}
              className="bg-[#111827] border border-gray-700/50 rounded-xl p-4 hover:border-amber-500/50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">{c.flag}</div>
              <div className="text-white font-medium text-sm">{c.name}</div>
              <div className="text-gray-500 text-xs mt-1">
                {c.vatName} {c.vatRate}%
              </div>
            </Link>
          ))}
          <Link
            href={`/invoice-template/${trade.slug}`}
            className="bg-[#111827] border border-gray-700/50 rounded-xl p-4 hover:border-amber-500/50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">&#127760;</div>
            <div className="text-white font-medium text-sm">General</div>
            <div className="text-gray-500 text-xs mt-1">All countries</div>
          </Link>
        </div>
      </section>

      {/* More Trade Templates */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          More Invoice Templates for {country.name}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {trades
            .filter((t) => t.slug !== trade.slug)
            .slice(0, 6)
            .map((t) => (
              <Link
                key={t.slug}
                href={`/invoice-template/${t.slug}/${country.slug}`}
                className="bg-[#111827] border border-gray-700/50 rounded-xl p-4 hover:border-amber-500/50 transition-colors text-center"
              >
                <div className="text-white font-medium text-sm">
                  {t.namePlural}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {country.flag} {country.name}
                </div>
              </Link>
            ))}
        </div>
        <div className="text-center mt-6">
          <Link
            href="/templates"
            className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
          >
            View all templates &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center mb-4">
          <Link
            href="/blog"
            className="text-gray-500 hover:text-gray-300 transition-all duration-200"
          >
            Blog
          </Link>
          <Link
            href="/templates"
            className="text-gray-500 hover:text-gray-300 transition-all duration-200"
          >
            Templates
          </Link>
          <Link
            href="/terms"
            className="text-gray-500 hover:text-gray-300 transition-all duration-200"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-gray-500 hover:text-gray-300 transition-all duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="text-gray-500 hover:text-gray-300 transition-all duration-200"
          >
            Contact
          </Link>
        </div>
        &copy; {new Date().getFullYear()} TradeInvoice. Operated by Vlad Mazilu
        Alexandru, Netherlands.
      </footer>
    </div>
  );
}
