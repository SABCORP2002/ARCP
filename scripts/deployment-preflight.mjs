import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const useExamples = process.argv.includes("--examples");
const publicEnvironmentPath = path.join(root, useExamples ? ".env.example" : ".env.local");
const cmsEnvironmentPath = path.join(root, "cms", useExamples ? ".env.example" : ".env");
const problems = [];

function parseEnvironment(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`Missing ${path.relative(root, filePath)}`);
    return {};
  }

  const values = {};
  for (const sourceLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = sourceLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

function requireValues(source, names, label) {
  for (const name of names) {
    if (!source[name]) problems.push(`${label}: ${name} is required`);
  }
}

function validUrl(value, name, { allowHttp = false } = {}) {
  try {
    const url = new URL(value);
    if (!useExamples && url.protocol !== "https:" && !(allowHttp && ["127.0.0.1", "localhost"].includes(url.hostname))) {
      problems.push(`${name} must use HTTPS (an internal localhost URL is allowed for CMS_URL)`);
    }
    return url;
  } catch {
    problems.push(`${name} is not a valid absolute URL`);
    return null;
  }
}

const publicEnvironment = parseEnvironment(publicEnvironmentPath);
const cmsEnvironment = parseEnvironment(cmsEnvironmentPath);

requireValues(publicEnvironment, ["NEXT_PUBLIC_SITE_URL", "CMS_URL", "CMS_API_TOKEN", "FORM_ALLOWED_ORIGINS"], "public site");
requireValues(cmsEnvironment, ["PAYLOAD_SECRET", "CMS_API_TOKEN", "DATABASE_URL", "CMS_PUBLIC_URL", "PUBLIC_SITE_URL", "ADMIN_EMAIL", "ADMIN_PASSWORD"], "administration");

const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 20 || (major === 20 && minor < 19)) problems.push("Node.js 20.19 or newer is required");

if (!useExamples) {
  const placeholder = /replace-with|copy-the|validation-only|example\.com/i;
  for (const [name, value] of Object.entries({
    PAYLOAD_SECRET: cmsEnvironment.PAYLOAD_SECRET,
    CMS_API_TOKEN: cmsEnvironment.CMS_API_TOKEN,
    ADMIN_EMAIL: cmsEnvironment.ADMIN_EMAIL,
    ADMIN_PASSWORD: cmsEnvironment.ADMIN_PASSWORD,
  })) {
    if (placeholder.test(value || "")) problems.push(`${name} still contains an example value`);
  }
  if ((cmsEnvironment.PAYLOAD_SECRET || "").length < 32) problems.push("PAYLOAD_SECRET must contain at least 32 characters");
  if ((cmsEnvironment.CMS_API_TOKEN || "").length < 48) problems.push("CMS_API_TOKEN must contain at least 48 characters");
  if ((cmsEnvironment.ADMIN_PASSWORD || "").length < 14) problems.push("ADMIN_PASSWORD must contain at least 14 characters");
  if (publicEnvironment.CMS_API_TOKEN !== cmsEnvironment.CMS_API_TOKEN) problems.push("CMS_API_TOKEN must be identical in .env.local and cms/.env");
}

const publicUrl = validUrl(publicEnvironment.NEXT_PUBLIC_SITE_URL || "", "NEXT_PUBLIC_SITE_URL");
validUrl(publicEnvironment.CMS_URL || "", "CMS_URL", { allowHttp: true });
const cmsPublicUrl = validUrl(cmsEnvironment.CMS_PUBLIC_URL || "", "CMS_PUBLIC_URL");
const cmsSiteUrl = validUrl(cmsEnvironment.PUBLIC_SITE_URL || "", "PUBLIC_SITE_URL");

if (!useExamples && publicUrl && cmsSiteUrl && publicUrl.origin !== cmsSiteUrl.origin) {
  problems.push("NEXT_PUBLIC_SITE_URL and PUBLIC_SITE_URL must reference the same public origin");
}
if (!useExamples && publicUrl) {
  const allowedOrigins = (publicEnvironment.FORM_ALLOWED_ORIGINS || "").split(",").map((value) => value.trim().replace(/\/$/, ""));
  if (!allowedOrigins.includes(publicUrl.origin)) problems.push("FORM_ALLOWED_ORIGINS must include NEXT_PUBLIC_SITE_URL");
  if (allowedOrigins.some((origin) => /localhost|127\.0\.0\.1/i.test(origin))) problems.push("FORM_ALLOWED_ORIGINS must not contain localhost in production");
}
if (!useExamples && publicUrl && cmsPublicUrl && publicUrl.origin === cmsPublicUrl.origin) {
  problems.push("The public site and administration must use distinct origins");
}
const databaseUrl = cmsEnvironment.DATABASE_URL || "";
const fileDatabase = databaseUrl.startsWith("file:");
const remoteDatabase = databaseUrl.startsWith("libsql:") || databaseUrl.startsWith("https:");
if (!fileDatabase && !remoteDatabase) {
  problems.push("DATABASE_URL must be a SQLite file: URL or a hosted libsql:// URL");
}
if (remoteDatabase && !cmsEnvironment.DATABASE_AUTH_TOKEN) {
  problems.push("DATABASE_AUTH_TOKEN is required when DATABASE_URL is a hosted libsql:// URL");
}

const requiredDirectories = [];
if (fileDatabase) requiredDirectories.push("cms/data");
if (!cmsEnvironment.S3_BUCKET && !cmsEnvironment.PAYLOAD_MEDIA_DIR) requiredDirectories.push("cms/media");
for (const relativeDirectory of requiredDirectories) {
  const directory = path.join(root, relativeDirectory);
  try {
    fs.accessSync(directory, fs.constants.R_OK | fs.constants.W_OK);
  } catch {
    problems.push(`${relativeDirectory} must exist and be writable`);
  }
}

if (problems.length) {
  console.error("Deployment preflight failed:");
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(useExamples
  ? "Deployment examples contain every required setting."
  : "Deployment preflight passed: secrets, URLs and persistent directories are valid.");
