import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trades, getTradeBySlug, countries, TradeData } from "../trades";
import { articles } from "../../blog/articles";

export function generateStaticParams() {
  return trades.map((trade) => ({ trade: trade.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { trade: string };
}): Metadata {
  const trade = getTradeBySlug(params.trade);
  if (!trade) return {};

  const isZzp = trade.slug === "zzp";
  const title = isZzp
    ? "Gratis Factuur Template voor ZZP'ers | TradeInvoice"
    : `Free ${trade.name} Invoice Template | TradeInvoice`;
  const description = isZzp
    ? `Professioneel factuur template voor ZZP'ers. Maak, verstuur en volg facturen in 60 seconden. Inclusief KVK, BTW-id en IBAN.`
    : `Professional invoice template for ${trade.namePlural.toLowerCase()}. Create, send, and track invoices in 60 seconds. Includes ${trade.commonServices.slice(0, 3).join(", ").toLowerCase()}.`;

  return {
    title,
    description,
    alternates: { canonical: `/invoice-template/${trade.slug}` },
    keywords: trade.keywords,
    openGraph: {
      title,
      description,
      url: `https://tradeinvoice.app/invoice-template/${trade.slug}`,
      type: "website",
      siteName: "TradeInvoice",
      locale: isZzp ? "nl_NL" : "en_US",
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

function InvoiceMockup({ trade }: { trade: TradeData }) {
  const isZzp = trade.slug === "zzp";
  const subtotal = trade.sampleLineItems.reduce((sum, item) => {
    const num = parseFloat(
      item.amount.replace("\u20ac", "").replace(".", "").replace(",", ".")
    );
    return sum + num;
  }, 0);
  const btw = subtotal * 0.21;
  const total = subtotal + btw;

  const fmt = (n: number) =>
    isZzp
      ? `\u20ac${n.toFixed(2).replace(".", ",")}`
      : `\u20ac${n.toFixed(2)}`;

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden border border-gray-700/30">
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {isZzp ? "FACTUUR" : "INVOICE"}
            </div>
            <div className="text-sm text-gray-500 mt-1">#INV-2026-042</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {isZzp ? "Jansen Consultancy" : `De Vries ${trade.name} Services`}
            </div>
            <div className="text-sm text-gray-500">
              {isZzp
                ? "Keizersgracht 123, Amsterdam"
                : "Prinsengracht 456, Amsterdam"}
            </div>
            <div className="text-sm text-gray-500">KVK: 12345678</div>
            <div className="text-sm text-gray-500">BTW: NL123456789B01</div>
          </div>
        </div>
      </div>

      <div className="px-8 py-5 border-b border-gray-100">
        <div className="flex justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              {isZzp ? "Factuur aan" : "Bill To"}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {isZzp ? "Bakker B.V." : "Maria van den Berg"}
            </div>
            <div className="text-sm text-gray-500">
              Herengracht 789, Amsterdam
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              {isZzp ? "Datum" : "Date"}
            </div>
            <div className="text-sm text-gray-900">
              {isZzp ? "25 maart 2026" : "25 March 2026"}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-3 mb-1">
              {isZzp ? "Vervaldatum" : "Due Date"}
            </div>
            <div className="text-sm text-gray-900">
              {isZzp ? "8 april 2026" : "8 April 2026"}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="text-left pb-3 font-medium">
                {isZzp ? "Omschrijving" : "Description"}
              </th>
              <th className="text-right pb-3 font-medium">
                {isZzp ? "Aantal" : "Qty"}
              </th>
              <th className="text-right pb-3 font-medium">
                {isZzp ? "Tarief" : "Rate"}
              </th>
              <th className="text-right pb-3 font-medium">
                {isZzp ? "Bedrag" : "Amount"}
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {trade.sampleLineItems.map((item, i) => (
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
                <td className="py-3 text-right">{item.rate}</td>
                <td className="py-3 text-right font-medium">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-5 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{isZzp ? "Subtotaal" : "Subtotal"}</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>BTW / VAT (21%)</span>
          <span>{fmt(btw)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-300 pt-3">
          <span>{isZzp ? "Totaal" : "Total"}</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      <div className="px-8 py-4 border-t border-gray-200 bg-amber-50">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          {isZzp ? "Betaalgegevens" : "Payment Details"}
        </div>
        <div className="text-sm text-gray-700">
          IBAN: NL91 ABNA 0417 1643 00
        </div>
        <div className="text-sm text-gray-700">
          {isZzp ? "Betaaltermijn: 14 dagen" : "Payment term: 14 days"}
        </div>
      </div>
    </div>
  );
}

function RelatedTrades({ currentSlug }: { currentSlug: string }) {
  const otherTrades = trades.filter((t) => t.slug !== currentSlug).slice(0, 6);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {otherTrades.map((t) => (
        <Link
          key={t.slug}
          href={`/invoice-template/${t.slug}`}
          className="bg-[#111827] border border-gray-700/50 rounded-xl p-4 hover:border-amber-500/50 transition-colors text-center"
        >
          <div className="text-white font-medium text-sm">{t.namePlural}</div>
        </Link>
      ))}
    </div>
  );
}

export default function TradeTemplatePage({
  params,
}: {
  params: { trade: string };
}) {
  const trade = getTradeBySlug(params.trade);
  if (!trade) notFound();

  const isZzp = trade.slug === "zzp";

  const relatedArticles = trade.relatedBlogSlugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: isZzp
      ? `Gratis Factuur Template voor ZZP'ers`
      : `Free Invoice Template for ${trade.namePlural}`,
    description: trade.description,
    url: `https://tradeinvoice.app/invoice-template/${trade.slug}`,
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
          name: isZzp
            ? "ZZP Factuur Template"
            : `${trade.name} Invoice Template`,
          item: `https://tradeinvoice.app/invoice-template/${trade.slug}`,
        },
      ],
    },
  };

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
          <li className="text-gray-300">
            {isZzp ? "ZZP" : trade.name}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 gradient-text bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
          {isZzp
            ? "Gratis Factuur Template voor ZZP'ers"
            : `Free Invoice Template for ${trade.namePlural}`}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          {isZzp
            ? "Maak professionele ZZP-facturen in 60 seconden. Geen registratie nodig om een voorbeeld te bekijken."
            : `Create professional ${trade.namePlural.toLowerCase()} invoices in 60 seconds. No sign-up required to preview.`}
        </p>
      </section>

      {/* Invoice Mockup */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <InvoiceMockup trade={trade} />
      </section>

      {/* Country Variants */}
      {!isZzp && (
        <section className="max-w-4xl mx-auto px-4 pb-12 text-center">
          <p className="text-gray-400 text-sm">
            Available for:{" "}
            {countries.map((c, i) => (
              <span key={c.slug}>
                {i > 0 && " | "}
                <Link
                  href={`/invoice-template/${trade.slug}/${c.slug}`}
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {c.flag} {c.name}
                </Link>
              </span>
            ))}
          </p>
        </section>
      )}

      {/* What to Include */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          {isZzp
            ? "Wat hoort er op een ZZP-factuur?"
            : `What to Include on a ${trade.name} Invoice`}
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          {isZzp
            ? "Zorg dat je factuur voldoet aan alle wettelijke eisen en dat je klant precies weet waarvoor wordt betaald."
            : `Make sure your ${trade.namePlural.toLowerCase()} invoice is complete, professional, and gets you paid faster.`}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Common Line Items */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              {isZzp ? "Veelvoorkomende diensten" : "Common Line Items"}
            </h3>
            <ul className="space-y-3">
              {trade.commonServices.map((service, i) => (
                <li key={i} className="flex gap-3">
                  <CheckIcon />
                  <span className="text-gray-300">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Advice */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              {isZzp ? "Prijzen en tarieven" : "Pricing Guide"}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-white font-medium mb-1">
                  {isZzp ? "Uurtarief" : "Hourly Rate"}
                </div>
                <div className="text-gray-400 text-sm">
                  {trade.pricingAdvice.hourlyRange}
                </div>
              </div>
              <div>
                <div className="text-white font-medium mb-1">
                  {isZzp ? "Projectprijzen" : "Per-Job Pricing"}
                </div>
                <div className="text-gray-400 text-sm">
                  {trade.pricingAdvice.perJobTips}
                </div>
              </div>
              <div>
                <div className="text-white font-medium mb-1">
                  {isZzp ? "Materialen doorberekenen" : "Materials Markup"}
                </div>
                <div className="text-gray-400 text-sm">
                  {trade.pricingAdvice.materialsMarkup}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              {isZzp
                ? "Certificeringen om te vermelden"
                : "Certifications to Reference"}
            </h3>
            <ul className="space-y-3">
              {trade.certifications.map((cert, i) => (
                <li key={i} className="flex gap-3">
                  <CheckIcon />
                  <span className="text-gray-300">{cert}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-500 text-sm mt-4">
              {isZzp
                ? "Het vermelden van certificeringen op je factuur vergroot het vertrouwen en professionaliteit."
                : "Including certifications on your invoice builds trust and demonstrates professionalism to clients."}
            </p>
          </div>

          {/* Legal Requirements */}
          <div className="bg-[#111827] border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              {isZzp ? "Wettelijke vereisten" : "Legal Requirements (NL)"}
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">KVK-nummer</strong> -{" "}
                  {isZzp
                    ? "Je 8-cijferig KvK-nummer"
                    : "Your 8-digit Chamber of Commerce number"}
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">BTW-id</strong> -{" "}
                  {isZzp
                    ? "Je BTW-identificatienummer"
                    : "Your VAT identification number"}
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">IBAN</strong> -{" "}
                  {isZzp
                    ? "Je bankrekeningnummer voor betalingen"
                    : "Your bank account for receiving payments"}
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span className="text-gray-300">
                  <strong className="text-white">
                    {isZzp ? "Factuurnummer" : "Sequential invoice number"}
                  </strong>{" "}
                  -{" "}
                  {isZzp
                    ? "Uniek en opeenvolgend"
                    : "Unique and in order"}
                </span>
              </li>
            </ul>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/blog/kvk-invoice-requirements-dutch-freelancers"
                className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
              >
                {isZzp
                  ? "Lees meer over KVK-vereisten \u2192"
                  : "Read more about KVK requirements \u2192"}
              </Link>
              <Link
                href="/blog/btw-vat-rules-self-employed-netherlands-2026"
                className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
              >
                {isZzp
                  ? "BTW-regels voor ZZP'ers \u2192"
                  : "BTW/VAT rules for self-employed \u2192"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-3xl p-10 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isZzp
              ? "Maak nu je gratis ZZP-factuur"
              : `Create Your Free ${trade.name} Invoice Now`}
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            {isZzp
              ? "Stop met Word-documenten en spreadsheets. TradeInvoice maakt compliant, professionele facturen in 60 seconden met automatische BTW-berekeningen en betalingsherinneringen."
              : `Stop wasting time with Word documents and spreadsheets. TradeInvoice lets you create compliant, professional ${trade.namePlural.toLowerCase()} invoices in 60 seconds with automatic BTW calculations and payment reminders.`}
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-10 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02]"
          >
            {isZzp
              ? "Maak je gratis factuur"
              : `Create Your Free ${trade.name} Invoice`}
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            {isZzp
              ? "Gratis plan beschikbaar. Geen creditcard vereist."
              : "Free plan available. No credit card required."}
          </p>
        </div>
      </section>

      {/* Related Blog Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isZzp ? "Gerelateerde artikelen" : "Related Articles"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedArticles.map((article) =>
              article ? (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="bg-[#111827] border border-gray-700/50 rounded-xl p-5 hover:border-amber-500/50 transition-colors"
                >
                  <div className="text-white font-medium text-sm mb-2">
                    {article.title}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {article.readTime}
                  </div>
                </Link>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* Related Trades */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isZzp
            ? "Meer factuur templates per vakgebied"
            : "More Invoice Templates by Trade"}
        </h2>
        <RelatedTrades currentSlug={trade.slug} />
        <div className="text-center mt-6">
          <Link
            href="/templates"
            className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
          >
            {isZzp
              ? "Bekijk alle templates \u2192"
              : "View all templates \u2192"}
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
