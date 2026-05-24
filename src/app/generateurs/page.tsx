"use client";

import { useState } from "react";
import {
  generateCharacter,
  generateContext,
  generateEmotion,
  generateStory,
  type CharacterCard,
  type ContextCard,
  type EmotionCard,
  type StoryCard,
} from "@/lib/generators";

type Tab = "emotion" | "context" | "character" | "story";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "emotion", label: "Émotions", icon: "💛" },
  { id: "context", label: "Contextes", icon: "🌍" },
  { id: "character", label: "Personnages", icon: "🎭" },
  { id: "story", label: "Histoires", icon: "📖" },
];

export default function GeneratorsPage() {
  const [tab, setTab] = useState<Tab>("emotion");
  const [emotion, setEmotion] = useState<EmotionCard | null>(null);
  const [context, setContext] = useState<ContextCard | null>(null);
  const [character, setCharacter] = useState<CharacterCard | null>(null);
  const [story, setStory] = useState<StoryCard | null>(null);
  const [history, setHistory] = useState<{ kind: Tab; text: string }[]>([]);

  const pushHistory = (kind: Tab, text: string) =>
    setHistory((h) => [{ kind, text }, ...h].slice(0, 12));

  const run = () => {
    if (tab === "emotion") {
      const e = generateEmotion();
      setEmotion(e);
      pushHistory("emotion", `${e.emotion} (${e.intensity}) — ${e.trigger}`);
    } else if (tab === "context") {
      const c = generateContext();
      setContext(c);
      pushHistory("context", `${c.place} · ${c.relation}`);
    } else if (tab === "character") {
      const c = generateCharacter();
      setCharacter(c);
      pushHistory("character", `${c.name} — ${c.job}`);
    } else {
      const s = generateStory();
      setStory(s);
      pushHistory("story", s.title);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-semibold">Générateurs de jeu</h1>
          <p className="text-sm text-ivory-200/60">
            Pour relancer l'inspiration en cours ou pendant une création.
          </p>
        </div>
        <div className="mt-4 inline-flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-xl px-3 py-1.5 text-sm transition ${
                tab === t.id
                  ? "bg-gold-300 text-ink-950"
                  : "bg-ivory-100/5 text-ivory-100 hover:bg-ivory-100/10"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="card flex min-h-[300px] flex-col">
          <div className="flex items-center justify-between">
            <h2 className="section-title text-xl">
              {TABS.find((t) => t.id === tab)?.label}
            </h2>
            <button className="btn-primary" onClick={run}>🎲 Générer</button>
          </div>
          <div className="mt-6 flex-1">
            {tab === "emotion" && (
              emotion ? (
                <div className="rounded-2xl bg-ink-900/50 p-6 ring-1 ring-ivory-100/10">
                  <div className="text-xs uppercase tracking-widest text-gold-300">Émotion</div>
                  <div className="mt-1 font-display text-4xl font-bold capitalize">
                    {emotion.emotion}
                  </div>
                  <div className="mt-3 text-ivory-100">
                    Intensité : <span className="font-semibold">{emotion.intensity}</span>
                  </div>
                  <div className="text-ivory-100">{emotion.trigger}</div>
                </div>
              ) : (
                <Placeholder text="Cliquez sur Générer pour tirer une émotion." />
              )
            )}
            {tab === "context" && (
              context ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Lieu" value={context.place} />
                  <Field label="Relation" value={context.relation} />
                  <Field label="Objectif" value={context.objective} />
                  <Field label="Contrainte" value={context.constraint} />
                  <Field label="Genre" value={context.genre} />
                </div>
              ) : (
                <Placeholder text="Cliquez pour générer un contexte de scène." />
              )
            )}
            {tab === "character" && (
              character ? (
                <div className="rounded-2xl bg-ink-900/50 p-6 ring-1 ring-ivory-100/10">
                  <div className="text-xs uppercase tracking-widest text-gold-300">Personnage</div>
                  <div className="mt-1 font-display text-3xl font-bold">{character.name}</div>
                  <div className="text-ivory-100">{character.job}</div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {character.traits.map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </div>
                  <div className="mt-3 text-ivory-100"><b>Secret :</b> {character.secret}</div>
                  <div className="text-ivory-100"><b>Désir :</b> {character.desire}</div>
                </div>
              ) : (
                <Placeholder text="Cliquez pour inventer un personnage." />
              )
            )}
            {tab === "story" && (
              story ? (
                <div className="rounded-2xl bg-ink-900/50 p-6 ring-1 ring-ivory-100/10">
                  <div className="text-xs uppercase tracking-widest text-gold-300">Histoire</div>
                  <div className="mt-1 font-display text-2xl font-bold">{story.title}</div>
                  <p className="mt-3 text-ivory-100">{story.premise}</p>
                  <p className="mt-2 text-velvet-200">{story.twist}</p>
                </div>
              ) : (
                <Placeholder text="Cliquez pour générer une mini-histoire complète." />
              )
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="section-title text-lg">Historique</h3>
          <p className="mt-1 text-xs text-ivory-200/60">
            Les 12 derniers tirages, toutes catégories.
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {history.length === 0 && (
              <li className="text-ivory-200/60">Rien encore. Lancez un tirage.</li>
            )}
            {history.map((h, i) => (
              <li key={i} className="rounded-lg bg-ink-900/50 px-3 py-2 ring-1 ring-ivory-100/10">
                <span className="mr-2 text-xs uppercase tracking-widest text-ivory-200/60">
                  {h.kind}
                </span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className="grid h-full place-items-center rounded-2xl border border-dashed border-white/15 bg-ink-900/30 p-12 text-center text-ivory-200/60">
      {text}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-ink-900/50 p-4 ring-1 ring-ivory-100/10">
      <div className="text-xs uppercase tracking-widest text-gold-300">{label}</div>
      <div className="mt-1 text-ivory-100">{value}</div>
    </div>
  );
}
