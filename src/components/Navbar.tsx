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
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-amber-500"
            >
              TradeInvoice
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href ||
                    (link.href !== "/dashboard" &&
                      pathname.startsWith(link.href))
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
            className="text-sm text-gray-400 hover:text-white"
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
