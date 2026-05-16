"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/clients": "Clients",
  "/dashboard/projects": "Projects",
  "/dashboard/tasks": "Tasks",
  "/dashboard/team": "Team",
  "/dashboard/messages": "Inbox",
  "/dashboard/updates": "Create Update",
  "/dashboard/whiteboard": "Whiteboard",
  "/dashboard/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/dashboard/projects/")) return "Project Details";
  if (pathname.startsWith("/dashboard/clients/")) return "Client Details";
  if (pathname.startsWith("/dashboard/whiteboard")) return "Whiteboard";
  return "Dashboard";
}

export function DashboardTopNav() {
  const { user } = useAuth();
  const userName = user?.displayName || "Agency Owner";
  const router = useRouter();
  const pathname = usePathname();
  const { toggleMobile } = useSidebar();

  const pageTitle = getPageTitle(pathname);
  const isDetailPage =
    pathname.startsWith("/dashboard/clients/") ||
    pathname.startsWith("/dashboard/projects/");

  return (
    <header className="h-[60px] shrink-0 border-b border-[#1A1A22] bg-[#0B0B0F]/95 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 min-w-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={toggleMobile}
          className="md:hidden p-2 -ml-1 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1A1A24] transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1
          className={`text-[15px] font-bold text-white tracking-tight truncate ${
            isDetailPage ? "md:block" : "md:hidden"
          }`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="h-6 w-px bg-[#1A1A22] hidden sm:block" />
        <button
          type="button"
          onClick={() => router.push("/dashboard/settings")}
          className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-[#131317] transition-colors border border-transparent hover:border-[#1F1F2B]"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5B5CF6] to-[#4F50DB] flex items-center justify-center text-[11px] font-black text-white shadow-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-col items-start hidden lg:flex">
            <span className="text-[12px] font-semibold text-white leading-none mb-0.5">{userName}</span>
            <span className="text-[10px] text-[#5B5CF6] font-bold uppercase tracking-wider">Agency Pro</span>
          </div>
        </button>
      </div>
    </header>
  );
}
