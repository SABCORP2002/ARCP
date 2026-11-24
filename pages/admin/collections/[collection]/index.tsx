import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import { withAdminPage } from "@/lib/withAdminPage";
import { adminFetch } from "@/lib/adminApi";
import { getCollection } from "@/lib/adminCollections";

export const getServerSideProps: GetServerSideProps = withAdminPage(async (context) => {
  const slug = typeof context.params?.collection === "string" ? context.params.collection : "";
  const collection = getCollection(slug);
  if (!collection) return { notFound: true };
  return { props: { slug } };
});

type Row = Record<string, unknown>;

export default function CollectionList({ slug }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const collection = getCollection(slug)!;
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await adminFetch<{ docs: Row[] }>(`/api/admin/collections/${slug}`);
      setRows(data.docs);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Could not load");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setRows(null);
      load();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const remove = async (id: number) => {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    await adminFetch(`/api/admin/collections/${slug}/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <AdminLayout title={collection.title}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-textSecondary">{rows ? `${rows.length} item(s)` : "Loading…"}</p>
        <button
          type="button"
          onClick={() => router.push(`/admin/collections/${slug}/new`)}
          className="rounded-lg bg-cta px-4 py-2 text-sm font-medium text-white hover:bg-ctaHover"
        >
          New {collection.title.slice(0, -1)}
        </button>
      </div>
      {error ? <p className="mb-4 text-sm text-warning">{error}</p> : null}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-textSecondary">
              {collection.listColumns.map((column) => (
                <th key={column} className="whitespace-nowrap px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(rows || []).map((row) => (
              <tr key={String(row.id)} className="border-b border-border last:border-0">
                {collection.listColumns.map((column) => (
                  <td key={column} className="max-w-xs truncate px-4 py-3 text-textPrimary">
                    {String(row[column] ?? "")}
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link href={`/admin/collections/${slug}/${row.id}`} className="mr-3 text-primary hover:underline">
                    Edit
                  </Link>
                  <button type="button" onClick={() => remove(Number(row.id))} className="text-warning hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows && rows.length === 0 ? (
              <tr>
                <td colSpan={collection.listColumns.length + 1} className="px-4 py-6 text-center text-textSecondary">
                  No items yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
