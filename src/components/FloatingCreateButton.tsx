"use client";

import Link from "next/link";

export default function FloatingCreateButton() {
  return (
    <Link
      href="/invoices/new"
      className="fixed bottom-20 right-4 z-40 md:hidden w-14 h-14 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/25 transition-colors"
      aria-label="Create new invoice"
    >
      <svg className="w-7 h-7 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
}
