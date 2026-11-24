// Shared Postgres connection resolver. Plain JS (no build step) so it can be
// imported both from TypeScript (lib/db.ts) and from standalone `node`
// scripts (scripts/db-migrate.mjs, scripts/db-seed.mjs) that run outside
// Next's module graph.
//
// Managed Postgres (Vercel Postgres, Neon, Supabase, RDS…) terminates TLS
// with a certificate chain Node does not bundle, so verification has to be
// relaxed for anything that is not a plain local socket — a local dev
// container speaks no TLS at all. `sslmode=require` in an injected URL is
// parsed by pg-connection-string 2.x as full verification and would SILENTLY
// override an explicit `ssl` option passed alongside `connectionString`, so
// any sslmode/ssl query param must be stripped from the URL first and TLS
// driven purely by the explicit `ssl` object below. (Verified empirically
// against `pg`'s ConnectionParameters merge behaviour.)

// node-postgres parses the Postgres `date` type into a JS Date object by
// default, which silently shifts by the server's local timezone when later
// formatted — a classic footgun for date-only columns (published_at,
// starts_at/ends_at, statistics.updated_at). Return the raw "YYYY-MM-DD"
// string instead; every consumer already expects a plain date string.
import pg from "pg";
const PG_DATE_OID = 1082;
pg.types.setTypeParser(PG_DATE_OID, (value) => value);

function isLocalDatabase(connectionString) {
  return /@(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?[:/]/.test(connectionString);
}

function withoutSslParams(url) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("sslmode");
    parsed.searchParams.delete("ssl");
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * @param {{ preferDirect?: boolean }} [options]
 *   preferDirect: true picks the non-pooled URL first (DDL/migrations behave
 *   better outside a transaction-pooling proxy); false (default) prefers the
 *   pooled URL (safer for many short-lived serverless invocations at runtime).
 */
export function resolvePoolConfig(options = {}) {
  const { preferDirect = false } = options;
  const candidates = preferDirect
    ? [process.env.DATABASE_URL, process.env.POSTGRES_URL_NON_POOLING, process.env.POSTGRES_URL]
    : [process.env.DATABASE_URL, process.env.POSTGRES_URL, process.env.POSTGRES_URL_NON_POOLING];
  const connectionString = candidates.find((value) => value) || "";

  if (!connectionString) {
    throw new Error(
      "No Postgres connection string found. Set DATABASE_URL, or attach a Postgres store " +
        "to the Vercel project (injects POSTGRES_URL / POSTGRES_URL_NON_POOLING).",
    );
  }

  if (isLocalDatabase(connectionString)) {
    return { connectionString };
  }
  return { connectionString: withoutSslParams(connectionString), ssl: { rejectUnauthorized: false } };
}
