import { adminAuth, adminDb } from "./src/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const NAME = "Mani Pratheek";
const EMAIL = "manipratheek.kasubha@gmail.com";
const PASSWORD = "Test@1234";

async function resetUser() {
  // 1. Try to delete existing user by email
  try {
    const existing = await adminAuth.getUserByEmail(EMAIL);
    await adminAuth.deleteUser(existing.uid);
    console.log(`✅ Deleted existing user: ${existing.uid}`);
  } catch (e: any) {
    if (e.code === "auth/user-not-found") {
      console.log("No existing user found, creating fresh.");
    } else {
      console.error("Error during deletion:", e.message);
    }
  }

  // 2. Create fresh verified user
  try {
    const userRecord = await adminAuth.createUser({
      email: EMAIL,
      password: PASSWORD,
      displayName: NAME,
      emailVerified: true,
    });

    console.log(`✅ Auth user created: ${userRecord.uid}`);

    await adminDb.collection("users").doc(userRecord.uid).set({
      name: NAME,
      email: EMAIL,
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log(`✅ Firestore document created`);
    console.log(`\n──────────────────────────────────`);
    console.log(`Login at: http://localhost:3000/login`);
    console.log(`  Email:    ${EMAIL}`);
    console.log(`  Password: ${PASSWORD}`);
    console.log(`──────────────────────────────────\n`);
    process.exit(0);
  } catch (error: any) {
    console.error("Create error:", error.message);
    process.exit(1);
  }
}

resetUser();
