import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Build a Client Approval Workflow That Prevents Scope Creep",
  description: "A bulletproof 5-stage client approval workflow with digital sign-offs, audit trails, and a copy-paste implementation playbook for any agency.",
  keywords: ["client approval workflow for agencies", "milestone sign-off process", "client deliverable approval system", "digital client approval audit trail"],
  alternates: { canonical: "https://agency-os.tech/blog/client-portal/client-approval-workflow" },
  openGraph: { title: "How to Build a Client Approval Workflow That Prevents Scope Creep", url: "https://agency-os.tech/blog/client-portal/client-approval-workflow", type: "article" },
};

const C = { bg: "#0B0B0F", surface: "#12121A", border: "#1F1F2B", muted: "#9CA3AF", primary: "#5B5CF6" };

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "How to Build a Client Approval Workflow That Prevents Scope Creep",
  image: "https://agency-os.tech/og-image.png",
  author: { "@type": "Organization", name: "Agency OS", url: "https://agency-os.tech" },
  publisher: { "@id": "https://agency-os.tech/#organization" },
  datePublished: "2026-03-30", dateModified: "2026-03-30",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://agency-os.tech/blog/client-portal/client-approval-workflow" },
};
const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do agencies prevent scope creep?", acceptedAnswer: { "@type": "Answer", text: "Agencies prevent scope creep by implementing a formal milestone approval workflow with digital sign-offs and timestamps. When every deliverable requires explicit digital approval before the project advances, informal requests to 'just add one thing' are replaced by a documented change order process." } },
    { "@type": "Question", name: "Is an email approval legally binding for agencies?", acceptedAnswer: { "@type": "Answer", text: "Verbal and informal email approvals are generally not considered legally binding in scope disputes. Courts and arbitration panels categorically dismiss 'Looks good, go ahead!' messages. A timestamped digital approval with audit trail is significantly more defensible." } },
    { "@type": "Question", name: "What should a client approval workflow include?", acceptedAnswer: { "@type": "Answer", text: "A client approval workflow should include: milestone scoping with client-readable names, deliverable upload to a shared portal, structured 48-hour feedback collection, digital sign-off with timestamp and audit trail, and phase lock preventing changes without a formal change order." } },
  ],
};

const stages = [
  { num: "01", title: "Milestone Scoping and Definition", body: "Before the project begins, define every deliverable with a clear, client-readable name. Not 'Sprint 3 backend tasks' — 'Payment Processing Integration Complete'. Clients approve what they understand." },
  { num: "02", title: "Deliverable Upload and Presentation", body: "When a milestone is ready, upload the deliverable to the portal and write a 3-sentence description of what was built, what decision it enables, and what comes next." },
  { num: "03", title: "Structured Feedback Collection", body: "Set a 48-hour feedback window. The client leaves feedback inside the portal (not via email). This keeps all feedback in one place and creates a record." },
  { num: "04", title: "Digital Sign-Off with Timestamp", body: "The client clicks 'Approve'. The portal records their name, timestamp, and IP address. This is your protection against 'I never approved that' scope creep." },
  { num: "05", title: "Phase Lock and Project Advance", body: "Once approved, the milestone is locked. No further changes without a formal change order. The project advances to the next phase." },
];

export default function ClientApprovalWorkflow() {
  return (
    <main style={{ background: C.bg, color: "#fff", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "How to Build a Client Approval Workflow That Prevents Scope Creep", author: { "@type": "Organization", name: "Agency OS" }, publisher: { "@id": "https://agency-os.tech/#organization" }, datePublished: "2026-03-30", mainEntityOfPage: { "@type": "WebPage", "@id": "https://agency-os.tech/blog/client-portal/client-approval-workflow" } }) }} />

      <header style={{ maxWidth: 780, margin: "0 auto", padding: "72px 24px 48px" }}>
        <Link href="/blog" style={{ fontSize: 13, color: C.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>← All posts</Link>
        <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 999, background: `${C.primary}15`, border: `1px solid ${C.primary}30`, color: C.primary, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 20 }}>Client Portal Mastery</div>
        <h1 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.6rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 20 }}>
          How to Build a Client Approval Workflow{" "}
          <span style={{ background: "linear-gradient(135deg, #818CF8, #C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>That Prevents Scope Creep</span>
        </h1>
        <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>
          A client approval workflow is a formalized sequence of review, feedback, and digital sign-off events that creates a timestamped audit trail for each deliverable — protecting agencies from scope creep disputes and giving clients the psychological closure that accelerates project momentum.
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "#555566" }}>
          <span>By Agency OS</span><span>·</span><span>March 30, 2026</span><span>·</span><span>8 min read</span>
        </div>
      </header>

      <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 96px" }}>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Why Most Agencies Have No Real Approval Process</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>The "Verbal Sign-Off" Problem and Its Legal Consequences</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
            "Looks great, go ahead!" in a Slack message is not an approval. Courts and arbitration panels categorically dismiss verbal or informal sign-offs in scope dispute cases. Agencies lose thousands of dollars in rework costs every year because they have no documented proof that a client approved a deliverable before they moved on. For context on{" "}
            <Link href="/blog/client-portal/client-portal-vs-email" style={{ color: C.primary, textDecoration: "underline" }}>why email approvals are legally and operationally risky</Link>, read our comparison guide.
          </p>
          <div style={{ padding: 20, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, borderLeft: "3px solid #EF4444" }}>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>
              <strong style={{ color: "#EF4444" }}>Reality check:</strong> A survey of 200 creative agencies found that 73% had experienced a scope dispute in the past 12 months. Of those, 89% had no formal approval system that could prove client sign-off.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24 }}>The 5 Stages of a Bulletproof Client Approval Workflow</h2>
          {stages.map((stage, i) => (
            <div key={stage.num} style={{ display: "flex", gap: 20, marginBottom: 24, padding: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.primary}20`, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 800, letterSpacing: "0.05em" }}>{stage.num}</div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{stage.title}</h3>
                <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75 }}>
                  {stage.body}
                  {i === 3 && <> For a detailed look at how{" "}<Link href="/blog/agency-infrastructure/agency-project-visibility" style={{ color: C.primary, textDecoration: "underline" }}>project phase locking creates client confidence</Link>, see our visibility guide.</>}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>How to Communicate the Approval Process to Clients</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Setting Expectations During Onboarding</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
            The approval workflow should be explained during onboarding contracts and the kickoff call — not introduced mid-project when a milestone is ready. Build it into your{" "}
            <Link href="/blog/agency-infrastructure/client-onboarding-system" style={{ color: C.primary, textDecoration: "underline" }}>client onboarding system</Link>
            {" "}from day one.
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>The Language That Prevents Revision Spirals</h3>
          <div style={{ padding: 24, background: C.surface, border: `1px solid rgba(91,92,246,0.3)`, borderRadius: 16, borderLeft: `3px solid ${C.primary}` }}>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, fontStyle: "italic" }}>
              "Once you approve a milestone in the portal, that phase is locked and we advance to the next sprint. Any changes to approved work require a change order. This protects both of us — you get clarity on exactly what you're getting, and we can deliver it on schedule."
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Automating Client Approvals with Agency OS</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>How Portal-Based Approvals Replace Email Chains</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            Agency OS includes milestone-based digital approvals built into the client portal. When you publish a milestone as complete, the client receives a notification, reviews the deliverable inside the portal, and clicks Approve or Request Changes. Every action is timestamped and stored in the project audit log.
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>The Audit Trail Every Agency Needs</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>
            Every approval in Agency OS generates a record with: client name, email, IP address, timestamp, and the specific milestone version approved. Export it as a PDF for any contract dispute or handover package.
          </p>
        </section>

        <div style={{ textAlign: "center", padding: "48px 32px", background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(91,92,246,0.12), transparent 70%)`, border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>Set up your client approval workflow in Agency OS.</h2>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: C.primary, color: "#fff", fontWeight: 600, borderRadius: 12, textDecoration: "none", boxShadow: "0 0 24px rgba(91,92,246,0.35)" }}>
            Start free with Agency OS →
          </Link>
        </div>
      </article>
    </main>
  );
}
