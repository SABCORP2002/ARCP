// Applies db/migrations/*.sql in filename order, tracking what has already
// run in schema_migrations so it's safe to call on every deploy.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { resolvePoolConfig } from "../lib/db-connection.mjs";

const { Pool } = pg;
const root = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(root, "..", "db", "migrations");

async function main() {
  const pool = new Pool(resolvePoolConfig({ preferDirect: true }));
  try {
    // Bootstrap: schema_migrations itself may not exist yet on a brand-new
    // database, so every migration file is responsible for creating it
    // idempotently (0001_init.sql does). Query it defensively.
    await pool.query(
      "CREATE TABLE IF NOT EXISTS schema_migrations (id serial PRIMARY KEY, name text NOT NULL UNIQUE, applied_at timestamptz NOT NULL DEFAULT now())",
    );

    const { rows: applied } = await pool.query("SELECT name FROM schema_migrations");
    const appliedNames = new Set(applied.map((row) => row.name));

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      if (appliedNames.has(file)) {
        console.log(`skip (already applied): ${file}`);
        continue;
      }
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        // No second argument: forces pg's simple query protocol, which is
        // required to run a multi-statement SQL file in one call.
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
        console.log(`applied: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw new Error(`Migration ${file} failed: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        client.release();
      }
    }

    console.log("Database schema is up to date.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
