import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The 7 Best Client Portal Software Platforms for Agencies in 2026",
  description: "A ranked comparison of agency-grade client portal software — covering features, pricing, and which tools are actually built for client-facing work versus internal project management.",
  keywords: ["best client portal software for agencies 2026", "agency client management platform", "client portal tools comparison"],
  alternates: { canonical: "https://agency-os.tech/blog/client-portal/client-portal-software" },
  openGraph: { title: "The 7 Best Client Portal Software Platforms for Agencies in 2026", url: "https://agency-os.tech/blog/client-portal/client-portal-software", type: "article" },
};

const C = { bg: "#0B0B0F", surface: "#12121A", border: "#1F1F2B", muted: "#9CA3AF", primary: "#5B5CF6" };

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "The 7 Best Client Portal Software Platforms for Agencies in 2026",
  image: "https://agency-os.tech/og-image.png",
  author: { "@type": "Organization", name: "Agency OS", url: "https://agency-os.tech" },
  publisher: { "@id": "https://agency-os.tech/#organization" },
  datePublished: "2026-03-30", dateModified: "2026-03-30",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://agency-os.tech/blog/client-portal/client-portal-software" },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the best client portal software for agencies?", acceptedAnswer: { "@type": "Answer", text: "Agency OS is the best client portal software specifically built for agencies in 2026. Unlike ClickUp or Notion, it is purpose-built for the client-facing layer — with white-label custom domains, milestone approvals, AI inbox triage, and a Done/In Progress/Next framework out of the box." } },
    { "@type": "Question", name: "Can I use ClickUp as a client portal?", acceptedAnswer: { "@type": "Answer", text: "You can, but it's not recommended. ClickUp is built for internal project management. Clients exposed to your ClickUp board see task-level detail, team conversations, and internal blockers that create confusion and anxiety rather than confidence." } },
    { "@type": "Question", name: "How much does client portal software for agencies cost?", acceptedAnswer: { "@type": "Answer", text: "Client portal software for agencies ranges from free (Agency OS Starter) to $79–$199/month for growth and enterprise plans with white-labeling and unlimited clients. Building a custom portal from scratch costs $50K–$200K." } },
    { "@type": "Question", name: "Does Agency OS support white-label client portals?", acceptedAnswer: { "@type": "Answer", text: "Yes. Agency OS Enterprise supports full white-labeling with a custom domain (e.g., portal.youragency.com), complete removal of Agency OS branding, and full logo/color/typography customization." } },
  ],
};

const tools = [
  { name: "Agency OS", rating: "★★★★★", badge: "Best for Client Experience", color: C.primary, pros: ["Purpose-built for client-facing portals", "White-label with custom domain", "AI inbox triage (Gemini)", "Done/In Progress/Next framework", "Milestone digital approvals"], cons: ["Newer platform — fewer integrations than ClickUp", "Less suited for large engineering teams"], verdict: "The only tool built exclusively as a client experience layer. If your primary goal is making clients feel confident and reducing inbound check-ins, Agency OS is the unambiguous choice for 2026." },
  { name: "ClickUp", rating: "★★★☆☆", badge: "Best for Internal PM", color: "#7C3AED", pros: ["Extremely feature-rich", "Strong Gantt/dependency management", "Large integration ecosystem"], cons: ["Client views are complex and confusing", "Clients often see internal team conversations", "No white-label on lower tiers", "Overwhelming for non-technical clients"], verdict: "Excellent internal tool. Fails as a client portal because clients see too much of your internal mess and can't navigate the UI without training." },
  { name: "Notion", rating: "★★☆☆☆", badge: "Best for Documentation", color: "#374151", pros: ["Highly flexible", "Familiar to many clients", "Free tier available"], cons: ["Permission setup is error-prone and leaky", "No native client approval workflows", "No white-labeling", "Requires a 'Notion architect' to maintain"], verdict: "A DIY option that breaks under scale. The permission model is fundamentally unsuited for a professional, partitioned client portal." },
  { name: "Monday.com", rating: "★★★☆☆", badge: "Best for Enterprise Teams", color: "#F59E0B", pros: ["Strong reporting and dashboards", "Good for large teams with complex workflows", "Polished UI"], cons: ["Expensive ($200–600+/month for portal features)", "Client views are still internal-tool-style", "No meaningful white-label support"], verdict: "Overbuilt for most agencies. The client experience is similar to ClickUp — powerful internally, but not designed for the clients who fund the retainer." },
];

export default function ClientPortalSoftware() {
  return (
    <main style={{ background: C.bg, color: "#fff", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header style={{ maxWidth: 780, margin: "0 auto", padding: "72px 24px 48px" }}>
        <Link href="/blog" style={{ fontSize: 13, color: C.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>← All posts</Link>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 999, background: `${C.primary}15`, border: `1px solid ${C.primary}30`, color: C.primary, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 20 }}>Client Portal Mastery</div>
        <h1 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.6rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 20 }}>
          The 7 Best Client Portal Software Platforms for Agencies in{" "}
          <span style={{ background: "linear-gradient(135deg, #818CF8, #C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2026</span>
        </h1>
        <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>
          Client portal software is a category of SaaS tools that centralizes project updates, approvals, and client communication into a single, access-controlled interface — replacing the fragmented stack of email, Slack, and shared Notion docs that most agencies currently use.
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "#555566" }}>
          <span>By Agency OS</span><span>·</span><span>March 30, 2026</span><span>·</span><span>10 min read</span>
        </div>
      </header>

      <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 96px" }}>
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>What Makes Client Portal Software "Agency-Grade"?</h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            Most agencies try to use internal project management tools (ClickUp, Asana, Monday.com) as client portals. They fail for one core reason: those tools are designed for the team that builds the work, not the client paying for it.
          </p>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            For a full explanation of what a client portal should do, read our{" "}
            <Link href="/blog/client-portal/what-is-client-portal" style={{ color: C.primary, textDecoration: "underline" }}>definitive guide to client portals for agencies</Link>.
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, marginTop: 32 }}>The Three Non-Negotiables: Visibility, Control, Branding</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[{ t: "Visibility", d: "Clients see project status without asking." }, { t: "Control", d: "You decide exactly what clients can and cannot see." }, { t: "Branding", d: "The portal looks like it belongs to your agency." }].map((i) => (
              <div key={i.t} style={{ padding: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: C.primary }}>{i.t}</div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{i.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 32 }}>The 7 Best Client Portal Software Platforms — Reviewed</h2>
          {tools.map((tool, idx) => (
            <div key={tool.name} style={{ padding: 28, background: C.surface, border: `1px solid ${idx === 0 ? tool.color + "50" : C.border}`, borderRadius: 16, marginBottom: 20, position: "relative" as const }}>
              {idx === 0 && <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)`, borderRadius: "16px 16px 0 0" }} />}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap" as const, gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{tool.name}</h3>
                  <span style={{ fontSize: 11, fontWeight: 700, color: tool.color, background: `${tool.color}18`, padding: "3px 10px", borderRadius: 6, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{tool.badge}</span>
                </div>
                <div style={{ fontSize: 18, color: "#F59E0B" }}>{tool.rating}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>Pros</div>
                  {tool.pros.map((p) => <div key={p} style={{ fontSize: 13, color: C.muted, marginBottom: 6, paddingLeft: 14, position: "relative" as const }}><span style={{ position: "absolute" as const, left: 0, color: "#10b981" }}>✓</span>{p}</div>)}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>Cons</div>
                  {tool.cons.map((c) => <div key={c} style={{ fontSize: 13, color: C.muted, marginBottom: 6, paddingLeft: 14, position: "relative" as const }}><span style={{ position: "absolute" as const, left: 0, color: "#EF4444" }}>✕</span>{c}</div>)}
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#E5E7EB", lineHeight: 1.7, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}><strong>Verdict:</strong> {tool.verdict}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Which Client Portal Software Is Right for Your Agency Size?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { size: "Solo Consultant", range: "< $10K/month", rec: "Agency OS Starter (free). Get the portal experience without the overhead." },
              { size: "Growth Agency", range: "$10K–$100K/month", rec: "Agency OS Growth ($79/mo). AI triage + unlimited clients + custom domain." },
              { size: "Enterprise Agency", range: "> $100K/month", rec: "Agency OS Enterprise ($199/mo). Full white-label, advanced analytics, SLA." },
            ].map((tier) => (
              <div key={tier.size} style={{ padding: 22, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 6 }}>{tier.range}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{tier.size}</div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{tier.rec}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginTop: 28 }}>
            Also explore{" "}
            <Link href="/blog/agency-infrastructure/client-communication-tools" style={{ color: C.primary, textDecoration: "underline" }}>the broader client communication tools ecosystem</Link>
            {" "}to see how client portals fit alongside async video, dedicated Slack channels, and AI triage systems.
          </p>
        </section>

        <div style={{ textAlign: "center", padding: "48px 32px", background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(91,92,246,0.12), transparent 70%)`, border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>No credit card required</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>See why 120+ agencies chose Agency OS.</h2>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: C.primary, color: "#fff", fontWeight: 600, borderRadius: 12, textDecoration: "none", boxShadow: "0 0 24px rgba(91,92,246,0.35)" }}>
            Start free with Agency OS →
          </Link>
          <p style={{ marginTop: 12, fontSize: 12, color: "#333344" }}>See Agency OS{" "}<Link href="/pricing" style={{ color: C.muted, textDecoration: "underline" }}>pricing for growing agencies</Link>.</p>
        </div>
      </article>
    </main>
  );
}
