"use client";

import Link from "next/link";
import { Settings, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard"
          className="text-[#9CA3AF] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Settings
        </h1>
      </div>

      <div className="rounded-xl border border-[#1F1F2B] bg-[#12121A] p-6 mb-4">
        <h2 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Account
        </h2>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[#9CA3AF] text-xs mb-1">Name</p>
            <p className="text-white text-sm">{user?.displayName ?? "—"}</p>
          </div>
          <div>
            <p className="text-[#9CA3AF] text-xs mb-1">Email</p>
            <p className="text-white text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="w-full h-11 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all"
      >
        Sign out
      </button>
    </div>
  );
}
