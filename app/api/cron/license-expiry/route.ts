import { NextResponse } from "next/server";
import { listSites } from "@/lib/db";
import { updateLicenseStatus } from "@/lib/site-service";

function authorized(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token && token === process.env.CRON_SECRET;
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sites = await listSites();
  let expired = 0;
  for (const site of sites) {
    if (!site.expiresAt) continue;
    if (Date.now() > new Date(site.expiresAt).getTime() && site.licenseStatus !== "expired") {
      await updateLicenseStatus(site.id, "expired", "cron");
      expired += 1;
    }
  }
  return NextResponse.json({ ok: true, expired });
}
