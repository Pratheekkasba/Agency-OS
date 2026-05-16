"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { requiresEmailVerification } from "@/lib/auth/email-verification";
import { SidebarProvider } from "@/context/SidebarContext";
import { MobileNavDrawer } from "@/components/dashboard/mobile-nav-drawer";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading, userRefreshKey } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!userData?.role) {
        router.replace("/role");
      } else if (userData?.role === "client") {
        router.replace("/portal");
      } else if (
        requiresEmailVerification(userData?.role) &&
        !user.emailVerified
      ) {
        router.replace("/verify");
      }
    }
  }, [user, userData, loading, userRefreshKey, router]);

  const agencyNeedsVerify =
    requiresEmailVerification(userData?.role) && !user?.emailVerified;

  if (loading || !user || !userData?.role || userData?.role === "client" || agencyNeedsVerify) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div suppressHydrationWarning className="w-6 h-6 border-2 border-[#5B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div suppressHydrationWarning className="h-screen bg-[#0B0B0F] flex overflow-hidden">
        <DashboardSidebar />
        <MobileNavDrawer />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <DashboardTopNav />
          <WelcomeBanner />
          <main suppressHydrationWarning className="flex-1 overflow-hidden relative min-h-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

