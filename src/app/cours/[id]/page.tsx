"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { TeacherBadge } from "@/components/TeacherBadge";
import { useToast } from "@/components/Toast";
import { useStore } from "@/lib/store";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, removeCourse, sendMail } = useStore();
  const toast = useToast();
  const course = state.courses.find((c) => c.id === params?.id);
  const teacher = state.teachers.find((t) => t.id === course?.teacherId);
  const sessions = state.agenda.filter((a) => a.courseId === course?.id);
  const [step, setStep] = useState(0);
  const [recipients, setRecipients] = useState(
    state.inscriptions.map((i) => i.email).join(", "),
  );

  if (!course) return notFound();

  const totalSeconds = useMemo(
    () => course.exercises.reduce((s, e) => s + e.duration, 0) * 60,
    [course],
  );

  const handleSendMail = () => {
    const to = recipients.split(",").map((e) => e.trim()).filter(Boolean);
    if (to.length === 0) {
      toast.push({ message: "Ajoutez au moins un destinataire.", tone: "error" });
      return;
    }
    sendMail({
      to,
      kind: "Cours",
      subject: `[Impro 2pro] Cours : ${course.title}`,
      body: `Bonjour,\n\nVoici le détail du prochain cours « ${course.title} » (${course.level}, ${course.duration} min) animé par ${teacher?.name ?? "—"}.\n\n${course.description}\n\nObjectifs :\n- ${course.goals.join("\n- ")}\n\nÀ très vite,\nLa troupe Impro 2pro`,
    });
    toast.push({ message: `Cours envoyé à ${to.length} destinataire(s).`, tone: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link href="/cours" className="text-xs text-stage-400 hover:underline">
              ← Tous les cours
            </Link>
            <h1 className="mt-2 font-display text-3xl font-bold">{course.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <TeacherBadge teacher={teacher} size="md" />
              <span className="chip">{course.level}</span>
              <span className="chip">{course.duration} min</span>
              {course.interactive && <span className="chip">interactif</span>}
              {course.createdWithAI && <span className="chip">généré par IA</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/agenda?course=${course.id}`} className="btn-ghost">📅 Planifier</Link>
            <button
              className="btn-danger"
              onClick={() => {
                if (confirm("Supprimer ce cours ?")) {
                  removeCourse(course.id);
                  toast.push({ message: "Cours supprimé.", tone: "info" });
                  router.push("/cours");
                }
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
        <p className="mt-4 text-stage-200">{course.description}</p>
        {course.goals.length > 0 && (
          <div className="mt-4">
            <div className="label">Objectifs pédagogiques</div>
            <ul className="ml-5 list-disc text-stage-200">
              {course.goals.map((g, i) => (<li key={i}>{g}</li>))}
            </ul>
          </div>
        )}
      </div>

      {course.interactive ? (
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title text-xl">Mode interactif</h2>
            <div className="text-xs text-stage-400">
              Étape {step + 1} / {course.exercises.length} · Total {Math.round(totalSeconds / 60)} min
            </div>
          </div>
          {course.exercises.length === 0 ? (
            <p className="text-stage-300">Aucun exercice défini.</p>
          ) : (
            <div className="rounded-2xl bg-stage-900/50 p-6 ring-1 ring-white/5">
              <div className="text-xs uppercase tracking-widest text-scene-300">
                Exercice {step + 1} · {course.exercises[step].duration} min
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold">
                {course.exercises[step].title}
              </h3>
              <p className="mt-3 text-stage-200">{course.exercises[step].description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {course.exercises[step].goals.map((g) => (
                  <span key={g} className="chip">{g}</span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <button
                  className="btn-ghost"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  ← Précédent
                </button>
                <div className="flex gap-1">
                  {course.exercises.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-6 rounded-full ${
                        i <= step ? "bg-scene-400" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <button
                  className="btn-primary"
                  disabled={step === course.exercises.length - 1}
                  onClick={() => setStep((s) => Math.min(course.exercises.length - 1, s + 1))}
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <h2 className="section-title text-xl">Déroulé du cours</h2>
          <ol className="mt-4 space-y-3">
            {course.exercises.map((e, i) => (
              <li key={e.id} className="rounded-xl bg-stage-900/50 p-4 ring-1 ring-white/5">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">
                    {i + 1}. {e.title}
                  </div>
                  <span className="chip">{e.duration} min</span>
                </div>
                <p className="mt-1 text-sm text-stage-300">{e.description}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="card">
        <h2 className="section-title text-xl">Envoyer ce cours par mail</h2>
        <p className="mt-1 text-sm text-stage-400">
          Diffusez le détail du cours aux inscrits ou à une liste personnalisée.
        </p>
        <div className="mt-4 grid gap-3">
          <div>
            <label className="label">Destinataires (séparés par des virgules)</label>
            <textarea
              className="input min-h-[80px]"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
            />
          </div>
          <div>
            <button className="btn-primary self-start" onClick={handleSendMail}>
              ✉️ Envoyer
            </button>
          </div>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="card">
          <h2 className="section-title text-xl">Sessions planifiées</h2>
          <ul className="mt-3 divide-y divide-white/5">
            {sessions.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                <span>
                  {new Date(a.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}{" "}
                  · {a.startTime}–{a.endTime}
                </span>
                <span className="text-stage-400">{a.location}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
