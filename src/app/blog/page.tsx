"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { articles } from "./articles";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white premium-glow">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <FadeIn>
        <div className="mb-12">
          <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Insights & Guides
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Blog</h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Practical guides on invoicing, BTW, payments, and running your trade
            business in the Netherlands.
          </p>
        </div>
        </FadeIn>

        {/* Free template banner */}
        <FadeIn delay={0.15}>
        <Link
          href="/templates"
          className="block mb-12 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all duration-200 group hover:shadow-lg hover:shadow-amber-500/5"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-amber-400 font-semibold mb-1">Free Resource</div>
              <div className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                Free Invoice Template for Tradespeople
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Download our professional template or create your own invoice online in 60 seconds.
              </div>
            </div>
            <div className="text-amber-400 text-2xl flex-shrink-0 ml-4 group-hover:translate-x-1 transition-transform duration-200">&rarr;</div>
          </div>
        </Link>
        </FadeIn>

        <StaggerChildren className="space-y-6" delay={0.2}>
          {articles.map((article) => (
            <StaggerItem key={article.slug}>
            <Link
              href={`/blog/${article.slug}`}
              className="block group bg-[#111827] border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-200"
            >
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
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
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-white group-hover:text-amber-400 transition-colors duration-200">
                {article.title}
              </h2>
              <p className="text-gray-400 leading-relaxed">{article.excerpt}</p>
              <div className="mt-4 text-amber-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                Read article
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </main>

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
