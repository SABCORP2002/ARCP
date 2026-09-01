import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { buildConfig } from "payload";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Articles, Events, Members, Partners } from "./collections/Content";
import { ContactRequests, MembershipRequests, NewsletterSubscriptions } from "./collections/Requests";
import { SiteSettings } from "./globals/SiteSettings";
import { migrations } from "./migrations";

const directory = path.dirname(fileURLToPath(import.meta.url));
const publicSiteUrl = process.env.PUBLIC_SITE_URL || "http://localhost:3000";
const cmsPublicUrl = process.env.CMS_PUBLIC_URL || "http://localhost:3001";
const secret = process.env.PAYLOAD_SECRET;

if (!secret || secret.startsWith("replace-with")) {
  throw new Error("PAYLOAD_SECRET must contain a strong private value.");
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: "— Administration ARCP" },
    importMap: { baseDir: path.resolve(directory) },
  },
  collections: [Users, Media, Articles, Members, Events, Partners, ContactRequests, MembershipRequests, NewsletterSubscriptions],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret,
  serverURL: cmsPublicUrl,
  cors: [publicSiteUrl, cmsPublicUrl],
  csrf: [cmsPublicUrl],
  graphQL: { disable: true },
  telemetry: false,
  maxDepth: 2,
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || "file:./data/arcp.db" },
    prodMigrations: migrations,
    wal: true,
    busyTimeout: 5000,
    autoIncrement: true,
  }),
  sharp,
  typescript: { outputFile: path.resolve(directory, "payload-types.ts") },
});
