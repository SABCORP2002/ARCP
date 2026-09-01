import type { GetServerSideProps } from "next";
import { getArticles, getMembers } from "@/lib/cms";

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;",
  })[character] || character);
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://africanrobotplatform.org").replace(/\/$/, "");
  const [articles, members] = await Promise.all([getArticles(), getMembers()]);
  const paths = [
    "/", "/join/", "/contact/", "/privacy/", "/terms/",
    ...articles.map((article) => `/articles/${article.id}/`),
    ...members.map((member) => `/members/${member.slug}/`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((route) => `  <url><loc>${escapeXml(`${siteUrl}${route}`)}</loc></url>`).join("\n")}\n</urlset>\n`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
