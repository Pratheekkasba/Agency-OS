import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

/**
 * POST /api/auth/verify-access-id
 * Looks up a client portal access code via Admin SDK (bypasses Firestore rules).
 * Body: { idToken: string; accessId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken, accessId } = body;

    if (!idToken || !accessId) {
      return NextResponse.json(
        { error: "Missing required fields: idToken, accessId" },
        { status: 400 }
      );
    }

    await adminAuth.verifyIdToken(idToken);

    const normalized = String(accessId).trim().toUpperCase();
    const snap = await adminDb
      .collection("clients")
      .where("accessId", "==", normalized)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    const doc = snap.docs[0];
    const data = doc.data();

    if (data.is_deleted === true) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    if (!data.organization_id) {
      return NextResponse.json(
        { error: "Client record is missing organization_id" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      found: true,
      client: {
        id: doc.id,
        name: data.name ?? "",
        organization_id: data.organization_id,
        accessId: data.accessId ?? normalized,
        status: data.status ?? "Active",
      },
    });
  } catch (error: unknown) {
    console.error("[verify-access-id]", error);
    return NextResponse.json(
      { error: "Failed to verify access ID" },
      { status: 500 }
    );
  }
}
