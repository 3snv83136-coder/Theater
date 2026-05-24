"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-gold-300/15 bg-ink-950/80 px-5 py-6 backdrop-blur lg:flex">
      <Link href="/" className="group mb-7 block">
        <div className="relative overflow-hidden rounded-2xl border border-gold-300/30 bg-gradient-to-br from-velvet-900 to-ink-900 p-4 shadow-marquee">
          <div className="absolute inset-0 bg-velvet-bg opacity-30" />
          <div className="relative">
            <div className="eyebrow">Compagnie de théâtre</div>
            <div className="mt-1 font-marquee text-4xl font-black leading-none text-gold-200">
              IMPRO<span className="text-velvet-400">2</span>PRO
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-ivory-200/70">
              Improvisation · saison 26
            </div>
          </div>
          <Bulbs />
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-0.5">
        <div className="eyebrow mb-2 px-3">Programme</div>
        {links.map((l) => {
          const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-gold-300/15 text-gold-100"
                  : "text-ivory-200/70 hover:bg-ivory-100/5 hover:text-ivory-50"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gold-300" />
              )}
              <l.Icon
                size={18}
                className={active ? "text-gold-300" : "text-ivory-200/60 group-hover:text-gold-300"}
              />
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 overflow-hidden rounded-2xl border border-ivory-100/10 bg-ink-900/80 p-4 text-xs">
        <div className="eyebrow">La troupe</div>
        <div className="mt-2 flex flex-wrap gap-1">
          {["Florence", "Maïty", "Julien", "Carole", "Isabelle", "Gaëlle", "Corentin", "Jb"].map(
            (n) => (
              <span
                key={n}
                className="rounded-full border border-ivory-100/15 bg-ivory-100/5 px-2 py-0.5 text-[10px] text-ivory-100"
              >
                {n}
              </span>
            ),
          )}
        </div>
      </div>
    </aside>
  );
}

function Bulbs() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-3 -top-[5px] flex justify-between">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={`t${i}`}
            className="block h-2 w-2 rounded-full bg-gold-200"
            style={{ animation: `bulbPulse 1.4s ease-in-out ${(i % 4) * 0.25}s infinite` }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-3 -bottom-[5px] flex justify-between">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={`b${i}`}
            className="block h-2 w-2 rounded-full bg-gold-200"
            style={{ animation: `bulbPulse 1.4s ease-in-out ${((i + 2) % 4) * 0.25}s infinite` }}
          />
        ))}
      </div>
    </>
  );
}
