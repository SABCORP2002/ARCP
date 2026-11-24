import { FormEvent, useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { withAdminPage } from "@/lib/withAdminPage";
import { adminFetch } from "@/lib/adminApi";

export const getServerSideProps = withAdminPage();

interface Category {
  key: string;
  label_en: string;
  label_fr: string;
  value: string;
  delta_en: string;
  delta_fr: string;
  description_en: string;
  description_fr: string;
}

const emptyCategory: Category = {
  key: "",
  label_en: "",
  label_fr: "",
  value: "",
  delta_en: "",
  delta_fr: "",
  description_en: "",
  description_fr: "",
};

export default function AdminStatistics() {
  const [year, setYear] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [summaryEn, setSummaryEn] = useState("");
  const [summaryFr, setSummaryFr] = useState("");
  const [methodologyEn, setMethodologyEn] = useState("");
  const [methodologyFr, setMethodologyFr] = useState("");
  const [reportUrl, setReportUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const data = await adminFetch<{ doc: Record<string, string> | null; categories: Category[] }>("/api/admin/statistics");
      if (data.doc) {
        setYear(String(data.doc.year ?? ""));
        setUpdatedAt(data.doc.updated_at || "");
        setSummaryEn(data.doc.summary_en || "");
        setSummaryFr(data.doc.summary_fr || "");
        setMethodologyEn(data.doc.methodology_en || "");
        setMethodologyFr(data.doc.methodology_fr || "");
        setReportUrl(data.doc.report_url || "");
      }
      setCategories(data.categories.length ? data.categories : [{ ...emptyCategory }]);
      setLoading(false);
    })();
  }, []);

  const updateCategory = (index: number, key: keyof Category, value: string) => {
    setCategories((prev) => prev.map((category, i) => (i === index ? { ...category, [key]: value } : category)));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await adminFetch("/api/admin/statistics", {
        method: "PUT",
        body: JSON.stringify({
          year: Number(year),
          updated_at: updatedAt,
          summary_en: summaryEn,
          summary_fr: summaryFr,
          methodology_en: methodologyEn,
          methodology_fr: methodologyFr,
          report_url: reportUrl,
          categories,
        }),
      });
      setMessage("Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Statistics">
        <p className="text-sm text-textSecondary">Loading…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Statistics">
      <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-textPrimary">Year</span>
              <input
                type="number"
                required
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-textPrimary">Updated at</span>
              <input
                type="date"
                value={updatedAt}
                onChange={(event) => setUpdatedAt(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            </label>
          </div>
          <label className="mb-4 mt-4 block text-sm">
            <span className="mb-1 block font-medium text-textPrimary">Summary (EN)</span>
            <textarea required rows={3} value={summaryEn} onChange={(event) => setSummaryEn(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <label className="mb-4 block text-sm">
            <span className="mb-1 block font-medium text-textPrimary">Summary (FR)</span>
            <textarea required rows={3} value={summaryFr} onChange={(event) => setSummaryFr(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <label className="mb-4 block text-sm">
            <span className="mb-1 block font-medium text-textPrimary">Methodology (EN)</span>
            <textarea required rows={3} value={methodologyEn} onChange={(event) => setMethodologyEn(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <label className="mb-4 block text-sm">
            <span className="mb-1 block font-medium text-textPrimary">Methodology (FR)</span>
            <textarea required rows={3} value={methodologyFr} onChange={(event) => setMethodologyFr(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary" />
          </label>
          <ImageUploadField label="Report (PDF)" value={reportUrl} onChange={setReportUrl} />
        </div>

        <div>
          <h2 className="mb-3 font-heading text-lg font-semibold text-ink">Categories</h2>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="rounded-2xl border border-border bg-surface p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-textSecondary">Category {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => setCategories((prev) => prev.filter((_, i) => i !== index))}
                    className="text-xs text-warning hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input placeholder="key" required value={category.key} onChange={(e) => updateCategory(index, "key", e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  <input placeholder="value (e.g. 20, 140+)" required value={category.value} onChange={(e) => updateCategory(index, "value", e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  <input placeholder="label (EN)" required value={category.label_en} onChange={(e) => updateCategory(index, "label_en", e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  <input placeholder="label (FR)" required value={category.label_fr} onChange={(e) => updateCategory(index, "label_fr", e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  <input placeholder="delta (EN, optional)" value={category.delta_en} onChange={(e) => updateCategory(index, "delta_en", e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  <input placeholder="delta (FR, optional)" value={category.delta_fr} onChange={(e) => updateCategory(index, "delta_fr", e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  <textarea placeholder="description (EN)" required rows={2} value={category.description_en} onChange={(e) => updateCategory(index, "description_en", e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2" />
                  <textarea placeholder="description (FR)" required rows={2} value={category.description_fr} onChange={(e) => updateCategory(index, "description_fr", e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2" />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCategories((prev) => [...prev, { ...emptyCategory }])}
            className="mt-3 rounded-lg border border-border px-4 py-2 text-sm text-textSecondary hover:bg-surfaceAlt"
          >
            Add category
          </button>
        </div>

        {message ? <p className="text-sm text-textSecondary">{message}</p> : null}
        <button type="submit" disabled={saving} className="rounded-lg bg-cta px-4 py-2 text-sm font-medium text-white hover:bg-ctaHover disabled:opacity-60">
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </AdminLayout>
  );
}
