import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Guard: only initialize when the API key is present.
// During Next.js SSR/static build on deployment platforms (e.g. Vercel),
// NEXT_PUBLIC_ vars may be undefined if they weren't set in the platform's
// environment settings. Without this guard, Firebase throws auth/invalid-api-key
// and kills the build at the /_not-found page export step.
function initFirebase(): FirebaseApp {
    if (!firebaseConfig.apiKey) {
        // Means env vars aren't set — return existing app if any, else throw clearly.
        if (getApps().length > 0) return getApp();
        throw new Error(
            "[Agency OS] Firebase API key is missing. " +
            "Set NEXT_PUBLIC_FIREBASE_API_KEY in your environment (.env.local locally, " +
            "or in your deployment platform's environment variables)."
        );
    }
    return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

const app: FirebaseApp = initFirebase();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
