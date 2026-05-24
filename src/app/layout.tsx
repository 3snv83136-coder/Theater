import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { StoreProvider } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { ToastProvider } from "@/components/Toast";

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
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-1 flex-col">
              <Topbar />
              <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
              <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-stage-400">
                Impro 2pro © {new Date().getFullYear()} · Compagnie de théâtre d'improvisation
              </footer>
            </div>
          </div>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
