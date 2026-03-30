"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { setUserRole } from "@/lib/firebase/firestore";

export function RoleSelectionModal() {
  const { userData, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Still loading auth details, or user already has a role
  if (loading || (userData && userData.role)) return null;

  const selectRole = async (role: "agency" | "client") => {
    if (!auth.currentUser) return;
    setSaving(true);

    try {
      const uid = auth.currentUser.uid;
      const agencyId = role === "agency" ? uid : null;

      await setUserRole(uid, role, agencyId);

      // localStorage backup for UI speed
      localStorage.setItem("agency-role", role);
      if (role === "agency") localStorage.setItem("agency-id", uid);

      if (role === "client") {
        router.push("/portal");
      }
    } catch (error) {
      console.error("Error setting role:", error);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0F]/90 backdrop-blur-md">
      <div className="max-w-4xl w-full px-6 slide-in-bottom">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center mb-6">
            <span className="text-sm font-semibold tracking-widest text-[#5B5CF6] uppercase flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#5B5CF6]"></span> Secure Gateway
            </span>
          </div>
          <h1 className="text-5xl font-bold font-headline tracking-tight text-white">
            Continue as
          </h1>
          <p className="text-[#9CA3AF] max-w-md mx-auto text-base">
            Select your workspace identity to access the obsidian architect dashboard and manage your agency operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto">
          {/* Agency Owner Card */}
          <div 
            className={`group relative ${saving ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => selectRole("agency")}
          >
            <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl p-8 transition-all duration-300 hover:border-[#5B5CF6]/50 hover:bg-[#1A1A24] cursor-pointer flex flex-col h-full hover:-translate-y-1">
              <div className="mb-8 w-12 h-12 rounded-xl bg-[#1A1A24] border border-[#2D2D3D] flex items-center justify-center group-hover:border-[#5B5CF6]/30 transition-colors">
                <span className="material-symbols-outlined text-[#5B5CF6] text-2xl">architecture</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold font-headline mb-3 text-white group-hover:text-[#5B5CF6] transition-colors">Agency Owner</h2>
                <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
                  Access full suite of management tools, financial reporting, and architectural workspace controls for your entire team.
                </p>
              </div>
            </div>
          </div>

          {/* Client Card */}
          <div 
            className={`group relative ${saving ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => selectRole("client")}
          >
            <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl p-8 transition-all duration-300 hover:border-[#5B5CF6]/50 hover:bg-[#1A1A24] cursor-pointer flex flex-col h-full hover:-translate-y-1">
              <div className="mb-8 w-12 h-12 rounded-xl bg-[#1A1A24] border border-[#2D2D3D] flex items-center justify-center group-hover:border-[#5B5CF6]/30 transition-colors">
                <span className="material-symbols-outlined text-[#A4A6FF] text-2xl">hub</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold font-headline mb-3 text-white group-hover:text-[#A4A6FF] transition-colors">Client</h2>
                <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
                  Review project progress, approve deliverables, and communicate directly with your dedicated account management team.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center pb-8 border-b border-[#1F1F2B] w-64 mx-auto"></div>
        <div className="flex justify-center gap-6 mt-8">
            <span className="text-xs font-semibold tracking-wider text-[#6B7280] uppercase">Privacy Policy</span>
            <span className="text-xs font-semibold tracking-wider text-[#6B7280] uppercase">Terms of Service</span>
            <span className="text-xs font-semibold tracking-wider text-[#6B7280] uppercase">Need Help?</span>
        </div>
        <div className="flex justify-center mt-12">
            <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-black text-sm">grid_view</span>
                 </div>
                 <span className="text-white font-bold font-headline tracking-tight text-lg">Agency OS</span>
            </div>
        </div>
      </div>
    </div>
  );
}
