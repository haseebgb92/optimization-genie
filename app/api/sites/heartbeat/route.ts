import { NextResponse } from "next/server";
import { z } from "zod";
import { getSiteByInstallId } from "@/lib/db";
import { hashSecret, verifyHmacSignature } from "@/lib/security";
import { saveHeartbeat } from "@/lib/site-service";

const schema = z.object({
  installId: z.string(),
  wpVersion: z.string().optional(),
  phpVersion: z.string().optional(),
  pluginVersion: z.string().optional(),
  brokenLinksCount: z.number().int().nonnegative().optional(),
  errors404Count: z.number().int().nonnegative().optional(),
  webpStatus: z.enum(["enabled", "disabled", "unknown"]).optional(),
  thumbnailUrl: z.string().url().optional(),
  serverInfo: z.string().optional()
});

export async function POST(req: Request) {
  const body = await req.text();
  const payload = schema.safeParse(JSON.parse(body));
  if (!payload.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const site = await getSiteByInstallId(payload.data.installId);
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

  const updated = await saveHeartbeat(site.id, { ...payload.data, lastHeartbeat: new Date().toISOString() });
  return NextResponse.json({ ok: true, status: updated?.licenseStatus ?? "active" });
}
