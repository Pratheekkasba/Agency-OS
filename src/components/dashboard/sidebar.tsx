"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Folder,
  CheckSquare,
  UsersRound,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  UserCircle,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { subscribeToConversations, subscribeToMessages } from "@/lib/firebase/firestore";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
};

const NAV_MAIN: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
];

const NAV_WORK: NavItem[] = [
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/projects", label: "Projects", icon: Folder },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
];

const NAV_INBOX: NavItem[] = [
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/updates", label: "Updates", icon: Bell },
];

const NAV_TEAM: NavItem[] = [
  { href: "/dashboard/team", label: "Team", icon: UsersRound },
];

function Bell(props: { className?: string }) {
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

function SidebarItem({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative overflow-hidden group",
        collapsed && "justify-center px-2",
        isActive
          ? "bg-[#5B5CF6]/10 text-white font-semibold"
          : "text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1A1A24]/60 font-medium"
      )}
    >
      {isActive && !collapsed && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#5B5CF6] rounded-r-md" />
      )}

      <Icon
        className={cn(
          "w-[18px] h-[18px] shrink-0 transition-colors duration-150",
          isActive ? "text-[#5B5CF6]" : "text-[#6B7280]"
        )}
      />

      {!collapsed && (
        <>
          <span className="flex-1 text-[14px] whitespace-nowrap tracking-wide truncate pr-2">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shrink-0 text-white shadow-sm ml-auto",
                item.badgeColor
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="h-2 shrink-0" aria-hidden />;
  return (
    <div className="px-3 mb-2 mt-4 first:mt-0">
      <p className="text-[11px] font-bold text-[#4B5563] uppercase tracking-[0.1em] opacity-80">
        {label}
      </p>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[#1A1A24]/50 mx-4 my-3 shrink-0" />;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData } = useAuth();
  const { collapsed, toggle } = useSidebar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [agencyName, setAgencyName] = useState("My Agency");
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [unreadTriageCount, setUnreadTriageCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

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
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let cancelled = false;

    async function loadAgencyName() {
      if (userData?.agencyName) {
        setAgencyName(userData.agencyName);
        return;
      }

      const orgId = userData?.organization_id;
      if (orgId) {
        try {
          const orgSnap = await getDoc(doc(db, "organizations", orgId));
          if (!cancelled && orgSnap.exists()) {
            const name = orgSnap.data()?.name as string | undefined;
            if (name?.trim()) {
              setAgencyName(name.trim());
              return;
            }
          }
        } catch {
          /* ignore */
        }
      }

      if (!cancelled) {
        setAgencyName(user?.displayName?.split(" ")[0] ? `${user.displayName.split(" ")[0]}'s Agency` : "My Agency");
      }
    }

    loadAgencyName();
    return () => {
      cancelled = true;
    };
  }, [userData?.agencyName, userData?.organization_id, user?.displayName]);

  // Real-time unread counts
  useEffect(() => {
    const orgId = userData?.organization_id;
    if (!orgId) return;

    // 1. Subscribe to chats for unreadAgency sum
    const unsubChats = subscribeToConversations(orgId, (convs) => {
      const sum = convs.reduce((acc, c) => acc + (c.unreadAgency || 0), 0);
      setUnreadChatCount(sum);
    });

    // 2. Subscribe to messages for pending count (triage)
    const unsubTriage = subscribeToMessages(orgId, (msgs) => {
      const pending = msgs.filter((m) => m.status === "pending").length;
      setUnreadTriageCount(pending);
    });

    return () => {
      unsubChats();
      unsubTriage();
    };
  }, [userData?.organization_id]);

  const displayName = user?.displayName || userData?.name || "Account";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const agencyInitials = agencyName.substring(0, 2).toUpperCase();

  return (
    <aside
      className={cn(
        "hidden md:grid h-dvh max-h-dvh shrink-0 grid-rows-[auto_minmax(0,1fr)_auto] border-r border-[#1A1A24] bg-[#0B0B0F] transition-[width] duration-200 ease-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div
        className={cn(
          "h-[72px] border-b border-[#1A1A24] flex items-center shrink-0 w-full min-w-0",
          collapsed ? "justify-center px-2" : "px-5"
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 min-w-0 hover:opacity-90 transition-opacity w-full",
            collapsed && "justify-center"
          )}
          title={collapsed ? agencyName : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A4A6FF] to-[#5B5CF6] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(91,92,246,0.2)]">
            <span className="text-[#1200A3] text-[11px] font-black uppercase tracking-tighter">
              {agencyInitials}
            </span>
          </div>
          {!collapsed && (
            <span className="text-[15px] font-bold text-white tracking-tight truncate font-headline flex-1 min-w-0">
              {agencyName}
            </span>
          )}
        </Link>
      </div>

      <nav className="sidebar-nav-scroll px-4 py-4 w-full min-w-0">
        <div className="space-y-1">
          {NAV_MAIN.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </div>

        <Divider />
        <SectionLabel label="Work" collapsed={collapsed} />
        <div className="space-y-1">
          {NAV_WORK.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
              collapsed={collapsed}
            />
          ))}
        </div>

        <Divider />
        <SectionLabel label="Inbox" collapsed={collapsed} />
        <div className="space-y-1">
          {NAV_INBOX.map((item) => {
            let badge = item.badge;
            if (item.label === "Messages") {
              badge = unreadChatCount + unreadTriageCount;
            }
            return (
              <SidebarItem
                key={item.href}
                item={{ 
                  ...item, 
                  badge,
                  badgeColor: item.label === "Messages" ? "bg-[#5B5CF6]" : item.badgeColor 
                }}
                isActive={pathname.startsWith(item.href)}
                collapsed={collapsed}
              />
            );
          })}
        </div>

        <Divider />
        <SectionLabel label="Team" collapsed={collapsed} />
        <div className="space-y-1">
          {NAV_TEAM.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
              collapsed={collapsed}
            />
          ))}
        </div>

        <Divider />
        <div className="space-y-1 pb-2">
          <SidebarItem
            item={{ href: "/dashboard/settings", label: "Settings", icon: Settings }}
            isActive={pathname.startsWith("/dashboard/settings")}
            collapsed={collapsed}
          />
        </div>
      </nav>

      <div className="border-t border-[#1A1A24] bg-[#0B0B0F] shrink-0 w-full min-w-0">
        <div
          className={cn(
            "flex items-center border-b border-[#1A1A24]/60",
            collapsed ? "justify-center p-2" : "justify-end px-3 py-2"
          )}
        >
          <button
            type="button"
            onClick={toggle}
            className="p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1A1A24] transition-colors shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className={cn("p-3", collapsed && "px-2")}>
          <div className="relative w-full min-w-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title={collapsed ? displayName : undefined}
              className={cn(
                "flex items-center w-full min-w-0 gap-3 rounded-xl transition-colors text-left",
                collapsed ? "justify-center p-2" : "px-3 py-2.5",
                isMenuOpen ? "bg-[#1A1A24]" : "hover:bg-[#1A1A24]/60"
              )}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2D2D3D] to-[#1F1F2B] flex items-center justify-center text-[#E5E7EB] text-[12px] font-bold shrink-0 shadow-inner border border-[#374151]">
                {initials}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0 text-left overflow-hidden">
                  <p className="text-[14px] font-bold text-white truncate leading-tight w-full">
                    {displayName}
                  </p>
                  <p className="text-[12px] text-[#9CA3AF] font-medium leading-none mt-1 truncate w-full">
                    {user?.email}
                  </p>
                </div>
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute bottom-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-[#131317] border border-[#2D2D3D] rounded-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50">
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
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[#D1D5DB] hover:text-white hover:bg-[#1A1A24] rounded-lg transition-colors text-left w-full"
                  >
                    <CreditCard className="w-4 h-4 text-[#9CA3AF]" />
                    Billing
                  </button>
                  <div className="h-px bg-[#1A1A24] my-1" />
                  <button
                    type="button"
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
      </div>
    </aside>
  );
}
