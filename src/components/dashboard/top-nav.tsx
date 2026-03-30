"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Bell, Search, Settings } from "lucide-react";
import Image from "next/image";

export function DashboardTopNav() {
  const { user } = useAuth();
  const userName = user?.displayName || "Agency Owner";
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('q', e.target.value);
    } else {
      params.delete('q');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="h-[72px] shrink-0 border-b border-[#1F1F2B] bg-[#0D0D13]/95 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-xl font-headline font-bold text-white tracking-tight">Active Clients</h1>
        <div className="h-6 w-px bg-[#1F1F2B] mx-2"></div>
        <div className="relative group max-w-md w-full">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#5B5CF6] transition-colors" />
          <input 
            type="text" 
            placeholder="Search projects, clients, or updates..." 
            defaultValue={searchParams.get('q') || ""}
            onChange={handleSearch}
            className="w-full bg-[#1A1A24] border border-[#2D2D3D] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#5B5CF6]/50 focus:ring-1 focus:ring-[#5B5CF6]/50 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative p-2 text-[#9CA3AF] hover:text-white transition-colors rounded-lg hover:bg-[#1A1A24]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#FF6B6B] border-2 border-[#0D0D13]"></span>
        </button>
        <div className="h-8 w-px bg-[#1F1F2B]"></div>
        <button className="flex items-center gap-3 pl-2 py-1 rounded-full hover:bg-[#1A1A24] transition-colors border border-transparent hover:border-[#2D2D3D] pr-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5B5CF6] to-[#A4A6FF] flex items-center justify-center text-sm font-bold text-white shadow-inner">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col items-start pr-1 hidden md:flex">
            <span className="text-sm font-medium text-white leading-none">{userName}</span>
            <span className="text-[10px] text-[#9CA3AF] mt-1 font-medium tracking-wide uppercase">Agency Admin</span>
          </div>
          <Settings className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>
    </header>
  );
}
