import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { withAdminPage } from "@/lib/withAdminPage";
import { adminFetch } from "@/lib/adminApi";

export const getServerSideProps = withAdminPage();

type RequestType = "contact" | "join" | "newsletter";

const TABS: { type: RequestType; label: string; statuses: string[] }[] = [
  { type: "contact", label: "Contact", statuses: ["new", "processed", "spam"] },
  { type: "join", label: "Membership", statuses: ["new", "processed", "rejected", "spam"] },
  { type: "newsletter", label: "Newsletter", statuses: ["new", "subscribed", "unsubscribed"] },
];

type Row = Record<string, unknown> & { id: number; request_status: string; created_at: string };

export default function AdminRequests() {
  const [active, setActive] = useState<RequestType>("contact");
  const [rows, setRows] = useState<Row[] | null>(null);

  const load = async (type: RequestType) => {
    setRows(null);
    const data = await adminFetch<{ docs: Row[] }>(`/api/admin/requests?type=${type}`);
    setRows(data.docs);
  };

  useEffect(() => {
    const timer = setTimeout(() => load(active), 0);
    return () => clearTimeout(timer);
  }, [active]);

  const tab = TABS.find((t) => t.type === active)!;

  const setStatus = async (id: number, status: string) => {
    await adminFetch(`/api/admin/requests/${id}?type=${active}`, {
      method: "PATCH",
      body: JSON.stringify({ request_status: status }),
    });
    load(active);
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this submission?")) return;
    await adminFetch(`/api/admin/requests/${id}?type=${active}`, { method: "DELETE" });
    load(active);
  };

  return (
    <AdminLayout title="Requests">
      <div className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.type}
            type="button"
            onClick={() => setActive(t.type)}
            className={`rounded-lg px-3 py-2 text-sm ${active === t.type ? "bg-cta text-white" : "border border-border text-textSecondary hover:bg-surfaceAlt"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {rows === null ? <p className="text-sm text-textSecondary">Loading…</p> : null}
        {rows && rows.length === 0 ? <p className="text-sm text-textSecondary">No submissions yet.</p> : null}
        {(rows || []).map((row) => (
          <div key={row.id} className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-textPrimary">
                {String(row.full_name || row.email || "—")} {row.email && row.full_name ? `· ${row.email}` : ""}
              </p>
              <span className="text-xs text-textSecondary">{new Date(row.created_at).toLocaleString()}</span>
            </div>
            <dl className="mb-3 grid gap-x-4 gap-y-1 text-sm text-textSecondary sm:grid-cols-2">
              {Object.entries(row)
                .filter(([key]) => !["id", "created_at", "request_status", "full_name", "email"].includes(key))
                .map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-medium text-textPrimary">{key}</dt>
                    <dd className="break-words">{String(value ?? "—")}</dd>
                  </div>
                ))}
            </dl>
            <div className="flex items-center gap-3">
              <select
                value={row.request_status}
                onChange={(event) => setStatus(row.id, event.target.value)}
                className="rounded-lg border border-border bg-background px-2 py-1 text-sm"
              >
                {tab.statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => remove(row.id)} className="text-sm text-warning hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
