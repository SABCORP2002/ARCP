import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { requireApiSession } from "@/lib/adminAuth";
import { getCollection, type CollectionField } from "@/lib/adminCollections";

function coerceValue(field: CollectionField, raw: unknown): unknown {
  if (raw === undefined || raw === null || raw === "") return field.type === "number" ? 0 : null;
  if (field.type === "number") {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return String(raw);
}

function buildFieldsFromBody(fields: CollectionField[], body: Record<string, unknown>) {
  const values: Record<string, unknown> = {};
  const missing: string[] = [];
  for (const field of fields) {
    const value = coerceValue(field, body[field.key]);
    values[field.key] = value;
    if (field.required && (value === null || value === "")) missing.push(field.key);
  }
  return { values, missing };
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const session = await requireApiSession(request, response);
  if (!session) return;

  const slug = typeof request.query.collection === "string" ? request.query.collection : "";
  const collection = getCollection(slug);
  if (!collection) {
    response.status(404).json({ error: "Unknown collection" });
    return;
  }

  if (request.method === "GET") {
    const { rows } = await query(`SELECT * FROM ${collection.table} ORDER BY ${collection.orderBy}, id`);
    response.status(200).json({ docs: rows });
    return;
  }

  if (request.method === "POST") {
    const { values, missing } = buildFieldsFromBody(collection.fields, request.body || {});
    if (missing.length) {
      response.status(400).json({ error: `Missing required field(s): ${missing.join(", ")}` });
      return;
    }
    const columns = Object.keys(values);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
    try {
      const { rows } = await query(
        `INSERT INTO ${collection.table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
        Object.values(values),
      );
      response.status(201).json({ doc: rows[0] });
    } catch (error) {
      response.status(400).json({ error: error instanceof Error ? error.message : "Could not create the item" });
    }
    return;
  }

  response.setHeader("Allow", "GET, POST");
  response.status(405).end();
}
