import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * POST /api/chat/send
 *
 * Appends a message to a chat thread and updates conversation metadata.
 * Uses Admin SDK — no Firestore client-side permission dependency.
 *
 * Body: { chatId: string; text: string; senderName: string }
 * Header: Authorization: Bearer <idToken>
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
    const organization_id: string = (decoded as any).organization_id ?? uid;

    const { chatId, text, senderName } = await req.json();

    if (!chatId || !text?.trim()) {
      return NextResponse.json({ error: "Missing chatId or text" }, { status: 400 });
    }

    // Verify the chat belongs to this org
    const chatRef = adminDb.collection("chats").doc(chatId);
    const chatSnap = await chatRef.get();
    if (!chatSnap.exists) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    if (chatSnap.data()?.organization_id !== organization_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const trimmedText = text.trim();

    // Write the message
    await chatRef.collection("messages").add({
      organization_id,
      chatId,
      text: trimmedText,
      senderRole: "agency",
      senderName: senderName || "Agency",
      sentAt: FieldValue.serverTimestamp(),
    });

    // Update conversation metadata
    await chatRef.update({
      lastMessage: trimmedText,
      lastMessageAt: FieldValue.serverTimestamp(),
      unreadClient: FieldValue.increment(1),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("[Chat/send] Error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to send message" },
      { status: 500 }
    );
  }
}
