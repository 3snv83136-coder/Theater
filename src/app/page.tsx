"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { TeacherBadge } from "@/components/TeacherBadge";

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
    <div className="space-y-10">
      <section className="card relative overflow-hidden p-10">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-scene-500/20 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-velvet-700/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-scene-200">
            🎭 Compagnie de théâtre d'improvisation
          </div>
          <h1 className="font-display text-5xl font-black leading-tight text-white">
            Impro 2pro
          </h1>
          <p className="mt-4 text-lg text-stage-200">
            La plateforme tout-en-un de la troupe : cours pour tous niveaux,
            générateurs de jeu, agenda par prof, inscriptions, contenu pour le
            site et organisation des spectacles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/cours" className="btn-primary">Voir les cours</Link>
            <Link href="/cours/nouveau" className="btn-ghost">✨ Créer un cours</Link>
            <Link href="/inscription" className="btn-ghost">📝 S'inscrire</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Stat label="Cours en ligne" value={state.courses.length} hint="tous niveaux" />
        <Stat label="Profs actifs" value={state.teachers.length} hint="la troupe" />
        <Stat
          label="Inscriptions"
          value={state.inscriptions.length}
          hint={`${state.inscriptions.filter((i) => i.status === "Nouveau").length} nouveaux`}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title text-xl">Prochains cours</h2>
            <Link href="/agenda" className="text-xs text-scene-300 hover:underline">
              Voir l'agenda →
            </Link>
          </div>
          <ul className="divide-y divide-white/5">
            {upcomingAgenda.length === 0 && (
              <li className="py-4 text-sm text-stage-400">Aucune session planifiée.</li>
            )}
            {upcomingAgenda.map((a) => {
              const course = state.courses.find((c) => c.id === a.courseId);
              const teacher = state.teachers.find((t) => t.id === a.teacherId);
              return (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{course?.title ?? "Cours"}</div>
                    <div className="text-xs text-stage-400">
                      {new Date(a.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                      })}{" "}
                      · {a.startTime}–{a.endTime} · {a.location}
                    </div>
                  </div>
                  <TeacherBadge teacher={teacher} />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title text-xl">Prochains spectacles</h2>
            <Link href="/spectacles" className="text-xs text-scene-300 hover:underline">
              Voir tout →
            </Link>
          </div>
          <ul className="divide-y divide-white/5">
            {upcomingShows.length === 0 && (
              <li className="py-4 text-sm text-stage-400">Aucun spectacle prévu.</li>
            )}
            {upcomingShows.map((s) => (
              <li key={s.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{s.title}</div>
                  <span className="chip">
                    {new Date(s.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="text-xs text-stage-400">
                  {s.venue} · {(s.priceCents / 100).toFixed(2)} €
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title text-xl">La troupe</h2>
        <p className="mt-1 text-sm text-stage-400">
          8 artistes, chacun avec sa spécialité.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {state.teachers.map((t) => (
            <Link
              key={t.id}
              href={`/agenda?teacher=${t.id}`}
              className="card card-hover flex flex-col items-center gap-2 p-4 text-center"
            >
              <div
                className="grid h-12 w-12 place-items-center rounded-full text-lg font-bold text-stage-950"
                style={{ backgroundColor: t.color }}
              >
                {t.name.charAt(0)}
              </div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-xs text-stage-400">{t.specialty}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-widest text-stage-400">{label}</div>
      <div className="mt-2 font-display text-4xl font-bold text-white">{value}</div>
      {hint ? <div className="mt-1 text-xs text-stage-400">{hint}</div> : null}
    </div>
  );
}
