import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import type { GetServerSideProps } from "next";
import { requirePageSession } from "@/lib/adminAuth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Already signed in? Skip the login screen.
  const session = await requirePageSession(context.req as never);
  if (session) {
    const next = typeof context.query.next === "string" ? context.query.next : "/admin";
    return { redirect: { destination: next, permanent: false } };
  }
  return { props: {} };
};

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error || "Could not sign in");
        return;
      }
      const next = typeof router.query.next === "string" ? router.query.next : "/admin";
      router.push(next);
    } catch {
      setError("Network error — try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Head>
        <title>Sign in | ARCP Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="mb-1 font-heading text-xl font-semibold text-ink">ARCP Admin</h1>
        <p className="mb-6 text-sm text-textSecondary">Sign in to manage the platform&apos;s content.</p>
        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-medium text-textPrimary">Email</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </label>
        <label className="mb-5 block text-sm">
          <span className="mb-1 block font-medium text-textPrimary">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </label>
        {error ? <p className="mb-4 text-sm text-warning">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-cta px-4 py-2 font-medium text-white transition-colors hover:bg-ctaHover disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
