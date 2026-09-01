import { articleCategoryLabels, articlesData, Article, ArticleCategory } from "@/data/articles";
import { memberNations, MemberNation } from "@/data/members";
import { platformEvents, PlatformEvent } from "@/data/events";
import { platformPartners, PlatformPartner } from "@/data/partners";
import { defaultSiteSettings, SiteSettings } from "@/data/site";

const cmsUrl = process.env.CMS_URL?.replace(/\/$/, "");
const cmsToken = process.env.CMS_API_TOKEN;

interface PayloadListResponse<T> {
  docs: T[];
}

type CmsMedia = number | string | { id: number | string; url?: string };

interface CmsArticle {
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
  image: CmsMedia | null;
  local_image: string | null;
  source_url: string;
}

interface CmsMember {
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

interface CmsEvent {
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

interface CmsPartner {
  id: number;
  name: string;
  logo: CmsMedia | null;
  local_image: string | null;
  website_url: string | null;
}

interface CmsSettings {
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

export interface HomeContent {
  articles: Article[];
  members: MemberNation[];
  events: PlatformEvent[];
  partners: PlatformPartner[];
  settings: SiteSettings;
  source: "cms" | "fallback";
}

function assetPath(media: CmsMedia | null, fallback: string, directory: "articles" | "partners") {
  const mediaId = typeof media === "object" && media ? media.id : media;
  if (mediaId !== null && mediaId !== undefined && String(mediaId)) return `/api/media/${encodeURIComponent(String(mediaId))}`;
  if (fallback) return `/assets/${directory}/${fallback}`;
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

async function cmsDocuments<T>(collection: string): Promise<T[]> {
  if (!cmsUrl || !cmsToken) throw new Error("Payload CMS is not configured");
  const response = await fetch(`${cmsUrl}/api/${collection}?where[status][equals]=published&sort=sort&limit=100&depth=1`, {
    headers: { Authorization: `Bearer ${cmsToken}` },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Payload CMS ${collection} returned ${response.status}`);
  return (await response.json() as PayloadListResponse<T>).docs;
}

async function cmsGlobal<T>(slug: string): Promise<T> {
  if (!cmsUrl || !cmsToken) throw new Error("Payload CMS is not configured");
  const response = await fetch(`${cmsUrl}/api/globals/${slug}`, {
    headers: { Authorization: `Bearer ${cmsToken}` },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Payload CMS global ${slug} returned ${response.status}`);
  return await response.json() as T;
}

export async function getArticles(): Promise<Article[]> {
  try {
    const items = await cmsDocuments<CmsArticle>("articles");
    const validItems = items.filter((item) => Number.isInteger(item.id) && item.id > 0);
    return validItems.map((item) => ({
      id: item.id,
      titleEn: item.title_en,
      titleFr: item.title_fr,
      excerptEn: item.excerpt_en,
      excerptFr: item.excerpt_fr,
      contentEn: item.content_en,
      contentFr: item.content_fr,
      category: articleCategoryLabels[item.category] ? item.category : "Innovation",
      author: item.author,
      publishedAt: item.published_at.slice(0, 10),
      image: assetPath(item.image, item.local_image || "", "articles"),
      sourceUrl: safeHttpUrl(item.source_url, "/#articles")!,
    }));
  } catch {
    return articlesData;
  }
}

export async function getMembers(): Promise<MemberNation[]> {
  try {
    const items = await cmsDocuments<CmsMember>("members");
    const validItems = items.filter((item) => /^[a-z0-9-]+$/.test(item.slug) && /^[a-z]{2}$/i.test(item.code));
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

export async function getEvents(): Promise<PlatformEvent[]> {
  try {
    const items = await cmsDocuments<CmsEvent>("events");
    return items.map((item) => ({
      id: item.key || String(item.id),
      titleEn: item.title_en,
      titleFr: item.title_fr,
      startsAt: item.starts_at.slice(0, 10),
      endsAt: item.ends_at.slice(0, 10),
      isPast: new Date(`${item.ends_at.slice(0, 10)}T23:59:59Z`).getTime() < Date.now(),
      dateEn: formatDateRange(item.starts_at, item.ends_at, "en-GB"),
      dateFr: formatDateRange(item.starts_at, item.ends_at, "fr-FR"),
      locationEn: item.location_en,
      locationFr: item.location_fr,
      descriptionEn: item.description_en,
      descriptionFr: item.description_fr,
      link: safeHttpUrl(item.link, "/#events")!,
    }));
  } catch {
    return platformEvents;
  }
}

export async function getPartners(): Promise<PlatformPartner[]> {
  try {
    const items = await cmsDocuments<CmsPartner>("partners");
    return items.map((item) => ({
      id: String(item.id),
      name: item.name,
      image: assetPath(item.logo, item.local_image || "", "partners"),
      ...(safeHttpUrl(item.website_url) ? { websiteUrl: safeHttpUrl(item.website_url) } : {}),
    }));
  } catch {
    return platformPartners;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const item = await cmsGlobal<CmsSettings>("site-settings");
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

export async function getHomeContent(): Promise<HomeContent> {
  const [articles, members, events, partners, settings] = await Promise.all([
    getArticles(), getMembers(), getEvents(), getPartners(), getSiteSettings(),
  ]);
  return {
    articles,
    members,
    events,
    partners,
    settings,
    source: cmsUrl && cmsToken ? "cms" : "fallback",
  };
}

export function contentImageSrc(image: string, directory: "articles" | "partners") {
  if (image.startsWith("/") || image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/assets/${directory}/${image}`;
}
