import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Appetite account.",
};

export default function SignupPage() {
  return (
    <Container className="flex justify-center py-14">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-muted">
          Sign up and get 20% off your first three orders.
        </p>

        <form className="mt-6 space-y-4" aria-label="Sign up form">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-1 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="h-11 w-full rounded-full bg-brand text-sm font-medium text-white hover:bg-brand-dark"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand hover:text-brand-dark">
            Log in
          </Link>
        </p>
      </div>
    </Container>
  );
}
