import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * POST /api/chat/start
 *
 * Creates (or confirms) a chat conversation between the agency and a client.
 * Uses Admin SDK so it bypasses Firestore client security rules — no JWT
 * custom-claim dependency on the caller.
 *
 * Body: { clientId: string; clientName: string }
 * Header: Authorization: Bearer <idToken>
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const idToken = authHeader.replace("Bearer ", "").trim();

    if (!idToken) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    // Verify the caller and extract their uid (= organization_id for owners)
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    // organization_id from claim, fall back to uid (agency owners)
    const organization_id: string =
      (decoded as any).organization_id ?? uid;

    const { clientId, clientName } = await req.json();

    if (!clientId || !clientName) {
      return NextResponse.json({ error: "Missing clientId or clientName" }, { status: 400 });
    }

    const chatId = `${organization_id}_${clientId}`;
    const chatRef = adminDb.collection("chats").doc(chatId);
    const snap = await chatRef.get();

    if (!snap.exists) {
      await chatRef.set({
        organization_id,
        clientId,
        clientName,
        lastMessage: null,
        lastMessageAt: null,
        unreadAgency: 0,
        unreadClient: 0,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ chatId }, { status: 200 });
  } catch (err: any) {
    console.error("[Chat/start] Error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to create conversation" },
      { status: 500 }
    );
  }
}
