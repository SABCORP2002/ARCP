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

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const session = await requireApiSession(request, response);
  if (!session) return;

  const slug = typeof request.query.collection === "string" ? request.query.collection : "";
  const collection = getCollection(slug);
  if (!collection) {
    response.status(404).json({ error: "Unknown collection" });
    return;
  }

  const id = Number(request.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    response.status(400).json({ error: "Invalid id" });
    return;
  }

  if (request.method === "GET") {
    const { rows } = await query(`SELECT * FROM ${collection.table} WHERE id = $1`, [id]);
    if (!rows[0]) {
      response.status(404).json({ error: "Not found" });
      return;
    }
    response.status(200).json({ doc: rows[0] });
    return;
  }

  if (request.method === "PUT") {
    const body: Record<string, unknown> = request.body || {};
    const missing: string[] = [];
    const assignments: string[] = [];
    const values: unknown[] = [];
    collection.fields.forEach((field, index) => {
      const value = coerceValue(field, body[field.key]);
      if (field.required && (value === null || value === "")) missing.push(field.key);
      assignments.push(`${field.key} = $${index + 1}`);
      values.push(value);
    });
    if (missing.length) {
      response.status(400).json({ error: `Missing required field(s): ${missing.join(", ")}` });
      return;
    }
    values.push(id);
    try {
      const { rows } = await query(
        `UPDATE ${collection.table} SET ${assignments.join(", ")}, updated_at = now() WHERE id = $${values.length} RETURNING *`,
        values,
      );
      if (!rows[0]) {
        response.status(404).json({ error: "Not found" });
        return;
      }
      response.status(200).json({ doc: rows[0] });
    } catch (error) {
      response.status(400).json({ error: error instanceof Error ? error.message : "Could not update the item" });
    }
    return;
  }

  if (request.method === "DELETE") {
    await query(`DELETE FROM ${collection.table} WHERE id = $1`, [id]);
    response.status(204).end();
    return;
  }

  response.setHeader("Allow", "GET, PUT, DELETE");
  response.status(405).end();
}
