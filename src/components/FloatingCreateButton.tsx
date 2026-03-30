"use client";

import Link from "next/link";

export default function FloatingCreateButton() {
  return (
    <Link
      href="/invoices/new"
      className="fixed bottom-24 right-4 z-[60] md:hidden w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 active:from-amber-600 active:to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-amber-500/40 btn-press ambient-glow"
      aria-label="Create new invoice"
    >
      <svg className="w-7 h-7 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
}
