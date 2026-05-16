"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendWelcomeEmail } from "@/lib/email/notify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const SESSION_KEY = "agency_os_welcome_banner_dismissed";

export function WelcomeBanner() {
  const { user, userData } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user || !userData?.role || userData.role === "client") return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    if (userData.welcomeShownInApp === true) return;

    setVisible(true);

    sendWelcomeEmail(user.displayName || userData.name || undefined).catch(() => {});
  }, [user, userData?.role, userData?.welcomeShownInApp, userData?.name, user?.displayName]);

  const dismiss = async () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
    if (user?.uid) {
      try {
        await updateDoc(doc(db, "users", user.uid), { welcomeShownInApp: true });
      } catch {
        /* non-blocking */
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="mx-4 mt-4 md:mx-6 md:mt-4 shrink-0 rounded-xl border border-[#5B5CF6]/30 bg-gradient-to-r from-[#5B5CF6]/15 to-[#131317] p-4 flex gap-3 items-start relative z-30">
      <div className="w-10 h-10 rounded-xl bg-[#5B5CF6]/20 flex items-center justify-center shrink-0">
        <Sparkles className="w-5 h-5 text-[#A4A6FF]" />
      </div>
      <div className="flex-1 min-w-0 pr-6">
        <p className="text-sm font-bold text-white">Welcome to Agency OS</p>
        <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
          Your workspace is ready. Add a client, share their Access ID, and publish your first update from{" "}
          <span className="text-[#C4B5FD]">Updates</span>. We also sent a welcome email to {user?.email}.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-3 right-3 p-1 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1A1A24] transition-colors"
        aria-label="Dismiss welcome"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
