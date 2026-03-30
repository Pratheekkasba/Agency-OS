"use client";

import { Navbar } from "@/components/ui/navbar";
import { WaitlistHero } from "@/components/ui/waitlist-hero";

const C = {
  bg: "#0B0B0F",
  text: "#FFFFFF",
  muted: "#9CA3AF",
};

export default function WaitlistPage() {
  return (
    <main
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Sora', sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      <section className="pt-20 md:pt-24">
        <WaitlistHero />
      </section>

      <section className="px-6 pb-16 md:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: C.muted,
            }}
          >
            You&apos;ll be the first to know when new cohorts open. Early users
            get lifetime benefits, behind‑the‑scenes product updates, and a
            direct line to the founding team.
          </p>
          <p
            className="mt-3 text-xs"
            style={{ color: "#6b7280" }}
          >
            No spam. Only product updates.
          </p>
        </div>
      </section>
    </main>
  );
}

