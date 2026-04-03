"use client";

import { useRef } from "react";

interface Theme {
  id: string;
  label: string;
  desc: string;
  isPro?: boolean;
}

const THEMES: Theme[] = [
  { id: "classic", label: "Classic", desc: "Corporate & trusted" },
  { id: "modern", label: "Modern", desc: "Bold & sleek", isPro: true },
  { id: "minimal", label: "Minimal", desc: "Clean & airy", isPro: true },
  { id: "bold", label: "Bold", desc: "High contrast", isPro: true },
  { id: "elegant", label: "Elegant", desc: "Sophisticated", isPro: true },
  { id: "contractor", label: "Contractor", desc: "Industrial", isPro: true },
  { id: "corporate", label: "Corporate", desc: "Green geometric", isPro: true },
  { id: "professional", label: "Professional", desc: "Orange geometric", isPro: true },
  { id: "dutch", label: "Dutch", desc: "Factuur style", isPro: true },
];

function ThemePreview({ id }: { id: string }) {
  if (id === "classic") {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="h-[3px] bg-blue-700" />
        <div className="px-3 pt-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-700 flex-shrink-0" />
          <div className="space-y-1">
            <div className="h-1.5 w-16 bg-blue-700/30 rounded-full" />
            <div className="h-1 w-10 bg-blue-700/15 rounded-full" />
          </div>
        </div>
        <div className="px-3 mt-3 flex justify-between">
          <div className="space-y-1">
            <div className="h-1 w-14 bg-gray-300 rounded-full" />
            <div className="h-1 w-10 bg-gray-200 rounded-full" />
            <div className="h-1 w-12 bg-gray-200 rounded-full" />
          </div>
          <div className="space-y-1 items-end flex flex-col">
            <div className="h-1 w-12 bg-gray-300 rounded-full" />
            <div className="h-1 w-8 bg-gray-200 rounded-full" />
            <div className="h-1 w-10 bg-gray-200 rounded-full" />
          </div>
        </div>
        <div className="px-3 mt-4">
          <div className="h-5 w-full bg-blue-700/10 rounded flex items-center px-2">
            <div className="h-1 w-8 bg-blue-700/30 rounded-full" />
            <div className="ml-auto h-1 w-6 bg-blue-700/30 rounded-full" />
          </div>
          <div className="mt-1.5 space-y-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2 border-b border-gray-100 pb-1.5">
                <div className="h-1 w-20 bg-gray-200 rounded-full" />
                <div className="ml-auto h-1 w-8 bg-gray-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="px-3 mt-auto pb-3 flex justify-end items-center gap-2">
          <div className="space-y-1">
            <div className="h-1 w-14 bg-gray-200 rounded-full ml-auto" />
            <div className="h-2 w-16 bg-blue-700/20 rounded" />
          </div>
        </div>
        <div className="px-3 pb-2">
          <div className="h-px w-full bg-blue-700/20" />
          <div className="mt-1 h-1 w-20 bg-gray-200 rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  if (id === "modern") {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="h-[3px] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
        <div className="bg-slate-800 px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0" />
              <div className="space-y-1">
                <div className="h-1.5 w-14 bg-white/40 rounded-full" />
                <div className="h-1 w-8 bg-white/20 rounded-full" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="h-1 w-10 bg-white/30 rounded-full ml-auto" />
              <div className="h-2 w-16 bg-amber-500/70 rounded" />
            </div>
          </div>
        </div>
        <div className="px-3 pt-2 flex gap-2">
          <div className="bg-slate-100 rounded px-2 py-1.5 flex-1">
            <div className="h-1 w-8 bg-slate-400 rounded-full mb-1" />
            <div className="h-1 w-12 bg-slate-300 rounded-full" />
          </div>
          <div className="bg-amber-50 rounded px-2 py-1.5 flex-1">
            <div className="h-1 w-8 bg-amber-400 rounded-full mb-1" />
            <div className="h-1 w-10 bg-amber-300/60 rounded-full" />
          </div>
        </div>
        <div className="px-3 mt-3 flex-1">
          <div className="rounded-lg overflow-hidden border border-slate-200">
            <div className="h-5 bg-slate-800 flex items-center px-2 gap-3">
              <div className="h-1 w-8 bg-white/40 rounded-full" />
              <div className="ml-auto h-1 w-6 bg-white/40 rounded-full" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex items-center px-2 py-1.5 gap-2 border-b border-slate-100 ${i % 2 === 0 ? "bg-slate-50/50" : ""}`}>
                <div className="h-1 w-14 bg-gray-200 rounded-full" />
                <div className="ml-auto h-1 w-8 bg-gray-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="px-3 pb-3 mt-2 flex justify-end">
          <div className="bg-slate-800 rounded px-3 py-1.5 flex items-center gap-1.5">
            <div className="h-1 w-8 bg-white/40 rounded-full" />
            <div className="h-2 w-10 bg-amber-500 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (id === "minimal") {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="px-4 pt-4 flex justify-between items-end pb-3 border-b border-gray-200">
          <div className="space-y-1">
            <div className="h-1 w-12 bg-gray-200 rounded-full" />
            <div className="h-1 w-16 bg-gray-300 rounded-full" />
          </div>
          <div className="text-right space-y-1">
            <div className="h-1 w-8 bg-gray-200 rounded-full ml-auto" />
            <div className="h-1.5 w-12 bg-gray-400 rounded-full" />
          </div>
        </div>
        <div className="text-center py-4 border-b border-gray-100">
          <div className="h-1 w-10 bg-gray-200 rounded-full mx-auto mb-1.5" />
          <div className="h-3 w-20 bg-gray-100 rounded mx-auto" />
        </div>
        <div className="px-4 pt-3 flex-1">
          <div className="flex justify-between mb-2">
            <div className="h-1 w-16 bg-gray-200 rounded-full" />
            <div className="h-1 w-8 bg-gray-200 rounded-full" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-100 py-1.5 flex justify-between">
              <div className="h-1 w-20 bg-gray-100 rounded-full" />
              <div className="h-1 w-8 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 mt-2 flex justify-end">
          <div className="space-y-1 text-right">
            <div className="h-1 w-14 bg-gray-200 rounded-full ml-auto" />
            <div className="h-1 w-10 bg-gray-400 rounded-full ml-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (id === "bold") {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="h-[4px] bg-amber-500" />
        <div className="bg-[#0f172a] px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-amber-500 flex-shrink-0" />
              <div className="space-y-1">
                <div className="h-1.5 w-14 bg-white/30 rounded-full" />
                <div className="h-1 w-8 bg-white/15 rounded-full" />
              </div>
            </div>
            <div className="text-right">
              <div className="h-3 w-16 bg-white/10 rounded" />
            </div>
          </div>
        </div>
        <div className="px-3 py-2 bg-slate-100 border-b-2 border-slate-200 flex justify-between">
          <div className="flex gap-3">
            <div className="h-1 w-8 bg-slate-400 rounded-full" />
            <div className="h-1 w-8 bg-amber-400 rounded-full" />
          </div>
          <div className="h-1 w-8 bg-slate-300 rounded-full" />
        </div>
        <div className="px-3 mt-3 flex-1">
          <div className="h-5 w-full bg-[#0f172a] rounded-sm flex items-center px-2 mb-2">
            <div className="h-1 w-8 bg-white/30 rounded-full" />
            <div className="ml-auto h-1 w-6 bg-amber-500/60 rounded-full" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex py-1.5 px-1 border-b border-slate-100 ${i % 2 === 0 ? "bg-amber-50/30" : ""}`}>
              <div className="h-1 w-16 bg-gray-200 rounded-full" />
              <div className="ml-auto h-1 w-8 bg-gray-300 rounded-full" />
            </div>
          ))}
        </div>
        <div className="px-3 pb-3 mt-2 flex justify-end">
          <div className="bg-[#0f172a] rounded px-3 py-1.5">
            <div className="h-1.5 w-12 bg-amber-500 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (id === "elegant") {
    return (
      <div className="w-full h-full flex flex-col bg-[#faf8f5]">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent" />
        <div className="px-3 pt-3 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-[#4a3728] flex-shrink-0" />
            <div className="space-y-1">
              <div className="h-1.5 w-12 bg-[#4a3728]/30 rounded-full" />
              <div className="h-1 w-8 bg-[#c9a96e]/30 rounded-full" />
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div className="h-1 w-10 bg-stone-300 rounded-full ml-auto" />
            <div className="h-1 w-14 bg-[#c9a96e]/40 rounded-full" />
          </div>
        </div>
        <div className="mx-3 mt-3 border-t border-b border-[#c9a96e]/30 py-2.5 text-center">
          <div className="h-1 w-6 bg-[#c9a96e]/40 rounded-full mx-auto mb-1" />
          <div className="h-2 w-14 bg-[#4a3728]/15 rounded mx-auto" />
        </div>
        <div className="px-3 mt-3 flex-1">
          <div className="flex justify-between mb-2">
            <div className="h-1 w-14 bg-[#4a3728]/20 rounded-full" />
            <div className="h-1 w-8 bg-[#4a3728]/20 rounded-full" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-[#c9a96e]/15 py-1.5 flex justify-between">
              <div className="h-1 w-16 bg-stone-200 rounded-full" />
              <div className="h-1 w-8 bg-stone-300 rounded-full" />
            </div>
          ))}
        </div>
        <div className="px-3 pb-3 mt-2 flex justify-end">
          <div className="space-y-1 text-right border-t border-[#c9a96e]/30 pt-2">
            <div className="h-1 w-16 bg-stone-200 rounded-full ml-auto" />
            <div className="h-1 w-12 bg-[#4a3728]/30 rounded-full ml-auto" />
          </div>
        </div>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent" />
      </div>
    );
  }

  if (id === "contractor") {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="h-[3px] bg-[#e94560]" />
        <div className="bg-[#1a1a2e] px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#e94560] flex-shrink-0" />
              <div className="space-y-1">
                <div className="h-1.5 w-14 bg-white/30 rounded-full" />
                <div className="h-1 w-8 bg-white/15 rounded-full" />
              </div>
            </div>
            <div className="h-3 w-14 bg-white/10 rounded" />
          </div>
        </div>
        <div className="px-3 py-2 bg-slate-100 border-b-2 border-[#e94560]/30 flex justify-between">
          <div className="flex gap-2">
            <div className="h-1 w-10 bg-slate-300 rounded-full" />
            <div className="h-1 w-6 bg-[#e94560]/40 rounded-full" />
          </div>
          <div className="h-1 w-8 bg-slate-300 rounded-full" />
        </div>
        <div className="px-3 mt-3 flex-1">
          <div className="h-4 w-full bg-[#1a1a2e] rounded-sm flex items-center px-2 mb-2">
            <div className="h-1 w-8 bg-white/30 rounded-full" />
            <div className="ml-auto h-1 w-6 bg-[#e94560]/60 rounded-full" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex py-1.5 px-1 border-b border-slate-100 ${i % 2 === 0 ? "bg-[#e94560]/5" : ""}`}>
              <div className="h-1 w-16 bg-gray-200 rounded-full" />
              <div className="ml-auto h-1 w-8 bg-gray-300 rounded-full" />
            </div>
          ))}
        </div>
        <div className="px-3 pb-3 mt-2">
          <div className="border-t-2 border-[#e94560]/30 pt-2 flex justify-between items-center">
            <div className="h-1 w-12 bg-slate-200 rounded-full" />
            <div className="h-2 w-12 bg-[#1a1a2e] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (id === "corporate") {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="relative bg-[#2d3748] px-3 py-3 overflow-hidden">
          <div className="absolute top-0 bottom-0 pointer-events-none" style={{ right: "22%", width: "22px", background: "#48bb78", opacity: 0.35, transform: "skewX(-14deg)" }} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#48bb78] flex-shrink-0" />
              <div className="space-y-1">
                <div className="h-1.5 w-14 bg-white/40 rounded-full" />
                <div className="h-1 w-8 bg-white/20 rounded-full" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="h-1 w-8 bg-[#48bb78]/70 rounded-full ml-auto" />
              <div className="h-2 w-14 bg-white/30 rounded" />
            </div>
          </div>
        </div>
        <div className="h-[2px] bg-[#48bb78]" />
        <div className="px-3 mt-2 flex justify-between">
          <div className="space-y-1">
            <div className="h-1 w-12 bg-gray-200 rounded-full" />
            <div className="h-1 w-10 bg-gray-200 rounded-full" />
          </div>
          <div className="space-y-1 items-end flex flex-col">
            <div className="h-1 w-10 bg-gray-300 rounded-full" />
            <div className="h-1 w-8 bg-gray-200 rounded-full" />
          </div>
        </div>
        <div className="px-3 mt-3 flex-1">
          <div className="h-4 w-full bg-[#2d3748] rounded-sm flex items-center px-2 mb-2">
            <div className="h-1 w-4 bg-[#48bb78]/60 rounded-full" />
            <div className="ml-2 h-1 w-10 bg-[#48bb78]/40 rounded-full" />
            <div className="ml-auto h-1 w-6 bg-[#48bb78]/40 rounded-full" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex items-center px-1 py-1.5 border-b border-gray-100 ${i % 2 === 0 ? "bg-gray-50" : ""}`}>
              <div className="h-1 w-3 bg-gray-200 rounded-full mr-1" />
              <div className="h-1 w-12 bg-gray-200 rounded-full" />
              <div className="ml-auto h-1 w-8 bg-gray-300 rounded-full" />
            </div>
          ))}
        </div>
        <div className="px-3 pb-3 mt-2 flex justify-end">
          <div className="bg-[#48bb78] rounded px-3 py-1.5 flex items-center gap-1.5">
            <div className="h-1 w-6 bg-white/60 rounded-full" />
            <div className="h-1.5 w-8 bg-white rounded" />
          </div>
        </div>
        <div className="px-3 pb-2 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="h-1 w-10 bg-[#48bb78]/30 rounded-full" />
            <div className="h-1 w-8 bg-gray-200 rounded-full" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-12 bg-gray-200 rounded-full" />
            <div className="h-1 w-10 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (id === "professional") {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="relative bg-[#1a365d] px-3 py-3 overflow-hidden">
          <div className="absolute top-0 bottom-0 pointer-events-none" style={{ right: "22%", width: "22px", background: "#ed8936", opacity: 0.35, transform: "skewX(-14deg)" }} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#ed8936] flex-shrink-0" />
              <div className="space-y-1">
                <div className="h-1.5 w-14 bg-white/40 rounded-full" />
                <div className="h-1 w-8 bg-white/20 rounded-full" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="h-1 w-8 bg-[#ed8936]/70 rounded-full ml-auto" />
              <div className="h-2 w-14 bg-white/30 rounded" />
            </div>
          </div>
        </div>
        <div className="h-[2px] bg-[#ed8936]" />
        <div className="px-3 mt-2 flex justify-between">
          <div className="space-y-1">
            <div className="h-1 w-12 bg-gray-200 rounded-full" />
            <div className="h-1 w-10 bg-gray-200 rounded-full" />
          </div>
          <div className="space-y-1 items-end flex flex-col">
            <div className="h-1 w-10 bg-gray-300 rounded-full" />
            <div className="h-1 w-8 bg-gray-200 rounded-full" />
          </div>
        </div>
        <div className="px-3 mt-3 flex-1">
          <div className="h-4 w-full bg-[#1a365d] rounded-sm flex items-center px-2 mb-2">
            <div className="h-1 w-4 bg-[#ed8936]/60 rounded-full" />
            <div className="ml-2 h-1 w-10 bg-[#ed8936]/40 rounded-full" />
            <div className="ml-auto h-1 w-6 bg-[#ed8936]/40 rounded-full" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex items-center px-1 py-1.5 border-b border-gray-100 ${i % 2 === 0 ? "bg-gray-50" : ""}`}>
              <div className="h-1 w-3 bg-gray-200 rounded-full mr-1" />
              <div className="h-1 w-12 bg-gray-200 rounded-full" />
              <div className="ml-auto h-1 w-8 bg-gray-300 rounded-full" />
            </div>
          ))}
        </div>
        <div className="px-3 pb-3 mt-2 flex justify-end">
          <div className="bg-[#ed8936] rounded px-3 py-1.5 flex items-center gap-1.5">
            <div className="h-1 w-6 bg-white/60 rounded-full" />
            <div className="h-1.5 w-8 bg-white rounded" />
          </div>
        </div>
        <div className="px-3 pb-2 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="h-1 w-10 bg-[#ed8936]/30 rounded-full" />
            <div className="h-1 w-8 bg-gray-200 rounded-full" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-12 bg-gray-200 rounded-full" />
            <div className="h-1 w-10 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (id === "dutch") {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="border-l-[4px] border-[#f97316] px-3 pt-3 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#f97316] flex-shrink-0" />
              <div className="space-y-1">
                <div className="h-1.5 w-14 bg-gray-300 rounded-full" />
                <div className="h-1 w-8 bg-gray-200 rounded-full" />
              </div>
            </div>
            <div className="text-right">
              <div className="h-1 w-8 bg-[#f97316]/50 rounded-full ml-auto mb-1" />
              <div className="h-3 w-14 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="mt-2 flex gap-3">
            <div className="h-1 w-14 bg-gray-200 rounded-full" />
            <div className="h-1 w-12 bg-[#f97316]/40 rounded-full" />
          </div>
        </div>
        <div className="px-3 py-2 border-t border-gray-100">
          <div className="h-1 w-8 bg-[#f97316]/40 rounded-full mb-1" />
          <div className="h-1 w-16 bg-gray-200 rounded-full" />
          <div className="h-1 w-12 bg-gray-200 rounded-full mt-1" />
        </div>
        <div className="px-3 mt-1 flex-1">
          <div className="border-t-2 border-b-2 border-gray-200 bg-gray-50 flex items-center px-1 py-1.5 gap-1">
            <div className="h-1 w-3 bg-[#f97316]/50 rounded-full" />
            <div className="h-1 w-10 bg-gray-300 rounded-full" />
            <div className="ml-auto flex gap-1">
              <div className="h-1 w-5 bg-gray-300 rounded-full" />
              <div className="h-1 w-5 bg-gray-300 rounded-full" />
              <div className="h-1 w-5 bg-gray-300 rounded-full" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex items-center px-1 py-1.5 border-b border-gray-100 ${i % 2 === 1 ? "bg-gray-50/50" : ""}`}>
              <div className="h-1 w-3 bg-gray-200 rounded-full mr-1" />
              <div className="h-1 w-12 bg-gray-200 rounded-full" />
              <div className="ml-auto flex gap-1">
                <div className="h-1 w-5 bg-gray-200 rounded-full" />
                <div className="h-1 w-5 bg-gray-200 rounded-full" />
                <div className="h-1 w-5 bg-gray-300 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="px-3 pb-2 mt-2 flex justify-end">
          <div className="border-t-2 border-[#f97316] pt-1.5 flex items-center gap-1.5">
            <div className="h-1 w-14 bg-[#f97316]/40 rounded-full" />
            <div className="h-2 w-10 bg-gray-800 rounded" />
          </div>
        </div>
        <div className="px-3 pb-2 border-t border-gray-100 pt-1.5 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="h-1 w-12 bg-gray-300 rounded-full" />
            <div className="h-1 w-10 bg-gray-200 rounded-full" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-8 bg-gray-200 rounded-full" />
            <div className="h-1 w-10 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

interface ThemeCarouselProps {
  selectedTheme: string;
  isPro: boolean;
  onSelect: (themeId: string) => void;
  onProPrompt: () => void;
}

export default function ThemeCarousel({
  selectedTheme,
  isPro,
  onSelect,
  onProPrompt,
}: ThemeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.querySelector("button")?.offsetWidth ?? 172;
    container.scrollBy({ left: dir === "left" ? -(cardWidth + 12) : cardWidth + 12, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-[#1f2937] border border-gray-600/50 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#374151] hover:border-gray-500 transition-all shadow-lg shadow-black/30"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-[#1f2937] border border-gray-600/50 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#374151] hover:border-gray-500 transition-all shadow-lg shadow-black/30"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Scrollable carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {THEMES.map((theme) => {
          const locked = !isPro && theme.isPro;
          const selected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                if (locked) {
                  onProPrompt();
                  return;
                }
                onSelect(theme.id);
              }}
              className={`
                relative flex-shrink-0 snap-start w-[160px] rounded-xl border text-left transition-all duration-200 overflow-hidden
                ${selected
                  ? "border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/15"
                  : "border-gray-700/50 hover:border-gray-500/70 hover:shadow-md hover:shadow-black/20 hover:-translate-y-0.5"
                }
                ${locked ? "opacity-70" : ""}
              `}
            >
              {/* Preview area */}
              <div className="w-full aspect-[3/4] overflow-hidden bg-white relative">
                <ThemePreview id={theme.id} />

                {/* Lock overlay */}
                {locked && (
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="bg-black/60 rounded-full p-2">
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Selected checkmark */}
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shadow-md">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Label area */}
              <div className="px-3 py-2.5 bg-[#111827]">
                <p className="text-sm font-semibold text-white leading-tight">{theme.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{theme.desc}</p>
                {locked && (
                  <span className="inline-block mt-1.5 text-[10px] font-medium text-amber-500/80 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5 leading-tight">
                    PRO
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
