import { NextResponse } from "next/server";
import { z } from "zod";
import { registerSite } from "@/lib/site-service";

const schema = z.object({
  installId: z.string().min(8),
  secretKey: z.string().min(16),
  domain: z.string().min(3),
  siteUrl: z.string().url(),
  clientName: z.string().min(2),
  wpVersion: z.string(),
  phpVersion: z.string(),
  pluginVersion: z.string(),
  expiresAt: z.string().datetime().optional()
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const site = await registerSite(parsed.data);
  return NextResponse.json({ siteId: site.id, status: site.licenseStatus });
}
