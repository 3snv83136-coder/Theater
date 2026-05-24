"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  IconArrowLeft,
  IconMenu,
  IconClose,
  IconPlus,
  IconSparkle,
} from "./Icons";
import { MobileNav } from "./MobileNav";

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
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const matched =
    Object.entries(titles).find(([k]) =>
      k === "/" ? pathname === "/" : pathname.startsWith(k),
    )?.[1] ?? "Impro 2pro";

  const showBack = pathname !== "/";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gold-300/10 bg-ink-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-ivory-100/15 bg-ivory-100/5 text-ivory-100 transition hover:border-gold-300/50 hover:text-gold-200 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <IconMenu size={18} />
            </button>

            {showBack && (
              <button
                type="button"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ivory-100/15 bg-ivory-100/5 text-ivory-100 transition hover:border-gold-300/50 hover:text-gold-200"
                onClick={() => router.back()}
                aria-label="Retour"
                title="Retour"
              >
                <IconArrowLeft size={18} />
              </button>
            )}

            <div className="hidden h-10 w-1 shrink-0 rounded-full bg-gradient-to-b from-gold-300 to-velvet-500 sm:block" />

            <div className="min-w-0">
              <div className="eyebrow truncate">Acte en cours</div>
              <div className="truncate font-display text-lg font-bold text-ivory-50 sm:text-2xl">
                {matched}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/inscription"
              className="btn-ghost hidden md:inline-flex"
              title="Nouvelle inscription"
            >
              <IconPlus size={14} /> Inscription
            </Link>
            <Link
              href="/inscription"
              className="grid h-10 w-10 place-items-center rounded-full border border-ivory-100/15 bg-ivory-100/5 text-ivory-100 transition hover:border-gold-300/50 hover:text-gold-200 md:hidden"
              aria-label="Nouvelle inscription"
            >
              <IconPlus size={16} />
            </Link>
            <Link href="/cours/nouveau" className="btn-primary hidden sm:inline-flex">
              <IconSparkle size={14} /> Nouveau cours
            </Link>
            <Link
              href="/cours/nouveau"
              className="grid h-10 w-10 place-items-center rounded-full bg-gold-300 text-ink-900 shadow-marquee sm:hidden"
              aria-label="Nouveau cours"
            >
              <IconSparkle size={16} />
            </Link>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Floating close (visible when menu open) — handled inside MobileNav backdrop */}
      {menuOpen && (
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Fermer le menu"
          className="fixed right-4 top-4 z-[60] grid h-10 w-10 place-items-center rounded-full border border-gold-300/40 bg-ink-900 text-gold-200 shadow-lg lg:hidden"
        >
          <IconClose size={18} />
        </button>
      )}
    </>
  );
}
