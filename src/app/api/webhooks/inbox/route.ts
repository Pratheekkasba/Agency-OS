import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * PHASE 2 PLACEHOLDER
 * Dispatch approved AI drafts to clients via Nodemailer
 */
export async function dispatchApprovedDraft(clientEmail: string, subject: string, body: string) {
    // This will be wired up to the UI "Approve & Send" button
    console.log(`[Inbox Dispatcher] Preparing to send email to ${clientEmail}`);
    return sendEmail({
        to: clientEmail,
        subject,
        html: body,
    });
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
    // ─── Security: verify shared webhook secret ───────────────────────────
    const incomingSecret = req.headers.get("x-webhook-secret");
    const expectedSecret = process.env.WEBHOOK_SECRET;

    if (!expectedSecret || incomingSecret !== expectedSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Support both old 'sender'/'content' format and new 'fromContact'/'body' format
        const fromContact = body.fromContact || body.sender;
        const messageBody = body.body || body.content;
        const fromName = body.fromName || "Unknown Client";
        const subject = body.subject || "New Message";
        const organization_id = body.organization_id || "mock-org-id"; // In production, webhooks would route to specific orgs
        const clientId = body.clientId || "mock-client-id";

        if (!fromContact || !messageBody) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        let intent = "general";
        let aiDraft = "";
        let confidenceScore = 0;

        // Run Gemini AI Triage
        if (process.env.GEMINI_API_KEY) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                
                const prompt = `
You are a senior agency owner and an expert communicator. You are receiving a message from a client.
Analyze the following message and provide a JSON response with three fields:
1. "intent": Classify the message into one of these exact strings: "question", "approval", "revision", "brief", "complaint", "general".
2. "draftResponse": A highly professional, warm, and clear draft reply from the agency to the client addressing their message. Do not include placeholder brackets, make it ready to send.
3. "confidenceScore": A number from 1 to 100 representing your confidence in the intent classification and the draft.

Client Name: ${fromName}
Subject: ${subject}
Message Body:
"${messageBody}"
`;

                const result = await model.generateContent(prompt);
                const responseText = result.response.text();
                
                // Extract JSON from markdown if present
                let jsonStr = responseText;
                if (responseText.includes("\`\`\`json")) {
                    jsonStr = responseText.split("\`\`\`json")[1].split("\`\`\`")[0];
                } else if (responseText.includes("\`\`\`")) {
                    jsonStr = responseText.split("\`\`\`")[1].split("\`\`\`")[0];
                }
                
                const aiResult = JSON.parse(jsonStr.trim());
                intent = aiResult.intent || "general";
                aiDraft = aiResult.draftResponse || "";
                confidenceScore = aiResult.confidenceScore || 0;
            } catch (aiError) {
                console.error("Gemini processing failed:", aiError);
                // Fallback will just use empty drafts
            }
        }

        const messageRef = adminDb.collection("messages").doc();

        // Save to Firestore with Phase 2B structure
        const messagePayload = {
            id: messageRef.id,
            organization_id,
            clientId,
            clientName: fromName, // denormalized
            channel: body.channel || "email",
            subject,
            fromName,
            fromContact,
            body: messageBody,
            intent,
            aiDraft,
            confidenceScore,
            status: "pending_approval",
            receivedAt: adminDb.collection("messages").firestore.FieldValue.serverTimestamp(),
            is_deleted: false,
        };

        await messageRef.set(messagePayload);

        return NextResponse.json(
            { success: true, messageId: messageRef.id, triage: { intent, confidenceScore } },
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
