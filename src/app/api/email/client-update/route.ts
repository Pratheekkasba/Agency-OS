import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email";
import { getAppUrl } from "@/lib/email/app-url";
import { buildEmailHtml } from "@/lib/email/template";
import { callerOrgId, verifyAgencyCaller } from "@/lib/email/verify-caller";

/**
 * POST /api/email/client-update
 * Notifies a client by email when the agency publishes an update.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      idToken,
      clientId,
      done = [],
      inProgress = [],
      next = [],
      projectName,
      progress,
    } = body;

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
    const proj = projectName || (client.projectName as string) || "your project";
    const pct =
      typeof progress === "number"
        ? progress
        : typeof client.progress === "number"
          ? client.progress
          : undefined;

    const headline = inProgress[0] || done[0] || "Your agency shared a new update";
    const portalUrl = `${getAppUrl()}/portal`;

    const html = buildEmailHtml({
      headline: `New update on ${proj}`,
      paragraphs: [
        `Hi ${name},`,
        headline,
        pct !== undefined ? `Overall progress: ${pct}%` : "Open your portal for the full breakdown.",
      ],
      listSections: [
        { title: "Completed", items: done },
        { title: "In progress", items: inProgress },
        { title: "Up next", items: next },
      ],
      ctaLabel: "View in portal",
      ctaUrl: portalUrl,
      footerNote: "You received this because you are a client on Agency OS.",
    });

    const sent = await sendEmail({
      to: email.trim(),
      subject: `New project update — ${proj}`,
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
    console.error("[email/client-update]", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
