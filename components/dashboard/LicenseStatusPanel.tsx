"use client";

import type { LicenseStatus } from "@/lib/types";

export function LicenseStatusPanel({ siteId, status }: { siteId: string; status: LicenseStatus }) {
  async function hit(path: "revoke" | "suspend" | "restore") {
    if ((path === "revoke" || path === "suspend") && !window.confirm(`Confirm ${path}?`)) return;
    await fetch(`/api/sites/${siteId}/${path}`, { method: "POST" });
    window.location.reload();
  }
  return (
    <section className="rounded-2xl border bg-white p-4">
      <h2 className="font-semibold text-slate-900">License Status</h2>
      <p className="mt-1 text-sm text-slate-600">Current: {status}</p>
      <div className="mt-3 flex gap-2">
        <button className="rounded-lg border px-3 py-2 text-sm" onClick={() => hit("suspend")}>
          Suspend
        </button>
        <button className="rounded-lg border px-3 py-2 text-sm" onClick={() => hit("restore")}>
          Restore
        </button>
        <button className="rounded-lg border bg-rose-50 px-3 py-2 text-sm text-rose-700" onClick={() => hit("revoke")}>
          Revoke
        </button>
      </div>
    </section>
  );
}
