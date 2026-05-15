"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Globe } from "@/components/ui/globe";

export function AuthPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-[#0B0B0F]">
      <div className="hidden w-full md:block lg:w-1/2 relative bg-[#0B0B0F] overflow-hidden border-r border-[#1F1F2B]">
        <div className="h-full w-full flex items-center justify-center relative">
          <style>{`
            @keyframes globe-float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          `}</style>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-[600px] w-[600px] bg-[radial-gradient(circle_at_center,rgba(91,92,246,0.25),transparent_60%)] blur-3xl opacity-30 rounded-full" />
          </div>
          <div
            className="flex items-center justify-center relative z-10 w-full max-w-[600px] aspect-[1/1] scale-125 opacity-90"
            style={{ animation: "globe-float 8s ease-in-out infinite" }}
          >
            <Globe className="relative !inset-auto top-auto" />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center lg:w-1/2 relative bg-[#0B0B0F] px-6">
        <Link
          href="/login"
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#9CA3AF] border border-[#1F1F2B] bg-[#12121A] hover:text-white hover:border-[#2A2A3A] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </Link>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="h-[500px] w-[500px] rounded-full bg-[#5B5CF6]/[0.05] blur-[120px]" />
        </div>
        <div className="relative z-10 w-full max-w-md">
          <h1 className="text-3xl md:text-4xl font-medium text-white text-center">{title}</h1>
          <p className="mt-3 text-sm text-[#9CA3AF] text-center leading-relaxed">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
