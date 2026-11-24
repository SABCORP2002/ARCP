import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function unique(values) {
  return new Set(values).size === values.length;
}

function collectTextFiles(relativePath) {
  const absolutePath = path.join(root, relativePath);
  const entries = fs.readdirSync(absolutePath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const child = path.join(relativePath, entry.name);
    if (entry.isDirectory() && !["node_modules", ".next", "data", "media"].includes(entry.name)) return collectTextFiles(child);
    if (entry.isDirectory()) return [];
    return /\.(?:css|html|js|json|md|mjs|php|ts|tsx)$/.test(entry.name) ? [child] : [];
  });
}

test("content uses the canonical domain and no placeholder links", () => {
  const roots = ["components", "context", "data", "lib", "pages", "scripts"];
  const files = ["README.md", ...roots.flatMap(collectTextFiles)];

  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /africanroboticsplatform\.org/i, `${file} contains the obsolete domain`);
    assert.doesNotMatch(source, /href=["']#["']/i, `${file} contains a placeholder link`);
  }
});

test("member and article identifiers are unique and media exists", () => {
  const members = read("data/members.ts");
  const articles = read("data/articles.ts");
  const memberSlugs = [...members.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  const articleIds = [...articles.matchAll(/\bid:\s*(\d+),/g)].map((match) => match[1]);
  const articleImages = [...articles.matchAll(/image:\s*"([^"]+)"/g)].map((match) => match[1]);

  assert.equal(memberSlugs.length, 20);
  assert.ok(unique(memberSlugs), "member slugs must be unique");
  assert.ok(unique(articleIds), "article IDs must be unique");
  assert.equal((members.match(/status:\s*"verified"/g) || []).length, 1);

  for (const image of articleImages) {
    assert.ok(fs.existsSync(path.join(root, "public", "assets", "articles", image)), `missing article image: ${image}`);
  }
});

test("dynamic sitemap contains CMS-backed public routes", () => {
  const sitemap = read("pages/sitemap.xml.tsx");
  for (const route of ["/join/", "/contact/", "/privacy/", "/terms/", "/articles/1/", "/members/cameroon/"]) {
    const dynamicRoute = route.startsWith("/articles/") || route.startsWith("/members/");
    if (!dynamicRoute) assert.match(sitemap, new RegExp(route.replaceAll("/", "\\/")));
  }
  assert.match(sitemap, /getArticles\(\)/);
  assert.match(sitemap, /getMembers\(\)/);
});

test("public assets stay within the deployment size budget", () => {
  const stack = [path.join(root, "public", "assets")];
  let total = 0;
  let largest = 0;
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const child = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(child);
      else {
        const size = fs.statSync(child).size;
        total += size;
        largest = Math.max(largest, size);
      }
    }
  }
  assert.ok(largest < 2 * 1024 * 1024, `one public asset is ${Math.round(largest / 1024)} KB`);
  assert.ok(total < 8 * 1024 * 1024, `public assets total ${Math.round(total / 1024)} KB`);
});

test("the admin is integrated into this app — no separate CMS, no VPS tooling, no WordPress", () => {
  const publicEnvironment = read(".env.example");
  const dbConnection = read("lib/db-connection.mjs");
  const adminAuth = read("lib/adminAuth.ts");

  // Was a separate Payload app + VPS handoff before; now one Next.js app on Vercel.
  for (const removed of [
    "cms",
    "deploy",
    "DEPLOYMENT.md",
    "DEPLOYMENT.en.md",
    "wordpress-import",
    "wordpress-theme",
    "scripts/deployment-preflight.mjs",
    "scripts/deploy.mjs",
    "scripts/push-backoffice.mjs",
  ]) {
    assert.ok(!fs.existsSync(path.join(root, removed)), `${removed} should no longer exist`);
  }

  assert.doesNotMatch(publicEnvironment, /\bCMS_API_TOKEN\b/, ".env.example should not reference a separate CMS token");
  assert.doesNotMatch(publicEnvironment, /NEXT_PUBLIC_CMS_API_TOKEN/);
  assert.match(publicEnvironment, /DATABASE_URL=/);
  assert.match(publicEnvironment, /SESSION_SECRET=/);

  // Managed Postgres TLS handling, proven against Supabase/Neon/Vercel Postgres.
  assert.match(dbConnection, /sslmode/);
  assert.match(dbConnection, /rejectUnauthorized/);

  // Admin auth: hashed passwords, constant-time cookie signature check.
  assert.match(adminAuth, /bcrypt/);
  assert.match(adminAuth, /timingSafeEqual/);
  assert.match(adminAuth, /SESSION_SECRET/);
});

test("the initial seed matches the previous content exactly", () => {
  const seed = read("scripts/seed-data.mjs");
  assert.equal((seed.match(/slug:\s*"[a-z0-9-]+"/g) || []).length, 20, "expected 20 members");
  assert.equal((seed.match(/content_en:/g) || []).length, 4, "expected 4 articles");
  assert.equal((seed.match(/member_status:\s*"verified"/g) || []).length, 1, "expected 1 verified member");
  assert.equal((seed.match(/starts_at:/g) || []).length, 2, "expected 2 events");
  assert.equal((seed.match(/(?<![a-z_])name:\s*"[^"]+"/g) || []).length, 6, "expected 6 partners");
});

test("the integrated admin schema and auth routes exist", () => {
  const schema = read("db/migrations/0001_init.sql");
  for (const table of [
    "admin_users",
    "articles",
    "members",
    "events",
    "partners",
    "site_settings",
    "statistics",
    "statistics_categories",
    "contact_requests",
    "membership_requests",
    "newsletter_subscriptions",
  ]) {
    assert.match(schema, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`), `missing table: ${table}`);
  }

  for (const route of ["pages/api/admin/login.ts", "pages/api/admin/logout.ts", "pages/api/admin/change-password.ts"]) {
    assert.ok(fs.existsSync(path.join(root, route)), `missing route: ${route}`);
  }

  const withAdminPage = read("lib/withAdminPage.ts");
  assert.match(withAdminPage, /\/admin\/login/);

  const health = read("pages/api/health.ts");
  assert.match(health, /database/);
});

test("public forms write only an explicit, hardcoded set of fields", () => {
  const cmsServer = read("lib/cms-server.ts");
  const contact = read("pages/api/forms/contact.ts");
  const join = read("pages/api/forms/join.ts");
  const newsletter = read("pages/api/forms/newsletter.ts");
  const guard = read("lib/form-api.ts");

  assert.match(cmsServer, /ALLOWED_TABLES/);
  assert.match(contact, /contact_requests/);
  assert.match(join, /membership_requests/);
  assert.match(newsletter, /newsletter_subscriptions/);
  assert.match(guard, /FORM_ALLOWED_ORIGINS/);
  assert.doesNotMatch(`${contact}\n${join}\n${newsletter}`, /request_status|created_at/);
});
