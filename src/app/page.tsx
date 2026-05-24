"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  IconArrowRight,
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
} from "@/components/Icons";

const TINTS = {
  violet: "#c026ff",
  emerald: "#00ffa3",
  gold: "#ffd60a",
  coral: "#ff4d6d",
  sky: "#00d4ff",
  orange: "#ff8c1a",
  rose: "#ff3ea5",
  mint: "#2ee6cf",
  lime: "#c0fa00",
  magenta: "#ff00d4",
} as const;
type Tint = keyof typeof TINTS;

export default function HomePage() {
  const { state, currentTeacherId } = useStore();
  const me = state.teachers.find((t) => t.id === currentTeacherId);

  const today0 = new Date(new Date().toDateString());
  const upcomingAgendaCount = state.agenda.filter(
    (a) => new Date(a.date) >= today0,
  ).length;
  const newInscriptions = state.inscriptions.filter((i) => i.status === "Nouveau").length;
  const activeInscriptions = state.inscriptions.filter((i) => i.status === "Actif").length;
  const showsAffiche = state.shows.filter((s) => s.status === "À l'affiche").length;
  const showsRepet = state.shows.filter((s) => s.status === "Répétition").length;
  const publishedPosts = state.posts.filter((p) => p.published).length;

  const tiles: Tile[] = [
    {
      href: "/prof",
      Icon: IconMasks,
      title: me ? `Espace ${me.name}` : "Espace prof",
      subtitle: me ? me.specialty : "Choisir mon profil enseignant",
      stat: me ? state.courses.filter((c) => c.teacherId === me.id).length : null,
      statLabel: me ? "mes cours" : undefined,
      tint: "violet",
      cta: me ? "Mon tableau de bord" : "Choisir un prof",
      color: me?.color,
    },
    {
      href: "/cours",
      Icon: IconBook,
      title: "Cours",
      subtitle: "Catalogue filtrable par niveau et par prof",
      stat: state.courses.length,
      statLabel: "cours au programme",
      tint: "emerald",
      cta: "Voir le programme",
    },
    {
      href: "/cours/nouveau",
      Icon: IconSparkle,
      title: "Créer un cours",
      subtitle: "Manuel ou brouillon assisté par IA",
      stat: null,
      tint: "gold",
      cta: "Composer un cours",
    },
    {
      href: "/generateurs",
      Icon: IconDice,
      title: "Générateurs",
      subtitle: "Émotions, contextes, personnages, histoires",
      stat: 4,
      statLabel: "types de tirages",
      tint: "coral",
      cta: "Tirer une idée",
    },
    {
      href: "/agenda",
      Icon: IconCalendar,
      title: "Agenda",
      subtitle: "Vue hebdomadaire, par prof, planification",
      stat: upcomingAgendaCount,
      statLabel: "sessions à venir",
      tint: "violet",
      cta: "Ouvrir l'agenda",
    },
    {
      href: "/inscription",
      Icon: IconQuill,
      title: "Inscriptions",
      subtitle: "Kanban : nouveau · contacté · actif · archivé",
      stat: newInscriptions,
      statLabel: `${newInscriptions} nouveaux · ${activeInscriptions} actifs`,
      tint: "sky",
      cta: "Gérer les dossiers",
      pulse: newInscriptions > 0,
    },
    {
      href: "/contenu",
      Icon: IconNews,
      title: "Contenu",
      subtitle: "Brouillons, articles, publication site",
      stat: publishedPosts,
      statLabel: "publié(s) en ligne",
      tint: "orange",
      cta: "Écrire un article",
    },
    {
      href: "/spectacles",
      Icon: IconTicket,
      title: "Spectacles",
      subtitle: "Affiche · répétitions · billetterie",
      stat: showsAffiche,
      statLabel: `${showsAffiche} à l'affiche · ${showsRepet} en répétition`,
      tint: "gold",
      cta: "Voir les spectacles",
    },
    {
      href: "/dashboard",
      Icon: IconGauge,
      title: "Dashboard",
      subtitle: "KPIs, newsletter, journal des envois",
      stat: state.mails.length,
      statLabel: "envois enregistrés",
      tint: "mint",
      cta: "Coulisses",
    },
    {
      href: "/site",
      Icon: IconGlobe,
      title: "Site public",
      subtitle: "Aperçu de ce que voient les visiteurs",
      stat: publishedPosts,
      statLabel: "articles en ligne",
      tint: "rose",
      cta: "Prévisualiser",
    },
    {
      href: "/intro",
      Icon: IconSparkle,
      title: "Rejouer l'intro",
      subtitle: "Animation théâtrale d'ouverture",
      stat: null,
      tint: "coral",
      cta: "Lever de rideau",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HERO compact flashy */}
      <section
        className="relative overflow-hidden rounded-3xl border-2 px-5 py-7 sm:px-10 sm:py-10"
        style={{
          borderColor: "#ffd60a",
          background:
            "radial-gradient(800px 400px at 80% 20%, rgba(192, 38, 255, 0.45), transparent 60%), radial-gradient(700px 400px at 20% 80%, rgba(255, 62, 165, 0.4), transparent 60%), linear-gradient(135deg, #1a0040 0%, #2d0a5e 50%, #160043 100%)",
          boxShadow: "0 0 40px rgba(255, 214, 10, 0.4), 0 25px 60px -20px rgba(0,0,0,0.7)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-6 opacity-80 sm:w-10"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0px, transparent 1px, transparent 8px, rgba(0,0,0,0.4) 9px), linear-gradient(180deg, #4a0d1c 0%, #6e1429 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-6 opacity-80 sm:w-10"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0px, transparent 1px, transparent 8px, rgba(0,0,0,0.4) 9px), linear-gradient(180deg, #4a0d1c 0%, #6e1429 100%)",
          }}
        />
        <div className="pointer-events-none absolute -top-16 left-1/3 h-[140%] w-40 -rotate-12 bg-gradient-to-b from-gold-200/25 via-transparent to-transparent blur-3xl sm:w-64" />
        <div className="pointer-events-none absolute -top-16 right-1/3 h-[140%] w-40 rotate-12 bg-gradient-to-b from-gold-200/20 via-transparent to-transparent blur-3xl sm:w-64" />

        <div className="relative mx-4 max-w-2xl sm:mx-8">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-gold-300/60 sm:w-10" />
            <span className="eyebrow">Tout l'univers de la troupe</span>
            <span className="h-px w-6 bg-gold-300/60 sm:w-10" />
          </div>
          <h1
            className="mt-3 font-marquee text-4xl font-black leading-[0.95] sm:text-6xl"
            style={{
              color: "#fff",
              textShadow: "0 0 30px rgba(255, 214, 10, 0.7), 0 0 60px rgba(192, 38, 255, 0.4)",
            }}
          >
            IMPRO
            <span style={{ color: "#ff3ea5", textShadow: "0 0 25px rgba(255, 62, 165, 0.85)" }}>2</span>
            PRO
            <span
              className="ml-2 inline-block align-top text-xl sm:ml-3 sm:text-2xl"
              style={{ color: "#ffd60a", textShadow: "0 0 18px rgba(255, 214, 10, 0.9)" }}
            >
              ★
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-ivory-100/85 sm:text-base">
            Choisissez une section ci-dessous pour entrer dans la régie de la
            compagnie.
          </p>
        </div>
      </section>

      {/* GRILLE DES SECTIONS */}
      <div>
        <div className="mb-3 flex items-end justify-between sm:mb-4">
          <div>
            <div className="eyebrow">Menu principal</div>
            <h2 className="font-display text-xl font-bold text-ivory-50 sm:text-2xl">
              Les rubriques de l'application
            </h2>
          </div>
          <span className="text-[11px] uppercase tracking-widest text-ivory-200/50">
            {tiles.length} rubriques
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {tiles.map((t) => (
            <TileCard key={t.href} tile={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

type Tile = {
  href: string;
  Icon: (p: { size?: number; className?: string }) => JSX.Element;
  title: string;
  subtitle: string;
  stat: number | null;
  statLabel?: string;
  tint: Tint;
  cta: string;
  pulse?: boolean;
  color?: string;
};

function TileCard({ tile }: { tile: Tile }) {
  const color = tile.color ?? TINTS[tile.tint];
  return (
    <Link
      href={tile.href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border-2 p-4 backdrop-blur transition hover:-translate-y-1 sm:p-5"
      style={{
        borderColor: `${color}aa`,
        background: `linear-gradient(160deg, ${color}22 0%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0.02) 100%)`,
        boxShadow: `0 12px 35px -10px ${color}55, 0 0 0 1px ${color}22, inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 18px 45px -10px ${color}aa, 0 0 25px ${color}66, inset 0 1px 0 rgba(255,255,255,0.15)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 12px 35px -10px ${color}55, 0 0 0 1px ${color}22, inset 0 1px 0 rgba(255,255,255,0.1)`;
      }}
    >
      {/* Top neon bar */}
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}cc, ${color})`,
          boxShadow: `0 0 18px ${color}, 0 0 6px ${color}`,
        }}
      />
      {tile.pulse && (
        <div className="absolute inset-x-3 -top-[5px] flex justify-between">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full"
              style={{
                background: color,
                animation: `bulbPulse 1.4s ease-in-out ${(i % 3) * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2"
          style={{
            background: `${color}33`,
            borderColor: `${color}88`,
            color,
            boxShadow: `0 0 18px ${color}66, inset 0 0 12px ${color}33`,
          }}
        >
          <tile.Icon size={20} />
        </div>
        {tile.stat !== null && (
          <div className="text-right">
            <div
              className="font-marquee text-4xl font-black leading-none sm:text-5xl"
              style={{
                color,
                textShadow: `0 0 22px ${color}aa, 0 0 8px ${color}`,
              }}
            >
              {tile.stat.toString().padStart(2, "0")}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex-1">
        <div
          className="text-[10px] font-black uppercase tracking-[0.25em]"
          style={{ color, textShadow: `0 0 10px ${color}88` }}
        >
          {tile.statLabel ?? tile.cta}
        </div>
        <h3 className="mt-1 font-display text-base font-bold leading-tight text-white sm:text-lg">
          {tile.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-white/75 sm:text-[13px]">
          {tile.subtitle}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/80 transition group-hover:text-white">
        <span>{tile.cta}</span>
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 transition group-hover:translate-x-0.5"
          style={{
            background: `${color}44`,
            borderColor: color,
            color,
            boxShadow: `0 0 12px ${color}66`,
          }}
        >
          <IconArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
