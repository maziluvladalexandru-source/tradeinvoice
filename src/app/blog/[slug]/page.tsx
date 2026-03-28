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
    title: `${article.title} — TradeInvoice`,
    description: article.metaDescription,
    keywords: [article.keyword, "invoicing", "zzp", "netherlands", "tradeinvoice"],
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.date,
      siteName: "TradeInvoice",
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
    // Links
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-amber-400 underline hover:text-amber-300">$1</a>'
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
          '<div class="overflow-x-auto my-6"><table class="w-full text-sm border-collapse">'
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
              `<th class="text-left py-2 px-3 border-b border-gray-700 text-gray-300 font-semibold">${c}</th>`
            )
        );
        htmlLines.push("</tr></thead>");
      } else {
        if (!inTableBody) {
          htmlLines.push("<tbody>");
          inTableBody = true;
        }
        htmlLines.push("<tr>");
        cells.forEach(
          (c) =>
            htmlLines.push(
              `<td class="py-2 px-3 border-b border-gray-800/50 text-gray-400">${c}</td>`
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
      "@type": "Organization",
      name: "TradeInvoice",
      url: "https://tradeinvoice.nl",
    },
    publisher: {
      "@type": "Organization",
      name: "TradeInvoice",
      url: "https://tradeinvoice.nl",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tradeinvoice.nl/blog/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="text-sm text-gray-500 hover:text-amber-400 transition-colors mb-8 inline-block"
        >
          &larr; Back to blog
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            {article.title}
          </h1>
        </header>

        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }}
        />

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">
            Create your first invoice in 60 seconds — free
          </h3>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            No credit card required. Auto BTW calculations, payment reminders,
            and professional PDF invoices — built for Dutch tradespeople.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-amber-500 text-gray-900 px-8 py-3 rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            Start Free
          </Link>
        </div>
      </article>
    </>
  );
}
