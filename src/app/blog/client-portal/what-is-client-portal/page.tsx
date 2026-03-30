import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Is a Client Portal for Agencies? (The Complete 2026 Guide)",
  description:
    "A client portal for agencies is a secure, branded web interface that gives clients on-demand project visibility without requiring manual email updates. Learn what it must include, how it differs from Notion, and how to choose the right one.",
  keywords: ["client portal for agencies", "agency client portal software", "client visibility tool", "read-only project portal"],
  alternates: { canonical: "https://agency-os.tech/blog/client-portal/what-is-client-portal" },
  openGraph: {
    title: "What Is a Client Portal for Agencies? (The Complete 2026 Guide)",
    description: "Eliminate the 'what's the status?' question permanently with a structured client portal. Here's everything agencies need to know.",
    url: "https://agency-os.tech/blog/client-portal/what-is-client-portal",
    type: "article",
  },
};

const C = { bg: "#0B0B0F", surface: "#12121A", border: "#1F1F2B", muted: "#9CA3AF", primary: "#5B5CF6", accent: "#8B5CF6" };

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Is a Client Portal for Agencies? (The Complete 2026 Guide)",
  description: "A definitive guide covering what client portals are, what they must include, and how to choose the right one for your agency.",
  author: { "@type": "Organization", name: "Agency OS", url: "https://agency-os.tech" },
  publisher: { "@id": "https://agency-os.tech/#organization" },
  datePublished: "2026-03-30",
  dateModified: "2026-03-30",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://agency-os.tech/blog/client-portal/what-is-client-portal" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What should a client portal include?", acceptedAnswer: { "@type": "Answer", text: "A client portal for agencies should include real-time project status visibility, milestone tracking, secure file delivery, role-based access control, and a digital approval or sign-off system. The best portals show clients a clear Done / In Progress / Next framework without exposing internal task details." } },
    { "@type": "Question", name: "Is a client portal the same as a project management tool?", acceptedAnswer: { "@type": "Answer", text: "No. A project management tool like ClickUp or Asana is an internal system where your team works. A client portal is the external, curated layer that clients see — designed to show progress and build confidence, not expose internal complexity." } },
    { "@type": "Question", name: "How is Agency OS different from Notion as a client portal?", acceptedAnswer: { "@type": "Answer", text: "Notion requires manual setup of databases and permission structures, and one wrong permission grants clients access to your internal salary docs or margin sheets. Agency OS is purpose-built for the client-facing layer with partitioned access, role-based permissions, and a structured milestone framework out of the box." } },
  ],
};

function Section({ label, color = C.primary }: { label: string; color?: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 999, background: `${color}15`, border: `1px solid ${color}30`, color, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 20 }}>
      {label}
    </div>
  );
}

function CheckItem({ children }: { children: string }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 10 }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(16,185,129,0.12)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, fontSize: 11 }}>✓</span>
      {children}
    </li>
  );
}

function CrossItem({ children }: { children: string }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 10 }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(239,68,68,0.12)", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, fontSize: 11 }}>✕</span>
      {children}
    </li>
  );
}

export default function WhatIsClientPortal() {
  return (
    <main style={{ background: C.bg, color: "#fff", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <header style={{ maxWidth: 780, margin: "0 auto", padding: "72px 24px 48px" }}>
        <Link href="/blog" style={{ fontSize: 13, color: C.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          ← All posts
        </Link>
        <Section label="Client Portal Mastery" />
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 20 }}>
          What Is a Client Portal for Agencies?{" "}
          <span style={{ background: "linear-gradient(135deg, #818CF8, #C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            The Complete 2026 Guide
          </span>
        </h1>
        <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>
          A client portal for agencies is a secure, branded web interface that gives clients on-demand visibility into their project's status, milestones, and deliverables — without requiring the agency to send a single manual email update.
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "#555566" }}>
          <span>By Agency OS</span>
          <span>·</span>
          <span>March 30, 2026</span>
          <span>·</span>
          <span>12 min read</span>
        </div>
      </header>

      {/* Article body */}
      <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 96px" }}>

        {/* The Problem */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Why Traditional Client Communication Fails Modern Agencies
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            The average agency account manager spends 3–5 hours per week writing status update emails. Multiply that by 10 active clients and you've burned two full workdays updating people who could have just... checked a link.
          </p>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
            The deeper problem is not the time cost — it's the information asymmetry. Your team knows everything. Your client knows nothing until you decide to send an email. That gap creates what clients privately call "the black box" — and it's the root cause of most agency churn.
          </p>

          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>The "Status Update" Overhead Problem — Quantified</h3>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { value: "3–5 hrs", label: "Per PM per week on status emails" },
                { value: "62%", label: "Of clients report feeling 'in the dark'" },
                { value: "80%", label: "Reduction in check-in requests with a portal" },
                { value: "$180K+", label: "Annual PM time saved for a 10-person agency" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.primary, letterSpacing: "-0.03em" }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What it includes */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            What Should a Client Portal Include?
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
            Not all portals are created equal. A basic shared Notion page technically qualifies, but collapses at scale and leaks sensitive data. An agency-grade client portal must include these five pillars:
          </p>
          {[
            { title: "Real-Time Project Status Visibility", body: "Clients should see what is Done, what is In Progress, and what is Next — without needing to interpret internal task lists, developer jargon, or design phases they don't understand." },
            { title: "Milestone Approval and Sign-Off Workflows", body: "Verbal approvals evaporate in scope disputes. A proper portal captures digital sign-offs with timestamps, creating an immutable audit trail that protects both parties." },
            { title: "Secure File and Asset Delivery", body: "Final deliverables should be downloadable directly from the portal — not buried in email threads or shared Drive folders with broken permissions." },
            { title: "Role-Based Access Control for Clients", body: "The client should only see what you choose to expose. A client-facing portal is a curated view, not a window into your entire operation." },
            { title: "Branded, Premium Experience", body: "Your portal should look like it belongs to your agency—your logo, your domain, your colors. The experience should reinforce the premium you charge." },
          ].map((item, i) => (
            <div key={i} style={{ padding: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 14 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>{item.body}</p>
            </div>
          ))}
        </section>

        {/* Comparison */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Client Portal vs. Shared Spreadsheet vs. Notion — What's the Difference?
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#0D0D13" }}>
                  {["Feature", "Client Portal (Agency OS)", "Notion", "Shared Spreadsheet"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#6B7280", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Branded experience", "✓ Native white-labeling", "⚠ Manual setup", "✕ Not possible"],
                  ["Access partitioning", "✓ Role-based by default", "⚠ Requires setup, error-prone", "✕ Not possible"],
                  ["Digital approvals", "✓ Built-in with audit trail", "✕ Not available", "✕ Not available"],
                  ["Real-time updates", "✓ Push notifications", "⚠ Manual page edits", "✕ Manual entry"],
                  ["Security risk", "✓ Zero — partitioned", "⚠ High — permission errors common", "✕ Very high"],
                ].map(([feature, ...vals], i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#E5E7EB" }}>{feature}</td>
                    {vals.map((v, j) => (
                      <td key={j} style={{ padding: "14px 16px", color: v.startsWith("✓") ? "#10b981" : v.startsWith("⚠") ? "#F59E0B" : "#EF4444" }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 40, marginBottom: 14 }}>Why Notion Leaks Sensitive Internal Data</h3>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8 }}>
            Sharing a Notion page gives clients access to your entire workspace structure unless you manually configure every database property and view filter. One drag-and-drop accident can expose your internal pricing, team salaries, or margin calculations. This is not a hypothetical edge case — it's a documented pattern in agencies using Notion as a client-facing tool.
          </p>
        </section>

        {/* How to choose */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            How to Choose the Right Client Portal Software in 2026
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
            For a thorough comparison of every platform on the market, read our{" "}
            <Link href="/blog/client-portal/client-portal-software" style={{ color: C.primary, textDecoration: "underline" }}>
              guide to the best client portal software for agencies in 2026
            </Link>
            . Before you evaluate vendors, ask these questions:
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <CheckItem>Does it support custom domains so clients don't see a third-party brand name?</CheckItem>
            <CheckItem>Can clients approve deliverables and generate a time-stamped audit trail?</CheckItem>
            <CheckItem>Is access control granular — can I show Client A only their project and nothing else?</CheckItem>
            <CheckItem>Does it integrate with the tools my team already uses (Slack, Gmail, ClickUp)?</CheckItem>
            <CrossItem>Does it require my team to learn a new project management workflow entirely?</CrossItem>
            <CrossItem>Does it expose clients to internal task details or team communications?</CrossItem>
          </ul>
        </section>

        {/* Agency OS approach */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            How Agency OS Functions as a Client Experience Infrastructure Layer
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
            Agency OS is not a project management tool. It is the{" "}
            <Link href="/blog/agency-infrastructure/agency-management-software" style={{ color: C.primary, textDecoration: "underline" }}>
              client-facing layer in your agency's management stack
            </Link>
            {" "}— separate from your internal ClickUp or Notion setup, connected to it via updates your team publishes.
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>The "Done / In Progress / Next" Framework Explained</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { col: "Done ✅", color: "#10b981", desc: "Completed milestones with timestamps. Clients see concrete proof of progress without needing to ask." },
              { col: "In Progress ⏳", color: C.primary, desc: "The active sprint. Shown with a pulsing indicator so clients know the engine is running." },
              { col: "Next 🔜", color: C.muted, desc: "What comes after. Grayed out until active — sets expectations and prevents scope expansion." },
            ].map((item) => (
              <div key={item.col} style={{ padding: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: item.color, marginBottom: 10 }}>{item.col}</div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Frequently Asked Questions About Client Portals
          </h2>
          {[
            { q: "What should a client portal include?", a: "A client portal for agencies should include real-time project status visibility, milestone tracking, secure file delivery, role-based access control, and a digital approval or sign-off system. The best portals show clients a clear Done / In Progress / Next framework without exposing internal task details." },
            { q: "Is a client portal the same as a project management tool?", a: "No. A project management tool like ClickUp or Asana is an internal system where your team works. A client portal is the external, curated layer that clients see — designed to show progress and build confidence, not expose internal complexity." },
            { q: "How is Agency OS different from Notion as a client portal?", a: "Notion requires manual setup of databases and permission structures, and one wrong permission grants clients access to your internal salary docs or margin sheets. Agency OS is purpose-built for the client-facing layer with partitioned access, role-based permissions, and a structured milestone framework out of the box." },
          ].map((faq) => (
            <div key={faq.q} style={{ padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{faq.q}</h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75 }}>{faq.a}</p>
            </div>
          ))}
        </section>

        {/* Internal links */}
        <section style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Continue Learning</h3>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            <Link href="/blog/client-portal/client-portal-vs-email" style={{ color: C.primary, fontSize: 14, textDecoration: "none" }}>
              → Why email-based client communication creates anxiety (and what to do instead)
            </Link>
            <Link href="/blog/client-portal/client-approval-workflow" style={{ color: C.primary, fontSize: 14, textDecoration: "none" }}>
              → Build a structured client approval workflow that prevents scope creep
            </Link>
            <Link href="/blog/client-portal/white-label-client-portal" style={{ color: C.primary, fontSize: 14, textDecoration: "none" }}>
              → White-label client portals for agencies — the competitive edge explained
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "48px 32px", background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(91,92,246,0.12), transparent 70%)`, border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>No credit card required · Setup in 15 minutes</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Build your first client portal in minutes.
          </h2>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: C.primary, color: "#fff", fontWeight: 600, borderRadius: 12, textDecoration: "none", boxShadow: "0 0 24px rgba(91,92,246,0.35)" }}>
            Start free with Agency OS →
          </Link>
        </div>
      </article>
    </main>
  );
}
