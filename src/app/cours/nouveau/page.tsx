"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, useId } from "@/lib/store";
import { useToast } from "@/components/Toast";
import { generateCourseDraft, type AICourseDraft } from "@/lib/generators";
import type { Course, Level } from "@/lib/types";

const LEVELS: Level[] = ["Débutant", "Intermédiaire", "Avancé", "Tous niveaux"];

export default function NewCoursePage() {
  const { state, addCourse } = useStore();
  const toast = useToast();
  const router = useRouter();
  const newId = useId();

  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [theme, setTheme] = useState("");
  const [draft, setDraft] = useState<AICourseDraft | null>(null);

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<Level>("Débutant");
  const [teacherId, setTeacherId] = useState(state.teachers[0]?.id ?? "");
  const [duration, setDuration] = useState(120);
  const [description, setDescription] = useState("");
  const [goalsText, setGoalsText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [interactive, setInteractive] = useState(true);
  const [exercises, setExercises] = useState<Course["exercises"]>([]);

  const applyDraft = (d: AICourseDraft) => {
    setTitle(d.title);
    setLevel(d.level);
    setDuration(d.duration);
    setDescription(d.description);
    setGoalsText(d.goals.join("\n"));
    setTagsText(d.tags.join(", "));
    setExercises(
      d.exercises.map((e, i) => ({
        id: `ex-${Date.now()}-${i}`,
        title: e.title,
        duration: e.duration,
        description: e.description,
        goals: e.goals,
      })),
    );
  };

  const runAI = () => {
    const d = generateCourseDraft(theme, level);
    setDraft(d);
    applyDraft(d);
    toast.push({ message: "Brouillon IA généré, libre à vous de l'éditer.", tone: "success" });
  };

  const addExercise = () =>
    setExercises((arr) => [
      ...arr,
      {
        id: `ex-${Date.now()}-${arr.length}`,
        title: "Nouvel exercice",
        duration: 15,
        description: "",
        goals: [],
      },
    ]);

  const save = () => {
    if (!title.trim() || !teacherId) {
      toast.push({ message: "Titre et prof requis.", tone: "error" });
      return;
    }
    const course: Course = {
      id: newId(),
      title: title.trim(),
      level,
      teacherId,
      duration,
      description: description.trim(),
      goals: goalsText.split("\n").map((g) => g.trim()).filter(Boolean),
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      exercises,
      interactive,
      createdWithAI: mode === "ai",
      createdAt: new Date().toISOString(),
    };
    addCourse(course);
    toast.push({ message: "Cours créé !", tone: "success" });
    router.push(`/cours/${course.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-semibold">Nouveau cours</h1>
          <div className="ml-auto inline-flex rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
            <button
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                mode === "manual" ? "bg-scene-500 text-stage-950" : "text-stage-200"
              }`}
              onClick={() => setMode("manual")}
            >
              Manuel
            </button>
            <button
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                mode === "ai" ? "bg-scene-500 text-stage-950" : "text-stage-200"
              }`}
              onClick={() => setMode("ai")}
            >
              ✨ Avec IA
            </button>
          </div>
        </div>

        {mode === "ai" && (
          <div className="mt-4 rounded-xl border border-scene-400/30 bg-scene-500/10 p-4">
            <div className="label">Thème à explorer</div>
            <div className="flex flex-wrap gap-2">
              <input
                className="input grow"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="ex : statuts, écoute, clown, longues formes…"
              />
              <select
                className="input w-44"
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <button className="btn-primary" onClick={runAI}>
                ✨ Générer un brouillon
              </button>
            </div>
            {draft && (
              <p className="mt-3 text-xs text-stage-300">
                Brouillon généré et appliqué au formulaire ci-dessous. Vous
                pouvez le retoucher avant d'enregistrer.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="card grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="label">Titre</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label">Niveau</label>
          <select
            className="input"
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
          >
            {LEVELS.map((l) => (<option key={l} value={l}>{l}</option>))}
          </select>
        </div>
        <div>
          <label className="label">Prof</label>
          <select
            className="input"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            {state.teachers.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
          </select>
        </div>
        <div>
          <label className="label">Durée (min)</label>
          <input
            type="number"
            min={15}
            step={15}
            className="input"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={interactive}
              onChange={(e) => setInteractive(e.target.checked)}
            />
            Mode interactif (étape par étape)
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="label">Description</label>
          <textarea
            className="input min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Objectifs (un par ligne)</label>
          <textarea
            className="input min-h-[100px]"
            value={goalsText}
            onChange={(e) => setGoalsText(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Tags (séparés par des virgules)</label>
          <input
            className="input"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title text-xl">Exercices</h2>
          <button className="btn-ghost" onClick={addExercise}>+ Ajouter un exercice</button>
        </div>
        {exercises.length === 0 && (
          <p className="text-sm text-stage-400">Aucun exercice. Ajoutez-en ou générez via l'IA.</p>
        )}
        <div className="space-y-3">
          {exercises.map((ex, idx) => (
            <div key={ex.id} className="rounded-xl bg-stage-900/50 p-4 ring-1 ring-white/5">
              <div className="grid gap-3 md:grid-cols-[1fr,120px,auto]">
                <input
                  className="input"
                  value={ex.title}
                  onChange={(e) =>
                    setExercises((arr) =>
                      arr.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)),
                    )
                  }
                />
                <input
                  type="number"
                  className="input"
                  value={ex.duration}
                  onChange={(e) =>
                    setExercises((arr) =>
                      arr.map((x, i) =>
                        i === idx ? { ...x, duration: parseInt(e.target.value) || 0 } : x,
                      ),
                    )
                  }
                />
                <button
                  className="btn-ghost"
                  onClick={() => setExercises((arr) => arr.filter((_, i) => i !== idx))}
                >
                  Retirer
                </button>
              </div>
              <textarea
                className="input mt-3"
                value={ex.description}
                onChange={(e) =>
                  setExercises((arr) =>
                    arr.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)),
                  )
                }
                placeholder="Description de l'exercice"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button className="btn-ghost" onClick={() => router.push("/cours")}>Annuler</button>
        <button className="btn-primary" onClick={save}>💾 Enregistrer le cours</button>
      </div>
    </div>
  );
}
