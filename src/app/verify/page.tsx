"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { sendEmailVerification } from "firebase/auth";
import { Mail, ArrowRight, RefreshCcw, Loader2 } from "lucide-react";
import { sendWelcomeEmail } from "@/lib/email/notify";
import { requiresEmailVerification } from "@/lib/auth/email-verification";

function getPostVerifyPath(role?: string) {
  if (!role) return "/role";
  if (role === "client") return "/portal";
  return "/dashboard";
}

export default function VerifyEmailPage() {
  const { user, userData, loading, userRefreshKey, refreshUser } = useAuth();
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const checkVerification = async () => {
      if (!loading && !user) {
        router.replace("/login");
      } else if (!loading && userData?.role === "client") {
        router.replace("/portal");
      } else if (!loading && user?.emailVerified) {
        if (userData?.role && userData.role !== "client") {
          sendWelcomeEmail(user.displayName || undefined).catch((err) =>
            console.error("welcome email auto-redirect:", err)
          );
        }
        router.replace(getPostVerifyPath(userData?.role));
      } else if (
        !loading &&
        userData?.role &&
        !requiresEmailVerification(userData.role)
      ) {
        router.replace(getPostVerifyPath(userData.role));
      }
    };
    checkVerification();
  }, [user, userData?.role, loading, userRefreshKey, router]);

  const handleResend = async () => {
    if (!auth.currentUser || resending) return;
    setResending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: auth.currentUser.email }),
      });
      if (!response.ok) throw new Error("Failed to send email");
      setMessage({ type: "success", text: "Verification email sent! Please check your inbox." });
    } catch (err: any) {
      if (err.code === "auth/too-many-requests") {
        setMessage({ type: "error", text: "Too many requests. Please wait a minute before trying again." });
      } else {
        setMessage({ type: "error", text: "Failed to send email. Please try again later." });
      }
    } finally {
      setResending(false);
    }
  };

  const handleReload = async () => {
    if (!auth.currentUser || reloading) return;
    setReloading(true);
    setMessage(null);
    try {
      const verified = await refreshUser();
      if (verified) {
        if (userData?.role && userData.role !== "client") {
          await sendWelcomeEmail(
            auth.currentUser?.displayName || undefined
          ).catch((err) => console.error("welcome email:", err));
        }
        router.replace(getPostVerifyPath(userData?.role));
      } else {
        setMessage({ type: "error", text: "Your email is still not verified. Please check your inbox and spam folder." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to refresh status. Please try again." });
    } finally {
      setReloading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#5B5CF6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0B0F] text-white flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5B5CF6]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#131317] border border-[#2D2D3D] rounded-2xl p-8 relative z-10 shadow-2xl">
        <div className="w-16 h-16 bg-[#5B5CF6]/10 border border-[#5B5CF6]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-[#5B5CF6]" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-3 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Verify your email
        </h1>
        
        <p className="text-[#9CA3AF] text-center mb-8 leading-relaxed">
          We&apos;ve sent a verification link to <span className="text-white font-medium">{user.email}</span>. 
          Please verify your email address to access your Agency workspace.
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleReload}
            disabled={reloading}
            className="w-full bg-[#5B5CF6] hover:bg-[#4F50DB] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3.5 px-4 font-medium transition-all shadow-[0_2px_15px_rgba(91,92,246,0.3)] flex items-center justify-center gap-2"
          >
            {reloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
            I&apos;ve verified my email
          </button>
          
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full bg-[#1A1A24] hover:bg-[#2D2D3D] border border-[#2D2D3D] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3.5 px-4 font-medium transition-all flex items-center justify-center gap-2"
          >
            {resending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            Resend Verification Email
          </button>
        </div>
      </div>
    </div>
  );
}
