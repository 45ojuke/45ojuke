const STYLES_COMPLETS = ["normal", "gras", "italique", "gras-italique"];
const STYLES_REGULIER_ITALIQUE = ["normal", "italique"];
const STYLES_REGULIER_GRAS = ["normal", "gras"];
const STYLES_REGULIER_GRAS_ITALIQUE = ["normal", "gras", "italique"];
const STYLE_REGULIER = ["normal"];

export const GROUPES_POLICES = [
  {
    id: "dactylo",
    libelle: "Machines à écrire",
    polices: [
      { id: "dactylo-seche", libelle: "Dactylo sèche — classique", famille: '"Courier Prime", monospace' },
      { id: "special-elite", libelle: "Special Elite — machine usée", famille: '"Special Elite", monospace', styles: STYLE_REGULIER },
      { id: "lekton", libelle: "Lekton — technique fine", famille: 'Lekton, monospace', styles: STYLES_REGULIER_GRAS_ITALIQUE },
      { id: "xanh-mono", libelle: "Xanh Mono — élégante", famille: '"Xanh Mono", monospace', styles: STYLES_REGULIER_ITALIQUE },
    ],
  },
  {
    id: "ancien",
    libelle: "Anciennes et patinées",
    polices: [
      { id: "journal-ancien", libelle: "Journal ancien — presse classique", famille: '"Libre Baskerville", serif' },
      { id: "dactylo-usee", libelle: "Dactylo rongée — encre usée", famille: '"45OJuke Dactylo usee", monospace', effet: "usee", styles: STYLE_REGULIER },
      { id: "journal-efface", libelle: "Rapport 1942 — document effacé", famille: '"45OJuke Journal efface", monospace', effet: "efface", styles: STYLE_REGULIER },
      { id: "imprimerie-usee", libelle: "Imprimerie usée — caractères érodés", famille: '"45OJuke Imprimerie usee", serif', effet: "usee", styles: STYLE_REGULIER },
      { id: "ancienne-machine-noire", libelle: "Ancienne machine — encre dense", famille: '"45OJuke Ancienne machine noire", monospace', effet: "encre-noire", styles: STYLE_REGULIER },
      { id: "machine-veteran", libelle: "Machine vétéran — frappe irrégulière", famille: '"45OJuke Machine veteran", monospace', effet: "veteran", styles: STYLE_REGULIER },
      { id: "smith-5-usee", libelle: "Smith 5 — vieille imprimerie", famille: '"45OJuke Smith 5 usee", serif', effet: "smith", styles: STYLE_REGULIER },
      { id: "machine-fantome", libelle: "Machine fantôme — frappe pâle", famille: '"45OJuke Machine fantome", monospace', effet: "fantome", styles: STYLE_REGULIER },
      { id: "tampon-machine", libelle: "Tampon machine — encre tamponnée", famille: '"45OJuke Tampon machine", monospace', effet: "tampon", styles: STYLE_REGULIER },
      { id: "terminal-carre", libelle: "Terminal carré — industriel", famille: '"IBM Plex Mono", monospace', styles: STYLES_REGULIER_GRAS },
      { id: "rock-affiche", libelle: "Rock affiche — Art déco", famille: 'Limelight, sans-serif', styles: STYLE_REGULIER },
      { id: "swing-50", libelle: "Swing 50 — années 1950", famille: '"Josefin Sans", sans-serif' },
      { id: "western-retro", libelle: "Western rétro — saloon", famille: 'Rye, serif', styles: STYLE_REGULIER },
    ],
  },
  {
    id: "serifs",
    libelle: "Sérifs",
    polices: [
      { id: "bodoni-fin", libelle: "Bodoni — didone", famille: '"Bodoni Moda", serif', poidsMax: 500, styles: STYLES_REGULIER_ITALIQUE },
      { id: "alfa-slab-one", libelle: "Alfa Slab One — slab massive", famille: '"Alfa Slab One", serif', styles: STYLE_REGULIER },
      { id: "eczar", libelle: "Eczar — calligraphique", famille: 'Eczar, serif', styles: STYLES_REGULIER_GRAS },
      { id: "fredericka", libelle: "Fredericka — crayon gravé", famille: '"Fredericka the Great", serif', styles: STYLE_REGULIER },
      { id: "bree-serif", libelle: "Bree Serif — douce", famille: '"Bree Serif", serif', styles: STYLE_REGULIER },
    ],
  },
  {
    id: "moderne",
    libelle: "Moderne sobre",
    polices: [
      { id: "sans-serree", libelle: "Source Sans — humaniste", famille: '"Source Sans 3", sans-serif' },
      { id: "poiret-one", libelle: "Poiret One — géométrique fine", famille: '"Poiret One", sans-serif', styles: STYLE_REGULIER },
      { id: "syncopate", libelle: "Syncopate — capitales larges", famille: 'Syncopate, sans-serif', styles: STYLE_REGULIER },
      { id: "saira-condensed", libelle: "Saira Condensed — condensée", famille: '"Saira Condensed", sans-serif', styles: STYLE_REGULIER },
      { id: "lexend", libelle: "Lexend — lecture large", famille: 'Lexend, sans-serif', styles: STYLES_REGULIER_GRAS },
    ],
  },
  {
    id: "affiches",
    libelle: "Affiches très typées",
    polices: [
      { id: "bungee", libelle: "Bungee — bloc", famille: 'Bungee, sans-serif', styles: STYLE_REGULIER },
      { id: "black-ops-one", libelle: "Black Ops One — pochoir", famille: '"Black Ops One", sans-serif', styles: STYLE_REGULIER },
      { id: "bangers", libelle: "Bangers — bande dessinée", famille: 'Bangers, sans-serif', styles: STYLE_REGULIER },
      { id: "abril-fatface", libelle: "Abril Fatface — éditoriale", famille: '"Abril Fatface", serif', styles: STYLE_REGULIER },
      { id: "faster-one", libelle: "Faster One — vitesse", famille: '"Faster One", sans-serif', styles: STYLE_REGULIER },
    ],
  },
  {
    id: "techno",
    libelle: "Techno et pixel",
    polices: [
      { id: "orbitron", libelle: "Orbitron — futuriste", famille: 'Orbitron, sans-serif', styles: STYLES_REGULIER_GRAS },
      { id: "press-start-2p", libelle: "Press Start 2P — pixel", famille: '"Press Start 2P", monospace', styles: STYLE_REGULIER },
      { id: "audiowide", libelle: "Audiowide — techno ronde", famille: 'Audiowide, sans-serif', styles: STYLE_REGULIER },
      { id: "share-tech-mono", libelle: "Share Tech Mono — terminal", famille: '"Share Tech Mono", monospace', styles: STYLE_REGULIER },
      { id: "bruno-ace-sc", libelle: "Bruno Ace SC — automobile", famille: '"Bruno Ace SC", sans-serif', styles: STYLE_REGULIER },
    ],
  },
  {
    id: "decoratives",
    libelle: "Décoratives",
    polices: [
      { id: "pirata-one", libelle: "Pirata One — gothique", famille: '"Pirata One", serif', styles: STYLE_REGULIER },
      { id: "monoton", libelle: "Monoton — inline", famille: 'Monoton, sans-serif', styles: STYLE_REGULIER },
      { id: "ewert", libelle: "Ewert — western ajourée", famille: 'Ewert, serif', styles: STYLE_REGULIER },
      { id: "rubik-glitch", libelle: "Rubik Glitch — glitch", famille: '"Rubik Glitch", sans-serif', styles: STYLE_REGULIER },
      { id: "foldit", libelle: "Foldit — rubans pliés", famille: 'Foldit, sans-serif', styles: STYLES_REGULIER_GRAS },
    ],
  },
  {
    id: "tres-arrondies",
    libelle: "Très arrondie / Blobby",
    polices: [
      { id: "modak", libelle: "Modak — bulle", famille: 'Modak, sans-serif', styles: STYLE_REGULIER },
      { id: "coiny", libelle: "Coiny — cartoon", famille: 'Coiny, sans-serif', styles: STYLE_REGULIER },
      { id: "dynapuff", libelle: "DynaPuff — gonflée", famille: 'DynaPuff, sans-serif', styles: STYLES_REGULIER_GRAS },
      { id: "rubik-bubbles", libelle: "Rubik Bubbles — bulles évidées", famille: '"Rubik Bubbles", sans-serif', styles: STYLE_REGULIER },
      { id: "sniglet", libelle: "Sniglet — ronde légère", famille: 'Sniglet, sans-serif', styles: STYLE_REGULIER },
    ],
  },
  {
    id: "manuscrites",
    libelle: "Écritures manuelles",
    polices: [
      { id: "ephesis", libelle: "Ephesis — calligraphie fine", famille: 'Ephesis, cursive', styles: STYLE_REGULIER },
      { id: "permanent-marker", libelle: "Permanent Marker — feutre", famille: '"Permanent Marker", cursive', styles: STYLE_REGULIER },
      { id: "rock-salt", libelle: "Rock Salt — griffonnée", famille: '"Rock Salt", cursive', styles: STYLE_REGULIER },
      { id: "homemade-apple", libelle: "Homemade Apple — crayon", famille: '"Homemade Apple", cursive', styles: STYLE_REGULIER },
      { id: "pacifico", libelle: "Pacifico — pinceau rétro", famille: 'Pacifico, cursive', styles: STYLE_REGULIER },
    ],
  },
  {
    id: "saisons",
    libelle: "Saisons",
    polices: [
      { id: "creepster", libelle: "Creepster — Halloween", famille: 'Creepster, fantasy', styles: STYLE_REGULIER },
      { id: "codystar", libelle: "Codystar — Noël lumineux", famille: 'Codystar, sans-serif', styles: STYLE_REGULIER },
      { id: "snowburst-one", libelle: "Snowburst One — hiver", famille: '"Snowburst One", fantasy', styles: STYLE_REGULIER },
      { id: "emilys-candy", libelle: "Emilys Candy — Saint-Valentin", famille: '"Emilys Candy", fantasy', styles: STYLE_REGULIER },
      { id: "hanalei-fill", libelle: "Hanalei Fill — été tropical", famille: '"Hanalei Fill", fantasy', styles: STYLE_REGULIER },
    ],
  },
];

const ALIASES_POLICES = new Map([
  ["dactylo-ronde", "dactylo-seche"],
  ["classique-livre", "bodoni-fin"],
  ["elegante", "bodoni-fin"],
  ["luxe-fin", "bodoni-fin"],
  ["baskerville-fin", "bodoni-fin"],
  ["caslon-ancien", "bodoni-fin"],
  ["gravure", "bodoni-fin"],
  ["bebas-neue", "sans-serree"],
  ["compacte", "sans-serree"],
  ["mono-moderne", "sans-serree"],
  ["montserrat", "sans-serree"],
  ["raleway", "swing-50"],
  ["space-grotesk", "sans-serree"],
  ["unbounded", "bungee"],
  ["syne", "swing-50"],
  ["chakra-petch", "orbitron"],
  ["fredoka", "sans-serree"],
  ["nunito", "sans-serree"],
  ["quicksand", "sans-serree"],
  ["varela-round", "sans-serree"],
  ["baloo-2", "sans-serree"],
  ["comfortaa", "sans-serree"],
  ["kalam", "permanent-marker"],
  ["caveat", "permanent-marker"],
  ["kaushan-script", "ephesis"],
  ["dancing-script", "ephesis"],
  ["butcherman", "creepster"],
  ["mountains-of-christmas", "codystar"],
]);

const POLICES_PAR_ID = new Map(
  GROUPES_POLICES.flatMap((groupe) => groupe.polices.map((police) => [police.id, police])),
);
const chargementsPolices = new Map();

export function normaliserIdPolice(id, valeurParDefaut = "dactylo-seche") {
  const idNormalise = ALIASES_POLICES.get(id) || id;
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

function stylePoliceCss(style) {
  return style === "italique" || style === "gras-italique" ? "italic" : "normal";
}

function poidsPoliceCss(id, style) {
  return poidsPolice(id, style === "gras" || style === "gras-italique" ? 700 : 400);
}

function chargerPolice(id, style = "normal") {
  if (!document.fonts?.load) {
    return Promise.resolve();
  }
  const idNormalise = normaliserIdPolice(id);
  const styleNormalise = normaliserStylePolice(idNormalise, style);
  const cle = `${idNormalise}:${styleNormalise}`;
  if (!chargementsPolices.has(cle)) {
    const famille = famillePolice(idNormalise);
    const styleCss = stylePoliceCss(styleNormalise);
    const poidsCss = poidsPoliceCss(idNormalise, styleNormalise);
    chargementsPolices.set(
      cle,
      document.fonts.load(`${styleCss} ${poidsCss} 24px ${famille}`).catch(() => undefined),
    );
  }
  return chargementsPolices.get(cle);
}

export function chargerPolicesReglages(reglages) {
  if (!reglages || typeof reglages !== "object") {
    return Promise.resolve();
  }
  const demandes = [
    [reglages.policeTitres, reglages.styleTitres],
    [reglages.policeArtiste, reglages.styleArtiste],
  ];
  if (reglages.afficherMarques) {
    demandes.push(
      [reglages.policeMarqueGauche || reglages.policeMarques, reglages.styleMarqueGauche],
      [reglages.policeMarqueDroite || reglages.policeMarques, reglages.styleMarqueDroite],
    );
  }
  return Promise.all(demandes.map(([id, style]) => chargerPolice(id, style))).then(() => undefined);
}

export function remplirSelectPolice(select, valeurParDefaut = "dactylo-seche") {
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
      option.style.fontFamily = police.famille;
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
