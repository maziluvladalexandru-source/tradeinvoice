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
    <div className="bg-gradient-to-br from-amber-500/10 via-gray-800/60 to-gray-800/60 rounded-2xl border border-amber-500/20 p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg
              className="w-6 h-6 text-amber-500"
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
            Get Started
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {completedCount}/3 steps completed
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-500 hover:text-gray-300 transition-colors p-1"
          title="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-5">
        <div
          className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / 3) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${
              step.done
                ? "bg-green-500/5"
                : "bg-gray-700/30 hover:bg-gray-700/50"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                step.done
                  ? "bg-green-500/20 text-green-400"
                  : "bg-gray-600 text-gray-400"
              }`}
            >
              {step.done ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-xs font-bold">{i + 1}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {step.href && !step.done ? (
                <Link
                  href={step.href}
                  className="font-medium text-white hover:text-amber-400 transition-colors"
                >
                  {step.label}
                  <span className="ml-1 text-amber-500">→</span>
                </Link>
              ) : (
                <span
                  className={`font-medium ${
                    step.done ? "text-green-400 line-through" : "text-gray-300"
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
  );
}
