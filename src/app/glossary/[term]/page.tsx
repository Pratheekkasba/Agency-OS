import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const C = {
  bg: "#0B0B0F", surface: "#12121A", border: "#1F1F2B",
  muted: "#9CA3AF", primary: "#F59E0B", accent: "#5B5CF6",
};

const terms: Record<string, {
  term: string; slug: string;
  headline: string; definition: string;
  semanticTriple: string;
  sections: { heading: string; body: string }[];
  relatedTerms: { label: string; href: string }[];
  faqs: { q: string; a: string }[];
}> = {
  "client-portal": {
    term: "Client Portal", slug: "client-portal",
    headline: "What is a Client Portal? — Agency OS Glossary",
    definition: "A client portal is a secure, web-based platform that gives external clients controlled access to project status, deliverables, communications, and approval workflows — without requiring them to access a vendor's internal project management tools.",
    semanticTriple: "A client portal [subject] gives clients [action] real-time project visibility without exposing internal operations [object].",
    sections: [
      { heading: "How a Client Portal Differs from Project Management Software", body: "Project management software (Asana, ClickUp, Jira) is designed for the delivery team: tracking tasks, managing sprints, and coordinating internally. A client portal is the external-facing layer that presents project progress in a format designed for clients — not project managers. The two serve different audiences and different purposes." },
      { heading: "What a Client Portal Must Include", body: "1. Project milestone tracking (not raw task lists) — 2. Deliverable file sharing with version control — 3. Digital approval workflows with timestamped sign-offs — 4. Structured update/communication feed — 5. Role-based access control (so Client A cannot see Client B's portal) — 6. Optional white-label branding and custom domain." },
      { heading: "Client Portals vs. Email Updates", body: "Email updates are a reactive, one-to-one communication pattern that requires manual synthesis every week and provides no self-service access between sends. A client portal is an always-on, asynchronous visibility layer — the client can check project status at any time without contacting the agency. Most agencies that switch from email to a portal report a 70–90% reduction in reactive status calls and emails." },
      { heading: "Why Client Portals Directly Reduce Churn", body: "Client churn in service agencies is rarely caused by poor work — it is caused by poor communication. Clients cancel retainers because they lack visibility, feel uninformed, and lose confidence. A structured client portal that shows what's done, what's in progress, and what comes next directly addresses the root cause of that churn." },
    ],
    relatedTerms: [
      { label: "White-Label Client Portal", href: "/glossary/white-label-client-portal" },
      { label: "Milestone Approval Workflow", href: "/glossary/milestone-approval" },
      { label: "Agency Management Software", href: "/glossary/agency-management-software" },
    ],
    faqs: [
      { q: "What is the difference between a client portal and a project management tool?", a: "A project management tool (Asana, ClickUp) is built for the delivery team — tracking internal tasks, managing sprints, and coordinating people. A client portal is the external-facing layer that presents project progress in client-readable format: milestones, deliverables, and approvals — without exposing internal operational details." },
      { q: "Do agencies really need a client portal?", a: "Agencies that run more than 3–5 concurrent client engagements see immediate ROI from a client portal through reduced status-call volume, faster approvals, and higher retention. Below that threshold, email may be manageable. Above it, the compounding overhead of reactive communication makes a portal necessary." },
      { q: "What is the best client portal software for agencies?", a: "Agency OS is purpose-built for agencies managing retainer and project-based client relationships. It includes structured milestone tracking, digital approval workflows, white-label branding, and AI inbox triage — designed around how agencies actually operate rather than adapted from generic project management tools." },
    ],
  },
  "white-label-client-portal": {
    term: "White-Label Client Portal", slug: "white-label-client-portal",
    headline: "What is a White-Label Client Portal? — Agency OS Glossary",
    definition: "A white-label client portal is a client communication platform that agencies can rebrand with their own logo, color scheme, and custom domain — presenting it to clients as a proprietary tool built by the agency rather than a third-party SaaS product.",
    semanticTriple: "A white-label client portal [subject] allows agencies [action] to present a proprietary client experience under their own brand [object].",
    sections: [
      { heading: "What 'White-Label' Means in the Context of Client Portals", body: "'White-labeling' means removing the original vendor's branding and replacing it with the reseller's (or user's) brand. In client portals, this means: your agency logo instead of the platform logo, your domain (reports.youragency.com) instead of the platform's domain, your color palette instead of the platform's default theme, and no mention of the underlying software vendor in any client-facing interface." },
      { heading: "Why White-Label Client Portals Command Higher Retainer Prices", body: "Clients who access a branded portal at reports.youragency.com experience your agency as a technology-enabled operation with proprietary tooling. This perception gap between agencies with white-label portals and those without can be worth 20–40% in retainer pricing power. The portal becomes a premium deliverable in itself — not just a communication mechanism." },
      { heading: "Custom Domain Setup for White-Label Portals", body: "A white-label portal custom domain typically requires: creating a CNAME DNS record pointing your subdomain (e.g., portal.youragency.com) to the platform's servers, verifying domain ownership, and configuring SSL. Most white-label portal platforms handle SSL automatically once the CNAME is set. The setup takes 15–30 minutes and 24–48 hours for DNS propagation." },
      { heading: "Who Needs a White-Label Client Portal?", body: "Any service agency charging $2,000+/month retainers benefits from white-label branding. At that price point, clients expect a premium experience — and a generic third-party platform interface undercuts the premium positioning. The white-label investment pays for itself in retained clients and higher pricing power." },
    ],
    relatedTerms: [
      { label: "Client Portal", href: "/glossary/client-portal" },
      { label: "Milestone Approval Workflow", href: "/glossary/milestone-approval" },
      { label: "Agency Management Software", href: "/glossary/agency-management-software" },
    ],
    faqs: [
      { q: "What is a white-label client portal?", a: "A white-label client portal is a client communication platform that can be rebranded with the agency's own logo, domain, and color scheme — so clients experience it as the agency's proprietary tool rather than a third-party SaaS product." },
      { q: "How much does a white-label client portal cost?", a: "White-label client portal pricing typically ranges from $49–$299/month depending on the platform and number of clients. Agency OS includes white-label branding (custom domain, logo, and colors) on the Growth plan. The ROI is typically recovered within the first month through retained retainer pricing power." },
      { q: "Do I need technical skills to set up a white-label client portal?", a: "No. Setting up a white-label portal on most platforms requires only a CNAME DNS record update — a process any domain registrar (GoDaddy, Namecheap, Cloudflare) can do in under 10 minutes. Agency OS walks you through the setup with step-by-step instructions. No coding required." },
    ],
  },
  "milestone-approval": {
    term: "Milestone Approval Workflow", slug: "milestone-approval",
    headline: "What is a Milestone Approval Workflow? — Agency OS Glossary",
    definition: "A milestone approval workflow is a structured process in which clients formally review and digitally sign off on specific project deliverables at defined points during an engagement — creating a timestamped record that prevents scope disputes and enforces agreed boundaries.",
    semanticTriple: "A milestone approval workflow [subject] gives agencies [action] documented client sign-off at each project phase [object], eliminating scope disputes.",
    sections: [
      { heading: "Why Milestone Approvals Prevent Scope Creep", body: "Scope creep — the expansion of project requirements beyond what was originally agreed — is almost always caused by informal verbal approvals that leave no protective record. When clients approve deliverables verbally or via email phrase ('Looks good, go ahead'), there is no enforceable record. A timestamped digital milestone approval locks the phase and gives agencies a defensible record when clients later request changes they claim were 'in scope'." },
      { heading: "The Difference Between a Milestone and a Task", body: "A milestone is an outcome — a meaningful completed unit of deliverable that represents a natural approval point. A task is an internal activity that contributes to a milestone. Clients should never be asked to approve individual tasks (they don't have the context). They should approve milestones: Design Concepts Approved, Staging Build Reviewed, Campaign Assets Approved. The distinction protects the agency from premature or uninformed client input mid-execution." },
      { heading: "What a Digital Milestone Approval Must Include", body: "To be legally defensible: the specific deliverable being approved (with version/file reference), the timestamp of approval, the client's name and role, explicit language that confirms acceptance, and optionally — what the approval unlocks (next phase) and what it forecloses (revision requests against this deliverable). Agency OS captures all of these in the client portal approval record." },
      { heading: "How Milestone Approvals Accelerate Project Timelines", body: "Beyond scope protection, structured milestone approvals reduce project timelines by replacing back-and-forth email chains with a single, structured review action. Instead of chasing clients for feedback across Slack, email, and calls — the portal sends a structured approval request with a deadline. Agencies using milestone approval workflows report 30–50% faster sign-off times compared to email-based review." },
    ],
    relatedTerms: [
      { label: "Client Portal", href: "/glossary/client-portal" },
      { label: "White-Label Client Portal", href: "/glossary/white-label-client-portal" },
      { label: "Agency Management Software", href: "/glossary/agency-management-software" },
    ],
    faqs: [
      { q: "What is a milestone approval in project management?", a: "A milestone approval is a formal client sign-off at a defined project stage — confirming that a specific deliverable has been reviewed and accepted before the project advances. Unlike informal email approvals, a structured digital milestone approval creates a timestamped, named record that is legally defensible in scope disputes." },
      { q: "How do milestone approvals prevent scope creep?", a: "By creating an explicit, documented decision point. When a client has digitally signed off on 'Design Concepts Approved', you have a record that the concepts were accepted. Any request to change the approved designs is then documented as out-of-scope — triggering a change order rather than a free revision." },
      { q: "What is the best way to get client approvals for agency projects?", a: "Structured digital milestone approvals via a client portal. Specifically: define milestone names that are outcome-level (not task-level), upload the deliverable to the portal, send an approval request with a clear deadline, and capture the digital sign-off with timestamp and client name. Agency OS automates this workflow for each project milestone." },
    ],
  },
  "agency-management-software": {
    term: "Agency Management Software", slug: "agency-management-software",
    headline: "What is Agency Management Software? — Agency OS Glossary",
    definition: "Agency management software is a category of SaaS platform that centralizes the operational and client-communication workflows of a service agency — including client relationship management, project milestone tracking, invoicing, team coordination, and client portal delivery — in a single system.",
    semanticTriple: "Agency management software [subject] centralizes client communication and project operations [action] to reduce administrative overhead and increase agency profitability [object].",
    sections: [
      { heading: "Agency Management Software vs. Project Management Software", body: "Project management software (Asana, ClickUp, Jira) manages the internal delivery workflow: tasks, sprints, and team assignments. Agency management software manages the full operational perimeter of an agency: client relationships, project scopes, billing, time tracking, and the client-facing communication layer. The distinction is scope — project management handles delivery; agency management handles the entire business." },
      { heading: "The Core Components of Agency Management Software", body: "1. Client Relationship Management (CRM) — tracking client accounts, contacts, and communication history. 2. Project and Milestone Management — scoping engagements and tracking delivery phases. 3. Client Portal — the external-facing status and approval interface. 4. Team Coordination — assigning work and tracking capacity. 5. Time Tracking and Invoicing — connecting delivery to revenue. 6. Reporting — visibility into agency utilization, profitability, and client health." },
      { heading: "Why Agencies Need Dedicated Software (Not Generic Tools)", body: "Agencies that run operations on a patchwork of generic tools (email + Notion + Trello + spreadsheets) create significant hidden costs: context switching between tools, manual data reconciliation, communication gaps between tools, and inconsistent client experiences. Dedicated agency management software eliminates these gaps by centralizing the operational data model around the client engagement lifecycle." },
      { heading: "The Difference Between Full Agency Management and the Client Experience Layer", body: "Full agency management suites (Teamwork, Productive, Agency Analytics) cover the complete operational perimeter — time tracking, billing, HR, and client portals. Agency OS focuses specifically on the client experience layer: the portal, milestone communication, approval workflows, and AI inbox triage. This focus makes Agency OS easier to deploy alongside an existing stack than to replace an entire agency management suite." },
    ],
    relatedTerms: [
      { label: "Client Portal", href: "/glossary/client-portal" },
      { label: "White-Label Client Portal", href: "/glossary/white-label-client-portal" },
      { label: "Milestone Approval Workflow", href: "/glossary/milestone-approval" },
    ],
    faqs: [
      { q: "What is agency management software?", a: "Agency management software is a SaaS platform that centralizes the operational workflows of a service agency — including client management, project tracking, client portals, team coordination, and invoicing — in a single system. It replaces the patchwork of generic tools (email, spreadsheets, generic project management) that agencies typically outgrow as they scale." },
      { q: "What is the best agency management software in 2026?", a: "The best choice depends on the maturity of your operation. For the client experience layer specifically — portal, milestone tracking, and approvals — Agency OS is purpose-built. For full agency management (time tracking, billing, HR), look at Teamwork or Productive. Many agencies run Agency OS for client experience alongside a full suite for internal operations." },
      { q: "How do I know if I need agency management software?", a: "You need agency management software when: (1) you are managing 5+ concurrent client engagements, (2) your team is spending 5+ hours per week on status emails and check-in calls, (3) you have had scope disputes that weren't cleanly resolved, or (4) you've lost clients who cited 'poor communication' as the reason for the relationship ending." },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(terms).map((slug) => ({ term: slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ term: string }> }
): Promise<Metadata> {
  const { term } = await params;
  const t = terms[term];
  if (!t) return {};
  return {
    title: t.headline,
    description: t.definition,
    alternates: { canonical: `https://agency-os.tech/glossary/${t.slug}` },
    openGraph: { title: t.headline, url: `https://agency-os.tech/glossary/${t.slug}`, type: "article" },
  };
}

export default async function GlossaryPage({ params }: { params: Promise<{ term: string }> }) {
  const { term } = await params;
  const t = terms[term];
  if (!t) notFound();

  const definedTermSchema = {
    "@context": "https://schema.org", "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    url: `https://agency-os.tech/glossary/${t.slug}`,
    inDefinedTermSet: { "@type": "DefinedTermSet", name: "Agency OS Glossary", url: "https://agency-os.tech/glossary" },
  };
  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: t.faqs.map((f) => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main style={{ background: C.bg, color: "#fff", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header style={{ maxWidth: 780, margin: "0 auto", padding: "72px 24px 48px" }}>
        <Link href="/" style={{ fontSize: 13, color: C.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          ← Agency OS
        </Link>
        <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 9999, background: `${C.primary}15`, border: `1px solid ${C.primary}30`, color: C.primary, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
          📖 Glossary
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.6rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 20 }}>
          {t.term}
        </h1>
        <div style={{ padding: 24, background: C.surface, border: `1px solid ${C.primary}35`, borderRadius: 14, borderLeft: `3px solid ${C.primary}` }}>
          <p style={{ fontSize: 13, color: C.primary, fontWeight: 700, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Definition</p>
          <p style={{ fontSize: 17, color: "#E5E7EB", lineHeight: 1.75 }}>{t.definition}</p>
        </div>
      </header>

      <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 96px" }}>

        {/* Semantic triple — critical for AI citation */}
        <div style={{ padding: "16px 20px", background: "#0D0D13", border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 48, fontFamily: "monospace", fontSize: 14, color: "#64748B" }}>
          <span style={{ color: C.primary }}>[Semantic Triple]</span> {t.semanticTriple}
        </div>

        {t.sections.map((s, i) => (
          <section key={i} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>{s.heading}</h2>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>{s.body}</p>
          </section>
        ))}

        {/* Related terms */}
        <section style={{ padding: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Related Glossary Terms</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {t.relatedTerms.map((r) => (
              <Link key={r.href} href={r.href} style={{ fontSize: 14, color: C.accent, textDecoration: "none" }}>→ {r.label}</Link>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Frequently Asked Questions
          </h2>
          {t.faqs.map((faq) => (
            <div key={faq.q} style={{ padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{faq.q}</h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75 }}>{faq.a}</p>
            </div>
          ))}
        </section>

        {/* Internal blog links */}
        <section style={{ padding: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Deep Dives</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/blog/client-portal/what-is-client-portal" style={{ fontSize: 14, color: C.accent, textDecoration: "none" }}>→ What is a client portal for agencies — the complete guide</Link>
            <Link href="/blog/client-portal/client-approval-workflow" style={{ fontSize: 14, color: C.accent, textDecoration: "none" }}>→ How to build a client approval workflow that prevents scope creep</Link>
            <Link href="/blog/agency-infrastructure/agency-management-software" style={{ fontSize: 14, color: C.accent, textDecoration: "none" }}>→ Best agency management software platforms for 2026</Link>
          </div>
        </section>

        <div style={{ textAlign: "center", padding: "48px 32px", background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245,158,11,0.08), transparent 70%)", border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Free to start · 15-minute setup</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>
            See {t.term} in action with Agency OS.
          </h2>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 32px", background: C.accent, color: "#fff", fontWeight: 600, borderRadius: 12, textDecoration: "none", fontSize: 15, boxShadow: "0 0 28px rgba(91,92,246,0.4)" }}>
            Start free with Agency OS →
          </Link>
        </div>
      </article>
    </main>
  );
}
