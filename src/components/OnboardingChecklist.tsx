"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface OnboardingChecklistProps {
  hasBusinessName: boolean;
  invoiceCount: number;
  hasSentInvoice: boolean;
}

export default function OnboardingChecklist({
  hasBusinessName,
  invoiceCount,
  hasSentInvoice,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    setDismissed(localStorage.getItem("onboarding_dismissed") === "true");
  }, []);

  const steps = [
    {
      label: "Add your business details",
      done: hasBusinessName,
      href: "/settings",
      description: "Your name, address, and bank details appear on invoices",
    },
    {
      label: "Create your first invoice",
      done: invoiceCount > 0,
      href: "/invoices/new",
      description: "Send professional invoices in under a minute",
    },
    {
      label: "Share your invoice link with a client",
      done: hasSentInvoice,
      href: invoiceCount > 0 ? undefined : "/invoices/new",
      description: "Email an invoice directly to your client",
    },
  ];

  const allDone = steps.every((s) => s.done);
  const completedCount = steps.filter((s) => s.done).length;

  if (dismissed || allDone) return null;

  function handleDismiss() {
    localStorage.setItem("onboarding_dismissed", "true");
    setDismissed(true);
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-[#111827] to-[#111827] rounded-2xl border border-amber-500/20 hover:border-amber-500/30 p-6 mb-8 transition-all duration-300 shadow-lg shadow-black/10 animate-slide-up">
      {/* Ambient glow */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              Get Started
            </h2>
            <p className="text-gray-400 text-sm mt-1.5 font-medium tabular-nums">
              {completedCount}/3 steps completed
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] rounded-lg p-1.5 transition-all duration-200"
            title="Dismiss"
            aria-label="Dismiss onboarding checklist"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/[0.06] rounded-full h-1.5 mb-5">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-400 h-1.5 rounded-full transition-all duration-700 ease-out shadow-sm shadow-amber-500/30"
            style={{ width: `${(completedCount / 3) * 100}%` }}
          />
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl p-3.5 transition-all duration-200 border ${
                step.done
                  ? "bg-emerald-500/[0.05] border-emerald-500/15"
                  : "bg-white/[0.02] border-gray-700/30 hover:bg-white/[0.05] hover:border-gray-700/50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                  step.done
                    ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                    : "bg-gray-700/50 text-gray-400 ring-1 ring-gray-600/30"
                }`}
              >
                {step.done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold tabular-nums">{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {step.href && !step.done ? (
                  <Link
                    href={step.href}
                    className="font-medium text-white hover:text-amber-400 transition-colors duration-200"
                  >
                    {step.label}
                    <span className="ml-1.5 text-amber-500 inline-block transition-transform duration-200 group-hover:translate-x-0.5">&#8594;</span>
                  </Link>
                ) : (
                  <span
                    className={`font-medium ${
                      step.done ? "text-emerald-400 line-through decoration-emerald-500/30" : "text-gray-300"
                    }`}
                  >
                    {step.label}
                  </span>
                )}
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
