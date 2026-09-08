import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "@payload-config";

const directory = path.dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(fs.readFileSync(path.resolve(directory, "../seed.json"), "utf8"));
const payload = await getPayload({ config });

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const existingUsers = await payload.find({ collection: "users", limit: 1, overrideAccess: true });

// Idempotent: on a database that already has an owner, this whole script is a
// no-op, so it can safely run on every deploy (build step) without clobbering
// content the owner has since edited.
if (existingUsers.totalDocs) {
  payload.logger.info("ARCP administration database already initialised — nothing to seed.");
} else {
  if (!adminEmail || !adminPassword || adminPassword.startsWith("replace-with")) {
    throw new Error("ADMIN_EMAIL and a strong ADMIN_PASSWORD are required to create the owner account.");
  }
  await payload.create({
    collection: "users",
    overrideAccess: true,
    data: { email: adminEmail, password: adminPassword, name: "Propriétaire ARCP" },
  });
  payload.logger.info(`Created the owner account ${adminEmail}`);

  await payload.updateGlobal({
    slug: "site-settings",
    overrideAccess: true,
    data: seed.site_settings,
  });

  for (const collection of ["articles", "members", "events", "partners"] as const) {
    for (const rawItem of seed[collection]) {
      const { id: _legacyId, ...data } = rawItem;
      await payload.create({ collection, overrideAccess: true, data });
    }
    payload.logger.info(`Seeded ${collection}`);
  }

  payload.logger.info("ARCP administration database is ready.");
}
