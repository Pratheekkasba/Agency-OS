import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

// Legacy type — kept inline for backward compat with webhook ingestion
interface WebhookMessage {
    id: string;
    sender: string;
    content: string;
    intent?: string;
    draftResponse?: string;
    createdAt: string;
    status: "pending_review" | "approved" | "sent";
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic validation
        if (!body.sender || !body.content) {
            return NextResponse.json(
                { error: "Missing required fields: 'sender' and 'content'" },
                { status: 400 }
            );
        }

        const messageRef = adminDb.collection("messages").doc();

        // In a full implementation, AI triage would happen here before saving,
        // or triggered via Firebase Cloud Functions upon create. 
        // Here we store it for human review.
        const message: WebhookMessage = {
            id: messageRef.id,
            sender: body.sender,
            content: body.content,
            intent: body.intent || "unknown", // Optional payload from AI webhook
            draftResponse: body.draftResponse || "", // Optional payload
            createdAt: new Date().toISOString(),
            status: "pending_review",
        };

        await messageRef.set(message);

        return NextResponse.json(
            { success: true, messageId: message.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json(
            { error: "Internal server error processing webhook." },
            { status: 500 }
        );
    }
}
