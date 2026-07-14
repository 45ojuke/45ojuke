import { DIMENSIONS_ETIQUETTE_DEFAUT } from "./reglages.js";

export const presets = {};

export const combosSurprise = [
  {
    couleurs: ["#ff2f7d", "#1c1138", "#fff1a8", "#20d6d2", "#fff7ea", "#271439", "#fff7ea"],
    decor: "motif",
    motif: "diagonales",
    vignette: "global",
    marques: "stereo-sound",
  },
  {
    couleurs: ["#09215f", "#f9e3b2", "#ff6b35", "#152b6f", "#15120c", "#fff3da", "#ffef9a"],
    decor: "vignette",
    motif: "rayures",
    vignette: "fond",
    marques: "juke-box",
  },
  {
    couleurs: ["#0b7a75", "#fff7ec", "#f7cad0", "#f9d65c", "#13201f", "#832340", "#ffffff"],
    decor: "motif",
    motif: "points",
    vignette: "fond",
    marques: "music-box",
  },
  {
    couleurs: ["#d71920", "#fff6df", "#0f1115", "#f4c430", "#17120b", "#fff6df", "#ffffff"],
    decor: "vignette",
    motif: "grille",
    vignette: "global",
    marques: "old-hit",
  },
  {
    couleurs: ["#6d28d9", "#e0f2fe", "#fef08a", "#f472b6", "#231033", "#3b1670", "#fff7ff"],
    decor: "motif",
    motif: "rayures",
    vignette: "fond",
    marques: "vinyl-hit",
  },
  {
    couleurs: ["#0f5132", "#fffbe6", "#b7f7d4", "#d4a017", "#172016", "#064e3b", "#fff4c7"],
    decor: "vignette",
    motif: "diagonales",
    vignette: "fond",
    marques: "45-o-juke",
  },
  {
    couleurs: ["#004e89", "#fdf0d5", "#c1121f", "#7bdff2", "#111827", "#fff7ed", "#ffffff"],
    decor: "motif",
    motif: "grille",
    vignette: "global",
    marques: "hit-tune",
  },
  {
    couleurs: ["#121212", "#f8c8dc", "#b8f2e6", "#f15bb5", "#101010", "#101010", "#fffdf8"],
    decor: "vignette",
    motif: "points",
    vignette: "fond",
    marques: "a-side",
  },
  {
    couleurs: ["#ff7a00", "#2a0a3d", "#ffe45e", "#00c2ff", "#fff7e8", "#30104c", "#fff7e8"],
    decor: "motif",
    motif: "diagonales",
    vignette: "global",
    marques: "retro-hit",
  },
  {
    couleurs: ["#004643", "#abd1c6", "#f9bc60", "#e16162", "#001e1d", "#001e1d", "#fffffe"],
    decor: "motif",
    motif: "points",
    vignette: "global",
    marques: "vinyl-select",
  },
  {
    couleurs: ["#a4161a", "#f5f0e1", "#283618", "#dda15e", "#16120d", "#fff7e8", "#fffdf0"],
    decor: "vignette",
    motif: "rayures",
    vignette: "fond",
    marques: "aucun",
  },
];

export const palettesVariantesModernes = [
  {
    cadre: "#0f172a",
    fond: "#f8fafc",
    ruban: "#38bdf8",
    gauche: "#f59e0b",
    droite: "#be185d",
    motif: "#2563eb",
    secondaire: "#0f766e",
    vignette: "#6366f1",
  },
  {
    cadre: "#7f1d1d",
    fond: "#fff7ed",
    ruban: "#fed7aa",
    gauche: "#dc2626",
    droite: "#ea580c",
    motif: "#9a3412",
    secondaire: "#7c2d12",
    vignette: "#f97316",
  },
  {
    cadre: "#064e3b",
    fond: "#ecfdf5",
    ruban: "#a7f3d0",
    gauche: "#0f766e",
    droite: "#65a30d",
    motif: "#047857",
    secondaire: "#14532d",
    vignette: "#10b981",
  },
  {
    cadre: "#312e81",
    fond: "#eef2ff",
    ruban: "#c4b5fd",
    gauche: "#4338ca",
    droite: "#a21caf",
    motif: "#6366f1",
    secondaire: "#6d28d9",
    vignette: "#8b5cf6",
  },
  {
    cadre: "#111827",
    fond: "#fef3c7",
    ruban: "#fde68a",
    gauche: "#b45309",
    droite: "#92400e",
    motif: "#78350f",
    secondaire: "#451a03",
    vignette: "#f59e0b",
  },
  {
    cadre: "#0f172a",
    fond: "#111827",
    ruban: "#334155",
    gauche: "#0891b2",
    droite: "#4f46e5",
    motif: "#67e8f9",
    secondaire: "#a5b4fc",
    vignette: "#0ea5e9",
  },
];

export const modelesParTheme = {
  tout: [
    ["ALICE", "ALICE"],
    ["MARTIN", "MARTIN"],
    ["JUJU", "JUJU"],
    ["MANU", "MANU"],
    ["CELESTE", "CELESTE"],
    ["LUCIEN", "LUCIEN"],
    ["STELLA", "STELLA"],
    ["LEON", "LEON"],
    ["JEAN", "JEAN"],
    ["ADRIEN", "ADRIEN"],
  ],
  classique: [
    ["ALICE", "ALICE"],
    ["MARTIN", "MARTIN"],
    ["JUJU", "JUJU"],
    ["MANU", "MANU"],
    ["STELLA", "STELLA"],
    ["LUCIEN", "LUCIEN"],
    ["LEON", "LEON"],
    ["JEAN", "JEAN"],
    ["ADRIEN", "ADRIEN"],
  ],
  moderne: [
    ["CELESTE", "CELESTE"],
  ],
};

let stylesEtiquettes = [];

function modeleConnu(modele) {
  return modelesParTheme.tout.some(([valeur]) => valeur === modele);
}

function synchroniserPresetsDepuisStyles(styles) {
  Object.keys(presets).forEach((cle) => {
    delete presets[cle];
  });
  styles.forEach((style) => {
    presets[style.reglages.modele] = { ...style.reglages };
  });
}

function normaliserStyleEtiquette(style, index) {
  if (!style || typeof style !== "object" || Array.isArray(style)) {
    return null;
  }
  const reglages = style.reglages && typeof style.reglages === "object" && !Array.isArray(style.reglages)
    ? style.reglages
    : style;
  const modele = String(reglages.modele || style.modele || "").trim();
  if (!modele || !modeleConnu(modele)) {
    return null;
  }
  const idSource = String(style.id || `${modele}-${index + 1}`).trim() || `${modele}-${index + 1}`;
  const id = idSource;
  const libelleModele = modelesParTheme.tout.find(([valeur]) => valeur === modele)?.[1] || modele;
  const reglagesNormalises = {
    ...reglages,
    modele,
    largeurEtiquette: DIMENSIONS_ETIQUETTE_DEFAUT.largeur,
    hauteurEtiquette: DIMENSIONS_ETIQUETTE_DEFAUT.hauteur,
  };
  if (
    !Object.prototype.hasOwnProperty.call(reglagesNormalises, "couleurMarquesManuelle")
    && Object.prototype.hasOwnProperty.call(reglagesNormalises, "couleurMarques")
  ) {
    reglagesNormalises.couleurMarquesManuelle = true;
  }
  return {
    id,
    nom: id === modele ? libelleModele : String(style.nom || style.label || libelleModele),
    theme: String(style.theme || reglages.theme || "tout"),
    reglages: reglagesNormalises,
  };
}

function normaliserStylesEtiquettes(donnees) {
  const styles = Array.isArray(donnees) ? donnees : donnees?.styles;
  if (!Array.isArray(styles)) {
    return [];
  }
  const stylesNormalises = styles
    .map(normaliserStyleEtiquette)
    .filter(Boolean);
  const idsVus = new Set();
  return stylesNormalises.filter((style) => {
    if (idsVus.has(style.id)) {
      return false;
    }
    idsVus.add(style.id);
    return true;
  });
}

export async function chargerStylesEtiquettes() {
  try {
    const reponse = await fetch("./label-styles.json", { cache: "no-store" });
    if (!reponse.ok) {
      throw new Error("Styles indisponibles");
    }
    const styles = normaliserStylesEtiquettes(await reponse.json());
    stylesEtiquettes = styles;
  } catch {
    stylesEtiquettes = [];
  }
  synchroniserPresetsDepuisStyles(stylesEtiquettes);
  return obtenirStylesEtiquettes();
}

export function obtenirStylesEtiquettes(theme = "tout") {
  const styles = stylesEtiquettes;
  if (theme === "tout") {
    return styles.map((style) => ({ ...style, reglages: { ...style.reglages } }));
  }
  return styles
    .filter((style) => style.theme === theme || style.theme === "tout")
    .map((style) => ({ ...style, reglages: { ...style.reglages } }));
}

export function obtenirStyleEtiquette(id) {
  return obtenirStylesEtiquettes("tout").find((style) => style.id === id) || null;
}

export const themesModeles = {
  tout: "Tout",
  classique: "Classique",
  moderne: "Moderne",
};

export const capacitesModeles = {
  ALICE: {
    marques: true,
    ruban: true,
    bandeCentrale: true,
  },
  MARTIN: {
    marques: true,
    ruban: true,
    bandeCentrale: true,
  },
  JUJU: {
    marques: true,
    ruban: true,
    bandeCentrale: true,
  },
  MANU: {
    marques: true,
    ruban: true,
    bandeCentrale: true,
  },
  CELESTE: {
    marques: true,
    ruban: true,
    bandeCentrale: false,
  },
  STELLA: {
    // Les mentions restent désactivées par défaut, mais l'utilisateur peut
    // les activer explicitement depuis l'étape « Côtés ».
    marques: true,
    ruban: true,
    bandeCentrale: false,
  },
  LUCIEN: {
    marques: true,
    ruban: true,
    bandeCentrale: false,
  },
  LEON: {
    marques: true,
    ruban: false,
    bandeCentrale: false,
  },
  JEAN: {
    marques: true,
    ruban: false,
    bandeCentrale: false,
  },
  ADRIEN: {
    // Les mentions latérales ne sont jamais imposées par le modèle : elles
    // restent disponibles, mais seul l'utilisateur choisit de les afficher.
    marques: true,
    ruban: false,
    bandeCentrale: false,
  },
};

export const presetsMarques = {
  custom: null,
  "juke-box": ["JUKE", "BOX"],
  "vinyl-hit": ["VINYL", "HIT"],
  "45-rpm": ["45", "RPM"],
  "hit-tune": ["HIT", "TUNE"],
  "old-hit": ["OLD", "HIT"],
  "top-side": ["TOP", "SIDE"],
  "a-side": ["A", "SIDE"],
  "b-side": ["B", "SIDE"],
  "stereo-sound": ["STEREO", "SOUND"],
  "vintage-label": ["VINTAGE", "LABEL"],
  "music-select": ["MUSIC", "SELECT"],
  "45-o-juke": ["45’O", "JUKE"],
  "juke-time": ["JUKE", "TIME"],
  "vinyl-side": ["VINYL", "SIDE"],
  "retro-hit": ["RETRO", "HIT"],
  "hit-parade": ["HIT", "PARADE"],
  "oldies-club": ["OLDIES", "CLUB"],
  "dance-tune": ["DANCE", "TUNE"],
  "music-box": ["MUSIC", "BOX"],
  "select-play": ["SELECT", "PLAY"],
  "side-one": ["SIDE", "ONE"],
  "side-two": ["SIDE", "TWO"],
  "top-vinyl": ["TOP", "VINYL"],
  "golden-hit": ["GOLDEN", "HIT"],
  "45-record": ["45", "RECORD"],
  "play-music": ["PLAY", "MUSIC"],
  "jukebox-sound": ["JUKEBOX", "SOUND"],
  "retro-label": ["RETRO", "LABEL"],
  "tune-select": ["TUNE", "SELECT"],
  "sound-track": ["SOUND", "TRACK"],
  "hit-record": ["HIT", "RECORD"],
  "vinyl-select": ["VINYL", "SELECT"],
};
