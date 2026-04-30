import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api-auth";
import { updateLicenseStatus } from "@/lib/site-service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const site = await updateLicenseStatus(id, "suspended");
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, licenseStatus: site.licenseStatus });
}
