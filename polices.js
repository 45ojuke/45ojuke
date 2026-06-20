const STYLES_COMPLETS = ["normal", "gras", "italique", "gras-italique"];
const STYLES_REGULIER_ITALIQUE = ["normal", "italique"];
const STYLES_REGULIER_GRAS = ["normal", "gras"];
const STYLE_REGULIER = ["normal"];

export const GROUPES_POLICES = [
  {
    id: "dactylo",
    libelle: "Machines à écrire",
    polices: [
      { id: "dactylo-ronde", libelle: "Dactylo ronde", famille: '"Cutive Mono", monospace', styles: STYLE_REGULIER },
      { id: "dactylo-seche", libelle: "Dactylo sèche", famille: '"Courier Prime", monospace' },
      { id: "special-elite", libelle: "Special Elite", famille: '"Special Elite", monospace', styles: STYLE_REGULIER },
    ],
  },
  {
    id: "ancien",
    libelle: "Anciennes et patinées",
    polices: [
      { id: "journal-ancien", libelle: "Journal ancien", famille: '"Libre Baskerville", serif' },
      { id: "dactylo-usee", libelle: "Dactylo rongée", famille: '"45OJuke Dactylo usee", monospace', effet: "usee", styles: STYLE_REGULIER },
      { id: "journal-efface", libelle: "Rapport 1942 effacé", famille: '"45OJuke Journal efface", monospace', effet: "efface", styles: STYLE_REGULIER },
      { id: "imprimerie-usee", libelle: "Imprimerie usée", famille: '"45OJuke Imprimerie usee", serif', effet: "usee", styles: STYLE_REGULIER },
      { id: "ancienne-machine-noire", libelle: "Ancienne machine noire", famille: '"45OJuke Ancienne machine noire", monospace', effet: "encre-noire", styles: STYLE_REGULIER },
      { id: "machine-veteran", libelle: "Machine vétéran", famille: '"45OJuke Machine veteran", monospace', effet: "veteran", styles: STYLE_REGULIER },
      { id: "smith-5-usee", libelle: "Smith 5 usée", famille: '"45OJuke Smith 5 usee", serif', effet: "smith", styles: STYLE_REGULIER },
      { id: "machine-fantome", libelle: "Machine fantôme", famille: '"45OJuke Machine fantome", monospace', effet: "fantome", styles: STYLE_REGULIER },
      { id: "tampon-machine", libelle: "Tampon machine", famille: '"45OJuke Tampon machine", monospace', effet: "tampon", styles: STYLE_REGULIER },
      { id: "terminal-carre", libelle: "Terminal carré", famille: '"IBM Plex Mono", monospace', styles: STYLES_REGULIER_GRAS },
      { id: "rock-affiche", libelle: "Rock affiche", famille: 'Limelight, sans-serif', styles: STYLE_REGULIER },
      { id: "swing-50", libelle: "Swing 50", famille: '"Josefin Sans", sans-serif' },
      { id: "western-retro", libelle: "Western rétro", famille: 'Rye, serif', styles: STYLE_REGULIER },
    ],
  },
  {
    id: "elegante",
    libelle: "Fines et élégantes",
    polices: [
      { id: "classique-livre", libelle: "Classique livre", famille: 'Lora, serif' },
      { id: "elegante", libelle: "Élégante", famille: '"Cormorant Garamond", serif', poidsMax: 500, styles: STYLES_REGULIER_ITALIQUE },
      { id: "luxe-fin", libelle: "Luxe fin", famille: '"Playfair Display", serif', poidsMax: 500, styles: STYLES_REGULIER_ITALIQUE },
      { id: "gravure", libelle: "Gravure", famille: 'Cinzel, serif', styles: STYLES_REGULIER_GRAS },
      { id: "bodoni-fin", libelle: "Bodoni fin", famille: '"Bodoni Moda", serif', poidsMax: 500, styles: STYLES_REGULIER_ITALIQUE },
      { id: "baskerville-fin", libelle: "Baskerville fin", famille: 'Merriweather, serif', styles: STYLES_COMPLETS },
      { id: "caslon-ancien", libelle: "Caslon ancien", famille: '"Libre Caslon Text", serif', styles: STYLES_COMPLETS },
    ],
  },
  {
    id: "affiche",
    libelle: "Affiche",
    polices: [
      { id: "compacte", libelle: "Compacte nette", famille: '"Archivo Narrow", sans-serif' },
      { id: "sans-serree", libelle: "Sans serrée", famille: '"Source Sans 3", sans-serif' },
      { id: "mono-moderne", libelle: "Mono moderne", famille: '"Roboto Mono", monospace', styles: STYLES_REGULIER_GRAS },
    ],
  },
];

const POLICES_PAR_ID = new Map(
  GROUPES_POLICES.flatMap((groupe) => groupe.polices.map((police) => [police.id, police])),
);

const ALIASES_POLICES_SUPPRIMEES = new Map([
  ["silk-remington", "dactylo-ronde"],
  ["american-elite", "dactylo-ronde"],
  ["machine-vintage", "dactylo-seche"],
  ["courrier-classique", "dactylo-seche"],
  ["prestige-elite", "dactylo-seche"],
  ["telegramme", "dactylo-seche"],
  ["garamond-fin", "journal-ancien"],
  ["affiche-condensee", "rock-affiche"],
]);

export function normaliserIdPolice(id, valeurParDefaut = "dactylo-ronde") {
  const idNormalise = ALIASES_POLICES_SUPPRIMEES.get(id) || id;
  return POLICES_PAR_ID.has(idNormalise) ? idNormalise : valeurParDefaut;
}

export function obtenirPolice(id) {
  return POLICES_PAR_ID.get(normaliserIdPolice(id));
}

export function stylesPolice(id) {
  return obtenirPolice(id).styles || STYLES_COMPLETS;
}

export function normaliserStylePolice(id, style) {
  const styles = stylesPolice(id);
  if (styles.includes(style)) {
    return style;
  }
  if (style === "gras-italique") {
    if (styles.includes("gras")) {
      return "gras";
    }
    if (styles.includes("italique")) {
      return "italique";
    }
  }
  return "normal";
}

export function famillePolice(id) {
  return obtenirPolice(id).famille;
}

export function poidsPolice(id, poidsDemande) {
  const poidsMax = obtenirPolice(id).poidsMax;
  return poidsMax ? Math.min(poidsDemande, poidsMax) : poidsDemande;
}

export function remplirSelectPolice(select, valeurParDefaut = "dactylo-ronde") {
  if (!select) {
    return;
  }
  const valeurCourante = select.value;
  const groupes = GROUPES_POLICES.map((groupe) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = groupe.libelle;
    optgroup.append(...groupe.polices.map((police) => {
      const option = document.createElement("option");
      option.value = police.id;
      option.textContent = police.libelle;
      return option;
    }));
    return optgroup;
  });
  select.replaceChildren(...groupes);
  select.value = normaliserIdPolice(valeurCourante, valeurParDefaut);
}

export async function chargerPolicesLocales() {
  if (!document.fonts?.load) {
    return;
  }
  const familles = [...new Set(
    GROUPES_POLICES.flatMap((groupe) => groupe.polices.map((police) => police.famille)),
  )];
  await Promise.all(familles.map((famille) => document.fonts.load(`400 24px ${famille}`)));
}

export function effetPoliceDepuisFont(font) {
  const valeur = String(font || "");
  const effets = [
    ["45OJuke Ancienne machine noire", "encre-noire"],
    ["45OJuke Machine veteran", "veteran"],
    ["45OJuke Smith 5 usee", "smith"],
    ["45OJuke Machine fantome", "fantome"],
    ["45OJuke Tampon machine", "tampon"],
  ];
  const correspondance = effets.find(([famille]) => valeur.includes(famille));
  if (correspondance) {
    return correspondance[1];
  }
  if (valeur.includes("45OJuke Dactylo usee") || valeur.includes("45OJuke Imprimerie usee")) {
    return "usee";
  }
  if (valeur.includes("45OJuke Journal efface")) {
    return "efface";
  }
  return "aucun";
}
