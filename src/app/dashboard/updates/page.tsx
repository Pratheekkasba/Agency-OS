"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getClients } from "@/lib/firebase/firestore";
import { Sparkles, ChevronDown, Check, Copy, Pencil } from "lucide-react";
import type { Client } from "@/types";
import { toast } from "sonner";

export default function UpdatesPage() {
  const { userData } = useAuth();

  // Clients
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Structured fields
  const [doneText, setDoneText] = useState("");
  const [inProgressText, setInProgressText] = useState("");
  const [nextText, setNextText] = useState("");

  // UI States
  const [generating, setGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch clients
  useEffect(() => {
    const fetch = async () => {
      if (!userData?.agencyId) return;
      try {
        const fetched = await getClients(userData.agencyId);
        setClients(fetched);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };
    fetch();
  }, [userData]);

  // Pre-select client from URL params
  useEffect(() => {
    if (clients.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const clientParam = params.get("client");
      if (clientParam && clients.some((c) => c.id === clientParam)) {
        setSelectedClientId(clientParam);
      }
    }
  }, [clients]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const parseLines = (text: string): string[] =>
    text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Auto-resize textarea
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  // Live preview tracking
  const hasContent = doneText.trim() || inProgressText.trim() || nextText.trim();
  
  const getLivePreview = () => {
    if (!hasContent) return "";
    
    let msg = `Hi ${selectedClient?.name || "Client"} team,\n\nHere's your weekly update:\n`;
    const doneLines = parseLines(doneText);
    if (doneLines.length > 0) {
      msg += `\n✅ Completed:\n` + doneLines.map((l) => `* ${l}`).join("\n");
    }
    const progLines = parseLines(inProgressText);
    if (progLines.length > 0) {
      msg += `\n\n⏳ In Progress:\n` + progLines.map((l) => `* ${l}`).join("\n");
    }
    const nextLines = parseLines(nextText);
    if (nextLines.length > 0) {
      msg += `\n\n🔜 Next:\n` + nextLines.map((l) => `* ${l}`).join("\n");
    }
    return msg;
  };

  const livePreviewText = getLivePreview();

  const handleGenerate = () => {
    if (!selectedClient || !hasContent) return;
    setGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setGenerating(false);
    }, 1500);
  };

  const handleClear = () => {
    setDoneText("");
    setInProgressText("");
    setNextText("");
  };

  const handleSend = () => {
    if (!livePreviewText) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success("Update sent successfully");
      handleClear();
    }, 1500);
  };

  const handleCopy = () => {
    if (!livePreviewText) return;
    navigator.clipboard.writeText(livePreviewText);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-headline tracking-tight">Create Client Update</h1>
          <p className="text-[#9CA3AF] mt-1.5 text-[15px]">Draft structured updates and send them directly to your clients.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* ═══ Left: Input Card (60%) ═══ */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl overflow-visible shadow-sm relative z-20">
            <div className="p-6 border-b border-[#1F1F2B] bg-[#0D0D13] rounded-t-2xl">
              <h2 className="text-lg font-bold text-white font-headline tracking-wide">Draft Update</h2>
            </div>
            <div className="p-6 space-y-7">
              {/* Custom Client Selector */}
              <div className="relative">
                <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2.5">Select Client</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full bg-[#0D0D13] border ${isDropdownOpen ? 'border-[#5B5CF6] ring-2 ring-[#5B5CF6]/20' : 'border-[#1F1F2B]'} rounded-xl px-4 py-3.5 text-left text-[15px] text-white focus:outline-none transition-all cursor-pointer flex items-center justify-between group shadow-sm`}
                  >
                    {selectedClient ? (
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A4A6FF] to-[#5F60FA] flex items-center justify-center shrink-0 shadow-inner">
                          <span className="text-[#1200A3] font-bold text-xs uppercase font-headline">
                            {selectedClient.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-semibold">{selectedClient.name}</span>
                      </div>
                    ) : (
                      <span className="text-[#6B7280]">Choose a client to send to...</span>
                    )}
                    <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? "rotate-180 text-[#5B5CF6]" : "text-[#6B7280] group-hover:text-white"}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#1A1A24] border border-[#2D2D3D] rounded-xl shadow-2xl z-50 overflow-hidden transform origin-top transition-all py-1.5">
                      <div className="max-h-60 overflow-y-auto px-1.5 py-1">
                        {clients.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setSelectedClientId(c.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left text-[15px] font-medium transition-colors mb-1 last:mb-0 ${selectedClientId === c.id ? 'bg-[#5B5CF6]/15 text-white' : 'text-[#9CA3AF] hover:bg-[#252533] hover:text-white'}`}
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${selectedClientId === c.id ? 'bg-gradient-to-br from-[#A4A6FF] to-[#5F60FA]' : 'bg-[#2D2D3D]'}`}>
                              <span className={`font-bold text-xs uppercase font-headline ${selectedClientId === c.id ? 'text-[#1200A3]' : 'text-[#6B7280]'}`}>
                                {c.name.charAt(0)}
                              </span>
                            </div>
                            {c.name}
                            {selectedClientId === c.id && <Check className="w-4 h-4 ml-auto text-[#5B5CF6]" />}
                          </button>
                        ))}
                        {clients.length === 0 && (
                          <div className="p-4 text-center text-sm text-[#6B7280]">
                            No clients available. Add one in the dashboard.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Done */}
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2.5">Done ✅</label>
                <textarea
                  value={doneText}
                  onChange={(e) => setDoneText(e.target.value)}
                  onInput={handleInput}
                  disabled={!selectedClientId}
                  placeholder="Finished homepage design"
                  className="w-full min-h-[96px] bg-[#0D0D13] border border-[#1F1F2B] rounded-xl p-4 text-[15px] text-white placeholder-[#4B5563] focus:outline-none focus:border-[#5B5CF6] focus:ring-2 focus:ring-[#5B5CF6]/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed shadow-sm block"
                />
              </div>

              {/* In Progress */}
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2.5">In Progress ⏳</label>
                <textarea
                  value={inProgressText}
                  onChange={(e) => setInProgressText(e.target.value)}
                  onInput={handleInput}
                  disabled={!selectedClientId}
                  placeholder="Working on backend API"
                  className="w-full min-h-[96px] bg-[#0D0D13] border border-[#1F1F2B] rounded-xl p-4 text-[15px] text-white placeholder-[#4B5563] focus:outline-none focus:border-[#5B5CF6] focus:ring-2 focus:ring-[#5B5CF6]/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed shadow-sm block"
                />
              </div>

              {/* Next */}
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2.5">Next 🔜</label>
                <textarea
                  value={nextText}
                  onChange={(e) => setNextText(e.target.value)}
                  onInput={handleInput}
                  disabled={!selectedClientId}
                  placeholder="Next: payment integration"
                  className="w-full min-h-[96px] bg-[#0D0D13] border border-[#1F1F2B] rounded-xl p-4 text-[15px] text-white placeholder-[#4B5563] focus:outline-none focus:border-[#5B5CF6] focus:ring-2 focus:ring-[#5B5CF6]/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed shadow-sm block"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {!selectedClientId && (
                  <p className="text-[13px] font-medium text-[#F59E0B] mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    Select a client to continue
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedClientId || !hasContent || generating}
                    className="flex-1 bg-[#5B5CF6] hover:bg-[#4F50DB] border border-[#5B5CF6] hover:border-[#4F50DB] text-white rounded-xl py-3.5 text-[15px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(91,92,246,0.15)] hover:shadow-[0_0_25px_rgba(91,92,246,0.25)] disabled:shadow-none relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    {generating ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin relative z-10" />
                        <span className="relative z-10">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Generate Update (AI)</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={!selectedClientId}
                    className="px-6 py-3.5 bg-[#1A1A24] hover:bg-[#252533] text-white rounded-xl text-[15px] font-semibold transition-all border border-[#2D2D3D] hover:border-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Right: Preview Panel (40%) ═══ */}
        <div className="lg:col-span-2 relative z-10">
          <div className="sticky top-8 space-y-6">
            <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[560px]">
              <div className="p-6 border-b border-[#1F1F2B] bg-[#0D0D13] flex items-center justify-between">
                <h2 className="text-lg font-bold text-white font-headline tracking-wide">Preview</h2>
              </div>

              <div className="p-6 flex-1 flex flex-col bg-[#09090B]">
                {hasContent ? (
                  <div className="bg-[#131317] border border-[#1F1F2B] rounded-2xl p-6 flex-1 shadow-2xl relative overflow-hidden flex flex-col">
                    {/* Generative Loading Overlay */}
                    <div className={`absolute inset-0 bg-[#09090B]/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center transition-all duration-300 ${generating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                       <div className="w-10 h-10 rounded-full border-[3px] border-[#5B5CF6]/20 border-t-[#5B5CF6] animate-spin mb-4" />
                       <div className="text-sm font-bold text-[#A4A6FF] uppercase tracking-wider animate-pulse">Formatting Update...</div>
                    </div>
                    
                    {/* Subtle Glow Background */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#5B5CF6]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
                    
                    {/* Message Header */}
                    <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-[#1F1F2B]/60 relative z-10">
                      <div className="w-11 h-11 rounded-full bg-[#0D0D13] border border-[#2D2D3D] flex items-center justify-center shrink-0 shadow-inner">
                        <Sparkles className="w-5 h-5 text-[#A4A6FF]" />
                      </div>
                      <div>
                        <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">
                          Update For
                        </h3>
                        <p className="text-[15px] font-bold text-white tracking-wide">{selectedClient?.name || "Client"}</p>
                      </div>
                    </div>

                    {/* Live Formatted Text */}
                    <div className="flex-1 relative z-10">
                      <div className="text-[#D1D5DB] text-[15px] whitespace-pre-wrap font-body leading-[1.8] max-w-none">
                        {livePreviewText}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#09090B] border-2 border-dashed border-[#1F1F2B] rounded-2xl p-6 flex-1 flex flex-col items-center justify-center text-center">
                     <div className="w-16 h-16 rounded-2xl bg-[#1A1A24] text-[#4B5563] flex items-center justify-center mb-5 border border-[#2D2D3D] shadow-sm rotate-[-4deg] transition-transform hover:rotate-0 hover:scale-105 duration-300">
                        <Pencil className="w-7 h-7" />
                     </div>
                    <p className="text-white font-bold text-[17px] mb-1.5 font-headline">Live Preview</p>
                    <p className="text-[#808080] text-[15px] max-w-[240px] leading-relaxed">Start typing on the left to instantly see your update generated here.</p>
                  </div>
                )}

                {/* Preview Actions */}
                <div className="mt-8 flex items-center gap-3 shrink-0">
                  <button 
                    onClick={handleSend}
                    disabled={!hasContent || isSending || generating} 
                    className="flex-1 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#1A1A24] disabled:text-[#6B7280] disabled:border border-[#2D2D3D] border-transparent text-white py-3.5 rounded-xl text-[15px] font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                       <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : "Send to Client"}
                  </button>
                  <div className="relative group/copy">
                    <button 
                      onClick={handleCopy}
                      disabled={!hasContent || generating} 
                      className="w-14 h-12 bg-[#1A1A24] hover:bg-[#252533] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all border border-[#2D2D3D] hover:border-[#4B5563] flex items-center justify-center"
                    >
                      {copied ? <Check className="w-5 h-5 text-[#10B981]" /> : <Copy className="w-5 h-5 text-[#9CA3AF]" />}
                    </button>
                    {/* Small Tooltip */}
                    <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none transition-all duration-200 z-50 ${copied ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'}`}>
                      Copied!
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
