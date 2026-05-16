// --- Organization ---
export interface Organization {
  id: string;
  name: string;
  createdAt?: any;
}

// --- User ---
export interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: "owner" | "admin" | "member" | "client";
  /** Single source of truth for org membership. Replaces the old `agencyId` alias. */
  organization_id?: string;
  /** Display name for the agency workspace (sidebar header) */
  agencyName?: string;
  /** Set when role is client — links user to one clients/{id} document */
  clientId?: string;
  welcomeEmailSent?: boolean;
  welcomeShownInApp?: boolean;
  created_at?: any;
  // Soft-delete support
  is_deleted?: boolean;
  deleted_at?: any;
}

// --- Client ---
export interface Client {
  id: string;
  name: string;
  email: string;
  organization_id: string;
  assigned_team: string[];
  created_at?: any;
  updatedAt?: any;
  // Soft-delete
  is_deleted?: boolean;
  deleted_at?: any;
  // Portal access
  accessId?: string;
  // Status
  status?: "Active" | "Review" | "Paused" | "Completed";
  progress?: number;
  // Denormalized cache from latest Project --- kept for fast list rendering.
  // These are read-only snapshots; source of truth lives in `projects` collection.
  lastUpdateDate?: string;
  lastUpdateText?: string;
  // Additional CRM fields
  phone?: string;
  companyName?: string;
  clientType?: string;
  contactMethod?: string;
  projectName?: string;
  nextStep?: string;
  updateFrequency?: string;
  updateFormat?: string;
  anxietyLevel?: string;
  internalNotes?: string;
  projectDescription?: string;
}

// --- Project ---
export interface Project {
  id: string;
  organization_id: string;
  clientId: string;
  clientName?: string; // denormalized --- update via updateDenormalizedClientName()
  name: string;
  type: "website" | "app" | "brand" | "campaign" | "other";
  status: "active" | "paused" | "completed" | "archived";
  progress: number; // 0–100
  milestones: Milestone[];
  teamMemberIds: string[];
  description?: string;
  startDate?: string;
  dueDate?: string;
  deadline?: string;
  budget?: string;
  createdAt?: any;
  updatedAt?: any;
  // Soft-delete
  is_deleted?: boolean;
  deleted_at?: any;
}

export interface Milestone {
  id: string;
  name: string;
  completed: boolean;
  completedAt?: string;
  order: number;
}

// --- Task ---
export type TaskStatus = "todo" | "inprogress" | "review" | "done";
export type TaskPriority = "urgent" | "medium" | "low";

export interface Task {
  id: string;
  organization_id: string;
  projectId?: string;
  projectName?: string; // denormalized --- update via updateDenormalizedClientName()
  clientId?: string;
  clientName?: string; // denormalized --- update via updateDenormalizedClientName()
  title: string;
  description?: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  completedAt?: any;
  deliverableUrl?: string;
  order?: number;
  createdAt?: any;
  updatedAt?: any;
  // Soft-delete
  is_deleted?: boolean;
  deleted_at?: any;
}

// --- Team Member ---
export type TeamRole = "owner" | "admin" | "designer" | "developer" | "pm" | "strategist" | "member";

export interface TeamMember {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatarUrl?: string;
  status: "active" | "invited" | "inactive";
  activeTaskCount?: number;
  completedCount?: number;
  tags?: string[];
  joinedAt?: any;
  invitedAt?: any;
}

// --- Message ---
export type MessageChannel = "email" | "whatsapp" | "instagram" | "portal" | "internal";
export type MessageIntent = "question" | "approval" | "revision" | "brief" | "complaint" | "general";
export type MessageStatus = "new" | "pending_approval" | "assigned" | "draft_ready" | "sent" | "resolved" | "archived";

export interface Message {
  id: string;
  organization_id: string;
  clientId: string;
  clientName?: string; // denormalized --- update via updateDenormalizedClientName()
  channel: MessageChannel;
  subject?: string;
  fromName: string;
  fromContact: string;
  body: string;
  intent?: MessageIntent;
  aiDraft?: string;
  confidenceScore?: number;
  status: MessageStatus;
  assigneeId?: string;
  assigneeName?: string;
  receivedAt?: any;
  resolvedAt?: any;
  replies?: MessageReply[];
  // Soft-delete
  is_deleted?: boolean;
  deleted_at?: any;
}

export interface MessageReply {
  id: string;
  body: string;
  fromAgency: boolean;
  senderName: string;
  sentAt: any;
}

// --- Whiteboard ---
export interface Whiteboard {
  id: string;
  name: string;
  type: "global" | "internal" | "client";
  organization_id: string;
  client_id: string | null;
  project_id?: string | null;
  data: {
    elements?: any[];
    appState?: any;
    files?: any;
    version?: number;
  };
  updated_at?: any;
  created_by?: string;
  // Soft-delete
  is_deleted?: boolean;
  deleted_at?: any;
}

// --- Update ---
export interface Update {
  id: string;
  organization_id: string;
  clientId: string;
  done: string[];
  inProgress: string[];
  next: string[];
  generatedMessage?: string;
  createdAt?: any;
  updatedAt?: any;
}

// --- Chat ---

/** One conversation thread between agency and a client. ID = "{orgId}_{clientId}" */
export interface ChatConversation {
  id: string;
  organization_id: string;
  clientId: string;
  clientName: string;
  lastMessage?: string;
  lastMessageAt?: any;
  /** Agency-side unread count (incremented when client sends). */
  unreadAgency: number;
  /** Client-side unread count (incremented when agency sends). */
  unreadClient: number;
  createdAt?: any;
}

/** A single chat bubble inside chats/{chatId}/messages */
export interface ChatMessage {
  id: string;
  /** Denormalized for Firestore security rules. */
  organization_id: string;
  chatId: string;
  text: string;
  senderRole: "agency" | "client";
  senderName: string;
  sentAt: any;
}

