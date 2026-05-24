import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/Toast";
import { IntroGate } from "@/components/IntroGate";
import { Chrome } from "@/components/Chrome";

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
            <IntroGate />
            <Chrome>{children}</Chrome>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
