"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Bell, Search, Settings } from "lucide-react";

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
  return "Agency OS";
}

export function DashboardTopNav() {
  const { user } = useAuth();
  const userName = user?.displayName || "Agency Owner";
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageTitle = getPageTitle(pathname);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("q", e.target.value);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const showSearch = ["/dashboard", "/dashboard/clients", "/dashboard/projects", "/dashboard/tasks"].includes(pathname);

  return (
    <header className="h-[60px] shrink-0 border-b border-[#1A1A22] bg-[#0B0B0F]/95 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <h1
          className="text-[15px] font-bold text-white tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {pageTitle}
        </h1>
        {showSearch && (
          <>
            <div className="h-5 w-px bg-[#1F1F2B] mx-1" />
            <div className="relative group max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#5B5CF6] transition-colors" />
              <input
                type="text"
                placeholder="Search…"
                defaultValue={searchParams.get("q") || ""}
                onChange={handleSearch}
                className="w-full bg-[#131317] border border-[#1F1F2B] rounded-lg pl-9 pr-4 py-1.5 text-[13px] text-white placeholder-[#4B5563] focus:outline-none focus:border-[#5B5CF6]/40 focus:ring-1 focus:ring-[#5B5CF6]/30 transition-all"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-[#6B7280] hover:text-white transition-colors rounded-lg hover:bg-[#131317]">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444] border border-[#0B0B0F]" />
        </button>
        <div className="h-6 w-px bg-[#1A1A22]" />
        <button
          onClick={() => router.push("/dashboard/settings")}
          className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-[#131317] transition-colors border border-transparent hover:border-[#1F1F2B]"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5B5CF6] to-[#4F50DB] flex items-center justify-center text-[11px] font-black text-white shadow-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-col items-start hidden md:flex">
            <span className="text-[12px] font-semibold text-white leading-none mb-0.5">{userName}</span>
            <span className="text-[10px] text-[#5B5CF6] font-bold uppercase tracking-wider">Agency Pro</span>
          </div>
        </button>
      </div>
    </header>
  );
}
