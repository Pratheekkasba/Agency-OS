import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let adminApp: App;

if (!getApps().length) {
    try {
        // Use service account JSON if provided (recommended for production).
        // Set FIREBASE_SERVICE_ACCOUNT_JSON env var to the full JSON string
        // from Firebase Console → Project Settings → Service Accounts.
        if (
            process.env.FIREBASE_SERVICE_ACCOUNT_JSON &&
            process.env.FIREBASE_SERVICE_ACCOUNT_JSON !== "PASTE_SERVICE_ACCOUNT_JSON_HERE"
        ) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
            adminApp = initializeApp({ credential: cert(serviceAccount) });
        } else {
            // Fallback: Application Default Credentials (works on GCP / Cloud Run / Vercel)
            adminApp = initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        }
    } catch (error) {
        console.error("[Agency OS] Firebase Admin Initialization Error:", error);
        adminApp = getApps()[0];
    }
} else {
    adminApp = getApps()[0];
}

const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { adminApp, adminDb, adminAuth };
