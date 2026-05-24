"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/Toast";

export default function DashboardPage() {
  const { state, sendMail, resetAll } = useStore();
  const toast = useToast();

  const [subject, setSubject] = useState("Newsletter Impro 2pro");
  const [body, setBody] = useState(
    "Bonjour,\n\nVoici les actualités du mois : nouveaux ateliers, spectacles à venir, et coulisses.\n\nÀ très vite,\nLa troupe Impro 2pro",
  );
  const [target, setTarget] = useState<"all" | "students" | "published">("all");

  const recipients = useMemo(() => {
    const fromInscriptions = state.inscriptions.map((i) => i.email);
    const fromTeachers = state.teachers.map((t) => t.email);
    if (target === "all") return Array.from(new Set([...fromInscriptions, ...fromTeachers]));
    if (target === "students") return Array.from(new Set(fromInscriptions));
    return Array.from(new Set(fromTeachers));
  }, [state, target]);

  const send = () => {
    if (recipients.length === 0) {
      toast.push({ message: "Aucun destinataire.", tone: "error" });
      return;
    }
    sendMail({ to: recipients, subject, body, kind: "Newsletter" });
    toast.push({ message: `Newsletter envoyée à ${recipients.length} contacts.`, tone: "success" });
  };

  const byTeacher = useMemo(() => {
    return state.teachers.map((t) => ({
      teacher: t,
      courses: state.courses.filter((c) => c.teacherId === t.id).length,
      sessions: state.agenda.filter((a) => a.teacherId === t.id).length,
    }));
  }, [state]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Kpi label="Cours" value={state.courses.length} />
        <Kpi label="Sessions planifiées" value={state.agenda.length} />
        <Kpi label="Inscriptions" value={state.inscriptions.length} accent />
        <Kpi label="Spectacles" value={state.shows.length} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="card">
          <h2 className="section-title text-xl">Diffuser une newsletter</h2>
          <p className="mt-1 text-sm text-stage-400">
            Envoyez un message à toute la base : élèves, profs, ou les deux.
          </p>
          <div className="mt-4 grid gap-3">
            <div>
              <label className="label">Cible</label>
              <div className="inline-flex rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
                {(
                  [
                    ["all", "Tout le monde"],
                    ["students", "Élèves"],
                    ["published", "Profs"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    className={`rounded-lg px-3 py-1.5 text-sm transition ${
                      target === id ? "bg-scene-500 text-stage-950" : "text-stage-200"
                    }`}
                    onClick={() => setTarget(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-1 text-xs text-stage-400">
                {recipients.length} destinataire(s)
              </div>
            </div>
            <div>
              <label className="label">Objet</label>
              <input
                className="input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                className="input min-h-[180px]"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <button className="btn-primary self-start" onClick={send}>📨 Envoyer</button>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title text-xl">Activité par prof</h2>
          <ul className="mt-3 divide-y divide-white/5">
            {byTeacher.map(({ teacher, courses, sessions }) => (
              <li key={teacher.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full font-bold text-stage-950"
                    style={{ backgroundColor: teacher.color }}
                  >
                    {teacher.name.charAt(0)}
                  </span>
                  <div>
                    <div className="font-semibold">{teacher.name}</div>
                    <div className="text-xs text-stage-400">{teacher.specialty}</div>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="chip">{courses} cours</span>
                  <span className="chip">{sessions} sessions</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title text-xl">Journal des envois</h2>
          <Link href="/spectacles" className="text-xs text-scene-300 hover:underline">
            → Diffuser un spectacle
          </Link>
        </div>
        <ul className="divide-y divide-white/5">
          {state.mails.length === 0 && (
            <li className="py-6 text-center text-sm text-stage-400">
              Aucun envoi pour l'instant.
            </li>
          )}
          {state.mails.slice(0, 20).map((m) => (
            <li key={m.id} className="py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-semibold">{m.subject}</div>
                  <div className="text-xs text-stage-400">
                    {new Date(m.sentAt).toLocaleString("fr-FR")} · {m.to.length} destinataire(s) ·{" "}
                    {m.kind}
                  </div>
                </div>
                <details className="text-xs text-stage-300">
                  <summary className="cursor-pointer hover:underline">Voir le contenu</summary>
                  <pre className="mt-2 max-w-2xl whitespace-pre-wrap rounded-lg bg-stage-900/60 p-3 text-stage-200 ring-1 ring-white/5">
                    {m.body}
                  </pre>
                </details>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Réinitialiser les données</h3>
          <p className="text-xs text-stage-400">
            Restaure les cours, agenda, inscriptions et envois aux données d'origine.
          </p>
        </div>
        <button
          className="btn-danger"
          onClick={() => {
            if (confirm("Tout réinitialiser ?")) {
              resetAll();
              toast.push({ message: "Données réinitialisées.", tone: "info" });
            }
          }}
        >
          🗑️ Réinitialiser
        </button>
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`card ${accent ? "ring-1 ring-scene-400/40" : ""}`}>
      <div className="text-xs uppercase tracking-widest text-stage-400">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}
