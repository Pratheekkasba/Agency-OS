export type TaskStatus = "done" | "approved" | "next";

export interface ProjectTask {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    createdAt: string;
}

export interface WebhookMessage {
    id: string;
    sender: string;
    content: string;
    intent?: string;
    draftResponse?: string;
    createdAt: string;
    status: "pending_review" | "approved" | "sent";
}
