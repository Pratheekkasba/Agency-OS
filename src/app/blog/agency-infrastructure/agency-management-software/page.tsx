import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Agency Management Software — The Definitive 2026 Buyer's Guide",
  description: "The 7 core functions every agency management platform must cover, why ClickUp and Asana are not agency management software, and how to structure your agency's technology stack.",
  keywords: ["agency management software", "agency operations platform", "all-in-one agency tool", "agency workflow software 2026"],
  alternates: { canonical: "https://agency-os.tech/blog/agency-infrastructure/agency-management-software" },
  openGraph: { title: "Agency Management Software — The Definitive 2026 Buyer's Guide", url: "https://agency-os.tech/blog/agency-infrastructure/agency-management-software", type: "article" },
};

const C = { bg: "#0B0B0F", surface: "#12121A", border: "#1F1F2B", muted: "#9CA3AF", primary: "#10b981", accent: "#5B5CF6" };

const functions_ = [
  { num: "1", title: "Client Relationship Management (Not CRM)", body: "Agency CRM is not Salesforce. It's the system of record for every client communication pattern, preference, and project history — accessible to every team member without digging through email." },
  { num: "2", title: "Project Visibility and Status Tracking", body: "Both internal (team-level) and external (client-level) visibility. These are different views serving different audiences — conflating them is where most agencies create operational chaos." },
  { num: "3", title: "Client Communication and Portal Access", body: "The channel through which you deliver status updates, documents, and approvals to clients. For a full deep-dive, read our guide to building a client portal as the foundation of your client stack." },
  { num: "4", title: "Deliverable Approval and Sign-Off", body: "Every agency needs a formalized path from 'delivered' to 'approved' with a documented trail. Without this, scope disputes are inevitable." },
  { num: "5", title: "Team Inbox and Message Triage", body: "A shared, assignable inbox for all incoming client messages — not individual email accounts that become black boxes when team members leave." },
  { num: "6", title: "Agency Analytics and Performance Metrics", body: "Response time, throughput, client satisfaction, and delivery accuracy. If you can't measure it, you can't improve it — and you can't justify raising rates." },
  { num: "7", title: "Integration with Existing Tool Stacks", body: "No agency is starting from zero. Your agency management software must connect to the tools your team already uses — Slack, Gmail, Google Drive, Figma, and ClickUp at minimum." },
];

export default function AgencyManagementSoftware() {
  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article",
    headline: "Agency Management Software — The Definitive 2026 Buyer's Guide",
    description: "The 7 core functions every agency management platform must cover, why ClickUp and Asana are not agency management software, and how to structure your agency's technology stack.",
    image: "https://agency-os.tech/og-image.png",
    author: { "@type": "Organization", name: "Agency OS", url: "https://agency-os.tech" },
    publisher: { "@id": "https://agency-os.tech/#organization" },
    datePublished: "2026-03-30", dateModified: "2026-03-30",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://agency-os.tech/blog/agency-infrastructure/agency-management-software" },
  };
  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is agency management software?", acceptedAnswer: { "@type": "Answer", text: "Agency management software is a category of operational SaaS platforms that centralizes client communication, project tracking, and team coordination into a unified system of record — replacing fragmented stacks of tools like ClickUp, email threads, and shared Notion docs." } },
      { "@type": "Question", name: "Is ClickUp an agency management tool?", acceptedAnswer: { "@type": "Answer", text: "No. ClickUp is an internal project management tool designed for the team building the work. Agency management software must also cover the client-facing communication layer — which ClickUp is not built to serve." } },
      { "@type": "Question", name: "What is the difference between agency management software and a client portal?", acceptedAnswer: { "@type": "Answer", text: "Agency management software covers the full operational surface of a service business — internal task management, team coordination, and client communication. A client portal is specifically the external, client-facing layer of this stack, showing clients project status, milestones, and approvals without internal complexity." } },
      { "@type": "Question", name: "How much does agency management software cost?", acceptedAnswer: { "@type": "Answer", text: "Agency management software ranges from free (Agency OS Starter) to $199+/month for enterprise white-label tiers with unlimited clients and AI triage features." } },
    ],
  };
  return (
    <main style={{ background: C.bg, color: "#fff", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header style={{ maxWidth: 780, margin: "0 auto", padding: "72px 24px 48px" }}>
        <Link href="/blog" style={{ fontSize: 13, color: C.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>← All posts</Link>
        <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 999, background: `${C.primary}15`, border: `1px solid ${C.primary}30`, color: C.primary, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 20 }}>Agency Infrastructure Ops</div>
        <h1 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.6rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 20 }}>
          Agency Management Software —{" "}
          <span style={{ background: "linear-gradient(135deg, #34D399, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The Definitive 2026 Buyer's Guide</span>
        </h1>
        <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>
          Agency management software is a category of operational SaaS platforms that centralizes client communication, project tracking, and team coordination into a unified system of record — replacing the fragmented stack of tools that causes context-switching, missed updates, and client-side anxiety for growing service businesses.
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "#555566" }}>
          <span>By Agency OS</span><span>·</span><span>March 30, 2026</span><span>·</span><span>14 min read</span>
        </div>
      </header>

      <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 96px" }}>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>What Is Agency Management Software?</h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            True agency management software is not the same as project management software. A project management tool (ClickUp, Asana, Jira) manages internal tasks. Agency management software manages the full operational surface of a service business — which includes both internal execution and the client relationship layer.
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Internal Operations Tools vs. Client-Facing Infrastructure</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ padding: 22, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>Internal Layer</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Where Your Team Works</div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>Task boards, Gantt charts, time tracking, team communication, internal docs. Optimized for the people building the work.</p>
            </div>
            <div style={{ padding: 22, background: C.surface, border: `1px solid ${C.primary}40`, borderRadius: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>Client Layer</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>What Your Clients See</div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>Milestone status, approvals, files, and updates. Optimized for the people funding the work.</p>
            </div>
          </div>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginTop: 20 }}>
            For a complete guide to{" "}
            <Link href="/blog/client-portal/what-is-client-portal" style={{ color: C.accent, textDecoration: "underline" }}>building a client portal as the foundation of your client stack</Link>, see our dedicated resource.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24 }}>The 7 Core Functions Every Agency Management Platform Must Cover</h2>
          {functions_.map((fn) => (
            <div key={fn.num} style={{ display: "flex", gap: 20, marginBottom: 16, padding: 22, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${C.primary}20`, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 800 }}>{fn.num}</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{fn.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                  {fn.body}
                  {fn.num === "3" && <>{" "}<Link href="/blog/client-portal/what-is-client-portal" style={{ color: C.accent, textDecoration: "underline" }}>building a client portal as the foundation of your client stack</Link>.</>}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Agency Management Software vs. Project Management Tools — A Critical Distinction</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Why ClickUp and Asana Are Not Agency Management Software</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            ClickUp and Asana are internal execution platforms. They have guest access features, but exposing clients to your internal task boards creates information overload and security risk. For a detailed comparison of{" "}
            <Link href="/blog/client-portal/client-portal-software" style={{ color: C.accent, textDecoration: "underline" }}>agency-grade client portal software alternatives</Link>, see our full review.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>How Top Agencies Structure Their Technology Stack</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>The "Internal Stack" vs. The "Client Stack" Framework</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { title: "Internal Stack", items: ["ClickUp — Task management", "Slack — Team communication", "Notion — Internal docs", "Figma — Design collaboration", "Google Workspace — Files"], color: "#9CA3AF" },
              { title: "Client Stack", items: ["Agency OS — Client portal & updates", "Magic link auth — No password friction", "White-label domain — Your branding", "Milestone approvals — Audit trail", "AI triage — Nothing slips"], color: C.primary },
            ].map((stack) => (
              <div key={stack.title} style={{ padding: 22, background: C.surface, border: `1px solid ${stack.color}40`, borderRadius: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: stack.color, marginBottom: 14 }}>{stack.title}</div>
                {stack.items.map((item) => (<div key={item} style={{ fontSize: 13, color: C.muted, marginBottom: 8, paddingLeft: 12, position: "relative" as const }}><span style={{ position: "absolute" as const, left: 0 }}>·</span>{item}</div>))}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Agency OS as Client Experience Infrastructure — A New Category</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Why the Client Layer Needs Its Own System</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>
            Mixing internal operations with client-facing communication creates ambiguity, security gaps, and a poor client experience. Agency OS functions as the{" "}
            <Link href="/blog/agency-infrastructure/client-communication-tools" style={{ color: C.accent, textDecoration: "underline" }}>dedicated client communication layer in the agency management stack</Link>
            {" "}— purpose-built for the moment a client asks "how's it going?" and you want the answer to already be visible.
          </p>
        </section>

        <div style={{ textAlign: "center", padding: "48px 32px", background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.08), transparent 70%)`, border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>Centralize your client communication with Agency OS.</h2>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: C.accent, color: "#fff", fontWeight: 600, borderRadius: 12, textDecoration: "none", boxShadow: "0 0 24px rgba(91,92,246,0.35)" }}>
            Start free with Agency OS →
          </Link>
        </div>
      </article>
    </main>
  );
}
