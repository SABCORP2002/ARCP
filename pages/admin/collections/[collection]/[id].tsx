import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { withAdminPage } from "@/lib/withAdminPage";
import { adminFetch } from "@/lib/adminApi";
import { getCollection } from "@/lib/adminCollections";

export const getServerSideProps: GetServerSideProps = withAdminPage(async (context) => {
  const slug = typeof context.params?.collection === "string" ? context.params.collection : "";
  const id = typeof context.params?.id === "string" ? context.params.id : "";
  const collection = getCollection(slug);
  if (!collection) return { notFound: true };
  return { props: { slug, id } };
});

type FormState = Record<string, string>;

export default function CollectionEdit({ slug, id }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const collection = getCollection(slug)!;
  const isNew = id === "new";
  const [form, setForm] = useState<FormState>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      const defaults: FormState = {};
      collection.fields.forEach((field) => {
        defaults[field.key] = field.key === "status" ? "draft" : field.key === "sort" ? "0" : "";
      });
      const timer = setTimeout(() => setForm(defaults), 0);
      return () => clearTimeout(timer);
    }
    (async () => {
      try {
        const data = await adminFetch<{ doc: Record<string, unknown> }>(`/api/admin/collections/${slug}/${id}`);
        const next: FormState = {};
        collection.fields.forEach((field) => {
          const value = data.doc[field.key];
          next[field.key] = value === null || value === undefined ? "" : String(value);
        });
        setForm(next);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Could not load item");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, id]);

  const setField = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        await adminFetch(`/api/admin/collections/${slug}`, { method: "POST", body: JSON.stringify(form) });
      } else {
        await adminFetch(`/api/admin/collections/${slug}/${id}`, { method: "PUT", body: JSON.stringify(form) });
      }
      router.push(`/admin/collections/${slug}`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={collection.title}>
        <p className="text-sm text-textSecondary">Loading…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`${isNew ? "New" : "Edit"} ${collection.title.slice(0, -1).toLowerCase()}`}>
      <form onSubmit={onSubmit} className="max-w-2xl rounded-2xl border border-border bg-surface p-6">
        {collection.fields.map((field) => {
          const value = form[field.key] ?? "";
          if (field.type === "image") {
            return <ImageUploadField key={field.key} label={field.label} value={value} onChange={(url) => setField(field.key, url)} />;
          }
          if (field.type === "select") {
            return (
              <label key={field.key} className="mb-4 block text-sm">
                <span className="mb-1 block font-medium text-textPrimary">{field.label}</span>
                <select
                  required={field.required}
                  value={value}
                  onChange={(event) => setField(field.key, event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
                >
                  {(field.options || []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          }
          if (field.type === "textarea") {
            return (
              <label key={field.key} className="mb-4 block text-sm">
                <span className="mb-1 block font-medium text-textPrimary">{field.label}</span>
                <textarea
                  required={field.required}
                  rows={4}
                  value={value}
                  onChange={(event) => setField(field.key, event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
                />
              </label>
            );
          }
          return (
            <label key={field.key} className="mb-4 block text-sm">
              <span className="mb-1 block font-medium text-textPrimary">{field.label}</span>
              <input
                type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                required={field.required}
                value={value}
                onChange={(event) => setField(field.key, event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            </label>
          );
        })}
        {error ? <p className="mb-4 text-sm text-warning">{error}</p> : null}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-cta px-4 py-2 text-sm font-medium text-white hover:bg-ctaHover disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/collections/${slug}`)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-textSecondary hover:bg-surfaceAlt"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
