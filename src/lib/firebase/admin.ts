import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let adminApp: App;

if (!getApps().length) {
    try {
        if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
            // Option 1: Individual variables (Most robust for Vercel)
            // Replace literal \n with actual newlines for the private key
            const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
            adminApp = initializeApp({
                credential: cert({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
            });
        } else if (
            process.env.FIREBASE_SERVICE_ACCOUNT_JSON &&
            process.env.FIREBASE_SERVICE_ACCOUNT_JSON !== "PASTE_SERVICE_ACCOUNT_JSON_HERE"
        ) {
            // Option 2: JSON String (Can sometimes be mangled by Vercel)
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
            adminApp = initializeApp({ credential: cert(serviceAccount) });
        } else {
            console.warn("[Agency OS] No service account credentials found. Falling back to Application Default Credentials.");
            // Option 3: Fallback ADC
            adminApp = initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        }
    } catch (error) {
        console.error("[Agency OS] Firebase Admin Initialization Error:", error);
        // Throwing the error directly will help us see exactly what is failing in the Vercel logs
        throw error; 
    }
} else {
    adminApp = getApps()[0];
}

const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { adminApp, adminDb, adminAuth };
