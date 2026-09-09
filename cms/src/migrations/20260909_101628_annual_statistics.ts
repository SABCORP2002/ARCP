import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`annual_statistics_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`label_en\` text NOT NULL,
  	\`label_fr\` text NOT NULL,
  	\`value\` text NOT NULL,
  	\`delta_en\` text,
  	\`delta_fr\` text,
  	\`description_en\` text NOT NULL,
  	\`description_fr\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`annual_statistics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`annual_statistics_categories_order_idx\` ON \`annual_statistics_categories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`annual_statistics_categories_parent_id_idx\` ON \`annual_statistics_categories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`annual_statistics\` (
  	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  	\`year\` numeric NOT NULL,
  	\`updated_at\` text,
  	\`summary_en\` text NOT NULL,
  	\`summary_fr\` text NOT NULL,
  	\`methodology_en\` text NOT NULL,
  	\`methodology_fr\` text NOT NULL,
  	\`report_id\` integer,
  	\`created_at\` text,
  	FOREIGN KEY (\`report_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`annual_statistics_report_idx\` ON \`annual_statistics\` (\`report_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`annual_statistics_categories\`;`)
  await db.run(sql`DROP TABLE \`annual_statistics\`;`)
}
