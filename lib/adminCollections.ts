// Registry driving the generic collection admin (Articles / Members / Events
// / Partners). These four are structurally the same — status/sort plus a
// flat set of fields and an optional image — so one registry-driven set of
// routes/pages replaces four near-duplicate CRUD implementations. Adding a
// fifth simple collection later is one entry here, not a new set of files.
export type FieldType = "text" | "textarea" | "select" | "date" | "number" | "image";

export interface CollectionField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** Image fields: which /assets/{dir}/ the local_image fallback resolves against. */
  imageDirectory?: "articles" | "partners";
}

export interface CollectionDef {
  slug: string;
  table: string;
  title: string;
  orderBy: string;
  listColumns: string[];
  fields: CollectionField[];
}

const statusField: CollectionField = {
  key: "status",
  label: "Status",
  type: "select",
  required: true,
  options: [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ],
};

const sortField: CollectionField = { key: "sort", label: "Sort order", type: "number", required: true };

export const collections: Record<string, CollectionDef> = {
  articles: {
    slug: "articles",
    table: "articles",
    title: "Articles",
    orderBy: "sort",
    listColumns: ["title_fr", "category", "status", "published_at"],
    fields: [
      statusField,
      sortField,
      { key: "title_en", label: "Title (EN)", type: "text", required: true },
      { key: "title_fr", label: "Title (FR)", type: "text", required: true },
      { key: "excerpt_en", label: "Excerpt (EN)", type: "textarea", required: true },
      { key: "excerpt_fr", label: "Excerpt (FR)", type: "textarea", required: true },
      { key: "content_en", label: "Content (EN)", type: "textarea", required: true },
      { key: "content_fr", label: "Content (FR)", type: "textarea", required: true },
      {
        key: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { value: "Innovation", label: "Innovation" },
          { value: "Climate & Tech", label: "Climate & Tech" },
          { value: "Inclusion", label: "Inclusion" },
          { value: "Tech & Society", label: "Tech & Society" },
        ],
      },
      { key: "author", label: "Author", type: "text", required: true },
      { key: "published_at", label: "Published at", type: "date", required: true },
      { key: "image_url", label: "Image", type: "image", imageDirectory: "articles" },
      { key: "source_url", label: "Source URL", type: "text", required: true },
    ],
  },
  members: {
    slug: "members",
    table: "members",
    title: "Members",
    orderBy: "sort",
    listColumns: ["name_fr", "code", "member_status", "status"],
    fields: [
      statusField,
      sortField,
      { key: "slug", label: "Slug", type: "text", required: true },
      { key: "code", label: "ISO country code", type: "text", required: true },
      { key: "name_en", label: "Name (EN)", type: "text", required: true },
      { key: "name_fr", label: "Name (FR)", type: "text", required: true },
      {
        key: "member_status",
        label: "Membership status",
        type: "select",
        required: true,
        options: [
          { value: "verified", label: "Verified" },
          { value: "onboarding", label: "Onboarding" },
        ],
      },
      { key: "focus_en", label: "Focus (EN)", type: "text", required: true },
      { key: "focus_fr", label: "Focus (FR)", type: "text", required: true },
      { key: "description_en", label: "Description (EN)", type: "textarea" },
      { key: "description_fr", label: "Description (FR)", type: "textarea" },
      { key: "about_en", label: "About (EN)", type: "textarea" },
      { key: "about_fr", label: "About (FR)", type: "textarea" },
      { key: "association_name_en", label: "Association name (EN)", type: "text" },
      { key: "association_name_fr", label: "Association name (FR)", type: "text" },
      { key: "website_url", label: "Website URL", type: "text" },
    ],
  },
  events: {
    slug: "events",
    table: "events",
    title: "Events",
    orderBy: "sort",
    listColumns: ["title_fr", "starts_at", "status"],
    fields: [
      statusField,
      sortField,
      { key: "key", label: "Internal key", type: "text", required: true },
      { key: "title_en", label: "Title (EN)", type: "text", required: true },
      { key: "title_fr", label: "Title (FR)", type: "text", required: true },
      { key: "starts_at", label: "Starts at", type: "date", required: true },
      { key: "ends_at", label: "Ends at", type: "date", required: true },
      { key: "location_en", label: "Location (EN)", type: "text", required: true },
      { key: "location_fr", label: "Location (FR)", type: "text", required: true },
      { key: "description_en", label: "Description (EN)", type: "textarea", required: true },
      { key: "description_fr", label: "Description (FR)", type: "textarea", required: true },
      { key: "link", label: "Link", type: "text", required: true },
    ],
  },
  partners: {
    slug: "partners",
    table: "partners",
    title: "Partners",
    orderBy: "sort",
    listColumns: ["name", "status"],
    fields: [
      statusField,
      sortField,
      { key: "name", label: "Name", type: "text", required: true },
      { key: "website_url", label: "Website URL", type: "text" },
      { key: "image_url", label: "Logo", type: "image", imageDirectory: "partners" },
    ],
  },
};

export function getCollection(slug: string): CollectionDef | undefined {
  return Object.prototype.hasOwnProperty.call(collections, slug) ? collections[slug] : undefined;
}
