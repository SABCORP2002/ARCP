import { upload } from "@vercel/blob/client";
import { useState } from "react";

export default function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      onChange(result.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <label className="mb-4 block text-sm">
      <span className="mb-1 block font-medium text-textPrimary">{label}</span>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an arbitrary uploaded/local asset
        <img src={value.startsWith("http") ? value : value} alt="" className="mb-2 h-24 w-auto rounded-lg border border-border object-contain" />
      ) : null}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,application/pdf"
        onChange={onFileChange}
        disabled={uploading}
        className="block w-full text-sm text-textSecondary file:mr-3 file:rounded-lg file:border-0 file:bg-surfaceAlt file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink"
      />
      {uploading ? <p className="mt-1 text-xs text-textSecondary">Uploading…</p> : null}
      {error ? <p className="mt-1 text-xs text-warning">{error}</p> : null}
    </label>
  );
}
