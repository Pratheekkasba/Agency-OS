import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

/**
 * POST /api/auth/complete-client-access
 * After valid Access ID, mark the Firebase user as email-verified (clients skip inbox verify).
 */
export async function POST(req: NextRequest) {
  try {
    const { idToken, accessId } = await req.json();
    if (!idToken || !accessId) {
      return NextResponse.json(
        { error: "Missing idToken or accessId" },
        { status: 400 }
      );
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const normalized = String(accessId).trim().toUpperCase();

    const snap = await adminDb
      .collection("clients")
      .where("accessId", "==", normalized)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ error: "Invalid Access ID" }, { status: 404 });
    }

    const client = snap.docs[0].data();
    if (client.is_deleted === true) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    await adminAuth.updateUser(decoded.uid, { emailVerified: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[complete-client-access]", error);
    return NextResponse.json(
      { error: "Failed to complete client access" },
      { status: 500 }
    );
  }
}
