"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, Settings, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Clients", icon: Users },
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
    <aside className="w-60 min-h-screen flex flex-col border-r border-[#1F1F2B] bg-[#0D0D13] shrink-0">
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
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[#5B5CF6]/15 text-[#5B5CF6] border border-[#5B5CF6]/25"
                  : "text-[#9CA3AF] hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="px-3 pb-4 border-t border-[#1F1F2B] pt-3 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-[#5B5CF6]/20 flex items-center justify-center text-xs font-bold text-[#5B5CF6] shrink-0">
            {user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {user?.displayName ?? "Agency Owner"}
            </p>
            <p className="text-[10px] text-[#9CA3AF] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-all w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
