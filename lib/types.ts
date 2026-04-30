export type LicenseStatus = "active" | "suspended" | "revoked" | "expired";
export type HealthStatus = "healthy" | "warning" | "critical";

export type Site = {
  id: string;
  installId: string;
  domain: string;
  siteUrl: string;
  clientName: string;
  secretHash: string;
  wpVersion: string;
  phpVersion: string;
  pluginVersion: string;
  licenseStatus: LicenseStatus;
  lastHeartbeat: string | null;
  pagespeedMobile: number | null;
  pagespeedDesktop: number | null;
  brokenLinksCount: number;
  errors404Count: number;
  webpStatus: "enabled" | "disabled" | "unknown";
  lastMaintenanceRun: string | null;
  healthStatus: HealthStatus;
  thumbnailUrl: string | null;
  serverInfo: string | null;
  connectionStatus: "connected" | "disconnected";
  expiresAt: string | null;
};

export type SiteAction = {
  id: string;
  siteId: string;
  action: string;
  actor: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type PageSpeedReport = {
  id: string;
  siteId: string;
  mobileScore: number;
  desktopScore: number;
  lcp: number;
  cls: number;
  inp: number;
  createdAt: string;
};
