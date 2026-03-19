import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App;

if (!getApps().length) {
    // If we don't have a service account key provided via env vars,
    // we attempt to initialize with Application Default Credentials (ADC).
    // In development, if this fails, we can fall back to the project ID.
    try {
        adminApp = initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
    } catch (error) {
        console.error("Firebase Admin Initialization Error", error);
        adminApp = getApps()[0];
    }
} else {
    adminApp = getApps()[0];
}

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };
