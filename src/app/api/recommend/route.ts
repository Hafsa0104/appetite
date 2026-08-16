import { NextResponse } from "next/server";
import {
  getRecommendations,
  validateInput,
  ValidationError,
} from "@/lib/recommend/service";

// Runs on the Node runtime (reads a server-only env var); always dynamic.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // 1. Parse body defensively.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { craving, constraints } = (body ?? {}) as Record<string, unknown>;

  // 2. Validate input -> 400 with a user-safe message on failure.
  let input: ReturnType<typeof validateInput>;
  try {
    input = validateInput(craving, constraints);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }

  // 3. getRecommendations never throws — it falls back internally. The guard
  //    is a last resort so an unexpected error still yields a safe response.
  try {
    const result = await getRecommendations(input.craving, input.constraints);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}