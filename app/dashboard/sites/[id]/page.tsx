import { notFound } from "next/navigation";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { CoreVitalsPanel } from "@/components/dashboard/CoreVitalsPanel";
import { HealthScore } from "@/components/dashboard/HealthScore";
import { LicenseStatusPanel } from "@/components/dashboard/LicenseStatusPanel";
import { MaintenanceHistory } from "@/components/dashboard/MaintenanceHistory";
import { PageSpeedPanel } from "@/components/dashboard/PageSpeedPanel";
import { RemoteActionsPanel } from "@/components/dashboard/RemoteActionsPanel";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { WebsiteThumbnail } from "@/components/dashboard/WebsiteThumbnail";
import { getSite, listSiteActions, listSiteReports } from "@/lib/db";

export default async function SiteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSite(id);
  if (!site) notFound();
  const actions = await listSiteActions(site.id);
  const latestReport = (await listSiteReports(site.id))[0];

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{site.clientName}</h1>
          <p className="text-slate-500">{site.siteUrl}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge value={site.licenseStatus} />
          <StatusBadge value={site.healthStatus} />
        </div>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <WebsiteThumbnail src={site.thumbnailUrl} />
          <PageSpeedPanel mobile={site.pagespeedMobile} desktop={site.pagespeedDesktop} />
          <CoreVitalsPanel lcp={latestReport?.lcp} cls={latestReport?.cls} inp={latestReport?.inp} />
          <RemoteActionsPanel siteId={site.id} />
          <ActivityLog rows={actions} />
        </div>
        <div className="space-y-4">
          <HealthScore mobile={site.pagespeedMobile} desktop={site.pagespeedDesktop} />
          <LicenseStatusPanel siteId={site.id} status={site.licenseStatus} />
          <section className="rounded-2xl border bg-white p-4 text-sm">
            <h2 className="mb-2 font-semibold">Overview</h2>
            <p>Connection: {site.connectionStatus}</p>
            <p>Last Sync: {site.lastHeartbeat ? new Date(site.lastHeartbeat).toLocaleString() : "-"}</p>
            <p>License Expires: {site.expiresAt ? new Date(site.expiresAt).toLocaleDateString() : "-"}</p>
            <p>Plugin: {site.pluginVersion}</p>
            <p>WordPress: {site.wpVersion}</p>
            <p>PHP: {site.phpVersion}</p>
            <p>Server: {site.serverInfo ?? "-"}</p>
            <p>Broken Links: {site.brokenLinksCount}</p>
            <p>404 Errors: {site.errors404Count}</p>
            <p>WebP: {site.webpStatus}</p>
          </section>
          <MaintenanceHistory rows={actions} />
        </div>
      </div>
    </section>
  );
}
