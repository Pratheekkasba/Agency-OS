"use client";

import { WaitlistHero } from "@/components/ui/waitlist-hero";
import { Navbar } from "@/components/ui/navbar";
import {
  ArrowRight, BarChart3, Bot, CheckCircle2,
  Eye, Globe2, Inbox, Lock, RefreshCcw, Sparkles,
} from "lucide-react";
import { useState } from "react";

/* ─── DESIGN TOKENS ─── */
const C = {
  bg: "#0B0B0F",
  surface: "#12121A",
  primary: "#5B5CF6",
  accent: "#8B5CF6",
  text: "#FFFFFF",
  muted: "#9CA3AF",
  border: "#1F1F2B",
  borderHover: "#2A2A3A",
};

/* ─── DATA ─── */
const features = [
  {
    key: "portal",
    icon: <Eye className="w-5 h-5" />,
    color: C.primary,
    label: "Smart Client Portal",
    desc: "Give clients real-time visibility without sending a single email. Done, approved, and next—always clear. Let your clients view the complete project timeline, access secure files, and approve deliverables with ease.",
  },
  {
    key: "ai-inbox",
    icon: <Bot className="w-5 h-5" />,
    color: C.accent,
    label: "AI Inbox Triage",
    desc: "Auto-tag intent, draft replies, and route messages to the right owner—so nothing slips through.",
  },
  {
    key: "analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "#10b981",
    label: "Agency Analytics",
    desc: "Track response time, throughput, and satisfaction in one dashboard—know what to fix before clients feel it.",
  },
  {
    key: "shared-inbox",
    icon: <Inbox className="w-5 h-5" />,
    color: "#f59e0b",
    label: "Shared Team Inbox",
    desc: "One source of truth for every client thread. Assign, prioritize, and respond fast—without the chaos.",
  },
  {
    key: "security",
    icon: <Lock className="w-5 h-5" />,
    color: "#ec4899",
    label: "Enterprise Security",
    desc: "Role-based access and secure defaults from day one—built to earn trust with every client login.",
  },
  {
    key: "realtime",
    icon: <Globe2 className="w-5 h-5" />,
    color: "#06b6d4",
    label: "Real-Time Updates",
    desc: "Stay perfectly in sync across the team and client portal—no refresh, no status meetings.",
  },
];

const problems = [
  "Emails from clients piling up with no system",
  "10+ tools that don't talk to each other",
  "Clients asking 'what's the status?' every day",
  "No visibility into what your team is actually doing",
];

const steps = [
  { num: "01", icon: <RefreshCcw className="w-5 h-5" />, color: C.primary, title: "Connect your channels", desc: "Link Gmail, WhatsApp, and Slack in minutes. Everything flows into one place." },
  { num: "02", icon: <Sparkles className="w-5 h-5" />, color: C.accent, title: "AI handles the triage", desc: "Gemini tags intent, categorises messages, and drafts replies ready for your approval." },
  { num: "03", icon: <Eye className="w-5 h-5" />, color: "#10b981", title: "Clients see the truth", desc: "Share a read-only portal link. Status is always clear. Questions drop by 80%." },
];

const stats = [
  { value: "10×", label: "Faster client onboarding" },
  { value: "3 hrs", label: "Saved daily on emails" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "120+", label: "Agencies on waitlist" },
];

/* ─── COMPONENTS ─── */

function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 15,
        background: C.primary,
        boxShadow: `0 0 20px rgba(91,92,246,0.35)`,
      }}
    >
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:border-[#3A3A4A]"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 15,
        color: C.muted,
        border: `1px solid ${C.borderHover}`,
        background: "transparent",
      }}
    >
      {children}
    </button>
  );
}

function FeatureCard({
  f,
  variant = "small",
  className = "",
}: {
  f: (typeof features)[number];
  variant?: "big" | "small";
  className?: string;
}) {
  const isBig = variant === "big";
  return (
    <div
      className={[
        "relative h-full overflow-hidden rounded-2xl border border-[#1F1F2B] bg-[#12121A]",
        "transition-all duration-300 hover:border-[#2A2A3A] hover:shadow-[0_0_30px_rgba(91,92,246,0.15)]",
        "before:absolute before:top-0 before:left-0 before:h-px before:w-full",
        "before:bg-gradient-to-r before:from-transparent before:via-purple-500/70 before:to-transparent",
        isBig ? "p-8" : "p-6",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 rounded-lg bg-white/5 p-2"
          style={{ color: f.color }}
        >
          {f.icon}
        </div>

        <div className="min-w-0">
          <h3
            className={[
              "text-white font-semibold",
              isBig ? "text-xl" : "text-lg",
            ].join(" ")}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {f.label}
          </h3>
          <p
            className="mt-2 text-sm text-gray-400 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {f.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE ─── */
export default function Home() {
  return (
    <main style={{ background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", overflowX: "hidden", minHeight: "100vh" }}>

      {/* Ambient glow — very subtle */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div style={{ position: "absolute", top: 0, left: "15%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.primary}0b 0%, transparent 70%)` }} />
        <div style={{ position: "absolute", top: "40%", right: 0, width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}08 0%, transparent 70%)` }} />
      </div>

      {/* ── NAVBAR ── */}
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative w-full z-10">
        <WaitlistHero />
      </section>

      {/* ── STATS STRIP ── */}
      <section className="relative z-10 w-full" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,0.012)" }}>
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 700, color: C.text, lineHeight: 1.1 }}>
                {s.value}
              </div>
              <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="relative z-10 w-full py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left: problem statement */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.muted }}
            >
              The problem
            </div>
            <h2
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem,4vw,2.25rem)", fontWeight: 600, lineHeight: 1.25, color: C.text, marginBottom: 16 }}
            >
              Agencies today juggle
              <br />
              <span style={{ color: C.muted }}>10+ tools.</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: C.muted, marginBottom: 28 }}>
              Emails, Slack, Notion, WhatsApp, spreadsheets. Everything is scattered. Nothing is clear. Your team is context-switching all day and your clients are in the dark.
            </p>
            <ul className="flex flex-col gap-3">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3" style={{ fontSize: 14, color: C.muted }}>
                  <span className="mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center rounded-full" style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>
                    ✕
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: solution */}
          <div
            className="relative rounded-2xl p-8 overflow-hidden"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            {/* Top shimmer */}
            <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.primary}60, transparent)` }} />

            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6"
              style={{ background: `${C.primary}15`, border: `1px solid ${C.primary}30`, color: C.primary }}
            >
              The solution
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 12, lineHeight: 1.3 }}>
              Agency OS brings everything into one place.
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: C.muted, marginBottom: 24 }}>
              One login. Client portals, AI inbox, project tracking, and analytics — unified and working together from day one.
            </p>
            <div className="flex flex-col gap-3">
              {["Client portal visible to clients — not just you", "Every message triaged and pre-drafted by AI", "Your whole team, one shared view"].map((item) => (
                <div key={item} className="flex items-start gap-3" style={{ fontSize: 14, color: C.muted }}>
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#10b981" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        className="relative z-10 w-full py-24"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-gray-400 mb-5">
              Features
            </div>
            <h2
              className="text-white font-semibold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(2rem,4vw,2.5rem)",
                lineHeight: 1.15,
              }}
            >
              Everything you need to{" "}
              <span
                className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-200 bg-clip-text text-transparent"
              >
                run your agency
              </span>
              .
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl leading-relaxed">
              Replace scattered tools with one system built for agency operations—client visibility, message triage, execution, and clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.key} f={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 w-full py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-5"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.muted }}
            >
              Simple by design
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem,4vw,2.25rem)", fontWeight: 600, lineHeight: 1.25, color: C.text }}>
              Up and running in 3 steps.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((s) => (
              <div key={s.num} className="relative p-6 rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${s.color}60, transparent)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${s.color}15`, color: s.color }}>
                  {s.icon}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: "0.12em", marginBottom: 8 }}>
                  STEP {s.num}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: C.text, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section className="relative z-10 w-full py-14 px-6" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-4xl mx-auto text-center">
          <p style={{ fontSize: 12, color: "#3a3a4a", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 }}>
            Works with the tools you already use
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8" style={{ opacity: 0.3, filter: "grayscale(1)" }}>
            {["Slack", "Gmail", "WhatsApp", "Notion", "Figma", "Discord", "Telegram", "LinkedIn"].map((name) => (
              <span key={name} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: "#fff" }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 w-full py-28 md:py-36 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${C.primary}12, transparent 70%)` }} />
        <div className="max-w-2xl mx-auto relative text-center">
          <div
            className="relative rounded-2xl px-10 py-16 overflow-hidden"
            style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: `0 0 60px ${C.primary}12` }}
          >
            <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.primary}80, ${C.accent}60, transparent)` }} />

            <div className="flex items-center justify-center gap-2 mb-3" style={{ fontSize: 13, color: C.muted }}>
              <CheckCircle2 className="w-4 h-4" style={{ color: "#10b981" }} />
              <span>No credit card required · Setup in minutes</span>
            </div>

            <h2
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 700, lineHeight: 1.2, color: C.text, marginBottom: 12 }}
            >
              Your agency&apos;s unfair{" "}
              <span style={{ color: C.primary }}>advantage.</span>
            </h2>

            <p style={{ fontSize: 16, color: C.muted, maxWidth: 380, margin: "0 auto 28px", lineHeight: 1.7 }}>
              Join 120+ agency founders who got early access. Spots are limited.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <PrimaryBtn onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Get Early Access <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
              <GhostBtn>See How It Works</GhostBtn>
            </div>

            <p style={{ fontSize: 12, color: "#333344", marginTop: 20 }}>⚡ Limited early access · Next cohort fills fast</p>

            <div className="absolute bottom-0 left-1/4 right-1/4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.primary}40, transparent)` }} />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-10 px-6" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: C.text }}>Agency OS.</div>
          <p style={{ fontSize: 13, color: "#333344" }}>© 2025 Agency OS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 13, color: C.muted, textDecoration: "none" }} className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
