import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const C = {
  bg: "#0B0B0F", surface: "#12121A", border: "#1F1F2B",
  muted: "#9CA3AF", primary: "#10b981", accent: "#5B5CF6",
};

const niches: Record<string, {
  name: string; slug: string; emoji: string;
  headline: string; subheadline: string;
  pain: string; solution: string;
  stats: { v: string; l: string }[];
  features: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
}> = {
  "marketing-agencies": {
    name: "Marketing Agencies", slug: "marketing-agencies", emoji: "📣",
    headline: "Client Portals for Marketing Agencies",
    subheadline: "Give clients real-time campaign visibility. Stop writing weekly performance recap emails.",
    pain: "Marketing agencies run 6–12 concurrent campaigns and field dozens of 'how are our ads performing?' questions per week. Every answer is a bespoke email that takes 30 minutes to write and is outdated 24 hours later.",
    solution: "Agency OS gives marketing clients a live campaign status portal — milestone tracking from brief to launch, deliverable approvals, and a performance update feed — without exposing your internal campaign management tools.",
    stats: [{ v: "4.2 hrs", l: "Per week per PM writing campaign status emails" }, { v: "68%", l: "Of marketing clients feel underinformed about campaign progress" }, { v: "80%", l: "Reduction in campaign check-in calls with Agency OS" }, { v: "3×", l: "Faster client approvals using digital sign-off vs email" }],
    features: [
      { title: "Campaign Milestone Tracking", body: "Publish a structured timeline from strategy to launch. Clients see Brief Approved → Creative Phase → Review → Live → Reporting — not your internal Trello chaos." },
      { title: "Creative Approval Workflows", body: "Upload creative assets directly to the portal. Clients review and approve with a timestamped digital sign-off — replacing email threads like 'v3_FINAL_approved_use-this-one.jpg'." },
      { title: "Performance Update Feed", body: "Post weekly performance summaries structured as: What happened → What we learned → What we're doing next. Clients read it in 2 minutes instead of 40-line email threads." },
      { title: "White-Labeled Under Your Brand", body: "Your logo, your domain (reports.youragency.com), your color palette. Clients experience a premium product that reinforces your retainer value, not a third-party SaaS tool." },
    ],
    faqs: [
      { q: "What should a client portal include for marketing agencies?", a: "A marketing agency client portal should include: campaign milestone tracking (from brief to live), creative approval workflows with timestamped sign-offs, performance update summaries, deliverable file delivery, and role-based access so different client stakeholders see the information relevant to them." },
      { q: "How do marketing agencies reduce client status emails?", a: "The root cause of status emails is information asymmetry. Clients don't know what's happening because they can't see it. A portal that shows real-time campaign milestones and weekly performance updates eliminates the need to ask — because the answer is always visible." },
      { q: "Can Agency OS integrate with marketing tools like Google Analytics?", a: "Agency OS is focused on milestone status and communication, not analytics dashboards. For performance data, agencies publish structured updates to the portal's update feed — connecting the data context (what the numbers mean) with the numbers themselves." },
    ],
  },
  "design-agencies": {
    name: "Design Agencies", slug: "design-agencies", emoji: "🎨",
    headline: "Client Portals for Design Agencies",
    subheadline: "Streamline design reviews, protect your creative scope, and eliminate v47_final_final.pdf.",
    pain: "Design agencies lose weeks to unstructured feedback cycles. Clients email comments across 12 threads, forget what they approved in week 2, and demand revisions outside the agreed scope. The root cause is no structured approval process.",
    solution: "Agency OS gives design clients a structured review and approval portal — upload deliverables, collect feedback in one place, capture digital sign-offs with timestamps, and lock phases once approved to prevent scope creep.",
    stats: [{ v: "34%", l: "Of agency projects experience scope creep" }, { v: "$47K", l: "Average value lost to uncompensated revision cycles per agency per year" }, { v: "3×", l: "Faster sign-offs with structured digital approval vs email" }, { v: "91%", l: "Of design clients prefer portal review over email feedback" }],
    features: [
      { title: "Structured Creative Brief Delivery", body: "Upload the brief, moodboard, and first concepts directly to the portal. Clients see a structured package — not a Dropbox link buried in 3-week-old email." },
      { title: "Version-Controlled Design Approval", body: "Each milestone (Concepts → Refinement → Final) requires explicit sign-off before advancing. Clients see Draft 1, Draft 2, Draft 3 — not a confusing file dump." },
      { title: "Timestamped Scope Lock", body: "Once a phase is approved, it is locked with the client's digital signature. Revision requests after lock-in trigger an automatic change order flow — protecting your margin without an awkward conversation." },
      { title: "Feedback Consolidation", body: "Instead of scattered email feedback, clients submit structured comments per deliverable in the portal. One source of truth. No more 'which feedback is final?' archaeology." },
    ],
    faqs: [
      { q: "How do design agencies prevent scope creep?", a: "Scope creep in design projects is almost always caused by unstructured approvals. When clients can informally request changes via email after verbal approval, there's no mechanism to say no. Digital approvals with phase locks shut this down structurally." },
      { q: "What is the best client portal for design agencies?", a: "Agency OS is designed specifically for the client communication layer — not the design tool layer. Use Figma for design, Agency OS for the client-facing approval workflow and milestone tracking. The combination eliminates the email chain that currently mediates between them." },
    ],
  },
  "seo-agencies": {
    name: "SEO Agencies", slug: "seo-agencies", emoji: "📈",
    headline: "Client Portals for SEO Agencies",
    subheadline: "Show clients what you're doing, why it's working, and what comes next — without weekly report emails.",
    pain: "SEO agencies struggle with client education: clients can't see the work, can't feel the momentum, and cancel retainers right before rankings break through. The 'invisible work' problem kills long-term retention.",
    solution: "Agency OS gives SEO clients a structured milestone view that shows what work was done this month, the expected impact, and what comes next — making SEO work visible and the retainer value tangible.",
    stats: [{ v: "47%", l: "Of SEO clients cancel in months 3–6 — before results compound" }, { v: "5 hrs", l: "Per week per account manager spent on SEO reporting emails" }, { v: "60%", l: "Reduction in client churn when progress is regularly visible" }, { v: "2×", l: "Longer average retainer with structured milestone communication" }],
    features: [
      { title: "Monthly SEO Deliverable Milestones", body: "Publish structured monthly milestones: Technical Audit → On-Page Optimization → Link Building → Content Production. Clients see the compounding effort — not just a ranking report." },
      { title: "Narrative Performance Updates", body: "Post monthly updates in the format: What we did → What changed → What we're doing next. Clients understand the strategy, not just the metrics — reducing 'are we getting results?' anxiety." },
      { title: "Deliverable Sign-Off for Strategy Changes", body: "When pivoting keyword strategy or launching a new content cluster, get explicit client approval and log it. Protects you when a client asks 'why did you change the plan?'" },
      { title: "White-Label Client-Facing Portal", body: "Clients access their SEO portal at reports.youragency.com — branded to your agency. Reinforces your authority as an SEO expert, not a commodity vendor." },
    ],
    faqs: [
      { q: "How do SEO agencies retain clients longer?", a: "The #1 reason SEO clients cancel is that they can't feel the momentum. Making the work visible — through a structured milestone portal that shows consistent monthly deliverables — bridges the gap between invisible SEO work and client confidence." },
      { q: "What should an SEO agency client portal show clients?", a: "An SEO client portal should show: monthly deliverable milestones (what was done), narrative updates (what it means), upcoming work (what comes next), and key metric trends. Avoid raw data dumps — clients need interpretation, not numbers." },
    ],
  },
  "web-development-agencies": {
    name: "Web Development Agencies", slug: "web-development-agencies", emoji: "💻",
    headline: "Client Portals for Web Development Agencies",
    subheadline: "Keep non-technical clients informed through complex builds without exposing your GitHub or Jira.",
    pain: "Web development agencies struggle to keep non-technical clients informed during long build cycles. Clients feel left in the dark for weeks, panic, then demand rushed demos that derail sprint velocity.",
    solution: "Agency OS translates your internal development milestones into client-readable progress updates — Design Approved → Development → QA → Launch — giving clients visibility without access to your internal tools.",
    stats: [{ v: "12 wks", l: "Average web project cycle that clients can't see inside" }, { v: "71%", l: "Of web projects experience client-initiated scope changes mid-build" }, { v: "85%", l: "Of scope disputes involve milestones that weren't formally approved" }, { v: "40%", l: "Fewer emergency calls with a structured client update portal" }],
    features: [
      { title: "Layperson Milestone Translation", body: "Convert 'Sprint 4 backend API completion' into 'Payment System: Built and tested. Ready for review.' Clients understand outcomes — not engineering phases." },
      { title: "Staged Approval Gates", body: "Design Approval → Staging Review → Pre-Launch Sign-Off. Each gate requires explicit digital approval before the next phase starts. Protects your timeline and your scope." },
      { title: "Staging Environment Integration", body: "Link staging URLs directly in portal milestone updates so clients can review the live build in context — replacing the disjointed 'I've sent you a Loom' workflow." },
      { title: "Change Order Documentation", body: "When clients request new features mid-build, the portal automates the change order documentation trail — protecting your revenue and preventing scope creep from 'just quickly adding one thing'." },
    ],
    faqs: [
      { q: "How do web development agencies handle non-technical clients?", a: "The key is translation: your internal sprints and tickets don't mean anything to a client. A structured portal that shows outcome-level milestones (what's built, what's next, what's approved) gives non-technical clients confidence without requiring them to understand your stack." },
      { q: "What should a web development client portal include?", a: "A web development client portal should show: project phases (not sprints), staged approval gates, staging environment links, approved change orders, and launch checklist status. The goal is to make the invisible work of development visible at the right altitude for a business owner." },
    ],
  },
  "video-production-agencies": {
    name: "Video Production Agencies", slug: "video-production-agencies", emoji: "🎬",
    headline: "Client Portals for Video Production Agencies",
    subheadline: "Streamline video reviews, capture frame-accurate feedback, and end the 'which cut is final?' chaos.",
    pain: "Video production agencies waste enormous time managing feedback loops across email, Slack, WeTransfer links, and verbal calls. Version confusion (v3_FINAL_client-approved-Monday.mp4) causes expensive re-edits that destroy margin.",
    solution: "Agency OS gives video clients a structured production portal — from brief to final delivery — with milestone approvals at each stage and structured feedback collection replacing scattered email threads.",
    stats: [{ v: "38%", l: "Of video production budget consumed by re-edits from unclear feedback" }, { v: "6.4 hrs", l: "Per project spent managing video feedback via email" }, { v: "3×", l: "Faster final approvals with structured digital sign-off" }, { v: "92%", l: "Of video clients prefer consolidated portal feedback over email" }],
    features: [
      { title: "Production Phase Milestones", body: "Brief → Pre-Production Approval → Rough Cut → Fine Cut → Final Delivery. Clients approve each phase before you invest time in the next — protecting your production budget." },
      { title: "Structured Feedback Collection", body: "Instead of 'I'll know it when I see it' emails, clients submit structured feedback per deliverable: timestamp, what to change, priority. One thread. No ambiguity." },
      { title: "Version-Locked Sign-Offs", body: "Once a client approves a cut, it's locked with a digital signature. Any revision request after lock-in is documented as a new scope item — protecting your margin from endless polish requests." },
      { title: "Secure Asset Delivery", body: "Final deliverables are downloadable directly from the portal with watermark control and download logging — replacing expiring WeTransfer links and email attachment chaos." },
    ],
    faqs: [
      { q: "How do video production agencies manage client feedback?", a: "The most effective method is structured portal-based feedback collection. Each deliverable milestone opens a feedback window with a defined close date. Clients submit their notes in one place; you get a single, consolidated revision brief — not 14 separate emails." },
      { q: "What is the best client portal for video production?", a: "Agency OS handles the milestone approval and communication layer for video production — from brief approval through final delivery sign-off. For frame-level annotation, pair it with a video review tool like Frame.io; use Agency OS for the overall project status and client approval workflow." },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(niches).map((slug) => ({ niche: slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ niche: string }> }
): Promise<Metadata> {
  const { niche } = await params;
  const n = niches[niche];
  if (!n) return {};
  return {
    title: `${n.headline} — Agency OS`,
    description: n.subheadline,
    alternates: { canonical: `https://agency-os.tech/client-portal/${n.slug}` },
    openGraph: { title: n.headline, url: `https://agency-os.tech/client-portal/${n.slug}`, type: "website" },
  };
}

export default async function NichePage({ params }: { params: Promise<{ niche: string }> }) {
  const { niche } = await params;
  const n = niches[niche];
  if (!n) notFound();

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: n.faqs.map((f) => ({
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
          {n.emoji} {n.name}
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.6rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 20 }}>
          {n.headline.split(" for ")[0]} for{" "}
          <span style={{ background: "linear-gradient(135deg, #34D399, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {n.name}
          </span>
        </h1>
        <p style={{ fontSize: 19, color: C.muted, lineHeight: 1.7 }}>{n.subheadline}</p>
      </header>

      <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 96px" }}>

        {/* Stats */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {n.stats.map((s) => (
                <div key={s.l}>
                  <div style={{ fontSize: 30, fontWeight: 700, color: C.primary, letterSpacing: "-0.03em" }}>{s.v}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The problem */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            The Problem Every {n.name} Faces
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>{n.pain}</p>
        </section>

        {/* Solution */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            How Agency OS Solves It for {n.name}
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>{n.solution}</p>
        </section>

        {/* Features */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Key Features for {n.name}
          </h2>
          {n.features.map((f, i) => (
            <div key={i} style={{ padding: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 14 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.primary, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>{f.body}</p>
            </div>
          ))}
        </section>

        {/* FAQs */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Frequently Asked Questions
          </h2>
          {n.faqs.map((faq) => (
            <div key={faq.q} style={{ padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{faq.q}</h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75 }}>{faq.a}</p>
            </div>
          ))}
        </section>

        {/* Internal links */}
        <section style={{ padding: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Also useful</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/blog/client-portal/what-is-client-portal" style={{ fontSize: 14, color: C.primary, textDecoration: "none" }}>→ What is a client portal for agencies — the complete guide</Link>
            <Link href="/blog/client-portal/client-approval-workflow" style={{ fontSize: 14, color: C.primary, textDecoration: "none" }}>→ How to build a client approval workflow that prevents scope creep</Link>
            <Link href="/blog/client-portal/white-label-client-portal" style={{ fontSize: 14, color: C.primary, textDecoration: "none" }}>→ White-label client portals — command a pricing premium</Link>
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "48px 32px", background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.10), transparent 70%)", border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Purpose-built for {n.name} · No credit card required</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Build your {n.name.toLowerCase()} client portal in 15 minutes.
          </h2>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 32px", background: C.accent, color: "#fff", fontWeight: 600, borderRadius: 12, textDecoration: "none", fontSize: 15, boxShadow: "0 0 28px rgba(91,92,246,0.4)" }}>
            Start free with Agency OS →
          </Link>
        </div>
      </article>
    </main>
  );
}
