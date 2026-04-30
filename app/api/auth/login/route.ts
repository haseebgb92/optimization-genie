import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";
import { verifyAdminUser } from "@/lib/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const ok = await verifyAdminUser(String(email || ""), String(password || ""));

  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  const token = createAdminSession(email);
  res.cookies.set("og_admin", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    secure: process.env.NODE_ENV === "production"
  });
  return res;
}
