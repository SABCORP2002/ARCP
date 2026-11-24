import { Pool, type QueryResultRow } from "pg";
import { resolvePoolConfig } from "./db-connection.mjs";

// One pooled connection for the whole app, cached across hot reloads in dev
// and across warm invocations of the same serverless instance in production.
// Never create a new Pool per request — Postgres has a hard connection cap
// and a fresh Pool per invocation would exhaust it under any real concurrency.
const globalForPg = globalThis as unknown as { __arcpPgPool?: Pool };

function getPool(): Pool {
  if (!globalForPg.__arcpPgPool) {
    globalForPg.__arcpPgPool = new Pool({
      ...resolvePoolConfig({ preferDirect: false }),
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return globalForPg.__arcpPgPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) {
  const pool = getPool();
  return params ? pool.query<T>(text, params as never[]) : pool.query<T>(text);
}

export async function withTransaction<T>(callback: (client: import("pg").PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}
