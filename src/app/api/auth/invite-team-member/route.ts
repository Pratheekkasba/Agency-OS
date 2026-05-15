import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email";
import { buildEmailHtml } from "@/lib/email/template";
import { getAppUrl } from "@/lib/email/app-url";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Check if user is authorized to invite
    const orgId = decodedToken.organization_id;
    const userRole = decodedToken.role;

    if (!orgId) {
      return NextResponse.json({ error: "No organization associated with this account" }, { status: 403 });
    }

    if (userRole !== "owner" && userRole !== "admin") {
      return NextResponse.json({ error: "Only owners and admins can invite team members" }, { status: 403 });
    }

    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
    }

    // Generate secure invite token
    const token = crypto.randomBytes(32).toString("hex");

    // Save invitation to Firestore
    const inviteRef = adminDb.collection("team_invitations").doc();
    await inviteRef.set({
      organization_id: orgId,
      email: email.toLowerCase(),
      role,
      token,
      invitedBy: decodedToken.uid,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

    // Send email via Nodemailer
    const appUrl = getAppUrl();
    const inviteLink = `${appUrl}/invite?token=${token}`;

    const html = buildEmailHtml({
      headline: "You've been invited to join the team",
      paragraphs: [
        `You have been invited to join an Agency OS workspace as a ${role}.`,
        "Click the link below to accept your invitation and create your account.",
      ],
      ctaLabel: "Accept Invitation",
      ctaUrl: inviteLink,
    });

    const emailSent = await sendEmail({
      to: email,
      subject: "Invitation to join Agency OS",
      html,
    });

    if (!emailSent) {
      // It's still recorded, but email failed
      console.warn("[invite-team-member] Invite saved but email failed to send.");
    }

    return NextResponse.json({ success: true, inviteLink });
  } catch (error: any) {
    console.error("[invite-team-member] Error:", error);
    return NextResponse.json(
      { error: "Failed to process invitation" },
      { status: 500 }
    );
  }
}
