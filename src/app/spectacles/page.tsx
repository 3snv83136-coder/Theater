"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore, useId } from "@/lib/store";
import { useToast } from "@/components/Toast";
import { TeacherBadge } from "@/components/TeacherBadge";
import type { Show } from "@/lib/types";

export default function ShowsPage() {
  const { state, addShow, removeShow, sendMail } = useStore();
  const toast = useToast();
  const newId = useId();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [venue, setVenue] = useState("");
  const [pitch, setPitch] = useState("");
  const [cast, setCast] = useState<string[]>([]);
  const [price, setPrice] = useState(12);
  const [ticketUrl, setTicketUrl] = useState("");

  const toggleCast = (id: string) =>
    setCast((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const create = () => {
    if (!title || !venue || !date) {
      toast.push({ message: "Titre, lieu et date requis.", tone: "error" });
      return;
    }
    const show: Show = {
      id: newId(),
      title,
      date: new Date(date).toISOString(),
      venue,
      pitch,
      cast,
      priceCents: Math.round(price * 100),
      ticketUrl: ticketUrl || undefined,
      createdAt: new Date().toISOString(),
    };
    addShow(show);
    toast.push({ message: "Spectacle créé.", tone: "success" });
    setTitle(""); setVenue(""); setPitch(""); setCast([]); setTicketUrl("");
  };

  const broadcastShow = (show: Show) => {
    const to = state.inscriptions.map((i) => i.email);
    if (to.length === 0) {
      toast.push({ message: "Aucun destinataire dans la base.", tone: "error" });
      return;
    }
    sendMail({
      to,
      kind: "Spectacle",
      subject: `🎭 ${show.title} — ${new Date(show.date).toLocaleDateString("fr-FR")}`,
      body: `Bonjour,\n\nNous avons le plaisir de vous annoncer notre prochain spectacle :\n\n${show.title}\n${new Date(show.date).toLocaleString("fr-FR")} — ${show.venue}\nTarif : ${(show.priceCents / 100).toFixed(2)} €${show.ticketUrl ? `\nBilletterie : ${show.ticketUrl}` : ""}\n\n${show.pitch}\n\nÀ très vite,\nLa troupe Impro 2pro`,
    });
    toast.push({ message: `Diffusion envoyée à ${to.length} destinataires.`, tone: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="card grid gap-3">
        <h1 className="font-display text-2xl font-semibold">Créer un spectacle</h1>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Titre</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label">Date & heure</label>
            <input
              type="datetime-local"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Lieu</label>
            <input className="input" value={venue} onChange={(e) => setVenue(e.target.value)} />
          </div>
          <div>
            <label className="label">Tarif (€)</label>
            <input
              type="number"
              min={0}
              step={1}
              className="input"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">URL billetterie (optionnel)</label>
            <input className="input" value={ticketUrl} onChange={(e) => setTicketUrl(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Pitch / synopsis</label>
            <textarea
              className="input min-h-[100px]"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label">Distribution</label>
          <div className="flex flex-wrap gap-2">
            {state.teachers.map((t) => {
              const on = cast.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleCast(t.id)}
                  className={`rounded-xl px-3 py-1.5 text-sm transition ${
                    on
                      ? "bg-scene-500 text-stage-950"
                      : "bg-white/5 text-stage-200 hover:bg-white/10"
                  }`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
        <button className="btn-primary self-start" onClick={create}>+ Créer le spectacle</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {state.shows.length === 0 && (
          <div className="card text-stage-300">Aucun spectacle créé.</div>
        )}
        {state.shows.map((s) => (
          <div key={s.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <div className="text-xs text-stage-400">
                  {new Date(s.date).toLocaleString("fr-FR")} · {s.venue}
                </div>
              </div>
              <span className="chip">{(s.priceCents / 100).toFixed(2)} €</span>
            </div>
            <p className="mt-3 text-sm text-stage-200">{s.pitch}</p>
            {s.cast.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-stage-400">
                  Distribution
                </span>
                {s.cast.map((id) => (
                  <TeacherBadge
                    key={id}
                    teacher={state.teachers.find((t) => t.id === id)}
                  />
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-primary" onClick={() => broadcastShow(s)}>
                ✉️ Diffuser par mail
              </button>
              {s.ticketUrl && (
                <Link href={s.ticketUrl} target="_blank" className="btn-ghost">
                  🎟️ Billetterie
                </Link>
              )}
              <button
                className="btn-danger ml-auto"
                onClick={() => {
                  if (confirm("Supprimer ce spectacle ?")) removeShow(s.id);
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
