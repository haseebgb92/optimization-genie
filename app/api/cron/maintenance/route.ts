import { NextResponse } from "next/server";
import { listSites } from "@/lib/db";
import { createSiteAction } from "@/lib/site-service";

function authorized(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token && token === process.env.CRON_SECRET;
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sites = await listSites();
  for (const site of sites) {
    await createSiteAction(site.id, "cron_maintenance_scheduled", "cron");
  }
  return NextResponse.json({ ok: true, processed: sites.length });
}
