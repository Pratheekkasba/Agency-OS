import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { Client, Update } from "@/types";

// ─── Users ───────────────────────────────────────────────

/** Create or update user profile (merge so we don't clobber existing fields). */
export async function setUserRole(
  uid: string,
  role: "agency" | "client",
  agencyId: string | null
) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { role, agencyId }, { merge: true });
}

/** Ensure user doc exists after first sign-in. */
export async function ensureUserDoc(
  uid: string,
  email?: string | null,
  displayName?: string | null
) {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      email: email ?? null,
      displayName: displayName ?? null,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// ─── Clients ─────────────────────────────────────────────

export async function addClient(
  agencyId: string,
  data: Omit<Client, "id" | "agencyId" | "createdAt">
) {
  return addDoc(collection(db, "clients"), {
    ...data,
    agencyId,
    status: data.status ?? "Active",
    progress: data.progress ?? 0,
    createdAt: serverTimestamp(),
  });
}

export async function getClients(agencyId: string): Promise<Client[]> {
  const q = query(
    collection(db, "clients"),
    where("agencyId", "==", agencyId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Client));
}

// ─── Updates ─────────────────────────────────────────────

export async function addUpdate(
  data: Omit<Update, "id" | "createdAt">
) {
  return addDoc(collection(db, "updates"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getUpdates(
  agencyId: string,
  clientId?: string,
  maxResults = 20
): Promise<Update[]> {
  const constraints: any[] = [
    where("agencyId", "==", agencyId),
  ];
  if (clientId) constraints.push(where("clientId", "==", clientId));
  constraints.push(limit(maxResults));

  const q = query(collection(db, "updates"), ...constraints);
  const snap = await getDocs(q);

  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Update));
  // Sort client-side to avoid composite index requirement for MVP
  results.sort(
    (a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
  );
  return results;
}
