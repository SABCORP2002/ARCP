import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "node:path";
import { buildConfig } from "payload";
import type { Plugin } from "payload";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Articles, Events, Members, Partners } from "./collections/Content";
import { ContactRequests, MembershipRequests, NewsletterSubscriptions } from "./collections/Requests";
import { SiteSettings } from "./globals/SiteSettings";
import { AnnualStatistics } from "./globals/AnnualStatistics";
import { migrations } from "./migrations";

const directory = path.dirname(fileURLToPath(import.meta.url));
const publicSiteUrl = process.env.PUBLIC_SITE_URL || "http://localhost:3000";
const cmsPublicUrl = process.env.CMS_PUBLIC_URL || "http://localhost:3001";
const secret = process.env.PAYLOAD_SECRET;

if (!secret || secret.startsWith("replace-with")) {
  throw new Error("PAYLOAD_SECRET must contain a strong private value.");
}

// SQLite: a local file for development, or a hosted libSQL/Turso URL in
// production. A local file also gets WAL mode; a remote database does not.
const databaseUrl = process.env.DATABASE_URL || "file:./data/arcp.db";
const isFileDatabase = databaseUrl.startsWith("file:");

// Uploads: the local disk by default, or an S3-compatible bucket (Cloudflare
// R2, Backblaze B2, AWS S3…) when S3_BUCKET is set. Files are still streamed
// through Payload's own API, so the bucket stays private. The plugin is always
// registered (so the import map is stable) but only active when configured.
const plugins: Plugin[] = [
  s3Storage({
    enabled: Boolean(process.env.S3_BUCKET),
    collections: { media: true },
    bucket: process.env.S3_BUCKET || "",
    config: {
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || "auto",
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
      },
    },
  }),
];

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: "— Administration ARCP" },
    importMap: { baseDir: path.resolve(directory) },
  },
  collections: [Users, Media, Articles, Members, Events, Partners, ContactRequests, MembershipRequests, NewsletterSubscriptions],
  globals: [SiteSettings, AnnualStatistics],
  editor: lexicalEditor(),
  secret,
  serverURL: cmsPublicUrl,
  cors: [publicSiteUrl, cmsPublicUrl],
  csrf: [cmsPublicUrl],
  graphQL: { disable: true },
  telemetry: false,
  maxDepth: 2,
  plugins,
  db: sqliteAdapter({
    client: {
      url: databaseUrl,
      ...(process.env.DATABASE_AUTH_TOKEN ? { authToken: process.env.DATABASE_AUTH_TOKEN } : {}),
    },
    prodMigrations: migrations,
    autoIncrement: true,
    // A local SQLite file accepts WAL + busy_timeout PRAGMAs and can auto-push
    // schema changes in dev. A hosted libSQL/Turso database rejects those
    // PRAGMAs and must never be "pushed" to — it is driven by migrations only.
    ...(isFileDatabase ? { wal: true, busyTimeout: 5000 } : { push: false }),
  }),
  sharp,
  typescript: { outputFile: path.resolve(directory, "payload-types.ts") },
});
