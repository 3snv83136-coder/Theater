"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TeacherBadge } from "@/components/TeacherBadge";
import { useStore } from "@/lib/store";
import type { Level } from "@/lib/types";

const LEVELS: (Level | "Tous")[] = ["Tous", "Débutant", "Intermédiaire", "Avancé", "Tous niveaux"];

export default function CoursesPage() {
  const { state } = useStore();
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Tous");
  const [teacherId, setTeacherId] = useState<string>("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return state.courses.filter((c) => {
      if (level !== "Tous" && c.level !== level) return false;
      if (teacherId && c.teacherId !== teacherId) return false;
      if (query) {
        const q = query.toLowerCase();
        const blob = (c.title + " " + c.description + " " + c.tags.join(" ")).toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [state.courses, level, teacherId, query]);

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-end gap-3">
        <div className="grow">
          <label className="label">Recherche</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titre, thème, mot-clé…"
            className="input"
          />
        </div>
        <div>
          <label className="label">Niveau</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as any)}
            className="input"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Prof</label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="input"
          >
            <option value="">Tous</option>
            {state.teachers.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <Link href="/cours/nouveau" className="btn-primary">+ Créer</Link>
      </div>

      {filtered.length === 0 && (
        <div className="card text-center text-stage-300">
          Aucun cours ne correspond à votre recherche.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => {
          const teacher = state.teachers.find((t) => t.id === c.teacherId);
          return (
            <Link key={c.id} href={`/cours/${c.id}`} className="card card-hover block">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-xl font-semibold">{c.title}</h3>
                {c.createdWithAI && <span className="chip">IA</span>}
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-stage-300">{c.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <TeacherBadge teacher={teacher} />
                <div className="flex gap-1">
                  <span className="chip">{c.level}</span>
                  <span className="chip">{c.duration} min</span>
                  {c.interactive && <span className="chip">interactif</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
