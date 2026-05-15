"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import LoginForm from "@/components/ui/login-form";
import { toast } from "sonner";
import { Loader2, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function InviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, loading: authLoading, refreshSession } = useAuth();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing invitation token.");
    }
  }, [token]);

  const acceptInvite = async (idToken: string, displayName?: string) => {
    try {
      const res = await fetch("/api/auth/accept-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ token, name: displayName }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to accept invite");
      }

      toast.success("Invitation accepted successfully!");
      
      // CRITICAL: Force session refresh to pick up new claims without manual page reload
      await refreshSession();
      
      // Delay slightly so token refresh settles before route change
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: any) {
      setError(err.message || "Failed to accept invite. Please contact support.");
      setLoading(false);
    }
  };

  const handleAcceptAsCurrentUser = async () => {
    if (!user || !token) return;
    setLoading(true);
    setError(null);
    try {
      const idToken = await user.getIdToken(true);
      await acceptInvite(idToken, user.displayName || "");
    } catch (err: any) {
      setError(err.message || "Failed to accept invite.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || loading) return;
    if (mode === "signup" && !name) return;
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      let cred;
      if (mode === "signup") {
        try {
          cred = await createUserWithEmailAndPassword(auth, email, password);
          if (cred.user && name.trim()) {
            await updateProfile(cred.user, { displayName: name.trim() });
          }
        } catch (signupErr: any) {
          if (signupErr.code === "auth/email-already-in-use") {
            setMode("login");
            setError("This email is already registered. Please log in to accept the invitation.");
            setLoading(false);
            return;
          }
          throw signupErr;
        }
      } else {
        cred = await signInWithEmailAndPassword(auth, email, password);
      }

      const idToken = await cred.user.getIdToken(true);
      await acceptInvite(idToken, name.trim() || cred.user.displayName || "");
    } catch (err: any) {
      console.error("[Invite] Error:", err);
      setError(err.message || "Authentication failed.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!token || loading) return;
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      
      const idToken = await cred.user.getIdToken(true);
      await acceptInvite(idToken, cred.user.displayName || "Unknown");
    } catch (err: any) {
      setError("Google sign in failed. Please try again.");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D13]">
        <Loader2 className="w-8 h-8 text-[#5B5CF6] animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D13]">
        <div className="p-6 bg-[#131317] border border-[#1F1F2B] rounded-2xl max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-white mb-2">Invalid Invite</h2>
          <p className="text-[#6B7280]">This invitation link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, show a simpler screen
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D13] p-4 relative">
        <div className="max-w-md w-full bg-[#131317] border border-[#1F1F2B] rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5B5CF6]/40 to-transparent" />
          <div className="h-16 w-16 bg-[#5B5CF6]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-8 w-8 text-[#5B5CF6]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Accept Invitation</h2>
          <p className="text-[#9CA3AF] mb-6">
            You are currently logged in as <span className="text-white font-medium">{user.email}</span>. 
            Do you want to accept the invitation with this account?
          </p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleAcceptAsCurrentUser}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-[#5B5CF6] text-white hover:opacity-90 disabled:opacity-70 transition-opacity font-medium shadow-[0_0_20px_rgba(91,92,246,0.3)]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Accept Invitation"}
            </button>
            <button
              onClick={() => auth.signOut()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-[#1A1A24] border border-[#2A2A3A] text-white hover:bg-[#2A2A3A] disabled:opacity-70 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign out & use a different account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <LoginForm
        heading={mode === "signup" ? "Accept Invitation" : "Log In to Accept"}
        subheading={mode === "signup" ? "Create an account to join the team." : "Log in to join the team."}
        buttonText={mode === "signup" ? "Create Account & Join" : "Log In & Join"}
        footerContent={
          <p className="mt-6 text-sm text-[#9CA3AF]">
            {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="text-[#8B5CF6] hover:text-[#5B5CF6] transition-colors font-medium hover:underline"
            >
              {mode === "signup" ? "Log in" : "Sign up"}
            </button>
          </p>
        }
        showNameField={mode === "signup"}
        nameValue={name}
        onNameChange={setName}
        emailValue={email}
        onEmailChange={setEmail}
        passwordValue={password}
        onPasswordChange={setPassword}
        isLoading={loading}
        error={error}
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D13]">
        <Loader2 className="w-8 h-8 text-[#5B5CF6] animate-spin" />
      </div>
    }>
      <InviteContent />
    </Suspense>
  );
}
