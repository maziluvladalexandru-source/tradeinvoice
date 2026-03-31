"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function switchLocale(code: string) {
    if (code === locale) {
      setOpen(false);
      return;
    }
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: code }),
    });
    setOpen(false);
    router.refresh();
  }

  const current = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm transition-colors hover:bg-white/5 text-gray-400 hover:text-gray-200 ${
          compact ? "text-xs" : ""
        }`}
      >
        <span>{current.flag}</span>
        {!compact && <span>{current.code.toUpperCase()}</span>}
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[#0f1629] border border-gray-700/50 rounded-xl shadow-xl z-50 py-1 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                lang.code === locale ? "text-amber-400 font-medium" : "text-gray-300"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {lang.code === locale && (
                <svg className="w-3.5 h-3.5 ml-auto text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
