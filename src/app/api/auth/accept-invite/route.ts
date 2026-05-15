import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userEmail = decodedToken.email;

    const body = await req.json();
    const { token, name } = body;

    if (!token) {
      return NextResponse.json({ error: "Missing invitation token" }, { status: 400 });
    }

    // Find the invitation
    const invitesRef = adminDb.collection("team_invitations");
    const snapshot = await invitesRef.where("token", "==", token).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 404 });
    }

    const inviteDoc = snapshot.docs[0];
    const inviteData = inviteDoc.data();

    if (inviteData.status !== "pending") {
      return NextResponse.json({ error: "Invitation has already been used" }, { status: 400 });
    }

    // Optional: Ensure the email matches (some flexibility can be allowed, but matching is safer)
    if (inviteData.email.toLowerCase() !== userEmail?.toLowerCase()) {
      return NextResponse.json({ error: "Invitation email does not match your account email" }, { status: 403 });
    }

    const orgId = inviteData.organization_id;
    const role = inviteData.role;
    
    const finalName = name || decodedToken.name || userEmail?.split("@")[0] || "Team Member";

    // 1. Set Custom Claims (This isolates the user to the organization)
    await adminAuth.setCustomUserClaims(uid, {
      organization_id: orgId,
      role: role,
    });

    // 2. Create/Update User document
    const userRef = adminDb.collection("users").doc(uid);
    await userRef.set({
      id: uid,
      email: userEmail,
      name: finalName,
      role: role,
      organization_id: orgId,
      status: "active",
      joinedAt: FieldValue.serverTimestamp(),
      invitedAt: inviteData.createdAt || FieldValue.serverTimestamp(),
      created_at: FieldValue.serverTimestamp(),
    }, { merge: true });

    // Note: Team members are fetched from the `users` collection using the organization_id.
    // The previous update to `users` already fulfills the requirement.

    // 4. Mark invitation as accepted
    await inviteDoc.ref.update({
      status: "accepted",
      acceptedBy: uid,
      acceptedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, organization_id: orgId, role });
  } catch (error: any) {
    console.error("[accept-invite] CRITICAL ERROR:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    return NextResponse.json(
      { 
        error: "Failed to accept invitation", 
        details: error.message,
        code: error.code 
      },
      { status: 500 }
    );
  }
}
