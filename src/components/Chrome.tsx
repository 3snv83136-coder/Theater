"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/intro") {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            {children}
          </div>
        </main>
        <footer className="border-t border-gold-300/10 px-4 py-5 text-center sm:px-6">
          <div className="font-marquee text-xs uppercase tracking-[0.3em] text-gold-300/70 sm:text-sm">
            ★ Impro 2pro · {new Date().getFullYear()} · Improvisation théâtrale ★
          </div>
        </footer>
      </div>
    </div>
  );
}
