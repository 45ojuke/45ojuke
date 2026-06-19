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

export async function telechargerPdf(lignes, { deuxiemeEtiquetteActive, lireReglages }) {
  const deuxiemeActive = deuxiemeEtiquetteActive();
  const reglagesPrincipaux = lireReglages("1", lignes[0]);
  const disposition = calculerDispositionImpression(reglagesPrincipaux);
  if (!disposition.etiquettesParPage) {
    throw new Error("Format trop grand pour une page A4");
  }

  const imagesParPage = [];
  for (let index = 0; index < lignes.length; index += disposition.etiquettesParPage) {
    const images = lignes.slice(index, index + disposition.etiquettesParPage).map((ligne, decalage) => {
      const numeroStyle = deuxiemeActive && (index + decalage) % 2 === 1 ? "2" : "1";
      const reglages = lireReglages(numeroStyle, ligne);
      const canvas = dessinerEtiquette(ligne, reglages);
      return {
        largeurPx: canvas.width,
        hauteurPx: canvas.height,
        donnees: extraireDonneesBase64(canvas.toDataURL("image/jpeg", 0.96)),
      };
    });
    imagesParPage.push(images);
  }

  const pdf = construirePdfEtiquettes(imagesParPage, disposition, reglagesPrincipaux);
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = "45-o-juke-etiquettes.pdf";
  document.body.append(lien);
  lien.click();
  lien.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function construirePdfEtiquettes(imagesParPage, disposition, reglages) {
  const pointsParMm = 72 / 25.4;
  const largeurPagePt = LARGEUR_PAGE_MM * pointsParMm;
  const hauteurPagePt = HAUTEUR_PAGE_MM * pointsParMm;
  const largeurEtiquettePt = reglages.largeurEtiquette * pointsParMm;
  const hauteurEtiquettePt = reglages.hauteurEtiquette * pointsParMm;
  const largeurGrilleMm = disposition.colonnes * reglages.largeurEtiquette + (disposition.colonnes - 1) * ECART_MM;
  const hauteurGrilleMm = disposition.lignes * reglages.hauteurEtiquette + (disposition.lignes - 1) * ECART_MM;
  const departXMm = (LARGEUR_PAGE_MM - largeurGrilleMm) / 2;
  const departYMm = (HAUTEUR_PAGE_MM - hauteurGrilleMm) / 2;
  const objets = [];

  const ajouterObjet = (contenu) => {
    objets.push(contenu);
    return objets.length;
  };

  const catalogueRef = ajouterObjet("");
  const pagesRef = ajouterObjet("");
  const pageRefs = [];

  imagesParPage.forEach((images) => {
    const xObjects = [];
    const commandes = [];
    images.forEach((image, index) => {
      const colonne = index % disposition.colonnes;
      const ligne = Math.floor(index / disposition.colonnes);
      const xMm = departXMm + colonne * (reglages.largeurEtiquette + ECART_MM);
      const yMm = departYMm + ligne * (reglages.hauteurEtiquette + ECART_MM);
      const x = formatPdfNombre(xMm * pointsParMm);
      const y = formatPdfNombre(hauteurPagePt - (yMm * pointsParMm) - hauteurEtiquettePt);
      const nom = `Im${index + 1}`;
      const imageRef = ajouterObjet(
        `<< /Type /XObject /Subtype /Image /Width ${image.largeurPx} /Height ${image.hauteurPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.donnees.length} >>\nstream\n${image.donnees}\nendstream`
      );
      xObjects.push(`/${nom} ${imageRef} 0 R`);
      commandes.push(`q ${formatPdfNombre(largeurEtiquettePt)} 0 0 ${formatPdfNombre(hauteurEtiquettePt)} ${x} ${y} cm /${nom} Do Q`);
    });

    const contenu = commandes.join("\n");
    const contenuRef = ajouterObjet(`<< /Length ${contenu.length} >>\nstream\n${contenu}\nendstream`);
    const pageRef = ajouterObjet(
      `<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${formatPdfNombre(largeurPagePt)} ${formatPdfNombre(hauteurPagePt)}] /Resources << /XObject << ${xObjects.join(" ")} >> >> /Contents ${contenuRef} 0 R >>`
    );
    pageRefs.push(pageRef);
  });

  objets[catalogueRef - 1] = `<< /Type /Catalog /Pages ${pagesRef} 0 R >>`;
  objets[pagesRef - 1] = `<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(" ")}] /Count ${pageRefs.length} >>`;

  return encoderPdf(objets);
}

function encoderPdf(objets) {
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objets.forEach((objet, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${objet}\nendobj\n`;
  });
  const departXref = pdf.length;
  pdf += `xref\n0 ${objets.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objets.length + 1} /Root 1 0 R >>\nstartxref\n${departXref}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let index = 0; index < pdf.length; index += 1) {
    bytes[index] = pdf.charCodeAt(index) & 0xff;
  }
  return bytes;
}

function extraireDonneesBase64(dataUrl) {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return atob(base64);
}

function formatPdfNombre(nombre) {
  return Number(nombre.toFixed(4)).toString();
}
