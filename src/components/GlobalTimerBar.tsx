"use client";

import { useTimer } from "@/components/TimerContext";
import Link from "next/link";

function formatTimer(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function GlobalTimerBar() {
  const { timerRunning, timerElapsed, timerDescription, timerClientName, stopTimer } = useTimer();

  if (!timerRunning) return null;

  return (
    <div className="sticky top-0 z-[100] bg-amber-500/10 border-b border-amber-500/30 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Pulsing dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>

          <Link
            href="/time-tracking"
            className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity"
          >
            <span className="text-amber-400 font-mono text-sm font-semibold tabular-nums">
              {formatTimer(timerElapsed)}
            </span>
            <span className="text-gray-400 text-sm truncate max-w-[200px] sm:max-w-[300px]">
              {timerDescription || "Untitled task"}
              {timerClientName && (
                <span className="text-gray-500 ml-1.5">· {timerClientName}</span>
              )}
            </span>
          </Link>
        </div>

        <button
          onClick={stopTimer}
          className="shrink-0 bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
          Stop
        </button>
      </div>
    </div>
  );
}
