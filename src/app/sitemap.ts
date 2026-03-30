import type { MetadataRoute } from "next";

const BASE = "https://agency-os.tech";
const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Core pages ───────────────────────────────────────────
    { url: BASE, lastModified: NOW, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/features`, lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/pricing`, lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/signup`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/login`, lastModified: NOW, changeFrequency: "monthly", priority: 0.7 },

    // ── Blog hub ─────────────────────────────────────────────
    { url: `${BASE}/blog`, lastModified: NOW, changeFrequency: "weekly", priority: 0.85 },

    // Silo 1: Client Portal Mastery
    { url: `${BASE}/blog/client-portal/what-is-client-portal`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/client-portal/client-portal-software`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/client-portal/client-portal-vs-email`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/client-portal/white-label-client-portal`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/client-portal/client-approval-workflow`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },

    // Silo 2: Agency Infrastructure Ops
    { url: `${BASE}/blog/agency-infrastructure/agency-management-software`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/agency-infrastructure/client-communication-tools`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/agency-infrastructure/reduce-client-status-questions`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/agency-infrastructure/agency-project-visibility`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/agency-infrastructure/client-onboarding-system`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },

    // ── Competitor Comparison Pages (/vs/) ───────────────────
    { url: `${BASE}/vs/clickup`, lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/vs/notion`, lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/vs/monday`, lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/vs/asana`, lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/vs/basecamp`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },

    // ── Niche Landing Pages (/client-portal/[niche]) ─────────
    { url: `${BASE}/client-portal/marketing-agencies`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/client-portal/design-agencies`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/client-portal/seo-agencies`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/client-portal/web-development-agencies`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/client-portal/video-production-agencies`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },

    // ── Alternatives Pages ────────────────────────────────────
    { url: `${BASE}/alternatives/notion`, lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/alternatives/clickup`, lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/alternatives/monday`, lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },

    // ── Glossary (AI Search / Perplexity citations) ───────────
    { url: `${BASE}/glossary/client-portal`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/glossary/white-label-client-portal`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/glossary/milestone-approval`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/glossary/agency-management-software`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },

    // ── Original Research Data ────────────────────────────────
    { url: `${BASE}/research/state-of-client-anxiety-2026`, lastModified: NOW, changeFrequency: "yearly", priority: 0.9 },
  ];
}
