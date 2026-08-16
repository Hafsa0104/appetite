"use client";

import { useEffect, useId, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/home/ProductCard";
import { categories } from "@/lib/data";
import {
  DIETARY_OPTIONS,
  SPICE_OPTIONS,
  BUDGET_OPTIONS,
  DEFAULT_CONSTRAINTS,
  LIMITS,
  type Constraints,
  type RecommendationResponse,
} from "@/lib/recommend/schema";

type Status = "idle" | "loading" | "success" | "error";

const CRAVING_EXAMPLES = [
  "Something warm, cheesy and filling",
  "Light and healthy, not too heavy",
  "Spicy and satisfying under $10",
];

// Human-friendly labels for the constraint <select>s.
const LABELS = {
  dietary: { any: "Any", vegetarian: "Vegetarian" } as Record<string, string>,
  spice: { any: "Any", mild: "Mild", spicy: "Spicy" } as Record<string, string>,
  budget: { any: "Any price", under10: "Under $10" } as Record<string, string>,
};

export default function RecommendForm() {
  const [craving, setCraving] = useState("");
  const [constraints, setConstraints] = useState<Constraints>(DEFAULT_CONSTRAINTS);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cravingRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const hintId = useId();
  const errorId = useId();

  const loading = status === "loading";

  // Move focus to the results/error region when a response arrives.
  useEffect(() => {
    if (status === "success" || status === "error") {
      resultsRef.current?.focus();
    }
  }, [status]);

  function setConstraint<K extends keyof Constraints>(key: K, value: Constraints[K]) {
    setConstraints((c) => ({ ...c, [key]: value }));
  }

  async function submit() {
    const trimmed = craving.trim();
    if (trimmed.length < LIMITS.minCravingLength) {
      setFieldError("Tell us what you're craving first.");
      cravingRef.current?.focus();
      return;
    }

    setFieldError(null);
    setErrorMsg(null);
    setStatus("loading");
    setResult(null);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ craving: trimmed, constraints }),
      });
      const data: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          data && typeof data === "object" && "error" in data
            ? String((data as { error: unknown }).error)
            : "Something went wrong. Please try again.";
        setErrorMsg(message);
        setStatus("error");
        return;
      }

      setResult(data as RecommendationResponse);
      setStatus("success");
    } catch {
      setErrorMsg("We couldn't reach our recommendation service. Please try again.");
      setStatus("error");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      {/* ---------- Form ---------- */}
      <form onSubmit={handleSubmit} aria-label="Dish recommender" noValidate>
        <fieldset disabled={loading} className="space-y-5 border-0 p-0">
          <div>
            <label htmlFor="craving" className="block text-sm font-medium text-ink">
              What are you craving?
            </label>
            <textarea
              id="craving"
              ref={cravingRef}
              value={craving}
              onChange={(e) => setCraving(e.target.value)}
              rows={3}
              maxLength={LIMITS.maxCravingLength}
              aria-describedby={`${hintId}${fieldError ? ` ${errorId}` : ""}`}
              aria-invalid={fieldError ? true : undefined}
              placeholder="e.g. warm, cheesy and filling, not too spicy"
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none disabled:opacity-60"
            />
            <p id={hintId} className="mt-1 text-xs text-muted">
              Describe a craving in your own words. We&apos;ll suggest dishes from the Appetite menu.
            </p>
            {fieldError && (
              <p id={errorId} className="mt-1 text-sm font-medium text-brand">
                {fieldError}
              </p>
            )}
          </div>

          {/* Example chips */}
          <div className="flex flex-wrap gap-2">
            {CRAVING_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setCraving(example)}
                className="rounded-full border border-line bg-cream px-3 py-1.5 text-xs text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-none"
              >
                {example}
              </button>
            ))}
          </div>

          {/* Constraints */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Dietary"
              value={constraints.dietary}
              onChange={(v) => setConstraint("dietary", v as Constraints["dietary"])}
              options={DIETARY_OPTIONS.map((v) => ({ value: v, label: LABELS.dietary[v] }))}
            />
            <SelectField
              label="Spice"
              value={constraints.spice}
              onChange={(v) => setConstraint("spice", v as Constraints["spice"])}
              options={SPICE_OPTIONS.map((v) => ({ value: v, label: LABELS.spice[v] }))}
            />
            <SelectField
              label="Budget"
              value={constraints.budget}
              onChange={(v) => setConstraint("budget", v as Constraints["budget"])}
              options={BUDGET_OPTIONS.map((v) => ({ value: v, label: LABELS.budget[v] }))}
            />
            <SelectField
              label="Category"
              value={constraints.category}
              onChange={(v) => setConstraint("category", v)}
              options={[
                { value: "any", label: "Any" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-auto">
            {loading ? "Analyzing your cravings…" : "Find dishes"}
          </Button>
        </fieldset>
      </form>

      {/* ---------- Results / status ---------- */}
      <div
        ref={resultsRef}
        tabIndex={-1}
        aria-live="polite"
        className="min-h-[8rem] focus:outline-none"
      >
        {status === "idle" && (
          <div className="flex h-full items-center rounded-2xl border border-dashed border-line bg-cream/60 p-6 text-sm text-muted">
            Tell us what you&apos;re in the mood for and your picks will appear here.
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-6">
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-brand-soft border-t-brand"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-ink">Analyzing your cravings…</p>
          </div>
        )}

        {status === "error" && (
          <div role="alert" className="rounded-2xl border border-brand-soft bg-brand-wash p-6">
            <p className="font-display text-lg font-semibold text-brand-dark">
              Couldn&apos;t get recommendations
            </p>
            <p className="mt-1 text-sm text-ink">{errorMsg}</p>
            <div className="mt-4">
              <Button type="button" variant="secondary" onClick={submit}>
                Try again
              </Button>
            </div>
          </div>
        )}

        {status === "success" && result && (
          <section aria-label="Your recommendations">
            {result.source === "fallback" && result.message && (
              <p
                role="status"
                className="mb-4 rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink"
              >
                {result.message}
              </p>
            )}

            {result.note && result.source === "ai" && (
              <p className="mb-4 text-sm text-muted">{result.note}</p>
            )}

            {result.items.length === 0 ? (
              <div className="rounded-2xl border border-line bg-white p-6 text-sm text-ink">
                We couldn&apos;t find a strong match. Try relaxing one of your preferences.
              </div>
            ) : (
              <>
                <h2 className="font-display mb-4 text-xl font-semibold text-ink">Your picks</h2>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {result.items.map((item) => (
                    <li key={item.product.id}>
                      <ProductCard product={item.product} />
                      <p className="mt-2 text-sm text-muted">
                        <span className="font-medium text-ink">Why:</span> {item.reason}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

/** Accessible labelled <select> used for each constraint. */
function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink focus:border-brand focus:outline-none disabled:opacity-60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}