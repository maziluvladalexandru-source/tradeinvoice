import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { articles, getArticleBySlug } from "../articles";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: `${article.title} - TradeInvoice`,
    description: article.metaDescription,
    keywords: [article.keyword, "invoicing", "zzp", "netherlands", "tradeinvoice"],
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `https://tradeinvoice.app/blog/${article.slug}`,
      type: "article",
      publishedTime: article.date,
      siteName: "TradeInvoice",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.metaDescription,
    },
  };
}

function markdownToHtml(content: string): string {
  // Simple markdown-to-HTML for our article content
  const lines = content.trim().split("\n");
  const htmlLines: string[] = [];
  let inTable = false;
  let inTableBody = false;
  let tableHeaderDone = false;
  let inList = false;
  let inBlockquote = false;
  let blockquoteLines: string[] = [];

  function processInline(text: string): string {
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // Links - external links get rel="noopener" and target="_blank"
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_match: string, linkText: string, url: string) => {
        const isExternal = url.startsWith("http://") || url.startsWith("https://");
        if (isExternal) {
          return `<a href="${url}" class="text-amber-400 underline hover:text-amber-300 transition-colors" target="_blank" rel="noopener">${linkText}</a>`;
        }
        return `<a href="${url}" class="text-amber-400 underline hover:text-amber-300 transition-colors">${linkText}</a>`;
      }
    );
    return text;
  }

  function flushBlockquote() {
    if (blockquoteLines.length > 0) {
      htmlLines.push(
        '<blockquote class="border-l-4 border-amber-500/40 pl-4 my-6 text-gray-300 space-y-2">'
      );
      for (const bl of blockquoteLines) {
        const processed = processInline(bl);
        if (processed.trim() === "") {
          htmlLines.push("<br/>");
        } else {
          htmlLines.push(`<p>${processed}</p>`);
        }
      }
      htmlLines.push("</blockquote>");
      blockquoteLines = [];
    }
    inBlockquote = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blockquote
    if (trimmed.startsWith("> ")) {
      if (!inBlockquote) {
        if (inList) { htmlLines.push("</ul>"); inList = false; }
        inBlockquote = true;
      }
      blockquoteLines.push(trimmed.slice(2));
      continue;
    } else if (trimmed === ">" && inBlockquote) {
      blockquoteLines.push("");
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // Table
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (inList) { htmlLines.push("</ul>"); inList = false; }
      if (!inTable) {
        inTable = true;
        tableHeaderDone = false;
        inTableBody = false;
        htmlLines.push(
          '<div class="overflow-x-auto my-6 rounded-xl border border-gray-700/50"><table class="w-full text-sm border-collapse">'
        );
      }
      // Separator row
      if (trimmed.match(/^\|[\s-:|]+\|$/)) {
        tableHeaderDone = true;
        continue;
      }
      const cells = trimmed
        .split("|")
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
        .map((c) => processInline(c.trim()));
      if (!tableHeaderDone) {
        htmlLines.push("<thead><tr>");
        cells.forEach(
          (c) =>
            htmlLines.push(
              `<th class="text-left py-3 px-4 border-b border-gray-700/50 text-gray-300 font-semibold bg-[#111827]/50">${c}</th>`
            )
        );
        htmlLines.push("</tr></thead>");
      } else {
        if (!inTableBody) {
          htmlLines.push("<tbody>");
          inTableBody = true;
        }
        htmlLines.push('<tr class="hover:bg-white/[0.02] transition-colors">');
        cells.forEach(
          (c) =>
            htmlLines.push(
              `<td class="py-3 px-4 border-b border-gray-700/30 text-gray-400">${c}</td>`
            )
        );
        htmlLines.push("</tr>");
      }
      continue;
    } else if (inTable) {
      if (inTableBody) htmlLines.push("</tbody>");
      htmlLines.push("</table></div>");
      inTable = false;
      inTableBody = false;
      tableHeaderDone = false;
    }

    // Empty line
    if (trimmed === "") {
      if (inList) { htmlLines.push("</ul>"); inList = false; }
      continue;
    }

    // Headings
    if (trimmed.startsWith("## ")) {
      if (inList) { htmlLines.push("</ul>"); inList = false; }
      htmlLines.push(
        `<h2 class="text-2xl font-bold mt-10 mb-4 text-white">${processInline(trimmed.slice(3))}</h2>`
      );
      continue;
    }
    if (trimmed.startsWith("### ")) {
      if (inList) { htmlLines.push("</ul>"); inList = false; }
      htmlLines.push(
        `<h3 class="text-xl font-semibold mt-8 mb-3 text-gray-100">${processInline(trimmed.slice(4))}</h3>`
      );
      continue;
    }

    // Checkbox list items
    if (trimmed.startsWith("- [ ] ")) {
      if (!inList) { htmlLines.push('<ul class="space-y-2 my-4">'); inList = true; }
      htmlLines.push(
        `<li class="flex items-start gap-2 text-gray-300"><span class="text-gray-600 mt-0.5">&#9744;</span><span>${processInline(trimmed.slice(6))}</span></li>`
      );
      continue;
    }

    // Unordered list
    if (trimmed.startsWith("- ")) {
      if (!inList) { htmlLines.push('<ul class="space-y-2 my-4 list-disc list-inside">'); inList = true; }
      htmlLines.push(
        `<li class="text-gray-300">${processInline(trimmed.slice(2))}</li>`
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { htmlLines.push('<ol class="space-y-2 my-4 list-decimal list-inside">'); inList = true; }
      htmlLines.push(
        `<li class="text-gray-300">${processInline(trimmed.replace(/^\d+\.\s/, ""))}</li>`
      );
      continue;
    }

    // Paragraph
    if (inList) { htmlLines.push("</ul>"); inList = false; }
    htmlLines.push(
      `<p class="text-gray-300 leading-relaxed my-4">${processInline(trimmed)}</p>`
    );
  }

  if (inBlockquote) flushBlockquote();
  if (inList) htmlLines.push("</ul>");
  if (inTable) {
    if (inTableBody) htmlLines.push("</tbody>");
    htmlLines.push("</table></div>");
  }

  return htmlLines.join("\n");
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Person",
      name: "Vlad Mazilu",
    },
    publisher: {
      "@type": "Organization",
      name: "TradeInvoice",
      url: "https://tradeinvoice.app",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tradeinvoice.app/blog/${article.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://tradeinvoice.app" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://tradeinvoice.app/blog" },
      { "@type": "ListItem", position: 3, name: article.title },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white premium-glow">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 py-16 animate-fade-in">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
            <li aria-hidden="true" className="text-gray-600">&gt;</li>
            <li><Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link></li>
            <li aria-hidden="true" className="text-gray-600">&gt;</li>
            <li className="text-gray-400 truncate max-w-[300px]">{article.title}</li>
          </ol>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span className="text-gray-600">·</span>
            <span>{article.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-white mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 bg-[#111827] border border-gray-700/50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-sm font-bold shrink-0">
              VM
            </div>
            <div>
              <p className="text-white text-sm font-medium">Vlad Mazilu</p>
              <p className="text-gray-500 text-xs">Founder of TradeInvoice. Helping tradespeople get paid faster.</p>
            </div>
          </div>
        </header>

        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }}
        />

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-8 sm:p-10 text-center hover:border-amber-500/40 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-3 text-white">
            Create your first invoice in 60 seconds, free
          </h3>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            No credit card required. Auto BTW calculations, payment reminders,
            and professional PDF invoices, built for Dutch tradespeople.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-8 py-3.5 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02]"
          >
            Start Free
          </Link>
        </div>
      </article>

      <footer className="border-t border-gray-700/30 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center mb-4">
          <Link href="/terms" className="text-gray-500 hover:text-amber-400 transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-gray-500 hover:text-amber-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/dpa" className="text-gray-500 hover:text-amber-400 transition-colors">
            DPA
          </Link>
          <Link href="/contact" className="text-gray-500 hover:text-amber-400 transition-colors">
            Contact
          </Link>
        </div>
        &copy; {new Date().getFullYear()} TradeInvoice. Operated by Vlad Mazilu Alexandru, Netherlands.
      </footer>
    </div>
  );
}
