"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  SEED_AGENDA,
  SEED_COURSES,
  SEED_INSCRIPTIONS,
  SEED_MAILS,
  SEED_POSTS,
  SEED_SHOWS,
  SEED_TEACHERS,
} from "./seed";
import type {
  AgendaEntry,
  ContentPost,
  Course,
  Inscription,
  MailLog,
  Show,
  Teacher,
} from "./types";

const STORAGE_KEY = "impro2pro:state:v1";

type State = {
  teachers: Teacher[];
  courses: Course[];
  agenda: AgendaEntry[];
  inscriptions: Inscription[];
  posts: ContentPost[];
  shows: Show[];
  mails: MailLog[];
};

const initialState: State = {
  teachers: SEED_TEACHERS,
  courses: SEED_COURSES,
  agenda: SEED_AGENDA,
  inscriptions: SEED_INSCRIPTIONS,
  posts: SEED_POSTS,
  shows: SEED_SHOWS,
  mails: SEED_MAILS,
};

type StoreApi = {
  state: State;
  addCourse: (c: Course) => void;
  updateCourse: (id: string, patch: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  addAgenda: (a: AgendaEntry) => void;
  removeAgenda: (id: string) => void;
  addInscription: (i: Inscription) => void;
  updateInscription: (id: string, patch: Partial<Inscription>) => void;
  addPost: (p: ContentPost) => void;
  updatePost: (id: string, patch: Partial<ContentPost>) => void;
  removePost: (id: string) => void;
  addShow: (s: Show) => void;
  removeShow: (id: string) => void;
  sendMail: (m: Omit<MailLog, "id" | "sentAt">) => MailLog;
  resetAll: () => void;
};

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        setState({ ...initialState, ...parsed });
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  const api = useMemo<StoreApi>(() => {
    const patchList = <T extends { id: string }>(list: T[], id: string, patch: Partial<T>) =>
      list.map((it) => (it.id === id ? { ...it, ...patch } : it));

    return {
      state,
      addCourse: (c) => setState((s) => ({ ...s, courses: [c, ...s.courses] })),
      updateCourse: (id, patch) =>
        setState((s) => ({ ...s, courses: patchList(s.courses, id, patch) })),
      removeCourse: (id) =>
        setState((s) => ({
          ...s,
          courses: s.courses.filter((c) => c.id !== id),
          agenda: s.agenda.filter((a) => a.courseId !== id),
        })),
      addAgenda: (a) => setState((s) => ({ ...s, agenda: [...s.agenda, a] })),
      removeAgenda: (id) =>
        setState((s) => ({ ...s, agenda: s.agenda.filter((a) => a.id !== id) })),
      addInscription: (i) =>
        setState((s) => ({ ...s, inscriptions: [i, ...s.inscriptions] })),
      updateInscription: (id, patch) =>
        setState((s) => ({ ...s, inscriptions: patchList(s.inscriptions, id, patch) })),
      addPost: (p) => setState((s) => ({ ...s, posts: [p, ...s.posts] })),
      updatePost: (id, patch) =>
        setState((s) => ({ ...s, posts: patchList(s.posts, id, patch) })),
      removePost: (id) =>
        setState((s) => ({ ...s, posts: s.posts.filter((p) => p.id !== id) })),
      addShow: (sh) => setState((s) => ({ ...s, shows: [sh, ...s.shows] })),
      removeShow: (id) =>
        setState((s) => ({ ...s, shows: s.shows.filter((sh) => sh.id !== id) })),
      sendMail: (m) => {
        const entry: MailLog = {
          ...m,
          id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sentAt: new Date().toISOString(),
        };
        setState((s) => ({ ...s, mails: [entry, ...s.mails] }));
        return entry;
      },
      resetAll: () => setState(initialState),
    };
  }, [state]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useTeachers() {
  return useStore().state.teachers;
}

export function useTeacher(id?: string) {
  const teachers = useTeachers();
  return useMemo(() => teachers.find((t) => t.id === id), [teachers, id]);
}

export function useId() {
  return useCallback(
    () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );
}
