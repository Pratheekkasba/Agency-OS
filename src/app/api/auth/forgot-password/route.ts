import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email";
import { getAppUrl } from "@/lib/email/app-url";
import { buildEmailHtml } from "@/lib/email/template";

/**
 * POST /api/auth/forgot-password
 * Sends a branded password reset link (does not reveal whether the email exists).
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const trimmed = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!trimmed) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
      await adminAuth.getUserByEmail(trimmed);
      const resetUrl = `${getAppUrl()}/reset-password`;
      const resetLink = await adminAuth.generatePasswordResetLink(trimmed, {
        url: resetUrl,
        handleCodeInApp: false,
      });

      const html = buildEmailHtml({
        headline: "Reset your password",
        paragraphs: [
          "We received a request to reset your Agency OS password.",
          "Click the button below to choose a new password. This link expires after a short time.",
          "If you did not request this, you can ignore this email.",
        ],
        ctaLabel: "Reset password",
        ctaUrl: resetLink,
        footerNote:
          "For security, this link can only be used once. Request a new reset from the login page if it expires.",
      });

      const sent = await sendEmail({
        to: trimmed,
        subject: "Reset your Agency OS password",
        html,
      });

      if (!sent) {
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code)
          : "";
      if (code !== "auth/user-not-found") {
        console.error("[forgot-password] unexpected:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account exists for this email, you will receive a password reset link shortly.",
    });
  } catch (error) {
    console.error("[forgot-password]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
