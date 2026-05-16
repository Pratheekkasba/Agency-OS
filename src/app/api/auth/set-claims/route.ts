import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

/**
 * POST /api/auth/set-claims
 *
 * Stamps Firebase Auth custom claims from the user's Firestore profile.
 * Claims are never taken from client-supplied org/role alone — only users/{uid} is authoritative.
 *
 * Body: { idToken: string }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { idToken } = body;

        if (!idToken) {
            return NextResponse.json(
                { error: "Missing required field: idToken" },
                { status: 400 }
            );
        }

        const decoded = await adminAuth.verifyIdToken(idToken);
        const uid = decoded.uid;

        const userSnap = await adminDb.collection("users").doc(uid).get();
        if (!userSnap.exists) {
            return NextResponse.json(
                { error: "User profile not found. Complete role selection first." },
                { status: 404 }
            );
        }

        const user = userSnap.data()!;
        const organization_id = user.organization_id as string | undefined;
        const role = user.role as string | undefined;
        const client_id = user.clientId as string | undefined;

        if (!organization_id || !role) {
            return NextResponse.json(
                { error: "User profile is missing organization_id or role." },
                { status: 400 }
            );
        }

        if (role === "client") {
            if (!client_id) {
                return NextResponse.json(
                    { error: "Client profile is missing clientId." },
                    { status: 400 }
                );
            }
            const clientSnap = await adminDb.collection("clients").doc(client_id).get();
            if (!clientSnap.exists) {
                return NextResponse.json({ error: "Linked client record not found." }, { status: 403 });
            }
            const client = clientSnap.data()!;
            if (client.is_deleted === true) {
                return NextResponse.json({ error: "Client access revoked." }, { status: 403 });
            }
            if (client.organization_id !== organization_id) {
                return NextResponse.json(
                    { error: "Client does not belong to the user's organization." },
                    { status: 403 }
                );
            }
        } else if (role === "owner" && organization_id !== uid) {
            return NextResponse.json(
                { error: "Owner organization_id must match the authenticated UID." },
                { status: 403 }
            );
        }

        // Reject mismatched client hints (logged for debugging; claims still come from Firestore)
        const { organization_id: reqOrg, role: reqRole, client_id: reqClientId } = body;
        if (reqOrg && reqOrg !== organization_id) {
            return NextResponse.json(
                { error: "organization_id does not match your profile." },
                { status: 403 }
            );
        }
        if (reqRole && reqRole !== role) {
            return NextResponse.json(
                { error: "role does not match your profile." },
                { status: 403 }
            );
        }
        if (reqClientId && role === "client" && reqClientId !== client_id) {
            return NextResponse.json(
                { error: "client_id does not match your profile." },
                { status: 403 }
            );
        }

        await adminAuth.setCustomUserClaims(uid, {
            organization_id,
            role,
            ...(role === "client" && client_id ? { client_id } : {}),
        });

        return NextResponse.json({
            success: true,
            organization_id,
            role,
            ...(client_id ? { client_id } : {}),
        });
    } catch (error: unknown) {
        console.error("[Agency OS] set-claims error:", error);
        return NextResponse.json(
            { error: "Failed to set custom claims." },
            { status: 500 }
        );
    }
}
