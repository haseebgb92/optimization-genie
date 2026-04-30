import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("og_admin", "", { path: "/", expires: new Date(0) });
  return res;
}
