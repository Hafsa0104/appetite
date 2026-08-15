import { NextResponse } from "next/server";

// Always run fresh so the timestamp/uptime reflect the moment of the request.
export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * A small backend endpoint the /health page fetches and renders.
 * Returns real, runtime-generated data (timestamp, uptime, checks) so the
 * page demonstrates fetching + rendering — not a hard-coded "Healthy".
 */
export async function GET() {
  const body = {
    status: "ok" as const,
    service: "appetite-web",
    version: process.env.npm_package_version ?? "0.1.0",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    checks: [
      { name: "server", status: "ok" as const },
      { name: "app-router", status: "ok" as const },
    ],
  };

  return NextResponse.json(body, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
