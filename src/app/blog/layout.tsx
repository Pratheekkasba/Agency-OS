import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "Agency OS Blog — Client Experience & Agency Operations",
    template: "%s | Agency OS Blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#0B0B0F",
        color: "#FFFFFF",
        fontFamily: "'Space Grotesk', sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Blog Nav */}
      <nav
        style={{
          borderBottom: "1px solid #1F1F2B",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(11,11,15,0.92)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              fontWeight: 700,
              fontSize: 20,
              color: "#FFFFFF",
              textDecoration: "none",
              letterSpacing: "-0.02em",
            }}
          >
            Agency OS<span style={{ color: "#5B5CF6" }}>.</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link href="/blog" style={{ fontSize: 14, color: "#9CA3AF", textDecoration: "none" }}>
              All Posts
            </Link>
            <Link href="/blog/client-portal/what-is-client-portal" style={{ fontSize: 14, color: "#9CA3AF", textDecoration: "none" }}>
              Client Portals
            </Link>
            <Link href="/blog/agency-infrastructure/agency-management-software" style={{ fontSize: 14, color: "#9CA3AF", textDecoration: "none" }}>
              Agency Ops
            </Link>
            <Link
              href="/signup"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#FFFFFF",
                background: "#5B5CF6",
                padding: "8px 18px",
                borderRadius: 10,
                textDecoration: "none",
              }}
            >
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
