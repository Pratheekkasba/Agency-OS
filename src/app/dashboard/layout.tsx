"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div suppressHydrationWarning className="w-6 h-6 border-2 border-[#5B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0B0B0F] flex">
      <DashboardSidebar />
      <main suppressHydrationWarning className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
