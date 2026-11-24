-- Baseline schema for the integrated admin. Plain TEXT + CHECK constraints
-- instead of native Postgres ENUM types: Postgres has no
-- "CREATE TYPE IF NOT EXISTS", so a migration that re-creates an enum type
-- fails the second time it runs — CHECK constraints live inside
-- CREATE TABLE IF NOT EXISTS and are simply skipped on re-run.

CREATE TABLE IF NOT EXISTS schema_migrations (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
  id serial PRIMARY KEY,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort integer NOT NULL DEFAULT 0,
  title_en text NOT NULL,
  title_fr text NOT NULL,
  excerpt_en text NOT NULL,
  excerpt_fr text NOT NULL,
  content_en text NOT NULL,
  content_fr text NOT NULL,
  category text NOT NULL CHECK (category IN ('Innovation', 'Climate & Tech', 'Inclusion', 'Tech & Society')),
  author text NOT NULL,
  published_at date NOT NULL,
  image_url text,
  local_image text,
  source_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS articles_status_sort_idx ON articles (status, sort);

CREATE TABLE IF NOT EXISTS members (
  id serial PRIMARY KEY,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort integer NOT NULL DEFAULT 0,
  slug text NOT NULL UNIQUE,
  code text NOT NULL,
  name_en text NOT NULL,
  name_fr text NOT NULL,
  member_status text NOT NULL CHECK (member_status IN ('verified', 'onboarding')),
  focus_en text NOT NULL,
  focus_fr text NOT NULL,
  description_en text,
  description_fr text,
  about_en text,
  about_fr text,
  association_name_en text,
  association_name_fr text,
  website_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS members_status_sort_idx ON members (status, sort);

CREATE TABLE IF NOT EXISTS events (
  id serial PRIMARY KEY,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort integer NOT NULL DEFAULT 0,
  key text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_fr text NOT NULL,
  starts_at date NOT NULL,
  ends_at date NOT NULL,
  location_en text NOT NULL,
  location_fr text NOT NULL,
  description_en text NOT NULL,
  description_fr text NOT NULL,
  link text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_status_sort_idx ON events (status, sort);

CREATE TABLE IF NOT EXISTS partners (
  id serial PRIMARY KEY,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort integer NOT NULL DEFAULT 0,
  name text NOT NULL,
  website_url text,
  image_url text,
  local_image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS partners_status_sort_idx ON partners (status, sort);

CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_eyebrow_en text NOT NULL,
  hero_eyebrow_fr text NOT NULL,
  hero_title_en text NOT NULL,
  hero_title_fr text NOT NULL,
  hero_description_en text NOT NULL,
  hero_description_fr text NOT NULL,
  contact_email text NOT NULL,
  secretariat_email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS statistics (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  year integer NOT NULL,
  updated_at date,
  summary_en text NOT NULL,
  summary_fr text NOT NULL,
  methodology_en text NOT NULL,
  methodology_fr text NOT NULL,
  report_url text
);

CREATE TABLE IF NOT EXISTS statistics_categories (
  id serial PRIMARY KEY,
  statistics_id integer NOT NULL REFERENCES statistics (id) ON DELETE CASCADE,
  sort integer NOT NULL DEFAULT 0,
  key text NOT NULL,
  label_en text NOT NULL,
  label_fr text NOT NULL,
  value text NOT NULL,
  delta_en text,
  delta_fr text,
  description_en text NOT NULL,
  description_fr text NOT NULL
);
CREATE INDEX IF NOT EXISTS statistics_categories_order_idx ON statistics_categories (statistics_id, sort);

CREATE TABLE IF NOT EXISTS contact_requests (
  id serial PRIMARY KEY,
  request_status text NOT NULL DEFAULT 'new' CHECK (request_status IN ('new', 'processed', 'spam')),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS membership_requests (
  id serial PRIMARY KEY,
  request_status text NOT NULL DEFAULT 'new' CHECK (request_status IN ('new', 'processed', 'rejected', 'spam')),
  membership_type text NOT NULL CHECK (membership_type IN ('National ecosystem', 'Partner organization', 'Individual supporter')),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  applicant_role text,
  country text NOT NULL,
  organization text NOT NULL,
  organization_type text,
  org_website text,
  community_size text,
  focus_area text,
  contributions text,
  interest text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id serial PRIMARY KEY,
  request_status text NOT NULL DEFAULT 'new' CHECK (request_status IN ('new', 'subscribed', 'unsubscribed')),
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
