import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agency-os.tech"),
  title: {
    default: "Agency OS — Client Experience Infrastructure for Agencies",
    template: "%s | Agency OS",
  },
  description:
    "Agency OS is client experience infrastructure for high-ticket service agencies. Replace status email threads with a real-time, white-label client portal powered by Google AI. Give clients clarity. Get more referrals.",
  keywords: [
    "client portal for agencies",
    "agency management software",
    "white label client portal",
    "client communication tools",
    "agency client portal software",
    "client onboarding system",
    "project status portal",
    "reduce client status questions",
  ],
  authors: [{ name: "Agency OS", url: "https://agency-os.tech" }],
  creator: "Agency OS",
  publisher: "Agency OS",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://agency-os.tech",
    siteName: "Agency OS",
    title: "Agency OS — Client Experience Infrastructure for Agencies",
    description:
      "Replace manual status emails with a real-time, white-label client portal. Agency OS gives clients on-demand project visibility so they stop asking 'what's the status?'",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Agency OS — Client Experience Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agency OS — Client Experience Infrastructure for Agencies",
    description:
      "Replace status email threads with a white-label client portal. Built for high-ticket agencies, powered by Google AI.",
    images: ["/og-image.png"],
    creator: "@agencyos",
    site: "@agencyos",
  },
  alternates: {
    canonical: "https://agency-os.tech",
  },
  category: "technology",
};

import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <Toaster theme="dark" position="bottom-right" className="font-sans" />

        {/* ── JSON-LD: Organization (global — powers Knowledge Panel) ── */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://agency-os.tech/#organization",
              name: "Agency OS",
              legalName: "Agency OS Corp",
              url: "https://agency-os.tech",
              logo: {
                "@type": "ImageObject",
                url: "https://agency-os.tech/logo.png",
                width: 512,
                height: 512,
                caption: "Agency OS — Client Experience Infrastructure",
              },
              description:
                "Agency OS builds client experience infrastructure for service agencies. Our platform replaces manual status emails with a structured, AI-powered client portal that gives agency clients real-time project visibility, milestone approvals, and a premium branded experience.",
              foundingDate: "2026",
              areaServed: "Worldwide",
              slogan: "Client Experience Infrastructure for High-Ticket Agencies",
              knowsAbout: [
                "Client portal software",
                "Agency management platforms",
                "Client communication automation",
                "Project status reporting",
                "White-label SaaS portals",
                "AI inbox triage for agencies",
                "Client milestone approvals",
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "Customer Support",
                  email: "support@agency-os.tech",
                  url: "https://agency-os.tech/contact",
                  availableLanguage: "English",
                },
                {
                  "@type": "ContactPoint",
                  contactType: "Sales",
                  email: "hello@agency-os.tech",
                  url: "https://agency-os.tech/contact",
                  availableLanguage: "English",
                },
              ],
              sameAs: [
                "https://twitter.com/agencyos",
                "https://linkedin.com/company/agencyos",
                "https://www.producthunt.com/products/agency-os",
                "https://www.g2.com/products/agency-os",
                "https://www.capterra.com/p/agency-os",
                "https://alternativeto.net/software/agency-os",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Agency OS Pricing Plans",
                itemListElement: [
                  { "@type": "Offer", name: "Starter — Free Forever", url: "https://agency-os.tech/pricing" },
                  { "@type": "Offer", name: "Growth — $79/month", url: "https://agency-os.tech/pricing" },
                  { "@type": "Offer", name: "Enterprise — $199/month", url: "https://agency-os.tech/pricing" },
                ],
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://agency-os.tech",
              },
            }),
          }}
        />

        {/* ── JSON-LD: WebSite (global — powers Sitelinks Searchbox) ── */}
        <Script
          id="schema-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://agency-os.tech/#website",
              url: "https://agency-os.tech",
              name: "Agency OS",
              description: "Client experience infrastructure for service agencies",
              publisher: { "@id": "https://agency-os.tech/#organization" },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://agency-os.tech/blog?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XTQYX4L4WS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XTQYX4L4WS');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vyp84rrr2h");
          `}
        </Script>

      </body>
    </html>
  );
}
