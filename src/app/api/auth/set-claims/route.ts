import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

/**
 * POST /api/auth/set-claims
 *
 * Sets organization_id (and optionally role) as a Firebase Auth custom claim
 * so that Firestore Security Rules can enforce org-level data isolation.
 *
 * Called after role selection — the client sends its Firebase ID token so we
 * can verify the caller, then we set the claim server-side via Admin SDK.
 *
 * Body: { idToken: string; organization_id: string; role: string }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { idToken, organization_id, role } = body;

        if (!idToken || !organization_id || !role) {
            return NextResponse.json(
                { error: "Missing required fields: idToken, organization_id, role" },
                { status: 400 }
            );
        }

        // Verify the caller's token — this ensures only a legitimate signed-in
        // user can trigger this endpoint (not an anonymous HTTP call)
        const decoded = await adminAuth.verifyIdToken(idToken);
        const uid = decoded.uid;

        // Set the custom claims on their Auth token
        // These appear in request.auth.token inside Firestore Rules
        await adminAuth.setCustomUserClaims(uid, {
            organization_id,
            role,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("[Agency OS] set-claims error:", error);
        return NextResponse.json(
            { error: "Failed to set custom claims." },
            { status: 500 }
        );
    }
}
