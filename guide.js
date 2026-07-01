import { phrasesInterface } from "./traductions.js";
import { CLE_LANGUE } from "./reglages.js";

const languesDisponibles = new Set(["fr", "en", "us", "nl", "de", "es", "it"]);
const boutonsLangue = document.querySelectorAll(".guide-langues [data-lang]");
const indexTraductions = new Map();

Object.entries(phrasesInterface).forEach(([cle, traductions]) => {
  [cle, ...Object.values(traductions)].forEach((texte) => {
    if (!indexTraductions.has(texte)) {
      indexTraductions.set(texte, new Set());
    }
    indexTraductions.get(texte).add(cle);
  });
});

function retrouverCle(texte) {
  if (phrasesInterface[texte]) {
    return texte;
  }
  const cles = indexTraductions.get(texte);
  return cles?.size === 1 ? cles.values().next().value : "";
}

function traduire(cle, langue) {
  return langue === "fr" ? cle : phrasesInterface[cle]?.[langue] || cle;
}

function appliquerLangue(langue, { memoriser = true } = {}) {
  const langueActive = languesDisponibles.has(langue) ? langue : "fr";
  document.documentElement.lang = langueActive === "us" ? "en" : langueActive;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(noeud) {
      const parent = noeud.parentElement;
      if (!parent || ["SCRIPT", "STYLE"].includes(parent.tagName) || parent.closest(".guide-langues")) {
        return NodeFilter.FILTER_REJECT;
      }
      const cle = noeud.__cleI18n || retrouverCle(noeud.textContent.trim());
      return cle ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const noeuds = [];
  while (walker.nextNode()) {
    noeuds.push(walker.currentNode);
  }
  noeuds.forEach((noeud) => {
    const cle = noeud.__cleI18n || retrouverCle(noeud.textContent.trim());
    noeud.__cleI18n = cle;
    const prefixe = noeud.textContent.match(/^\s*/)?.[0] || "";
    const suffixe = noeud.textContent.match(/\s*$/)?.[0] || "";
    noeud.textContent = `${prefixe}${traduire(cle, langueActive)}${suffixe}`;
  });

  document.querySelectorAll("[aria-label], [title], [alt]").forEach((element) => {
    ["aria-label", "title", "alt"].forEach((attribut) => {
      if (!element.hasAttribute(attribut) || element.closest(".guide-langues")) {
        return;
      }
      const proprieteCle = `cleI18n${attribut.replace(/(^|-)([a-z])/g, (_, __, lettre) => lettre.toUpperCase())}`;
      const valeur = element.getAttribute(attribut);
      const cle = element.dataset[proprieteCle] || retrouverCle(valeur);
      if (!cle) {
        return;
      }
      element.dataset[proprieteCle] = cle;
      element.setAttribute(attribut, traduire(cle, langueActive));
    });
  });

  const cleTitre = "Guide des étiquettes de jukebox - 45’O’Juke";
  document.title = traduire(cleTitre, langueActive);
  boutonsLangue.forEach((bouton) => bouton.classList.toggle("actif", bouton.dataset.lang === langueActive));
  if (memoriser) {
    try {
      localStorage.setItem(CLE_LANGUE, langueActive);
    } catch {
      // Le stockage local peut être indisponible.
    }
  }
}

boutonsLangue.forEach((bouton) => {
  bouton.addEventListener("click", () => appliquerLangue(bouton.dataset.lang || "fr"));
});

let langueMemorisee = null;
try {
  const langue = localStorage.getItem(CLE_LANGUE);
  langueMemorisee = languesDisponibles.has(langue) ? langue : null;
} catch {
  // Le stockage local peut être indisponible.
}

function detecterLangueNavigateur() {
  const languesNavigateur = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language || ""];
  for (const langueNavigateur of languesNavigateur) {
    const langue = normaliserLangueNavigateur(langueNavigateur);
    if (langue) {
      return langue;
    }
  }
  return null;
}

function normaliserLangueNavigateur(langueNavigateur) {
  const locale = String(langueNavigateur || "").toLowerCase();
  if (!locale) {
    return null;
  }
  if (locale === "en-us" || locale.startsWith("en-us-")) {
    return "us";
  }
  const langue = locale.split("-")[0];
  return languesDisponibles.has(langue) && langue !== "us" ? langue : null;
}

appliquerLangue(langueMemorisee || detecterLangueNavigateur() || "fr", { memoriser: false });
