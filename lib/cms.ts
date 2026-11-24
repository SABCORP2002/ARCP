// Content layer for the public site. Reads directly from the integrated
// admin's Postgres database (see lib/db.ts) — there is no separate CMS
// process or HTTP hop any more. Every exported function keeps its original
// name/signature/shape and its resilience philosophy: on any error, fall
// back to the hardcoded local data in data/*.ts so the public site never
// goes down because of a database hiccup.
import { query } from "@/lib/db";
import { articleCategoryLabels, articlesData, Article, ArticleCategory } from "@/data/articles";
import { memberNations, MemberNation } from "@/data/members";
import { platformEvents, PlatformEvent } from "@/data/events";
import { platformPartners, PlatformPartner } from "@/data/partners";
import { defaultSiteSettings, SiteSettings } from "@/data/site";
import { AnnualStatistics, defaultStatistics, StatCategory } from "@/data/statistics";

export interface HomeContent {
  articles: Article[];
  members: MemberNation[];
  events: PlatformEvent[];
  partners: PlatformPartner[];
  settings: SiteSettings;
  source: "cms" | "fallback";
}

function assetPath(imageUrl: string | null, localImage: string | null, directory: "articles" | "partners") {
  if (imageUrl && /^https?:\/\//.test(imageUrl)) return imageUrl;
  if (localImage) return `/assets/${directory}/${localImage}`;
  return directory === "articles" ? "/assets/hero-illlustration.jpg" : "/assets/logo.svg";
}

function safeHttpUrl(value: string | null, fallback?: string) {
  try {
    if (!value) return fallback;
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

function formatDateRange(start: string, end: string, locale: "en-GB" | "fr-FR") {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" };
  const formatter = new Intl.DateTimeFormat(locale, options);
  const startDay = start.slice(0, 10);
  const endDay = end.slice(0, 10);
  const startDate = new Date(`${startDay}T00:00:00Z`);
  const endDate = new Date(`${endDay}T00:00:00Z`);
  if (startDay === endDay) return formatter.format(startDate);
  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}

interface DbArticle {
  id: number;
  title_en: string;
  title_fr: string;
  excerpt_en: string;
  excerpt_fr: string;
  content_en: string;
  content_fr: string;
  category: ArticleCategory;
  author: string;
  published_at: string;
  image_url: string | null;
  local_image: string | null;
  source_url: string;
}

export async function getArticles(): Promise<Article[]> {
  try {
    const { rows } = await query<DbArticle>(
      "SELECT id, title_en, title_fr, excerpt_en, excerpt_fr, content_en, content_fr, category, author, published_at, image_url, local_image, source_url FROM articles WHERE status = 'published' ORDER BY sort",
    );
    return rows.map((item) => ({
      id: item.id,
      titleEn: item.title_en,
      titleFr: item.title_fr,
      excerptEn: item.excerpt_en,
      excerptFr: item.excerpt_fr,
      contentEn: item.content_en,
      contentFr: item.content_fr,
      category: articleCategoryLabels[item.category] ? item.category : "Innovation",
      author: item.author,
      publishedAt: String(item.published_at).slice(0, 10),
      image: assetPath(item.image_url, item.local_image, "articles"),
      sourceUrl: safeHttpUrl(item.source_url, "/#articles")!,
    }));
  } catch {
    return articlesData;
  }
}

interface DbMember {
  slug: string;
  code: string;
  name_en: string;
  name_fr: string;
  member_status: "verified" | "onboarding";
  focus_en: string;
  focus_fr: string;
  description_en: string | null;
  description_fr: string | null;
  about_en: string | null;
  about_fr: string | null;
  association_name_en: string | null;
  association_name_fr: string | null;
  website_url: string | null;
}

export async function getMembers(): Promise<MemberNation[]> {
  try {
    const { rows } = await query<DbMember>(
      "SELECT slug, code, name_en, name_fr, member_status, focus_en, focus_fr, description_en, description_fr, about_en, about_fr, association_name_en, association_name_fr, website_url FROM members WHERE status = 'published' ORDER BY sort",
    );
    const validItems = rows.filter((item) => /^[a-z0-9-]+$/.test(item.slug) && /^[a-z]{2}$/i.test(item.code));
    return validItems.map((item) => ({
      slug: item.slug,
      code: item.code,
      nameEn: item.name_en,
      nameFr: item.name_fr,
      status: item.member_status,
      focusEn: item.focus_en,
      focusFr: item.focus_fr,
      ...(item.description_en ? { descriptionEn: item.description_en } : {}),
      ...(item.description_fr ? { descriptionFr: item.description_fr } : {}),
      ...(item.about_en ? { aboutEn: item.about_en } : {}),
      ...(item.about_fr ? { aboutFr: item.about_fr } : {}),
      ...(item.association_name_en ? { associationNameEn: item.association_name_en } : {}),
      ...(item.association_name_fr ? { associationNameFr: item.association_name_fr } : {}),
      ...(safeHttpUrl(item.website_url) ? { websiteUrl: safeHttpUrl(item.website_url) } : {}),
    }));
  } catch {
    return memberNations;
  }
}

interface DbEvent {
  id: number;
  key: string;
  title_en: string;
  title_fr: string;
  starts_at: string;
  ends_at: string;
  location_en: string;
  location_fr: string;
  description_en: string;
  description_fr: string;
  link: string;
}

export async function getEvents(): Promise<PlatformEvent[]> {
  try {
    const { rows } = await query<DbEvent>(
      "SELECT id, key, title_en, title_fr, starts_at, ends_at, location_en, location_fr, description_en, description_fr, link FROM events WHERE status = 'published' ORDER BY sort",
    );
    return rows.map((item) => {
      const startsAt = String(item.starts_at).slice(0, 10);
      const endsAt = String(item.ends_at).slice(0, 10);
      return {
        id: item.key || String(item.id),
        titleEn: item.title_en,
        titleFr: item.title_fr,
        startsAt,
        endsAt,
        isPast: new Date(`${endsAt}T23:59:59Z`).getTime() < Date.now(),
        dateEn: formatDateRange(startsAt, endsAt, "en-GB"),
        dateFr: formatDateRange(startsAt, endsAt, "fr-FR"),
        locationEn: item.location_en,
        locationFr: item.location_fr,
        descriptionEn: item.description_en,
        descriptionFr: item.description_fr,
        link: safeHttpUrl(item.link, "/#events")!,
      };
    });
  } catch {
    return platformEvents;
  }
}

interface DbPartner {
  id: number;
  name: string;
  image_url: string | null;
  local_image: string | null;
  website_url: string | null;
}

export async function getPartners(): Promise<PlatformPartner[]> {
  try {
    const { rows } = await query<DbPartner>(
      "SELECT id, name, image_url, local_image, website_url FROM partners WHERE status = 'published' ORDER BY sort",
    );
    return rows.map((item) => ({
      id: String(item.id),
      name: item.name,
      image: assetPath(item.image_url, item.local_image, "partners"),
      ...(safeHttpUrl(item.website_url) ? { websiteUrl: safeHttpUrl(item.website_url) } : {}),
    }));
  } catch {
    return platformPartners;
  }
}

interface DbSettings {
  hero_eyebrow_en: string;
  hero_eyebrow_fr: string;
  hero_title_en: string;
  hero_title_fr: string;
  hero_description_en: string;
  hero_description_fr: string;
  contact_email: string;
  secretariat_email: string;
  phone: string;
  address: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { rows } = await query<DbSettings>(
      "SELECT hero_eyebrow_en, hero_eyebrow_fr, hero_title_en, hero_title_fr, hero_description_en, hero_description_fr, contact_email, secretariat_email, phone, address FROM site_settings WHERE id = 1",
    );
    const item = rows[0];
    if (!item) return defaultSiteSettings;
    return {
      heroEyebrowEn: item.hero_eyebrow_en,
      heroEyebrowFr: item.hero_eyebrow_fr,
      heroTitleEn: item.hero_title_en,
      heroTitleFr: item.hero_title_fr,
      heroDescriptionEn: item.hero_description_en,
      heroDescriptionFr: item.hero_description_fr,
      contactEmail: item.contact_email,
      secretariatEmail: item.secretariat_email,
      phone: item.phone,
      address: item.address,
    };
  } catch {
    return defaultSiteSettings;
  }
}

interface DbStatistics {
  year: number;
  summary_en: string;
  summary_fr: string;
  methodology_en: string;
  methodology_fr: string;
  report_url: string | null;
  updated_at: string | null;
}

interface DbStatCategory {
  key: string;
  label_en: string;
  label_fr: string;
  value: string;
  delta_en: string | null;
  delta_fr: string | null;
  description_en: string;
  description_fr: string;
}

export async function getStatistics(): Promise<AnnualStatistics> {
  try {
    const { rows: statRows } = await query<DbStatistics>(
      "SELECT year, summary_en, summary_fr, methodology_en, methodology_fr, report_url, updated_at FROM statistics WHERE id = 1",
    );
    const item = statRows[0];
    if (!item || !Number.isInteger(item.year)) return defaultStatistics;

    const { rows: categoryRows } = await query<DbStatCategory>(
      "SELECT key, label_en, label_fr, value, delta_en, delta_fr, description_en, description_fr FROM statistics_categories WHERE statistics_id = 1 ORDER BY sort",
    );
    if (categoryRows.length === 0) return defaultStatistics;

    const categories: StatCategory[] = categoryRows.map((category) => ({
      key: category.key,
      labelEn: category.label_en,
      labelFr: category.label_fr,
      value: category.value,
      ...(category.delta_en ? { deltaEn: category.delta_en } : {}),
      ...(category.delta_fr ? { deltaFr: category.delta_fr } : {}),
      descriptionEn: category.description_en,
      descriptionFr: category.description_fr,
    }));

    return {
      year: item.year,
      summaryEn: item.summary_en,
      summaryFr: item.summary_fr,
      methodologyEn: item.methodology_en,
      methodologyFr: item.methodology_fr,
      categories,
      reportUrl: safeHttpUrl(item.report_url, "") || "",
      updatedAt: (item.updated_at || "").slice(0, 10),
    };
  } catch {
    return defaultStatistics;
  }
}

export async function getHomeContent(): Promise<HomeContent> {
  const [articles, members, events, partners, settings] = await Promise.all([
    getArticles(), getMembers(), getEvents(), getPartners(), getSiteSettings(),
  ]);
  const hasDatabase = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING);
  return {
    articles,
    members,
    events,
    partners,
    settings,
    source: hasDatabase ? "cms" : "fallback",
  };
}

