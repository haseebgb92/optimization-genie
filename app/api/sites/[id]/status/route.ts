import { NextResponse } from "next/server";
import { getSite } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSite(id);
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    id: site.id,
    installId: site.installId,
    licenseStatus: site.licenseStatus,
    healthStatus: site.healthStatus,
    pluginVersion: site.pluginVersion
  });
}
