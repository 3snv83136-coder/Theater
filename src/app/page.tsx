"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { TeacherBadge } from "@/components/TeacherBadge";
import { Section } from "@/components/Section";
import {
  IconArrowRight,
  IconBook,
  IconClock,
  IconLocation,
  IconQuill,
  IconSparkle,
  IconTicket,
} from "@/components/Icons";

export default function HomePage() {
  const { state } = useStore();
  const upcomingShows = [...state.shows]
    .filter((s) => new Date(s.date) >= new Date())
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 3);
  const upcomingAgenda = [...state.agenda]
    .filter((a) => new Date(a.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-gold-300/30 bg-gradient-to-br from-[#0e1a3a] via-[#1a1140] to-[#0a1733] px-5 py-8 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.6)] sm:px-10 sm:py-12 md:px-14 md:py-16">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-8 opacity-80 sm:w-16"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0px, transparent 1px, transparent 8px, rgba(0,0,0,0.4) 9px), linear-gradient(180deg, #4a0d1c 0%, #6e1429 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-8 opacity-80 sm:w-16"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0px, transparent 1px, transparent 8px, rgba(0,0,0,0.4) 9px), linear-gradient(180deg, #4a0d1c 0%, #6e1429 100%)",
          }}
        />
        <div className="pointer-events-none absolute -top-20 left-1/4 h-[140%] w-48 -rotate-12 bg-gradient-to-b from-gold-200/25 via-transparent to-transparent blur-3xl sm:w-72" />
        <div className="pointer-events-none absolute -top-20 right-1/4 h-[140%] w-48 rotate-12 bg-gradient-to-b from-gold-200/20 via-transparent to-transparent blur-3xl sm:w-72" />

        <div className="relative mx-6 max-w-3xl sm:mx-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="h-px w-6 bg-gold-300/60 sm:w-12" />
            <span className="eyebrow">Compagnie d'improvisation</span>
            <span className="h-px w-6 bg-gold-300/60 sm:w-12" />
          </div>
          <h1 className="mt-4 font-marquee text-5xl font-black leading-[0.95] text-ivory-50 sm:text-7xl md:text-8xl">
            IMPRO<span className="text-velvet-400">2</span>PRO
            <span className="ml-2 inline-block align-top text-2xl text-gold-300 sm:ml-3 sm:text-3xl">
              ★
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-ivory-100/85 sm:mt-5 sm:text-lg">
            La plateforme tout-en-un de la troupe : cours pour tous niveaux,
            générateurs de jeu, agenda par prof, inscriptions, contenu pour le
            site et organisation des spectacles.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
            <Link href="/cours" className="btn-primary">
              <IconBook size={16} /> Voir les cours
            </Link>
            <Link href="/cours/nouveau" className="btn-outline-gold">
              <IconSparkle size={16} /> Créer
            </Link>
            <Link href="/inscription" className="btn-ghost">
              <IconQuill size={16} /> S'inscrire
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE STATS — tinted sky */}
      <Section eyebrow="En chiffres" title="La saison en un coup d'œil" tint="sky">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <MarqueeStat label="Cours" value={state.courses.length} hint="au programme" tint="#5eead4" />
          <MarqueeStat label="Profs" value={state.teachers.length} hint="dans la troupe" tint="#a78bfa" />
          <MarqueeStat
            label="Inscrits"
            value={state.inscriptions.length}
            hint={`${state.inscriptions.filter((i) => i.status === "Nouveau").length} en attente`}
            tint="#ecbe4a"
            highlight
          />
          <MarqueeStat
            label="Spectacles"
            value={state.shows.length}
            hint={`${upcomingShows.length} à venir`}
            tint="#fb7185"
          />
        </div>
      </Section>

      {/* TWO COLUMNS */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-6">
        <Section
          eyebrow="Régie"
          title="Prochaines sessions"
          actionHref="/agenda"
          actionLabel="Agenda"
          tint="violet"
        >
          <div className="space-y-3">
            {upcomingAgenda.length === 0 && (
              <div className="rounded-xl bg-white/5 p-4 text-sm text-ivory-200/70">
                Aucune session planifiée pour le moment.
              </div>
            )}
            {upcomingAgenda.map((a) => {
              const course = state.courses.find((c) => c.id === a.courseId);
              const teacher = state.teachers.find((t) => t.id === a.teacherId);
              const d = new Date(a.date);
              return (
                <Link
                  href={`/cours/${a.courseId}`}
                  key={a.id}
                  className="ticket-row card-hover group block"
                >
                  <div
                    className="ticket-stub"
                    style={teacher ? { backgroundColor: `${teacher.color}33` } : undefined}
                  >
                    <div className="font-marquee text-2xl font-black leading-none text-ivory-50 sm:text-3xl">
                      {d.toLocaleDateString("fr-FR", { day: "2-digit" })}
                    </div>
                    <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-ivory-200/80">
                      {d.toLocaleDateString("fr-FR", { month: "short" })}
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
                    <div className="min-w-0">
                      <div className="truncate font-display text-base font-semibold text-ivory-50 sm:text-lg">
                        {course?.title ?? "Cours"}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-ivory-200/70 sm:gap-3 sm:text-xs">
                        <span className="inline-flex items-center gap-1">
                          <IconClock size={12} /> {a.startTime}–{a.endTime}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <IconLocation size={12} /> {a.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                      <span className="hidden sm:inline-flex">
                        <TeacherBadge teacher={teacher} />
                      </span>
                      {teacher && (
                        <span
                          className="grid h-7 w-7 place-items-center rounded-full font-marquee text-xs font-black text-ink-900 sm:hidden"
                          style={{ backgroundColor: teacher.color }}
                        >
                          {teacher.name.charAt(0)}
                        </span>
                      )}
                      <IconArrowRight
                        size={16}
                        className="text-ivory-200/40 transition group-hover:translate-x-1 group-hover:text-gold-300"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>

        <Section
          eyebrow="Affiche"
          title="À venir sur scène"
          actionHref="/spectacles"
          actionLabel="Voir tout"
          tint="gold"
        >
          <div className="space-y-3">
            {upcomingShows.length === 0 && (
              <div className="rounded-xl bg-white/5 p-4 text-sm text-ivory-200/70">
                Aucun spectacle prévu pour l'instant.
              </div>
            )}
            {upcomingShows.map((s) => {
              const d = new Date(s.date);
              return (
                <article key={s.id} className="card card-hover">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="eyebrow flex items-center gap-2">
                        <IconTicket size={12} />
                        <span className="truncate">
                          {d.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                      </div>
                      <h3 className="mt-1 font-display text-lg font-semibold text-ivory-50 sm:text-xl">
                        {s.title}
                      </h3>
                      <p className="mt-1 truncate text-sm text-ivory-200/70">
                        <IconLocation
                          size={12}
                          className="-mt-0.5 mr-1 inline align-middle"
                        />
                        {s.venue}
                      </p>
                    </div>
                    <div className="ticket flex h-20 w-14 shrink-0 flex-col items-center justify-center p-1 sm:w-16">
                      <div className="font-marquee text-xl font-black text-gold-300 sm:text-2xl">
                        {(s.priceCents / 100).toFixed(0)}€
                      </div>
                      <div className="text-[8px] uppercase tracking-widest text-ivory-200/60">
                        place
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Section>
      </div>

      {/* TROUPE */}
      <Section
        eyebrow="Distribution"
        title="La troupe"
        actionHref="/agenda"
        actionLabel="Plannings"
        tint="rose"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {state.teachers.map((t) => (
            <Link
              key={t.id}
              href={`/agenda?teacher=${t.id}`}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-3 text-center transition hover:-translate-y-1 hover:border-gold-300/40 sm:p-4"
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: t.color }}
              />
              <div
                className="mx-auto mt-1 grid h-12 w-12 place-items-center rounded-full font-marquee text-xl font-black text-ink-900 sm:h-14 sm:w-14 sm:text-2xl"
                style={{ backgroundColor: t.color, boxShadow: `0 0 30px ${t.color}66` }}
              >
                {t.name.charAt(0)}
              </div>
              <div className="mt-2 truncate font-display text-sm font-semibold text-ivory-50 sm:mt-3 sm:text-base">
                {t.name}
              </div>
              <div className="truncate text-[9px] uppercase tracking-widest text-ivory-200/60 sm:text-[10px]">
                {t.specialty}
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}

function MarqueeStat({
  label,
  value,
  hint,
  tint,
  highlight,
}: {
  label: string;
  value: number;
  hint?: string;
  tint?: string;
  highlight?: boolean;
}) {
  const color = tint ?? "#ecbe4a";
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-4 shadow-[0_8px_25px_-10px_rgba(0,0,0,0.45)] sm:p-5"
      style={{
        borderColor: `${color}55`,
        backgroundColor: `${color}14`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}55)` }}
      />
      <div
        className="text-[10px] font-bold uppercase tracking-[0.3em] truncate"
        style={{ color }}
      >
        {label}
      </div>
      <div className="mt-1 font-marquee text-4xl font-black leading-none text-ivory-50 sm:text-5xl">
        {value.toString().padStart(2, "0")}
      </div>
      {hint && <div className="mt-2 truncate text-[11px] text-ivory-200/70 sm:text-xs">{hint}</div>}
      {highlight && (
        <div className="absolute inset-x-3 -top-[5px] flex justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: color, animation: `bulbPulse 1.4s ease-in-out ${(i % 3) * 0.3}s infinite` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
