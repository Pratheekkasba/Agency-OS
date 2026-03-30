"use client";

import Link from "next/link";


const silos = [
  {
    tag: "Client Portal Mastery",
    color: "#5B5CF6",
    posts: [
      {
        href: "/blog/client-portal/what-is-client-portal",
        title: "What Is a Client Portal for Agencies? (The Complete 2026 Guide)",
        excerpt:
          "A definitive guide covering what client portals are, what they must include, and how to choose the right one for your agency.",
        keyword: "client portal for agencies",
        readTime: "12 min",
      },
      {
        href: "/blog/client-portal/client-portal-software",
        title: "The 7 Best Client Portal Software Platforms for Agencies in 2026",
        excerpt:
          "A ranked comparison of agency-grade client portal software — covering features, pricing, and which tools are actually built for client-facing work.",
        keyword: "best client portal software for agencies 2026",
        readTime: "10 min",
      },
      {
        href: "/blog/client-portal/client-portal-vs-email",
        title: "Client Portal vs. Email Updates — Why Agencies Are Switching in 2026",
        excerpt:
          "The hidden cost of weekly status emails, why clients keep asking 'what's the status?', and how a portal fixes the root cause permanently.",
        keyword: "replace client email updates with portal",
        readTime: "8 min",
      },
      {
        href: "/blog/client-portal/white-label-client-portal",
        title: "White-Label Client Portal Software — The Agency's Competitive Edge in 2026",
        excerpt:
          "How a custom-domain, white-label client portal commands premium pricing and reduces churn by up to 40%.",
        keyword: "white label client portal software",
        readTime: "9 min",
      },
      {
        href: "/blog/client-portal/client-approval-workflow",
        title: "How to Build a Client Approval Workflow That Prevents Scope Creep",
        excerpt:
          "A bulletproof 5-stage approval workflow with digital sign-offs, audit trails, and implementation playbook for any agency.",
        keyword: "client approval workflow for agencies",
        readTime: "8 min",
      },
    ],
  },
  {
    tag: "Agency Infrastructure Ops",
    color: "#10b981",
    posts: [
      {
        href: "/blog/agency-infrastructure/agency-management-software",
        title: "Agency Management Software — The Definitive 2026 Buyer's Guide",
        excerpt:
          "The 7 core functions every agency management platform must cover, and why most tools only solve half the problem.",
        keyword: "agency management software",
        readTime: "14 min",
      },
      {
        href: "/blog/agency-infrastructure/client-communication-tools",
        title: "The Best Client Communication Tools for Agencies in 2026 (Ranked)",
        excerpt:
          "From proactive update systems to real-time chat — ranked by what actually drives client retention and referral rates.",
        keyword: "client communication tools for agencies",
        readTime: "10 min",
      },
      {
        href: "/blog/agency-infrastructure/reduce-client-status-questions",
        title: "How to Stop Clients From Constantly Asking for Status Updates (For Good)",
        excerpt:
          "The information asymmetry root cause, the three wrong fixes most agencies try, and a 3-step implementation playbook.",
        keyword: "how to stop clients asking for status updates",
        readTime: "7 min",
      },
      {
        href: "/blog/agency-infrastructure/agency-project-visibility",
        title: "Agency Project Visibility — How to Give Clients Clarity Without Giving Them Access to Everything",
        excerpt:
          "The internal vs. external view architecture, and how to give clients the right grain of detail without exposing your internal chaos.",
        keyword: "agency project visibility for clients",
        readTime: "8 min",
      },
      {
        href: "/blog/agency-infrastructure/client-onboarding-system",
        title: "How to Build a Client Onboarding System That Retains Clients for Years",
        excerpt:
          "The 5 pillars of world-class agency onboarding, a copy-paste checklist, and how to set expectations that prevent 30-day churn.",
        keyword: "client onboarding system for agencies",
        readTime: "10 min",
      },
    ],
  },
];

const C = {
  bg: "#0B0B0F",
  surface: "#12121A",
  border: "#1F1F2B",
  muted: "#9CA3AF",
};

export default function BlogIndex() {
  return (
    <main style={{ background: C.bg, minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 14px",
            borderRadius: 999,
            background: "rgba(91,92,246,0.1)",
            border: "1px solid rgba(91,92,246,0.3)",
            color: "#A4A6FF",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 24,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
          }}
        >
          Agency OS Knowledge Base
        </div>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            marginBottom: 16,
          }}
        >
          Practical guides for agencies who take{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #818CF8, #C084FC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            client experience seriously
          </span>
          .
        </h1>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 640, margin: "0 auto", lineHeight: 1.7 }}>
          No filler. No generic tips. Actionable frameworks on client portals, agency operations, and the systems that turn one-off projects into long-term retainers.
        </p>
      </section>

      {/* Silos */}
      {silos.map((silo) => (
        <section key={silo.tag} style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 4, height: 28, borderRadius: 2, background: silo.color }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{silo.tag}</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            {silo.posts.map((post) => (
              <Link
                key={post.href}
                href={post.href}
                style={{ textDecoration: "none" }}
              >
                <article
                  style={{
                    padding: 28,
                    borderRadius: 16,
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    height: "100%",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#2A2A3A";
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px rgba(91,92,246,0.12)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = C.border;
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: silo.color,
                        background: `${silo.color}18`,
                        padding: "3px 10px",
                        borderRadius: 6,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase" as const,
                      }}
                    >
                      {post.keyword}
                    </span>
                    <span style={{ fontSize: 11, color: "#555566" }}>{post.readTime} read</span>
                  </div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: 1.45,
                      color: "#FFFFFF",
                      marginBottom: 10,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{post.excerpt}</p>
                  <div
                    style={{
                      marginTop: 18,
                      fontSize: 13,
                      fontWeight: 600,
                      color: silo.color,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Read guide →
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* CTA Strip */}
      <section
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 8 }}>
          Ready to implement what you've learned?
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.02em" }}>
          Set up your client portal in 15 minutes.
        </h2>
        <Link
          href="/signup"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            background: "#5B5CF6",
            color: "#fff",
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 12,
            textDecoration: "none",
            boxShadow: "0 0 24px rgba(91,92,246,0.35)",
          }}
        >
          Start free with Agency OS →
        </Link>
      </section>
    </main>
  );
}
