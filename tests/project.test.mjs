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
  const roots = ["cms", "components", "context", "data", "lib", "pages", "scripts"];
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

test("separate code-based CMS architecture is present without WordPress or containers", () => {
  const cmsPackage = JSON.parse(read("cms/package.json"));
  const config = read("cms/src/payload.config.ts");
  const access = read("cms/src/access.ts");
  const publicEnvironment = read(".env.example");
  const seed = JSON.parse(read("cms/seed.json"));

  assert.equal(cmsPackage.dependencies.payload, "3.88.0");
  assert.equal(cmsPackage.dependencies["@payloadcms/db-sqlite"], "3.88.0");
  assert.match(config, /sqliteAdapter/);
  assert.match(config, /graphQL: \{ disable: true \}/);
  assert.match(access, /timingSafeEqual/);
  assert.match(publicEnvironment, /CMS_API_TOKEN=/);
  assert.doesNotMatch(publicEnvironment, /NEXT_PUBLIC_CMS_API_TOKEN/);
  assert.equal(seed.members.length, 20);
  assert.equal(seed.articles.length, 4);
  assert.equal(seed.members.filter((member) => member.member_status === "verified").length, 1);
  assert.ok(!fs.existsSync(path.join(root, "wordpress-import")));
  assert.ok(!fs.existsSync(path.join(root, "cms", "docker-compose.yml")));
  assert.ok(!fs.existsSync(path.join(root, "cms", "bootstrap.mjs")));
});

test("public forms write only through server-side CMS routes", () => {
  const cmsServer = read("lib/cms-server.ts");
  const contact = read("pages/api/forms/contact.ts");
  const join = read("pages/api/forms/join.ts");
  const newsletter = read("pages/api/forms/newsletter.ts");
  const guard = read("lib/form-api.ts");

  assert.match(cmsServer, /process\.env\.CMS_API_TOKEN/);
  assert.doesNotMatch(cmsServer, /NEXT_PUBLIC_CMS_API_TOKEN/);
  assert.match(contact, /contact_requests/);
  assert.match(join, /membership_requests/);
  assert.match(newsletter, /newsletter_subscriptions/);
  assert.match(guard, /FORM_ALLOWED_ORIGINS/);
  assert.doesNotMatch(`${contact}\n${join}\n${newsletter}`, /request_status|created_at/);
});

test("hosting handoff includes migrations, health checks and two private services", () => {
  const deployment = read("DEPLOYMENT.md");
  const preflight = read("scripts/deployment-preflight.mjs");
  const deployScript = read("scripts/deploy.mjs");
  const publicService = read("deploy/systemd/arcp-public.service");
  const adminService = read("deploy/systemd/arcp-admin.service");
  const caddy = read("deploy/Caddyfile");
  const publicHealth = read("pages/api/health.ts");
  const cmsHealth = read("cms/src/app/(payload)/health/route.ts");
  const migrations = fs.readdirSync(path.join(root, "cms", "src", "migrations"));

  assert.match(deployment, /node scripts\/deploy\.mjs/);
  assert.match(preflight, /CMS_API_TOKEN must be identical/);
  assert.match(deployScript, /"migrate"/);
  assert.match(publicService, /127\.0\.0\.1.*3000/);
  assert.match(adminService, /127\.0\.0\.1.*3001/);
  assert.match(caddy, /admin\.africanrobotplatform\.org/);
  assert.match(publicHealth, /cms === "ok"/);
  assert.match(cmsHealth, /arcp-administration/);
  assert.ok(migrations.some((file) => file.endsWith("_initial_arcp_schema.ts")));
  assert.ok(!fs.existsSync(path.join(root, ".env.local")));
  assert.ok(!fs.existsSync(path.join(root, "cms", ".env")));
});
