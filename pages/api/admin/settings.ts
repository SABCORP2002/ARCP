import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { requireApiSession } from "@/lib/adminAuth";

const FIELDS = [
  "hero_eyebrow_en",
  "hero_eyebrow_fr",
  "hero_title_en",
  "hero_title_fr",
  "hero_description_en",
  "hero_description_fr",
  "contact_email",
  "secretariat_email",
  "phone",
  "address",
] as const;

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const session = await requireApiSession(request, response);
  if (!session) return;

  if (request.method === "GET") {
    const { rows } = await query(`SELECT ${FIELDS.join(", ")} FROM site_settings WHERE id = 1`);
    response.status(200).json({ doc: rows[0] || null });
    return;
  }

  if (request.method === "PUT") {
    const body: Record<string, unknown> = request.body || {};
    const values = FIELDS.map((key) => {
      const value = body[key];
      return typeof value === "string" ? value : "";
    });
    const missing = FIELDS.filter((key, index) => !values[index]);
    if (missing.length) {
      response.status(400).json({ error: `Missing required field(s): ${missing.join(", ")}` });
      return;
    }
    const assignments = FIELDS.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const { rows } = await query(
      `INSERT INTO site_settings (id, ${FIELDS.join(", ")})
       VALUES (1, ${FIELDS.map((_, index) => `$${index + 1}`).join(", ")})
       ON CONFLICT (id) DO UPDATE SET ${assignments}, updated_at = now()
       RETURNING ${FIELDS.join(", ")}`,
      values,
    );
    response.status(200).json({ doc: rows[0] });
    return;
  }

  response.setHeader("Allow", "GET, PUT");
  response.status(405).end();
}
