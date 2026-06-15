import { COLONNES_CSV } from "./reglages.js";

export function parserCsvVinyles(texte) {
  const lignes = parserCsv(texte);
  if (!lignes.length) {
    return [];
  }

  const entetes = lignes[0].map(normaliserNomColonne);
  const contientEntetes = entetes.some((entete) => ["artiste", "titre_face_a", "titre_face_b"].includes(entete));
  const indexColonnes = contientEntetes
    ? COLONNES_CSV.map((colonne, index) => entetes.indexOf(colonne) >= 0 ? entetes.indexOf(colonne) : index)
    : [0, 1, 2];
  const lignesDonnees = contientEntetes ? lignes.slice(1) : lignes;

  return lignesDonnees
    .map((ligne, index) => normaliserVinyleCsv(ligne, indexColonnes, index))
    .filter((vinyle) => vinyle.artiste || vinyle.titre_face_a || vinyle.titre_face_b);
}

function normaliserNomColonne(nom) {
  const cle = String(nom || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  if (["a", "artist", "artiste"].includes(cle)) {
    return "artiste";
  }
  if (["b", "face_a", "titre_face_a", "title_face_a"].includes(cle)) {
    return "titre_face_a";
  }
  if (["c", "face_b", "face_c", "titre_face_b", "titre_face_c", "title_face_b"].includes(cle)) {
    return "titre_face_b";
  }
  return cle;
}

function normaliserVinyleCsv(ligne, indexColonnes, index) {
  const position = String(index).padStart(index < 100 ? 2 : 3, "0");
  return {
    emplacement: "jukebox",
    position_jukebox: position,
    selection_face_a: String(index + 100),
    selection_face_b: String(index + 200),
    artiste: String(ligne[indexColonnes[0]] || "").trim(),
    titre_face_a: String(ligne[indexColonnes[1]] || "").trim(),
    titre_face_b: String(ligne[indexColonnes[2]] || "").trim(),
  };
}

function parserCsv(texte) {
  const separateur = detecterSeparateurCsv(texte);
  const lignes = [];
  let champ = "";
  let ligne = [];
  let dansGuillemets = false;
  const contenu = String(texte || "").replace(/^\uFEFF/, "");

  for (let index = 0; index < contenu.length; index += 1) {
    const caractere = contenu[index];
    const suivant = contenu[index + 1];
    if (caractere === '"') {
      if (dansGuillemets && suivant === '"') {
        champ += '"';
        index += 1;
      } else {
        dansGuillemets = !dansGuillemets;
      }
    } else if (caractere === separateur && !dansGuillemets) {
      ligne.push(champ);
      champ = "";
    } else if ((caractere === "\n" || caractere === "\r") && !dansGuillemets) {
      if (caractere === "\r" && suivant === "\n") {
        index += 1;
      }
      ligne.push(champ);
      if (ligne.some((cellule) => cellule.trim())) {
        lignes.push(ligne);
      }
      ligne = [];
      champ = "";
    } else {
      champ += caractere;
    }
  }

  ligne.push(champ);
  if (ligne.some((cellule) => cellule.trim())) {
    lignes.push(ligne);
  }
  return lignes;
}

function detecterSeparateurCsv(texte) {
  const premiereLigne = String(texte || "").split(/\r?\n/).find((ligne) => ligne.trim()) || "";
  const candidats = [";", ",", "\t"];
  return candidats
    .map((separateur) => [separateur, premiereLigne.split(separateur).length])
    .sort((a, b) => b[1] - a[1])[0][0];
}

export function serialiserCsvVinyles(vinyles) {
  const lignes = [COLONNES_CSV, ...vinyles.map((vinyle) => [
    vinyle.artiste || "",
    vinyle.titre_face_a || "",
    vinyle.titre_face_b || "",
  ])];
  return `${lignes.map((ligne) => ligne.map(echapperCelluleCsv).join(";")).join("\n")}\n`;
}

function echapperCelluleCsv(valeur) {
  const texte = String(valeur ?? "");
  return /[";\n\r]/.test(texte) ? `"${texte.replace(/"/g, '""')}"` : texte;
}
