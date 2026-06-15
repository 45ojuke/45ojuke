import { ECART_MM, HAUTEUR_PAGE_MM, LARGEUR_PAGE_MM, MARGE_PAGE_MM } from "./reglages.js";
import { dessinerEtiquette } from "./etiquettes.js";

export function calculerDispositionImpression(reglages) {
  const largeurUtile = LARGEUR_PAGE_MM - MARGE_PAGE_MM * 2;
  const hauteurUtile = HAUTEUR_PAGE_MM - MARGE_PAGE_MM * 2;
  const colonnes = Math.floor((largeurUtile + ECART_MM) / (reglages.largeurEtiquette + ECART_MM));
  const lignes = Math.floor((hauteurUtile + ECART_MM) / (reglages.hauteurEtiquette + ECART_MM));
  return {
    colonnes: Math.max(0, colonnes),
    lignes: Math.max(0, lignes),
    etiquettesParPage: Math.max(0, colonnes * lignes),
  };
}

export function preparerLignesSortie(lignes, options = {}) {
  if (!options.vierges) {
    return lignes;
  }
  return lignes.map((ligne) => ({
    ...ligne,
    artiste: "",
    titre_face_a: "",
    titre_face_b: "",
    selection_face_a: "",
    selection_face_b: "",
    titreA: "",
    artisteAffiche: "",
    titreB: "",
  }));
}

export async function telechargerPng(lignes, { deuxiemeEtiquetteActive, lireReglages }) {
  const deuxiemeActive = deuxiemeEtiquetteActive();
  const reglagesPrincipaux = lireReglages("1");
  const largeur = Math.round(reglagesPrincipaux.largeurEtiquette * window.PX_PAR_MM);
  const hauteur = Math.round(reglagesPrincipaux.hauteurEtiquette * window.PX_PAR_MM);
  const ecart = Math.round(ECART_MM * window.PX_PAR_MM);
  const colonnes = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(lignes.length))));
  const lignesGrille = Math.ceil(lignes.length / colonnes);
  const marge = Math.round(8 * window.PX_PAR_MM);
  const canvas = document.createElement("canvas");
  canvas.width = colonnes * largeur + (colonnes - 1) * ecart + marge * 2;
  canvas.height = lignesGrille * hauteur + (lignesGrille - 1) * ecart + marge * 2;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  lignes.forEach((ligne, index) => {
    const reglages = deuxiemeActive && index % 2 === 1 ? lireReglages("2") : lireReglages("1");
    const etiquette = dessinerEtiquette(ligne, reglages);
    const x = marge + (index % colonnes) * (largeur + ecart);
    const y = marge + Math.floor(index / colonnes) * (hauteur + ecart);
    ctx.drawImage(etiquette, x, y, largeur, hauteur);
  });
  const lien = document.createElement("a");
  lien.href = canvas.toDataURL("image/png");
  lien.download = "45-o-juke-etiquettes.png";
  document.body.append(lien);
  lien.click();
  lien.remove();
}

export async function imprimerLignes(lignes, { deuxiemeEtiquetteActive, elements, lireReglages }) {
  const deuxiemeActive = deuxiemeEtiquetteActive();
  const reglagesPrincipaux = lireReglages("1");
  const disposition = calculerDispositionImpression(reglagesPrincipaux);
  if (!disposition.etiquettesParPage) {
    elements.statutPlanche.hidden = false;
    elements.statutPlanche.textContent = "Format trop grand pour une page A4";
    return;
  }
  const pages = [];
  elements.plancheImpression.style.setProperty("--largeur-etiquette-mm", `${reglagesPrincipaux.largeurEtiquette}mm`);
  elements.plancheImpression.style.setProperty("--hauteur-etiquette-mm", `${reglagesPrincipaux.hauteurEtiquette}mm`);
  elements.plancheImpression.style.setProperty("--ecart-impression-mm", `${ECART_MM}mm`);
  elements.plancheImpression.style.setProperty("--colonnes-impression", String(disposition.colonnes));
  elements.plancheImpression.style.setProperty("--lignes-impression", String(disposition.lignes));

  const images = [];
  for (let index = 0; index < lignes.length; index += disposition.etiquettesParPage) {
    const page = document.createElement("section");
    page.className = "page-impression";
    lignes.slice(index, index + disposition.etiquettesParPage).forEach((ligne, decalage) => {
      const cellule = document.createElement("div");
      const image = document.createElement("img");
      const reglages = deuxiemeActive && (index + decalage) % 2 === 1 ? lireReglages("2") : lireReglages("1");
      image.alt = "Étiquette imprimée";
      image.src = dessinerEtiquette(ligne, reglages).toDataURL("image/png");
      images.push(image);
      cellule.className = "cellule-impression";
      cellule.append(image);
      page.append(cellule);
    });
    pages.push(page);
  }

  elements.plancheImpression.replaceChildren(...pages);
  await attendreImagesPretes(images);
  window.print();
}

async function attendreImagesPretes(images) {
  await Promise.all(images.map(async (image) => {
    if (image.complete && image.naturalWidth > 0) {
      return;
    }
    if (image.decode) {
      try {
        await image.decode();
        return;
      } catch {
        // Certains navigateurs refusent decode() sur des data URLs encore en file d'attente.
      }
    }
    await new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    });
  }));
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}
