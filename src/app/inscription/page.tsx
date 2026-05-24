"use client";

import { useMemo, useState } from "react";
import { useStore, useId } from "@/lib/store";
import { useToast } from "@/components/Toast";
import { Section } from "@/components/Section";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconMail,
  IconPlus,
  IconQuill,
  IconTrash,
} from "@/components/Icons";
import type { Inscription, Level } from "@/lib/types";

const LEVELS: Level[] = ["Débutant", "Intermédiaire", "Avancé", "Tous niveaux"];
const PAYMENTS: NonNullable<Inscription["paymentStatus"]>[] = [
  "Non payé",
  "Acompte",
  "Payé",
  "Saison complète",
];
const STATUS_ORDER: Inscription["status"][] = ["Nouveau", "Contacté", "Actif", "Archivé"];

export default function InscriptionPage() {
  const { state, addInscription, updateInscription, sendMail } = useStore();
  const toast = useToast();
  const newId = useId();

  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [level, setLevel] = useState<Level>("Débutant");
  const [preferredTeacherId, setPreferredTeacherId] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      toast.push({ message: "Prénom, nom et email sont requis.", tone: "error" });
      return;
    }
    const inscription: Inscription = {
      id: newId(),
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      level,
      preferredTeacherId: preferredTeacherId || undefined,
      courseIds: selectedCourses,
      paymentStatus: "Non payé",
      attendance: 0,
      message,
      status: "Nouveau",
      createdAt: new Date().toISOString(),
    };
    addInscription(inscription);
    sendMail({
      to: [email],
      kind: "Notification",
      subject: "Votre inscription Impro 2pro est bien reçue",
      body: `Bonjour ${firstName},\n\nNous avons bien reçu votre inscription au niveau « ${level} ». Nous revenons vers vous très vite.\n\nÀ très vite,\nLa troupe Impro 2pro`,
    });
    toast.push({ message: "Inscription enregistrée + mail de confirmation envoyé.", tone: "success" });
    setShowForm(false);
    setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setSelectedCourses([]); setMessage(""); setPreferredTeacherId("");
  };

  const buckets = useMemo(() => {
    const sorted = [...state.inscriptions].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );
    return {
      Nouveau: sorted.filter((i) => i.status === "Nouveau"),
      Contacté: sorted.filter((i) => i.status === "Contacté"),
      Actif: sorted.filter((i) => i.status === "Actif"),
      Archivé: sorted.filter((i) => i.status === "Archivé"),
    };
  }, [state.inscriptions]);

  const tints: Record<Inscription["status"], "sky" | "orange" | "emerald" | "rose"> = {
    Nouveau: "sky",
    Contacté: "orange",
    Actif: "emerald",
    Archivé: "rose",
  };

  const toggleCourse = (id: string) =>
    setSelectedCourses((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="eyebrow">Élèves</div>
          <h1 className="font-display text-2xl font-bold text-ivory-50 sm:text-3xl">
            Inscriptions & suivi élèves
          </h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
          <IconPlus size={16} /> {showForm ? "Annuler" : "Nouvelle inscription"}
        </button>
      </div>

      {showForm && (
        <Section eyebrow="Nouveau dossier" title="Rejoindre la troupe" tint="sky">
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="label">Prénom *</label>
              <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="label">Nom *</label>
              <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <label className="label">Email *</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">Téléphone</label>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="label">Niveau visé</label>
              <select className="input" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                {LEVELS.map((l) => (<option key={l} value={l}>{l}</option>))}
              </select>
            </div>
            <div>
              <label className="label">Prof préféré (optionnel)</label>
              <select className="input" value={preferredTeacherId} onChange={(e) => setPreferredTeacherId(e.target.value)}>
                <option value="">— peu importe —</option>
                {state.teachers.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label">Cours visés</label>
              <div className="flex flex-wrap gap-2">
                {state.courses.map((c) => {
                  const on = selectedCourses.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCourse(c.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        on
                          ? "border-gold-300 bg-gold-300 text-ink-900"
                          : "border-white/15 bg-white/5 text-ivory-100 hover:bg-white/10"
                      }`}
                    >
                      {c.title} <span className="text-[10px] opacity-70">· {c.level}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="label">Message</label>
              <textarea
                className="input min-h-[80px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Présentation, disponibilités, attentes…"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button className="btn-primary" type="submit">
                <IconQuill size={14} /> Enregistrer l'inscription
              </button>
            </div>
          </form>
        </Section>
      )}

      {/* KANBAN */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {STATUS_ORDER.map((st) => (
          <Section
            key={st}
            eyebrow={`${buckets[st].length} dossier${buckets[st].length > 1 ? "s" : ""}`}
            title={st}
            tint={tints[st]}
          >
            <div className="space-y-3">
              {buckets[st].length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-center text-[11px] text-ivory-200/50">
                  Aucun dossier.
                </div>
              ) : (
                buckets[st].map((i) => (
                  <InscriptionCard
                    key={i.id}
                    inscription={i}
                    teachers={state.teachers}
                    courses={state.courses}
                    onPatch={(p) => updateInscription(i.id, p)}
                    onMail={() => {
                      sendMail({
                        to: [i.email],
                        kind: "Notification",
                        subject: `Impro 2pro — message pour ${i.firstName}`,
                        body: `Bonjour ${i.firstName},\n\n[À personnaliser]\n\nÀ très vite,\nLa troupe Impro 2pro`,
                      });
                      toast.push({ message: `Mail envoyé à ${i.email}.`, tone: "success" });
                    }}
                  />
                ))
              )}
            </div>
          </Section>
        ))}
      </div>
    </div>
  );
}

function InscriptionCard({
  inscription: i,
  teachers,
  courses,
  onPatch,
  onMail,
}: {
  inscription: Inscription;
  teachers: ReturnType<typeof useStore>["state"]["teachers"];
  courses: ReturnType<typeof useStore>["state"]["courses"];
  onPatch: (p: Partial<Inscription>) => void;
  onMail: () => void;
}) {
  const teacher = teachers.find((t) => t.id === i.preferredTeacherId);
  const enrolled = (i.courseIds ?? [])
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean);
  const nextStatus =
    i.status === "Nouveau"
      ? "Contacté"
      : i.status === "Contacté"
      ? "Actif"
      : i.status === "Actif"
      ? "Archivé"
      : null;

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.05] p-3 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-display text-base font-semibold text-ivory-50">
            {i.firstName} {i.lastName}
          </div>
          <div className="mt-0.5 truncate text-[11px] text-ivory-200/70">{i.email}</div>
          {i.phone && (
            <div className="truncate text-[11px] text-ivory-200/50">{i.phone}</div>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="chip">{i.level}</span>
          {teacher && (
            <span
              className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-black text-ink-900"
              style={{ backgroundColor: teacher.color }}
              title={`Prof préféré : ${teacher.name}`}
            >
              {teacher.name.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {enrolled.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {enrolled.map((c) => (
            <span key={c!.id} className="chip-gold">{c!.title}</span>
          ))}
        </div>
      )}

      {i.trialDate && (
        <div className="mt-2 inline-flex items-center gap-1 rounded bg-orange-400/15 px-2 py-0.5 text-[11px] text-orange-300">
          <IconClock size={11} />
          Essai : {new Date(i.trialDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
        </div>
      )}

      {i.message && (
        <div className="mt-2 rounded bg-white/[0.04] p-2 text-[11px] italic text-ivory-200/80">
          “{i.message}”
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-ivory-200/50">
            Paiement
          </div>
          <select
            className="mt-0.5 w-full rounded-md border border-white/15 bg-white/5 px-1.5 py-1 text-[11px] text-ivory-50"
            value={i.paymentStatus ?? "Non payé"}
            onChange={(e) => onPatch({ paymentStatus: e.target.value as Inscription["paymentStatus"] })}
          >
            {PAYMENTS.map((p) => (<option key={p} value={p}>{p}</option>))}
          </select>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-ivory-200/50">
            Présences
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <button
              className="rounded border border-white/15 px-1.5 py-0.5 text-[11px] hover:bg-white/10"
              onClick={() => onPatch({ attendance: Math.max(0, (i.attendance ?? 0) - 1) })}
            >
              −
            </button>
            <span className="grow text-center font-marquee text-sm font-black text-ivory-50">
              {i.attendance ?? 0}
            </span>
            <button
              className="rounded border border-white/15 px-1.5 py-0.5 text-[11px] hover:bg-white/10"
              onClick={() => onPatch({ attendance: (i.attendance ?? 0) + 1 })}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1">
        <button
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-widest hover:bg-white/10"
          onClick={onMail}
          title="Envoyer un mail"
        >
          <IconMail size={11} /> Mail
        </button>
        {nextStatus && (
          <button
            className="inline-flex items-center gap-1 rounded-full border border-gold-300/50 bg-gold-300/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-200 hover:bg-gold-300/25"
            onClick={() => onPatch({ status: nextStatus })}
          >
            {nextStatus === "Actif" ? <IconCheck size={11} /> : <IconArrowRight size={11} />}
            {nextStatus}
          </button>
        )}
        <button
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-velvet-400/50 bg-velvet-700/30 px-2 py-1 text-[10px] uppercase tracking-widest text-velvet-100 hover:bg-velvet-700/50"
          onClick={() => onPatch({ status: "Archivé" })}
          title="Archiver"
        >
          <IconTrash size={11} />
        </button>
      </div>
    </article>
  );
}
