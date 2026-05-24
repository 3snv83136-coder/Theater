export type Level = "Débutant" | "Intermédiaire" | "Avancé" | "Tous niveaux";

export type Teacher = {
  id: string;
  name: string;
  color: string;
  bio: string;
  specialty: string;
  email: string;
};

export type Exercise = {
  id: string;
  title: string;
  duration: number; // minutes
  description: string;
  goals: string[];
};

export type Course = {
  id: string;
  title: string;
  level: Level;
  teacherId: string;
  duration: number; // minutes
  description: string;
  goals: string[];
  exercises: Exercise[];
  tags: string[];
  interactive: boolean;
  createdWithAI: boolean;
  createdAt: string;
};

export type AgendaEntry = {
  id: string;
  courseId: string;
  teacherId: string;
  date: string; // ISO date (yyyy-mm-dd)
  startTime: string; // HH:MM
  endTime: string;
  location: string;
  notes?: string;
};

export type Inscription = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  level: Level;
  preferredTeacherId?: string;
  message?: string;
  createdAt: string;
  status: "Nouveau" | "Contacté" | "Confirmé" | "Annulé";
};

export type ContentPost = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  cover?: string;
  category: "Actualité" | "Spectacle" | "Backstage" | "Atelier";
  author: string;
  published: boolean;
  createdAt: string;
};

export type Show = {
  id: string;
  title: string;
  date: string; // ISO
  venue: string;
  pitch: string;
  cast: string[]; // teacher ids
  priceCents: number;
  ticketUrl?: string;
  createdAt: string;
};

export type MailLog = {
  id: string;
  to: string[];
  subject: string;
  body: string;
  kind: "Cours" | "Spectacle" | "Newsletter" | "Notification";
  sentAt: string;
};
