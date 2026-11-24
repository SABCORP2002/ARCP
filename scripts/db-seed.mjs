// Idempotent: each table is only ever populated once (when empty). Safe to
// run on every deploy — never overwrites existing content or the admin
// account.
import bcrypt from "bcryptjs";
import pg from "pg";
import { resolvePoolConfig } from "../lib/db-connection.mjs";
import { articles, events, members, partners, siteSettings, statistics } from "./seed-data.mjs";

const { Pool } = pg;
const PLACEHOLDER = /replace-with|example\.com|change-me/i;

async function seedAdminUser(pool) {
  const { rows } = await pool.query("SELECT id FROM admin_users LIMIT 1");
  if (rows.length) {
    console.log("admin_users already has an owner account — skipping.");
    return;
  }
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || PLACEHOLDER.test(email) || PLACEHOLDER.test(password) || password.length < 14) {
    throw new Error("ADMIN_EMAIL and a real ADMIN_PASSWORD (14+ characters) are required to create the owner account.");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query("INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)", [email, passwordHash]);
  console.log(`Created the owner account ${email}`);
}

async function seedIfEmpty(pool, table, rows, insertOne) {
  const { rows: existing } = await pool.query(`SELECT 1 FROM ${table} LIMIT 1`);
  if (existing.length) {
    console.log(`${table} already has content — skipping.`);
    return;
  }
  for (const row of rows) await insertOne(pool, row);
  console.log(`Seeded ${rows.length} row(s) into ${table}.`);
}

async function main() {
  const pool = new Pool(resolvePoolConfig({ preferDirect: true }));
  try {
    await seedAdminUser(pool);

    await seedIfEmpty(pool, "articles", articles, (p, a) =>
      p.query(
        `INSERT INTO articles (status, sort, title_en, title_fr, excerpt_en, excerpt_fr, content_en, content_fr, category, author, published_at, local_image, source_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [a.status, a.sort, a.title_en, a.title_fr, a.excerpt_en, a.excerpt_fr, a.content_en, a.content_fr, a.category, a.author, a.published_at, a.local_image, a.source_url],
      ),
    );

    await seedIfEmpty(pool, "members", members, (p, m) =>
      p.query(
        `INSERT INTO members (slug, status, sort, code, name_en, name_fr, member_status, focus_en, focus_fr)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [m.slug, m.status, m.sort, m.code, m.name_en, m.name_fr, m.member_status, m.focus_en, m.focus_fr],
      ),
    );

    await seedIfEmpty(pool, "events", events, (p, e) =>
      p.query(
        `INSERT INTO events (key, status, sort, title_en, title_fr, starts_at, ends_at, location_en, location_fr, description_en, description_fr, link)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [e.key, e.status, e.sort, e.title_en, e.title_fr, e.starts_at, e.ends_at, e.location_en, e.location_fr, e.description_en, e.description_fr, e.link],
      ),
    );

    await seedIfEmpty(pool, "partners", partners, (p, pt) =>
      p.query(`INSERT INTO partners (status, sort, name, local_image) VALUES ($1,$2,$3,$4)`, [pt.status, pt.sort, pt.name, pt.local_image]),
    );

    const { rows: existingSettings } = await pool.query("SELECT 1 FROM site_settings WHERE id = 1");
    if (!existingSettings.length) {
      await pool.query(
        `INSERT INTO site_settings (id, hero_eyebrow_en, hero_eyebrow_fr, hero_title_en, hero_title_fr, hero_description_en, hero_description_fr, contact_email, secretariat_email, phone, address)
         VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          siteSettings.hero_eyebrow_en, siteSettings.hero_eyebrow_fr,
          siteSettings.hero_title_en, siteSettings.hero_title_fr,
          siteSettings.hero_description_en, siteSettings.hero_description_fr,
          siteSettings.contact_email, siteSettings.secretariat_email,
          siteSettings.phone, siteSettings.address,
        ],
      );
      console.log("Seeded site_settings.");
    } else {
      console.log("site_settings already configured — skipping.");
    }

    const { rows: existingStats } = await pool.query("SELECT 1 FROM statistics WHERE id = 1");
    if (!existingStats.length) {
      await pool.query(
        `INSERT INTO statistics (id, year, updated_at, summary_en, summary_fr, methodology_en, methodology_fr, report_url)
         VALUES (1,$1,$2,$3,$4,$5,$6,$7)`,
        [statistics.year, statistics.updated_at, statistics.summary_en, statistics.summary_fr, statistics.methodology_en, statistics.methodology_fr, statistics.report_url],
      );
      for (let index = 0; index < statistics.categories.length; index += 1) {
        const c = statistics.categories[index];
        await pool.query(
          `INSERT INTO statistics_categories (statistics_id, sort, key, label_en, label_fr, value, delta_en, delta_fr, description_en, description_fr)
           VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [index, c.key, c.label_en, c.label_fr, c.value, c.delta_en || null, c.delta_fr || null, c.description_en, c.description_fr],
        );
      }
      console.log(`Seeded statistics with ${statistics.categories.length} categories.`);
    } else {
      console.log("statistics already configured — skipping.");
    }

    console.log("Database seed complete.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
