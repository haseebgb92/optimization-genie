import {
  getSite,
  getSiteByInstallId,
  logSiteAction,
  saveSiteReport,
  upsertSite
} from "@/lib/db";
import { hashSecret } from "@/lib/security";
import type { HealthStatus, LicenseStatus, Site } from "@/lib/types";

export function getSiteHealthStatus(input: {
  mobileScore: number | null;
  desktopScore: number | null;
  brokenLinksCount: number;
  errors404Count: number;
}): HealthStatus {
  const avg = ((input.mobileScore ?? 0) + (input.desktopScore ?? 0)) / 2;
  if (input.brokenLinksCount > 10 || input.errors404Count > 20 || avg < 40) return "critical";
  if (input.brokenLinksCount > 0 || input.errors404Count > 0 || avg < 75) return "warning";
  return "healthy";
}

export async function createSiteAction(siteId: string, action: string, actor = "system", metadata: Record<string, unknown> = {}) {
  return logSiteAction({ siteId, action, actor, metadata });
}

export async function updateLicenseStatus(siteId: string, status: LicenseStatus, actor = "admin") {
  const site = await getSite(siteId);
  if (!site) return null;
  const updated = await upsertSite({ ...site, licenseStatus: status });
  await createSiteAction(siteId, `license_${status}`, actor, { status });
  return updated;
}

export async function saveHeartbeat(siteId: string, payload: Partial<Site>) {
  const current = await getSite(siteId);
  if (!current) return null;
  const merged = {
    ...current,
    ...payload,
    connectionStatus: "connected" as const,
    healthStatus: getSiteHealthStatus({
      mobileScore: payload.pagespeedMobile ?? current.pagespeedMobile,
      desktopScore: payload.pagespeedDesktop ?? current.pagespeedDesktop,
      brokenLinksCount: payload.brokenLinksCount ?? current.brokenLinksCount,
      errors404Count: payload.errors404Count ?? current.errors404Count
    })
  };
  const updated = await upsertSite(merged);
  await createSiteAction(siteId, "heartbeat_received", "site", {});
  return updated;
}

export async function savePageSpeedReport(
  siteId: string,
  report: { mobileScore: number; desktopScore: number; lcp: number; cls: number; inp: number }
) {
  const row = await saveSiteReport({ siteId, ...report });
  const site = await getSite(siteId);
  if (site) {
    await upsertSite({
      ...site,
      pagespeedMobile: report.mobileScore,
      pagespeedDesktop: report.desktopScore,
      healthStatus: getSiteHealthStatus({
        mobileScore: report.mobileScore,
        desktopScore: report.desktopScore,
        brokenLinksCount: site.brokenLinksCount,
        errors404Count: site.errors404Count
      })
    });
  }
  await createSiteAction(siteId, "pagespeed_report_saved", "site", report);
  return row;
}

export async function registerSite(input: {
  installId: string;
  secretKey: string;
  domain: string;
  siteUrl: string;
  clientName: string;
  wpVersion: string;
  phpVersion: string;
  pluginVersion: string;
  expiresAt?: string | null;
}) {
  const existing = await getSiteByInstallId(input.installId);
  const site = await upsertSite({
    id: existing?.id,
    installId: input.installId,
    secretHash: hashSecret(input.secretKey),
    domain: input.domain,
    siteUrl: input.siteUrl,
    clientName: input.clientName,
    wpVersion: input.wpVersion,
    phpVersion: input.phpVersion,
    pluginVersion: input.pluginVersion,
    licenseStatus: existing?.licenseStatus ?? "active",
    lastHeartbeat: existing?.lastHeartbeat ?? null,
    pagespeedMobile: existing?.pagespeedMobile ?? null,
    pagespeedDesktop: existing?.pagespeedDesktop ?? null,
    brokenLinksCount: existing?.brokenLinksCount ?? 0,
    errors404Count: existing?.errors404Count ?? 0,
    webpStatus: existing?.webpStatus ?? "unknown",
    lastMaintenanceRun: existing?.lastMaintenanceRun ?? null,
    healthStatus: existing?.healthStatus ?? "healthy",
    thumbnailUrl: existing?.thumbnailUrl ?? null,
    serverInfo: existing?.serverInfo ?? null,
    connectionStatus: existing?.connectionStatus ?? "disconnected",
    expiresAt: input.expiresAt ?? existing?.expiresAt ?? null
  });
  await createSiteAction(site.id, existing ? "site_re_registered" : "site_registered", "site", {
    installId: input.installId
  });
  return site;
}
