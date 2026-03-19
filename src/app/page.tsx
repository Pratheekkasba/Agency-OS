import { WaitlistHero } from "@/components/ui/waitlist-hero";
import { ArrowRight, Settings2, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090b] text-[#ffffff] font-sans selection:bg-blue-500/30">
      {/* PHASE 1: Hero Section */}
      <section className="relative w-full">
        <WaitlistHero />
      </section>

      {/* PHASE 2: What is the SaaS? */}
      <section className="w-full py-24 md:py-32 px-4 relative z-10 bg-[#09090b]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-[#ffffff]">
              The Ultimate Agency Infrastructure
            </h2>
            <p className="text-[#94a3b8] text-lg md:text-xl max-w-2xl mx-auto">
              Agency OS replaces scattered tools with a single, elegant platform designed specifically to scale your agency's operations and delight your clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#27272a]/20 border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#ffffff] mb-3">Lightning Fast Portal</h3>
              <p className="text-[#94a3b8] leading-relaxed">
                Give your clients a beautiful, frictionless read-only dashboard. They always know what's done, approved, and next without sending a single email.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#27272a]/20 border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#ffffff] mb-3">Shared AI Inbox</h3>
              <p className="text-[#94a3b8] leading-relaxed">
                Connect all your webhook arrays and external channels. Our built-in Gemini AI natively tags intents and drafts your responses instantly.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#27272a]/20 border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 text-amber-400">
                <Settings2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#ffffff] mb-3">Google Native Ecosystem</h3>
              <p className="text-[#94a3b8] leading-relaxed">
                Powered natively by Firebase Authentication and Firestore. Robust security rules and fully integrated Google Sign-In out of the box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 3: CTA Section */}
      <section className="w-full py-24 px-4 relative flex items-center justify-center">
        {/* Subtle gradient background for CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />

        <div className="max-w-4xl w-full mx-auto text-center relative z-10 p-12 md:p-16 rounded-[3rem] bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#ffffff] mb-6">
            Ready to scale your agency?
          </h2>
          <p className="text-lg text-[#94a3b8] mb-10 max-w-xl mx-auto">
            Join the waitlist today and get early access to the only operating system your agency will ever need.
          </p>
          <button
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0079da] text-white rounded-full font-semibold text-lg transition-transform active:scale-95 hover:brightness-110 mx-auto"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </main>
  );
}
