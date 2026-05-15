"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mail, Send, Archive, UserPlus, Sparkles, X,
  ChevronRight, CheckCircle, AlertCircle, HelpCircle,
  FileEdit, Star, MessageSquare, Search, Filter,
  Clock, ExternalLink, Loader2, Check, RefreshCw,
  Globe, MessageCircle, Instagram, Inbox
} from "lucide-react";
import { toast } from "sonner";
import type { Message, MessageIntent, MessageChannel } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getAllMessages, updateMessage } from "@/lib/firebase/firestore";

// --- Config ---
const INTENT_CONFIG: Record<MessageIntent, { label: string; icon: any; color: string; bg: string }> = {
  question: { label: "Question", icon: HelpCircle, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  approval: { label: "Approval", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  revision: { label: "Revision", icon: FileEdit, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  brief: { label: "New Brief", icon: Star, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
  complaint: { label: "Complaint", icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  general: { label: "General", icon: MessageSquare, color: "text-[#9CA3AF]", bg: "bg-[#374151]/20 border-[#374151]/30" },
};

const CHANNEL_CONFIG: Record<MessageChannel, { icon: any; label: string; color: string }> = {
  email: { icon: Mail, label: "Email", color: "text-blue-400" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp", color: "text-emerald-400" },
  instagram: { icon: Instagram, label: "Instagram", color: "text-pink-400" },
  portal: { icon: Globe, label: "Client Portal", color: "text-[#5B5CF6]" },
  internal: { icon: MessageSquare, label: "Internal", color: "text-[#9CA3AF]" },
};

const STATUS_COLORS: Record<string, string> = {
  new: "text-red-400 bg-red-400/10 border-red-400/20",
  pending_approval: "text-[#5B5CF6] bg-[#5B5CF6]/10 border-[#5B5CF6]/20",
  assigned: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  draft_ready: "text-[#5B5CF6] bg-[#5B5CF6]/10 border-[#5B5CF6]/20",
  sent: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  resolved: "text-[#6B7280] bg-[#374151]/20 border-[#374151]/30",
  archived: "text-[#6B7280] bg-[#1F1F2B] border-[#2D2D3D]",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Unread", pending_approval: "Pending Approval", assigned: "Assigned", draft_ready: "Draft Ready",
  sent: "Replied", resolved: "Resolved", archived: "Archived",
};

// --- Helpers ---
function timeAgo(millis: number) {
  const diff = Date.now() - millis;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (h < 1) return `${m}m ago`;
  if (d < 1) return `${h}h ago`;
  return `${d}d ago`;
}

// --- Main Page ---
export default function MessagesPage() {
  const { userData } = useAuth();
  const orgId = userData?.organization_id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [draftText, setDraftText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [replySent, setReplySent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    if (!orgId) return;
    setIsLoading(true);
    try {
      const data = await getAllMessages(orgId);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [orgId]);

  useEffect(() => {
    // Always reset composer when switching threads
    setDraftText(selected?.aiDraft || "");
    setReplySent(false);
  }, [selected]);

  const filtered = messages.filter(m =>
    (statusFilter === "all" || m.status === statusFilter) &&
    (!search || m.clientName?.toLowerCase().includes(search.toLowerCase()) || m.body.toLowerCase().includes(search.toLowerCase()) || m.fromName.toLowerCase().includes(search.toLowerCase()))
  );

  const unread = messages.filter(m => m.status === "new").length;

  const handleGenerateDraft = async () => {
    // This is now handled automatically by the webhook.
    // If you want to regenerate, you could call a separate endpoint here.
    if (!selected?.aiDraft) return;
    setDraftText(selected.aiDraft);
    toast.success("Draft loaded into composer!");
  };

  const handleSend = async () => {
    if (!draftText.trim() || !selected) return;
    
    setIsGenerating(true); // Re-using this state for loading
    try {
      const res = await fetch("/api/messages/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: selected.id,
          draftText,
          clientEmail: selected.fromContact,
          subject: `Re: ${selected.subject || "Your Message"}`
        })
      });

      if (!res.ok) throw new Error("Failed to send");

      setMessages(prev => prev.map(m =>
        m.id === selected.id ? { ...m, status: "sent", aiDraft: draftText } : m
      ));
      setReplySent(true);
      toast.success("Reply approved and sent!");
    } catch (err) {
      toast.error("Failed to send reply");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResolve = async (msgId: string) => {
    try {
      await updateMessage(msgId, { status: "resolved" });
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: "resolved" } : m));
      if (selected?.id === msgId) setSelected(null);
      toast.success("Marked as resolved");
    } catch (err) {
      toast.error("Failed to resolve message");
    }
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 lg:px-8 pt-6 pb-4 border-b border-[#1F1F2B] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Inbox</h1>
              {unread > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">{unread}</span>
              )}
            </div>
            <p className="text-sm text-[#9CA3AF] mt-0.5">All client messages across every channel</p>
          </div>
          <button
            onClick={() => {
              toast.info("Checking for new messages…");
              fetchMessages();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#131317] hover:bg-[#1A1A24] border border-[#1F1F2B] text-[#9CA3AF] hover:text-white text-sm font-semibold rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="pl-8 pr-4 py-1.5 bg-[#131317] border border-[#1F1F2B] rounded-lg text-sm text-white placeholder-[#6B7280] outline-none w-52" />
          </div>
          {["all", "new", "draft_ready", "assigned", "resolved"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                statusFilter === s
                  ? "bg-[#5B5CF6]/15 text-[#5B5CF6] border border-[#5B5CF6]/30"
                  : "text-[#9CA3AF] hover:text-white bg-[#131317] border border-[#1F1F2B]"
              }`}
            >
              {STATUS_LABELS[s] || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thread List */}
        <div className="w-80 lg:w-96 border-r border-[#1F1F2B] flex flex-col overflow-hidden shrink-0">
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-[#5B5CF6] animate-spin mb-4" />
                <p className="text-sm text-[#9CA3AF]">Loading messages...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <Inbox className="w-10 h-10 text-[#374151] mb-3" />
                <p className="text-sm text-[#9CA3AF]">No messages found</p>
              </div>
            ) : (
              filtered.map(msg => {
                const intentConf = INTENT_CONFIG[msg.intent ?? "general"];
                const channelConf = CHANNEL_CONFIG[msg.channel];
                const ChannelIcon = channelConf.icon;
                const IntentIcon = intentConf.icon;
                const isSelected = selected?.id === msg.id;
                const isUnread = msg.status === "new";

                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelected(msg)}
                    className={`w-full text-left px-4 py-4 border-b border-[#1F1F2B] transition-all hover:bg-[#131317] relative ${
                      isSelected ? "bg-[#131317] shadow-[inset_2px_0_0_0_#5B5CF6]" : ""
                    }`}
                  >
                    {isUnread && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#5B5CF6]" />
                    )}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-xs font-bold truncate ${isUnread ? "text-white" : "text-[#9CA3AF]"}`}>
                          {msg.clientName}
                        </span>
                        <ChannelIcon className={`w-3 h-3 shrink-0 ${channelConf.color}`} />
                      </div>
                      <span className="text-[10px] text-[#6B7280] whitespace-nowrap shrink-0">
                        {timeAgo(msg.receivedAt?.toMillis?.() ?? Date.now())}
                      </span>
                    </div>
                    <p className={`text-xs mb-2 truncate ${isUnread ? "text-white font-medium" : "text-[#9CA3AF]"}`}>
                      {msg.fromName}
                    </p>
                    <p className="text-xs text-[#6B7280] line-clamp-2 mb-2">{msg.body}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${intentConf.bg} ${intentConf.color}`}>
                        <IntentIcon className="w-2.5 h-2.5" />
                        {intentConf.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLORS[msg.status]}`}>
                        {STATUS_LABELS[msg.status]}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Thread Detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <MessageSquare className="w-12 h-12 text-[#374151] mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Select a message</h3>
              <p className="text-sm text-[#9CA3AF]">Choose a message from the inbox to view the conversation</p>
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="px-6 py-4 border-b border-[#1F1F2B] shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {(() => {
                        const intentConf = INTENT_CONFIG[selected.intent ?? "general"];
                        const IntentIcon = intentConf.icon;
                        return (
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded border ${intentConf.bg} ${intentConf.color}`}>
                            <IntentIcon className="w-3 h-3" />
                            {intentConf.label}
                          </span>
                        );
                      })()}
                      {selected.confidenceScore !== undefined && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded border bg-[#5B5CF6]/10 border-[#5B5CF6]/20 text-[#5B5CF6]">
                          AI Confidence: {selected.confidenceScore}%
                        </span>
                      )}
                      {(() => {
                        const conf = CHANNEL_CONFIG[selected.channel];
                        const Icon = conf.icon;
                        return (
                          <span className={`text-[10px] font-semibold flex items-center gap-1 ${conf.color}`}>
                            <Icon className="w-3 h-3" />
                            via {conf.label}
                          </span>
                        );
                      })()}
                    </div>
                    <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {selected.subject || selected.body.slice(0, 60) + "…"}
                    </h2>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      From <span className="text-[#9CA3AF] font-medium">{selected.fromName}</span> · {selected.clientName}
                      {selected.assigneeName && <span> · Assigned to <span className="text-[#5B5CF6] font-medium">{selected.assigneeName}</span></span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleResolve(selected.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131317] hover:bg-[#1A1A24] border border-[#1F1F2B] text-[#9CA3AF] hover:text-emerald-400 text-xs font-semibold rounded-lg transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {/* Client message bubble */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {selected.fromName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-xs font-bold text-white">{selected.fromName}</span>
                      <span className="text-[10px] text-[#6B7280]">{timeAgo(selected.receivedAt?.toMillis?.() ?? Date.now())}</span>
                    </div>
                    <div className="bg-[#131317] border border-[#1F1F2B] rounded-xl rounded-tl-none p-4">
                      <p className="text-sm text-[#E5E7EB] leading-relaxed">{selected.body}</p>
                    </div>
                  </div>
                </div>

                {/* AI Draft Preview */}
                {selected.status === "pending_approval" && !replySent && (
                  <div className="border border-[#5B5CF6]/20 bg-[#5B5CF6]/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-[#5B5CF6]" />
                      <span className="text-xs font-bold text-[#5B5CF6] uppercase tracking-wider">AI-Suggested Reply Ready for Approval</span>
                    </div>
                    <p className="text-sm text-[#9CA3AF] italic leading-relaxed line-clamp-4">The draft is loaded into the composer below. Edit it if necessary and click "Approve & Send".</p>
                  </div>
                )}

                {/* Sent reply confirmation */}
                {replySent && (
                  <div className="flex gap-3 justify-end">
                    <div className="flex-1 max-w-md">
                      <div className="flex items-baseline gap-2 mb-1.5 justify-end">
                        <span className="text-[10px] text-[#6B7280]">just now</span>
                        <span className="text-xs font-bold text-white">You</span>
                      </div>
                      <div className="bg-[#5B5CF6]/15 border border-[#5B5CF6]/25 rounded-xl rounded-tr-none p-4">
                        <p className="text-sm text-[#E5E7EB] leading-relaxed">{draftText}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5 justify-end">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-semibold">Sent</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5B5CF6] to-[#8183FF] flex items-center justify-center text-xs font-bold text-white shrink-0">
                      OS
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Composer */}
              {!replySent && (
                <div className="px-6 py-4 border-t border-[#1F1F2B] shrink-0">
                  <div className="bg-[#131317] border border-[#1F1F2B] focus-within:border-[#5B5CF6]/40 rounded-xl transition-all overflow-hidden">
                    <textarea
                      value={draftText}
                      onChange={e => setDraftText(e.target.value)}
                      placeholder="Write a reply…"
                      rows={4}
                      className="w-full px-4 pt-3 pb-2 bg-transparent text-sm text-white placeholder-[#4B5563] outline-none resize-none"
                    />
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#1F1F2B]">
                      <div className="flex items-center gap-2">
                        {selected.aiDraft && !draftText && (
                          <button
                            onClick={handleGenerateDraft}
                            disabled={isGenerating}
                            className="flex items-center gap-1.5 text-xs font-semibold text-[#5B5CF6] hover:text-[#A4A6FF] transition-colors disabled:opacity-50"
                          >
                            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                            {isGenerating ? "Generating…" : "Generate AI Draft"}
                          </button>
                        )}
                      </div>
                      <button
                        onClick={handleSend}
                        disabled={!draftText.trim() || isGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-[#5B5CF6] hover:bg-[#4F50DB] disabled:opacity-40 text-white text-sm font-bold rounded-lg transition-all"
                      >
                        {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        Approve & Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

