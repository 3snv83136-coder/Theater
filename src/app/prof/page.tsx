"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Section } from "@/components/Section";
import {
  IconArrowRight,
  IconClock,
  IconLocation,
  IconMail,
  IconSparkle,
} from "@/components/Icons";

export default function ProfPage() {
  const { state, currentTeacherId, setCurrentTeacherId, sendMail } = useStore();
  const me = state.teachers.find((t) => t.id === currentTeacherId) ?? null;

  if (!me) {
    return (
      <div className="space-y-6">
        <div>
          <div className="eyebrow">Espace prof</div>
          <h1 className="font-display text-2xl font-bold text-ivory-50 sm:text-3xl">
            Qui anime aujourd'hui ?
          </h1>
          <p className="mt-1 text-sm text-ivory-200/70">
            Choisissez votre profil pour accéder à votre tableau de bord.
          </p>
        </div>
        <Section eyebrow="Distribution" title="Choisissez un prof" tint="rose">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {state.teachers.map((t) => (
              <button
                key={t.id}
                onClick={() => setCurrentTeacherId(t.id)}
                className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-4 text-center transition hover:-translate-y-1 hover:border-gold-300/50"
              >
                <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: t.color }} />
                <div
                  className="mx-auto mt-1 grid h-14 w-14 place-items-center rounded-full font-marquee text-2xl font-black text-ink-900"
                  style={{ backgroundColor: t.color, boxShadow: `0 0 30px ${t.color}66` }}
                >
                  {t.name.charAt(0)}
                </div>
                <div className="mt-3 font-display text-base font-semibold text-ivory-50">{t.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-ivory-200/60">
                  {t.specialty}
                </div>
              </button>
            ))}
          </div>
        </Section>
      </div>
    );
  }

  const myCourses = state.courses.filter((c) => c.teacherId === me.id);
  const courseIds = new Set(myCourses.map((c) => c.id));
  const today0 = new Date(new Date().toDateString());
  const mySessions = state.agenda
    .filter((a) => a.teacherId === me.id)
    .sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = mySessions.filter((a) => new Date(a.date) >= today0);
  const past = mySessions.filter((a) => new Date(a.date) < today0);
  const myStudents = state.inscriptions.filter(
    (i) =>
      i.preferredTeacherId === me.id ||
      (i.courseIds ?? []).some((cid) => courseIds.has(cid)),
  );
  const myShows = state.shows.filter((s) => s.cast.includes(me.id));

  // Hours this saison
  const totalMin = mySessions.reduce((acc, a) => {
    const [sh, sm] = a.startTime.split(":").map(Number);
    const [eh, em] = a.endTime.split(":").map(Number);
    return acc + Math.max(0, eh * 60 + em - sh * 60 - sm);
  }, 0);
  const hours = Math.round(totalMin / 60);

  const mailMyStudents = () => {
    const to = myStudents.map((s) => s.email);
    if (to.length === 0) return;
    sendMail({
      to,
      kind: "Cours",
      subject: `Un mot de ${me.name} — Impro 2pro`,
      body: `Bonjour,\n\n[Personnalisez ce message]\n\nÀ très vite en cours,\n${me.name}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header prof */}
      <div
        className="relative overflow-hidden rounded-3xl border p-5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)] sm:p-7"
        style={{
          borderColor: `${me.color}55`,
          background: `linear-gradient(135deg, ${me.color}25 0%, rgba(255,255,255,0.02) 60%)`,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="grid h-16 w-16 place-items-center rounded-full font-marquee text-3xl font-black text-ink-900"
              style={{ backgroundColor: me.color, boxShadow: `0 0 40px ${me.color}88` }}
            >
              {me.name.charAt(0)}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: me.color }}>
                Bonjour
              </div>
              <h1 className="font-display text-3xl font-bold text-ivory-50 sm:text-4xl">
                {me.name}
              </h1>
              <div className="text-sm text-ivory-200/80">{me.specialty}</div>
            </div>
          </div>
          <button
            className="btn-ghost"
            onClick={() => setCurrentTeacherId(null)}
          >
            Changer de prof
          </button>
        </div>
      </div>

      {/* KPIs perso */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <PersoKpi label="Mes cours" value={myCourses.length} color="#a78bfa" />
        <PersoKpi label="Sessions à venir" value={upcoming.length} color="#34d399" />
        <PersoKpi label="Mes élèves" value={myStudents.length} color="#38bdf8" highlight />
        <PersoKpi label="Heures données" value={hours} color="#ecbe4a" suffix="h" />
      </div>

      {/* Mes prochaines sessions */}
      <Section
        eyebrow="Mon planning"
        title="Prochaines sessions"
        tint="violet"
        actionHref="/agenda"
        actionLabel="Agenda complet"
      >
        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-center text-sm text-ivory-200/60">
            Aucun cours planifié pour le moment.
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.slice(0, 6).map((a) => {
              const course = state.courses.find((c) => c.id === a.courseId);
              const d = new Date(a.date);
              return (
                <Link
                  href={`/cours/${a.courseId}`}
                  key={a.id}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-3 transition hover:border-gold-300/40 hover:bg-white/[0.08]"
                >
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-center"
                    style={{ backgroundColor: `${me.color}33` }}
                  >
                    <div>
                      <div className="font-marquee text-base font-black leading-none text-ivory-50">
                        {d.toLocaleDateString("fr-FR", { day: "2-digit" })}
                      </div>
                      <div className="text-[8px] font-bold uppercase tracking-widest text-ivory-200/80">
                        {d.toLocaleDateString("fr-FR", { month: "short" })}
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-base font-semibold text-ivory-50">
                      {course?.title ?? "Cours"}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-ivory-200/70">
                      <span className="inline-flex items-center gap-1">
                        <IconClock size={11} /> {a.startTime}–{a.endTime}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <IconLocation size={11} /> {a.location}
                      </span>
                    </div>
                  </div>
                  <IconArrowRight
                    size={16}
                    className="text-ivory-200/30 transition group-hover:translate-x-1 group-hover:text-gold-300"
                  />
                </Link>
              );
            })}
          </div>
        )}
      </Section>

      {/* Mes cours */}
      <Section
        eyebrow="Pédagogie"
        title="Mes cours"
        tint="emerald"
        actionHref="/cours/nouveau"
        actionLabel="+ Nouveau"
      >
        {myCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-center">
            <p className="text-sm text-ivory-200/70">Pas encore de cours. Créez-en un !</p>
            <Link href="/cours/nouveau" className="btn-primary mt-3 inline-flex">
              <IconSparkle size={14} /> Créer mon premier cours
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {myCourses.map((c) => {
              const enrolledCount = state.inscriptions.filter((i) =>
                (i.courseIds ?? []).includes(c.id),
              ).length;
              return (
                <Link
                  key={c.id}
                  href={`/cours/${c.id}`}
                  className="group rounded-xl border border-white/10 bg-white/[0.05] p-3 transition hover:-translate-y-0.5 hover:border-gold-300/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="eyebrow">{c.level} · {c.duration} min</div>
                      <h3 className="mt-1 truncate font-display text-base font-semibold text-ivory-50">
                        {c.title}
                      </h3>
                    </div>
                    <span className="chip-gold shrink-0">
                      {enrolledCount}/{c.capacity ?? "—"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-ivory-200/70">{c.description}</p>
                </Link>
              );
            })}
          </div>
        )}
      </Section>

      {/* Mes élèves */}
      <Section
        eyebrow="Suivi"
        title="Mes élèves"
        tint="sky"
        actionHref="/inscription"
        actionLabel="Tous les dossiers"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-ivory-200/70">
            {myStudents.length} élève(s) suivent vos cours ou vous ont choisi(e) comme prof
          </span>
          {myStudents.length > 0 && (
            <button className="btn-ghost text-xs" onClick={mailMyStudents}>
              <IconMail size={12} /> Mailer le groupe
            </button>
          )}
        </div>
        {myStudents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-center text-sm text-ivory-200/60">
            Pas encore d'élève rattaché.
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {myStudents.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-ivory-50">
                    {s.firstName} {s.lastName}
                  </div>
                  <div className="truncate text-[11px] text-ivory-200/60">
                    {s.email} · {s.level} · {s.status}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-ivory-200/70">
                  <span className="chip">{s.attendance ?? 0} présences</span>
                  <span className="chip">{s.paymentStatus ?? "Non payé"}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Mes spectacles */}
      {myShows.length > 0 && (
        <Section
          eyebrow="Sur scène"
          title="Mes spectacles"
          tint="gold"
          actionHref="/spectacles"
          actionLabel="Tous"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {myShows.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gold-300">
                  {new Date(s.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </div>
                <div className="mt-0.5 font-display text-base font-semibold text-ivory-50">
                  {s.title}
                </div>
                <div className="mt-0.5 text-[11px] text-ivory-200/70">
                  <IconLocation size={10} className="-mt-0.5 mr-1 inline align-middle" />
                  {s.venue} · {s.status}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Historique récent */}
      {past.length > 0 && (
        <Section eyebrow="Mémoire" title="Sessions passées" tint="rose">
          <ul className="space-y-1 text-xs">
            {past.slice(-6).reverse().map((a) => {
              const course = state.courses.find((c) => c.id === a.courseId);
              return (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded bg-white/[0.04] px-2 py-1.5"
                >
                  <span>
                    <span className="font-semibold">{course?.title ?? "Cours"}</span> ·{" "}
                    {new Date(a.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                  <span className="text-ivory-200/60">
                    {a.startTime}–{a.endTime}
                  </span>
                </li>
              );
            })}
          </ul>
        </Section>
      )}
    </div>
  );
}

function PersoKpi({
  label,
  value,
  color,
  suffix,
  highlight,
}: {
  label: string;
  value: number;
  color: string;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-4 shadow-[0_8px_25px_-10px_rgba(0,0,0,0.45)] sm:p-5"
      style={{ borderColor: `${color}55`, backgroundColor: `${color}14` }}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${color}, ${color}55)` }} />
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] truncate" style={{ color }}>
        {label}
      </div>
      <div className="mt-1 font-marquee text-4xl font-black leading-none text-ivory-50 sm:text-5xl">
        {value}{suffix ?? ""}
      </div>
      {highlight && (
        <div className="absolute inset-x-3 -top-[5px] flex justify-between">
          {Array.from({ length: 6 }).map((_, i) => (
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
