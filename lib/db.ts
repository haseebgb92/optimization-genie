import crypto from "node:crypto";
import type { PageSpeedReport, Site, SiteAction } from "@/lib/types";

const sites = new Map<string, Site>();
const actions: SiteAction[] = [];
const reports: PageSpeedReport[] = [];

function id() {
  return crypto.randomUUID();
}

export async function upsertSite(site: Omit<Site, "id"> & { id?: string }) {
  const existing =
    site.id ? sites.get(site.id) : [...sites.values()].find((s) => s.installId === site.installId);
  const record: Site = {
    ...site,
    id: existing?.id ?? site.id ?? id()
  };
  sites.set(record.id, record);
  return record;
}

export async function listSites() {
  return [...sites.values()].sort((a, b) => (a.lastHeartbeat ?? "").localeCompare(b.lastHeartbeat ?? "")).reverse();
}

export async function getSite(siteId: string) {
  return sites.get(siteId) ?? null;
}

export async function getSiteByInstallId(installId: string) {
  return [...sites.values()].find((s) => s.installId === installId) ?? null;
}

export async function logSiteAction(payload: Omit<SiteAction, "id" | "createdAt">) {
  const row: SiteAction = { ...payload, id: id(), createdAt: new Date().toISOString() };
  actions.push(row);
  return row;
}

export async function listSiteActions(siteId: string) {
  return actions.filter((a) => a.siteId === siteId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveSiteReport(report: Omit<PageSpeedReport, "id" | "createdAt">) {
  const row: PageSpeedReport = { ...report, id: id(), createdAt: new Date().toISOString() };
  reports.push(row);
  return row;
}

export async function listSiteReports(siteId: string) {
  return reports.filter((r) => r.siteId === siteId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
