import { cn } from "@/lib/utils";
import type { HealthStatus, LicenseStatus } from "@/lib/types";

export function StatusBadge({ value }: { value: LicenseStatus | HealthStatus }) {
  const map: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    suspended: "bg-amber-100 text-amber-700",
    revoked: "bg-rose-100 text-rose-700",
    expired: "bg-zinc-200 text-zinc-700",
    healthy: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    critical: "bg-rose-100 text-rose-700"
  };
  return <span className={cn("rounded-full px-2 py-1 text-xs font-semibold capitalize", map[value])}>{value}</span>;
}
