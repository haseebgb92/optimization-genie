import { NextResponse } from "next/server";
import { z } from "zod";
import { getSiteByInstallId } from "@/lib/db";
import { hashSecret, verifyHmacSignature } from "@/lib/security";
import { savePageSpeedReport } from "@/lib/site-service";

const schema = z.object({
  installId: z.string(),
  mobileScore: z.number().min(0).max(100),
  desktopScore: z.number().min(0).max(100),
  lcp: z.number(),
  cls: z.number(),
  inp: z.number()
});

export async function POST(req: Request) {
  const body = await req.text();
  const parsed = schema.safeParse(JSON.parse(body));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const site = await getSiteByInstallId(parsed.data.installId);
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

  await savePageSpeedReport(site.id, {
    mobileScore: parsed.data.mobileScore,
    desktopScore: parsed.data.desktopScore,
    lcp: parsed.data.lcp,
    cls: parsed.data.cls,
    inp: parsed.data.inp
  });

  return NextResponse.json({ ok: true });
}
