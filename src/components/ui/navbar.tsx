"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const NAV = {
  ctaBg: "#5B5CF6",
  ctaHover: "#6D6EF7",
};

const NAV_ITEMS = [
  { label: "Product", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

function NavUnderline({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex items-center">
      <span>{children}</span>
      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/40 transition-transform duration-200 group-hover:scale-x-100" />
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "backdrop-blur-md border-b border-white/5" : "",
      ].join(" ")}
      style={{
        background: scrolled ? "rgba(0,0,0,0.80)" : "transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo + badge */}
        <div className="flex items-center gap-3">
          <div
            className="select-none"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              background:
                "linear-gradient(135deg, rgba(255,255,255,1), rgba(161,161,170,1))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Agency OS.
          </div>

          <div
            className="hidden lg:inline-flex items-center rounded-full px-3 py-1 text-[12px] tracking-wide"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "rgba(229,231,235,0.7)",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            ✨ Built for Modern Agencies
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            return (
              <a
                key={item.label}
                href={item.href}
                className="group text-[14px] font-medium tracking-wide text-gray-400 hover:text-white transition-colors duration-200"
                style={{ fontFamily: "'Inter', sans-serif", textDecoration: "none" }}
              >
                <NavUnderline>{item.label}</NavUnderline>
              </a>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden sm:inline-flex text-[14px] font-medium tracking-wide text-gray-400 hover:text-white transition-colors duration-200"
            style={{ fontFamily: "'Inter', sans-serif", textDecoration: "none" }}
          >
            <span className="group relative">
              <NavUnderline>Login</NavUnderline>
            </span>
          </a>

          <Link
            href="/signup"
            className={[
              "inline-flex items-center gap-2",
              "px-5 py-2.5 rounded-xl font-medium",
              "text-white transition-all duration-200",
              "shadow-[0_0_20px_rgba(91,92,246,0.4)]",
              "hover:shadow-[0_0_28px_rgba(91,92,246,0.55)] hover:scale-[1.03] active:scale-[0.98]",
            ].join(" ")}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              background: NAV.ctaBg,
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              (e.currentTarget as HTMLElement).style.background = NAV.ctaHover;
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              (e.currentTarget as HTMLElement).style.background = NAV.ctaBg;
            }}
          >
            Get Started <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
