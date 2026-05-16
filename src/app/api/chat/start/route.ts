import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * POST /api/chat/start
 * Agency: any client in org. Client: only their own clientId.
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

    const { clientId, clientName } = await req.json();

    if (!clientId) {
      return NextResponse.json({ error: "Missing clientId" }, { status: 400 });
    }

    const isClient = tokenRole === "client";

    if (isClient) {
      if (!tokenClientId || tokenClientId !== clientId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      const clientSnap = await adminDb.collection("clients").doc(clientId).get();
      if (!clientSnap.exists || clientSnap.data()?.organization_id !== organization_id) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }
    }

    const resolvedName =
      clientName ||
      (isClient
        ? "Client"
        : ((await adminDb.collection("clients").doc(clientId).get()).data()?.name as string) ||
          "Client");

    const chatId = `${organization_id}_${clientId}`;
    const chatRef = adminDb.collection("chats").doc(chatId);
    const snap = await chatRef.get();

    if (!snap.exists) {
      await chatRef.set({
        organization_id,
        clientId,
        clientName: resolvedName,
        lastMessage: null,
        lastMessageAt: null,
        unreadAgency: 0,
        unreadClient: 0,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ chatId }, { status: 200 });
  } catch (err: unknown) {
    console.error("[Chat/start] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create conversation" },
      { status: 500 }
    );
  }
}
