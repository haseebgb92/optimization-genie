import { NextResponse } from "next/server";
import { listSites } from "@/lib/db";

export async function GET() {
  const sites = await listSites();
  return NextResponse.json({ sites });
}
