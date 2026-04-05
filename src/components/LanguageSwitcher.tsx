"use client";

import { useLocale } from "next-intl";

const languages = [
  { code: "en", label: "English" },
  { code: "nl", label: "Nederlands" },
  { code: "de", label: "Deutsch" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value;
    if (code === locale) return;

    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: code }),
    });

    window.location.reload();
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="px-2 py-1 rounded text-sm bg-white/10 text-gray-200 border border-gray-700/50 cursor-pointer hover:bg-white/20 transition-colors"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
