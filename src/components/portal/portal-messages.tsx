"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import {
  subscribeToChatMessages,
  markChatReadByClient,
} from "@/lib/firebase/firestore";
import type { ChatMessage } from "@/types";
import { toast } from "sonner";

function messageTime(ts: unknown): string {
  if (!ts) return "";
  const date =
    typeof (ts as { toDate?: () => Date }).toDate === "function"
      ? (ts as { toDate: () => Date }).toDate()
      : new Date(ts as string);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function sortMessages(msgs: ChatMessage[]): ChatMessage[] {
  return [...msgs].sort((a, b) => {
    const ta =
      typeof (a.sentAt as { toMillis?: () => number })?.toMillis === "function"
        ? (a.sentAt as { toMillis: () => number }).toMillis()
        : new Date(a.sentAt as string).getTime();
    const tb =
      typeof (b.sentAt as { toMillis?: () => number })?.toMillis === "function"
        ? (b.sentAt as { toMillis: () => number }).toMillis()
        : new Date(b.sentAt as string).getTime();
    return ta - tb;
  });
}

export function PortalMessages({
  clientId,
  clientName,
  orgId,
}: {
  clientId: string;
  clientName: string;
  orgId: string;
}) {
  const { user } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const displayName = user?.displayName || clientName || "Client";

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!auth.currentUser) return;
      setLoading(true);
      try {
        const idToken = await auth.currentUser.getIdToken();
        const res = await fetch("/api/chat/start", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ clientId, clientName }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not open chat");
        if (!cancelled) setChatId(data.chatId);
      } catch (e) {
        console.error(e);
        toast.error(e instanceof Error ? e.message : "Failed to open messages");
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [clientId, clientName]);

  useEffect(() => {
    if (!chatId || !orgId) return;

    const unsub = subscribeToChatMessages(
      orgId,
      chatId,
      (msgs) => {
        setMessages(msgs);
        setLoading(false);
        setPending((prev) =>
          prev.filter(
            (p) =>
              !msgs.some(
                (m) =>
                  m.text === p.text &&
                  m.senderRole === p.senderRole &&
                  Math.abs(
                    (typeof (m.sentAt as { toMillis?: () => number })?.toMillis ===
                    "function"
                      ? (m.sentAt as { toMillis: () => number }).toMillis()
                      : 0) -
                      (p.sentAt instanceof Date ? p.sentAt.getTime() : 0)
                  ) < 5000
              )
          )
        );
        markChatReadByClient(chatId).catch(() => {});
      },
      () => {
        toast.error("Failed to load messages");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [chatId, orgId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  const handleSend = useCallback(async () => {
    if (!text.trim() || !chatId || sending) return;
    const msg = text.trim();
    setText("");

    const tempId = `temp-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      organization_id: orgId,
      chatId,
      text: msg,
      senderRole: "client",
      senderName: displayName,
      sentAt: new Date(),
    };
    setPending((p) => [...p, optimistic]);
    setSending(true);

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          chatId,
          text: msg,
          senderName: displayName,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Send failed");
      }
    } catch (e) {
      toast.error("Failed to send message");
      setText(msg);
      setPending((p) => p.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  }, [chatId, displayName, orgId, sending, text]);

  const combined = sortMessages([...messages, ...pending]);

  return (
    <div className="flex flex-col h-[min(70vh,640px)] rounded-2xl bg-card border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
        <Link
          href="/portal"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-container transition-colors"
          aria-label="Back to portal"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">Message your agency</p>
          <p className="text-xs text-muted-foreground truncate">
            Direct thread with {clientName}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[200px]">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : combined.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            No messages yet. Say hello to your agency team.
          </p>
        ) : (
          combined.map((msg) => {
            const isClient = msg.senderRole === "client";
            return (
              <div
                key={msg.id}
                className={`flex ${isClient ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isClient
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-surface-container border border-border text-foreground rounded-tl-sm"
                  }`}
                >
                  {!isClient && (
                    <p className="text-[10px] font-semibold opacity-70 mb-1">
                      {msg.senderName || "Agency"}
                    </p>
                  )}
                  {msg.text}
                  <p
                    className={`text-[10px] mt-1 ${isClient ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {messageTime(msg.sentAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <div className="px-4 py-3 border-t border-border shrink-0 flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message…"
          rows={1}
          className="flex-1 resize-none rounded-xl bg-surface-container border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 min-h-[44px] max-h-[120px]"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 shrink-0"
          aria-label="Send"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
