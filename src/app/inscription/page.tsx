"use client";

import { useState } from "react";
import { useStore, useId } from "@/lib/store";
import { useToast } from "@/components/Toast";
import type { Inscription, Level } from "@/lib/types";

const LEVELS: Level[] = ["Débutant", "Intermédiaire", "Avancé", "Tous niveaux"];
const STATUSES: Inscription["status"][] = ["Nouveau", "Contacté", "Confirmé", "Annulé"];

export default function InscriptionPage() {
  const { state, addInscription, updateInscription, sendMail } = useStore();
  const toast = useToast();
  const newId = useId();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [level, setLevel] = useState<Level>("Débutant");
  const [preferredTeacherId, setPreferredTeacherId] = useState("");
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
      phone,
      level,
      preferredTeacherId: preferredTeacherId || undefined,
      message,
      status: "Nouveau",
      createdAt: new Date().toISOString(),
    };
    addInscription(inscription);
    sendMail({
      to: [email],
      kind: "Notification",
      subject: "Votre inscription Impro 2pro est bien reçue",
      body: `Bonjour ${firstName},\n\nNous avons bien reçu votre inscription au niveau « ${level} ». Nous revenons vers vous très vite pour confirmer une date d'essai.\n\nÀ très vite,\nLa troupe Impro 2pro`,
    });
    toast.push({ message: "Inscription enregistrée. Mail de confirmation envoyé.", tone: "success" });
    setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setMessage("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.4fr]">
      <form onSubmit={submit} className="card space-y-3">
        <h1 className="font-display text-2xl font-semibold">Rejoindre la troupe</h1>
        <p className="text-sm text-stage-400">
          Remplissez le formulaire, nous vous recontactons sous 48h.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
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
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="label">Niveau visé</label>
            <select
              className="input"
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
            >
              {LEVELS.map((l) => (<option key={l} value={l}>{l}</option>))}
            </select>
          </div>
          <div>
            <label className="label">Prof préféré (optionnel)</label>
            <select
              className="input"
              value={preferredTeacherId}
              onChange={(e) => setPreferredTeacherId(e.target.value)}
            >
              <option value="">— peu importe —</option>
              {state.teachers.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Message</label>
          <textarea
            className="input min-h-[100px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Présentez-vous brièvement, vos envies, vos disponibilités…"
          />
        </div>
        <button className="btn-primary" type="submit">📝 Envoyer mon inscription</button>
      </form>

      <div className="card">
        <h2 className="section-title text-xl">Inscriptions reçues</h2>
        <p className="mt-1 text-sm text-stage-400">
          Suivi des candidatures pour la troupe et coordination du recontact.
        </p>
        <ul className="mt-4 divide-y divide-white/5">
          {state.inscriptions.length === 0 && (
            <li className="py-6 text-center text-sm text-stage-400">
              Aucune inscription pour l'instant.
            </li>
          )}
          {state.inscriptions.map((i) => {
            const teacher = state.teachers.find((t) => t.id === i.preferredTeacherId);
            return (
              <li key={i.id} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold">
                      {i.firstName} {i.lastName}{" "}
                      <span className="ml-1 text-xs font-normal text-stage-400">
                        · {i.email}
                      </span>
                    </div>
                    <div className="text-xs text-stage-400">
                      {i.level} · {teacher ? `prof : ${teacher.name}` : "pas de préférence"} ·{" "}
                      {new Date(i.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                    {i.message && (
                      <div className="mt-1 max-w-xl text-sm text-stage-200">“{i.message}”</div>
                    )}
                  </div>
                  <select
                    className="input w-36"
                    value={i.status}
                    onChange={(e) =>
                      updateInscription(i.id, { status: e.target.value as Inscription["status"] })
                    }
                  >
                    {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
