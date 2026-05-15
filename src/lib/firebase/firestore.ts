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
  limit,
  serverTimestamp,
  writeBatch,
  QueryDocumentSnapshot,
  onSnapshot,
  orderBy,
  increment,
} from "firebase/firestore";
import { auth, db } from "./config";
import type {
  Client,
  Update,
  UserData,
  Project,
  Task,
  TeamMember,
  Message,
  MessageReply,
  ChatConversation,
  ChatMessage,
} from "@/types";

/** Firestore rejects `undefined` field values — omit them before every write */
function isFirestoreFieldValue(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof (value as { _methodName?: string })._methodName === "string"
  );
}

/** Prefer Firestore user doc, fall back to auth uid (agency owners use uid as org id) */
export function resolveOrganizationId(userData?: { organization_id?: string } | null): string | null {
  return userData?.organization_id ?? auth.currentUser?.uid ?? null;
}

function isNotDeleted(data: Record<string, unknown>): boolean {
  return data.is_deleted !== true;
}

function mapActiveDocs<T extends { id: string }>(docs: QueryDocumentSnapshot[]): T[] {
  return docs
    .map((d) => ({ id: d.id, ...d.data() }) as T)
    .filter((item) => isNotDeleted(item as unknown as Record<string, unknown>));
}

/** Sort by created_at or createdAt without requiring a Firestore composite index */
function timestampMs(value: unknown): number {
  if (!value) return 0;
  if (typeof (value as { toMillis?: () => number }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (typeof (value as { seconds?: number }).seconds === "number") {
    return (value as { seconds: number }).seconds * 1000;
  }
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(value as string).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

type SortableByTimestamp = {
  created_at?: unknown;
  createdAt?: unknown;
  receivedAt?: unknown;
};

function sortByNewest<T extends SortableByTimestamp>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aMs = timestampMs(a.created_at ?? a.createdAt ?? a.receivedAt);
    const bMs = timestampMs(b.created_at ?? b.createdAt ?? b.receivedAt);
    return bMs - aMs;
  });
}

export function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const result = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    if (value === null || typeof value !== "object" || isFirestoreFieldValue(value)) {
      result[key] = value;
      continue;
    }
    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        item !== null && typeof item === "object" && !isFirestoreFieldValue(item)
          ? stripUndefined(item as Record<string, unknown>)
          : item
      );
      continue;
    }
    result[key] = stripUndefined(value as Record<string, unknown>);
  }
  return result as T;
}

// --- Organizations ---
export async function createOrganization(name: string) {
  return addDoc(collection(db, "organizations"), {
    name,
    createdAt: serverTimestamp(),
  });
}

// --- Users ---

export async function setUserRole(
  uid: string,
  role: UserData["role"],
  organization_id: string | null,
  clientId?: string | null
) {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    stripUndefined({
      role,
      organization_id,
      ...(role === "client" ? { clientId: clientId ?? null } : {}),
    }),
    { merge: true }
  );
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

// --- Denormalization Sync Helper ---
/**
 * When a client's name changes, call this to sync the denormalized
 * `clientName` field across all related collections (projects, tasks, messages).
 *
 * Uses a batched write --- all updates are atomic (all succeed or all fail).
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
      where("clientId", "==", clientId)
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
      where("clientId", "==", clientId)
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
      where("clientId", "==", clientId)
    )
  );
  messagesSnap.docs.forEach((d) =>
    batch.update(d.ref, { clientName: newName })
  );

  await batch.commit();
}

// --- Clients ---

export async function addClient(
  organization_id: string,
  data: Omit<Client, "id" | "organization_id" | "created_at" | "updatedAt" | "is_deleted" | "deleted_at">
) {
  return addDoc(
    collection(db, "clients"),
    stripUndefined({
      ...data,
      organization_id,
      assigned_team: data.assigned_team ?? [],
      status: data.status ?? "Active",
      progress: data.progress ?? 0,
      is_deleted: false,
      created_at: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
}

export async function getClients(
  organization_id: string,
  pageSize = 50
): Promise<{ clients: Client[]; lastDoc: QueryDocumentSnapshot | null }> {
  const snap = await getDocs(
    query(collection(db, "clients"), where("organization_id", "==", organization_id))
  );
  const clients = sortByNewest(mapActiveDocs<Client>(snap.docs)).slice(0, pageSize);
  return { clients, lastDoc: null };
}

/** Convenience wrapper --- returns just the array (no pagination cursor) */
export async function getAllClients(organization_id: string): Promise<Client[]> {
  const { clients } = await getClients(organization_id, 500);
  return clients;
}

/** Real-time subscription to clients for an organization. */
export function subscribeToClients(
  organization_id: string,
  callback: (clients: Client[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, "clients"),
    where("organization_id", "==", organization_id)
  );
  return onSnapshot(
    q,
    (snap) => {
      const clients = sortByNewest(mapActiveDocs<Client>(snap.docs));
      callback(clients);
    },
    (error) => {
      console.error("[Firestore] Error subscribing to clients:", error);
      if (onError) onError(error);
    }
  );
}

export async function updateClient(clientId: string, data: Partial<Client>) {
  const ref = doc(db, "clients", clientId);
  await updateDoc(ref, stripUndefined({ ...data, updatedAt: serverTimestamp() }));

  if (data.progress !== undefined) {
    const snap = await getDoc(ref);
    const orgId = snap.data()?.organization_id as string | undefined;
    if (orgId) {
      const projects = await getProjectsByClient(orgId, clientId);
      await Promise.all(
        projects.map((p) => updateProject(p.id, { progress: data.progress }))
      );
    }
  }
}

/** Soft delete --- marks the client as deleted without removing the document */
export async function deleteClient(clientId: string) {
  const ref = doc(db, "clients", clientId);
  await updateDoc(ref, {
    is_deleted: true,
    deleted_at: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getClientByAccessId(accessId: string): Promise<Client | null> {
  const snap = await getDocs(
    query(collection(db, "clients"), where("accessId", "==", accessId), limit(1))
  );
  const clients = mapActiveDocs<Client>(snap.docs);
  return clients[0] ?? null;
}

// --- Projects ---

export async function addProject(
  organization_id: string,
  data: Omit<Project, "id" | "organization_id" | "createdAt" | "updatedAt" | "is_deleted" | "deleted_at">
) {
  return addDoc(
    collection(db, "projects"),
    stripUndefined({
      ...data,
      organization_id,
      progress: data.progress ?? 0,
      status: data.status ?? "active",
      milestones: data.milestones ?? [],
      teamMemberIds: data.teamMemberIds ?? [],
      is_deleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
}

export async function getProjects(
  organization_id: string,
  pageSize = 50
): Promise<{ projects: Project[]; lastDoc: QueryDocumentSnapshot | null }> {
  const snap = await getDocs(
    query(collection(db, "projects"), where("organization_id", "==", organization_id))
  );
  const projects = sortByNewest(mapActiveDocs<Project>(snap.docs)).slice(0, pageSize);
  return { projects, lastDoc: null };
}

/** Convenience wrapper --- returns just the array */
export async function getAllProjects(organization_id: string): Promise<Project[]> {
  const { projects } = await getProjects(organization_id, 500);
  return projects;
}

/** Real-time subscription to projects for an organization. */
export function subscribeToProjects(
  organization_id: string,
  callback: (projects: Project[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, "projects"),
    where("organization_id", "==", organization_id)
  );
  return onSnapshot(
    q,
    (snap) => {
      const projects = sortByNewest(mapActiveDocs<Project>(snap.docs));
      callback(projects);
    },
    (error) => {
      console.error("[Firestore] Error subscribing to projects:", error);
      if (onError) onError(error);
    }
  );
}

export async function getProjectsByClient(
  organization_id: string,
  clientId: string
): Promise<Project[]> {
  const snap = await getDocs(
    query(
      collection(db, "projects"),
      where("organization_id", "==", organization_id),
      where("clientId", "==", clientId)
    )
  );
  return sortByNewest(mapActiveDocs<Project>(snap.docs));
}

export async function updateProject(projectId: string, data: Partial<Project>) {
  const ref = doc(db, "projects", projectId);
  await updateDoc(ref, stripUndefined({ ...data, updatedAt: serverTimestamp() }));

  if (data.progress !== undefined) {
    const snap = await getDoc(ref);
    const clientId = snap.data()?.clientId as string | undefined;
    if (clientId) {
      const clientRef = doc(db, "clients", clientId);
      await updateDoc(
        clientRef,
        stripUndefined({ progress: data.progress, updatedAt: serverTimestamp() })
      );
    }
  }
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

// --- Tasks ---

export async function addTask(
  organization_id: string,
  data: Omit<Task, "id" | "organization_id" | "createdAt" | "updatedAt" | "is_deleted" | "deleted_at">
) {
  return addDoc(
    collection(db, "tasks"),
    stripUndefined({
      ...data,
      organization_id,
      status: data.status ?? "todo",
      priority: data.priority ?? "medium",
      is_deleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
}

export async function getTasks(
  organization_id: string,
  pageSize = 100
): Promise<{ tasks: Task[]; lastDoc: QueryDocumentSnapshot | null }> {
  const snap = await getDocs(
    query(collection(db, "tasks"), where("organization_id", "==", organization_id))
  );
  const tasks = sortByNewest(mapActiveDocs<Task>(snap.docs)).slice(0, pageSize);
  return { tasks, lastDoc: null };
}

/** Convenience wrapper --- returns just the array */
export async function getAllTasks(organization_id: string): Promise<Task[]> {
  const { tasks } = await getTasks(organization_id, 500);
  return tasks;
}

/** Real-time subscription to tasks for an organization. */
export function subscribeToTasks(
  organization_id: string,
  callback: (tasks: Task[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, "tasks"),
    where("organization_id", "==", organization_id)
  );
  return onSnapshot(
    q,
    (snap) => {
      const tasks = sortByNewest(mapActiveDocs<Task>(snap.docs));
      callback(tasks);
    },
    (error) => {
      console.error("[Firestore] Error subscribing to tasks:", error);
      if (onError) onError(error);
    }
  );
}

export async function getTasksByProject(
  organization_id: string,
  projectId: string
): Promise<Task[]> {
  const snap = await getDocs(
    query(
      collection(db, "tasks"),
      where("organization_id", "==", organization_id),
      where("projectId", "==", projectId)
    )
  );
  return sortByNewest(mapActiveDocs<Task>(snap.docs));
}

export async function getTasksByClient(
  organization_id: string,
  clientId: string
): Promise<Task[]> {
  const snap = await getDocs(
    query(
      collection(db, "tasks"),
      where("organization_id", "==", organization_id),
      where("clientId", "==", clientId)
    )
  );
  return sortByNewest(mapActiveDocs<Task>(snap.docs));
}

export async function updateTask(taskId: string, data: Partial<Task>) {
  const ref = doc(db, "tasks", taskId);
  await updateDoc(ref, stripUndefined({ ...data, updatedAt: serverTimestamp() }));
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

// --- Team Members ---

export async function getTeamMembers(organization_id: string): Promise<TeamMember[]> {
  const q = query(
    collection(db, "users"),
    where("organization_id", "==", organization_id)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember));
}

/** Real-time subscription to team members (users in the same organization). */
export function subscribeToTeamMembers(
  organization_id: string,
  callback: (members: TeamMember[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, "users"),
    where("organization_id", "==", organization_id)
  );
  return onSnapshot(
    q,
    (snap) => {
      const members = snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember));
      callback(members);
    },
    (error) => {
      console.error("[Firestore] Error subscribing to team members:", error);
      if (onError) onError(error);
    }
  );
}

export async function updateTeamMember(userId: string, data: Partial<TeamMember>) {
  const ref = doc(db, "users", userId);
  await updateDoc(ref, stripUndefined(data as Record<string, unknown>));
}

// --- Messages ---

export async function addMessage(
  organization_id: string,
  data: Omit<Message, "id" | "organization_id" | "receivedAt" | "is_deleted" | "deleted_at">
) {
  return addDoc(
    collection(db, "messages"),
    stripUndefined({
      ...data,
      organization_id,
      status: data.status ?? "new",
      is_deleted: false,
      receivedAt: serverTimestamp(),
    })
  );
}

export async function getMessages(
  organization_id: string,
  pageSize = 50
): Promise<{ messages: Message[]; lastDoc: QueryDocumentSnapshot | null }> {
  const snap = await getDocs(
    query(collection(db, "messages"), where("organization_id", "==", organization_id))
  );
  const messages = sortByNewest(mapActiveDocs<Message>(snap.docs)).slice(0, pageSize);
  return { messages, lastDoc: null };
}

/** Convenience wrapper --- returns just the array */
export async function getAllMessages(organization_id: string): Promise<Message[]> {
  const { messages } = await getMessages(organization_id, 200);
  return messages;
}

export async function updateMessage(messageId: string, data: Partial<Message>) {
  const ref = doc(db, "messages", messageId);
  await updateDoc(ref, stripUndefined(data as Record<string, unknown>));
}

/** Soft delete */
export async function deleteMessage(messageId: string) {
  const ref = doc(db, "messages", messageId);
  await updateDoc(ref, {
    is_deleted: true,
    deleted_at: serverTimestamp(),
  });
}

// --- Updates ---

export async function addUpdate(data: Omit<Update, "id" | "createdAt" | "updatedAt">) {
  const updateRef = await addDoc(
    collection(db, "updates"),
    stripUndefined({
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );

  const clientRef = doc(db, "clients", data.clientId);
  const headline =
    data.inProgress?.[0] || data.done?.[0] || data.next?.[0] || "Update posted";
  await updateDoc(
    clientRef,
    stripUndefined({
      lastUpdateDate: serverTimestamp(),
      lastUpdateText: headline,
      updatedAt: serverTimestamp(),
    })
  );

  return updateRef;
}

export async function getUpdates(
  organization_id: string,
  clientId?: string,
  maxResults = 20
): Promise<Update[]> {
  const constraints: Parameters<typeof query>[1][] = [
    where("organization_id", "==", organization_id),
  ];
  if (clientId) constraints.push(where("clientId", "==", clientId));

  const snap = await getDocs(query(collection(db, "updates"), ...constraints));
  return sortByNewest(
    snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Update)
  ).slice(0, maxResults);
}

// --- Chat ---

/**
 * Returns the deterministic chat ID for an org+client pair,
 * creating the conversation doc if it doesn't exist yet.
 */
export async function getOrCreateChat(
  organization_id: string,
  clientId: string,
  clientName: string
): Promise<string> {
  const chatId = `${organization_id}_${clientId}`;
  const ref = doc(db, "chats", chatId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(
      ref,
      stripUndefined({
        organization_id,
        clientId,
        clientName,
        lastMessage: null,
        lastMessageAt: null,
        unreadAgency: 0,
        unreadClient: 0,
        createdAt: serverTimestamp(),
      })
    );
  }
  return chatId;
}

/** Real-time subscription to all conversations for an org (sorted newest-first client-side). */
export function subscribeToConversations(
  organization_id: string,
  callback: (convs: ChatConversation[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, "chats"),
    where("organization_id", "==", organization_id)
  );
  return onSnapshot(
    q,
    (snap) => {
      const convs = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as ChatConversation)
        .sort((a, b) => {
          const aMs = timestampMs(a.lastMessageAt ?? a.createdAt);
          const bMs = timestampMs(b.lastMessageAt ?? b.createdAt);
          return bMs - aMs;
        });
      callback(convs);
    },
    (error) => {
      console.error("[Firestore] Error subscribing to conversations:", error);
      if (onError) onError(error);
    }
  );
}

/** Real-time subscription to messages inside a single chat thread (ordered oldest-first). */
export function subscribeToChatMessages(
  organization_id: string,
  chatId: string,
  callback: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    where("organization_id", "==", organization_id),
    orderBy("sentAt", "asc")
  );
  return onSnapshot(
    q,
    (snap) => {
      const messages = mapActiveDocs<ChatMessage>(snap.docs as QueryDocumentSnapshot[]);
      callback(messages);
    },
    (error) => {
      console.error(`[Firestore] Error subscribing to messages for chat ${chatId}:`, error);
      if (onError) onError(error);
    }
  );
}

/**
 * Append a message to a chat thread and update the conversation metadata.
 * `senderRole` = "agency" for agency staff, "client" for client users.
 */
export async function sendChatMessage(
  chatId: string,
  organization_id: string,
  text: string,
  senderRole: "agency" | "client",
  senderName: string
): Promise<void> {
  // Write the message document
  await addDoc(collection(db, "chats", chatId, "messages"), {
    organization_id,
    chatId,
    text: text.trim(),
    senderRole,
    senderName,
    sentAt: serverTimestamp(),
  });

  // Update conversation metadata + increment the OTHER side's unread count
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text.trim(),
    lastMessageAt: serverTimestamp(),
    ...(senderRole === "agency"
      ? { unreadClient: increment(1) }
      : { unreadAgency: increment(1) }),
  });
}

/** Reset the agency's unread counter for a conversation (call when they open the thread). */
export async function markChatReadByAgency(chatId: string): Promise<void> {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, { unreadAgency: 0 });
}

/**
 * Real-time subscription to external/webhook messages (Triage Board).
 */
export function subscribeToMessages(
  organization_id: string,
  callback: (messages: Message[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, "messages"),
    where("organization_id", "==", organization_id)
  );
  return onSnapshot(
    q,
    (snap) => {
      const messages = mapActiveDocs<Message>(snap.docs);
      callback(sortByNewest(messages));
    },
    (error) => {
      console.error("[Firestore] Error subscribing to triage messages:", error);
      if (onError) onError(error);
    }
  );
}
