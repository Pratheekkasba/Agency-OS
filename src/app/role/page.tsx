"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { setUserRole } from "@/lib/firebase/firestore";
import { ArrowLeft, ArrowRight, Building2, Users, KeyRound, Loader2, LayoutGrid } from "lucide-react";

type Step = "choose" | "agency-code";

export default function RoleSelectionPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [agencyCode, setAgencyCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already has a role, redirect immediately
  if (!loading && userData?.role) {
    if (userData.role === "client") {
      router.replace("/client");
    } else {
      router.replace("/dashboard");
    }
    return null;
  }

  // Not logged in
  if (!loading && !user) {
    router.replace("/login");
    return null;
  }

  const handleAgencySelect = async () => {
    if (!auth.currentUser || saving) return;
    setSaving(true);
    setError(null);

    try {
      const uid = auth.currentUser.uid;
      await setUserRole(uid, "agency", uid);
      localStorage.setItem("agency-role", "agency");
      localStorage.setItem("agency-id", uid);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error setting agency role:", err);
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  const handleClientSubmit = async () => {
    if (!auth.currentUser || saving) return;
    const trimmedCode = agencyCode.trim().toUpperCase();

    if (!trimmedCode) {
      setError("Please enter an Access ID.");
      return;
    }

    setSaving(true);
    setError(null);

    // DUMMY LOGIC validation
    const dummyClientAccessIds = ["OS-A92", "OS-X4F", "OS-L9P"];
    if (!dummyClientAccessIds.includes(trimmedCode)) {
      setError("Invalid Access ID. Please check and try again.");
      setSaving(false);
      return;
    }

    // Determine basic dummy data to save based on Access ID
    const dummyClientName = trimmedCode === "OS-A92" ? "Velvet Digital" : trimmedCode === "OS-X4F" ? "Nova Agency" : "Echo Labs";
    const dummyStatus = trimmedCode === "OS-L9P" ? "Paused" : "Active";
    const dummyClientData = { id: trimmedCode, name: dummyClientName, status: dummyStatus, accessId: trimmedCode };

    try {
      const uid = auth.currentUser.uid;
      await setUserRole(uid, "client", trimmedCode);
      localStorage.setItem("agency-role", "client");
      localStorage.setItem("agency-access-id", trimmedCode);
      localStorage.setItem("client-data", JSON.stringify(dummyClientData));
      router.push("/client");
    } catch (err) {
      console.error("Error setting client role:", err);
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#5B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0B0F] text-white flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5B5CF6]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main content — vertically + horizontally centered */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center">

          {/* ─── STEP 1: Choose Role ─── */}
          <div
            className={`transition-all duration-500 w-full flex flex-col items-center justify-center ease-[cubic-bezier(0.16,1,0.3,1)] ${
              step === "choose"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
            }`}
          >
            {/* Header */}
            <div className="text-center mb-14 space-y-4">
              <div className="flex items-center justify-center mb-8">
                <div className="inline-flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#5B5CF6] to-[#8183FF] shadow-[0_4px_15px_rgba(91,92,246,0.3)] border border-[#4F50DB]">
                    <LayoutGrid className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className="text-2xl font-bold tracking-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Agency<span className="text-[#5B5CF6]"> OS</span>
                  </span>
                </div>
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Choose your workspace
              </h1>
              <p className="text-[#9CA3AF] max-w-md mx-auto text-base leading-relaxed">
                Select how you want to log in to get started with the right tools and experience.
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
              {/* Agency Card */}
              <button
                disabled={saving}
                onClick={handleAgencySelect}
                className={`group text-left w-full relative outline-none focus:ring-2 focus:ring-[#5B5CF6] rounded-2xl ${saving ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#5B5CF6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />
                <div className="relative bg-[#131317] border border-[#2D2D3D] rounded-2xl p-8 transition-all duration-300 hover:border-[#5B5CF6]/50 hover:bg-[#1A1A24] flex flex-col h-full hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(91,92,246,0.15)] overflow-hidden">
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5B5CF6]/10 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="mb-8 w-14 h-14 rounded-xl bg-[#5B5CF6]/10 border border-[#5B5CF6]/20 flex items-center justify-center group-hover:bg-[#5B5CF6] group-hover:border-[#5B5CF6] transition-all duration-300 shadow-inner">
                    <Building2 className="w-6 h-6 text-[#5B5CF6] group-hover:text-white transition-colors" />
                  </div>
                  
                  <h2
                    className="text-2xl font-bold mb-3 text-white group-hover:text-[#A4A6FF] transition-colors tracking-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Agency / Organization
                  </h2>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed mb-8 flex-1 relative z-10">
                    Manage your clients, send project updates, and run your agency operations from one unified dashboard.
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-[#1F1F2B] pt-5 group-hover:border-[#2D2D3D] transition-colors relative z-10">
                    <span className="text-sm font-bold text-[#6B7280] group-hover:text-white transition-colors">Select Workspace</span>
                    <div className="w-8 h-8 rounded-full bg-[#1A1A24] border border-[#2D2D3D] flex items-center justify-center group-hover:bg-[#5B5CF6] group-hover:border-[#5B5CF6] transition-all shadow-sm">
                      <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </button>

              {/* Client Card */}
              <button
                disabled={saving}
                onClick={() => { setStep("agency-code"); setError(null); }}
                className={`group text-left w-full relative outline-none focus:ring-2 focus:ring-[#A4A6FF] rounded-2xl ${saving ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#A4A6FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />
                <div className="relative bg-[#131317] border border-[#2D2D3D] rounded-2xl p-8 transition-all duration-300 hover:border-[#A4A6FF]/50 hover:bg-[#1A1A24] flex flex-col h-full hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(164,166,255,0.15)] overflow-hidden">
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A4A6FF]/10 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="mb-8 w-14 h-14 rounded-xl bg-[#A4A6FF]/10 border border-[#A4A6FF]/20 flex items-center justify-center group-hover:bg-[#A4A6FF] group-hover:border-[#A4A6FF] transition-all duration-300 shadow-inner">
                    <Users className="w-6 h-6 text-[#A4A6FF] group-hover:text-[#131317] transition-colors" />
                  </div>
                  
                  <h2
                    className="text-2xl font-bold mb-3 text-white group-hover:text-[#A4A6FF] transition-colors tracking-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Client Portal
                  </h2>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed mb-8 flex-1 relative z-10">
                    Track your project progress, view updates from your agency, and approve deliverables — all in one place.
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-[#1F1F2B] pt-5 group-hover:border-[#2D2D3D] transition-colors relative z-10">
                    <span className="text-sm font-bold text-[#6B7280] group-hover:text-white transition-colors">Select Workspace</span>
                    <div className="w-8 h-8 rounded-full bg-[#1A1A24] border border-[#2D2D3D] flex items-center justify-center group-hover:bg-[#A4A6FF] group-hover:border-[#A4A6FF] transition-all shadow-sm">
                      <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#131317] transition-colors" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* ─── STEP 2: Enter Agency Code ─── */}
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              step === "agency-code"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
            }`}
          >
            <div className="max-w-md mx-auto">
              {/* Back button */}
              <button
                onClick={() => { setStep("choose"); setError(null); }}
                className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors mb-10 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to role selection
              </button>

              {/* Header */}
              <div className="mb-10 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-[#A4A6FF]/10 border border-[#A4A6FF]/20 flex items-center justify-center mb-6">
                  <KeyRound className="w-6 h-6 text-[#A4A6FF]" />
                </div>
                <h1
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Enter Access ID
                </h1>
                <p className="text-[#9CA3AF] text-base leading-relaxed">
                  Your agency provides a unique 6-character access ID to connect your account. Enter it below to access your project portal.
                </p>
              </div>

              {/* Input */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={agencyCode}
                    onChange={(e) => { setAgencyCode(e.target.value); setError(null); }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleClientSubmit(); }}
                    placeholder="e.g. OS-A92"
                    className="w-full bg-[#131317] border border-[#2D2D3D] rounded-xl px-5 py-4 text-white placeholder-[#6B7280] text-base focus:outline-none focus:border-[#5B5CF6] focus:ring-1 focus:ring-[#5B5CF6]/30 transition-all font-mono tracking-wider uppercase"
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-sm text-[#FF6B6B] flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                  </p>
                )}

                <button
                  onClick={handleClientSubmit}
                  disabled={saving || !agencyCode.trim()}
                  className="w-full bg-[#5B5CF6] hover:bg-[#4F50DB] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-4 px-6 text-base font-semibold transition-all duration-200 shadow-[0_2px_15px_rgba(91,92,246,0.3)] hover:shadow-[0_4px_20px_rgba(91,92,246,0.4)] flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Continue to Portal
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Help text */}
              <p className="text-[#6B7280] text-xs mt-6 text-center">
                Don&apos;t have an Access ID?{" "}
                <a href="#" className="text-[#5B5CF6] hover:underline">Contact your agency</a>
                {" "}to get one.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-[#6B7280]/50 text-xs tracking-widest uppercase">
          © 2024 Agency OS
        </div>
        <nav className="flex items-center gap-6">
          <a className="text-[#6B7280]/60 hover:text-white transition-colors text-xs uppercase tracking-wider" href="#">Privacy Policy</a>
          <a className="text-[#6B7280]/60 hover:text-white transition-colors text-xs uppercase tracking-wider" href="#">Terms of Service</a>
          <a className="text-[#6B7280]/60 hover:text-white transition-colors text-xs uppercase tracking-wider" href="#">Support</a>
        </nav>
      </footer>
    </div>
  );
}
