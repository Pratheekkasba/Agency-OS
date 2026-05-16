import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * POST /api/chat/send
 * Agency or client can send — role is taken from verified token, not the request body.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const idToken = authHeader.replace("Bearer ", "").trim();

    if (!idToken) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const tokenRole = (decoded as { role?: string }).role;
    const tokenClientId = (decoded as { client_id?: string }).client_id;
    const organization_id: string =
      (decoded as { organization_id?: string }).organization_id ?? uid;

    const { chatId, text, senderName } = await req.json();

    if (!chatId || !text?.trim()) {
      return NextResponse.json({ error: "Missing chatId or text" }, { status: 400 });
    }

    const chatRef = adminDb.collection("chats").doc(chatId);
    const chatSnap = await chatRef.get();
    if (!chatSnap.exists) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const chat = chatSnap.data()!;
    if (chat.organization_id !== organization_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const isClient = tokenRole === "client";
    if (isClient) {
      if (!tokenClientId || chat.clientId !== tokenClientId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const trimmedText = text.trim();
    const senderRole = isClient ? "client" : "agency";
    const displayName =
      senderName?.trim() ||
      (isClient ? "Client" : "Agency");

    await chatRef.collection("messages").add({
      organization_id,
      chatId,
      text: trimmedText,
      senderRole,
      senderName: displayName,
      sentAt: FieldValue.serverTimestamp(),
    });

    await chatRef.update({
      lastMessage: trimmedText,
      lastMessageAt: FieldValue.serverTimestamp(),
      ...(senderRole === "agency"
        ? { unreadClient: FieldValue.increment(1) }
        : { unreadAgency: FieldValue.increment(1) }),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("[Chat/send] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send message" },
      { status: 500 }
    );
  }
}
