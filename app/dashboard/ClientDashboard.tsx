"use client";

import { useMemo, useState } from "react";
import { SiteCard } from "@/components/dashboard/SiteCard";
import type { Site } from "@/lib/types";

export function ClientDashboard({ initialSites }: { initialSites: Site[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const sites = useMemo(() => {
    return initialSites.filter((site) => {
      const matchesQ =
        !q ||
        site.clientName.toLowerCase().includes(q.toLowerCase()) ||
        site.domain.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = status === "all" || site.licenseStatus === status;
      return matchesQ && matchesStatus;
    });
  }, [initialSites, q, status]);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by client or domain"
          className="min-w-72 rounded-lg border bg-white px-3 py-2"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2"
        >
          <option value="all">All licenses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="revoked">Revoked</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      {sites.length === 0 ? <p className="text-slate-500">No websites match the current filters.</p> : null}
      <div className="grid gap-4 lg:grid-cols-3">
        {sites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </>
  );
}
