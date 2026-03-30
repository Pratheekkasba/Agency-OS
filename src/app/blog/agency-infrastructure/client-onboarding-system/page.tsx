import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Build a Client Onboarding System That Retains Clients for Years",
  description: "The 5 pillars of world-class agency client onboarding, a copy-paste checklist, and how to set the expectations in week one that prevent 30-day churn.",
  keywords: ["client onboarding system for agencies", "agency client onboarding process", "onboarding new clients agency checklist", "prevent client churn onboarding"],
  alternates: { canonical: "https://agency-os.tech/blog/agency-infrastructure/client-onboarding-system" },
  openGraph: { title: "How to Build a Client Onboarding System That Retains Clients for Years", url: "https://agency-os.tech/blog/agency-infrastructure/client-onboarding-system", type: "article" },
};

const C = { bg: "#0B0B0F", surface: "#12121A", border: "#1F1F2B", muted: "#9CA3AF", primary: "#10b981", accent: "#5B5CF6" };

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "How to Build a Client Onboarding System That Retains Clients for Years",
  image: "https://agency-os.tech/og-image.png",
  author: { "@type": "Organization", name: "Agency OS", url: "https://agency-os.tech" },
  publisher: { "@id": "https://agency-os.tech/#organization" },
  datePublished: "2026-03-30", dateModified: "2026-03-30",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://agency-os.tech/blog/agency-infrastructure/client-onboarding-system" },
};
const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What should a client onboarding process include for agencies?", acceptedAnswer: { "@type": "Answer", text: "A world-class agency client onboarding process should include: a pre-kickoff portal setup sent before the kickoff call, a structured kickoff covering communication protocols and approval workflows, a 'How we work together' PDF, a visible first deliverable within week one, and a 30-day pulse check call." } },
    { "@type": "Question", name: "Why do agencies lose clients in the first 30 days?", acceptedAnswer: { "@type": "Answer", text: "70% of agencies who churn in the first 6 months do so because of onboarding failures — not delivery failures. Clients leave when their expectations were set incorrectly, their communication system is unclear, or they don't feel organized confidence from the agency in week one." } },
    { "@type": "Question", name: "How does a client portal improve agency onboarding?", acceptedAnswer: { "@type": "Answer", text: "Sending a client their portal login before the kickoff call — with their project milestones already loaded — creates an immediate impression of a sophisticated, organized agency. Clients who log in to see their project ready before the first call begin the relationship with confidence rather than blank-slate uncertainty." } },
  ],
};

const pillars = [
  { num: "01", title: "Pre-Kickoff Information Architecture", body: "Before the kickoff call happens, set up the client portal with their project milestones, assign them access, and share the login link with a short async video walkthrough. The client's first impression should be: these people are serious." },
  { num: "02", title: "The Kickoff Call — What It Must Cover", body: "A kickoff call that doesn't set expectations for communication cadence, approval processes, and how the client will get updates has failed its primary purpose. Book it for 60 minutes. Use 10 to cover project scope, 50 to cover the operating agreement." },
  { num: "03", title: "Communication Protocol Documentation", body: "Write down exactly how you communicate with clients: which channels, what response time SLAs, what the update frequency is, and how they request changes. Send it as a PDF after the kickoff. Clients who know how the machine works don't try to bypass it." },
  { num: "04", title: "First-Milestone Delivery (Week 1 or 2)", body: "The fastest way to build client confidence is to deliver something early. Structure your projects so a visible deliverable can be published to the portal in week one. It doesn't have to be large — a client who sees 'Kickoff Complete ✅' on day 5 has proof the project is in motion." },
  { num: "05", title: "30-Day Retention Check", body: "At the 30-day mark, schedule a 20-minute 'pulse check' call. Ask two questions: 'Do you feel informed about your project's progress?' and 'Is there anything about how we communicate that you'd change?' This call catches churn signals before they become cancellations." },
];

const checklist = [
  "☐ Create client's portal workspace before kickoff",
  "☐ Populate with project milestones (all named in client-readable language)",
  "☐ Send login link + 3-minute async Loom walkthrough of the portal",
  "☐ Schedule kickoff call (60 min minimum)",
  "☐ Cover communication protocol in kickoff — channels, SLAs, update frequency",
  "☐ Document and send 'How we work together' PDF post-kickoff",
  "☐ Deliver a visible first milestone within Week 1-2",
  "☐ Publish 'Kickoff Complete ✅' to portal immediately after kickoff call",
  "☐ Schedule 30-day pulse check in calendar on day 1",
  "☐ At 30 days: ask the two retention questions (informed? anything to change?)",
];

export default function ClientOnboardingSystem() {
  return (
    <main style={{ background: C.bg, color: "#fff", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "How to Build a Client Onboarding System That Retains Clients for Years", author: { "@type": "Organization", name: "Agency OS" }, publisher: { "@id": "https://agency-os.tech/#organization" }, datePublished: "2026-03-30", mainEntityOfPage: { "@type": "WebPage", "@id": "https://agency-os.tech/blog/agency-infrastructure/client-onboarding-system" } }) }} />

      <header style={{ maxWidth: 780, margin: "0 auto", padding: "72px 24px 48px" }}>
        <Link href="/blog" style={{ fontSize: 13, color: C.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>← All posts</Link>
        <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 999, background: `${C.primary}15`, border: `1px solid ${C.primary}30`, color: C.primary, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 20 }}>Agency Infrastructure Ops</div>
        <h1 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.6rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 20 }}>
          How to Build a Client Onboarding System{" "}
          <span style={{ background: "linear-gradient(135deg, #34D399, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>That Retains Clients for Years</span>
        </h1>
        <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>
          Agency client onboarding is the structured process of transitioning a new client from signed contract to active, confident project participant — setting the expectations, communication systems, and visibility infrastructure that determine whether they stay for 6 months or 3 years.
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "#555566" }}>
          <span>By Agency OS</span><span>·</span><span>March 30, 2026</span><span>·</span><span>10 min read</span>
        </div>
      </header>

      <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 96px" }}>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Why Most Agencies Have a Sales Process But No Onboarding System</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>The First 30 Days Define a 12-Month Relationship</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            70% of agency clients who churn in the first 6 months cite "didn't feel like the agency was organized" or "communication wasn't what I expected" as their primary reason. These are onboarding failures — not product or delivery failures. The client's expectations were set incorrectly from week one.
          </p>
          <div style={{ padding: 22, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, borderLeft: "3px solid #EF4444" }}>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
              <strong style={{ color: "#EF4444" }}>Key stat:</strong> Agencies with a formal, documented onboarding process report 41% higher 12-month retention than agencies that 'wing it' with each new client.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24 }}>The 5 Pillars of a World-Class Agency Client Onboarding System</h2>
          {pillars.map((p) => (
            <div key={p.num} style={{ display: "flex", gap: 20, marginBottom: 16, padding: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.primary}20`, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 800, letterSpacing: "0.04em" }}>{p.num}</div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>How the Client Portal Becomes the Foundation of Onboarding</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Giving Clients a "Home" Before the Kickoff Call</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            The most impactful change most agencies can make to their onboarding process is sending the portal login before the kickoff call — not after it. When a client opens their project portal and sees their name, their project milestones, and a note from their PM three days before the kickoff call, the impression is immediate: this is a professional, organized operation.
          </p>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>
            For a complete guide to{" "}
            <Link href="/blog/client-portal/what-is-client-portal" style={{ color: C.accent, textDecoration: "underline" }}>building a client portal for your agency</Link>
            {" "}, see our foundational guide. For the broader communication tools and channels that surround the portal, see our{" "}
            <Link href="/blog/agency-infrastructure/client-communication-tools" style={{ color: C.accent, textDecoration: "underline" }}>ranked client communication tool guide</Link>.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Copy-Paste Agency Client Onboarding Checklist</h2>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Download + Customize This Checklist</div>
            {checklist.map((item) => (
              <div key={item} style={{ fontSize: 14, color: C.muted, fontFamily: "monospace", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>{item}</div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>What a Great Onboarding System Makes Possible</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>From Transactional Projects to Long-Term Retainers</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            Clients convert from project-based to retainer-based relationships for one reason: they trust you. And trust is built in the first 60 days. An onboarding system that delivers visible progress, clear communication, and a premium experience lays the emotional and operational foundation for a 3-year relationship. The alternative — an unstructured, email-based start to the relationship — sets a ceiling on how deeply clients will invest with your agency.
          </p>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>
            Pair a strong onboarding system with{" "}
            <Link href="/blog/agency-infrastructure/reduce-client-status-questions" style={{ color: C.accent, textDecoration: "underline" }}>proactive status visibility</Link>
            {" "} and{" "}
            <Link href="/blog/client-portal/client-approval-workflow" style={{ color: C.accent, textDecoration: "underline" }}>structured milestone approvals</Link>
            {" "}to create the end-to-end client experience infrastructure that high-ticket agencies are built on.
          </p>
        </section>

        <div style={{ textAlign: "center", padding: "48px 32px", background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.08), transparent 70%)`, border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>Start onboarding clients like a world-class agency — free.</h2>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: C.accent, color: "#fff", fontWeight: 600, borderRadius: 12, textDecoration: "none", boxShadow: "0 0 24px rgba(91,92,246,0.35)" }}>
            Start free with Agency OS →
          </Link>
        </div>
      </article>
    </main>
  );
}
