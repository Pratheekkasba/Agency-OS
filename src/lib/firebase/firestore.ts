import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  writeBatch,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./config";
import type {
  Client,
  Update,
  UserData,
  Project,
  Task,
  TeamMember,
  Message,
  MessageReply,
} from "@/types";

// ─── Organizations ────────────────────────────────────────
export async function createOrganization(name: string) {
  return addDoc(collection(db, "organizations"), {
    name,
    createdAt: serverTimestamp(),
  });
}

// ─── Users ───────────────────────────────────────────────

export async function setUserRole(
  uid: string,
  role: UserData["role"],
  organization_id: string | null
) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { role, organization_id }, { merge: true });
}

export async function ensureUserDoc(
  uid: string,
  email?: string | null,
  name?: string | null
) {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      email: email ?? null,
      name: name ?? null,
      created_at: serverTimestamp(),
    },
    { merge: true }
  );
}

// ─── Denormalization Sync Helper ─────────────────────────
/**
 * When a client's name changes, call this to sync the denormalized
 * `clientName` field across all related collections (projects, tasks, messages).
 *
 * Uses a batched write — all updates are atomic (all succeed or all fail).
 */
export async function updateDenormalizedClientName(
  organization_id: string,
  clientId: string,
  newName: string
) {
  const batch = writeBatch(db);

  // Projects
  const projectsSnap = await getDocs(
    query(
      collection(db, "projects"),
      where("organization_id", "==", organization_id),
      where("clientId", "==", clientId),
      where("is_deleted", "!=", true)
    )
  );
  projectsSnap.docs.forEach((d) =>
    batch.update(d.ref, { clientName: newName, updatedAt: serverTimestamp() })
  );

  // Tasks
  const tasksSnap = await getDocs(
    query(
      collection(db, "tasks"),
      where("organization_id", "==", organization_id),
      where("clientId", "==", clientId),
      where("is_deleted", "!=", true)
    )
  );
  tasksSnap.docs.forEach((d) =>
    batch.update(d.ref, { clientName: newName, updatedAt: serverTimestamp() })
  );

  // Messages
  const messagesSnap = await getDocs(
    query(
      collection(db, "messages"),
      where("organization_id", "==", organization_id),
      where("clientId", "==", clientId),
      where("is_deleted", "!=", true)
    )
  );
  messagesSnap.docs.forEach((d) =>
    batch.update(d.ref, { clientName: newName })
  );

  await batch.commit();
}

// ─── Clients ─────────────────────────────────────────────

export async function addClient(
  organization_id: string,
  data: Omit<Client, "id" | "organization_id" | "created_at" | "updatedAt" | "is_deleted" | "deleted_at">
) {
  return addDoc(collection(db, "clients"), {
    ...data,
    organization_id,
    assigned_team: data.assigned_team ?? [],
    status: data.status ?? "Active",
    progress: data.progress ?? 0,
    is_deleted: false,
    created_at: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getClients(
  organization_id: string,
  pageSize = 50,
  cursor?: QueryDocumentSnapshot
): Promise<{ clients: Client[]; lastDoc: QueryDocumentSnapshot | null }> {
  const constraints: any[] = [
    where("organization_id", "==", organization_id),
    where("is_deleted", "!=", true),
    orderBy("is_deleted"),
    orderBy("created_at", "desc"),
    limit(pageSize),
  ];
  if (cursor) constraints.push(startAfter(cursor));

  const snap = await getDocs(query(collection(db, "clients"), ...constraints));
  const clients = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Client));
  const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
  return { clients, lastDoc };
}

/** Convenience wrapper — returns just the array (no pagination cursor) */
export async function getAllClients(organization_id: string): Promise<Client[]> {
  const { clients } = await getClients(organization_id, 500);
  return clients;
}

export async function updateClient(clientId: string, data: Partial<Client>) {
  const ref = doc(db, "clients", clientId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/** Soft delete — marks the client as deleted without removing the document */
export async function deleteClient(clientId: string) {
  const ref = doc(db, "clients", clientId);
  await updateDoc(ref, {
    is_deleted: true,
    deleted_at: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getClientByAccessId(accessId: string): Promise<Client | null> {
  const q = query(
    collection(db, "clients"),
    where("accessId", "==", accessId),
    where("is_deleted", "!=", true),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Client;
}

// ─── Projects ────────────────────────────────────────────

export async function addProject(
  organization_id: string,
  data: Omit<Project, "id" | "organization_id" | "createdAt" | "updatedAt" | "is_deleted" | "deleted_at">
) {
  return addDoc(collection(db, "projects"), {
    ...data,
    organization_id,
    progress: data.progress ?? 0,
    status: data.status ?? "active",
    milestones: data.milestones ?? [],
    teamMemberIds: data.teamMemberIds ?? [],
    is_deleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getProjects(
  organization_id: string,
  pageSize = 50,
  cursor?: QueryDocumentSnapshot
): Promise<{ projects: Project[]; lastDoc: QueryDocumentSnapshot | null }> {
  const constraints: any[] = [
    where("organization_id", "==", organization_id),
    where("is_deleted", "!=", true),
    orderBy("is_deleted"),
    orderBy("createdAt", "desc"),
    limit(pageSize),
  ];
  if (cursor) constraints.push(startAfter(cursor));

  const snap = await getDocs(query(collection(db, "projects"), ...constraints));
  const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
  const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
  return { projects, lastDoc };
}

/** Convenience wrapper — returns just the array */
export async function getAllProjects(organization_id: string): Promise<Project[]> {
  const { projects } = await getProjects(organization_id, 500);
  return projects;
}

export async function getProjectsByClient(
  organization_id: string,
  clientId: string
): Promise<Project[]> {
  const q = query(
    collection(db, "projects"),
    where("organization_id", "==", organization_id),
    where("clientId", "==", clientId),
    where("is_deleted", "!=", true),
    orderBy("is_deleted"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function updateProject(projectId: string, data: Partial<Project>) {
  const ref = doc(db, "projects", projectId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/** Soft delete */
export async function deleteProject(projectId: string) {
  const ref = doc(db, "projects", projectId);
  await updateDoc(ref, {
    is_deleted: true,
    deleted_at: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ─── Tasks ───────────────────────────────────────────────

export async function addTask(
  organization_id: string,
  data: Omit<Task, "id" | "organization_id" | "createdAt" | "updatedAt" | "is_deleted" | "deleted_at">
) {
  return addDoc(collection(db, "tasks"), {
    ...data,
    organization_id,
    status: data.status ?? "todo",
    priority: data.priority ?? "medium",
    is_deleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getTasks(
  organization_id: string,
  pageSize = 100,
  cursor?: QueryDocumentSnapshot
): Promise<{ tasks: Task[]; lastDoc: QueryDocumentSnapshot | null }> {
  const constraints: any[] = [
    where("organization_id", "==", organization_id),
    where("is_deleted", "!=", true),
    orderBy("is_deleted"),
    orderBy("createdAt", "desc"),
    limit(pageSize),
  ];
  if (cursor) constraints.push(startAfter(cursor));

  const snap = await getDocs(query(collection(db, "tasks"), ...constraints));
  const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
  const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
  return { tasks, lastDoc };
}

/** Convenience wrapper — returns just the array */
export async function getAllTasks(organization_id: string): Promise<Task[]> {
  const { tasks } = await getTasks(organization_id, 500);
  return tasks;
}

export async function getTasksByProject(
  organization_id: string,
  projectId: string
): Promise<Task[]> {
  const q = query(
    collection(db, "tasks"),
    where("organization_id", "==", organization_id),
    where("projectId", "==", projectId),
    where("is_deleted", "!=", true),
    orderBy("is_deleted"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
}

export async function getTasksByClient(
  organization_id: string,
  clientId: string
): Promise<Task[]> {
  const q = query(
    collection(db, "tasks"),
    where("organization_id", "==", organization_id),
    where("clientId", "==", clientId),
    where("is_deleted", "!=", true),
    orderBy("is_deleted"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
}

export async function updateTask(taskId: string, data: Partial<Task>) {
  const ref = doc(db, "tasks", taskId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/** Soft delete */
export async function deleteTask(taskId: string) {
  const ref = doc(db, "tasks", taskId);
  await updateDoc(ref, {
    is_deleted: true,
    deleted_at: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ─── Team Members ────────────────────────────────────────

export async function getTeamMembers(organization_id: string): Promise<TeamMember[]> {
  const q = query(
    collection(db, "users"),
    where("organization_id", "==", organization_id)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember));
}

export async function updateTeamMember(userId: string, data: Partial<TeamMember>) {
  const ref = doc(db, "users", userId);
  await updateDoc(ref, data);
}

// ─── Messages ────────────────────────────────────────────

export async function addMessage(
  organization_id: string,
  data: Omit<Message, "id" | "organization_id" | "receivedAt" | "is_deleted" | "deleted_at">
) {
  return addDoc(collection(db, "messages"), {
    ...data,
    organization_id,
    status: data.status ?? "new",
    is_deleted: false,
    receivedAt: serverTimestamp(),
  });
}

export async function getMessages(
  organization_id: string,
  pageSize = 50,
  cursor?: QueryDocumentSnapshot
): Promise<{ messages: Message[]; lastDoc: QueryDocumentSnapshot | null }> {
  const constraints: any[] = [
    where("organization_id", "==", organization_id),
    where("is_deleted", "!=", true),
    orderBy("is_deleted"),
    orderBy("receivedAt", "desc"),
    limit(pageSize),
  ];
  if (cursor) constraints.push(startAfter(cursor));

  const snap = await getDocs(query(collection(db, "messages"), ...constraints));
  const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message));
  const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
  return { messages, lastDoc };
}

/** Convenience wrapper — returns just the array */
export async function getAllMessages(organization_id: string): Promise<Message[]> {
  const { messages } = await getMessages(organization_id, 200);
  return messages;
}

export async function updateMessage(messageId: string, data: Partial<Message>) {
  const ref = doc(db, "messages", messageId);
  await updateDoc(ref, data);
}

/** Soft delete */
export async function deleteMessage(messageId: string) {
  const ref = doc(db, "messages", messageId);
  await updateDoc(ref, {
    is_deleted: true,
    deleted_at: serverTimestamp(),
  });
}

// ─── Updates ─────────────────────────────────────────────

export async function addUpdate(data: Omit<Update, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, "updates"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUpdates(
  organization_id: string,
  clientId?: string,
  maxResults = 20
): Promise<Update[]> {
  const constraints: any[] = [
    where("organization_id", "==", organization_id),
    orderBy("createdAt", "desc"),
    limit(maxResults),
  ];
  if (clientId) constraints.push(where("clientId", "==", clientId));

  const q = query(collection(db, "updates"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Update));
}
