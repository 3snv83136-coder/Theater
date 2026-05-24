"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { TeacherBadge } from "@/components/TeacherBadge";
import {
  IconArrowRight,
  IconBook,
  IconCalendar,
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
    <div className="space-y-12">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-gold-300/30 bg-gradient-to-br from-velvet-900 via-ink-900 to-ink-950 p-8 shadow-playbill md:p-12">
        {/* curtain side decoration */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 opacity-80"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0px, transparent 1px, transparent 8px, rgba(0,0,0,0.4) 9px), linear-gradient(180deg, #4a0d1c 0%, #6e1429 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 opacity-80"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0px, transparent 1px, transparent 8px, rgba(0,0,0,0.4) 9px), linear-gradient(180deg, #4a0d1c 0%, #6e1429 100%)",
          }}
        />
        {/* spotlights */}
        <div className="pointer-events-none absolute -top-20 left-1/4 h-[140%] w-72 -rotate-12 bg-gradient-to-b from-gold-200/20 via-transparent to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -top-20 right-1/4 h-[140%] w-72 rotate-12 bg-gradient-to-b from-gold-200/15 via-transparent to-transparent blur-3xl" />

        <div className="relative mx-12 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-gold-300/60" />
            <span className="eyebrow">Compagnie d'improvisation</span>
            <span className="h-px w-12 bg-gold-300/60" />
          </div>
          <h1 className="mt-4 font-marquee text-7xl font-black leading-[0.95] text-ivory-50 md:text-8xl">
            IMPRO<span className="text-velvet-400">2</span>PRO
            <span className="ml-3 inline-block align-top text-3xl text-gold-300">★</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ivory-100/80">
            La plateforme tout-en-un de la troupe : cours pour tous niveaux,
            générateurs de jeu, agenda par prof, inscriptions, contenu pour le
            site et organisation des spectacles.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/cours" className="btn-primary">
              <IconBook size={16} /> Voir les cours
            </Link>
            <Link href="/cours/nouveau" className="btn-outline-gold">
              <IconSparkle size={16} /> Créer un cours
            </Link>
            <Link href="/inscription" className="btn-ghost">
              <IconQuill size={16} /> S'inscrire
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE STATS */}
      <section className="grid gap-4 md:grid-cols-4">
        <MarqueeStat label="Cours" value={state.courses.length} hint="au programme" />
        <MarqueeStat label="Profs" value={state.teachers.length} hint="dans la troupe" />
        <MarqueeStat
          label="Inscrits"
          value={state.inscriptions.length}
          hint={`${state.inscriptions.filter((i) => i.status === "Nouveau").length} en attente`}
          highlight
        />
        <MarqueeStat
          label="Spectacles"
          value={state.shows.length}
          hint={`${upcomingShows.length} à venir`}
        />
      </section>

      {/* TWO COLUMNS */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeader
            eyebrow="Régie"
            title="Prochaines sessions"
            actionHref="/agenda"
            actionLabel="Voir l'agenda"
          />
          <div className="space-y-3">
            {upcomingAgenda.length === 0 && (
              <div className="card text-sm text-ivory-200/70">
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
                  className="ticket-row card-hover group"
                >
                  <div
                    className="ticket-stub"
                    style={teacher ? { backgroundColor: `${teacher.color}33` } : undefined}
                  >
                    <div className="font-marquee text-3xl font-black leading-none text-ivory-50">
                      {d.toLocaleDateString("fr-FR", { day: "2-digit" })}
                    </div>
                    <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-ivory-200/80">
                      {d.toLocaleDateString("fr-FR", { month: "short" })}
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <div className="font-display text-lg font-semibold text-ivory-50">
                        {course?.title ?? "Cours"}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ivory-200/70">
                        <span className="inline-flex items-center gap-1">
                          <IconClock size={12} /> {a.startTime}–{a.endTime}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <IconLocation size={12} /> {a.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TeacherBadge teacher={teacher} />
                      <IconArrowRight
                        size={18}
                        className="text-ivory-200/40 transition group-hover:translate-x-1 group-hover:text-gold-300"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <SectionHeader
            eyebrow="Affiche"
            title="À venir sur scène"
            actionHref="/spectacles"
            actionLabel="Voir tout"
          />
          <div className="space-y-3">
            {upcomingShows.length === 0 && (
              <div className="card text-sm text-ivory-200/70">
                Aucun spectacle prévu pour l'instant.
              </div>
            )}
            {upcomingShows.map((s) => {
              const d = new Date(s.date);
              return (
                <article key={s.id} className="card card-hover">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="eyebrow flex items-center gap-2">
                        <IconTicket size={12} />
                        {d.toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </div>
                      <h3 className="mt-1 font-display text-xl font-semibold text-ivory-50">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm text-ivory-200/70">
                        <IconLocation
                          size={12}
                          className="-mt-0.5 mr-1 inline align-middle"
                        />
                        {s.venue}
                      </p>
                    </div>
                    <div className="ticket flex h-20 w-16 shrink-0 flex-col items-center justify-center p-1">
                      <div className="font-marquee text-2xl font-black text-gold-300">
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
        </div>
      </section>

      {/* TROUPE */}
      <section>
        <SectionHeader
          eyebrow="Distribution"
          title="La troupe"
          actionHref="/agenda"
          actionLabel="Plannings"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {state.teachers.map((t) => (
            <Link
              key={t.id}
              href={`/agenda?teacher=${t.id}`}
              className="group relative overflow-hidden rounded-2xl border border-ivory-100/10 bg-ink-800/80 p-4 text-center transition hover:-translate-y-1 hover:border-gold-300/40"
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: t.color }}
              />
              <div
                className="mx-auto mt-1 grid h-14 w-14 place-items-center rounded-full font-marquee text-2xl font-black text-ink-900"
                style={{ backgroundColor: t.color, boxShadow: `0 0 30px ${t.color}66` }}
              >
                {t.name.charAt(0)}
              </div>
              <div className="mt-3 font-display text-base font-semibold text-ivory-50">
                {t.name}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-ivory-200/60">
                {t.specialty}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  actionHref,
  actionLabel,
}: {
  eyebrow: string;
  title: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="font-display text-2xl font-bold text-ivory-50">{title}</h2>
      </div>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gold-300 hover:text-gold-200"
        >
          {actionLabel} <IconArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

function MarqueeStat({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: number;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        highlight
          ? "border-gold-300/50 bg-gradient-to-br from-gold-300/15 to-ink-900"
          : "border-ivory-100/10 bg-ink-900/80"
      }`}
    >
      <div className="eyebrow">{label}</div>
      <div className="mt-1 font-marquee text-5xl font-black leading-none text-ivory-50">
        {value.toString().padStart(2, "0")}
      </div>
      {hint && <div className="mt-2 text-xs text-ivory-200/70">{hint}</div>}
      {highlight && (
        <div className="absolute inset-x-3 -top-[5px] flex justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full bg-gold-300"
              style={{ animation: `bulbPulse 1.4s ease-in-out ${(i % 3) * 0.3}s infinite` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
