import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const token = (await cookies()).get("og_admin")?.value;
  if (!verifyAdminSession(token)) redirect("/login");
  return children;
}
