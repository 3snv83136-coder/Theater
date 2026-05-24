"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  IconBook,
  IconCalendar,
  IconDice,
  IconGauge,
  IconGlobe,
  IconMasks,
  IconNews,
  IconQuill,
  IconSparkle,
  IconTicket,
} from "./Icons";

const links = [
  { href: "/", label: "Accueil", Icon: IconMasks },
  { href: "/prof", label: "Espace prof", Icon: IconMasks },
  { href: "/cours", label: "Cours", Icon: IconBook },
  { href: "/cours/nouveau", label: "Créer un cours", Icon: IconSparkle },
  { href: "/generateurs", label: "Générateurs", Icon: IconDice },
  { href: "/agenda", label: "Agenda", Icon: IconCalendar },
  { href: "/inscription", label: "Inscriptions", Icon: IconQuill },
  { href: "/contenu", label: "Contenu", Icon: IconNews },
  { href: "/spectacles", label: "Spectacles", Icon: IconTicket },
  { href: "/dashboard", label: "Dashboard", Icon: IconGauge },
  { href: "/site", label: "Site public", Icon: IconGlobe },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink-950/80 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <nav
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-r border-gold-300/15 bg-ink-950 px-5 py-6 transition-transform lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-gold-300/30 bg-gradient-to-br from-velvet-900 to-ink-900 p-4 shadow-marquee">
          <div className="eyebrow">Compagnie de théâtre</div>
          <div className="mt-1 font-marquee text-3xl font-black leading-none text-gold-200">
            IMPRO<span className="text-velvet-400">2</span>PRO
          </div>
        </div>

        <div className="eyebrow mb-2 px-3">Programme</div>
        <div className="flex flex-col gap-0.5">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-gold-300/15 text-gold-100"
                    : "text-ivory-200/70 hover:bg-ivory-100/5 hover:text-ivory-50"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gold-300" />
                )}
                <l.Icon size={18} className={active ? "text-gold-300" : "text-ivory-200/60"} />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
