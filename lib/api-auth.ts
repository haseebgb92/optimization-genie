import { verifyAdminSession } from "@/lib/auth";

function isLocalMode() {
  return process.env.LOCAL_MODE !== "false";
}

export function isAdminRequest(req: Request) {
  if (isLocalMode()) return true;
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("og_admin="))
    ?.split("=")[1];
  return verifyAdminSession(token);
}
