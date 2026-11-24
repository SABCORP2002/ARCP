import type { NextApiRequest, NextApiResponse } from "next";
import { query, withTransaction } from "@/lib/db";
import { requireApiSession } from "@/lib/adminAuth";

interface CategoryInput {
  key: string;
  label_en: string;
  label_fr: string;
  value: string;
  delta_en?: string;
  delta_fr?: string;
  description_en: string;
  description_fr: string;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const session = await requireApiSession(request, response);
  if (!session) return;

  if (request.method === "GET") {
    const { rows: statRows } = await query(
      "SELECT year, updated_at, summary_en, summary_fr, methodology_en, methodology_fr, report_url FROM statistics WHERE id = 1",
    );
    const { rows: categoryRows } = await query(
      "SELECT id, sort, key, label_en, label_fr, value, delta_en, delta_fr, description_en, description_fr FROM statistics_categories WHERE statistics_id = 1 ORDER BY sort",
    );
    response.status(200).json({ doc: statRows[0] || null, categories: categoryRows });
    return;
  }

  if (request.method === "PUT") {
    const body = request.body || {};
    const year = Number(body.year);
    const updatedAt = typeof body.updated_at === "string" && body.updated_at ? body.updated_at : null;
    const summaryEn = typeof body.summary_en === "string" ? body.summary_en : "";
    const summaryFr = typeof body.summary_fr === "string" ? body.summary_fr : "";
    const methodologyEn = typeof body.methodology_en === "string" ? body.methodology_en : "";
    const methodologyFr = typeof body.methodology_fr === "string" ? body.methodology_fr : "";
    const reportUrl = typeof body.report_url === "string" && body.report_url ? body.report_url : null;
    const categories: CategoryInput[] = Array.isArray(body.categories) ? body.categories : [];

    if (!Number.isInteger(year) || !summaryEn || !summaryFr || !methodologyEn || !methodologyFr || categories.length === 0) {
      response.status(400).json({ error: "Year, summary, methodology and at least one category are required" });
      return;
    }
    for (const category of categories) {
      if (!category.key || !category.label_en || !category.label_fr || !category.value || !category.description_en || !category.description_fr) {
        response.status(400).json({ error: "Every category needs a key, both labels, a value and both descriptions" });
        return;
      }
    }

    try {
      await withTransaction(async (client) => {
        await client.query(
          `INSERT INTO statistics (id, year, updated_at, summary_en, summary_fr, methodology_en, methodology_fr, report_url)
           VALUES (1, $1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET year = $1, updated_at = $2, summary_en = $3, summary_fr = $4, methodology_en = $5, methodology_fr = $6, report_url = $7`,
          [year, updatedAt, summaryEn, summaryFr, methodologyEn, methodologyFr, reportUrl],
        );
        await client.query("DELETE FROM statistics_categories WHERE statistics_id = 1");
        for (let index = 0; index < categories.length; index += 1) {
          const c = categories[index];
          await client.query(
            `INSERT INTO statistics_categories (statistics_id, sort, key, label_en, label_fr, value, delta_en, delta_fr, description_en, description_fr)
             VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [index, c.key, c.label_en, c.label_fr, c.value, c.delta_en || null, c.delta_fr || null, c.description_en, c.description_fr],
          );
        }
      });
      response.status(200).json({ ok: true });
    } catch (error) {
      response.status(400).json({ error: error instanceof Error ? error.message : "Could not save statistics" });
    }
    return;
  }

  response.setHeader("Allow", "GET, PUT");
  response.status(405).end();
}
