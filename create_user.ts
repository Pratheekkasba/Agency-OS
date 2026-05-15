import { adminAuth, adminDb } from "./src/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

// ── EDIT THESE ────────────────────────────────────────────
const NAME = "Mani Pratheek";
const EMAIL = "manipratheek.kasubha@gmail.com";
const PASSWORD = "Test@1234";
// ──────────────────────────────────────────────────────────

async function createUser() {
  try {
    console.log(`Creating user: ${EMAIL}`);

    // Create the Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email: EMAIL,
      password: PASSWORD,
      displayName: NAME,
      emailVerified: true, // Mark as verified so they skip the verify page
    });

    console.log(`✅ Auth user created: ${userRecord.uid}`);

    // Create the Firestore user document
    await adminDb.collection("users").doc(userRecord.uid).set({
      name: NAME,
      email: EMAIL,
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log(`✅ Firestore user document created`);
    console.log(`\n──────────────────────────────────`);
    console.log(`Login with:`);
    console.log(`  Email:    ${EMAIL}`);
    console.log(`  Password: ${PASSWORD}`);
    console.log(`──────────────────────────────────\n`);

    process.exit(0);
  } catch (error: any) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

createUser();
