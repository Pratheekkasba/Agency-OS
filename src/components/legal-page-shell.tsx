import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1
          className="text-3xl font-bold text-white mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {title}
        </h1>
        <p className="text-sm text-[#6B7280] mb-10">Agency OS · Last updated May 2026</p>
        <div className="space-y-6 text-[#9CA3AF] text-sm leading-relaxed">{children}</div>
        <footer className="mt-16 pt-8 border-t border-[#1F1F2B] text-center text-xs text-[#6B7280]">
          © 2026 Agency OS
        </footer>
      </div>
    </div>
  );
}
