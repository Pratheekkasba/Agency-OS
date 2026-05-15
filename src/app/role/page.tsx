"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { setUserRole } from "@/lib/firebase/firestore";
import { sendWelcomeEmail } from "@/lib/email/notify";
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
      router.replace("/portal");
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
      // organization_id for an agency owner = their own UID (org is auto-created)
      const organization_id = uid;
      await setUserRole(uid, "owner", organization_id);

      // Stamp organization_id into the Firebase Auth JWT via Admin SDK
      // This is what makes Firestore Security Rules enforce org isolation
      const idToken = await auth.currentUser.getIdToken();
      await fetch("/api/auth/set-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, organization_id, role: "owner" }),
      });
      // Force-refresh the token so the new claim is active immediately
      await auth.currentUser.getIdToken(true);

      localStorage.setItem("agency-role", "owner");
      localStorage.setItem("agency-id", organization_id);

      await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: auth.currentUser.email }),
      }).catch((err) => console.error("Failed to send verification email:", err));

      if (!localStorage.getItem("agency_os_welcome_sent")) {
        const welcomed = await sendWelcomeEmail(
          auth.currentUser.displayName || undefined
        );
        if (welcomed) localStorage.setItem("agency_os_welcome_sent", "1");
      }

      router.push(
        auth.currentUser.emailVerified ? "/dashboard" : "/verify"
      );
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

    // Server-side lookup (client users cannot query Firestore before org claims exist)
    let clientData: {
      id: string;
      name: string;
      organization_id: string;
      accessId: string;
      status?: string;
    };
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/auth/verify-access-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, accessId: trimmedCode }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.found) {
        setError("Invalid Access ID. Please check and try again.");
        setSaving(false);
        return;
      }
      clientData = payload.client;
    } catch (err) {
      console.error("Error fetching client by Access ID:", err);
      setError("An error occurred verifying your access code.");
      setSaving(false);
      return;
    }

    try {
      const uid = auth.currentUser.uid;
      // organization_id for a client = the agency's organization_id (the org they belong to)
      const organization_id = clientData.organization_id;
      await setUserRole(uid, "client", organization_id, clientData.id);

      // Stamp organization_id into the Firebase Auth JWT via Admin SDK
      const idToken = await auth.currentUser.getIdToken();
      await fetch("/api/auth/set-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          organization_id,
          role: "client",
          client_id: clientData.id,
        }),
      });
      // Force-refresh so claim is immediately active
      await auth.currentUser.getIdToken(true);

      await fetch("/api/auth/complete-client-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: await auth.currentUser.getIdToken(), accessId: trimmedCode }),
      }).catch((err) => console.error("complete-client-access:", err));

      await auth.currentUser.reload();

      await sendWelcomeEmail(
        clientData.name || auth.currentUser.displayName || undefined
      ).catch((err) => console.error("welcome email:", err));

      localStorage.setItem("agency-role", "client");
      localStorage.setItem("agency-access-id", clientData.accessId || "");
      localStorage.setItem("client-data", JSON.stringify({ 
        id: clientData.id, 
        name: clientData.name, 
        status: clientData.status, 
        accessId: clientData.accessId 
      }));
      router.push("/portal");
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
    <div className="min-h-screen w-full bg-[#0B0B0F] text-white flex flex-col relative overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,100vw)] h-[min(800px,100vh)] bg-[#5B5CF6]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Centered content column (main + footer) */}
      <div className="relative z-10 flex flex-1 w-full flex-col items-center justify-center px-6 py-10">
        <main className="w-full max-w-3xl">
          <div className="relative min-h-[min(480px,65vh)] flex items-center justify-center overflow-hidden">
          {/* --- STEP 1: Choose Role --- */}
          <div
            className={`w-full flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              step === "choose"
                ? "relative opacity-100 translate-y-0 pointer-events-auto"
                : "absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none"
            }`}
          >
            {/* Header */}
            <div className="text-center mb-8 space-y-3">
              <div className="flex items-center justify-center mb-4">
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
                className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Choose your workspace
              </h1>
              <p className="text-[#9CA3AF] max-w-md mx-auto text-sm leading-relaxed">
                Select how you want to log in to get started with the right tools and experience.
              </p>
            </div>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              {/* Agency Card */}
              <button
                disabled={saving}
                onClick={handleAgencySelect}
                className={`group text-left w-full relative outline-none focus:ring-2 focus:ring-[#5B5CF6] rounded-2xl ${saving ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#5B5CF6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />
                <div className="relative bg-[#131317] border border-[#2D2D3D] rounded-2xl p-6 transition-all duration-300 hover:border-[#5B5CF6]/50 hover:bg-[#1A1A24] flex flex-col h-full hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(91,92,246,0.15)] overflow-hidden">
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5B5CF6]/10 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="mb-5 w-12 h-12 rounded-xl bg-[#5B5CF6]/10 border border-[#5B5CF6]/20 flex items-center justify-center group-hover:bg-[#5B5CF6] group-hover:border-[#5B5CF6] transition-all duration-300 shadow-inner">
                    <Building2 className="w-6 h-6 text-[#5B5CF6] group-hover:text-white transition-colors" />
                  </div>
                  
                  <h2
                    className="text-xl font-bold mb-2 text-white group-hover:text-[#A4A6FF] transition-colors tracking-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Agency / Organization
                  </h2>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed mb-5 flex-1 relative z-10">
                    Manage your clients, send project updates, and run your agency operations from one unified dashboard.
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-[#1F1F2B] pt-4 group-hover:border-[#2D2D3D] transition-colors relative z-10">
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
                <div className="relative bg-[#131317] border border-[#2D2D3D] rounded-2xl p-6 transition-all duration-300 hover:border-[#A4A6FF]/50 hover:bg-[#1A1A24] flex flex-col h-full hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(164,166,255,0.15)] overflow-hidden">
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A4A6FF]/10 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="mb-5 w-12 h-12 rounded-xl bg-[#A4A6FF]/10 border border-[#A4A6FF]/20 flex items-center justify-center group-hover:bg-[#A4A6FF] group-hover:border-[#A4A6FF] transition-all duration-300 shadow-inner">
                    <Users className="w-6 h-6 text-[#A4A6FF] group-hover:text-[#131317] transition-colors" />
                  </div>
                  
                  <h2
                    className="text-xl font-bold mb-2 text-white group-hover:text-[#A4A6FF] transition-colors tracking-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Client Portal
                  </h2>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed mb-5 flex-1 relative z-10">
                    Track your project progress, view updates from your agency, and approve deliverables --- all in one place.
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-[#1F1F2B] pt-4 group-hover:border-[#2D2D3D] transition-colors relative z-10">
                    <span className="text-sm font-bold text-[#6B7280] group-hover:text-white transition-colors">Select Workspace</span>
                    <div className="w-8 h-8 rounded-full bg-[#1A1A24] border border-[#2D2D3D] flex items-center justify-center group-hover:bg-[#A4A6FF] group-hover:border-[#A4A6FF] transition-all shadow-sm">
                      <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#131317] transition-colors" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
          {/* --- STEP 2: Enter Agency Code --- */}
          <div
            className={`w-full flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              step === "agency-code"
                ? "relative opacity-100 translate-y-0 pointer-events-auto"
                : "absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none"
            }`}
          >
            <div className="max-w-md w-full mx-auto">
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
                <Link href="/support" className="text-[#5B5CF6] hover:underline">Contact support</Link>
                {" "}to get one.
              </p>
            </div>
          </div>

        </div>
        </main>

        <footer className="w-full max-w-3xl mt-10 pt-6 border-t border-[#1F1F2B]/60">
          <div className="w-full flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between text-center">
          <div className="text-[#6B7280]/50 text-xs tracking-widest uppercase">
            © 2026 Agency OS
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/privacy" className="text-[#6B7280]/60 hover:text-white transition-colors text-xs uppercase tracking-wider">Privacy Policy</Link>
            <Link href="/terms" className="text-[#6B7280]/60 hover:text-white transition-colors text-xs uppercase tracking-wider">Terms of Service</Link>
            <Link href="/support" className="text-[#6B7280]/60 hover:text-white transition-colors text-xs uppercase tracking-wider">Support</Link>
          </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}

