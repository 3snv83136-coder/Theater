"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconPlus, IconSparkle } from "./Icons";

const titles: Record<string, string> = {
  "/": "Lever de rideau",
  "/cours": "Programme des cours",
  "/cours/nouveau": "Composer un cours",
  "/generateurs": "Boîte à idées",
  "/agenda": "Régie & agenda",
  "/inscription": "Billetterie ateliers",
  "/contenu": "Rédaction",
  "/spectacles": "Affiche & spectacles",
  "/dashboard": "Coulisses",
  "/site": "Le site public",
};

export function Topbar() {
  const pathname = usePathname();
  const matched =
    Object.entries(titles).find(([k]) =>
      k === "/" ? pathname === "/" : pathname.startsWith(k),
    )?.[1] ?? "Impro 2pro";

  return (
    <header className="sticky top-0 z-20 border-b border-gold-300/10 bg-ink-950/85 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="hidden h-10 w-1 rounded-full bg-gradient-to-b from-gold-300 to-velvet-500 sm:block" />
          <div>
            <div className="eyebrow">Acte en cours</div>
            <div className="font-display text-2xl font-bold text-ivory-50">{matched}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/inscription" className="btn-ghost">
            <IconPlus size={14} /> Inscription
          </Link>
          <Link href="/cours/nouveau" className="btn-primary">
            <IconSparkle size={14} /> Nouveau cours
          </Link>
        </div>
      </div>
    </header>
  );
}
