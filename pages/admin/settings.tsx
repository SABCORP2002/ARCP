import { FormEvent, useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { withAdminPage } from "@/lib/withAdminPage";
import { adminFetch } from "@/lib/adminApi";

export const getServerSideProps = withAdminPage();

const FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "hero_eyebrow_en", label: "Hero eyebrow (EN)" },
  { key: "hero_eyebrow_fr", label: "Hero eyebrow (FR)" },
  { key: "hero_title_en", label: "Hero title (EN)" },
  { key: "hero_title_fr", label: "Hero title (FR)" },
  { key: "hero_description_en", label: "Hero description (EN)", multiline: true },
  { key: "hero_description_fr", label: "Hero description (FR)", multiline: true },
  { key: "contact_email", label: "Contact email" },
  { key: "secretariat_email", label: "Secretariat email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address", multiline: true },
];

export default function AdminSettings() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const data = await adminFetch<{ doc: Record<string, string> | null }>("/api/admin/settings");
      const next: Record<string, string> = {};
      FIELDS.forEach((field) => {
        next[field.key] = data.doc?.[field.key] || "";
      });
      setForm(next);
      setLoading(false);
    })();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await adminFetch("/api/admin/settings", { method: "PUT", body: JSON.stringify(form) });
      setMessage("Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Site settings">
        <p className="text-sm text-textSecondary">Loading…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site settings">
      <form onSubmit={onSubmit} className="max-w-2xl rounded-2xl border border-border bg-surface p-6">
        {FIELDS.map((field) => (
          <label key={field.key} className="mb-4 block text-sm">
            <span className="mb-1 block font-medium text-textPrimary">{field.label}</span>
            {field.multiline ? (
              <textarea
                required
                rows={3}
                value={form[field.key] || ""}
                onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            ) : (
              <input
                type="text"
                required
                value={form[field.key] || ""}
                onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            )}
          </label>
        ))}
        {message ? <p className="mb-4 text-sm text-textSecondary">{message}</p> : null}
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-cta px-4 py-2 text-sm font-medium text-white hover:bg-ctaHover disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </AdminLayout>
  );
}
