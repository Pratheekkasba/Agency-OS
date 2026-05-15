import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { dispatchApprovedDraft } from "../webhooks/inbox/route";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messageId, draftText, clientEmail, subject } = body;

        if (!messageId || !draftText || !clientEmail || !subject) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Dispatch the email
        const sent = await dispatchApprovedDraft(clientEmail, subject, draftText);

        if (!sent) {
            return NextResponse.json(
                { error: "Failed to send email" },
                { status: 500 }
            );
        }

        // 2. Update Firestore status
        const messageRef = adminDb.collection("messages").doc(messageId);
        await messageRef.update({
            status: "sent",
            aiDraft: draftText, // Save the final modified draft
            resolvedAt: adminDb.collection("messages").firestore.FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.error("Message approval error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
