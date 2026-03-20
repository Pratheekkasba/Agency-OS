import { cn } from "@/lib/utils";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Globe } from "@/components/ui/globe";
import Link from "next/link";
export interface LoginFormProps {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  signupText?: string;
  signupUrl?: string;
  signupLinkText?: string;
  
  emailValue?: string;
  onEmailChange?: (v: string) => void;
  passwordValue?: string;
  onPasswordChange?: (v: string) => void;
  nameValue?: string;
  onNameChange?: (v: string) => void;
  showNameField?: boolean;
  
  onSubmit?: (e: React.FormEvent) => void;
  onGoogleSignIn?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function LoginForm({
  heading = "Sign in",
  subheading = "Welcome back! Please sign in to continue",
  buttonText = "Login",
  signupText = "Don't have an account?",
  signupLinkText = "Sign up",
  signupUrl = "/signup",
  emailValue = "",
  onEmailChange,
  passwordValue = "",
  onPasswordChange,
  nameValue = "",
  onNameChange,
  showNameField = false,
  onSubmit,
  onGoogleSignIn,
  isLoading = false,
  error = null,
}: LoginFormProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#0B0B0F]">
      {/* Left side: Globe */}
      <div className="hidden w-full md:block lg:w-1/2 relative bg-[#0B0B0F] overflow-hidden border-r border-[#1F1F2B]">
        <div className="h-full w-full flex items-center justify-center relative">
          <style>{`
            @keyframes globe-float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          `}</style>
          
          {/* Blur layer and glow behind the globe */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-[600px] w-[600px] bg-[radial-gradient(circle_at_center,rgba(91,92,246,0.25),transparent_60%)] blur-3xl opacity-30 rounded-full" />
          </div>

          <div 
            className="flex items-center justify-center relative z-10 w-full max-w-[600px] aspect-[1/1] scale-125 opacity-90 transition-transform duration-1000 ease-in-out"
            style={{ animation: 'globe-float 8s ease-in-out infinite' }}
          >
            <Globe className="relative !inset-auto top-auto" />
          </div>

          <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(91,92,246,0.15),rgba(255,255,255,0))]" />
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex w-full flex-col items-center justify-center lg:w-1/2 relative bg-[#0B0B0F]">
        {/* Go back to home */}
        <Link
          href="/"
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#9CA3AF] border border-[#1F1F2B] bg-[#12121A] hover:text-white hover:border-[#2A2A3A] transition-all duration-200 z-20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>
        {/* Subtle background glow logic carried over from Agency OS */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="h-[500px] w-[500px] rounded-full bg-[#5B5CF6]/[0.05] blur-[120px]" />
        </div>

        <form
          className="relative z-10 flex w-80 flex-col items-center justify-center md:w-96"
          onSubmit={onSubmit}
        >
          <h2 className="text-4xl font-medium text-white">{heading}</h2>
          <p className="mt-3 text-sm text-[#9CA3AF] text-center">{subheading}</p>

          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={isLoading}
            className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            <span className="text-white text-sm font-medium">Continue with Google</span>
          </button>

          <div className="my-6 flex w-full items-center gap-4">
            <div className="h-px w-full bg-white/10"></div>
            <p className="text-nowrap text-sm text-[#9CA3AF]">or continue with email</p>
            <div className="h-px w-full bg-white/10"></div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {showNameField && (
              <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-[#1F1F2B] bg-[#12121A] pl-6 focus-within:border-[#5B5CF6]/50 transition-colors">
                <User className="h-5 w-5 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="h-full w-full bg-transparent text-sm text-white placeholder:text-[#9CA3AF]/70 outline-none"
                  required
                  value={nameValue}
                  onChange={(e) => onNameChange?.(e.target.value)}
                />
              </div>
            )}

            <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-[#1F1F2B] bg-[#12121A] pl-6 focus-within:border-[#5B5CF6]/50 transition-colors">
              <Mail className="h-5 w-5 text-[#9CA3AF]" />
              <input
                type="email"
                placeholder="Email address"
                className="h-full w-full bg-transparent text-sm text-white placeholder:text-[#9CA3AF]/70 outline-none"
                required
                value={emailValue}
                onChange={(e) => onEmailChange?.(e.target.value)}
              />
            </div>

            <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-[#1F1F2B] bg-[#12121A] pl-6 focus-within:border-[#5B5CF6]/50 transition-colors">
              <Lock className="h-5 w-5 text-[#9CA3AF]" />
              <input
                type="password"
                placeholder="Password"
                className="h-full w-full bg-transparent text-sm text-white placeholder:text-[#9CA3AF]/70 outline-none"
                required
                minLength={6}
                value={passwordValue}
                onChange={(e) => onPasswordChange?.(e.target.value)}
              />
            </div>
          </div>

          {!showNameField && (
            <div className="mt-6 flex w-full items-center justify-between text-[#9CA3AF]">
              <div className="flex items-center gap-2">
                <input
                  className="h-4 w-4 rounded border-white/10 bg-transparent text-[#5B5CF6] focus:ring-[#5B5CF6] focus:ring-offset-[#12121A]"
                  type="checkbox"
                  id="remember"
                />
                <label className="text-sm cursor-pointer" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <a className="text-sm hover:text-white transition-colors" href="#">
                Forgot password?
              </a>
            </div>
          )}

          {error && (
            <div className="mt-4 w-full rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 border border-red-500/20 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 h-12 w-full rounded-full bg-[#5B5CF6] text-white transition-opacity hover:opacity-90 disabled:opacity-70 font-medium shadow-[0_0_20px_rgba(91,92,246,0.3)]"
          >
            {isLoading ? "Please wait..." : buttonText}
          </button>
          
          <p className="mt-6 text-sm text-[#9CA3AF]">
            {signupText}{" "}
            <a className="text-[#8B5CF6] hover:text-[#5B5CF6] transition-colors font-medium hover:underline" href={signupUrl}>
              {signupLinkText}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
