"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";

type Tile = {
  href: string;
  title: string;
  subtitle: string;
  emoji: string;
  bg: string; // background gradient css
};

export default function HomePage() {
  const { state, currentTeacherId } = useStore();
  const me = state.teachers.find((t) => t.id === currentTeacherId);

  const [expanded, setExpanded] = useState(true);

  const dateLabel = new Date()
    .toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    .toLowerCase();

  const quick: Tile[] = [
    {
      href: "/prof",
      title: me ? me.name : "Espace prof",
      subtitle: me ? me.specialty : "Choisir mon profil",
      emoji: "🎭",
      bg: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
    },
    {
      href: "/agenda",
      title: "Planning",
      subtitle: "Cours, sessions, tournées",
      emoji: "📅",
      bg: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    },
  ];

  const modules: Tile[] = [
    {
      href: "/cours/nouveau",
      title: "Nouveau cours",
      subtitle: "Créer un cours, IA ou manuel",
      emoji: "✏️",
      bg: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
    },
    {
      href: "/cours",
      title: "Cours",
      subtitle: "Programme, niveaux, profs",
      emoji: "📚",
      bg: "linear-gradient(135deg, #475569 0%, #1e293b 100%)",
    },
    {
      href: "/generateurs",
      title: "Générateurs",
      subtitle: "Émotions, personnages, scènes",
      emoji: "🎲",
      bg: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
    },
    {
      href: "/inscription",
      title: "Inscriptions",
      subtitle: "Kanban élèves & dossiers",
      emoji: "📝",
      bg: "linear-gradient(135deg, #64748b 0%, #334155 100%)",
    },
    {
      href: "/spectacles",
      title: "Spectacles",
      subtitle: "Affiche, répétitions, billets",
      emoji: "🎟️",
      bg: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    },
    {
      href: "/spectacles",
      title: "Tous les spectacles",
      subtitle: "Historique et statuts",
      emoji: "📋",
      bg: "linear-gradient(135deg, #fb923c 0%, #c2410c 100%)",
    },
    {
      href: "/dashboard",
      title: "Newsletter",
      subtitle: "Diffuser, journal d'envois",
      emoji: "📨",
      bg: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
    },
    {
      href: "/dashboard",
      title: "Dashboard",
      subtitle: "KPIs et activité par prof",
      emoji: "📊",
      bg: "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)",
    },
    {
      href: "/contenu",
      title: "Contenu",
      subtitle: "Articles & actualités",
      emoji: "📰",
      bg: "linear-gradient(135deg, #a3845b 0%, #6b5230 100%)",
    },
    {
      href: "/site",
      title: "Site public",
      subtitle: "Aperçu visiteurs",
      emoji: "🌐",
      bg: "linear-gradient(135deg, #94a3b8 0%, #475569 100%)",
    },
    {
      href: "/prof",
      title: "La troupe",
      subtitle: "Annuaire, profs, spécialités",
      emoji: "👥",
      bg: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
    },
    {
      href: "/dashboard",
      title: "Statistiques",
      subtitle: "Activité saison & élèves",
      emoji: "📈",
      bg: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    },
    {
      href: "/generateurs",
      title: "Boîte à idées",
      subtitle: "Tirages, contraintes, twists",
      emoji: "💡",
      bg: "linear-gradient(135deg, #a855f7 0%, #6d28d9 100%)",
    },
    {
      href: "/intro",
      title: "Intro",
      subtitle: "Rejouer le lever de rideau",
      emoji: "✨",
      bg: "linear-gradient(135deg, #1e3a8a 0%, #0c1d56 100%)",
    },
    {
      href: "/cours/nouveau",
      title: "Bibliothèque exos",
      subtitle: "Réutiliser des exercices",
      emoji: "📖",
      bg: "linear-gradient(135deg, #f472b6 0%, #be185d 100%)",
    },
    {
      href: "/inscription",
      title: "Mailer mes élèves",
      subtitle: "Envoi groupe en 1 clic",
      emoji: "✉️",
      bg: "linear-gradient(135deg, #84cc16 0%, #4d7c0f 100%)",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header app : nom + date */}
      <header className="flex items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
            IMPRO<span className="text-red-400">2</span>PRO
          </h1>
        </div>
        <div className="text-right text-xs uppercase tracking-wider text-white/60 sm:text-sm">
          {dateLabel}
        </div>
      </header>

      {/* ACCÈS RAPIDE */}
      <section>
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
          Accès rapide
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {quick.map((t) => (
            <QuickTile key={t.title} tile={t} />
          ))}
        </div>
      </section>

      {/* AUTRES MODULES */}
      <section>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mb-3 flex w-full items-center justify-between text-left"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
            Autres modules <span className="ml-1 text-white/35">{modules.length}</span>
          </span>
          <span
            className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-xs text-white/70 transition"
            style={{ transform: expanded ? "rotate(0deg)" : "rotate(180deg)" }}
          >
            ▲
          </span>
        </button>
        {expanded && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {modules.map((t, i) => (
              <ModuleTile key={`${t.href}-${i}`} tile={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function QuickTile({ tile }: { tile: Tile }) {
  return (
    <Link
      href={tile.href}
      className="relative block aspect-[16/9] overflow-hidden rounded-[28px] p-5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.6)] transition active:scale-[0.98] sm:p-6"
      style={{ background: tile.bg }}
    >
      <div className="absolute right-2 top-2 text-[80px] leading-none opacity-25 sm:text-[110px]">
        {tile.emoji}
      </div>
      <div className="absolute inset-x-5 bottom-4 sm:inset-x-6 sm:bottom-5">
        <div className="font-display text-2xl font-black leading-tight text-white drop-shadow-md sm:text-3xl">
          {tile.title}
        </div>
        <div className="mt-0.5 text-sm font-medium text-white/85">{tile.subtitle}</div>
      </div>
    </Link>
  );
}

function ModuleTile({ tile }: { tile: Tile }) {
  return (
    <Link
      href={tile.href}
      className="relative block aspect-[5/4] overflow-hidden rounded-[24px] p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)] transition active:scale-[0.98] sm:aspect-[3/2] sm:p-5"
      style={{ background: tile.bg }}
    >
      <div className="absolute right-1.5 top-1.5 text-[60px] leading-none opacity-25 sm:text-[80px]">
        {tile.emoji}
      </div>
      <div className="absolute inset-x-4 bottom-3 sm:inset-x-5 sm:bottom-4">
        <div className="font-display text-lg font-black leading-tight text-white drop-shadow sm:text-xl">
          {tile.title}
        </div>
        <div className="mt-0.5 truncate text-[12px] font-medium text-white/85 sm:text-[13px]">
          {tile.subtitle}
        </div>
      </div>
    </Link>
  );
}
