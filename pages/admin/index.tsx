import type { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { withAdminPage } from "@/lib/withAdminPage";
import { query } from "@/lib/db";

export const getServerSideProps = withAdminPage(async () => {
  const [articles, members, events, partners, contact, join, newsletter] = await Promise.all([
    query<{ count: string }>("SELECT count(*) FROM articles"),
    query<{ count: string }>("SELECT count(*) FROM members"),
    query<{ count: string }>("SELECT count(*) FROM events"),
    query<{ count: string }>("SELECT count(*) FROM partners"),
    query<{ count: string }>("SELECT count(*) FROM contact_requests WHERE request_status = 'new'"),
    query<{ count: string }>("SELECT count(*) FROM membership_requests WHERE request_status = 'new'"),
    query<{ count: string }>("SELECT count(*) FROM newsletter_subscriptions WHERE request_status = 'new'"),
  ]);

  return {
    props: {
      counts: {
        articles: Number(articles.rows[0].count),
        members: Number(members.rows[0].count),
        events: Number(events.rows[0].count),
        partners: Number(partners.rows[0].count),
      },
      pendingRequests: Number(contact.rows[0].count) + Number(join.rows[0].count) + Number(newsletter.rows[0].count),
    },
  };
});

export default function AdminDashboard({ counts, pendingRequests }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const tiles = [
    { href: "/admin/collections/articles", label: "Articles", value: counts.articles },
    { href: "/admin/collections/members", label: "Members", value: counts.members },
    { href: "/admin/collections/events", label: "Events", value: counts.events },
    { href: "/admin/collections/partners", label: "Partners", value: counts.partners },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-textSecondary">{tile.label}</p>
            <p className="mt-1 font-heading text-3xl font-semibold text-ink">{tile.value}</p>
          </Link>
        ))}
      </div>
      <Link
        href="/admin/requests"
        className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-surfaceAlt p-5"
      >
        <span className="text-sm font-medium text-textPrimary">New form submissions awaiting review</span>
        <span className="font-heading text-2xl font-semibold text-primary">{pendingRequests}</span>
      </Link>
    </AdminLayout>
  );
}
