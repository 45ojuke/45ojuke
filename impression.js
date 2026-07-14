import {
  ECART_MM,
  HAUTEUR_PAGE_MM,
  LARGEUR_PAGE_MM,
  LIEN_PAGE_SOUTIEN,
  MARGE_PAGE_MM,
} from "./reglages.js";
import { dessinerEtiquette } from "./etiquettes.js";

const POINTS_PAR_MM = 72 / 25.4;
const MARGE_HABILLAGE_PAGE_MM = 21;
const LONGUEUR_REPERE_MM = 2.15;
const RETRAIT_REPERE_MM = 0.65;
const VERSION_QR = 3;
const TAILLE_QR = 17 + VERSION_QR * 4;
const CAPACITE_QR_OCTETS = 55;
const CORRECTION_QR_OCTETS = 15;

export function calculerDispositionImpression(reglages) {
  const largeurUtile = LARGEUR_PAGE_MM - MARGE_PAGE_MM * 2;
  const hauteurUtile = HAUTEUR_PAGE_MM - MARGE_HABILLAGE_PAGE_MM * 2;
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

export async function telechargerPdf(lignes, {
  deuxiemeEtiquetteActive,
  lireReglages,
  traitsDecoupe = true,
  libellesSignature = {},
}) {
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

  const logo = await chargerLogoImpression();
  const pdf = construirePdfEtiquettes(imagesParPage, disposition, reglagesPrincipaux, {
    traitsDecoupe,
    logo,
    libellesSignature,
  });
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = "45-o-juke-etiquettes.pdf";
  document.body.append(lien);
  lien.click();
  lien.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

export function construirePdfEtiquettes(imagesParPage, disposition, reglages, options = {}) {
  const largeurPagePt = LARGEUR_PAGE_MM * POINTS_PAR_MM;
  const hauteurPagePt = HAUTEUR_PAGE_MM * POINTS_PAR_MM;
  const largeurEtiquettePt = reglages.largeurEtiquette * POINTS_PAR_MM;
  const hauteurEtiquettePt = reglages.hauteurEtiquette * POINTS_PAR_MM;
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
  const logoRef = ajouterObjet(creerObjetImagePdf(options.logo));
  const policeRef = ajouterObjet("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const policeGrasseRef = ajouterObjet("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const modulesQr = creerQrCode(LIEN_PAGE_SOUTIEN);

  imagesParPage.forEach((images) => {
    const xObjects = [];
    const commandes = [];
    images.forEach((image, index) => {
      const colonne = index % disposition.colonnes;
      const ligne = Math.floor(index / disposition.colonnes);
      const xMm = departXMm + colonne * (reglages.largeurEtiquette + ECART_MM);
      const yMm = departYMm + ligne * (reglages.hauteurEtiquette + ECART_MM);
      const x = formatPdfNombre(xMm * POINTS_PAR_MM);
      const y = formatPdfNombre(hauteurPagePt - (yMm * POINTS_PAR_MM) - hauteurEtiquettePt);
      const nom = `Im${index + 1}`;
      const imageRef = ajouterObjet(creerObjetImagePdf(image));
      xObjects.push(`/${nom} ${imageRef} 0 R`);
      commandes.push(`q ${formatPdfNombre(largeurEtiquettePt)} 0 0 ${formatPdfNombre(hauteurEtiquettePt)} ${x} ${y} cm /${nom} Do Q`);
    });

    if (options.traitsDecoupe) {
      commandes.push(creerCommandesTraitsDecoupe(images.length, disposition, reglages, departXMm, departYMm));
    }

    commandes.push(creerCommandesSignature({
      departYMm,
      hauteurGrilleMm,
      modulesQr,
      libelles: options.libellesSignature,
    }));
    xObjects.push(`/Logo ${logoRef} 0 R`);

    const contenu = commandes.join("\n");
    const contenuRef = ajouterObjet(`<< /Length ${contenu.length} >>\nstream\n${contenu}\nendstream`);
    const ressourcesPolice = `/Font << /F1 ${policeRef} 0 R /F2 ${policeGrasseRef} 0 R >>`;
    const pageRef = ajouterObjet(
      `<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${formatPdfNombre(largeurPagePt)} ${formatPdfNombre(hauteurPagePt)}] /Resources << /XObject << ${xObjects.join(" ")} >> ${ressourcesPolice} >> /Contents ${contenuRef} 0 R >>`
    );
    pageRefs.push(pageRef);
  });

  objets[catalogueRef - 1] = `<< /Type /Catalog /Pages ${pagesRef} 0 R >>`;
  objets[pagesRef - 1] = `<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(" ")}] /Count ${pageRefs.length} >>`;

  return encoderPdf(objets);
}

function creerObjetImagePdf(image) {
  return `<< /Type /XObject /Subtype /Image /Width ${image.largeurPx} /Height ${image.hauteurPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.donnees.length} >>\nstream\n${image.donnees}\nendstream`;
}

function creerCommandesTraitsDecoupe(nombreImages, disposition, reglages, departXMm, departYMm) {
  const commandes = ["q 0.5 G 0.35 w [] 0 d"];

  for (let index = 0; index < nombreImages; index += 1) {
    const colonne = index % disposition.colonnes;
    const ligne = Math.floor(index / disposition.colonnes);
    const gauche = (departXMm + colonne * (reglages.largeurEtiquette + ECART_MM)) * POINTS_PAR_MM;
    const droite = gauche + reglages.largeurEtiquette * POINTS_PAR_MM;
    const hautMm = departYMm + ligne * (reglages.hauteurEtiquette + ECART_MM);
    const haut = (HAUTEUR_PAGE_MM - hautMm) * POINTS_PAR_MM;
    const bas = haut - reglages.hauteurEtiquette * POINTS_PAR_MM;
    const retrait = RETRAIT_REPERE_MM * POINTS_PAR_MM;
    const longueur = LONGUEUR_REPERE_MM * POINTS_PAR_MM;

    commandes.push(
      segmentPdf(gauche - retrait - longueur, haut, gauche - retrait, haut),
      segmentPdf(gauche - retrait - longueur, bas, gauche - retrait, bas),
      segmentPdf(droite + retrait, haut, droite + retrait + longueur, haut),
      segmentPdf(droite + retrait, bas, droite + retrait + longueur, bas),
      segmentPdf(gauche, haut + retrait, gauche, haut + retrait + longueur),
      segmentPdf(droite, haut + retrait, droite, haut + retrait + longueur),
      segmentPdf(gauche, bas - retrait - longueur, gauche, bas - retrait),
      segmentPdf(droite, bas - retrait - longueur, droite, bas - retrait),
    );
  }

  commandes.push("Q");
  return commandes.join("\n");
}

function segmentPdf(x1, y1, x2, y2) {
  return `${formatPdfNombre(x1)} ${formatPdfNombre(y1)} m ${formatPdfNombre(x2)} ${formatPdfNombre(y2)} l S`;
}

function creerCommandesSignature({
  departYMm,
  hauteurGrilleMm,
  modulesQr,
  libelles,
}) {
  const espaceHautMm = departYMm;
  const basGrilleMm = departYMm + hauteurGrilleMm;
  const espaceBasMm = HAUTEUR_PAGE_MM - basGrilleMm;
  if (espaceHautMm < MARGE_HABILLAGE_PAGE_MM || espaceBasMm < MARGE_HABILLAGE_PAGE_MM) {
    throw new Error("Marge insuffisante pour le logo et le QR code");
  }

  const commandes = [];
  const tailleLogoMm = 13;
  const xLogoMm = (LARGEUR_PAGE_MM - tailleLogoMm) / 2;
  const yLogoMm = (espaceHautMm - tailleLogoMm) / 2;
  commandes.push(
    `q ${formatPdfNombre(tailleLogoMm * POINTS_PAR_MM)} 0 0 ${formatPdfNombre(tailleLogoMm * POINTS_PAR_MM)} ${formatPdfNombre(xLogoMm * POINTS_PAR_MM)} ${formatPdfNombre((HAUTEUR_PAGE_MM - yLogoMm - tailleLogoMm) * POINTS_PAR_MM)} cm /Logo Do Q`,
  );

  const tailleQrMm = 11;
  const yBlocMm = basGrilleMm + (espaceBasMm - tailleQrMm) / 2;
  const xQrMm = LARGEUR_PAGE_MM / 2 - 28;
  commandes.push(creerCommandesQrPdf(modulesQr, xQrMm, yBlocMm, tailleQrMm));

  const titre = libelles?.titre || "Un jeton pour 45'O'Juke ?";
  const detail = libelles?.detail || "Scannez pour soutenir le projet";
  const adresse = libelles?.adresse || "45ojuke.fr";
  const xTexte = (xQrMm + tailleQrMm + 4) * POINTS_PAR_MM;
  const yTitre = (HAUTEUR_PAGE_MM - yBlocMm - 3.2) * POINTS_PAR_MM;
  commandes.push(
    `q 0.16 0.25 0.27 rg BT /F2 8 Tf 1 0 0 1 ${formatPdfNombre(xTexte)} ${formatPdfNombre(yTitre)} Tm (${echapperTextePdf(titre)}) Tj ET Q`,
    `q 0.28 g BT /F1 6.5 Tf 1 0 0 1 ${formatPdfNombre(xTexte)} ${formatPdfNombre(yTitre - 10)} Tm (${echapperTextePdf(detail)}) Tj ET Q`,
    `q 0.28 g BT /F1 6.5 Tf 1 0 0 1 ${formatPdfNombre(xTexte)} ${formatPdfNombre(yTitre - 20)} Tm (${echapperTextePdf(adresse)}) Tj ET Q`,
  );

  return commandes.join("\n");
}

function creerCommandesQrPdf(modules, xMm, yMm, tailleMm) {
  const margeModules = 4;
  const tailleTotale = modules.length + margeModules * 2;
  const pasMm = tailleMm / tailleTotale;
  const commandes = ["q 0 g"];

  modules.forEach((ligne, y) => {
    ligne.forEach((module, x) => {
      if (!module) {
        return;
      }
      const gauche = (xMm + (margeModules + x) * pasMm) * POINTS_PAR_MM;
      const bas = (HAUTEUR_PAGE_MM - yMm - (margeModules + y + 1) * pasMm) * POINTS_PAR_MM;
      const taille = pasMm * POINTS_PAR_MM + 0.02;
      commandes.push(`${formatPdfNombre(gauche)} ${formatPdfNombre(bas)} ${formatPdfNombre(taille)} ${formatPdfNombre(taille)} re`);
    });
  });

  commandes.push("f Q");
  return commandes.join("\n");
}

function echapperTextePdf(texte) {
  return String(texte).replace(/([\\()])/g, "\\$1");
}

async function chargerLogoImpression() {
  const image = await chargerImage("./Images/Original/logo45.png");
  const taille = 420;
  const canvas = document.createElement("canvas");
  canvas.width = taille;
  canvas.height = taille;
  const contexte = canvas.getContext("2d");
  contexte.fillStyle = "#ffffff";
  contexte.fillRect(0, 0, taille, taille);
  contexte.drawImage(image, 0, 0, taille, taille);
  return {
    largeurPx: taille,
    hauteurPx: taille,
    donnees: extraireDonneesBase64(canvas.toDataURL("image/jpeg", 0.9)),
  };
}

function chargerImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

export function creerQrCode(texte) {
  const octets = Array.from(new TextEncoder().encode(texte));
  if (octets.length > 53) {
    throw new Error("Adresse trop longue pour le QR code d'impression");
  }

  const bits = [];
  ajouterBits(bits, 0b0100, 4);
  ajouterBits(bits, octets.length, 8);
  octets.forEach((octet) => ajouterBits(bits, octet, 8));
  const capaciteBits = CAPACITE_QR_OCTETS * 8;
  ajouterBits(bits, 0, Math.min(4, capaciteBits - bits.length));
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const donnees = [];
  for (let index = 0; index < bits.length; index += 8) {
    donnees.push(bits.slice(index, index + 8).reduce((valeur, bit) => (valeur << 1) | bit, 0));
  }
  for (let index = 0; donnees.length < CAPACITE_QR_OCTETS; index += 1) {
    donnees.push(index % 2 === 0 ? 0xec : 0x11);
  }

  const correction = calculerCorrectionReedSolomon(donnees, CORRECTION_QR_OCTETS);
  return placerDonneesQr([...donnees, ...correction]);
}

function ajouterBits(bits, valeur, longueur) {
  for (let index = longueur - 1; index >= 0; index -= 1) {
    bits.push((valeur >>> index) & 1);
  }
}

function calculerCorrectionReedSolomon(donnees, longueur) {
  const exponentielles = new Array(512).fill(0);
  const logarithmes = new Array(256).fill(0);
  let valeur = 1;
  for (let index = 0; index < 255; index += 1) {
    exponentielles[index] = valeur;
    logarithmes[valeur] = index;
    valeur <<= 1;
    if (valeur & 0x100) {
      valeur ^= 0x11d;
    }
  }
  for (let index = 255; index < exponentielles.length; index += 1) {
    exponentielles[index] = exponentielles[index - 255];
  }
  const multiplier = (a, b) => (a === 0 || b === 0 ? 0 : exponentielles[logarithmes[a] + logarithmes[b]]);

  let generateur = [1];
  for (let index = 0; index < longueur; index += 1) {
    const suivant = new Array(generateur.length + 1).fill(0);
    generateur.forEach((coefficient, position) => {
      suivant[position] ^= coefficient;
      suivant[position + 1] ^= multiplier(coefficient, exponentielles[index]);
    });
    generateur = suivant;
  }

  const reste = new Array(longueur).fill(0);
  donnees.forEach((octet) => {
    const facteur = octet ^ reste[0];
    reste.shift();
    reste.push(0);
    for (let index = 0; index < reste.length; index += 1) {
      reste[index] ^= multiplier(generateur[index + 1], facteur);
    }
  });
  return reste;
}

function placerDonneesQr(octets) {
  const modules = Array.from({ length: TAILLE_QR }, () => Array(TAILLE_QR).fill(false));
  const fonctions = Array.from({ length: TAILLE_QR }, () => Array(TAILLE_QR).fill(false));
  const definirFonction = (x, y, sombre) => {
    if (x < 0 || y < 0 || x >= TAILLE_QR || y >= TAILLE_QR) {
      return;
    }
    modules[y][x] = sombre;
    fonctions[y][x] = true;
  };

  for (let index = 0; index < TAILLE_QR; index += 1) {
    definirFonction(6, index, index % 2 === 0);
    definirFonction(index, 6, index % 2 === 0);
  }
  [[3, 3], [TAILLE_QR - 4, 3], [3, TAILLE_QR - 4]].forEach(([centreX, centreY]) => {
    for (let y = -4; y <= 4; y += 1) {
      for (let x = -4; x <= 4; x += 1) {
        const distance = Math.max(Math.abs(x), Math.abs(y));
        definirFonction(centreX + x, centreY + y, distance !== 2 && distance !== 4);
      }
    }
  });
  dessinerAlignementQr(definirFonction, 22, 22);
  dessinerFormatQr(definirFonction);

  const bits = [];
  octets.forEach((octet) => ajouterBits(bits, octet, 8));
  let indexBit = 0;
  for (let droite = TAILLE_QR - 1; droite >= 1; droite -= 2) {
    if (droite === 6) {
      droite -= 1;
    }
    for (let vertical = 0; vertical < TAILLE_QR; vertical += 1) {
      const y = ((droite + 1) & 2) === 0 ? TAILLE_QR - 1 - vertical : vertical;
      for (let decalage = 0; decalage < 2; decalage += 1) {
        const x = droite - decalage;
        if (fonctions[y][x]) {
          continue;
        }
        const bit = indexBit < bits.length ? bits[indexBit] === 1 : false;
        modules[y][x] = bit !== ((x + y) % 2 === 0);
        indexBit += 1;
      }
    }
  }
  return modules;
}

function dessinerAlignementQr(definirFonction, centreX, centreY) {
  for (let y = -2; y <= 2; y += 1) {
    for (let x = -2; x <= 2; x += 1) {
      definirFonction(centreX + x, centreY + y, Math.max(Math.abs(x), Math.abs(y)) !== 1);
    }
  }
}

function dessinerFormatQr(definirFonction) {
  const donneesFormat = 0b01000;
  let reste = donneesFormat;
  for (let index = 0; index < 10; index += 1) {
    reste = (reste << 1) ^ ((reste >>> 9) * 0x537);
  }
  const bits = ((donneesFormat << 10) | reste) ^ 0x5412;
  const obtenirBit = (index) => ((bits >>> index) & 1) !== 0;

  for (let index = 0; index <= 5; index += 1) {
    definirFonction(8, index, obtenirBit(index));
  }
  definirFonction(8, 7, obtenirBit(6));
  definirFonction(8, 8, obtenirBit(7));
  definirFonction(7, 8, obtenirBit(8));
  for (let index = 9; index < 15; index += 1) {
    definirFonction(14 - index, 8, obtenirBit(index));
  }
  for (let index = 0; index < 8; index += 1) {
    definirFonction(TAILLE_QR - 1 - index, 8, obtenirBit(index));
  }
  for (let index = 8; index < 15; index += 1) {
    definirFonction(8, TAILLE_QR - 15 + index, obtenirBit(index));
  }
  definirFonction(8, TAILLE_QR - 8, true);
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
