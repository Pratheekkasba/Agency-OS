"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ProjectOverview() {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{
        __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .step-line {
            position: absolute;
            left: 11px;
            top: 24px;
            bottom: -24px;
            width: 1px;
            background: rgba(45, 45, 53, 0.5); /* border color */
            z-index: 0;
        }
        .step-line-last {
            display: none;
        }
        `
      }} />

      <div className="bg-background text-foreground font-body min-h-screen selection:bg-primary/30 antialiased pb-20">
        
        {/* Navigation / Header matching portal */}
        <header className="flex items-center justify-between px-8 py-8 glass-dock backdrop-blur-xl bg-background/60 sticky top-0 z-50 border-b border-border/50">
          <Link href="/portal" className="flex flex-col gap-1 group">
            <h1 className="font-headline font-bold text-2xl tracking-tighter text-foreground group-hover:text-primary transition-colors">Client Portal</h1>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs font-label uppercase tracking-widest text-muted-foreground">
              <Link href="/portal/overview" className="text-primary hover:text-primary transition-colors cursor-pointer font-bold">Project Overview</Link>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <Link href="/portal/overview" className="hover:text-primary transition-colors cursor-pointer">Timeline</Link>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-border relative">
              <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden shrink-0">
                <img alt="User Profile" className="w-full h-full object-cover" src={user?.photoURL || "https://api.dicebear.com/9.x/glass/svg?seed=" + (user?.uid || "client")} />
              </div>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="material-symbols-outlined text-muted-foreground cursor-pointer hover:text-primary transition-colors focus:outline-none">
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

        <main className="max-w-5xl mx-auto pt-16 px-6 relative">
          
          {/* subtle glow */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Top Info */}
          <div className="mb-12 relative z-10">
            <Link href="/portal" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
              <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
            
            <p className="text-[10px] font-label uppercase tracking-[0.2em] text-primary font-bold mb-4">Portal • Acme Corp</p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground">Digital Ecosystem v2</h1>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-md w-fit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(91,92,246,0.8)]"></span>
                <span className="text-xs font-medium text-muted-foreground">In Progress</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-16">
              <div className="flex justify-between text-[10px] font-label uppercase tracking-[0.2em] text-muted-foreground mb-4">
                <span>Project Completion</span>
                <span className="text-primary font-bold text-lg">68%</span>
              </div>
              <div className="w-full h-1.5 bg-card/80 border border-border/50 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[68%] rounded-full shadow-[0_0_15px_rgba(91,92,246,0.8)]"></div>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-lg">
                <div className="flex items-center gap-3 mb-3 text-primary">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  <p className="text-[10px] font-label uppercase tracking-widest font-bold">Start Date</p>
                </div>
                <p className="font-headline text-xl font-semibold text-foreground">Oct 12, 2023</p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border shadow-lg">
                <div className="flex items-center gap-3 mb-3 text-primary">
                  <span className="material-symbols-outlined text-lg">bolt</span>
                  <p className="text-[10px] font-label uppercase tracking-widest font-bold">Velocity</p>
                </div>
                <p className="font-headline text-xl font-semibold text-foreground">High Focus</p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border shadow-lg">
                <div className="flex items-center gap-3 mb-3 text-primary">
                  <span className="material-symbols-outlined text-lg">account_tree</span>
                  <p className="text-[10px] font-label uppercase tracking-widest font-bold">Phase</p>
                </div>
                <p className="font-headline text-xl font-semibold text-foreground">Integration</p>
              </div>
            </div>

            {/* Split Content: Timeline & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Timeline Column */}
              <div className="lg:col-span-5">
                <h2 className="font-headline text-xl font-bold mb-10 text-foreground tracking-wide">Project Timeline</h2>
                
                <div className="relative flex flex-col gap-10">
                  
                  {/* Item 1 */}
                  <div className="relative flex gap-5 group">
                    <div className="step-line"></div>
                    <div className="relative z-10 w-6 h-6 rounded-full bg-primary text-background flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_12px_rgba(91,92,246,0.5)]">
                      <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'wght' 700"}}>check</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-base text-foreground mb-1">Homepage Design</h3>
                      <p className="text-sm text-muted-foreground">Completed • Oct 28</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="relative flex gap-5 group">
                    <div className="step-line"></div>
                    <div className="relative z-10 w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_12px_rgba(91,92,246,0.3)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-base text-foreground mb-1">Backend API</h3>
                      <p className="text-sm text-muted-foreground">In Progress • Active Development</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="relative flex gap-5 group">
                    <div className="step-line step-line-last"></div>
                    <div className="relative z-10 w-6 h-6 rounded-full bg-background border-2 border-border flex items-center justify-center shrink-0 mt-0.5">
                    </div>
                    <div>
                      <h3 className="font-medium text-base text-muted-foreground mb-1 group-hover:text-foreground transition-colors">Payment Integration</h3>
                      <p className="text-sm text-muted-foreground/60">Upcoming • Scheduled for Nov 15</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Status Column */}
              <div className="lg:col-span-7">
                <h2 className="font-headline text-xl font-bold mb-10 text-foreground tracking-wide">Development Status</h2>
                
                <div className="flex flex-col gap-10">
                  
                  {/* Done List */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                      <span className="text-[10px] font-label uppercase tracking-widest text-muted-foreground font-bold">Done</span>
                    </div>
                    <ul className="space-y-4 ml-3">
                      <li className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                        <span className="text-sm text-muted-foreground">Refined dark theme architecture with obsidian tonal layering.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                        <span className="text-sm text-muted-foreground">Optimization of SVG assets for high-performance rendering.</span>
                      </li>
                    </ul>
                  </div>

                  {/* In Progress List */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className="text-[10px] font-label uppercase tracking-widest text-primary font-bold">In Progress</span>
                    </div>
                    <ul className="space-y-4 ml-3">
                      <li className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-primary text-base mt-0.5">remove</span>
                        <span className="text-sm text-foreground font-medium">Implementing secure OAuth flow for client authentication.</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-primary text-base mt-0.5">remove</span>
                        <span className="text-sm text-foreground font-medium">Building the responsive bento-grid dashboard layout.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Next List */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
                      <span className="text-[10px] font-label uppercase tracking-widest text-muted-foreground/70 font-bold">Next</span>
                    </div>
                    <ul className="space-y-4 ml-3">
                      <li className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-muted-foreground/50 text-base mt-0.5">schedule</span>
                        <span className="text-sm text-muted-foreground/70">Automated deployment pipeline via Vercel integration.</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>
          </div>
          
          {/* Footer Card */}
          <div className="mt-20 p-8 rounded-2xl bg-card border border-border shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-low border border-border flex items-center justify-center opacity-80">
                <span className="material-symbols-outlined text-primary">verified</span>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Updated by Agency</p>
                <p className="text-sm font-semibold text-foreground">The Obsidian Architect Team</p>
              </div>
            </div>
            <div className="md:text-right">
              <p className="text-[10px] font-label uppercase tracking-widest text-muted-foreground mb-1">Last Updated Timestamp</p>
              <p className="text-sm text-muted-foreground">November 04, 2023 — 14:32 UTC</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[9px] font-label uppercase tracking-[0.2em] text-muted-foreground/50">
              Obsidian Client Portal • View Only Mode • Internal Access
            </p>
          </div>

        </main>
      </div>
    </>
  );
}
