import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "White-Label Client Portal Software — The Agency's Competitive Edge in 2026",
  description: "How a custom-domain, white-label client portal commands premium pricing and reduces client churn by up to 40%. Full setup walkthrough for Agency OS.",
  keywords: ["white label client portal software", "branded client portal", "custom domain client portal agency"],
  alternates: { canonical: "https://agency-os.tech/blog/client-portal/white-label-client-portal" },
  openGraph: { title: "White-Label Client Portal Software — The Agency's Competitive Edge in 2026", url: "https://agency-os.tech/blog/client-portal/white-label-client-portal", type: "article" },
};

const C = { bg: "#0B0B0F", surface: "#12121A", border: "#1F1F2B", muted: "#9CA3AF", primary: "#5B5CF6" };

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "White-Label Client Portal Software — The Agency's Competitive Edge in 2026",
  image: "https://agency-os.tech/og-image.png",
  author: { "@type": "Organization", name: "Agency OS", url: "https://agency-os.tech" },
  publisher: { "@id": "https://agency-os.tech/#organization" },
  datePublished: "2026-03-30", dateModified: "2026-03-30",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://agency-os.tech/blog/client-portal/white-label-client-portal" },
};
const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is a white-label client portal?", acceptedAnswer: { "@type": "Answer", text: "A white-label client portal is a branded, custom-domain version of a SaaS platform that allows agencies to present their own visual identity to clients — their logo, colors, and domain — with no trace of the underlying software vendor's branding." } },
    { "@type": "Question", name: "How does a white-label portal help agencies charge more?", acceptedAnswer: { "@type": "Answer", text: "A custom-domain client portal (portal.youragency.com) signals proprietary infrastructure and operational sophistication. Agencies using white-label portals report being able to charge 15–30% higher retainers because the premium experience justifies the premium price." } },
    { "@type": "Question", name: "How do I set up a white-label client portal?", acceptedAnswer: { "@type": "Answer", text: "With Agency OS Enterprise, add a CNAME DNS record pointing your subdomain to Agency OS's servers, enter your domain in the branding settings, and click Verify. An SSL certificate is provisioned automatically within 2–5 minutes. Total setup time is under 10 minutes." } },
  ],
};

export default function WhiteLabelClientPortal() {
  return (
    <main style={{ background: C.bg, color: "#fff", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "White-Label Client Portal Software — The Agency's Competitive Edge in 2026", author: { "@type": "Organization", name: "Agency OS" }, publisher: { "@id": "https://agency-os.tech/#organization" }, datePublished: "2026-03-30", mainEntityOfPage: { "@type": "WebPage", "@id": "https://agency-os.tech/blog/client-portal/white-label-client-portal" } }) }} />

      <header style={{ maxWidth: 780, margin: "0 auto", padding: "72px 24px 48px" }}>
        <Link href="/blog" style={{ fontSize: 13, color: C.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>← All posts</Link>
        <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 999, background: `${C.primary}15`, border: `1px solid ${C.primary}30`, color: C.primary, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 20 }}>Client Portal Mastery</div>
        <h1 style={{ fontSize: "clamp(1.9rem, 4.5vw, 2.6rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 20 }}>
          White-Label Client Portal Software —{" "}
          <span style={{ background: "linear-gradient(135deg, #818CF8, #C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The Agency's Competitive Edge in 2026</span>
        </h1>
        <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>
          A white-label client portal is a branded, custom-domain version of a SaaS platform that allows agencies to present their own visual identity to clients upon login — creating the perception of proprietary infrastructure that justifies premium retainer pricing.
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "#555566" }}>
          <span>By Agency OS</span><span>·</span><span>March 30, 2026</span><span>·</span><span>9 min read</span>
        </div>
      </header>

      <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 96px" }}>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>What Is a White-Label Client Portal?</h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            Read our{" "}
            <Link href="/blog/client-portal/what-is-client-portal" style={{ color: C.primary, textDecoration: "underline" }}>foundational guide to agency client portals</Link>
            {" "}first if you're new to the category. In short: a standard client portal shows your client their project on a third-party platform (e.g., <em>client.agencyos.tech/your-client</em>). A white-label portal shows them <em>portal.youragency.com</em> — fully branded, no trace of the underlying tool.
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Difference Between Branded, White-Label, and Custom-Built Portals</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#0D0D13" }}>
                  {["Type", "Domain", "Branding", "Cost", "Setup Time"].map((h) => (<th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6B7280", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Branded", "Third-party subdomain", "Logo only", "$0", "Minutes"],
                  ["White-Label", "Your custom domain", "Logo + colors + no 3rd party brand", "$99–$199/mo", "< 1 hour"],
                  ["Custom-Built", "Your domain", "Fully custom", "$50K–$200K", "6–12 months"],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    {row.map((cell, j) => (<td key={j} style={{ padding: "14px 16px", color: j === 0 ? "#E5E7EB" : C.muted }}>{cell}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Why Top Agencies Invest in White-Label Client Portals</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>The Pricing Premium a Custom Domain Commands</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
            When a client logs into <strong style={{ color: "#E5E7EB" }}>portal.youragency.com</strong> versus <strong style={{ color: "#E5E7EB" }}>agencyos.tech/client</strong>, the perceived experience is completely different. The first signals a proprietary system built by a sophisticated, established agency. The second signals a SaaS tool the agency is using.  Agencies using white-label portals report being able to charge 15–30% higher retainers because the operational credibility they project is visibly higher.
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>How White-Label Portals Reduce Churn by 30–40%</h3>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>
            The primary driver of agency churn is invisible progress — clients who don't feel they know what they're paying for. A white-label portal with daily visibility into project status eliminates the primary anxiety trigger. Agencies using Agency OS report an average 80% reduction in reactive check-in requests and a measurable increase in 12-month retention rates.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>What to Look For in White-Label Client Portal Software</h2>
          {[
            { title: "Custom Domain (CNAME) Support", body: "The vendor must allow you to point your own subdomain (portal.youragency.com) to their infrastructure via a CNAME DNS record. Without this, true white-labeling is impossible." },
            { title: "Logo, Color, and Font Customization", body: "Your brand identity should replace the vendor's entirely — not just add a logo next to theirs. Full color palette and typography control is the minimum bar." },
            { title: "Removal of All Third-Party Branding", body: "Every email notification, loading screen, footer, and browser tab title should reflect your agency, not the portal vendor. Check the fine print on lower pricing tiers — many only partially remove branding." },
          ].map((item) => (
            <div key={item.title} style={{ padding: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 14 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>{item.body}</p>
            </div>
          ))}
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginTop: 16 }}>
            For a detailed vendor comparison that evaluates these criteria across all major platforms, see our guide to{" "}
            <Link href="/blog/client-portal/client-portal-software" style={{ color: C.primary, textDecoration: "underline" }}>comparing white-label client portal vendors</Link>.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Agency OS White-Label Portal — Setup Walkthrough</h2>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Connecting Your Custom Domain in Under 10 Minutes</h3>
          {["In your agency's DNS settings, add a CNAME record: portal.youragency.com → custom.agency-os.tech", "In Agency OS Enterprise settings, navigate to Branding → Custom Domain and enter your subdomain.", "Click 'Verify' — Agency OS will provision an SSL certificate automatically (typically within 2–5 minutes).", "Your clients now log in at portal.youragency.com with zero trace of Agency OS branding."].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 16, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${C.primary}20`, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, paddingTop: 4 }}>{step}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>White-Label Portal Pricing — What Does It Actually Cost?</h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
            Building a custom client portal from scratch costs $50K–$200K and takes 6–12 months. Agency OS Enterprise at $199/month delivers the same white-label experience in under an hour.
          </p>
          <div style={{ padding: 24, background: C.surface, border: `1px solid rgba(91,92,246,0.3)`, borderRadius: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 8 }}>Agency OS Enterprise — $199/month</div>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>Full white-label (custom domain + complete brand removal), unlimited clients, AI inbox triage, advanced analytics, milestone approvals, and priority support. See the full{" "}<Link href="/pricing" style={{ color: C.primary, textDecoration: "underline" }}>Agency OS pricing tier breakdown</Link>.</p>
          </div>
        </section>

        <div style={{ textAlign: "center", padding: "48px 32px", background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(91,92,246,0.12), transparent 70%)`, border: `1px solid ${C.border}`, borderRadius: 20 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>Start your white-label portal free trial.</h2>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: C.primary, color: "#fff", fontWeight: 600, borderRadius: 12, textDecoration: "none", boxShadow: "0 0 24px rgba(91,92,246,0.35)" }}>
            Get started with Agency OS →
          </Link>
        </div>
      </article>
    </main>
  );
}
