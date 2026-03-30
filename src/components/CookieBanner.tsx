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
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-[#111827]/95 backdrop-blur-xl border-t border-gray-700/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 text-center sm:text-left">
            We use a session cookie to keep you logged in. No tracking. No analytics.{" "}
            <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors duration-200">
              Privacy Policy
            </Link>
          </p>
          <button
            onClick={handleAccept}
            className="bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-6 py-2 rounded-xl font-semibold text-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 btn-press shrink-0"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
