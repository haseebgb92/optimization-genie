import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/dashboard/LogoutButton";

export const metadata = {
  title: "Optimization Genie Cloud"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen md:grid md:grid-cols-[250px_1fr]">
          <aside className="bg-slate-950 p-5 text-slate-100">
            <div className="flex items-center gap-2">
              <Image src="/icons/genie-menu-icon.svg" alt="Genie" width={18} height={18} />
              <p className="font-semibold">Optimization Genie Cloud</p>
            </div>
            <nav className="mt-6 space-y-2 text-sm">
              <Link className="block rounded-md bg-slate-800 px-3 py-2" href="/dashboard">
                Websites
              </Link>
            </nav>
            <div className="mt-6">
              <LogoutButton />
            </div>
          </aside>
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
