// ─── User ────────────────────────────────────────────────
export interface UserData {
  role?: "agency" | "client";
  agencyId?: string;
  email?: string;
  displayName?: string;
  createdAt?: any; // Firestore Timestamp
}

// ─── Client ──────────────────────────────────────────────
export interface Client {
  id: string;
  name: string;
  projectName?: string;
  accessId?: string;
  contactName?: string;
  contactEmail?: string;
  projectType?: "Retainer" | "One-off" | "Consulting";
  status?: "Active" | "Review" | "Paused" | "Completed";
  progress?: number;
  nextStep?: string;
  due?: string;
  agencyId: string;
  createdAt?: any;
}

// ─── Update ──────────────────────────────────────────────
export interface Update {
  id: string;
  agencyId: string;
  clientId: string;
  done: string[];
  inProgress: string[];
  next: string[];
  generatedMessage?: string;
  createdAt?: any;
}
