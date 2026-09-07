import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`membership_requests\` ADD \`applicant_role\` text;`)
  await db.run(sql`ALTER TABLE \`membership_requests\` ADD \`organization_type\` text;`)
  await db.run(sql`ALTER TABLE \`membership_requests\` ADD \`org_website\` text;`)
  await db.run(sql`ALTER TABLE \`membership_requests\` ADD \`community_size\` text;`)
  await db.run(sql`ALTER TABLE \`membership_requests\` ADD \`focus_area\` text;`)
  await db.run(sql`ALTER TABLE \`membership_requests\` ADD \`contributions\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`membership_requests\` DROP COLUMN \`applicant_role\`;`)
  await db.run(sql`ALTER TABLE \`membership_requests\` DROP COLUMN \`organization_type\`;`)
  await db.run(sql`ALTER TABLE \`membership_requests\` DROP COLUMN \`org_website\`;`)
  await db.run(sql`ALTER TABLE \`membership_requests\` DROP COLUMN \`community_size\`;`)
  await db.run(sql`ALTER TABLE \`membership_requests\` DROP COLUMN \`focus_area\`;`)
  await db.run(sql`ALTER TABLE \`membership_requests\` DROP COLUMN \`contributions\`;`)
}
