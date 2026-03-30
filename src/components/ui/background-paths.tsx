"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Pre-computed path configs outside component to prevent re-creation on every render
const PATH_COUNT = 8; // Reduced from 12

function generatePaths(position: number) {
    return Array.from({ length: PATH_COUNT }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
        duration: 20 + i * 3, // Deterministic, not Math.random()
    }));
}

const pathsPositive = generatePaths(1);
const pathsNegative = generatePaths(-1);

function FloatingPaths({ paths }: { paths: ReturnType<typeof generatePaths> }) {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-slate-950 dark:text-white"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: path.duration,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths() {
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!prefersReduced) {
            setShouldAnimate(true);
        }
    }, []);

    if (!shouldAnimate) return null;

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <FloatingPaths paths={pathsPositive} />
            <FloatingPaths paths={pathsNegative} />
        </div>
    );
}
