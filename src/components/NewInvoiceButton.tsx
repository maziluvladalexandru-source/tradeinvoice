"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface NewInvoiceButtonProps {
  isNewUser: boolean;
}

export default function NewInvoiceButton({ isNewUser }: NewInvoiceButtonProps) {
  const [showTip, setShowTip] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isNewUser) return;
    if (localStorage.getItem("new_invoice_tip_shown") === "true") return;
    // Small delay so it appears after page loads
    const timer = setTimeout(() => setShowTip(true), 800);
    return () => clearTimeout(timer);
  }, [isNewUser]);

  function dismissTip() {
    setShowTip(false);
    localStorage.setItem("new_invoice_tip_shown", "true");
  }

  return (
    <div className="relative flex items-center gap-3">
      <Link
        href="/invoices/new?type=quote"
        className="bg-purple-500/15 text-purple-300 px-5 py-3 rounded-xl font-semibold text-base hover:bg-purple-500/25 ring-1 ring-purple-500/30 transition-colors inline-block"
      >
        + New Quote
      </Link>
      <Link
        href="/invoices/new"
        onClick={dismissTip}
        className="bg-amber-500 text-gray-950 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-amber-400 transition-colors inline-block"
      >
        + New Invoice
      </Link>

      {showTip && (
        <div
          ref={tipRef}
          className="absolute right-0 top-full mt-3 w-72 z-50 animate-fade-in"
        >
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 shadow-xl relative">
            {/* Arrow */}
            <div className="absolute -top-2 right-6 w-4 h-4 bg-gray-800 border-l border-t border-gray-600 rotate-45" />
            <div className="flex items-start gap-3">
              <span className="text-amber-500 text-lg flex-shrink-0">💡</span>
              <div className="flex-1">
                <p className="text-sm text-gray-200 font-medium">Quick tip</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add your bank details in Settings so clients know how to pay you.
                </p>
              </div>
              <button
                onClick={dismissTip}
                className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
