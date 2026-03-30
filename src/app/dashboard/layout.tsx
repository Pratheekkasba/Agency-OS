"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!userData?.role) {
        router.replace("/role");
      } else if (userData?.role === "client") {
        router.replace("/portal");
      }
    }
  }, [user, userData, loading, router]);

  if (loading || !user || !userData?.role || userData?.role === "client") {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div suppressHydrationWarning className="w-6 h-6 border-2 border-[#5B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0B0B0F] flex overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopNav />
        <main suppressHydrationWarning className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}

