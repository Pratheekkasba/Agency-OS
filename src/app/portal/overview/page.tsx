"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Overview merged into main portal — keep route for old links */
export default function PortalOverviewRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/portal");
  }, [router]);
  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
