import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const C = {
  bg: "#0B0B0F", surface: "#12121A", border: "#1F1F2B",
  muted: "#9CA3AF", primary: "#5B5CF6", green: "#10b981",
};

const alternatives: Record<string, {
  name: string; slug: string;
  headline: string; subheadline: string;
  whyPeople: string; why: string;
  comparisons: { aspect: string; them: string; us: string }[];
  faqs: { q: string; a: string }[];
}> = {
  notion: {
    name: "Notion", slug: "notion",
    headline: "The Best Notion Alternative for Agency Client Portals",
    subheadline: "Notion is a powerful internal tool. It was never designed to be a client portal — and the difference matters.",
    whyPeople: "Agencies start using Notion as a client portal because they already use it internally for docs and SOPs. Sharing a Notion page with a client is free and familiar. The problems emerge at scale: permission models become dangerous, the interface isn't branded, and clients who aren't 'Notion people' find it confusing.",
    why: "Agency OS is purpose-built for the client experience layer. Where Notion forces you to build a client portal from scratch using databases, toggles, and manual permission management — Agency OS comes pre-wired with milestone tracking, digital approvals, AI inbox triage, and white-label branding.",
    comparisons: [
      { aspect: "Data partitioning (client sees only their data)", them: "Manual — dangerous at scale", us: "Structural — impossible to misconfigure" },
      { aspect: "Setup time for a client portal", them: "10–20 hours of Notion database setup", us: "15 minutes" },
      { aspect: "White-label / your own domain", them: "Not available", us: "✓ Growth plan+" },
      { aspect: "Client milestone approvals", them: "Not available", us: "✓ Digital sign-off + audit trail" },
      { aspect: "AI inbox triage", them: "Notion AI (writing assistant only)", us: "✓ Gemini-powered client message triage" },
      { aspect: "Designed for non-technical clients", them: "Learning curve for Notion UI", us: "Purpose-built client UX" },
      { aspect: "Internal documentation", them: "Best-in-class", us: "Not the focus — use Notion for this" },
    ],
    faqs: [
      { q: "Why are agencies looking for Notion alternatives for client portals?", a: "Three main reasons: (1) Notion's permission model was not designed for secure multi-client access — one misconfiguration can expose internal docs to the wrong client. (2) Notion is not white-labelable, so clients always know they're in 'Notion'. (3) Building a professional client portal in Notion requires significant custom database setup — it doesn't come pre-wired for agency workflows." },
      { q: "What is the best Notion alternative for client portals?", a: "Agency OS is built specifically for the agency client experience layer. It provides structured milestone tracking, digital approval workflows, and white-label branding out of the box — without the setup overhead or security risks of a Notion-based client portal." },
      { q: "Can I use both Notion and Agency OS?", a: "Yes — this is the recommended setup. Keep Notion for internal documentation, SOPs, and team knowledge management. Use Agency OS for the client-facing portal, milestone updates, and approval workflows. They serve different layers of your operation." },
      { q: "Is Agency OS free like Notion?", a: "Agency OS has a free Starter plan that includes a client portal for up to 3 active clients. Unlike Notion, there's no free plan that includes white-labeling — that requires the Growth plan. But the core portal experience is available at no cost to start." },
    ],
  },
  clickup: {
    name: "ClickUp", slug: "clickup",
    headline: "The Best ClickUp Alternative for Agency Client Portals",
    subheadline: "ClickUp is built for your team. Agency OS is built for your clients. They're not competing — they're complementary.",
    whyPeople: "Agencies try to use ClickUp's guest view to give clients project visibility. The problem: ClickUp is designed for delivery teams, not client experience. Clients see raw tasks, internal comments, and operational details they don't need — and miss the milestone clarity they actually want.",
    why: "Agency OS presents a curated, client-readable view of your project status — without exposing your internal operations. Your team stays in ClickUp. Your clients see Agency OS.",
    comparisons: [
      { aspect: "Purpose-built client portal", them: "Guest view — clients see internal tasks", us: "Dedicated portal — curated client view only" },
      { aspect: "White-label / custom domain", them: "Enterprise only ($$$)", us: "Growth plan+" },
      { aspect: "Client milestone approvals", them: "Not available", us: "Digital sign-off + audit trail" },
      { aspect: "Designed for non-technical clients", them: "Overwhelming for non-project-managers", us: "Purpose-built client UX" },
      { aspect: "Internal task management", them: "Best-in-class", us: "Not the focus" },
      { aspect: "Pricing for client-facing features", them: "High — per-seat model", us: "Per-client pricing" },
    ],
    faqs: [
      { q: "Why are agencies looking for ClickUp alternatives for client communication?", a: "ClickUp's guest access shows clients your raw internal task structure — team conversations, internal notes, and operational details that erode client confidence when exposed. Agencies want a tool that curates and translates internal progress into a client-friendly view." },
      { q: "Should I replace ClickUp with Agency OS?", a: "No — replace the client-facing layer, not the internal operation. Your team continues using ClickUp for project management. Agency OS sits in front of that as the client experience layer — what clients see, interact with, and approve." },
    ],
  },
  monday: {
    name: "Monday.com", slug: "monday",
    headline: "The Best Monday.com Alternative for Agency Client Portals",
    subheadline: "Monday.com manages your work. Agency OS manages your client relationships.",
    whyPeople: "Agencies use Monday.com's view-sharing feature to give clients project visibility. Like ClickUp, the result is clients seeing a board full of internal operational data — not a curated, milestone-level view. The per-seat pricing also becomes punishing when adding clients.",
    why: "Agency OS gives clients a dedicated portal experience that's separate from your internal operations. No per-seat pricing penalty for adding clients. No scramble to clean up your boards before sharing. Just a clean, branded portal.",
    comparisons: [
      { aspect: "Dedicated client portal (not shared board)", them: "Board view-sharing only", us: "Purpose-built portal" },
      { aspect: "White-label / custom domain", them: "Not available", us: "Growth plan+" },
      { aspect: "Pricing model for client access", them: "Per-seat (expensive at scale)", us: "Per-client (predictable)" },
      { aspect: "Client milestone approvals", them: "Not available", us: "Digital sign-off + audit trail" },
      { aspect: "Internal workflow automation", them: "Excellent", us: "Not the focus" },
    ],
    faqs: [
      { q: "What is the best Monday.com alternative for agency client portals?", a: "Agency OS. It provides what Monday.com's view-sharing doesn't: a branded, curated portal experience that clients can navigate without understanding project management software." },
      { q: "Is Agency OS cheaper than Monday.com?", a: "For the client experience layer, yes. Monday.com charges per seat — adding 10 clients can cost hundreds per month. Agency OS charges per client portal with a free Starter plan, making the cost structure predictable as you scale." },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(alternatives).map((slug) => ({ competitor: slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ competitor: string }> }
): Promise<Metadata> {
  const { competitor } = await params;
  const a = alternatives[competitor];
  if (!a) return {};
  return {
    title: `${a.headline} (2026)`,
    description: a.subheadline,
    alternates: { canonical: `https://agency-os.tech/alternatives/${a.slug}` },
    openGraph: { title: a.headline, url: `https://agency-os.tech/alternatives/${a.slug}`, type: "website" },
  };
}

export default async function AlternativePage({ params }: { params: Promise<{ competitor: string }> }) {
  const { competitor } = await params;
  const a = alternatives[competitor];
  if (!a) notFound();

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: a.faqs.map((f) => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main style={{ background: C.bg, color: "#fff", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header style={{ maxWidth: 780, margin: "0 auto", padding: "72px 24px 48px" }}>
        <Link href="/" style={{ fontSize: 13, color: C.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          ← Back to Agency OS
        </Link>
        <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 9999, background: `${C.primary}15`, border: `1px solid ${C.primary}30`, color: C.primary, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
          Alternative to {a.name}
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.6rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 20 }}>
          <span style={{ background: "linear-gradient(135deg, #818CF8, #C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {a.headline.split(" for ")[0]}
          </span>
          {" "}for {a.headline.split(" for ")[1]}
        </h1>
        <p style={{ fontSize: 19, color: C.muted, lineHeight: 1.7 }}>{a.subheadline}</p>
      </header>

      <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 96px" }}>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Why Agencies Use {a.name} as a Client Portal
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>{a.whyPeople}</p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Why Agency OS Is the Better Alternative
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>{a.why}</p>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Agency OS vs {a.name} — Side-by-Side
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#0D0D13" }}>
                  {["Feature", a.name, "Agency OS"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: C.muted, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {a.comparisons.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : "#0D0D13" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#E5E7EB" }}>{row.aspect}</td>
                    <td style={{ padding: "14px 16px", color: C.muted }}>{row.them}</td>
                    <td style={{ padding: "14px 16px", color: C.green, fontWeight: 600 }}>{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Frequently Asked Questions
          </h2>
          {a.faqs.map((faq) => (
            <div key={faq.q} style={{ padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{faq.q}</h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75 }}>{faq.a}</p>
            </div>
          ))}
        </section>

        <div style={{ textAlign: "center", padding: "48px 32px", background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(91,92,246,0.12), transparent 70%)", border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Free to start · 15-minute setup</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Switch to a purpose-built client portal.
          </h2>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 32px", background: C.primary, color: "#fff", fontWeight: 600, borderRadius: 12, textDecoration: "none", fontSize: 15, boxShadow: "0 0 28px rgba(91,92,246,0.4)" }}>
            Start free with Agency OS →
          </Link>
        </div>
      </article>
    </main>
  );
}
