"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, type ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════
   TRADEINVOICE ANIMATION SYSTEM
   Reusable framer-motion components for a living UI
   ═══════════════════════════════════════════════════════════ */

// ─── FadeIn ──────────────────────────────────────────────
// Fade + slide on mount. Direction: up (default), down, left, right
export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className = "",
  once = true,
}: {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const offsets = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 60 },
    right: { x: -60 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offsets[direction] }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerChildren ─────────────────────────────────────
// Parent that staggers child animations
export function StaggerChildren({
  children,
  staggerDelay = 0.08,
  delay = 0,
  className = "",
  once = true,
}: {
  children: ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Child item for StaggerChildren
export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { type: "spring", stiffness: 300, damping: 24 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── ScrollReveal ────────────────────────────────────────
// Animate when element enters viewport with customizable effects
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  scale = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: scale ? 0.95 : 1 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── AnimatedCounter ─────────────────────────────────────
// Numbers that count up from 0 to target value
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.5,
  className = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(eased * value);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  const formatted = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

// ─── GradientText ────────────────────────────────────────
// Animated gradient text with shifting colors
export function GradientText({
  children,
  className = "",
  from = "#f59e0b",
  via = "#fbbf24",
  to = "#f97316",
}: {
  children: ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
}) {
  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${from}, ${via}, ${to}, ${from})`,
      }}
      animate={{ backgroundPosition: ["0% center", "200% center"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

// ─── FloatingOrb ─────────────────────────────────────────
// Ambient floating background element
export function FloatingOrb({
  color = "amber",
  size = "lg",
  className = "",
  delay = 0,
}: {
  color?: "amber" | "purple" | "blue" | "emerald";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  delay?: number;
}) {
  const colors = {
    amber: "bg-amber-500/8",
    purple: "bg-purple-500/8",
    blue: "bg-blue-500/8",
    emerald: "bg-emerald-500/8",
  };
  const sizes = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
    xl: "w-[500px] h-[500px]",
  };

  return (
    <motion.div
      className={`absolute rounded-full blur-[128px] pointer-events-none ${colors[color]} ${sizes[size]} ${className}`}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -40, 20, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        duration: 12 + delay * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// ─── GlowCard ────────────────────────────────────────────
// Card with animated border glow on hover
export function GlowCard({
  children,
  className = "",
  glowColor = "amber",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: "amber" | "emerald" | "blue" | "purple";
}) {
  const glowColors = {
    amber: "hover:shadow-amber-500/20 hover:border-amber-500/40",
    emerald: "hover:shadow-emerald-500/20 hover:border-emerald-500/40",
    blue: "hover:shadow-blue-500/20 hover:border-blue-500/40",
    purple: "hover:shadow-purple-500/20 hover:border-purple-500/40",
  };

  return (
    <motion.div
      className={`relative bg-[#111827] border border-gray-700/50 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-xl ${glowColors[glowColor]} ${className}`}
      whileHover={{
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
    >
      <div className="glow-border-inner" />
      {children}
    </motion.div>
  );
}

// ─── PageTransition ──────────────────────────────────────
// Wrap page content for enter animation
export function PageTransition({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── AnimatedList ────────────────────────────────────────
// List with items that stagger in one by one
export function AnimatedList({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.06,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { type: "spring", stiffness: 300, damping: 24 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── HoverScale ──────────────────────────────────────────
// Simple scale + lift on hover
export function HoverScale({
  children,
  className = "",
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      whileHover={{
        scale,
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── SlideIn ─────────────────────────────────────────────
// Slide from a direction, useful for modals/panels
export function SlideIn({
  children,
  from = "bottom",
  className = "",
  isOpen = true,
}: {
  children: ReactNode;
  from?: "left" | "right" | "top" | "bottom";
  className?: string;
  isOpen?: boolean;
}) {
  const offsets = {
    left: { x: "-100%" },
    right: { x: "100%" },
    top: { y: "-100%" },
    bottom: { y: "100%" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, ...offsets[from] }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, ...offsets[from] }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Re-export motion and AnimatePresence for convenience
export { motion, AnimatePresence };
