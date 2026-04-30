import type { SiteAction } from "@/lib/types";

export function MaintenanceHistory({ rows }: { rows: SiteAction[] }) {
  const maintenance = rows.filter((r) => r.action.includes("run_") || r.action.includes("purge"));
  return (
    <section className="rounded-2xl border bg-white p-4">
      <h2 className="font-semibold text-slate-900">Maintenance History</h2>
      <ul className="mt-2 space-y-2 text-sm">
        {maintenance.length === 0 ? <li className="text-slate-500">No maintenance runs yet.</li> : null}
        {maintenance.map((m) => (
          <li key={m.id} className="rounded-lg bg-slate-50 p-2">
            {m.action} - {new Date(m.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </section>
  );
}
