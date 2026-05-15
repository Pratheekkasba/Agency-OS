import { NextRequest } from "next/server";
import { POST as welcomePost } from "../welcome/route";

/** @deprecated Use POST /api/email/welcome */
export async function POST(req: NextRequest) {
  return welcomePost(req);
}
