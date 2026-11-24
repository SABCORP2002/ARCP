import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/collections/articles", label: "Articles" },
  { href: "/admin/collections/members", label: "Members" },
  { href: "/admin/collections/events", label: "Events" },
  { href: "/admin/collections/partners", label: "Partners" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/statistics", label: "Statistics" },
  { href: "/admin/requests", label: "Requests" },
];

export default function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary">
      <Head>
        <title>{title} | ARCP Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="flex min-h-screen">
        <aside className="hidden w-60 flex-none border-r border-border bg-surface p-5 md:block">
          <p className="mb-6 font-heading text-sm font-semibold uppercase tracking-wide text-ink">ARCP Admin</p>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-surfaceAlt font-semibold text-ink" : "text-textSecondary hover:bg-surfaceAlt"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="mt-6 w-full rounded-lg border border-border px-3 py-2 text-left text-sm text-textSecondary hover:bg-surfaceAlt"
          >
            Log out
          </button>
        </aside>
        <main className="flex-1 p-6 md:p-10">
          <h1 className="mb-6 font-heading text-2xl font-semibold text-ink">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
