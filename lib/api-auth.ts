import { verifyAdminSession } from "@/lib/auth";

export function isAdminRequest(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("og_admin="))
    ?.split("=")[1];
  return verifyAdminSession(token);
}
