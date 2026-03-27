"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import OfflineBanner from "./OfflineBanner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/invoices/new", label: "New Invoice" },
    { href: "/clients", label: "Clients" },
    { href: "/settings", label: "Settings" },
  ];

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  }

  return (
    <>
    <OfflineBanner />
    <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 shadow-[0_1px_0_0_rgba(245,158,11,0.1)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-2xl font-bold text-amber-500"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M12 2L2 12l10 10 10-10L12 2z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M12 2L2 12l10 10 10-10L12 2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M8 11h8M8 14h5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              TradeInvoice
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    pathname === link.href ||
                    (link.href !== "/dashboard" &&
                      pathname.startsWith(link.href))
                      ? "bg-amber-500/15 text-amber-400 shadow-sm shadow-amber-500/10"
                      : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-sm text-gray-400 hover:text-white px-4 py-1.5 rounded-full border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-200"
          >
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
        {/* Mobile nav moved to BottomNav component */}
      </div>
    </nav>
    </>
  );
}
