"use client";

import { useState, useEffect } from "react";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  displayValue?: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerText: string;
  centerSubtext?: string;
  size?: number;
}

export default function DonutChart({
  segments,
  centerText,
  centerSubtext,
  size = 200,
}: DonutChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) {
    return (
      <div className="flex flex-col items-center animate-fade-in">
        <svg width={size} height={size} viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#1f2937"
            strokeWidth="24"
          />
          <text
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-500"
            fontSize="14"
          >
            No data
          </text>
        </svg>
      </div>
    );
  }

  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const activeSegments = segments.filter((s) => s.value > 0);
  const gap = activeSegments.length > 1 ? 2 : 0;

  // Ensure tiny segments are still visible (minimum 4% of circumference)
  const minFraction = 0.04;
  const rawFractions = activeSegments.map((s) => s.value / total);
  const adjustedFractions = rawFractions.map((f) => Math.max(f, minFraction));
  const adjustedTotal = adjustedFractions.reduce((a, b) => a + b, 0);
  const normalizedFractions = adjustedFractions.map((f) => f / adjustedTotal);

  let cumulativeOffset = 0;
  const arcs = activeSegments.map((segment, i) => {
    const fraction = normalizedFractions[i];
    const segmentLength = fraction * circumference;
    const adjustedLength = Math.max(segmentLength - gap, 0);
    const offset = cumulativeOffset;
    cumulativeOffset += segmentLength;

    return {
      ...segment,
      index: i,
      dashArray: `${adjustedLength} ${circumference - adjustedLength}`,
      dashOffset: -offset,
      fraction,
    };
  });

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="transform -rotate-90 drop-shadow-lg"
      >
        {/* Background ring with subtle glow */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth="24"
          className="opacity-60"
        />
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={hoveredIndex === arc.index ? "28" : "24"}
            strokeDasharray={mounted ? arc.dashArray : `0 ${circumference}`}
            strokeDashoffset={arc.dashOffset}
            strokeLinecap="butt"
            className="transition-all duration-700 ease-out"
            style={{
              opacity: hoveredIndex === null || hoveredIndex === arc.index ? 1 : 0.3,
              cursor: "pointer",
              filter: hoveredIndex === arc.index ? `drop-shadow(0 0 6px ${arc.color}40)` : "none",
            }}
            onMouseEnter={() => setHoveredIndex(arc.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
        <text
          x="100"
          y={centerSubtext ? "92" : "100"}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white font-bold"
          fontSize={centerText.length > 12 ? "11" : centerText.length > 8 ? "14" : "18"}
          style={{ transform: "rotate(90deg)", transformOrigin: "100px 100px" }}
        >
          {centerText.length > 14 ? centerText.slice(0, 13) + "..." : centerText}
        </text>
        {centerSubtext && (
          <text
            x="100"
            y="114"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-400"
            fontSize="12"
            style={{ transform: "rotate(90deg)", transformOrigin: "100px 100px" }}
          >
            {centerSubtext}
          </text>
        )}
      </svg>
      <div className="mt-4 space-y-1.5 w-full max-w-[240px]">
        {arcs.map((arc) => (
          <div
            key={arc.label}
            className="flex items-center gap-2 text-sm cursor-pointer rounded-lg px-2 py-1 -mx-2 hover:bg-white/[0.03] transition-all duration-200"
            style={{
              opacity: hoveredIndex === null || hoveredIndex === arc.index ? 1 : 0.35,
            }}
            onMouseEnter={() => setHoveredIndex(arc.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-offset-1 ring-offset-[#111827]"
              style={{ backgroundColor: arc.color }}
            />
            <span className="text-gray-400 flex-1 truncate">{arc.label}</span>
            <span className="text-white font-medium tabular-nums">
              {arc.displayValue ?? arc.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
