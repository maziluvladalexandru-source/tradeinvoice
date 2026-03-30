"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`/api/auth/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          router.push("/dashboard");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] premium-glow">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-2 border-gray-700/50"></div>
            <div className="absolute inset-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-amber-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-300 text-lg font-medium">Signing you in...</p>
          <p className="text-gray-500 text-sm mt-2">Just a moment while we verify your link</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] premium-glow">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-red-400 text-lg font-semibold mb-2">Invalid or expired link</p>
        <p className="text-gray-500 text-sm mb-6">This sign-in link is no longer valid. Please request a new one.</p>
        <a
          href="/auth/login"
          className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 px-8 py-3 rounded-xl font-bold hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02]"
        >
          Try again
        </a>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] premium-glow"><div className="text-gray-400">Loading...</div></div>}>
      <VerifyContent />
    </Suspense>
  );
}
