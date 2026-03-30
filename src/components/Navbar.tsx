"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import OfflineBanner from "./OfflineBanner";
import { motion } from "@/components/animations";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/invoices", label: "Invoices" },
    { href: "/clients", label: "Clients" },
    { href: "/expenses", label: "Expenses" },
    { href: "/time-tracking", label: "Time" },
    { href: "/reports", label: "Reports" },
    { href: "/services", label: "Services" },
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
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_1px_0_0_rgba(245,158,11,0.1)]"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-2xl font-bold text-amber-500 hover:scale-105 transition-transform duration-200"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
                aria-hidden="true"
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
            <div className="hidden md:flex items-center gap-0.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    pathname === link.href ||
                    (link.href !== "/dashboard" &&
                      link.href !== "/invoices" &&
                      pathname.startsWith(link.href))
                      ? "bg-amber-500/15 text-amber-400 shadow-sm shadow-amber-500/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                  {(pathname === link.href ||
                    (link.href !== "/dashboard" &&
                      link.href !== "/invoices" &&
                      pathname.startsWith(link.href))) && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
              <Link
                href="/invoices/new"
                className={`ml-1 px-2.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  pathname === "/invoices/new"
                    ? "bg-amber-500 text-black shadow-sm shadow-amber-500/20"
                    : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
                }`}
                title="New Invoice"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="hidden md:block text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
          >
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
        {/* Mobile nav moved to BottomNav component */}
      </div>
    </motion.nav>
    </>
  );
}
