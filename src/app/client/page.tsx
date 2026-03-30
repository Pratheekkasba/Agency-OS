"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ClientDashboardPage() {
  const router = useRouter();
  const { userData, loading: authLoading } = useAuth();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic dummy auth check
    const role = localStorage.getItem("agency-role");
    const dataStr = localStorage.getItem("client-data");

    if (role !== "client" || !dataStr) {
      router.replace("/role");
      return;
    }

    try {
      const data = JSON.parse(dataStr);
      
      // Inject dummy update data if this is Velvet Digital for testing
      if (data.id === "OS-A92") {
        data.lastUpdate = {
          done: ["Finished homepage design", "Approved color palette"],
          progress: ["Working on backend API", "Setting up database schema"],
          next: ["Payment integration", "User authentication flow"],
          timestamp: "Just now"
        };
      } else if (data.id === "OS-X4F") {
        data.lastUpdate = {
          done: ["Initial consultation"],
          progress: ["Researching competitors"],
          next: ["Creating moodboard"],
          timestamp: "2 days ago"
        };
      }
      
      setClientData(data);
    } catch (e) {
      console.error("Failed to parse client data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("agency-role");
    localStorage.removeItem("agency-access-id");
    localStorage.removeItem("client-data");
    router.replace("/login");
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#5B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!clientData) return null;

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white relative overflow-hidden font-body">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5B5CF6]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="border-b border-[#1F1F2B] bg-[#0B0B0F]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="material-symbols-outlined text-black text-[18px]">grid_view</span>
            </div>
            <span className="font-bold font-headline tracking-tight">Agency<span className="text-[#5B5CF6]"> OS</span></span>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight mb-3">
              {clientData.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                clientData.status === 'Active' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                clientData.status === 'Paused' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                'bg-[#6B7280]/10 text-[#9CA3AF] border-[#6B7280]/20'
              }`}>
                {clientData.status}
              </span>
              <span className="text-sm text-[#6B7280] font-mono tracking-wider">ID: {clientData.accessId}</span>
            </div>
          </div>
        </div>

        {/* Latest Update Card */}
        <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 md:p-8 border-b border-[#1F1F2B] flex items-center justify-between bg-gradient-to-br from-[#1A1A24] to-[#131317]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5B5CF6]/10 border border-[#5B5CF6]/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#5B5CF6]" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-headline">Latest Update</h2>
                {clientData.lastUpdate && (
                  <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Posted {clientData.lastUpdate.timestamp}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {!clientData.lastUpdate ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#1A1A24] border border-[#2D2D3D] flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-[#6B7280]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No updates yet</h3>
                <p className="text-[#9CA3AF] text-sm max-w-xs">
                  Your agency hasn&apos;t shared an update yet. Check back later for progress reports.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Completed */}
                {clientData.lastUpdate.done && clientData.lastUpdate.done.length > 0 && (
                  <div>
                    <h3 className="text-[#10B981] text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </h3>
                    <ul className="space-y-3">
                      {clientData.lastUpdate.done.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-[#E5E7EB] text-base leading-relaxed">
                          <span className="text-[#10B981] mt-1 shrink-0">✅</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* In Progress */}
                {clientData.lastUpdate.progress && clientData.lastUpdate.progress.length > 0 && (
                  <div>
                    <h3 className="text-[#F59E0B] text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      In Progress
                    </h3>
                    <ul className="space-y-3">
                      {clientData.lastUpdate.progress.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-[#E5E7EB] text-base leading-relaxed">
                          <span className="text-[#F59E0B] mt-1 shrink-0">⏳</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next */}
                {clientData.lastUpdate.next && clientData.lastUpdate.next.length > 0 && (
                  <div>
                    <h3 className="text-[#5B5CF6] text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Next
                    </h3>
                    <ul className="space-y-3">
                      {clientData.lastUpdate.next.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-[#E5E7EB] text-base leading-relaxed">
                          <span className="text-[#5B5CF6] mt-1 shrink-0">🔜</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
