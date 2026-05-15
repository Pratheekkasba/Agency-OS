import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email";
import { getAppUrl } from "@/lib/email/app-url";
import { buildEmailHtml } from "@/lib/email/template";
import { callerOrgId, verifyAgencyCaller } from "@/lib/email/verify-caller";

/**
 * POST /api/email/client-invite
 * Sends portal access instructions when a new client is created.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken, clientId } = body;

    if (!idToken || !clientId) {
      return NextResponse.json(
        { error: "Missing idToken or clientId" },
        { status: 400 }
      );
    }

    const decoded = await verifyAgencyCaller(idToken);
    const orgId = callerOrgId(decoded);

    const clientSnap = await adminDb.collection("clients").doc(clientId).get();
    if (!clientSnap.exists) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const client = clientSnap.data()!;
    if (client.organization_id !== orgId && client.organization_id !== decoded.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const email = client.email as string | undefined;
    if (!email?.trim()) {
      return NextResponse.json({ error: "Client has no email" }, { status: 400 });
    }

    const name = (client.name as string) || "there";
    const accessId = client.accessId as string | undefined;
    const projectName =
      (client.projectName as string) || (client.companyName as string) || "your project";
    const loginUrl = `${getAppUrl()}/login`;
    const roleUrl = `${getAppUrl()}/role`;

    const html = buildEmailHtml({
      headline: "Your project portal is ready",
      paragraphs: [
        `Hi ${name},`,
        `Your agency set up a secure portal for ${projectName}. Sign in with this email (or Google) to see progress and weekly updates.`,
        accessId
          ? `Your Access ID: ${accessId} — choose "Client" after sign-in and enter this code. No separate email verification is required.`
          : 'After signing in, choose "Client" and use the access code your agency gave you.',
      ],
      ctaLabel: "Sign in to portal",
      ctaUrl: loginUrl,
      footerNote: `New here? Create an account with this email, then enter your Access ID on the role screen.`,
    });

    const sent = await sendEmail({
      to: email.trim(),
      subject: `Your portal is ready — ${projectName}`,
      html,
    });

    if (!sent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "Forbidden" || message === "Missing idToken") {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    console.error("[email/client-invite]", error);
    return NextResponse.json({ error: "Failed to send invite" }, { status: 500 });
  }
}
