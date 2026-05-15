/**
 * Quick test script for the Nodemailer Gmail transport.
 * Run with: npx tsx --env-file=.env.local test_email.ts
 */
import { sendEmail } from "./src/lib/email";

const TEST_TO = process.env.GMAIL_USER!; // Send to yourself

console.log("=== Agency OS Email Engine Test ===");
console.log(`Sending test email to: ${TEST_TO}\n`);

sendEmail({
  to: TEST_TO,
  subject: "✅ Agency OS Email Engine — Test",
  html: `
    <div style="font-family: sans-serif; padding: 24px; background: #0B0B0F; color: white; border-radius: 12px;">
      <h2 style="color: #5B5CF6;">Agency OS Email Engine</h2>
      <p>🎉 If you're reading this, the Nodemailer Gmail transport is working correctly.</p>
      <p style="color: #9CA3AF; font-size: 13px;">Sent at: ${new Date().toISOString()}</p>
    </div>
  `,
}).then((success) => {
  if (success) {
    console.log("\n✅ SUCCESS — Email delivered. Check your inbox.");
  } else {
    console.log("\n❌ FAILED — Check the error logs above for the exact SMTP error code.");
  }
  process.exit(success ? 0 : 1);
});
