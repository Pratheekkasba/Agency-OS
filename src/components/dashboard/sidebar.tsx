"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, Settings, LogOut,
  Folder, CheckSquare, UsersRound, MessageSquare, PenTool,
  ChevronDown, CreditCard, UserCircle
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: any;
  badge?: number;
  badgeColor?: string;
};

const NAV_MAIN: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
];

const NAV_WORK: NavItem[] = [
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/projects", label: "Projects", icon: Folder },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare, badge: 2, badgeColor: "bg-[#EF4444]" },
];

const NAV_INBOX: NavItem[] = [
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, badge: 3, badgeColor: "bg-[#5B5CF6]" },
  { href: "/dashboard/updates", label: "Updates", icon: Bell },
];

const NAV_TEAM: NavItem[] = [
  { href: "/dashboard/team", label: "Team", icon: UsersRound },
  { href: "/dashboard/whiteboard", label: "Whiteboard", icon: PenTool },
];

// Extracted Bell icon to avoid missing import
function Bell(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function SidebarItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 relative overflow-hidden group",
        isActive
          ? "bg-[#5B5CF6]/10 text-white font-semibold"
          : "text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1A1A24]/60 font-medium"
      )}
    >
      {/* Active Left Border Accent */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#5B5CF6] rounded-r-md" />
      )}

      <Icon className={cn(
        "w-[18px] h-[18px] shrink-0 transition-colors duration-150",
        isActive ? "text-[#5B5CF6]" : "text-[#6B7280]"
      )} />
      
      <span className="flex-1 text-[14px] whitespace-nowrap tracking-wide">{item.label}</span>

      {/* Badge Array (Right Aligned) */}
      {item.badge !== undefined && item.badge > 0 && (
        <span className={cn(
          "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shrink-0 text-white shadow-sm ml-auto",
          item.badgeColor
        )}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-3 mb-2 mt-4">
      <p className="text-[11px] font-bold text-[#4B5563] uppercase tracking-[0.1em] opacity-80">{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[#1A1A24]/50 mx-3 my-3" />;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  const displayName = user?.displayName || userData?.name || "Mani Pratheek";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const agencyName = userData?.agencyName || "AgencyOS";

  return (
    <aside className="hidden md:flex w-[260px] h-screen flex-col border-r border-[#1A1A24] bg-[#0B0B0F] shrink-0 sticky top-0">
      
      {/* Top Section: Identity Area */}
      <div className="h-[72px] shrink-0 border-b border-[#1A1A24] flex items-center justify-between px-5">
        <div className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A4A6FF] to-[#5B5CF6] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(91,92,246,0.2)]">
            <span className="text-[#1200A3] text-[11px] font-black uppercase tracking-tighter">
              {agencyName.substring(0, 2)}
            </span>
          </div>
          <div className="flex items-center justify-between flex-1 min-w-0">
            <span className="text-[15px] font-bold text-white tracking-tight truncate font-headline pb-0.5">
              {agencyName}
            </span>
            <ChevronDown className="w-4 h-4 text-[#6B7280] shrink-0" />
          </div>
        </div>
      </div>

      {/* Main Navigation (Non-scrollable) */}
      <nav className="flex-1 px-3 py-4 flex flex-col overflow-hidden">
        
        {/* Overview */}
        <div className="space-y-1.5">
          {NAV_MAIN.map(item => (
            <SidebarItem key={item.href} item={item} isActive={pathname === item.href} />
          ))}
        </div>

        <Divider />

        {/* WORK */}
        <SectionLabel label="Work" />
        <div className="space-y-1.5">
          {NAV_WORK.map(item => (
            <SidebarItem key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
          ))}
        </div>

        <Divider />

        {/* INBOX */}
        <SectionLabel label="Inbox" />
        <div className="space-y-1.5">
          {NAV_INBOX.map(item => (
            <SidebarItem key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
          ))}
        </div>

        <Divider />

        {/* TEAM */}
        <SectionLabel label="Team" />
        <div className="space-y-1.5">
          {NAV_TEAM.map(item => (
            <SidebarItem key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
          ))}
        </div>
      </nav>

      {/* Bottom Section (Fixed) */}
      <div className="p-4 border-t border-[#1A1A24] space-y-4 shrink-0 bg-[#0B0B0F]">
        
        {/* Settings */}
        <SidebarItem 
          item={{ href: "/dashboard/settings", label: "Settings", icon: Settings }} 
          isActive={pathname.startsWith("/dashboard/settings")} 
        />
        
        {/* User Profile Block */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-colors text-left",
              isMenuOpen ? "bg-[#1A1A24]" : "hover:bg-[#1A1A24]/60"
            )}
           >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2D2D3D] to-[#1F1F2B] flex items-center justify-center text-[#E5E7EB] text-[12px] font-bold shrink-0 shadow-inner border border-[#374151]">
              {initials}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-white truncate leading-tight">{displayName}</p>
              <p className="text-[12px] text-[#9CA3AF] font-medium leading-none mt-1">Agency Pro</p>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-[#131317] border border-[#2D2D3D] rounded-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="p-1.5 flex flex-col gap-0.5">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[#D1D5DB] hover:text-white hover:bg-[#1A1A24] rounded-lg transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-[#9CA3AF]" />
                  Profile
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[#D1D5DB] hover:text-white hover:bg-[#1A1A24] rounded-lg transition-colors text-left w-full"
                >
                  <CreditCard className="w-4 h-4 text-[#9CA3AF]" />
                  Billing
                </button>
                <div className="h-px bg-[#1A1A24] my-1" />
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors text-left w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
}
