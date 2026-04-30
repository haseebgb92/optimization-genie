import { NextResponse } from "next/server";
import { getSiteByInstallId } from "@/lib/db";
import { hashSecret, verifyHmacSignature } from "@/lib/security";

export async function POST(req: Request) {
  const body = await req.text();
  const payload = JSON.parse(body) as { installId?: string };
  if (!payload.installId) return NextResponse.json({ error: "installId required" }, { status: 400 });
  const site = await getSiteByInstallId(payload.installId);
  if (!site) return NextResponse.json({ error: "Unknown install_id" }, { status: 404 });

  const providedSecret = req.headers.get("x-og-secret-key");
  if (!providedSecret || hashSecret(providedSecret) !== site.secretHash) {
    return NextResponse.json({ error: "Invalid site secret" }, { status: 401 });
  }
  const signed = verifyHmacSignature({
    body,
    signature: req.headers.get("x-og-signature"),
    timestamp: req.headers.get("x-og-timestamp"),
    secret: providedSecret
  });
  if (!signed) return NextResponse.json({ error: "Invalid or expired signature" }, { status: 401 });

  return NextResponse.json({
    installId: site.installId,
    licenseStatus: site.licenseStatus,
    connectionStatus: site.connectionStatus,
    pluginLockRequired: site.licenseStatus === "revoked"
  });
}
