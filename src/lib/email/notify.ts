import { auth } from "@/lib/firebase/config";

/** Fire-and-forget client update notification (agency must be signed in). */
export async function notifyClientUpdateEmail(payload: {
  clientId: string;
  done: string[];
  inProgress: string[];
  next: string[];
  projectName?: string;
  progress?: number;
}): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  try {
    const idToken = await user.getIdToken();
    const res = await fetch("/api/email/client-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, ...payload }),
    });
    return res.ok;
  } catch (e) {
    console.error("[notify] client-update email", e);
    return false;
  }
}

export async function notifyClientInviteEmail(clientId: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  try {
    const idToken = await user.getIdToken();
    const res = await fetch("/api/email/client-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, clientId }),
    });
    return res.ok;
  } catch (e) {
    console.error("[notify] client-invite email", e);
    return false;
  }
}

/** One-time welcome for agency owners or clients (server tracks welcomeEmailSent). */
export async function sendWelcomeEmail(name?: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  try {
    await user.getIdToken(true);
    const idToken = await user.getIdToken();
    const res = await fetch("/api/email/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[notify] welcome email failed", data);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[notify] welcome email", e);
    return false;
  }
}

/** @deprecated Use sendWelcomeEmail */
export async function sendWelcomeAgencyEmail(name?: string): Promise<boolean> {
  return sendWelcomeEmail(name);
}
