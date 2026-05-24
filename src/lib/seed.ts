import type {
  AgendaEntry,
  ContentPost,
  Course,
  Inscription,
  MailLog,
  Show,
  Teacher,
} from "./types";

export const SEED_TEACHERS: Teacher[] = [
  { id: "florence", name: "Florence", color: "#f97316", specialty: "Personnages & émotions", bio: "Florence dirige les ateliers émotion et incarnation depuis 8 ans.", email: "florence@impro2pro.fr" },
  { id: "maity", name: "Maïty", color: "#ef4444", specialty: "Narration & structure", bio: "Maïty travaille les arcs narratifs et les longues formes.", email: "maity@impro2pro.fr" },
  { id: "julien", name: "Julien", color: "#22d3ee", specialty: "Rythme & écoute", bio: "Julien explore l'écoute scénique et la dynamique de groupe.", email: "julien@impro2pro.fr" },
  { id: "carole", name: "Carole", color: "#a855f7", specialty: "Voix & corps", bio: "Carole guide le travail corporel et vocal des improvisateurs.", email: "carole@impro2pro.fr" },
  { id: "isabelle", name: "Isabelle", color: "#10b981", specialty: "Catch impro & matchs", bio: "Isabelle coache les équipes de match d'impro.", email: "isabelle@impro2pro.fr" },
  { id: "gaelle", name: "Gaëlle", color: "#facc15", specialty: "Clown & burlesque", bio: "Gaëlle anime les ateliers clown et la comédie physique.", email: "gaelle@impro2pro.fr" },
  { id: "corentin", name: "Corentin", color: "#60a5fa", specialty: "Impro chantée", bio: "Corentin compose en direct et coache les formes chantées.", email: "corentin@impro2pro.fr" },
  { id: "jb", name: "Jb", color: "#fb7185", specialty: "Direction artistique", bio: "Jb dirige les créations longues et la mise en scène.", email: "jb@impro2pro.fr" },
];

export const SEED_COURSES: Course[] = [
  {
    id: "c-emotions-101",
    title: "Émotions à fleur de peau",
    level: "Débutant",
    teacherId: "florence",
    duration: 120,
    description: "Découverte des grandes familles émotionnelles à travers des exercices d'incarnation simples.",
    goals: ["Identifier ses émotions de jeu", "Oser le contraste émotionnel", "Construire un personnage par l'émotion"],
    exercises: [
      { id: "e1", title: "Roulette émotionnelle", duration: 20, description: "Les joueurs tirent une émotion et l'incarnent en monologue de 30 secondes.", goals: ["Réactivité", "Incarnation"] },
      { id: "e2", title: "Crescendo / Decrescendo", duration: 25, description: "Scène à deux : l'un monte en intensité, l'autre redescend.", goals: ["Écoute", "Modulation"] },
    ],
    tags: ["émotions", "incarnation"],
    interactive: true,
    createdWithAI: false,
    capacity: 12,
    pricePerSessionCents: 1800,
    createdAt: new Date().toISOString(),
  },
  {
    id: "c-longue-forme",
    title: "Architecture d'une longue forme",
    level: "Avancé",
    teacherId: "maity",
    duration: 180,
    description: "Construire un spectacle improvisé d'1h cohérent : arcs, thèmes, callbacks.",
    goals: ["Identifier les piliers narratifs", "Construire des callbacks", "Tenir un thème sur 60 minutes"],
    exercises: [
      { id: "e3", title: "Trois actes en cinq minutes", duration: 30, description: "Compresser une narration en trois actes très courts.", goals: ["Structure", "Synthèse"] },
    ],
    tags: ["narration", "longue forme"],
    interactive: false,
    createdWithAI: true,
    capacity: 10,
    pricePerSessionCents: 2500,
    createdAt: new Date().toISOString(),
  },
  {
    id: "c-clown",
    title: "Le nez rouge",
    level: "Intermédiaire",
    teacherId: "gaelle",
    duration: 150,
    description: "Initiation au clown : flop, regard public, vulnérabilité.",
    goals: ["Accepter le flop", "Trouver son clown", "Jouer le regard"],
    exercises: [
      { id: "e4", title: "Le flop assumé", duration: 15, description: "Rater quelque chose volontairement et l'offrir au public.", goals: ["Lâcher-prise"] },
    ],
    tags: ["clown", "burlesque"],
    interactive: true,
    createdWithAI: false,
    capacity: 14,
    pricePerSessionCents: 2000,
    createdAt: new Date().toISOString(),
  },
];

const today = new Date();
const inDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const inDaysISO = (n: number, h = 20, m = 30) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const SEED_AGENDA: AgendaEntry[] = [
  { id: "a1", courseId: "c-emotions-101", teacherId: "florence", date: inDays(1), startTime: "19:00", endTime: "21:00", location: "Salle Molière", notes: "Apporter des vêtements souples." },
  { id: "a2", courseId: "c-longue-forme", teacherId: "maity", date: inDays(3), startTime: "18:30", endTime: "21:30", location: "Studio B" },
  { id: "a3", courseId: "c-clown", teacherId: "gaelle", date: inDays(5), startTime: "19:00", endTime: "21:30", location: "Salle Molière" },
];

export const SEED_INSCRIPTIONS: Inscription[] = [
  {
    id: "i1",
    firstName: "Léa",
    lastName: "Martin",
    email: "lea.martin@example.com",
    phone: "06 12 34 56 78",
    level: "Débutant",
    preferredTeacherId: "florence",
    courseIds: ["c-emotions-101"],
    paymentStatus: "Non payé",
    message: "Je n'ai jamais fait d'impro mais ça me tente depuis longtemps !",
    createdAt: new Date().toISOString(),
    status: "Nouveau",
  },
  {
    id: "i2",
    firstName: "Thomas",
    lastName: "Bernard",
    email: "thomas.b@example.com",
    phone: "06 98 76 54 32",
    level: "Intermédiaire",
    preferredTeacherId: "gaelle",
    courseIds: ["c-clown"],
    trialDate: inDays(2),
    paymentStatus: "Acompte",
    message: "J'ai fait deux ans dans une autre troupe.",
    notes: "Très motivé, à recontacter avant l'essai.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: "Contacté",
  },
  {
    id: "i3",
    firstName: "Aïcha",
    lastName: "Diallo",
    email: "aicha.diallo@example.com",
    level: "Avancé",
    courseIds: ["c-longue-forme"],
    paymentStatus: "Saison complète",
    attendance: 12,
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    status: "Actif",
  },
];

export const SEED_POSTS: ContentPost[] = [
  {
    id: "p1",
    title: "Rentrée 2026 : les inscriptions sont ouvertes",
    excerpt: "Nos ateliers reprennent en septembre, tous niveaux confondus. Découvrez le programme.",
    body: `# Bienvenue !\n\nLa saison reprend avec **8 ateliers hebdomadaires**, des stages et trois créations longues.\n\nInscrivez-vous dès maintenant.`,
    category: "Actualité",
    author: "Jb",
    published: true,
    createdAt: new Date().toISOString(),
  },
];

export const SEED_SHOWS: Show[] = [
  {
    id: "s1",
    title: "Cabaret d'Impro — Soirée d'ouverture",
    date: inDaysISO(14, 20, 30),
    venue: "Théâtre du Vieux Port",
    pitch: "Un cabaret survolté où la troupe au complet enchaîne formes courtes et folies improvisées.",
    cast: ["florence", "julien", "gaelle", "jb"],
    priceCents: 1200,
    capacity: 140,
    soldTickets: 38,
    status: "À l'affiche",
    rehearsals: [
      { id: "r1", date: inDaysISO(7, 19, 0), location: "Salle Molière", notes: "Filage cabaret" },
      { id: "r2", date: inDaysISO(12, 19, 0), location: "Théâtre du Vieux Port", notes: "Tech + raccord scénique" },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "s2",
    title: "Les Apparitions — création longue",
    date: inDaysISO(40, 20, 30),
    venue: "Friche La Belle de Mai",
    pitch: "Une longue forme onirique : six personnages qui se croisent dans les couloirs d'un vieil hôtel.",
    cast: ["maity", "carole", "corentin", "jb"],
    priceCents: 1500,
    capacity: 90,
    soldTickets: 0,
    status: "Répétition",
    rehearsals: [
      { id: "r3", date: inDaysISO(5, 19, 0), location: "Studio B", notes: "Lecture des arcs" },
      { id: "r4", date: inDaysISO(12, 19, 0), location: "Studio B", notes: "Improvisation thématique" },
      { id: "r5", date: inDaysISO(19, 19, 0), location: "Studio B", notes: "Filage 1" },
      { id: "r6", date: inDaysISO(33, 19, 0), location: "Friche La Belle de Mai", notes: "Tech + filage final" },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "s3",
    title: "Match d'Impro — clôture de saison 25",
    date: inDaysISO(-60, 20, 30),
    venue: "Théâtre du Vieux Port",
    pitch: "Le grand match annuel : équipe rouge vs équipe bleue, arbitré par Jb.",
    cast: ["isabelle", "florence", "julien", "gaelle", "jb"],
    priceCents: 1000,
    capacity: 140,
    soldTickets: 138,
    status: "Archivé",
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
  },
];

export const SEED_MAILS: MailLog[] = [];
