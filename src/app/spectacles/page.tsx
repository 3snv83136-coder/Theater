"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore, useId } from "@/lib/store";
import { useToast } from "@/components/Toast";
import { TeacherBadge } from "@/components/TeacherBadge";
import { Section } from "@/components/Section";
import {
  IconCalendar,
  IconClock,
  IconLocation,
  IconMail,
  IconPlus,
  IconTicket,
  IconTrash,
} from "@/components/Icons";
import type { Rehearsal, Show } from "@/lib/types";

export default function ShowsPage() {
  const { state, addShow, updateShow, removeShow, sendMail } = useStore();
  const toast = useToast();
  const newId = useId();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [venue, setVenue] = useState("");
  const [pitch, setPitch] = useState("");
  const [cast, setCast] = useState<string[]>([]);
  const [price, setPrice] = useState(12);
  const [capacity, setCapacity] = useState(100);
  const [ticketUrl, setTicketUrl] = useState("");
  const [status, setStatus] = useState<Show["status"]>("Répétition");

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
      capacity,
      soldTickets: 0,
      status,
      rehearsals: [],
      ticketUrl: ticketUrl || undefined,
      createdAt: new Date().toISOString(),
    };
    addShow(show);
    toast.push({ message: "Spectacle créé.", tone: "success" });
    setShowForm(false);
    setTitle(""); setVenue(""); setPitch(""); setCast([]); setTicketUrl("");
  };

  const buckets = useMemo(() => {
    const order = (s: Show) => +new Date(s.date);
    return {
      affiche: state.shows.filter((s) => s.status === "À l'affiche").sort((a, b) => order(a) - order(b)),
      repet: state.shows.filter((s) => s.status === "Répétition").sort((a, b) => order(a) - order(b)),
      archive: state.shows.filter((s) => s.status === "Archivé").sort((a, b) => order(b) - order(a)),
    };
  }, [state.shows]);

  const broadcastShow = (show: Show) => {
    const to = state.inscriptions.map((i) => i.email);
    if (to.length === 0) {
      toast.push({ message: "Aucun destinataire.", tone: "error" });
      return;
    }
    sendMail({
      to,
      kind: "Spectacle",
      subject: `${show.title} — ${new Date(show.date).toLocaleDateString("fr-FR")}`,
      body: `Bonjour,\n\nNous avons le plaisir de vous annoncer notre prochain spectacle :\n\n${show.title}\n${new Date(show.date).toLocaleString("fr-FR")} — ${show.venue}\nTarif : ${(show.priceCents / 100).toFixed(2)} €\n\n${show.pitch}\n\nÀ très vite,\nLa troupe Impro 2pro`,
    });
    toast.push({ message: `Mail envoyé à ${to.length} contacts.`, tone: "success" });
  };

  const sellTicket = (s: Show, n: number) => {
    const next = Math.max(0, Math.min(s.capacity ?? 9999, (s.soldTickets ?? 0) + n));
    updateShow(s.id, { soldTickets: next });
  };

  const addRehearsal = (s: Show) => {
    const dt = prompt("Date et heure (YYYY-MM-DD HH:MM)");
    if (!dt) return;
    const parsed = new Date(dt.replace(" ", "T"));
    if (isNaN(+parsed)) {
      toast.push({ message: "Date invalide.", tone: "error" });
      return;
    }
    const loc = prompt("Lieu (optionnel)") ?? "";
    const r: Rehearsal = {
      id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: parsed.toISOString(),
      location: loc || undefined,
    };
    updateShow(s.id, { rehearsals: [...(s.rehearsals ?? []), r] });
  };

  const removeRehearsal = (s: Show, id: string) =>
    updateShow(s.id, { rehearsals: (s.rehearsals ?? []).filter((r) => r.id !== id) });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="eyebrow">Production</div>
          <h1 className="font-display text-2xl font-bold text-ivory-50 sm:text-3xl">
            Spectacles de la troupe
          </h1>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          <IconPlus size={16} /> {showForm ? "Annuler" : "Nouveau spectacle"}
        </button>
      </div>

      {showForm && (
        <Section eyebrow="Création" title="Nouveau spectacle" tint="orange">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="label">Titre</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="label">Date & heure</label>
              <input type="datetime-local" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="label">Lieu</label>
              <input className="input" value={venue} onChange={(e) => setVenue(e.target.value)} />
            </div>
            <div>
              <label className="label">Tarif (€)</label>
              <input type="number" min={0} step={1} className="input" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className="label">Capacité (places)</label>
              <input type="number" min={1} className="input" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className="label">Statut</label>
              <select className="input" value={status} onChange={(e) => setStatus(e.target.value as Show["status"])}>
                <option value="Répétition">Répétition</option>
                <option value="À l'affiche">À l'affiche</option>
                <option value="Archivé">Archivé</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label">Pitch / synopsis</label>
              <textarea className="input min-h-[100px]" value={pitch} onChange={(e) => setPitch(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="label">URL billetterie (optionnel)</label>
              <input className="input" value={ticketUrl} onChange={(e) => setTicketUrl(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Distribution</label>
              <div className="flex flex-wrap gap-2">
                {state.teachers.map((t) => {
                  const on = cast.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleCast(t.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        on
                          ? "border-gold-300 bg-gold-300 text-ink-900"
                          : "border-white/15 bg-white/5 text-ivory-100 hover:bg-white/10"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="btn-primary" onClick={create}>Créer le spectacle</button>
          </div>
        </Section>
      )}

      <Section eyebrow="En scène" title={`À l'affiche · ${buckets.affiche.length}`} tint="gold">
        {buckets.affiche.length === 0 ? (
          <Empty msg="Aucun spectacle à l'affiche." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {buckets.affiche.map((s) => (
              <ShowCard
                key={s.id}
                show={s}
                tint="#ecbe4a"
                teachers={state.teachers}
                onSell={(n) => sellTicket(s, n)}
                onAddRehearsal={() => addRehearsal(s)}
                onRemoveRehearsal={(id) => removeRehearsal(s, id)}
                onBroadcast={() => broadcastShow(s)}
                onChangeStatus={(st) => updateShow(s.id, { status: st })}
                onRemove={() => {
                  if (confirm("Supprimer ce spectacle ?")) removeShow(s.id);
                }}
              />
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow="Coulisses" title={`En répétition · ${buckets.repet.length}`} tint="violet">
        {buckets.repet.length === 0 ? (
          <Empty msg="Aucune création en répétition." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {buckets.repet.map((s) => (
              <ShowCard
                key={s.id}
                show={s}
                tint="#a78bfa"
                teachers={state.teachers}
                onSell={(n) => sellTicket(s, n)}
                onAddRehearsal={() => addRehearsal(s)}
                onRemoveRehearsal={(id) => removeRehearsal(s, id)}
                onBroadcast={() => broadcastShow(s)}
                onChangeStatus={(st) => updateShow(s.id, { status: st })}
                onRemove={() => {
                  if (confirm("Supprimer ce spectacle ?")) removeShow(s.id);
                }}
              />
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow="Mémoire" title={`Archives · ${buckets.archive.length}`} tint="emerald">
        {buckets.archive.length === 0 ? (
          <Empty msg="Aucun spectacle archivé." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {buckets.archive.map((s) => (
              <ShowCard
                key={s.id}
                show={s}
                tint="#34d399"
                teachers={state.teachers}
                onSell={(n) => sellTicket(s, n)}
                onAddRehearsal={() => addRehearsal(s)}
                onRemoveRehearsal={(id) => removeRehearsal(s, id)}
                onBroadcast={() => broadcastShow(s)}
                onChangeStatus={(st) => updateShow(s.id, { status: st })}
                onRemove={() => {
                  if (confirm("Supprimer ce spectacle ?")) removeShow(s.id);
                }}
                compact
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center text-sm text-ivory-200/60">
      {msg}
    </div>
  );
}

function ShowCard({
  show,
  tint,
  teachers,
  onSell,
  onAddRehearsal,
  onRemoveRehearsal,
  onBroadcast,
  onChangeStatus,
  onRemove,
  compact,
}: {
  show: Show;
  tint: string;
  teachers: ReturnType<typeof useStore>["state"]["teachers"];
  onSell: (n: number) => void;
  onAddRehearsal: () => void;
  onRemoveRehearsal: (id: string) => void;
  onBroadcast: () => void;
  onChangeStatus: (s: Show["status"]) => void;
  onRemove: () => void;
  compact?: boolean;
}) {
  const sold = show.soldTickets ?? 0;
  const cap = show.capacity ?? 0;
  const pct = cap > 0 ? Math.min(100, Math.round((sold / cap) * 100)) : 0;
  const d = new Date(show.date);

  return (
    <article
      className="overflow-hidden rounded-2xl border bg-white/[0.06] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] backdrop-blur"
      style={{ borderColor: `${tint}55` }}
    >
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${tint}, ${tint}55)` }} />
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: tint }}>
              {d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
            <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-ivory-50">
              {show.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ivory-200/70">
              <span className="inline-flex items-center gap-1">
                <IconLocation size={12} /> {show.venue}
              </span>
              <span className="inline-flex items-center gap-1">
                <IconClock size={12} /> {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="inline-flex items-center gap-1">
                <IconTicket size={12} /> {(show.priceCents / 100).toFixed(2)} €
              </span>
            </div>
          </div>
          <select
            className="rounded-full border bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-ivory-50"
            style={{ borderColor: `${tint}55` }}
            value={show.status}
            onChange={(e) => onChangeStatus(e.target.value as Show["status"])}
          >
            <option value="Répétition">Répétition</option>
            <option value="À l'affiche">À l'affiche</option>
            <option value="Archivé">Archivé</option>
          </select>
        </div>

        {show.pitch && (
          <p className="mt-3 text-sm text-ivory-100/90 line-clamp-3">{show.pitch}</p>
        )}

        {show.cast.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-ivory-200/60">
              Distribution
            </span>
            {show.cast.map((id) => (
              <TeacherBadge key={id} teacher={teachers.find((t) => t.id === id)} />
            ))}
          </div>
        )}

        {/* Billetterie */}
        {!compact && cap > 0 && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-widest text-ivory-200/70">
                Billetterie
              </span>
              <span className="font-marquee text-base font-black text-ivory-50">
                {sold}/{cap}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${tint}, ${tint}99)` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-ivory-200/70">
              <span>{cap - sold} restantes · {pct}% rempli</span>
              <div className="flex gap-1">
                <button
                  onClick={() => onSell(-1)}
                  className="rounded border border-white/15 px-2 py-0.5 hover:bg-white/10"
                >
                  −1
                </button>
                <button
                  onClick={() => onSell(1)}
                  className="rounded border border-white/15 px-2 py-0.5 hover:bg-white/10"
                >
                  +1
                </button>
                <button
                  onClick={() => onSell(10)}
                  className="rounded border border-white/15 px-2 py-0.5 hover:bg-white/10"
                >
                  +10
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Répétitions */}
        {!compact && (
          <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-widest text-ivory-200/70">
                <IconCalendar size={12} className="-mt-0.5 mr-1 inline align-middle" />
                Répétitions
              </span>
              <button
                className="rounded border border-white/15 px-2 py-0.5 text-[11px] hover:bg-white/10"
                onClick={onAddRehearsal}
              >
                + Ajouter
              </button>
            </div>
            {(show.rehearsals ?? []).length === 0 ? (
              <div className="text-[11px] text-ivory-200/50">Pas encore de répétition planifiée.</div>
            ) : (
              <ul className="space-y-1 text-[11px]">
                {(show.rehearsals ?? [])
                  .slice()
                  .sort((a, b) => +new Date(a.date) - +new Date(b.date))
                  .map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between rounded bg-white/[0.04] px-2 py-1"
                    >
                      <span>
                        <span className="font-semibold">
                          {new Date(r.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>{" "}
                        ·{" "}
                        {new Date(r.date).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {r.location ? ` · ${r.location}` : ""}
                        {r.notes ? ` — ${r.notes}` : ""}
                      </span>
                      <button
                        onClick={() => onRemoveRehearsal(r.id)}
                        className="text-ivory-200/40 hover:text-velvet-300"
                        aria-label="Retirer"
                      >
                        ×
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn-primary" onClick={onBroadcast}>
            <IconMail size={14} /> Diffuser
          </button>
          {show.ticketUrl && (
            <Link href={show.ticketUrl} target="_blank" className="btn-ghost">
              <IconTicket size={14} /> Billetterie
            </Link>
          )}
          <button className="btn-danger ml-auto" onClick={onRemove}>
            <IconTrash size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
