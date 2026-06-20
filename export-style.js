export const VERSION_EXPORT_STYLE = 2;

const CHAMPS_COMMUNS = [
  "theme",
  "modele",
  "couleur1",
  "couleurRuban",
  "bordure",
  "bordureHorizontale",
  "policeTitres",
  "policeArtiste",
  "tailleTitres",
  "tailleArtiste",
  "styleTitres",
  "styleArtiste",
  "guillemetsTitres",
  "decalageRetro",
  "irregulariteCaracteres",
  "largeurEtiquette",
  "hauteurEtiquette",
];

const CHAMPS_FONDS_CLASSIQUES = ["couleur2", "couleur3"];
const CHAMPS_RUBAN = ["largeurRuban", "hauteurRuban"];
const CHAMPS_BANDE_CENTRALE = ["hauteurBande"];
const CHAMPS_CELESTE = [
  "couleurFondModerne",
  "couleurBandeGauche",
  "couleurBandeDroite",
  "tailleBandeGauche",
  "angleBandeGauche",
  "tailleBandeDroite",
  "angleBandeDroite",
];
const CHAMPS_TRAITS_LEON = ["epaisseurTraitsLEON", "positionTraitsLEON", "ecartTraitsLEON"];

function copierChamps(cible, source, champs) {
  champs.forEach((champ) => {
    if (Object.prototype.hasOwnProperty.call(source, champ)) {
      cible[champ] = source[champ];
    }
  });
}

function arrondirNombres(valeur) {
  if (typeof valeur === "number" && Number.isFinite(valeur)) {
    return Number(valeur.toFixed(6));
  }
  if (Array.isArray(valeur)) {
    return valeur.map(arrondirNombres);
  }
  if (valeur && typeof valeur === "object") {
    return Object.fromEntries(
      Object.entries(valeur).map(([cle, contenu]) => [cle, arrondirNombres(contenu)]),
    );
  }
  return valeur;
}

function ajouterCouleursTexteManuelles(exportNettoye, reglages) {
  [
    ["couleurTitreFaceAManuelle", "couleurTitreFaceA"],
    ["couleurTitreFaceBManuelle", "couleurTitreFaceB"],
    ["couleurArtisteManuelle", "couleurArtiste"],
  ].forEach(([indicateur, couleur]) => {
    if (reglages[indicateur]) {
      exportNettoye[indicateur] = true;
      exportNettoye[couleur] = reglages[couleur];
    }
  });
}

function ajouterDecorActif(exportNettoye, reglages) {
  const motifFondActif = (
    reglages.motifFond !== false
    && reglages.motifType !== "aucun"
    && Number(reglages.motif) > 0
  );
  if (motifFondActif) {
    copierChamps(exportNettoye, reglages, [
      "motifType",
      "couleurMotif",
      "motif",
      "angleMotif",
      "motifFond",
    ]);
  }

  const motifRubanActif = (
    reglages.motifRuban === true
    && reglages.motifRubanType !== "aucun"
    && Number(reglages.opaciteMotifRuban) > 0
  );
  if (motifRubanActif) {
    copierChamps(exportNettoye, reglages, [
      "motifRuban",
      "motifRubanType",
      "couleurMotifRuban",
      "opaciteMotifRuban",
      "angleMotifRuban",
    ]);
  }

  const motifSecondaireActif = (
    reglages.afficherTraitsModernes === true
    && Number(reglages.opaciteTraitsModernes) > 0
    && (reglages.motifSecondaireFond === true || reglages.motifSecondaireRuban === true)
  );
  if (motifSecondaireActif) {
    copierChamps(exportNettoye, reglages, [
      "afficherTraitsModernes",
      "motifTraitsModernes",
      "motifSecondaireFond",
      "motifSecondaireRuban",
      "couleurTraitsModernes",
      "opaciteTraitsModernes",
      "angleTraitsModernes",
    ]);
  }

  const vignettageActif = (
    reglages.modeVignette !== "aucun"
    && Number(reglages.vignette) > 0
    && Number(reglages.intensite) > 0
  );
  if (vignettageActif) {
    copierChamps(exportNettoye, reglages, [
      "modeVignette",
      "couleurVignette",
      "vignette",
      "intensite",
      "angle",
    ]);
  }
}

function ajouterMarquesActives(exportNettoye, reglages) {
  if (reglages.afficherMarques !== true) {
    return;
  }

  exportNettoye.afficherMarques = true;
  exportNettoye.synchroniserMarques = reglages.synchroniserMarques !== false;
  copierChamps(exportNettoye, reglages, ["presetMarques"]);

  if (exportNettoye.synchroniserMarques) {
    copierChamps(exportNettoye, reglages, [
      "marqueGauche",
      "marqueDroite",
      "couleurMarques",
      "policeMarques",
      "tailleMarques",
      "angleMarques",
      "positionMarques",
      "hauteurMarques",
    ]);
    if (reglages.modele === "MANU") {
      copierChamps(exportNettoye, reglages, ["formePastille", "diametrePastille"]);
    }
  } else {
    copierChamps(exportNettoye, reglages, [
      "marqueGaucheTexte",
      "marqueDroiteTexte",
      "couleurMarqueGauche",
      "couleurMarqueDroite",
      "policeMarqueGauche",
      "policeMarqueDroite",
      "styleMarqueGauche",
      "styleMarqueDroite",
      "tailleMarqueGauche",
      "tailleMarqueDroite",
      "angleMarqueGauche",
      "angleMarqueDroite",
      "positionMarqueGauche",
      "positionMarqueDroite",
      "hauteurMarqueGauche",
      "hauteurMarqueDroite",
    ]);
    if (reglages.modele === "MANU") {
      copierChamps(exportNettoye, reglages, [
        "formePastilleGauche",
        "formePastilleDroite",
        "diametrePastilleGauche",
        "diametrePastilleDroite",
      ]);
    }
  }

  if (reglages.modele === "JEAN" && reglages.marquesVerticalesJEAN) {
    exportNettoye.marquesVerticalesJEAN = true;
  }
  if (reglages.limiterMarquesBandeSurprise) {
    exportNettoye.limiterMarquesBandeSurprise = true;
  }
}

export function preparerReglagesPourExport(reglages) {
  const exportNettoye = { versionExport: VERSION_EXPORT_STYLE };
  const modele = reglages.modele;

  copierChamps(exportNettoye, reglages, CHAMPS_COMMUNS);

  if (modele === "CELESTE") {
    copierChamps(exportNettoye, reglages, CHAMPS_CELESTE);
  } else {
    copierChamps(exportNettoye, reglages, CHAMPS_FONDS_CLASSIQUES);
  }

  if (!["LEON", "JEAN"].includes(modele)) {
    copierChamps(exportNettoye, reglages, CHAMPS_RUBAN);
  }
  if (["ALICE", "MARTIN", "JUJU", "MANU"].includes(modele)) {
    copierChamps(exportNettoye, reglages, CHAMPS_BANDE_CENTRALE);
  }
  if (modele !== "JEAN") {
    copierChamps(exportNettoye, reglages, ["bordureVerticale", "arrondiInterieurBordure"]);
  }
  if (["LEON", "JEAN"].includes(modele)) {
    copierChamps(exportNettoye, reglages, CHAMPS_TRAITS_LEON);
  }
  if (modele === "JEAN") {
    copierChamps(exportNettoye, reglages, ["tailleTrianglesJEAN"]);
  }

  ajouterCouleursTexteManuelles(exportNettoye, reglages);
  ajouterDecorActif(exportNettoye, reglages);
  ajouterMarquesActives(exportNettoye, reglages);

  return arrondirNombres(exportNettoye);
}

export function initialiserOptionsAbsentesPourImport(reglages, donnees) {
  if (Number(donnees?.versionExport) < VERSION_EXPORT_STYLE) {
    return reglages;
  }
  return Object.assign(reglages, {
    motifType: "aucun",
    motifFond: false,
    motifRuban: false,
    motifRubanType: "aucun",
    afficherTraitsModernes: false,
    motifSecondaireFond: false,
    motifSecondaireRuban: false,
    modeVignette: "aucun",
    afficherMarques: false,
    synchroniserMarques: true,
    marquesVerticalesJEAN: false,
    limiterMarquesBandeSurprise: false,
  });
}
