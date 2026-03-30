import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const C = {
  bg: "#0B0B0F", surface: "#12121A", border: "#1F1F2B",
  muted: "#9CA3AF", primary: "#5B5CF6", green: "#10b981", red: "#EF4444",
};

const competitors: Record<string, {
  name: string; slug: string; tagline: string; primaryKw: string;
  color: string; theirFor: string; ourFor: string;
  rows: { feature: string; them: string; us: string; winner: "us" | "them" | "tie" }[];
  verdict: string; faqs: { q: string; a: string }[];
}> = {
  clickup: {
    name: "ClickUp", slug: "clickup", color: "#7C3AED",
    tagline: "ClickUp does everything — except give your clients a great experience.",
    primaryKw: "Agency OS vs ClickUp for client management",
    theirFor: "Internal project management for engineering and operations teams",
    ourFor: "Client-facing experience layer for high-ticket service agencies",
    rows: [
      { feature: "Purpose-built client portal", them: "⚠ Guest view (confusing)", us: "✓ Native, structured", winner: "us" },
      { feature: "White-label / custom domain", them: "⚠ Enterprise only ($)", us: "✓ Growth plan", winner: "us" },
      { feature: "Client milestone approvals", them: "✕ Not available", us: "✓ Digital sign-off + audit trail", winner: "us" },
      { feature: "AI inbox triage", them: "✕ Not available", us: "✓ Powered by Gemini", winner: "us" },
      { feature: "Done / In Progress / Next for clients", them: "✕ Clients see raw tasks", us: "✓ Curated, structured view", winner: "us" },
      { feature: "Internal task management", them: "✓ Best-in-class", us: "⚠ Focused on client layer", winner: "them" },
      { feature: "Gantt / timeline views", them: "✓ Advanced", us: "⚠ Milestone-level only", winner: "them" },
      { feature: "Pricing entry point", them: "Free (limited)", us: "Free (Starter)", winner: "tie" },
    ],
    verdict: "ClickUp is the right internal operations tool. Agency OS is the right client experience tool. The best agencies run both: ClickUp for their team, Agency OS for their clients.",
    faqs: [
      { q: "Can ClickUp replace a client portal?", a: "Not effectively. ClickUp's guest access exposes clients to internal task details, team conversations, and operational complexity. Agency OS presents a curated, outcome-level view clients can actually understand." },
      { q: "Can Agency OS replace ClickUp?", a: "No — Agency OS is not a project management tool. It is the client-facing layer. Your team keeps using ClickUp internally; your clients see Agency OS. They complement each other." },
      { q: "Which is better for agencies — ClickUp or Agency OS?", a: "Use both. ClickUp for internal operations. Agency OS for client communication, milestone approvals, and the portal experience. Competing tools would be ClickUp vs Asana, or Agency OS vs Copilot." },
    ],
  },
  notion: {
    name: "Notion", slug: "notion", color: "#ffffff",
    tagline: "Notion is a great internal wiki. It's a security risk as a client portal.",
    primaryKw: "Agency OS vs Notion client portal for agencies",
    theirFor: "Internal documentation, wikis, and personal knowledge management",
    ourFor: "Secure, structured, white-label client portals for service agencies",
    rows: [
      { feature: "Data partitioning (client sees only their data)", them: "✕ Risky — manual setup required", us: "✓ Structural by default", winner: "us" },
      { feature: "White-label / custom domain", them: "✕ Not available", us: "✓ Growth plan+", winner: "us" },
      { feature: "Client milestone approvals + audit trail", them: "✕ Not available", us: "✓ Digital sign-off", winner: "us" },
      { feature: "Role-based access control", them: "⚠ Workspace-level only", us: "✓ Per-client, per-project", winner: "us" },
      { feature: "Internal docs & wikis", them: "✓ Best-in-class", us: "✕ Not the focus", winner: "them" },
      { feature: "AI writing assistant", them: "✓ Notion AI", us: "⚠ AI focused on triage", winner: "them" },
      { feature: "Client-facing design/UX", them: "⚠ Generic", us: "✓ Premium, branded", winner: "us" },
      { feature: "Risk of data leaks to clients", them: "✕ High (doc structure visible)", us: "✓ Zero — partitioned", winner: "us" },
    ],
    verdict: "Notion is a great internal tool and a poor client portal. The permission model was not designed for multi-tenant client access — one misconfiguration exposes your salary docs to a client. Agency OS is purpose-built for the client layer.",
    faqs: [
      { q: "Is Notion a good client portal for agencies?", a: "Not recommended. Notion's workspace structure gives clients access beyond their intended scope unless every permission is manually configured. Agencies routinely expose internal pricing, margin docs, and team information by accident." },
      { q: "How is Agency OS different from Notion for client portals?", a: "Agency OS is structurally separated from your internal data. Clients see only what you explicitly publish to their portal. There's no shared workspace, no permission hierarchy to misconfigure, and no risk of accidental exposure." },
      { q: "Can I use both Notion and Agency OS?", a: "Yes — this is the recommended setup. Use Notion for internal docs, SOPs, and team knowledge. Use Agency OS for the client-facing portal, status updates, and milestone approvals." },
    ],
  },
  monday: {
    name: "Monday.com", slug: "monday", color: "#FF3D71",
    tagline: "Monday.com manages your projects. Agency OS manages your client relationships.",
    primaryKw: "Agency OS vs Monday.com for agency client management",
    theirFor: "Team work management and process automation for operations teams",
    ourFor: "Client experience infrastructure and real-time status portal for agencies",
    rows: [
      { feature: "Dedicated client portal", them: "✕ View-only board sharing", us: "✓ Purpose-built portal", winner: "us" },
      { feature: "White-label / custom domain", them: "✕ Not available", us: "✓ Growth plan+", winner: "us" },
      { feature: "Client milestone approvals", them: "✕ Not available", us: "✓ Digital sign-off + audit trail", winner: "us" },
      { feature: "Done/In Progress/Next for clients", them: "⚠ Clients see full board", us: "✓ Curated client view only", winner: "us" },
      { feature: "Workflow automation", them: "✓ Excellent", us: "⚠ Limited", winner: "them" },
      { feature: "CRM integration", them: "✓ Native CRM module", us: "⚠ Third-party integrations", winner: "them" },
      { feature: "AI inbox triage", them: "✕ Not available", us: "✓ Gemini-powered", winner: "us" },
      { feature: "Pricing (per seat)", them: "$$$ (high per-seat)", us: "$ (per client)", winner: "us" },
    ],
    verdict: "Monday.com is a robust operations platform for running complex workflows internally. Agency OS is the external face of your agency — what clients see, interact with, and judge you by. They serve different layers of the same operation.",
    faqs: [
      { q: "Is Monday.com good for managing client relationships?", a: "Monday.com is better suited for internal workflows than client relationships. Its board-sharing feature gives clients access to your internal operational structure, which creates confusion more than clarity." },
      { q: "What does Agency OS do that Monday.com doesn't?", a: "Agency OS gives clients a branded, curated portal view with milestone approvals, digital sign-offs, and AI inbox triage — all client-facing features Monday.com wasn't designed to provide." },
    ],
  },
  asana: {
    name: "Asana", slug: "asana", color: "#FF5263",
    tagline: "Asana tracks your deliverables. Agency OS delivers your client experience.",
    primaryKw: "Agency OS vs Asana for agency client portals",
    theirFor: "Internal project tracking and task assignment for delivery teams",
    ourFor: "Client-facing portal, status visibility, and milestone approvals for agencies",
    rows: [
      { feature: "Client-facing portal", them: "✕ Not available", us: "✓ Purpose-built", winner: "us" },
      { feature: "White-label / custom domain", them: "✕ Not available", us: "✓ Growth plan+", winner: "us" },
      { feature: "Client milestone approvals", them: "✕ Not available", us: "✓ With audit trail", winner: "us" },
      { feature: "Internal task management", them: "✓ Excellent", us: "⚠ Milestone-level only", winner: "them" },
      { feature: "Timeline / Gantt view", them: "✓ Robust", us: "⚠ High-level only", winner: "them" },
      { feature: "AI inbox triage", them: "✕ Not available", us: "✓ Gemini-powered", winner: "us" },
      { feature: "Designed for non-technical clients", them: "✕ Client access is confusing", us: "✓ UX built for clients", winner: "us" },
    ],
    verdict: "Asana is the gold standard for internal delivery tracking. Agency OS is the gold standard for client experience. Running both removes the need to compromise either your internal workflow or your client's experience.",
    faqs: [
      { q: "Can I share my Asana board with clients?", a: "You can, but most clients find it overwhelming. Asana is built for delivery teams fluent in project management terminology. A portal built for clients (like Agency OS) presents the same progress in language and format they can immediately understand." },
      { q: "Does Asana have a client portal feature?", a: "No. Asana has guest access that lets external users view projects, but this is not a dedicated client portal — clients see your raw internal task structure rather than a curated, branded experience." },
    ],
  },
  basecamp: {
    name: "Basecamp", slug: "basecamp", color: "#1D2D35",
    tagline: "Basecamp brings clients into your workspace. Agency OS gives clients their own.",
    primaryKw: "Agency OS vs Basecamp for agency client communication",
    theirFor: "Flat, async project collaboration between teams and clients in a shared workspace",
    ourFor: "Structured, milestone-driven client portal with curated external visibility",
    rows: [
      { feature: "Dedicated client portal (not shared workspace)", them: "✕ Shared project rooms", us: "✓ Fully separate client layer", winner: "us" },
      { feature: "White-label / custom domain", them: "✕ Not available", us: "✓ Growth plan+", winner: "us" },
      { feature: "Milestone approvals + audit trail", them: "✕ Not available", us: "✓ Digital sign-off", winner: "us" },
      { feature: "Simplicity / ease of use", them: "✓ Very simple", us: "✓ Simple for clients", winner: "tie" },
      { feature: "Message boards", them: "✓ Native", us: "⚠ Async inbox only", winner: "them" },
      { feature: "Flat-rate pricing (not per seat)", them: "✓ $299/month flat", us: "✓ Per-client pricing", winner: "tie" },
      { feature: "Client sees only their project", them: "⚠ Shared project context", us: "✓ Fully partitioned", winner: "us" },
    ],
    verdict: "Basecamp's simplicity is its strength and its limitation. Bringing clients into a shared project room works for small teams but breaks down when you have 10+ clients and need branded experiences, approval workflows, and partitioned access. Agency OS was built for that scale.",
    faqs: [
      { q: "Is Basecamp good for client portals?", a: "Basecamp facilitates client collaboration in shared project rooms but is not a dedicated client portal. Clients see your project's message boards and to-dos in Basecamp's branding — not a curated, white-label experience in your agency's brand." },
      { q: "What should I use instead of Basecamp for client communication?", a: "Agency OS for client portals, milestone tracking, and approvals. Basecamp or Slack for async team messaging if you prefer that workflow." },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(competitors).map((slug) => ({ competitor: slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ competitor: string }> }
): Promise<Metadata> {
  const { competitor } = await params;
  const c = competitors[competitor];
  if (!c) return {};
  return {
    title: `Agency OS vs ${c.name} — Which Is Right for Your Agency in 2026?`,
    description: `${c.tagline} Compare features, pricing, and use cases side-by-side.`,
    alternates: { canonical: `https://agency-os.tech/vs/${c.slug}` },
    openGraph: {
      title: `Agency OS vs ${c.name} (2026 Comparison)`,
      url: `https://agency-os.tech/vs/${c.slug}`,
      type: "website",
    },
  };
}

export default async function VsPage({ params }: { params: Promise<{ competitor: string }> }) {
  const { competitor } = await params;
  const c = competitors[competitor];
  if (!c) notFound();

  const schema = {
    "@context": "https://schema.org", "@type": "WebPage",
    name: `Agency OS vs ${c.name}`,
    description: c.tagline,
    url: `https://agency-os.tech/vs/${c.slug}`,
    publisher: { "@id": "https://agency-os.tech/#organization" },
  };
  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main style={{ background: C.bg, color: "#fff", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header style={{ maxWidth: 820, margin: "0 auto", padding: "72px 24px 48px" }}>
        <Link href="/" style={{ fontSize: 13, color: C.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          ← Back to Agency OS
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ padding: "6px 16px", background: "#5B5CF615", border: "1px solid #5B5CF630", borderRadius: 9999, fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Head-to-Head Comparison
          </div>
        </div>

        <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 20 }}>
          Agency OS vs{" "}
          <span style={{ background: "linear-gradient(135deg, #818CF8, #C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {c.name}
          </span>
        </h1>
        <p style={{ fontSize: 19, color: C.muted, lineHeight: 1.7, marginBottom: 16, maxWidth: 640 }}>
          {c.tagline}
        </p>
        <p style={{ fontSize: 15, color: "#555566" }}>
          Updated March 2026 · 6 min read · Unbiased feature comparison
        </p>
      </header>

      <article style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px 96px" }}>

        {/* TL;DR positioning */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 56 }}>
          {[
            { label: c.name, tagline: c.theirFor, color: C.muted, border: C.border },
            { label: "Agency OS", tagline: c.ourFor, color: C.primary, border: `${C.primary}40` },
          ].map((item) => (
            <div key={item.label} style={{ padding: 24, background: C.surface, border: `1px solid ${item.border}`, borderRadius: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 10, letterSpacing: "0.04em" }}>{item.label}</div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{item.tagline}</p>
            </div>
          ))}
        </section>

        {/* Feature comparison table */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Feature-by-Feature Comparison
          </h2>
          <p style={{ fontSize: 15, color: C.muted, marginBottom: 24 }}>
            Focused on the <strong style={{ color: "#fff" }}>client experience layer</strong> — the part that affects your client retention and referrals.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#0D0D13" }}>
                  {["Feature", c.name, "Agency OS"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: C.muted, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : "#0D0D13" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#E5E7EB" }}>{row.feature}</td>
                    <td style={{ padding: "14px 16px", color: row.them.startsWith("✓") ? C.green : row.them.startsWith("⚠") ? "#F59E0B" : C.red }}>{row.them}</td>
                    <td style={{ padding: "14px 16px", color: row.us.startsWith("✓") ? C.green : row.us.startsWith("⚠") ? "#F59E0B" : C.red, fontWeight: row.winner === "us" ? 600 : 400 }}>{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Verdict */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            The Verdict — Which Should You Use?
          </h2>
          <div style={{ padding: 28, background: C.surface, border: `1px solid ${C.primary}35`, borderRadius: 16, borderLeft: `3px solid ${C.primary}` }}>
            <p style={{ fontSize: 16, color: "#D1D5DB", lineHeight: 1.8 }}>{c.verdict}</p>
          </div>
        </section>

        {/* FAQs */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Frequently Asked Questions
          </h2>
          {c.faqs.map((faq) => (
            <div key={faq.q} style={{ padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{faq.q}</h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75 }}>{faq.a}</p>
            </div>
          ))}
        </section>

        {/* Internal links */}
        <section style={{ padding: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Related Reading</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/blog/client-portal/client-portal-software" style={{ fontSize: 14, color: C.primary, textDecoration: "none" }}>→ The 7 Best Client Portal Software Platforms for Agencies in 2026</Link>
            <Link href="/blog/client-portal/what-is-client-portal" style={{ fontSize: 14, color: C.primary, textDecoration: "none" }}>→ What is a client portal for agencies — and what must it include?</Link>
            <Link href="/blog/client-portal/white-label-client-portal" style={{ fontSize: 14, color: C.primary, textDecoration: "none" }}>→ White-label client portals — the competitive edge agencies are using</Link>
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "48px 32px", background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(91,92,246,0.12), transparent 70%)", border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>No credit card · 15-minute setup</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Try Agency OS free — build your first client portal today.
          </h2>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 32px", background: C.primary, color: "#fff", fontWeight: 600, borderRadius: 12, textDecoration: "none", fontSize: 15, boxShadow: "0 0 28px rgba(91,92,246,0.4)" }}>
            Start free with Agency OS →
          </Link>
        </div>
      </article>
    </main>
  );
}
