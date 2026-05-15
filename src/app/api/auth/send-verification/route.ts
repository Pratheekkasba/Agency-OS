import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email";
import { buildEmailHtml } from "@/lib/email/template";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const verificationLink = await adminAuth.generateEmailVerificationLink(email);

    const html = buildEmailHtml({
      headline: "Verify your email address",
      paragraphs: [
        "Welcome to Agency OS! Click the button below to verify your email and access your dashboard.",
      ],
      ctaLabel: "Verify email",
      ctaUrl: verificationLink,
      footerNote:
        "If the button does not work, copy and paste the verification link from your browser address bar after clicking, or request a new email from the app.",
    });

    const sent = await sendEmail({
      to: email,
      subject: "Verify your email for Agency OS",
      html,
    });

    if (!sent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : "Unknown error";
    console.error("[send-verification API] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details },
      { status: 500 }
    );
  }
}
