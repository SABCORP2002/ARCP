import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
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

// PostgreSQL. On Vercel the "Postgres" storage injects POSTGRES_URL (pooled) and
// POSTGRES_URL_NON_POOLING (direct); use the direct one for migrations/DDL when
// available. DATABASE_URL overrides everything for local / other hosts.
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  "";

// Uploads: local disk by default; Vercel Blob when BLOB_READ_WRITE_TOKEN is set;
// or an S3-compatible bucket when S3_BUCKET is set. Plugins are always registered
// (stable import map) but only active when configured.
const plugins: Plugin[] = [
  vercelBlobStorage({
    enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    collections: { media: true },
    token: process.env.BLOB_READ_WRITE_TOKEN || "",
  }),
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
  db: postgresAdapter({
    pool: { connectionString },
    prodMigrations: migrations,
    // Production is migration-driven; dev may auto-sync the schema.
    push: process.env.NODE_ENV !== "production",
  }),
  sharp,
  typescript: { outputFile: path.resolve(directory, "payload-types.ts") },
});
