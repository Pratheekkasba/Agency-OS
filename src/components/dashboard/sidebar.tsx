"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, FileText, Settings, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/updates", label: "Updates", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex w-60 min-h-screen flex-col border-r border-[#1F1F2B] bg-[#0D0D13] shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#1F1F2B]">
        <span
          className="text-xl font-bold text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Agency<span className="text-[#5B5CF6]"> OS</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2 px-3 font-body">Overview</div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-[#5B5CF6]/15 text-[#5B5CF6] border border-[#5B5CF6]/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  : "text-[#9CA3AF] hover:text-white hover:bg-[#1A1A24] border border-transparent"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-colors", active ? "text-[#5B5CF6]" : "text-[#6B7280] group-hover:text-white")} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1F1F2B]">
        {/* User Profile & Actions */}
        <div className="flex items-center justify-between bg-[#1A1A24] border border-[#2D2D3D] hover:border-[#374151] p-3 rounded-xl transition-all group shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#5B5CF6] to-[#8183FF] flex items-center justify-center text-white font-bold text-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] border border-[#4F50DB]">
              OS
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate group-hover:text-[#A4A6FF] transition-colors">Agency Admin</span>
              <span className="text-[10px] font-bold text-[#5B5CF6] uppercase tracking-wider truncate">Pro Member</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="p-2 rounded-lg text-[#9CA3AF] hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
