import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { StoreProvider } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { ToastProvider } from "@/components/Toast";
import { SplashScreen } from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "Impro 2pro — Compagnie de théâtre",
  description:
    "Plateforme de la compagnie Impro 2pro : cours, générateurs, agenda, inscriptions, spectacles.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <StoreProvider>
          <ToastProvider>
          <SplashScreen />
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-1 flex-col">
              <Topbar />
              <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
              <footer className="border-t border-gold-300/10 px-6 py-5 text-center">
                <div className="font-marquee text-sm uppercase tracking-[0.3em] text-gold-300/70">
                  ★ Impro 2pro · {new Date().getFullYear()} · Improvisation théâtrale ★
                </div>
              </footer>
            </div>
          </div>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
