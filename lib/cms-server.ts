import { query } from "@/lib/db";

const ALLOWED_TABLES = new Set(["contact_requests", "membership_requests", "newsletter_subscriptions"]);

/**
 * Inserts one row into a public-form inbox table. `fields` must be an
 * explicit, hardcoded object built field-by-field at the call site (every
 * current call site already is) — never a spread of the raw request body.
 * This is what keeps a submitter from ever setting a column the public forms
 * don't expose (e.g. request_status, created_at).
 */
export async function createRequest(table: string, fields: Record<string, string>) {
  if (!ALLOWED_TABLES.has(table)) throw new Error(`Unknown request table: ${table}`);
  const columns = Object.keys(fields);
  const values = Object.values(fields);
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
  await query(`INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`, values);
}
