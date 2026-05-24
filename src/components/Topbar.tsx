"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/": "Accueil",
  "/cours": "Cours",
  "/cours/nouveau": "Créer un cours",
  "/generateurs": "Générateurs",
  "/agenda": "Agenda",
  "/inscription": "Inscriptions",
  "/contenu": "Création de contenu",
  "/spectacles": "Spectacles",
  "/dashboard": "Dashboard",
  "/site": "Site public (aperçu)",
};

export function Topbar() {
  const pathname = usePathname();
  const matched =
    Object.entries(titles).find(([k]) =>
      k === "/" ? pathname === "/" : pathname.startsWith(k),
    )?.[1] ?? "Impro 2pro";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-stage-950/70 px-6 py-3 backdrop-blur lg:px-10">
      <div>
        <div className="text-xs uppercase tracking-widest text-stage-400">Impro 2pro</div>
        <div className="font-display text-xl font-semibold">{matched}</div>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/inscription" className="btn-ghost">
          + Inscription
        </Link>
        <Link href="/cours/nouveau" className="btn-primary">
          ✨ Nouveau cours
        </Link>
      </div>
    </header>
  );
}
