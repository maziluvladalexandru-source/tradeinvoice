"use client";

import { useState } from "react";

export default function PayNowButton({ invoiceId, paymentUrl, label, isDeposit }: { invoiceId: string; paymentUrl: string | null; label?: string; isDeposit?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);

    // If we already have a payment URL, redirect directly
    if (paymentUrl) {
      window.location.href = paymentUrl;
      return;
    }

    try {
      const res = await fetch(`/api/invoice/${invoiceId}/pay${isDeposit ? "?deposit=true" : ""}`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create payment link");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handlePay}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 active:from-amber-600 active:to-amber-500 text-gray-950 font-semibold text-base px-10 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 btn-press"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            {label || "Pay Now"}
          </>
        )}
      </button>
      {error && (
        <p className="text-red-400 text-sm mt-3">{error}</p>
      )}
    </div>
  );
}
