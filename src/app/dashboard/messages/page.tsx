"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Plus, Send, Loader2, MessageSquare,
  X, Check, Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeToConversations, subscribeToChatMessages,
  markChatReadByAgency,
  getAllClients, resolveOrganizationId,
} from "@/lib/firebase/firestore";
import { toast } from "sonner";
import type { ChatConversation, ChatMessage, Client } from "@/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

const PALETTE = [
  "bg-[#5B5CF6]", "bg-[#0EA5E9]", "bg-[#10B981]",
  "bg-[#F59E0B]", "bg-[#8B5CF6]", "bg-[#EC4899]",
  "bg-[#14B8A6]", "bg-[#EF4444]",
];
const avatarBg = (name: string) =>
  PALETTE[(name?.charCodeAt(0) ?? 0) % PALETTE.length];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function fmtTime(ts: any): string {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 1) return "now";
  if (hours < 1) return `${mins}m`;
  if (days < 1) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtMessageTime(ts: any): string {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function fmtDateDivider(ts: any): string {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === now.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

function isSameDay(a: any, b: any): boolean {
  if (!a || !b) return false;
  const da = a.toDate ? a.toDate() : new Date(a);
  const db2 = b.toDate ? b.toDate() : new Date(b);
  return da.toDateString() === db2.toDateString();
}

// ── New Chat Modal ────────────────────────────────────────────────────────────

function NewChatModal({
  clients,
  conversations,
  onSelect,
  onClose,
}: {
  clients: Client[];
  conversations: ChatConversation[];
  onSelect: (client: Client) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const existingIds = new Set(conversations.map((c) => c.clientId));

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.email?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0A0A10] border border-[#1F1F2B] rounded-2xl w-full max-w-md shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#1F1F2B]">
          <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>New Conversation</h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1A1A24]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-3 border-b border-[#1F1F2B]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search clients…"
              className="w-full bg-[#131317] border border-[#1F1F2B] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#4B5563] outline-none focus:border-[#5B5CF6]/50"
            />
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-[#6B7280] text-center py-8">No clients found</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#131317] transition-colors text-left"
              >
                <div className={`w-9 h-9 rounded-full ${avatarBg(c.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {initials(c.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                  <p className="text-xs text-[#6B7280] truncate">{c.email || c.companyName || "—"}</p>
                </div>
                {existingIds.has(c.id) && (
                  <span className="text-[10px] font-bold text-[#5B5CF6] bg-[#5B5CF6]/10 border border-[#5B5CF6]/20 px-2 py-0.5 rounded-full shrink-0">
                    Existing
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const { userData, user } = useAuth();
  const orgId = resolveOrganizationId(userData);

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [search, setSearch] = useState("");
  const [startingChat, setStartingChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const unsubMsgsRef = useRef<(() => void) | null>(null);

  const activeConv = conversations.find((c) => c.id === activeChatId) ?? null;
  const agentName = userData?.name || user?.displayName || "Agency";

  // Subscribe to conversations list (real-time)
  useEffect(() => {
    if (!orgId) return;
    setLoadingConvs(true);
    const unsub = subscribeToConversations(
      orgId,
      (convs) => {
        setConversations(convs);
        setLoadingConvs(false);
      },
      (error) => {
        console.error("Conversations load error:", error);
        toast.error("Failed to load conversations");
        setLoadingConvs(false);
      }
    );
    return unsub;
  }, [orgId]);

  // Load clients for new-chat modal
  useEffect(() => {
    if (!orgId) return;
    getAllClients(orgId).then(setClients).catch(() => {});
  }, [orgId]);

  // Subscribe to messages when active chat changes
  useEffect(() => {
    // Cleanup previous listener
    if (unsubMsgsRef.current) {
      unsubMsgsRef.current();
      unsubMsgsRef.current = null;
    }
    if (!activeChatId) {
      setMessages([]);
      return;
    }
    setLoadingMsgs(true);
    const unsub = subscribeToChatMessages(
      activeChatId,
      (msgs) => {
        setMessages(msgs);
        setLoadingMsgs(false);
      },
      (error) => {
        console.error("Messages load error:", error);
        toast.error("Failed to load messages");
        setLoadingMsgs(false);
      }
    );
    unsubMsgsRef.current = unsub;
    // Mark as read
    markChatReadByAgency(activeChatId).catch(() => {});
    return () => {
      unsub();
      unsubMsgsRef.current = null;
    };
  }, [activeChatId]);

  // Auto-scroll to bottom when messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [text]);

  const openConversation = useCallback((chatId: string) => {
    setActiveChatId(chatId);
    setText("");
    // Mark read
    markChatReadByAgency(chatId).catch(() => {});
    // Update local unread to 0 instantly (optimistic)
    setConversations((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadAgency: 0 } : c))
    );
  }, []);

  const handleStartNewChat = async (client: Client) => {
    if (!orgId) return;
    setShowNewChat(false);
    setStartingChat(true);
    try {
      // Use the server-side API route (Admin SDK) to create the chat doc.
      // This sidesteps Firestore client security rules entirely — no JWT
      // custom-claim dependency.
      const idToken = await user?.getIdToken();
      const res = await fetch("/api/chat/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ clientId: client.id, clientName: client.name }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }

      const { chatId } = await res.json();
      openConversation(chatId);
    } catch (err: any) {
      console.error("[Chat] Failed to open conversation:", err);
      toast.error("Failed to open conversation: " + (err?.message || "unknown error"));
    } finally {
      setStartingChat(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !activeChatId || sending) return;
    const msg = text.trim();
    setText("");
    setSending(true);
    try {
      const idToken = await user?.getIdToken();
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          chatId: activeChatId,
          text: msg,
          senderName: agentName,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.error("[Chat] Failed to send:", err);
      toast.error("Failed to send message");
      setText(msg); // restore on failure
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filtered = conversations.filter(
    (c) =>
      !search ||
      c.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadAgency || 0), 0);

  return (
    <div className="h-full flex overflow-hidden bg-[#0B0B0F]">

      {/* ── Left Panel: Conversation List ── */}
      <div className="w-[300px] lg:w-[340px] flex flex-col border-r border-[#1F1F2B] shrink-0">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-[#1F1F2B] shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Messages
              </h1>
              {totalUnread > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#5B5CF6] text-white rounded-full min-w-[18px] text-center">
                  {totalUnread}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowNewChat(true)}
              disabled={startingChat}
              className="w-8 h-8 flex items-center justify-center bg-[#5B5CF6] hover:bg-[#4F50DB] text-white rounded-xl transition-all shadow-[0_2px_10px_rgba(91,92,246,0.3)] disabled:opacity-50"
              title="New conversation"
            >
              {startingChat ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full bg-[#131317] border border-[#1F1F2B] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#4B5563] outline-none focus:border-[#5B5CF6]/40 transition-all"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-[#5B5CF6] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#131317] border border-[#1F1F2B] flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-[#2D2D3D]" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                {search ? "No results" : "No conversations yet"}
              </p>
              <p className="text-xs text-[#6B7280]">
                {search ? "Try a different name" : "Click + to start chatting with a client"}
              </p>
            </div>
          ) : (
            filtered.map((conv) => {
              const isActive = conv.id === activeChatId;
              const hasUnread = (conv.unreadAgency ?? 0) > 0;

              return (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv.id)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3.5 border-b border-[#1A1A24] transition-all relative group ${
                    isActive
                      ? "bg-[#131317] shadow-[inset_2px_0_0_0_#5B5CF6]"
                      : "hover:bg-[#0F0F15]"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`relative w-10 h-10 rounded-full ${avatarBg(conv.clientName)} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {initials(conv.clientName)}
                    {hasUnread && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#5B5CF6] rounded-full text-[9px] font-bold text-white flex items-center justify-center border border-[#0B0B0F]">
                        {conv.unreadAgency > 9 ? "9+" : conv.unreadAgency}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm font-semibold truncate ${hasUnread ? "text-white" : "text-[#D1D5DB]"}`}>
                        {conv.clientName}
                      </span>
                      <span className="text-[10px] text-[#6B7280] shrink-0 ml-2">
                        {fmtTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${hasUnread ? "text-[#9CA3AF] font-medium" : "text-[#6B7280]"}`}>
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Panel: Chat Thread ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!activeChatId ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-[#131317] border border-[#1F1F2B] flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[#2D2D3D]" />
            </div>
            <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Select a conversation
            </h3>
            <p className="text-sm text-[#6B7280] max-w-xs">
              Choose a conversation from the left, or start a new one by clicking the <strong className="text-[#9CA3AF]">+</strong> button.
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-[#1F1F2B] shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${avatarBg(activeConv?.clientName ?? "")} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {initials(activeConv?.clientName ?? "")}
                </div>
                <div>
                  <p className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {activeConv?.clientName}
                  </p>
                  <p className="text-[11px] text-[#6B7280]">Client · Direct message</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[10px] font-semibold text-[#10B981]">Live</span>
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1">
              {loadingMsgs ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 text-[#5B5CF6] animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#131317] border border-[#1F1F2B] flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-[#2D2D3D]" />
                  </div>
                  <p className="text-sm text-[#6B7280]">No messages yet. Say hello! 👋</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isAgency = msg.senderRole === "agency";
                  const prev = messages[i - 1];
                  const showDate = !prev || !isSameDay(prev.sentAt, msg.sentAt);
                  const isSameSenderAsPrev =
                    prev?.senderRole === msg.senderRole &&
                    !showDate;
                  const isLast =
                    i === messages.length - 1 ||
                    messages[i + 1]?.senderRole !== msg.senderRole;

                  return (
                    <div key={msg.id}>
                      {/* Date divider */}
                      {showDate && (
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-[#1F1F2B]" />
                          <span className="text-[10px] font-semibold text-[#4B5563] uppercase tracking-wider shrink-0">
                            {fmtDateDivider(msg.sentAt)}
                          </span>
                          <div className="flex-1 h-px bg-[#1F1F2B]" />
                        </div>
                      )}

                      {/* Bubble row */}
                      <div
                        className={`flex items-end gap-2.5 ${isAgency ? "flex-row-reverse" : "flex-row"} ${isSameSenderAsPrev ? "mt-0.5" : "mt-3"}`}
                      >
                        {/* Avatar — only on last in group */}
                        <div className="w-7 shrink-0">
                          {isLast && (
                            <div className={`w-7 h-7 rounded-full ${isAgency ? "bg-gradient-to-br from-[#5B5CF6] to-[#7C3AED]" : avatarBg(msg.senderName)} flex items-center justify-center text-white text-[10px] font-bold`}>
                              {isAgency ? "OS" : initials(msg.senderName)}
                            </div>
                          )}
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[68%] group`}>
                          {!isSameSenderAsPrev && (
                            <p className={`text-[10px] font-semibold mb-1 ${isAgency ? "text-right text-[#6B7280]" : "text-left text-[#6B7280]"}`}>
                              {msg.senderName}
                            </p>
                          )}
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-all ${
                              isAgency
                                ? "bg-[#5B5CF6] text-white rounded-tr-sm shadow-[0_2px_12px_rgba(91,92,246,0.25)]"
                                : "bg-[#1A1A24] border border-[#2D2D3D] text-[#E5E7EB] rounded-tl-sm"
                            }`}
                          >
                            {msg.text}
                          </div>
                          {/* Timestamp on last bubble of group */}
                          {isLast && (
                            <p className={`text-[10px] text-[#4B5563] mt-1 ${isAgency ? "text-right" : "text-left"}`}>
                              {fmtMessageTime(msg.sentAt)}
                              {isAgency && (
                                <span className="ml-1 inline-flex items-center gap-[-4px]">
                                  <Check className="w-3 h-3 text-[#5B5CF6] inline" />
                                  <Check className="w-3 h-3 text-[#5B5CF6] inline -ml-1.5" />
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <div className="px-5 py-4 border-t border-[#1F1F2B] shrink-0">
              <div className="flex items-end gap-3 bg-[#131317] border border-[#1F1F2B] focus-within:border-[#5B5CF6]/40 rounded-2xl px-4 py-3 transition-all">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${activeConv?.clientName ?? "client"}…`}
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-white placeholder-[#4B5563] outline-none resize-none leading-relaxed max-h-[140px] overflow-y-auto"
                  style={{ minHeight: "24px" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim() || sending}
                  className="w-8 h-8 flex items-center justify-center bg-[#5B5CF6] hover:bg-[#4F50DB] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shrink-0 shadow-[0_2px_8px_rgba(91,92,246,0.3)]"
                >
                  {sending
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Send className="w-3.5 h-3.5" />
                  }
                </button>
              </div>
              <p className="text-[10px] text-[#3D3D4D] mt-2 pl-1">
                Press <kbd className="px-1 py-0.5 bg-[#1A1A24] border border-[#2D2D3D] rounded text-[9px]">Enter</kbd> to send · <kbd className="px-1 py-0.5 bg-[#1A1A24] border border-[#2D2D3D] rounded text-[9px]">Shift+Enter</kbd> for new line
              </p>
            </div>
          </>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <NewChatModal
          clients={clients}
          conversations={conversations}
          onSelect={handleStartNewChat}
          onClose={() => setShowNewChat(false)}
        />
      )}
    </div>
  );
}
