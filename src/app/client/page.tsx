"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy route — client dashboard lives at /portal */
export default function ClientRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/portal");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#5B5CF6] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
