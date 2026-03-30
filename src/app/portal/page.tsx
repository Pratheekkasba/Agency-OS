"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ClientPortal() {
  const { user, userData, loading, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (userData?.role !== "client") {
        router.replace("/dashboard");
      }
    }
  }, [user, userData, loading, router]);

  if (loading || (user && userData?.role !== "client")) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div suppressHydrationWarning className="w-6 h-6 border-2 border-[#a4a6ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <div className="bg-[#0B0B0F] text-[#fcf8fe] font-body min-h-screen selection:bg-primary/30 antialiased relative">
        <style dangerouslySetInnerHTML={{
          __html: `
          .glass-dock {
              background: rgba(37, 37, 43, 0.6);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
          }
          .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
              font-size: 1.25rem;
          }
          `
        }} />

        <header className="flex items-center justify-between px-8 py-8 fixed top-0 left-0 right-0 z-50 glass-dock">
          <Link href="/portal" className="flex flex-col gap-1 group">
            <h1 className="font-headline font-bold text-2xl tracking-tighter text-on-surface group-hover:text-primary transition-colors">Client Portal</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">Updated by Agency</span>
              <span className="text-xs text-on-surface-variant font-medium">Last updated: Oct 24, 14:02 EST</span>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs font-label uppercase tracking-widest text-on-surface-variant">
              <Link href="/portal/overview" className="hover:text-primary transition-colors cursor-pointer">Project Overview</Link>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <Link href="/portal/overview" className="hover:text-primary transition-colors cursor-pointer">Timeline</Link>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/20 relative">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden shrink-0">
                <img alt="User Profile" className="w-full h-full object-cover" src={user?.photoURL || "https://api.dicebear.com/9.x/glass/svg?seed=" + (user?.uid || "client")} />
              </div>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors focus:outline-none">
                settings
              </button>
              
              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute top-12 right-0 w-48 bg-card border border-border rounded-xl shadow-2xl py-2 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-border/50 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">{user?.displayName || "Client User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-surface-container-high transition-colors text-left w-full cursor-not-allowed opacity-50" disabled>
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Profile
                  </button>
                  <button onClick={async () => {
                    await signOut();
                    router.replace("/login");
                  }} className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left w-full mt-1 border-t border-border/50">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="mb-16 relative">
            {/* Subtle glow behind the card */}
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-3xl"></div>
            <div className="p-10 md:p-14 rounded-2xl bg-card border border-border relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/15 blur-3xl rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                  </span>
                  <p className="font-label text-success uppercase tracking-[0.2em] text-xs font-bold">Current Status</p>
                </div>
                
                <h2 className="font-headline text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl leading-[1.15] text-foreground">
                  The branding sprint is <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-300 drop-shadow-md">90% complete.</span>
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
                  We are currently finalizing the style guide and preparing the asset delivery package. All core milestones for Phase 1 have been met.
                </p>
              </div>
            </div>
          </section>

          {/* Main Content: Bento Progress Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Done Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 px-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <h3 className="font-headline text-xl font-semibold tracking-tight">Done ✅</h3>
              </div>
              <div className="p-8 rounded-xl bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-colors duration-300 min-h-[400px]">
                <ul className="space-y-8">
                  <li className="group">
                    <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">Milestone 01</span>
                    <p className="text-on-surface font-medium mb-1">Brand Identity Discovery</p>
                    <p className="text-sm text-on-surface-variant/80">Workshop completed and core values defined.</p>
                  </li>
                  <li className="group">
                    <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">Milestone 02</span>
                    <p className="text-on-surface font-medium mb-1">Logo Concept Approval</p>
                    <p className="text-sm text-on-surface-variant/80">Primary and secondary marks signed off by stakeholders.</p>
                  </li>
                  <li className="group">
                    <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">Milestone 03</span>
                    <p className="text-on-surface font-medium mb-1">Color Palette Calibration</p>
                    <p className="text-sm text-on-surface-variant/80">Accessible Obsidian and Electric Purple shades finalized.</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* In Progress Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 px-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
                <h3 className="font-headline text-xl font-semibold tracking-tight">In Progress ⏳</h3>
              </div>
              <div className="p-8 rounded-xl bg-surface-container-high border border-primary/20 shadow-2xl shadow-primary/5 min-h-[400px]">
                <ul className="space-y-8">
                  <li className="relative pl-6 border-l-2 border-primary/30">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="block text-[10px] font-label uppercase tracking-widest text-primary mb-2">Active Task</span>
                    <p className="text-on-surface font-medium mb-1">Documentation &amp; Style Guide</p>
                    <p className="text-sm text-on-surface-variant/80">Building the comprehensive usage guidelines in Notion.</p>
                  </li>
                  <li className="pl-6 border-l-2 border-outline-variant/20">
                    <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">Next Priority</span>
                    <p className="text-on-surface font-medium mb-1">Web UI Kit Expansion</p>
                    <p className="text-sm text-on-surface-variant/80">Applying branding elements to 12 core interface components.</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Next Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 px-2">
                <span className="material-symbols-outlined text-on-surface-variant">arrow_forward</span>
                <h3 className="font-headline text-xl font-semibold tracking-tight">Next 🔜</h3>
              </div>
              <div className="p-8 rounded-xl bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-colors duration-300 min-h-[400px]">
                <ul className="space-y-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                  <li>
                    <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">Phase 02</span>
                    <p className="text-on-surface font-medium mb-1">Social Media Templates</p>
                    <p className="text-sm text-on-surface-variant/80">Instagram, LinkedIn, and Twitter asset frameworks.</p>
                  </li>
                  <li>
                    <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">Phase 02</span>
                    <p className="text-on-surface font-medium mb-1">Pitch Deck Overhaul</p>
                    <p className="text-sm text-on-surface-variant/80">Redesigning the internal 24-slide investor presentation.</p>
                  </li>
                  <li>
                    <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">Closure</span>
                    <p className="text-on-surface font-medium mb-1">Final Handover</p>
                    <p className="text-sm text-on-surface-variant/80">Project wrap-up meeting and source file delivery.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Support / Contact Footer Area (Read Only) */}
          <footer className="mt-24 pt-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">chat_bubble</span>
              </div>
              <div>
                <p className="font-headline font-bold text-lg">Have a question?</p>
                <p className="text-sm text-on-surface-variant">Reach out via your dedicated Slack channel.</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex -space-x-3 mb-2">
                <img alt="Team member" className="w-8 h-8 rounded-full border-2 border-background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfdIiMjavXkAQtFV6p9aUbpzgS2L_hCaW95OTob6c2efWCtURsYUtbKCFuEJz_Diq_RCivF8Ux2X5-bdydQ0PL89kal04W4no0M0eoB8c42RVluh9kgyBjrVpjfA7-NBpFICZNkknVnUhb3O0vdN0_W-fuGG32jHpHRt4wPr05RlYGaihyIRnfCp1BfhApVQ1XLSbAgd86ZKzoMC7Mt1UubB0vXLyZQQ74UZ6MU213AOLRmtAhkfdyiM6o2ryGkKm-R-6TgVRlKZvi" />
                <img alt="Team member" className="w-8 h-8 rounded-full border-2 border-background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmPYqVrDlZnsiJ4g9OKr0mjpOgef5z0rQxMpno-RIoqlAv6lALxGSsTjvCu6D1lU0Fb7V_RP5J8nWfofXs6jLtrKdh-c24EWmf0wU8zucZjJWGPBHKNG4Er0-SVJijFAI3-825V21ohq8y5gSY_j8lnWrnqt5S8LEzuhQZne2eIigCGDv8xpUCkQj3PFcONcPyumalCSEyKYQ_EQ6GoKhmhmPCpQAjpqCbik5_hsdc34_HSTFZRaevxTCDiZ4JJ4jxQi91nwRnkvmk" />
                <div className="w-8 h-8 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">+3</div>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Your Agency OS Team</p>
            </div>
          </footer>
        </main>

        {/* Floating Interaction Hint */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-dock px-6 py-3 rounded-full flex items-center gap-3 border border-outline-variant/10 shadow-2xl z-50">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
          <span className="text-xs font-label uppercase tracking-widest font-medium">System Online &amp; Synchronized</span>
        </div>
      </div>
    </>
  );
}
