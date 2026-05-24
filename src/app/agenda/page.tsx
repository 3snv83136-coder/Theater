"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TeacherBadge } from "@/components/TeacherBadge";
import { useToast } from "@/components/Toast";
import { useStore, useId } from "@/lib/store";

export default function AgendaPage() {
  return (
    <Suspense fallback={<div className="card">Chargement…</div>}>
      <AgendaInner />
    </Suspense>
  );
}

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday=0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function AgendaInner() {
  const params = useSearchParams();
  const initialTeacher = params.get("teacher") ?? "";
  const initialCourse = params.get("course") ?? "";
  const { state, addAgenda, removeAgenda } = useStore();
  const toast = useToast();
  const newId = useId();

  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [teacherFilter, setTeacherFilter] = useState(initialTeacher);

  const [courseId, setCourseId] = useState(initialCourse || state.courses[0]?.id || "");
  const [teacherForm, setTeacherForm] = useState<string>("");
  const [date, setDate] = useState(fmtDate(new Date()));
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("21:00");
  const [location, setLocation] = useState("Salle Molière");

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const visibleAgenda = useMemo(() => {
    return state.agenda.filter((a) => {
      if (teacherFilter && a.teacherId !== teacherFilter) return false;
      return true;
    });
  }, [state.agenda, teacherFilter]);

  const submit = () => {
    if (!courseId) {
      toast.push({ message: "Choisissez un cours.", tone: "error" });
      return;
    }
    const course = state.courses.find((c) => c.id === courseId);
    const tId = teacherForm || course?.teacherId || "";
    addAgenda({
      id: newId(),
      courseId,
      teacherId: tId,
      date,
      startTime,
      endTime,
      location,
    });
    toast.push({ message: "Session ajoutée à l'agenda.", tone: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-end gap-3">
        <div>
          <label className="label">Semaine</label>
          <div className="flex items-center gap-1">
            <button
              className="btn-ghost"
              onClick={() => {
                const d = new Date(weekStart);
                d.setDate(d.getDate() - 7);
                setWeekStart(d);
              }}
            >
              ←
            </button>
            <div className="rounded-xl bg-stage-900/60 px-4 py-2 text-sm ring-1 ring-white/10">
              {weekStart.toLocaleDateString("fr-FR", { day: "2-digit", month: "long" })} →{" "}
              {days[6].toLocaleDateString("fr-FR", { day: "2-digit", month: "long" })}
            </div>
            <button
              className="btn-ghost"
              onClick={() => {
                const d = new Date(weekStart);
                d.setDate(d.getDate() + 7);
                setWeekStart(d);
              }}
            >
              →
            </button>
            <button
              className="btn-ghost"
              onClick={() => setWeekStart(startOfWeek(new Date()))}
            >
              Aujourd'hui
            </button>
          </div>
        </div>
        <div>
          <label className="label">Filtrer par prof</label>
          <select
            className="input w-44"
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
          >
            <option value="">Tous les profs</option>
            {state.teachers.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2 lg:grid-cols-7">
        {days.map((d) => {
          const ds = fmtDate(d);
          const entries = visibleAgenda
            .filter((a) => a.date === ds)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          const isToday = ds === fmtDate(new Date());
          return (
            <div
              key={ds}
              className={`card min-h-[180px] p-3 ${
                isToday ? "ring-1 ring-scene-400/40" : ""
              }`}
            >
              <div className="flex items-baseline justify-between">
                <div className="font-semibold capitalize">
                  {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                </div>
                <div className="text-xs text-stage-400">
                  {d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}
                </div>
              </div>
              <div className="mt-2 space-y-2">
                {entries.length === 0 && (
                  <div className="text-xs text-stage-500">—</div>
                )}
                {entries.map((a) => {
                  const course = state.courses.find((c) => c.id === a.courseId);
                  const teacher = state.teachers.find((t) => t.id === a.teacherId);
                  return (
                    <div
                      key={a.id}
                      className="group rounded-lg p-2 text-xs ring-1 ring-white/10"
                      style={{
                        backgroundColor: teacher
                          ? `${teacher.color}22`
                          : "rgba(255,255,255,0.05)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold">
                          {a.startTime}–{a.endTime}
                        </span>
                        <button
                          className="opacity-0 transition group-hover:opacity-100"
                          onClick={() => removeAgenda(a.id)}
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="font-medium">{course?.title}</div>
                      <div className="text-stage-300">{a.location}</div>
                      <div className="mt-1">
                        <TeacherBadge teacher={teacher} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2 className="section-title text-xl">Planifier une session</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-6">
          <div className="md:col-span-2">
            <label className="label">Cours</label>
            <select
              className="input"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {state.courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Prof (optionnel)</label>
            <select
              className="input"
              value={teacherForm}
              onChange={(e) => setTeacherForm(e.target.value)}
            >
              <option value="">— même que le cours —</option>
              {state.teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Début</label>
            <input type="time" className="input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div>
            <label className="label">Fin</label>
            <input type="time" className="input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
          <div className="md:col-span-5">
            <label className="label">Lieu</label>
            <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full" onClick={submit}>+ Ajouter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
