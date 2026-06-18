const STYLES_COMPLETS = ["normal", "gras", "italique", "gras-italique"];
const STYLES_REGULIER_ITALIQUE = ["normal", "italique"];
const STYLES_REGULIER_GRAS = ["normal", "gras"];
const STYLE_REGULIER = ["normal"];

export const GROUPES_POLICES = [
  {
    id: "dactylo",
    libelle: "Machines à écrire",
    polices: [
      { id: "dactylo-ronde", libelle: "Dactylo ronde", famille: '"American Typewriter", "Courier New", monospace', styles: STYLES_REGULIER_GRAS },
      { id: "dactylo-seche", libelle: "Dactylo sèche", famille: '"Courier New", Courier, monospace' },
      { id: "silk-remington", libelle: "Silk Remington", famille: '"Silk Remington", "American Typewriter", "Courier New", monospace', styles: STYLE_REGULIER },
      { id: "machine-vintage", libelle: "Machine vintage", famille: '"Courier Prime", "Courier New", monospace' },
      { id: "courrier-classique", libelle: "Courrier classique", famille: 'Courier, "Courier New", monospace' },
      { id: "american-elite", libelle: "American Elite", famille: '"American Typewriter", "Courier New", monospace', styles: STYLES_REGULIER_GRAS },
      { id: "prestige-elite", libelle: "Prestige Elite", famille: '"Prestige Elite Std", "Courier Prime", "Courier New", monospace', styles: STYLE_REGULIER },
      { id: "telegramme", libelle: "Télégramme", famille: '"Letter Gothic Std", "Lucida Console", "Courier New", monospace', styles: STYLE_REGULIER },
    ],
  },
  {
    id: "ancien",
    libelle: "Anciennes et patinées",
    polices: [
      { id: "journal-ancien", libelle: "Journal ancien", famille: '"Times New Roman", Times, serif' },
      { id: "dactylo-usee", libelle: "Dactylo rongée", famille: '"45OJuke Dactylo usee", "Courier Prime", "Courier New", monospace', effet: "usee", styles: STYLE_REGULIER },
      { id: "journal-efface", libelle: "Rapport 1942 effacé", famille: '"45OJuke Journal efface", "Courier Prime", "Courier New", monospace', effet: "efface", styles: STYLE_REGULIER },
      { id: "imprimerie-usee", libelle: "Imprimerie usée", famille: '"45OJuke Imprimerie usee", Rockwell, "American Typewriter", Georgia, serif', effet: "usee", styles: STYLE_REGULIER },
      { id: "ancienne-machine-noire", libelle: "Ancienne machine noire", famille: '"45OJuke Ancienne machine noire", "American Typewriter", Rockwell, "Courier New", monospace', effet: "encre-noire", styles: STYLE_REGULIER },
      { id: "machine-veteran", libelle: "Machine vétéran", famille: '"45OJuke Machine veteran", "American Typewriter", "Courier Prime", "Courier New", monospace', effet: "veteran", styles: STYLE_REGULIER },
      { id: "smith-5-usee", libelle: "Smith 5 usée", famille: '"45OJuke Smith 5 usee", Rockwell, "American Typewriter", "Courier New", monospace', effet: "smith", styles: STYLE_REGULIER },
      { id: "machine-fantome", libelle: "Machine fantôme", famille: '"45OJuke Machine fantome", "Courier Prime", "Courier New", monospace', effet: "fantome", styles: STYLE_REGULIER },
      { id: "tampon-machine", libelle: "Tampon machine", famille: '"45OJuke Tampon machine", "American Typewriter", "Courier New", monospace', effet: "tampon", styles: STYLE_REGULIER },
      { id: "terminal-carre", libelle: "Terminal carré", famille: 'Monaco, "Lucida Console", monospace', styles: STYLE_REGULIER },
      { id: "rock-affiche", libelle: "Rock affiche", famille: '"Cooper Black", Impact, "Arial Black", sans-serif', styles: STYLE_REGULIER },
      { id: "swing-50", libelle: "Swing 50", famille: '"Gill Sans", "Trebuchet MS", Arial, sans-serif' },
      { id: "western-retro", libelle: "Western rétro", famille: 'Rockwell, "American Typewriter", Georgia, serif' },
    ],
  },
  {
    id: "elegante",
    libelle: "Fines et élégantes",
    polices: [
      { id: "classique-livre", libelle: "Classique livre", famille: 'Georgia, "Times New Roman", serif' },
      { id: "elegante", libelle: "Élégante", famille: 'Palatino, "Palatino Linotype", Georgia, serif' },
      { id: "luxe-fin", libelle: "Luxe fin", famille: 'Didot, "Bodoni 72", "Hoefler Text", Georgia, serif', poidsMax: 500, styles: STYLES_REGULIER_ITALIQUE },
      { id: "gravure", libelle: "Gravure", famille: '"Hoefler Text", Baskerville, Georgia, serif' },
      { id: "bodoni-fin", libelle: "Bodoni fin", famille: '"Bodoni 72", Didot, "Times New Roman", serif', poidsMax: 400, styles: STYLES_REGULIER_ITALIQUE },
      { id: "baskerville-fin", libelle: "Baskerville fin", famille: 'Baskerville, "Baskerville Old Face", "Hoefler Text", Georgia, serif', poidsMax: 400, styles: STYLES_REGULIER_ITALIQUE },
      { id: "garamond-fin", libelle: "Garamond fin", famille: 'Garamond, "EB Garamond", "Times New Roman", serif', poidsMax: 400, styles: STYLES_REGULIER_ITALIQUE },
      { id: "caslon-ancien", libelle: "Caslon ancien", famille: '"Adobe Caslon Pro", "Big Caslon", Baskerville, Georgia, serif', poidsMax: 500, styles: STYLES_REGULIER_ITALIQUE },
    ],
  },
  {
    id: "affiche",
    libelle: "Affiche",
    polices: [
      { id: "compacte", libelle: "Compacte nette", famille: '"Arial Narrow", "Helvetica Neue Condensed", Arial, sans-serif' },
      { id: "affiche-condensee", libelle: "Affiche condensée", famille: 'Impact, "Arial Black", "Arial Narrow", sans-serif', styles: STYLE_REGULIER },
      { id: "sans-serree", libelle: "Sans serrée", famille: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
      { id: "mono-moderne", libelle: "Mono moderne", famille: 'Menlo, Monaco, Consolas, monospace' },
    ],
  },
];

const POLICES_PAR_ID = new Map(
  GROUPES_POLICES.flatMap((groupe) => groupe.polices.map((police) => [police.id, police])),
);

export function obtenirPolice(id) {
  return POLICES_PAR_ID.get(id) || POLICES_PAR_ID.get("dactylo-ronde");
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
  select.value = POLICES_PAR_ID.has(valeurCourante) ? valeurCourante : valeurParDefaut;
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
