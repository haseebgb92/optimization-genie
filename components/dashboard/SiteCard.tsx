import Link from "next/link";
import type { Site } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { WebsiteThumbnail } from "./WebsiteThumbnail";

export function SiteCard({ site }: { site: Site }) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <WebsiteThumbnail src={site.thumbnailUrl} />
      <div className="mt-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{site.clientName}</h3>
        <StatusBadge value={site.licenseStatus} />
      </div>
      <p className="text-sm text-slate-500">{site.domain}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <p>WP {site.wpVersion}</p>
        <p>PHP {site.phpVersion}</p>
        <p>OG {site.pluginVersion}</p>
        <p>{site.lastHeartbeat ? new Date(site.lastHeartbeat).toLocaleString() : "No heartbeat"}</p>
        <p>Mobile {site.pagespeedMobile ?? "-"}</p>
        <p>Desktop {site.pagespeedDesktop ?? "-"}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <StatusBadge value={site.healthStatus} />
        <Link href={`/dashboard/sites/${site.id}`} className="text-sm font-medium text-brand-700">
          Open
        </Link>
      </div>
    </article>
  );
}
