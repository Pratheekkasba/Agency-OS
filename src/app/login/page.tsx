"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import LoginForm from "@/components/ui/login-form";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError(null);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      
      // Make sure the user exists in Firestore
      const userRef = doc(db, "users", cred.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: cred.user.displayName || "Unknown",
          email: cred.user.email,
          createdAt: serverTimestamp(),
        });
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error("[Login] Firebase error code:", err?.code);
      console.error("[Login] Firebase error message:", err?.message);
      const code = err?.code ?? "";
      const message =
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
          ? "Invalid email or password."
          : code === "auth/too-many-requests"
          ? "Too many attempts. Please wait a few minutes and try again."
          : code === "auth/user-disabled"
          ? "This account has been disabled."
          : code === "auth/network-request-failed"
          ? "Network error. Check your internet connection."
          : code === "auth/configuration-not-found"
          ? "Firebase Auth is not enabled for this project. Enable Email/Password in the Firebase console."
          : code === "auth/operation-not-allowed"
          ? "Email/Password sign-in is not enabled. Enable it in Firebase console → Authentication → Sign-in method."
          : `Sign in failed (${code || "unknown error"}). Check browser console for details.`;
      setError(message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      
      const userRef = doc(db, "users", cred.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: cred.user.displayName || "Unknown",
          email: cred.user.email,
          createdAt: serverTimestamp(),
        });
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(`Google sign in failed: ${err?.code || err?.message || "Unknown error"}`);
      setLoading(false);
    }
  };

  return (
    <LoginForm
      heading="Welcome back!"
      subheading="Please sign in to continue"
      buttonText="Login"
      signupText=""
      signupLinkText="Create an account"
      signupUrl="/signup"
      emailValue={email}
      onEmailChange={setEmail}
      passwordValue={password}
      onPasswordChange={setPassword}
      isLoading={loading}
      error={error}
      onSubmit={handleSubmit}
      onGoogleSignIn={handleGoogleSignIn}
    />
  );
}
