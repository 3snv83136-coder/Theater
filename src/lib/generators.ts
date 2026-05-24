// Lightweight client-side "AI" generators. They mix curated pools to produce
// surprising, useful prompts for improv exercises and course creation.

const EMOTIONS_BASE = [
  "joie", "tristesse", "colère", "peur", "honte", "fierté", "dégoût",
  "tendresse", "jalousie", "enthousiasme", "nostalgie", "panique",
  "résignation", "désir", "mépris", "soulagement", "ennui", "extase",
];

const EMOTION_INTENSITIES = ["à peine perceptible", "modérée", "forte", "explosive", "contenue"];

const PLACES = [
  "une laverie automatique à 3h du matin",
  "une cabine d'ascenseur bloquée entre deux étages",
  "un mariage où personne ne connaît les mariés",
  "un musée vide après la fermeture",
  "une station-service au milieu du désert",
  "une cuisine professionnelle en plein coup de feu",
  "une cabane perchée dans un arbre centenaire",
  "un sauna mixte un dimanche pluvieux",
  "le hall d'un hôtel hanté",
  "une salle d'attente d'un dentiste qui n'arrive jamais",
];

const RELATIONS = [
  "deux ex qui se revoient après dix ans",
  "un patron et son ancien stagiaire devenu célèbre",
  "deux frères et soeurs qui se découvrent un secret familial",
  "un médecin et son patient hypocondriaque",
  "deux inconnus qui partagent un Uber",
  "une mère et son enfant adulte qui revient à la maison",
  "deux artistes qui se disputent une scène",
];

const OBJECTIVES = [
  "obtenir un pardon",
  "cacher un secret",
  "convaincre l'autre de partir",
  "déclarer un amour impossible",
  "annoncer une mauvaise nouvelle",
  "demander de l'argent",
  "récupérer un objet précieux",
];

const CONSTRAINTS = [
  "sans jamais se regarder",
  "en parlant uniquement par questions",
  "avec un seul mot interdit (à choisir)",
  "à voix chuchotée",
  "en alternant français et langue inventée",
  "en immobilité totale du corps",
  "en chantant une phrase sur deux",
];

const CHARACTER_TRAITS = [
  "perfectionniste", "rêveur", "anxieux", "charmeur", "vieux jeu", "naïf",
  "manipulateur", "généreux", "mythomane", "très direct", "hyper poli",
  "complotiste", "tendre", "cynique", "enfantin",
];

const CHARACTER_JOBS = [
  "vétérinaire de quartier", "DJ retraité", "prof de yoga", "détective privé fauché",
  "boulanger en burn-out", "youtubeur jardinage", "comptable d'un cirque",
  "guide de musée d'art moderne", "ancien militaire reconverti en fleuriste",
  "thérapeute conjugal célibataire",
];

const CHARACTER_SECRETS = [
  "n'a jamais vu la mer",
  "a triché à un concours célèbre",
  "porte la perruque de son père",
  "ne sait pas lire",
  "garde un animal exotique chez lui",
  "écrit des lettres d'amour sans les envoyer",
  "a peur des pigeons",
];

const GENRES = ["polar", "drame familial", "comédie romantique", "western", "huis clos absurde", "conte"];

const TITLES_THEME = [
  "L'art de l'écoute", "Le silence qui parle", "Personnages contrastés",
  "Construire un statut", "Jouer le rythme", "Trouver son clown",
  "Habiter l'espace", "Improvisation chantée", "Catch impro",
  "Le grand bain de la longue forme",
];

const GOALS_POOL = [
  "Développer l'écoute active",
  "Identifier les enjeux d'une scène",
  "Travailler le statut haut / bas",
  "Habiter pleinement l'espace",
  "Oser le silence",
  "Construire un personnage en trois traits",
  "Accepter et rebondir (yes, and)",
  "Soigner ses entrées et sorties",
];

const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const sample = <T,>(arr: T[], n: number) => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
};

export type EmotionCard = {
  emotion: string;
  intensity: string;
  trigger: string;
};

export function generateEmotion(): EmotionCard {
  return {
    emotion: rand(EMOTIONS_BASE),
    intensity: rand(EMOTION_INTENSITIES),
    trigger: `déclenchée par ${rand([
      "un souvenir d'enfance",
      "une odeur familière",
      "une phrase anodine de l'autre",
      "un objet qui réapparaît",
      "un bruit lointain",
    ])}`,
  };
}

export type ContextCard = {
  place: string;
  relation: string;
  objective: string;
  constraint: string;
  genre: string;
};

export function generateContext(): ContextCard {
  return {
    place: rand(PLACES),
    relation: rand(RELATIONS),
    objective: rand(OBJECTIVES),
    constraint: rand(CONSTRAINTS),
    genre: rand(GENRES),
  };
}

export type CharacterCard = {
  name: string;
  job: string;
  traits: string[];
  secret: string;
  desire: string;
};

const FIRST_NAMES = ["Solène", "Bastien", "Camille", "Yanis", "Marlène", "Hugo", "Awa", "Tristan", "Mei", "Idir"];
const LAST_NAMES = ["Brun", "Reyes", "Vidal", "Lemoine", "Okafor", "Petit", "Da Costa", "Renault", "Hassan"];

export function generateCharacter(): CharacterCard {
  return {
    name: `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`,
    job: rand(CHARACTER_JOBS),
    traits: sample(CHARACTER_TRAITS, 3),
    secret: rand(CHARACTER_SECRETS),
    desire: rand(OBJECTIVES),
  };
}

export type StoryCard = {
  title: string;
  premise: string;
  twist: string;
};

export function generateStory(): StoryCard {
  const context = generateContext();
  const character = generateCharacter();
  return {
    title: `${rand(TITLES_THEME)} — ${character.name}`,
    premise: `${character.name}, ${character.job}, se retrouve dans ${context.place}. Iel doit ${context.objective}, ${context.constraint}.`,
    twist: `Coup de théâtre : ${character.name} ${character.secret}.`,
  };
}

// ------- AI-style course skeleton -------

export type AICourseDraft = {
  title: string;
  level: "Débutant" | "Intermédiaire" | "Avancé" | "Tous niveaux";
  duration: number;
  description: string;
  goals: string[];
  exercises: { title: string; duration: number; description: string; goals: string[] }[];
  tags: string[];
};

export function generateCourseDraft(theme: string, level: AICourseDraft["level"]): AICourseDraft {
  const themeClean = theme.trim() || rand(TITLES_THEME);
  const goals = sample(GOALS_POOL, 3);
  const exercises = Array.from({ length: 3 }).map((_, i) => {
    const ctx = generateContext();
    return {
      title: [
        `Échauffement — ${rand(["cercle de regards", "tap-tap", "machine collective"])}`,
        `Exploration — ${themeClean.toLowerCase()}`,
        `Mise en jeu — scène finale ${ctx.genre}`,
      ][i],
      duration: [15, 25, 35][i],
      description: [
        `Réveiller l'écoute du groupe. Tous en cercle, on transmet un signal à son rythme, puis on accélère.`,
        `Travail à deux sur ${themeClean.toLowerCase()}. Les binômes alternent toutes les 2 minutes pour explorer plusieurs angles.`,
        `Scène longue de 4 minutes inspirée du genre ${ctx.genre} : ${ctx.objective}, ${ctx.constraint}.`,
      ][i],
      goals: sample(GOALS_POOL, 2),
    };
  });
  return {
    title: `${themeClean} — ${level}`,
    level,
    duration: 120,
    description: `Atelier de 2h autour du thème "${themeClean}". On alterne échauffement, exploration en binôme et scène longue pour intégrer la matière.`,
    goals,
    exercises,
    tags: themeClean
      .toLowerCase()
      .split(/[ ,]+/)
      .filter((t) => t.length > 2)
      .slice(0, 5),
  };
}
