import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.error("[Email Engine] Missing GMAIL_USER or GMAIL_APP_PASSWORD.");
    // We shouldn't throw in development if credentials aren't set yet, just log
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Agency OS" <${user}>`,
      to,
      subject,
      html,
    });

    console.log("[Email Engine] Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("[Email Engine] Failed to send email:", error);
    return false;
  }
}
