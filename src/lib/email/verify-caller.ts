import { adminAuth } from "@/lib/firebase/admin";
import type { DecodedIdToken } from "firebase-admin/auth";

export async function verifyAgencyCaller(idToken: string): Promise<DecodedIdToken> {
  if (!idToken) {
    throw new Error("Missing idToken");
  }
  const decoded = await adminAuth.verifyIdToken(idToken);
  if (decoded.role === "client") {
    throw new Error("Forbidden");
  }
  return decoded;
}

export function callerOrgId(decoded: DecodedIdToken): string | undefined {
  return (decoded.organization_id as string | undefined) || decoded.uid;
}
