import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email";
import { getAppUrl } from "@/lib/email/app-url";
import { buildEmailHtml } from "@/lib/email/template";

/**
 * POST /api/email/welcome
 * Sends a one-time welcome email based on the user's role (agency owner vs client).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken, name: displayName } = body;

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const email = decoded.email;
    if (!email) {
      return NextResponse.json({ error: "No email on account" }, { status: 400 });
    }

    const uid = decoded.uid;
    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const userData = userSnap.data();

    if (userData?.welcomeEmailSent === true) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const role =
      (userData?.role as string | undefined) ||
      (decoded.role as string | undefined);
    const name =
      displayName ||
      (userData?.name as string | undefined) ||
      decoded.name ||
      "there";

    const appUrl = getAppUrl();
    let subject: string;
    let html: string;

    if (role === "client") {
      subject = "Welcome to your client portal";
      html = buildEmailHtml({
        headline: "Welcome to your portal",
        paragraphs: [
          `Hi ${name},`,
          "You're connected. Your agency will post project updates here — progress, what's done, and what's next.",
          "Sign in anytime with your email (or Google) to view your latest update.",
        ],
        ctaLabel: "Open my portal",
        ctaUrl: `${appUrl}/portal`,
        footerNote: "You used your Access ID to join — no separate email verification needed.",
      });
    } else {
      subject = "Welcome to Agency OS";
      html = buildEmailHtml({
        headline: "Welcome to Agency OS",
        paragraphs: [
          `Hi ${name},`,
          "Your agency workspace is ready. Add clients, send updates, and they'll see everything live in their portal.",
          "Tip: Onboard a client, share their Access ID, then publish your first update from the Updates page.",
        ],
        ctaLabel: "Go to dashboard",
        ctaUrl: `${appUrl}/dashboard`,
      });
    }

    const sent = await sendEmail({ to: email, subject, html });
    if (!sent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    await userRef.set(
      {
        welcomeEmailSent: true,
        welcomeEmailSentAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true, role: role || "unknown" });
  } catch (error) {
    console.error("[email/welcome]", error);
    return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
  }
}
