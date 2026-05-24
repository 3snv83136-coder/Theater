"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TeacherBadge } from "@/components/TeacherBadge";
import { useStore } from "@/lib/store";
import type { Level } from "@/lib/types";
import {
  IconArrowRight,
  IconClock,
  IconPlus,
  IconSparkle,
  IconStar,
} from "@/components/Icons";

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
          <label className="label">Rechercher dans le programme</label>
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
            className="input w-44"
          >
            {LEVELS.map((l) => (<option key={l} value={l}>{l}</option>))}
          </select>
        </div>
        <div>
          <label className="label">Prof</label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="input w-44"
          >
            <option value="">Toute la troupe</option>
            {state.teachers.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
          </select>
        </div>
        <Link href="/cours/nouveau" className="btn-primary">
          <IconPlus size={14} /> Créer
        </Link>
      </div>

      {filtered.length === 0 && (
        <div className="card-playbill text-center">
          <div className="font-display text-2xl font-bold">Aucun cours trouvé</div>
          <p className="mt-2 text-sm text-ink-700">Essayez d'élargir vos filtres.</p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => {
          const teacher = state.teachers.find((t) => t.id === c.teacherId);
          return (
            <Link
              key={c.id}
              href={`/cours/${c.id}`}
              className="group relative overflow-hidden rounded-2xl border border-ivory-100/10 bg-gradient-to-b from-ink-800 to-ink-900 shadow-playbill transition hover:-translate-y-1 hover:border-gold-300/40 hover:shadow-marquee"
            >
              {/* Color strip from teacher */}
              <div
                className="h-1.5 w-full"
                style={teacher ? { backgroundColor: teacher.color } : undefined}
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="eyebrow">{c.level}</div>
                    <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-ivory-50">
                      {c.title}
                    </h3>
                  </div>
                  {c.createdWithAI && (
                    <span className="chip-gold">
                      <IconSparkle size={10} /> IA
                    </span>
                  )}
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-ivory-200/70">
                  {c.description}
                </p>

                {c.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {c.tags.slice(0, 4).map((t) => (
                      <span key={t} className="chip">#{t}</span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-ivory-100/10 pt-4">
                  <TeacherBadge teacher={teacher} />
                  <div className="flex items-center gap-2 text-xs text-ivory-200/70">
                    <IconClock size={12} /> {c.duration} min
                    {c.interactive && <IconStar size={12} className="text-gold-300" />}
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-gold-300/0 p-2 text-gold-300 transition group-hover:bg-gold-300/10">
                <IconArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
