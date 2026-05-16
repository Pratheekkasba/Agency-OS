import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

type Tone = "professional" | "friendly" | "casual";

function parseJsonFromModel(text: string): { done: string[]; inProgress: string[]; next: string[] } {
  let jsonStr = text.trim();
  if (jsonStr.includes("```json")) {
    jsonStr = jsonStr.split("```json")[1].split("```")[0];
  } else if (jsonStr.includes("```")) {
    jsonStr = jsonStr.split("```")[1].split("```")[0];
  }
  const parsed = JSON.parse(jsonStr.trim()) as {
    done?: string[];
    inProgress?: string[];
    next?: string[];
  };
  const toLines = (arr: unknown): string[] =>
    Array.isArray(arr)
      ? arr.map((s) => String(s).trim()).filter(Boolean)
      : [];
  return {
    done: toLines(parsed.done),
    inProgress: toLines(parsed.inProgress),
    next: toLines(parsed.next),
  };
}

/**
 * POST /api/updates/generate
 * Body: { idToken, clientId, tone?, existingDone?, existingInProgress?, existingNext? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      idToken,
      clientId,
      tone = "professional",
      existingDone = "",
      existingInProgress = "",
      existingNext = "",
    } = body;

    if (!idToken || !clientId) {
      return NextResponse.json(
        { error: "Missing idToken or clientId" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI generation is not configured (GEMINI_API_KEY missing)." },
        { status: 503 }
      );
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const userSnap = await adminDb.collection("users").doc(uid).get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 403 });
    }

    const user = userSnap.data()!;
    if (user.role === "client") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const organization_id = user.organization_id as string | undefined;
    if (!organization_id) {
      return NextResponse.json({ error: "No organization on user profile" }, { status: 403 });
    }

    const clientSnap = await adminDb.collection("clients").doc(clientId).get();
    if (!clientSnap.exists) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const client = clientSnap.data()!;
    if (client.organization_id !== organization_id || client.is_deleted === true) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [tasksSnap, projectsSnap] = await Promise.all([
      adminDb
        .collection("tasks")
        .where("organization_id", "==", organization_id)
        .where("clientId", "==", clientId)
        .get(),
      adminDb
        .collection("projects")
        .where("organization_id", "==", organization_id)
        .where("clientId", "==", clientId)
        .get(),
    ]);

    const tasks = tasksSnap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown>))
      .filter((t) => t.is_deleted !== true);

    const projects = projectsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown>))
      .filter((p) => p.is_deleted !== true);

    const taskSummary = tasks.map((t) => ({
      title: t.title ?? "Untitled",
      status: t.status ?? "todo",
      description: t.description ?? "",
      dueDate: t.dueDate ?? null,
    }));

    const projectSummary = projects.map((p) => ({
      name: p.name ?? "Project",
      status: p.status ?? "active",
      progress: p.progress ?? 0,
      description: p.description ?? p.projectDescription ?? "",
      deadline: p.deadline ?? p.dueDate ?? null,
    }));

    const toneGuide: Record<Tone, string> = {
      professional: "Use clear, formal bullet points suitable for a B2B client email.",
      friendly: "Use warm, approachable language while staying professional.",
      casual: "Use concise, relaxed phrasing — still client-appropriate.",
    };

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an agency account manager drafting a weekly client status update.

Client: ${client.name ?? "Client"}
Company: ${client.companyName ?? "N/A"}
Project name: ${client.projectName ?? "N/A"}
Client status: ${client.status ?? "Active"}
Progress: ${client.progress ?? 0}%
Project description: ${client.projectDescription ?? "N/A"}

Projects (JSON):
${JSON.stringify(projectSummary, null, 2)}

Tasks (JSON):
${JSON.stringify(taskSummary, null, 2)}

Agency member draft notes (may be empty):
- Done: ${existingDone || "(none)"}
- In progress: ${existingInProgress || "(none)"}
- Next: ${existingNext || "(none)"}

Tone: ${tone}. ${toneGuide[tone as Tone] ?? toneGuide.professional}

Generate a structured weekly update. Return ONLY valid JSON with exactly these keys:
{
  "done": ["bullet 1", "bullet 2"],
  "inProgress": ["bullet 1"],
  "next": ["bullet 1"]
}

Rules:
- Each value is an array of short bullet strings (no markdown).
- Use real task/project data when available; infer sensible items if data is sparse.
- Merge and improve any draft notes provided; do not duplicate blindly.
- 1–4 bullets per section; empty array only if truly nothing applies.
- Do not include greetings or sign-offs — only the three sections.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const sections = parseJsonFromModel(responseText);

    return NextResponse.json({
      done: sections.done,
      inProgress: sections.inProgress,
      next: sections.next,
    });
  } catch (error: unknown) {
    console.error("[updates/generate]", error);
    return NextResponse.json(
      { error: "Failed to generate update. Try again or edit manually." },
      { status: 500 }
    );
  }
}
