import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Agency Project Visibility — Give Clients Clarity Without Exposing Your Internal Chaos",
  description: "The internal vs. external view architecture, and how to give clients the right grain of project detail without exposing your internal tool complexity to external stakeholders.",
  keywords: ["agency project visibility for clients", "client-facing project updates", "internal vs external project view agency", "what to show clients about projects"],
  alternates: { canonical: "https://agency-os.tech/blog/agency-infrastructure/agency-project-visibility" },
  openGraph: { title: "Agency Project Visibility — Give Clients Clarity Without Exposing Your Internal Chaos", url: "https://agency-os.tech/blog/agency-infrastructure/agency-project-visibility", type: "article" },
};

const C = { bg: "#0B0B0F", surface: "#12121A", border: "#1F1F2B", muted: "#9CA3AF", primary: "#10b981", accent: "#5B5CF6" };

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "Agency Project Visibility — Give Clients Clarity Without Giving Them Access to Everything",
  image: "https://agency-os.tech/og-image.png",
  author: { "@type": "Organization", name: "Agency OS", url: "https://agency-os.tech" },
  publisher: { "@id": "https://agency-os.tech/#organization" },
  datePublished: "2026-03-30", dateModified: "2026-03-30",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://agency-os.tech/blog/agency-infrastructure/agency-project-visibility" },
};
const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What should clients be able to see about their project?", acceptedAnswer: { "@type": "Answer", text: "Clients should see outcome-level and phase-level visibility: what was delivered, what phase is currently active, and what comes next. They should not see internal subtasks, team conversations, technical blockers, or anything that requires context to interpret correctly." } },
    { "@type": "Question", name: "What happens when you give clients too much project access?", acceptedAnswer: { "@type": "Answer", text: "When clients see your internal task board, they experience information overload, interpret internal blockers as project risks, see jargon they can't understand, and may accidentally access sensitive data like your margin calculations or team rates." } },
    { "@type": "Question", name: "How does Agency OS separate internal and client-facing views?", acceptedAnswer: { "@type": "Answer", text: "Agency OS uses a dual-layer architecture. Your team works in the internal dashboard with full task and communication access. Clients see only a curated portal view you control — structurally separated so there is no risk of accidental data exposure." } },
  ],
};

export default function AgencyProjectVisibility() {
  return (
    <main style={{ background: C.bg, color: "#fff", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "Agency Project Visibility — Give Clients Clarity Without Exposing Your Internal Chaos", author: { "@type": "Organization", name: "Agency OS" }, publisher: { "@id": "https://agency-os.tech/#organization" }, datePublished: "2026-03-30", mainEntityOfPage: { "@type": "WebPage", "@id": "https://agency-os.tech/blog/agency-infrastructure/agency-project-visibility" } }) }} />

      <header style={{ maxWidth: 780, margin: "0 auto", padding: "72px 24px 48px" }}>
        <Link href="/blog" style={{ fontSize: 13, color: C.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>← All posts</Link>
        <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 999, background: `${C.primary}15`, border: `1px solid ${C.primary}30`, color: C.primary, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 20 }}>Agency Infrastructure Ops</div>
        <h1 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.6rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 20 }}>
          Agency Project Visibility —{" "}
          <span style={{ background: "linear-gradient(135deg, #34D399, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Give Clients Clarity Without Giving Them Access to Everything</span>
        </h1>
        <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>
          Agency project visibility is the practice of deliberately curating the level of project detail that clients can see — giving them enough information to feel informed and confident, without exposing the operational complexity that would create confusion, anxiety, or micro-management.
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "#555566" }}>
          <span>By Agency OS</span><span>·</span><span>March 30, 2026</span><span>·</span><span>8 min read</span>
        </div>
      </header>

      <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 96px" }}>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>The Core Problem: Sharing Too Much vs. Too Little</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>What Happens When You Show Clients Your Internal ClickUp Board</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { issue: "Information Overload", detail: "Clients see 200 subtasks and have no idea which ones matter. They focus on the 3 tasks marked as overdue and panic." },
              { issue: "Jargon Confusion", detail: "Internal task names ('Sprint 4 API – endpoint refactor') mean nothing to a client who paid for 'website improvements'." },
              { issue: "Unfiltered Concerns", detail: "A 'blocked' status on an internal ticket triggers a client email. The actual reason is trivial (waiting on a font license from the designer). But the client thinks the project is at risk." },
              { issue: "Security Risk", detail: "Most internal tools share more than you intend. Clients can stumble onto your rate cards, margin analysis, or internal communications about their scope." },
            ].map((item) => (
              <div key={item.issue} style={{ padding: 20, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>{item.issue}</div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>The Internal vs. External View Architecture</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>How to Separate What Your Team Sees From What Clients See</h3>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { view: "Internal View", audience: "Your Team", examples: ["Sub-task level detail (PR review, copywriting pass, feedback incorporation)", "Assignee names and workloads", "Time tracking and capacity data", "Blockers and technical dependencies"], color: "#9CA3AF" },
              { view: "External View", audience: "Your Client", examples: ["Milestone-level status (Discovery ✅, Design In Progress ⏳, Development 🔜)", "Time-to-completion for current phase", "Files and deliverables ready for review", "Approval requests with clearly described actions needed"], color: C.primary },
            ].map((view) => (
              <div key={view.view} style={{ padding: 24, background: C.surface, border: `1px solid ${view.color}40`, borderRadius: 14 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{view.view}</div>
                  <div style={{ fontSize: 12, color: view.color, background: `${view.color}18`, padding: "3px 10px", borderRadius: 6, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const }}>{view.audience}</div>
                </div>
                {view.examples.map((ex) => (<div key={ex} style={{ fontSize: 13, color: C.muted, marginBottom: 7, paddingLeft: 12, position: "relative" as const }}><span style={{ position: "absolute" as const, left: 0, color: view.color }}>·</span>{ex}</div>))}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>The "Right Grain" Principle — How Much Detail Is Too Much?</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>The 3-Level Visibility Framework</h3>
          {[
            { level: "Level 1: Outcome Visibility", description: "What the client paid for. 'Your new website is 60% complete.' No detail about how.", color: C.accent },
            { level: "Level 2: Phase Visibility", description: "Which stage of work is active. 'Design phase complete. Development begins Monday.'", color: "#F59E0B" },
            { level: "Level 3: Task Visibility", description: "Individual items. NEVER share this level with clients unless they explicitly request it and are technically sophisticated.", color: "#EF4444" },
          ].map((l) => (
            <div key={l.level} style={{ display: "flex", gap: 16, marginBottom: 14, padding: 20, background: C.surface, border: `1px solid ${l.color}30`, borderRadius: 14 }}>
              <div style={{ width: 4, borderRadius: 2, background: l.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{l.level}</div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{l.description}</p>
              </div>
            </div>
          ))}
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginTop: 20 }}>
            Most client portals should operate at Level 1–2 visibility. For a deeper technical implementation of how a platform enforces this separation, read our guide to{" "}
            <Link href="/blog/client-portal/what-is-client-portal" style={{ color: C.accent, textDecoration: "underline" }}>what a client portal must include</Link>.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>How Agency OS Enforces Visibility Partitioning</h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            Agency OS uses a dual-layer architecture: your team works in the internal dashboard (with access to all task detail, communication history, and client metadata), while clients see only a curated portal view that you control. No accidental exposure of internal data — because the two surfaces are structurally separated.
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Connecting Visibility to Approvals</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>
            Phase-level visibility works best when paired with phase-level approvals. When a client sees that Design is complete, they can approve it in one click — advancing the project cleanly. For the full approval workflow framework, see our guide to{" "}
            <Link href="/blog/client-portal/client-approval-workflow" style={{ color: C.accent, textDecoration: "underline" }}>building a milestone-based client approval workflow</Link>.
          </p>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>How to Introduce the Visibility System to Existing Clients</h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            The easiest moment to set visibility expectations is during onboarding. For new clients going through your{" "}
            <Link href="/blog/agency-infrastructure/client-onboarding-system" style={{ color: C.accent, textDecoration: "underline" }}>structured agency onboarding system</Link>
            , introduce the portal in the kickoff call and explain exactly what they'll see and won't see.
          </p>
        </section>

        <div style={{ textAlign: "center", padding: "48px 32px", background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.08), transparent 70%)`, border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>Control exactly what your clients see. Start free.</h2>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: C.accent, color: "#fff", fontWeight: 600, borderRadius: 12, textDecoration: "none", boxShadow: "0 0 24px rgba(91,92,246,0.35)" }}>
            Start free with Agency OS →
          </Link>
        </div>
      </article>
    </main>
  );
}
