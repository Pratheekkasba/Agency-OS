"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { validatePasswordPair } from "@/lib/auth/password";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [email, setEmail] = useState<string | null>(null);
  const [codeValid, setCodeValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setCodeValid(false);
      return;
    }

    let cancelled = false;
    verifyPasswordResetCode(auth, oobCode)
      .then((accountEmail) => {
        if (!cancelled) {
          setEmail(accountEmail);
          setCodeValid(true);
        }
      })
      .catch(() => {
        if (!cancelled) setCodeValid(false);
      });

    return () => {
      cancelled = true;
    };
  }, [oobCode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!oobCode || loading) return;

    const validation = validatePasswordPair(password, confirmPassword);
    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setDone(true);
      setTimeout(() => router.replace("/login"), 3000);
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code)
          : "";
      if (code === "auth/expired-action-code") {
        setError("This reset link has expired. Request a new one from the login page.");
      } else if (code === "auth/invalid-action-code") {
        setError("This reset link is invalid or was already used.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Could not reset password. Please request a new link.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (codeValid === null) {
    return (
      <AuthPageShell title="Reset password" subtitle="Verifying your reset link…">
        <div className="mt-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#5B5CF6] animate-spin" />
        </div>
      </AuthPageShell>
    );
  }

  if (!oobCode || codeValid === false) {
    return (
      <AuthPageShell
        title="Invalid or expired link"
        subtitle="Password reset links expire after a short time and can only be used once."
      >
        <div className="mt-10 space-y-4 text-center">
          <Link
            href="/forgot-password"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#5B5CF6] text-white font-medium hover:opacity-90"
          >
            Request new reset link
          </Link>
          <Link href="/login" className="block text-sm text-[#9CA3AF] hover:text-white">
            Back to login
          </Link>
        </div>
      </AuthPageShell>
    );
  }

  if (done) {
    return (
      <AuthPageShell
        title="Password updated"
        subtitle="Your password has been changed. Redirecting you to login…"
      >
        <div className="mt-10 flex flex-col items-center gap-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          <Link
            href="/login"
            className="inline-flex h-12 w-full max-w-sm items-center justify-center rounded-full bg-[#5B5CF6] text-white font-medium"
          >
            Sign in now
          </Link>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      title="Set new password"
      subtitle={
        email
          ? `Choose a new password for ${email}`
          : "Enter and confirm your new password"
      }
    >
      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-[#1F1F2B] bg-[#12121A] pl-6 focus-within:border-[#5B5CF6]/50 transition-colors">
          <Lock className="h-5 w-5 text-[#9CA3AF] shrink-0" />
          <input
            type="password"
            placeholder="New password"
            className="h-full w-full bg-transparent text-sm text-white placeholder:text-[#9CA3AF]/70 outline-none"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-[#1F1F2B] bg-[#12121A] pl-6 focus-within:border-[#5B5CF6]/50 transition-colors">
          <Lock className="h-5 w-5 text-[#9CA3AF] shrink-0" />
          <input
            type="password"
            placeholder="Confirm new password"
            className="h-full w-full bg-transparent text-sm text-white placeholder:text-[#9CA3AF]/70 outline-none"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <p className="text-xs text-[#6B7280] text-center">Minimum 6 characters</p>

        {error && (
          <div className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-full bg-[#5B5CF6] text-white font-medium hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(91,92,246,0.3)]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update password"}
        </button>
      </form>
    </AuthPageShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthPageShell title="Reset password" subtitle="Loading…">
          <div className="mt-16 flex justify-center">
            <Loader2 className="w-8 h-8 text-[#5B5CF6] animate-spin" />
          </div>
        </AuthPageShell>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
