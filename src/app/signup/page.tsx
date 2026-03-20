"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import LoginForm from "@/components/ui/login-form";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || loading) return;

    setLoading(true);
    setError(null);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user && name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }

      // Save user to Firestore
      const userRef = doc(db, "users", cred.user.uid);
      await setDoc(userRef, {
        name: name.trim(),
        email: email,
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error("[Signup] Firebase error code:", err?.code);
      console.error("[Signup] Firebase error message:", err?.message);
      const code = err?.code ?? "";
      let message = `Unable to create your account (${code || "unknown error"}). Check browser console for details.`;
      if (code === "auth/email-already-in-use") {
        message = "An account with this email already exists.";
      } else if (code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (code === "auth/operation-not-allowed") {
        message = "Email/Password sign-in is not enabled. Enable it in Firebase console → Authentication → Sign-in method.";
      } else if (code === "auth/configuration-not-found") {
        message = "Firebase Auth is not configured correctly. Check Firebase console.";
      } else if (code === "auth/network-request-failed") {
        message = "Network error. Check your internet connection.";
      }
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
      setError("Google sign in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <LoginForm
      heading="Welcome!"
      subheading="Let's get you set up to continue"
      buttonText="Create Account"
      signupText=""
      signupLinkText="Already have an account? Sign in"
      signupUrl="/login"
      showNameField={true}
      nameValue={name}
      onNameChange={setName}
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

