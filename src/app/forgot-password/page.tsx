"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Forgot password?"
      subtitle={
        sent
          ? "Check your inbox for a link to reset your password. It may take a minute to arrive."
          : "Enter your account email and we'll send you a secure link to set a new password."
      }
    >
      {sent ? (
        <div className="mt-10 space-y-6 text-center">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
            If an account exists for <span className="font-medium text-white">{email}</span>, a
            reset link has been sent.
          </div>
          <Link
            href="/login"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#5B5CF6] text-white font-medium hover:opacity-90"
          >
            Return to login
          </Link>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setError(null);
            }}
            className="text-sm text-[#9CA3AF] hover:text-white transition-colors"
          >
            Try a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-[#1F1F2B] bg-[#12121A] pl-6 focus-within:border-[#5B5CF6]/50 transition-colors">
            <Mail className="h-5 w-5 text-[#9CA3AF] shrink-0" />
            <input
              type="email"
              placeholder="Email address"
              className="h-full w-full bg-transparent text-sm text-white placeholder:text-[#9CA3AF]/70 outline-none"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

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
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send reset link"}
          </button>
        </form>
      )}
    </AuthPageShell>
  );
}
