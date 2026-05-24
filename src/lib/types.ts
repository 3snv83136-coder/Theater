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
  duration: number;
  description: string;
  goals: string[];
  exercises: Exercise[];
  tags: string[];
  interactive: boolean;
  createdWithAI: boolean;
  capacity?: number;
  pricePerSessionCents?: number;
  createdAt: string;
};

export type AgendaEntry = {
  id: string;
  courseId: string;
  teacherId: string;
  date: string;
  startTime: string;
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
  courseIds?: string[];
  trialDate?: string;
  paymentStatus?: "Non payé" | "Acompte" | "Payé" | "Saison complète";
  attendance?: number;
  message?: string;
  notes?: string;
  createdAt: string;
  status: "Nouveau" | "Contacté" | "Actif" | "Archivé";
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

export type Rehearsal = {
  id: string;
  date: string; // ISO
  location?: string;
  notes?: string;
};

export type Show = {
  id: string;
  title: string;
  date: string;
  venue: string;
  pitch: string;
  cast: string[];
  priceCents: number;
  ticketUrl?: string;
  posterUrl?: string;
  status: "Répétition" | "À l'affiche" | "Archivé";
  capacity?: number;
  soldTickets?: number;
  rehearsals?: Rehearsal[];
  pressKitUrl?: string;
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
