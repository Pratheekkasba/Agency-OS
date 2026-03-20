import React from "react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Login1Props {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
  onSubmit?: (e: React.FormEvent) => void;
  onGoogleSubmit?: () => void;
  isLoading?: boolean;
  emailValue?: string;
  onEmailChange?: (v: string) => void;
  passwordValue?: string;
  onPasswordChange?: (v: string) => void;
  nameValue?: string;
  onNameChange?: (v: string) => void;
  showNameField?: boolean;
  error?: string | null;
}

const Login1 = ({
  heading,
  logo = {
    url: "/",
    src: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=200",
    alt: "logo",
    title: "Agency OS",
  },
  buttonText = "Login",
  googleText = "Sign up with Google",
  signupText = "Don't have an account?",
  signupUrl = "/signup",
  onSubmit,
  onGoogleSubmit,
  isLoading,
  emailValue = "",
  onEmailChange,
  passwordValue = "",
  onPasswordChange,
  nameValue = "",
  onNameChange,
  showNameField,
  error,
}: Login1Props) => {
  return (
    <div className="border border-[#1F1F2B] bg-[#12121A] flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md px-6 py-12 shadow-[0_0_40px_rgba(91,92,246,0.08)]">
      <div className="flex flex-col items-center gap-y-2">
        {/* Logo */}
        <div className="flex items-center gap-1 lg:justify-start">
          <a href={logo.url}>
            {logo.title ? (
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, rgba(255,255,255,1), rgba(161,161,170,1))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {logo.title}
              </div>
            ) : (
              <img
                src={logo.src}
                alt={logo.alt}
                title={logo.title}
                className="h-10 dark:invert"
              />
            )}
          </a>
        </div>
        {heading && <h1 className="text-3xl font-semibold text-white">{heading}</h1>}
      </div>
      
      <form className="flex w-full flex-col gap-8" onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          {showNameField && (
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Name"
                required
                value={nameValue}
                onChange={(e) => onNameChange?.(e.target.value)}
                className="bg-transparent text-white border-white/10"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="Email"
              required
              value={emailValue}
              onChange={(e) => onEmailChange?.(e.target.value)}
              className="bg-transparent text-white border-white/10"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              type="password"
              placeholder="Password"
              required
              minLength={6}
              value={passwordValue}
              onChange={(e) => onPasswordChange?.(e.target.value)}
              className="bg-transparent text-white border-white/10"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <div className="flex flex-col gap-4">
            <Button type="submit" className="mt-2 w-full bg-[#5B5CF6] hover:bg-[#6D6EF7] text-white" disabled={isLoading}>
              {isLoading ? "Please wait..." : buttonText}
            </Button>
          </div>
        </div>
      </form>

      <div className="text-muted-foreground flex justify-center gap-1 text-sm text-gray-400">
        <p>{signupText}</p>
        <a
          href={signupUrl}
          className="font-medium hover:underline text-[#5B5CF6]"
        >
          Sign up
        </a>
      </div>
    </div>
  );
};

export { Login1 };
