"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Wrench, LogOut, ArrowRight, Clock, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  const firstName = user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "#0B0B0F" }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute rounded-full"
          style={{
            top: "10%",
            left: "20%",
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(91,92,246,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "10%",
            right: "10%",
            width: 350,
            height: 350,
            background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5 border-b border-[#1F1F2B]" style={{ background: "rgba(11,11,15,0.85)", backdropFilter: "blur(12px)" }}>
        <span
          className="text-white font-bold text-lg"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Agency OS.
        </span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#9CA3AF] border border-[#1F1F2B] bg-[#12121A] hover:text-white hover:border-[#2A2A3A] transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>

      {/* Main card */}
      <div
        className="relative z-10 w-full max-w-lg text-center rounded-2xl p-10 overflow-hidden"
        style={{
          background: "#12121A",
          border: "1px solid #1F1F2B",
          boxShadow: "0 0 60px rgba(91,92,246,0.08)",
        }}
      >
        {/* Top shimmer */}
        <div
          className="absolute top-0 left-0 w-full h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(91,92,246,0.7), rgba(139,92,246,0.5), transparent)" }}
        />

        {/* Icon */}
        <div
          className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(91,92,246,0.1)", border: "1px solid rgba(91,92,246,0.2)" }}
        >
          <Wrench className="w-7 h-7" style={{ color: "#5B5CF6" }} />
        </div>

        {/* Greeting + heading */}
        <p
          className="text-sm mb-2"
          style={{ fontFamily: "'Inter', sans-serif", color: "#9CA3AF" }}
        >
          Hey, {firstName} 👋
        </p>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#FFFFFF", lineHeight: 1.2 }}
        >
          Dashboard is under
          <br />
          <span style={{ color: "#5B5CF6" }}>maintenance</span>
        </h1>
        <p
          className="text-sm leading-relaxed mb-8 max-w-sm mx-auto"
          style={{ fontFamily: "'Inter', sans-serif", color: "#9CA3AF" }}
        >
          We&apos;re building something powerful for you. Agency OS will be ready very soon — check back shortly.
        </p>

        {/* Progress items */}
        <div className="flex flex-col gap-3 text-left mb-8">
          {[
            { label: "Authentication & user accounts", done: true },
            { label: "Client portal (read-only view)", done: true },
            { label: "Agency dashboard & client management", done: false },
            { label: "AI inbox triage with Gemini", done: false },
            { label: "Webhook integrations", done: false },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1F1F2B" }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: item.done ? "#10b981" : "#1F1F2B", boxShadow: item.done ? "0 0 8px rgba(16,185,129,0.6)" : "none" }}
              />
              <span
                className="text-sm"
                style={{ color: item.done ? "#D1D5DB" : "#4B5563", fontFamily: "'Inter', sans-serif" }}
              >
                {item.label}
              </span>
              {item.done && (
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  Live
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ETA badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-6"
          style={{ background: "rgba(91,92,246,0.08)", border: "1px solid rgba(91,92,246,0.2)", color: "#9CA3AF" }}
        >
          <Clock className="w-3.5 h-3.5" style={{ color: "#5B5CF6" }} />
          Coming very soon · We&apos;re actively building
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#8B5CF6" }} />
        </div>

        {/* CTA */}
        <a
          href="/portal"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            fontFamily: "'Inter', sans-serif",
            background: "#5B5CF6",
            color: "#fff",
            boxShadow: "0 0 20px rgba(91,92,246,0.25)",
            textDecoration: "none",
          }}
        >
          View client portal
          <ArrowRight className="w-4 h-4" />
        </a>

        {/* Bottom shimmer */}
        <div
          className="absolute bottom-0 left-1/4 right-1/4 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(91,92,246,0.4), transparent)" }}
        />
      </div>

      {/* Footer note */}
      <p
        className="relative z-10 mt-6 text-xs"
        style={{ color: "#333344", fontFamily: "'Inter', sans-serif" }}
      >
        Your account is set up and secure. Dashboard unlocks soon.
      </p>
    </div>
  );
}
