import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate the email verification link using the Firebase Admin SDK
    const verificationLink = await adminAuth.generateEmailVerificationLink(email);

    // Create a beautiful HTML email template
    const htmlBody = `
      <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0B0F; color: #FFFFFF; padding: 40px; border-radius: 16px; border: 1px solid #2D2D3D;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0; color: #FFFFFF;">
            Agency<span style="color: #5B5CF6;"> OS</span>
          </h1>
        </div>
        
        <div style="background-color: #131317; border: 1px solid #2D2D3D; border-radius: 12px; padding: 30px;">
          <h2 style="font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 16px;">Verify your email address</h2>
          <p style="color: #9CA3AF; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Welcome to Agency OS! Please click the button below to verify your email address and securely access your dashboard.
          </p>
          
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${verificationLink}" style="display: inline-block; background-color: #5B5CF6; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
              Verify Email
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 13px; line-height: 1.5; margin-bottom: 0;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationLink}" style="color: #5B5CF6; word-break: break-all;">${verificationLink}</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
          © ${new Date().getFullYear()} Agency OS. All rights reserved.
        </div>
      </div>
    `;

    // Send the email via our Nodemailer utility
    const sent = await sendEmail({
      to: email,
      subject: "Verify your email for Agency OS",
      html: htmlBody,
    });

    if (!sent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[send-verification API] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
