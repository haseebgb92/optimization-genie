import { NextResponse } from "next/server";
import { z } from "zod";
import { getSite } from "@/lib/db";
import { isAdminRequest } from "@/lib/api-auth";
import { createSiteAction } from "@/lib/site-service";

const schema = z.object({ action: z.string().min(3) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const site = await getSite(id);
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const payload = schema.safeParse(await req.json());
  if (!payload.success) return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  await createSiteAction(site.id, payload.data.action, "admin");
  return NextResponse.json({ ok: true });
}
