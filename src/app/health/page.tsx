import type { Metadata } from "next";
import { headers } from "next/headers";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Health check",
  description: "Live service health for the Appetite web app.",
};

// This page reads the incoming request headers, so it renders dynamically.
export const dynamic = "force-dynamic";

type HealthData = {
  status: string;
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  checks: { name: string; status: string }[];
};

/** Build an absolute URL to our own API from the incoming request. */
async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function getHealth(): Promise<
  { ok: true; data: HealthData } | { ok: false; error: string }
> {
  try {
    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/health`, { cache: "no-store" });
    if (!res.ok) {
      return { ok: false, error: `Endpoint returned ${res.status}` };
    }
    const data = (await res.json()) as HealthData;
    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to reach /api/health",
    };
  }
}

export default async function HealthPage() {
  const result = await getHealth();

  return (
    <>
      <PageHeader
        title="Health check"
        subtitle="This page fetches /api/health at request time and renders the response."
      />
      <Container className="py-10">
        {result.ok ? (
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-3 w-3 rounded-full bg-green-500"
                aria-hidden="true"
              />
              <p className="font-display text-lg font-semibold text-ink">
                Service is {result.data.status.toUpperCase()}
              </p>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["Service", result.data.service],
                ["Version", result.data.version],
                ["Environment", result.data.environment],
                ["Uptime", `${result.data.uptimeSeconds}s`],
                ["Checked at", new Date(result.data.timestamp).toLocaleString()],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-line bg-white p-4"
                >
                  <dt className="text-xs tracking-wide text-muted uppercase">
                    {label}
                  </dt>
                  <dd className="mt-1 font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <h2 className="font-display mb-2 text-base font-semibold text-ink">
                Checks
              </h2>
              <ul className="space-y-2">
                {result.data.checks.map((check) => (
                  <li
                    key={check.name}
                    className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3"
                  >
                    <span className="text-sm text-ink">{check.name}</span>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
                      <span
                        className="h-2 w-2 rounded-full bg-green-500"
                        aria-hidden="true"
                      />
                      {check.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Raw payload, for transparency that data is genuinely fetched */}
            <details className="rounded-2xl border border-line bg-cream p-4">
              <summary className="cursor-pointer text-sm font-medium text-ink">
                Raw response
              </summary>
              <pre className="mt-3 overflow-x-auto text-xs text-muted">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <div
            role="alert"
            className="max-w-2xl rounded-2xl border border-brand-soft bg-brand-wash p-6"
          >
            <p className="font-display text-lg font-semibold text-brand-dark">
              Health check failed
            </p>
            <p className="mt-1 text-sm text-ink">{result.error}</p>
          </div>
        )}
      </Container>
    </>
  );
}
