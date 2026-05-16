"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { cn } from "@/lib/utils";

export function MobileNavDrawer() {
  const { mobileOpen, setMobileOpen } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  if (!mobileOpen) return null;

  return (
    <div role="dialog" aria-modal="true" className="md:hidden fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close navigation menu"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-[min(280px,88vw)] max-w-full shadow-2xl",
          "animate-in slide-in-from-left duration-200"
        )}
      >
        <div className="relative h-full min-w-0 max-w-full overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-3 z-10 p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1A1A24] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
          <DashboardSidebar variant="mobile" />
        </div>
      </div>
    </div>
  );
}
