"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-accepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie-accepted", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/5 border-t border-white/10 px-4 py-3">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-300 text-center sm:text-left">
          We use a session cookie to keep you logged in. No tracking. No analytics.{" "}
          <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline">
            Privacy Policy
          </Link>
        </p>
        <button
          onClick={handleAccept}
          className="bg-amber-500 text-gray-900 px-5 py-1.5 rounded-lg font-semibold text-sm hover:bg-amber-400 transition-colors shrink-0"
        >
          OK
        </button>
      </div>
    </div>
  );
}
