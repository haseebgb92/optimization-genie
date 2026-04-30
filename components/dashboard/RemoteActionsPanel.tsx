"use client";

import { useState } from "react";

const actions = [
  "run_pagespeed_audit",
  "run_broken_link_scan",
  "run_database_cleanup",
  "purge_plugin_cache",
  "purge_cloudflare_cache",
  "run_webp_scan",
  "request_fresh_sync",
  "apply_safe_assistant_mode",
  "pause_access",
  "restore_access",
  "revoke_access"
];

export function RemoteActionsPanel({ siteId }: { siteId: string }) {
  const [busy, setBusy] = useState<string | null>(null);

  async function trigger(action: string) {
    const needsConfirm = action.includes("revoke") || action.includes("cleanup") || action.includes("pause");
    if (needsConfirm && !window.confirm(`Confirm ${action.replaceAll("_", " ")}?`)) return;
    setBusy(action);
    await fetch(`/api/sites/${siteId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    setBusy(null);
    window.location.reload();
  }

  return (
    <section className="rounded-2xl border bg-white p-4">
      <h2 className="font-semibold text-slate-900">Remote Actions</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => trigger(action)}
            disabled={busy === action}
            className="rounded-lg border bg-slate-50 px-3 py-2 text-left text-sm hover:bg-slate-100 disabled:opacity-50"
          >
            {busy === action ? "Running..." : action.replaceAll("_", " ")}
          </button>
        ))}
      </div>
    </section>
  );
}
