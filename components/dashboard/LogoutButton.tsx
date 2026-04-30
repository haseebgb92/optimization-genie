"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }
  return (
    <button onClick={logout} className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800">
      Logout
    </button>
  );
}
