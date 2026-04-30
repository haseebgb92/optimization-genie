import type { SiteAction } from "@/lib/types";

export function ActivityLog({ rows }: { rows: SiteAction[] }) {
  return (
    <section className="rounded-2xl border bg-white p-4">
      <h2 className="font-semibold text-slate-900">Activity Log</h2>
      <ul className="mt-2 space-y-2">
        {rows.length === 0 ? <li className="text-sm text-slate-500">No activity yet.</li> : null}
        {rows.map((row) => (
          <li key={row.id} className="rounded-lg bg-slate-50 p-2 text-sm">
            <span className="font-medium">{row.action}</span> by {row.actor} at {new Date(row.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </section>
  );
}
