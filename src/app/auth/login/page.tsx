"use client";

import { useState, useEffect, Suspense } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "@/components/animations";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { GradientText } from "@/components/ui/gradient-text";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  useEffect(() => {
    (window as unknown as Record<string, unknown>).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };

    const scriptId = "turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken }),
      });
      if (!res.ok) throw new Error("Failed to send magic link");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setTurnstileToken("");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 relative overflow-hidden">
        {/* BackgroundPaths as animated background */}
        <div className="absolute inset-0 z-0 [&>div]:!bg-[#0a0f1e]">
          <BackgroundPaths />
        </div>

        <motion.div
          className="max-w-md w-full text-center relative z-10"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-10 shadow-2xl">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>
            <motion.h1
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Check Your Email
            </motion.h1>
            <motion.p
              className="text-gray-400 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t("magicLinkSent")} <span className="text-amber-400 font-medium">{email}</span>
            </motion.p>
            <motion.p
              className="text-gray-500 mt-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t("clickLinkExpires")}
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 relative overflow-hidden">
      {/* BackgroundPaths as animated background */}
      <div className="absolute inset-0 z-0 [&>div]:!bg-[#0a0f1e]">
        <BackgroundPaths />
      </div>

      <motion.div
        className="max-w-md w-full relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/" className="inline-block">
            <GradientText
              as="span"
              className="text-3xl font-bold !bg-[#0a0f1e] tracking-tight"
            >
              TradeInvoice
            </GradientText>
          </Link>
          <p className="text-gray-400 mt-2">{t("signIn")}</p>
        </motion.div>

        <motion.div
          className="bg-[#111827]/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {(errorParam || error) && (
            <motion.div
              className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>
                {errorParam === "invalid_token" ? t("linkExpired")
                  : errorParam === "missing_token" ? t("missingToken")
                  : error}
              </span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border border-gray-700/50 text-white placeholder-gray-500 text-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all duration-200 focus-glow"
              />
            </motion.div>

            <motion.label
              className="flex items-start gap-3 cursor-pointer group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-700/50 bg-[#0a0f1e] text-amber-500 focus:ring-amber-500 focus:ring-offset-0 accent-amber-500"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                I agree to the{" "}
                <Link href="/terms" className="text-amber-400 hover:text-amber-300 underline" target="_blank">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline" target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </motion.label>

            <div className="cf-turnstile mb-2" data-sitekey="0x4AAAAAACweCZOmPzdmk32Y" data-theme="dark" data-callback="onTurnstileSuccess" />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <motion.button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed btn-press"
                whileHover={!loading && agreedToTerms ? { scale: 1.01 } : {}}
                whileTap={!loading && agreedToTerms ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : "Send Magic Link"}
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            className="text-center text-gray-500 text-sm mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            {t("noPassword")}
          </motion.p>
        </motion.div>

        <motion.p
          className="text-center text-gray-600 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Don&apos;t have an account?{" "}
          <Link href="/auth/login" className="text-amber-400 hover:text-amber-300 transition-colors">
            Sign up free
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
