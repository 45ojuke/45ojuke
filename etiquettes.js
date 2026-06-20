import { effetPoliceDepuisFont, famillePolice, normaliserStylePolice, poidsPolice } from "./polices.js";

window.PX_PAR_MM = window.PX_PAR_MM || 12;

const VALEURS_CELESTE_DEFAUT = {
  couleurFondModerne: "#ffffff",
  couleurBandeDroite: "#6d28d9",
  tailleBandeDroite: 11,
  angleBandeDroite: -35,
  couleurBandeGauche: "#f472b6",
  tailleBandeGauche: 8,
  angleBandeGauche: -35,
};

export function dessinerEtiquette(ligne, reglages) {
  const largeur = reglages.largeurEtiquette * window.PX_PAR_MM;
  const hauteur = reglages.hauteurEtiquette * window.PX_PAR_MM;
  const canvas = document.createElement("canvas");
  canvas.width = largeur;
  canvas.height = hauteur;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const bordure = (reglages.bordure / 50) * window.PX_PAR_MM;
  const rubanH = hauteur * reglages.hauteurRuban / 100;
  const rubanW = largeur * reglages.largeurRuban / 100;
  const rubanX = (largeur - rubanW) / 2;
  const rubanY = (hauteur - rubanH) / 2;
  const rubanVisible = rubanW > 0.5 && rubanH > 0.5;
  const bandeH = hauteur * reglages.hauteurBande / 100;
  const bandeY = (hauteur - bandeH) / 2;

  if (reglages.modele === "CELESTE") {
    dessinerEtiquetteModerne(ctx, ligne, reglages, largeur, hauteur, bordure, rubanX, rubanY, rubanW, rubanH);
    return canvas;
  }

  if (reglages.modele === "LEON") {
    dessinerEtiquetteLeon(ctx, ligne, reglages, largeur, hauteur, bordure);
    return canvas;
  }

  if (reglages.modele === "JEAN") {
    dessinerEtiquetteJean(ctx, ligne, reglages, largeur, hauteur, bordure);
    return canvas;
  }

  if (reglages.modele === "MANU") {
    dessinerEtiquetteManu(ctx, ligne, reglages, largeur, hauteur, bordure, rubanX, rubanY, rubanW, rubanH, bandeH, bandeY);
    return canvas;
  }

  ctx.fillStyle = reglages.couleur2;
  ctx.fillRect(0, 0, largeur, hauteur / 2);
  ctx.fillStyle = reglages.couleur3;
  ctx.fillRect(0, hauteur / 2, largeur, hauteur / 2);
  dessinerMotif(ctx, reglages, largeur, hauteur);
  dessinerTraitsModernes(ctx, reglages, largeur, hauteur);

  if (reglages.modeVignette === "fond") {
    dessinerVignette(ctx, reglages, largeur, hauteur);
  }

  if (bandeH > 0) {
    const margeBande = reglages.modele === "JEAN" || reglages.bordureVerticale === false ? 0 : bordure / 2;
    ctx.fillStyle = reglages.couleur1;
    ctx.fillRect(margeBande, bandeY, largeur - margeBande * 2, bandeH);
  }

  let traitRuban = 0;
  if (rubanVisible) {
    if (reglages.modele === "ALICE") {
      traitRuban = Math.max(2, rubanH * 0.075);
      ctx.fillStyle = reglages.couleurRuban;
      ctx.fillRect(rubanX, rubanY, rubanW, rubanH);
      dessinerMotifRuban(ctx, reglages, rubanX, rubanY, rubanW, rubanH);
      dessinerMotifSecondaireRuban(ctx, reglages, rubanX, rubanY, rubanW, rubanH);
      ctx.strokeStyle = reglages.couleur1;
      ctx.lineWidth = traitRuban;
      ctx.strokeRect(
        rubanX + ctx.lineWidth / 2,
        rubanY + ctx.lineWidth / 2,
        rubanW - ctx.lineWidth,
        rubanH - ctx.lineWidth,
      );
      dessinerFlechesAlice(ctx, reglages, largeur, rubanX, rubanY, rubanW, rubanH);
    } else if (reglages.modele === "JUJU") {
      traitRuban = dessinerRubanSimple(ctx, reglages, rubanX, rubanY, rubanW, rubanH);
    } else {
      dessinerRubanMartin(ctx, reglages, rubanX, rubanY, rubanW, rubanH);
    }
  }

  if (reglages.modeVignette === "global") {
    dessinerVignette(ctx, reglages, largeur, hauteur);
  }

  if (bordure > 0) {
    dessinerBordureInterieureArrondie(
      ctx,
      0,
      0,
      largeur,
      hauteur,
      Math.max(1, bordure),
      reglages.couleur1,
      reglages.arrondiInterieurBordure ? Math.min(hauteur * 0.16, largeur * 0.035) : 0,
      reglages,
    );
  }

  if (rubanVisible && reglages.afficherMarques) {
    dessinerMarques(ctx, reglages, largeur, hauteur, rubanY, rubanH, bandeH);
  }

  dessinerTitresCentres(ctx, ligne, reglages, largeur, hauteur, {
    bordure,
    rubanY,
    rubanH,
    traitRuban,
    largeurTitre: largeur * 0.72,
  });
  dessinerArtiste(
    ctx,
    ligne.artiste,
    largeur / 2,
    hauteur / 2,
    rubanVisible ? rubanW * (reglages.modele === "MARTIN" ? 0.72 : 0.7) : largeur * 0.58,
    reglages,
    rubanVisible ? reglages.couleurRuban : (bandeH > 0 ? reglages.couleur1 : reglages.couleur2),
  );

  return canvas;
}

function centreEntreTraits(debut, fin) {
  return debut + (fin - debut) / 2;
}

function calculerZonesTitres(hauteur, bordure, rubanY, rubanH, traitRuban = 0) {
  const bordInterieur = Math.max(0, bordure);
  const bordRubanHaut = rubanY - traitRuban / 2;
  const bordRubanBas = rubanY + rubanH + traitRuban / 2;
  return {
    haut: centreEntreTraits(bordInterieur, bordRubanHaut),
    bas: centreEntreTraits(bordRubanBas, hauteur - bordInterieur),
  };
}

function calculerZonesTitresDansRuban(hauteur, bordure, rubanY, rubanH, traitRuban = 0, tailleTitres = 22) {
  const hautRuban = Math.max(bordure, rubanY + traitRuban / 2);
  const basRuban = Math.min(hauteur - bordure, rubanY + rubanH - traitRuban / 2);
  const centre = hauteur / 2;
  const reserveArtiste = Math.max(tailleTitres * 1.45, rubanH * 0.18);
  const limiteHaute = centre - reserveArtiste / 2;
  const limiteBasse = centre + reserveArtiste / 2;
  if (limiteHaute - hautRuban < tailleTitres * 0.85 || basRuban - limiteBasse < tailleTitres * 0.85) {
    return calculerZonesTitres(hauteur, bordure, rubanY, rubanH, traitRuban);
  }
  return {
    haut: centreEntreTraits(hautRuban, limiteHaute),
    bas: centreEntreTraits(limiteBasse, basRuban),
  };
}

function dessinerTitresCentres(ctx, ligne, reglages, largeur, hauteur, geometrie) {
  const tailleTitres = 22 * reglages.tailleTitres / 100;
  const zonesTitres = geometrie.centrerDansRuban
    ? calculerZonesTitresDansRuban(
      hauteur,
      geometrie.bordure,
      geometrie.rubanY,
      geometrie.rubanH,
      geometrie.traitRuban,
      tailleTitres,
    )
    : calculerZonesTitres(
      hauteur,
      geometrie.bordure,
      geometrie.rubanY,
      geometrie.rubanH,
      geometrie.traitRuban,
    );
  dessinerTitre(
    ctx,
    ligne.titreA,
    largeur / 2,
    zonesTitres.haut,
    geometrie.largeurTitre,
    reglages,
    reglages.couleur2,
    reglages.couleurTitreFaceA,
    reglages.couleurTitreFaceAManuelle,
  );
  dessinerTitre(
    ctx,
    ligne.titreB,
    largeur / 2,
    zonesTitres.bas,
    geometrie.largeurTitre,
    reglages,
    reglages.couleur3,
    reglages.couleurTitreFaceB,
    reglages.couleurTitreFaceBManuelle,
  );
}

function largeurTexteModerne(reglages, largeur, hauteur, y, largeurMax) {
  const marge = largeur * 0.035;
  const gauche = limiteBandeModerneAuY("gauche", reglages.tailleBandeGauche, reglages.angleBandeGauche, largeur, hauteur, y);
  const droite = limiteBandeModerneAuY("droite", reglages.tailleBandeDroite, reglages.angleBandeDroite, largeur, hauteur, y);
  const centre = largeur / 2;
  const disponible = Math.max(largeur * 0.28, Math.min(centre - gauche - marge, droite - centre - marge) * 2);
  return Math.min(largeurMax, disponible);
}

function limiteBandeModerneAuY(cote, taillePourcent, angleDegres, largeur, hauteur, y) {
  const taille = limiterNombre(Number(taillePourcent) || 0, 0, 60) / 100;
  if (taille <= 0) {
    return cote === "gauche" ? 0 : largeur;
  }
  const base = largeur * taille;
  const angle = limiterNombre(Number(angleDegres) || 0, -80, 80);
  const inclinaison = inclinaisonBandeModerne(base, angle, hauteur);
  const progression = hauteur > 0 ? limiterNombre(y / hauteur, 0, 1) : 0.5;
  if (cote === "gauche") {
    const haut = limiterNombre(base + inclinaison, 0, largeur);
    const bas = limiterNombre(base - inclinaison, 0, largeur);
    return haut + (bas - haut) * progression;
  }
  const haut = limiterNombre(largeur - base + inclinaison, 0, largeur);
  const bas = limiterNombre(largeur - base - inclinaison, 0, largeur);
  return haut + (bas - haut) * progression;
}

function dessinerEtiquetteModerne(ctx, ligne, reglages, largeur, hauteur, bordure, rubanX, rubanY, rubanW, rubanH) {
  ctx.fillStyle = reglages.couleurFondModerne || VALEURS_CELESTE_DEFAUT.couleurFondModerne;
  ctx.fillRect(0, 0, largeur, hauteur);

  dessinerMotif(ctx, reglages, largeur, hauteur);

  ctx.save();
  dessinerBandeModerne(
    ctx,
    "droite",
    reglages.couleurBandeDroite || VALEURS_CELESTE_DEFAUT.couleurBandeDroite,
    reglages.tailleBandeDroite ?? VALEURS_CELESTE_DEFAUT.tailleBandeDroite,
    reglages.angleBandeDroite ?? VALEURS_CELESTE_DEFAUT.angleBandeDroite,
    largeur,
    hauteur,
    0.9,
  );
  dessinerBandeModerne(
    ctx,
    "gauche",
    reglages.couleurBandeGauche || VALEURS_CELESTE_DEFAUT.couleurBandeGauche,
    reglages.tailleBandeGauche ?? VALEURS_CELESTE_DEFAUT.tailleBandeGauche,
    reglages.angleBandeGauche ?? VALEURS_CELESTE_DEFAUT.angleBandeGauche,
    largeur,
    hauteur,
    0.96,
  );

  dessinerTraitsModernes(ctx, reglages, largeur, hauteur);
  ctx.restore();

  if (reglages.modeVignette === "fond" || reglages.modeVignette === "global") {
    dessinerVignette(ctx, reglages, largeur, hauteur);
  }

  let traitRuban = 0;
  if (rubanW > 0.5 && rubanH > 0.5) {
    const rayon = reglages.arrondiInterieurBordure ? Math.min(rubanH * 0.46, largeur * 0.035) : 0;
    ctx.save();
    ctx.shadowColor = convertirHexEnRgba(reglages.couleur1, 0.16);
    ctx.shadowBlur = Math.max(6, hauteur * 0.045);
    ctx.shadowOffsetY = Math.max(2, hauteur * 0.012);
    ctx.fillStyle = convertirHexEnRgba(reglages.couleurRuban, 0.82);
    tracerRectangleArrondi(ctx, rubanX, rubanY, rubanW, rubanH, rayon);
    ctx.fill();
    ctx.restore();
    dessinerMotifRuban(ctx, reglages, rubanX, rubanY, rubanW, rubanH, rayon);
    dessinerMotifSecondaireRuban(ctx, reglages, rubanX, rubanY, rubanW, rubanH, rayon);

    ctx.strokeStyle = convertirHexEnRgba(reglages.couleur1, 0.78);
    traitRuban = Math.max(2, hauteur * 0.012);
    ctx.lineWidth = traitRuban;
    tracerRectangleArrondi(ctx, rubanX, rubanY, rubanW, rubanH, rayon);
    ctx.stroke();

    ctx.fillStyle = convertirHexEnRgba(reglages.couleur1, 0.86);
    ctx.fillRect(rubanX + rubanW * 0.08, rubanY + rubanH * 0.18, Math.max(4, rubanW * 0.018), rubanH * 0.64);
    ctx.fillRect(rubanX + rubanW * 0.92, rubanY + rubanH * 0.18, Math.max(4, rubanW * 0.018), rubanH * 0.64);
  }

  const traitBordure = bordure > 0 ? Math.max(1, bordure * 0.64) : 0;
  if (bordure > 0) {
    dessinerBordureInterieureArrondie(
      ctx,
      0,
      0,
      largeur,
      hauteur,
      traitBordure,
      convertirHexEnRgba(reglages.couleur1, 0.88),
      reglages.arrondiInterieurBordure ? Math.min(hauteur * 0.16, largeur * 0.035) : 0,
      reglages,
    );
  }

  if (reglages.afficherMarques) {
    dessinerMarquesModernes(ctx, reglages, largeur, hauteur);
  }

  const zonesTitres = calculerZonesTitres(hauteur, traitBordure, rubanY, rubanH, traitRuban);
  const largeurTitre = Math.min(
    largeurTexteModerne(reglages, largeur, hauteur, zonesTitres.haut, largeur * 0.56),
    largeurTexteModerne(reglages, largeur, hauteur, zonesTitres.bas, largeur * 0.56),
  );
  dessinerTitresCentres(ctx, ligne, reglages, largeur, hauteur, {
    bordure: traitBordure,
    rubanY,
    rubanH,
    traitRuban,
    largeurTitre,
  });
  dessinerArtiste(
    ctx,
    ligne.artiste,
    largeur / 2,
    hauteur / 2,
    Math.min(rubanW * 0.62, largeurTexteModerne(reglages, largeur, hauteur, hauteur / 2, largeur * 0.66)),
    reglages,
    rubanW > 0.5 && rubanH > 0.5 ? reglages.couleurRuban : (reglages.couleurFondModerne || VALEURS_CELESTE_DEFAUT.couleurFondModerne),
  );

}

function dessinerEtiquetteManu(ctx, ligne, reglages, largeur, hauteur, bordure, rubanX, rubanY, rubanW, rubanH, bandeH, bandeY) {
  const traitBordure = bordure > 0 ? Math.max(1, bordure) : 0;
  const diametreGauche = diametrePastilleManu(reglages, "gauche", hauteur);
  const diametreDroite = diametrePastilleManu(reglages, "droite", hauteur);
  const reservePastilles = Math.max(diametreGauche, diametreDroite) * 1.08 + Math.max(4, largeur * 0.008);
  const rubanWManu = Math.min(rubanW, Math.max(1, largeur - reservePastilles * 2));
  const rubanXManu = (largeur - rubanWManu) / 2;
  const traitRuban = rubanWManu > 0.5 && rubanH > 0.5 ? Math.max(2, rubanH * 0.075) : 0;
  const bandeVisibleH = Math.max(0, bandeH);

  ctx.fillStyle = reglages.couleur2;
  ctx.fillRect(0, 0, largeur, hauteur / 2);
  ctx.fillStyle = reglages.couleur3;
  ctx.fillRect(0, hauteur / 2, largeur, hauteur / 2);

  dessinerMotif(ctx, reglages, largeur, hauteur);
  dessinerTraitsModernes(ctx, reglages, largeur, hauteur);

  if (bandeVisibleH > 0) {
    ctx.fillStyle = reglages.couleur1;
    ctx.fillRect(0, bandeY, largeur, bandeVisibleH);
  }

  if (rubanWManu > 0.5 && rubanH > 0.5) {
    const rayon = reglages.arrondiInterieurBordure ? Math.min(rubanH * 0.25, largeur * 0.02) : 0;
    ctx.fillStyle = reglages.couleurRuban;
    tracerRectangleArrondi(ctx, rubanXManu, rubanY, rubanWManu, rubanH, rayon);
    ctx.fill();
    dessinerMotifRuban(ctx, reglages, rubanXManu, rubanY, rubanWManu, rubanH, rayon);
    dessinerMotifSecondaireRuban(ctx, reglages, rubanXManu, rubanY, rubanWManu, rubanH, rayon);
    ctx.strokeStyle = reglages.couleur1;
    ctx.lineWidth = traitRuban;
    tracerRectangleArrondi(
      ctx,
      rubanXManu + traitRuban / 2,
      rubanY + traitRuban / 2,
      Math.max(0, rubanWManu - traitRuban),
      Math.max(0, rubanH - traitRuban),
      rayon,
    );
    ctx.stroke();
  }

  if (reglages.modeVignette === "fond" || reglages.modeVignette === "global") {
    dessinerVignette(ctx, reglages, largeur, hauteur);
  }

  if (traitBordure > 0) {
    dessinerBordureInterieureArrondie(
      ctx,
      0,
      0,
      largeur,
      hauteur,
      traitBordure,
      reglages.couleur1,
      reglages.arrondiInterieurBordure ? Math.min(hauteur * 0.1, largeur * 0.025) : 0,
      reglages,
    );
  }

  if (reglages.afficherMarques) {
    dessinerMarquesManu(ctx, reglages, largeur, hauteur, rubanXManu, rubanWManu);
  }

  dessinerTitresCentres(ctx, ligne, reglages, largeur, hauteur, {
    bordure: traitBordure,
    rubanY,
    rubanH,
    traitRuban,
    largeurTitre: Math.max(largeur * 0.32, rubanWManu * 0.82),
  });
  dessinerArtiste(
    ctx,
    ligne.artiste,
    largeur / 2,
    hauteur / 2,
    rubanWManu * 0.74,
    reglages,
    rubanWManu > 0.5 && rubanH > 0.5 ? reglages.couleurRuban : (bandeVisibleH > 0 ? reglages.couleur1 : reglages.couleur2),
  );

}

function dessinerEtiquetteLeon(ctx, ligne, reglages, largeur, hauteur, bordure) {
  const traitBordure = bordure > 0 ? Math.max(1, bordure) : 0;
  const fondHaut = reglages.couleur2 || "#efe3c3";
  const fondBas = reglages.couleur3 || fondHaut;
  const fondArtiste = reglages.couleurRuban || fondHaut;
  const centreTraits = hauteur * limiterNombre(Number(reglages.positionTraitsLEON) || 50, 25, 75) / 100;
  const ecartTraits = hauteur * limiterNombre(Number(reglages.ecartTraitsLEON) || 24, 10, 42) / 100;
  const epaisseurTraits = Math.max(1, Number(reglages.epaisseurTraitsLEON) || 3);
  const yHaut = limiterNombre(centreTraits - ecartTraits / 2, traitBordure + epaisseurTraits, hauteur - traitBordure - epaisseurTraits);
  const yBas = limiterNombre(centreTraits + ecartTraits / 2, traitBordure + epaisseurTraits, hauteur - traitBordure - epaisseurTraits);

  ctx.fillStyle = fondHaut;
  ctx.fillRect(0, 0, largeur, yHaut);
  ctx.fillStyle = fondArtiste;
  ctx.fillRect(0, yHaut, largeur, yBas - yHaut);
  ctx.fillStyle = fondBas;
  ctx.fillRect(0, yBas, largeur, hauteur - yBas);

  dessinerMotifZone(ctx, reglages, 0, 0, largeur, yHaut);
  dessinerMotifZone(ctx, reglages, 0, yBas, largeur, hauteur - yBas);
  dessinerMotifSecondaireZone(ctx, reglages, 0, 0, largeur, yHaut);
  dessinerMotifSecondaireZone(ctx, reglages, 0, yBas, largeur, hauteur - yBas);
  dessinerMotifRuban(ctx, reglages, 0, yHaut, largeur, yBas - yHaut);
  dessinerMotifSecondaireRuban(ctx, reglages, 0, yHaut, largeur, yBas - yHaut);
  if (reglages.modeVignette === "fond" || reglages.modeVignette === "global") {
    dessinerVignette(ctx, reglages, largeur, hauteur);
  }

  if (traitBordure > 0) {
    dessinerBordureInterieureArrondie(
      ctx,
      0,
      0,
      largeur,
      hauteur,
      traitBordure,
      convertirHexEnRgba(reglages.couleur1, 0.9),
      reglages.arrondiInterieurBordure ? Math.min(hauteur * 0.16, largeur * 0.035) : 0,
      reglages,
    );
  }

  ctx.save();
  ctx.strokeStyle = convertirHexEnRgba(reglages.couleur1, 0.86);
  ctx.lineWidth = epaisseurTraits;
  ctx.beginPath();
  ctx.moveTo(0, yHaut);
  ctx.lineTo(largeur, yHaut);
  ctx.moveTo(0, yBas);
  ctx.lineTo(largeur, yBas);
  ctx.stroke();
  ctx.restore();

  if (reglages.afficherMarques) {
    dessinerMarques(ctx, reglages, largeur, hauteur, yHaut, yBas - yHaut, yBas - yHaut);
  }

  const margeX = Math.max(largeur * 0.09, traitBordure + largeur * 0.035);
  const largeurTexte = largeur - margeX * 2;
  dessinerTitre(
    ctx,
    ligne.titreA,
    largeur / 2,
    centreEntreTraits(traitBordure, yHaut),
    largeurTexte,
    reglages,
    fondHaut,
    reglages.couleurTitreFaceA,
    reglages.couleurTitreFaceAManuelle,
  );
  dessinerTitre(
    ctx,
    ligne.titreB,
    largeur / 2,
    centreEntreTraits(yBas, hauteur - traitBordure),
    largeurTexte,
    reglages,
    fondBas,
    reglages.couleurTitreFaceB,
    reglages.couleurTitreFaceBManuelle,
  );
  dessinerArtisteLeon(ctx, ligne.artiste, largeur / 2, centreEntreTraits(yHaut, yBas), largeurTexte * 0.94, yBas - yHaut, reglages, fondArtiste);

}

function dessinerEtiquetteJean(ctx, ligne, reglages, largeur, hauteur, bordure) {
  const traitBordure = bordure > 0 ? Math.max(1, bordure) : 0;
  const fondHaut = reglages.couleur2 || "#ffffff";
  const fondBas = reglages.couleur3 || fondHaut;
  const fondArtiste = reglages.couleurRuban || fondHaut;
  const centreTraits = hauteur * limiterNombre(Number(reglages.positionTraitsLEON) || 50, 25, 75) / 100;
  const ecartTraits = hauteur * limiterNombre(Number(reglages.ecartTraitsLEON) || 24, 10, 42) / 100;
  const epaisseurTraits = Math.max(1, Number(reglages.epaisseurTraitsLEON) || 3);
  const yHaut = limiterNombre(centreTraits - ecartTraits / 2, traitBordure + epaisseurTraits, hauteur - traitBordure - epaisseurTraits);
  const yBas = limiterNombre(centreTraits + ecartTraits / 2, traitBordure + epaisseurTraits, hauteur - traitBordure - epaisseurTraits);
  const triangleW = largeur * limiterNombre(Number(reglages.tailleTrianglesJEAN) || 11, 6, 24) / 100;
  const bordTriangleAuY = (y) => triangleW * (1 - Math.abs((y - hauteur / 2) / (hauteur / 2)));

  ctx.fillStyle = fondHaut;
  ctx.fillRect(0, 0, largeur, yHaut);
  ctx.fillStyle = fondArtiste;
  ctx.fillRect(0, yHaut, largeur, yBas - yHaut);
  ctx.fillStyle = fondBas;
  ctx.fillRect(0, yBas, largeur, hauteur - yBas);

  dessinerMotifZone(ctx, reglages, 0, 0, largeur, yHaut);
  dessinerMotifZone(ctx, reglages, 0, yBas, largeur, hauteur - yBas);
  dessinerMotifSecondaireZone(ctx, reglages, 0, 0, largeur, yHaut);
  dessinerMotifSecondaireZone(ctx, reglages, 0, yBas, largeur, hauteur - yBas);
  dessinerMotifRuban(ctx, reglages, 0, yHaut, largeur, yBas - yHaut);
  dessinerMotifSecondaireRuban(ctx, reglages, 0, yHaut, largeur, yBas - yHaut);
  if (reglages.modeVignette === "fond" || reglages.modeVignette === "global") {
    dessinerVignette(ctx, reglages, largeur, hauteur);
  }

  if (traitBordure > 0) {
    dessinerBordureInterieureArrondie(
      ctx,
      0,
      0,
      largeur,
      hauteur,
      traitBordure,
      reglages.couleur1,
      reglages.arrondiInterieurBordure ? Math.min(hauteur * 0.16, largeur * 0.035) : 0,
      reglages,
    );
  }

  ctx.save();
  ctx.fillStyle = reglages.couleur1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(triangleW, hauteur / 2);
  ctx.lineTo(0, hauteur);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(largeur, 0);
  ctx.lineTo(largeur - triangleW, hauteur / 2);
  ctx.lineTo(largeur, hauteur);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = reglages.couleur1;
  ctx.lineWidth = epaisseurTraits;
  ctx.lineCap = "butt";
  const recouvrementTriangle = Math.max(3, epaisseurTraits * 1.5);
  const departTraitHaut = Math.max(0, bordTriangleAuY(yHaut) - recouvrementTriangle);
  const departTraitBas = Math.max(0, bordTriangleAuY(yBas) - recouvrementTriangle);
  ctx.beginPath();
  ctx.moveTo(departTraitHaut, yHaut);
  ctx.lineTo(largeur - departTraitHaut, yHaut);
  ctx.moveTo(departTraitBas, yBas);
  ctx.lineTo(largeur - departTraitBas, yBas);
  ctx.stroke();
  ctx.restore();

  if (reglages.afficherMarques) {
    dessinerMarques(ctx, reglages, largeur, hauteur, yHaut, yBas - yHaut, yBas - yHaut);
  }

  const margeX = Math.max(triangleW + largeur * 0.025, traitBordure + largeur * 0.035);
  const largeurTexte = Math.max(largeur * 0.35, largeur - margeX * 2);
  dessinerTitre(
    ctx,
    ligne.titreA,
    largeur / 2,
    centreEntreTraits(traitBordure, yHaut),
    largeurTexte,
    reglages,
    fondHaut,
    reglages.couleurTitreFaceA,
    reglages.couleurTitreFaceAManuelle,
  );
  dessinerTitre(
    ctx,
    ligne.titreB,
    largeur / 2,
    centreEntreTraits(yBas, hauteur - traitBordure),
    largeurTexte,
    reglages,
    fondBas,
    reglages.couleurTitreFaceB,
    reglages.couleurTitreFaceBManuelle,
  );
  dessinerArtisteLeon(ctx, ligne.artiste, largeur / 2, centreEntreTraits(yHaut, yBas), largeurTexte * 0.94, yBas - yHaut, reglages, fondArtiste);

}

function dessinerArtisteLeon(ctx, texte, x, y, largeurMax, hauteurZone, reglages, couleurFond) {
  let taille = 32 * reglages.tailleArtiste / 100;
  const tailleMax = Math.max(10, hauteurZone * 0.48);
  taille = Math.min(taille, tailleMax);
  const style = normaliserStylePolice(reglages.policeArtiste, reglages.styleArtiste);
  const poids = poidsPolice(reglages.policeArtiste, styleTexteEnGras(style) ? 700 : 400);
  const italique = style === "italique" || style === "gras-italique" ? "italic " : "";
  const decalageRetro = modeDecalageRetro(reglages);
  ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(reglages.policeArtiste)}`;
  const contenu = choisirTexteArtiste(ctx, texte, largeurMax).toLocaleUpperCase("fr-FR");
  let mesure = ctx.measureText(contenu).width;
  if (mesure > largeurMax) {
    taille *= Math.max(0.48, largeurMax / mesure);
    ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(reglages.policeArtiste)}`;
    mesure = ctx.measureText(contenu).width;
  }
  ctx.fillStyle = couleurTextePourFond(
    couleurFond,
    reglages.couleurArtiste,
    reglages.couleurArtisteManuelle,
  );
  dessinerTexteAvecTransformation(
    ctx,
    contenu,
    x,
    y,
    transformerArtisteRetro(decalageRetro, taille),
    reglages.irregulariteCaracteres,
  );
}

function dessinerTraitsModernes(ctx, reglages, largeur, hauteur) {
  if (reglages.motifSecondaireFond === false) {
    return;
  }
  dessinerMotifSecondaireContenu(ctx, reglages, largeur, hauteur);
}

function dessinerMotifSecondaireZone(ctx, reglages, x, y, largeur, hauteur) {
  if (reglages.motifSecondaireFond === false || largeur <= 0 || hauteur <= 0) {
    return;
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, largeur, hauteur);
  ctx.clip();
  ctx.translate(x, y);
  dessinerMotifSecondaireContenu(ctx, reglages, largeur, hauteur);
  ctx.restore();
}

function dessinerMotifSecondaireRuban(ctx, reglages, x, y, largeur, hauteur, rayon = 0, tracerClip = null) {
  if (!reglages.motifSecondaireRuban || largeur <= 0 || hauteur <= 0) {
    return;
  }
  ctx.save();
  ctx.beginPath();
  if (typeof tracerClip === "function") {
    tracerClip(ctx);
  } else {
    ajouterRectangleArrondi(ctx, x, y, largeur, hauteur, rayon);
  }
  ctx.clip();
  ctx.translate(x, y);
  dessinerMotifSecondaireContenu(ctx, reglages, largeur, hauteur);
  ctx.restore();
}

function dessinerMotifSecondaireContenu(ctx, reglages, largeur, hauteur) {
  if (!reglages.afficherTraitsModernes || Number(reglages.opaciteTraitsModernes) <= 0) {
    return;
  }
  const type = motifSecondaireValide(reglages);
  const angle = limiterNombre(Number(reglages.angleTraitsModernes) || 0, -80, 80);
  const pente = Math.tan((angle * Math.PI) / 180);
  const opacite = limiterNombre(Number(reglages.opaciteTraitsModernes) || 0, 0, 100) / 100;
  const couleur = reglages.couleurTraitsModernes || reglages.couleur1;
  if (type !== "traits") {
    dessinerMotifLibre(ctx, type, couleur, opacite * 0.42, largeur, hauteur, angle);
    return;
  }
  ctx.strokeStyle = convertirHexEnRgba(couleur, opacite);
  ctx.lineWidth = Math.max(1, largeur * 0.002);
  for (let x = largeur * 0.24; x < largeur * 0.92; x += largeur * 0.065) {
    ctx.beginPath();
    ctx.moveTo(x - pente * hauteur * 0.38, hauteur * 0.12);
    ctx.lineTo(x + pente * hauteur * 0.38, hauteur * 0.88);
    ctx.stroke();
  }
}

function motifSecondaireValide(reglages) {
  const motifs = ["grille", "rayures", "points", "diagonales", "chevrons", "croisillons", "vagues", "soleil"];
  const motifPrincipal = reglages.motifType || "aucun";
  if (motifs.includes(reglages.motifTraitsModernes) && reglages.motifTraitsModernes !== motifPrincipal) {
    return reglages.motifTraitsModernes;
  }
  return motifs.find((motif) => motif !== motifPrincipal) || "grille";
}

function dessinerBandeModerne(ctx, cote, couleur, taillePourcent, angleDegres, largeur, hauteur, opacite) {
  const taille = Math.max(0, Math.min(60, Number(taillePourcent) || 0)) / 100;
  if (taille <= 0) {
    return;
  }
  const angle = Math.max(-80, Math.min(80, Number(angleDegres) || 0));
  const base = largeur * taille;
  const inclinaison = inclinaisonBandeModerne(base, angle, hauteur);
  ctx.fillStyle = convertirHexEnRgba(couleur, opacite);
  ctx.beginPath();
  if (cote === "gauche") {
    const haut = limiterNombre(base + inclinaison, 0, largeur);
    const bas = limiterNombre(base - inclinaison, 0, largeur);
    ctx.moveTo(0, 0);
    ctx.lineTo(haut, 0);
    ctx.lineTo(bas, hauteur);
    ctx.lineTo(0, hauteur);
  } else {
    const haut = limiterNombre(largeur - base + inclinaison, 0, largeur);
    const bas = limiterNombre(largeur - base - inclinaison, 0, largeur);
    ctx.moveTo(haut, 0);
    ctx.lineTo(largeur, 0);
    ctx.lineTo(largeur, hauteur);
    ctx.lineTo(bas, hauteur);
  }
  ctx.closePath();
  ctx.fill();
}

function inclinaisonBandeModerne(base, angleDegres, hauteur) {
  const brute = Math.tan((angleDegres * Math.PI) / 180) * hauteur * 0.5;
  const maximum = Math.max(0, base * 0.85);
  return Math.sign(brute) * Math.min(Math.abs(brute), maximum);
}

function limiterNombre(valeur, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, valeur));
}

function dessinerMarquesModernes(ctx, reglages, largeur, hauteur) {
  const tailleGauche = tailleMarque(reglages, "gauche", largeur, 0.013);
  const tailleDroite = tailleMarque(reglages, "droite", largeur, 0.013);
  const xGauche = largeur * positionMarque(reglages, "gauche") / 100;
  const xDroite = largeur * positionMarque(reglages, "droite") / 100;
  const yGauche = hauteur * hauteurMarque(reglages, "gauche") / 100;
  const yDroite = hauteur * hauteurMarque(reglages, "droite") / 100;
  const textes = textesMarques(reglages);
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  appliquerStyleMarque(ctx, reglages, "gauche", tailleGauche);
  appliquerContrasteMarqueSurFondBlanc(ctx, reglages, xGauche, yGauche);
  dessinerTexteTourne(ctx, textes[0], xGauche, yGauche, angleMarque(reglages, "gauche"));
  appliquerStyleMarque(ctx, reglages, "droite", tailleDroite);
  appliquerContrasteMarqueSurFondBlanc(ctx, reglages, largeur - xDroite, yDroite);
  dessinerTexteTourne(ctx, textes[1], largeur - xDroite, yDroite, angleMarque(reglages, "droite"));
  ctx.restore();
}

function dessinerMarquesManu(ctx, reglages, largeur, hauteur, rubanX, rubanW) {
  const [texteGauche, texteDroite] = textesMarquesBruts(reglages);
  const tailleGauche = tailleMarque(reglages, "gauche", largeur, 0.0205);
  const tailleDroite = tailleMarque(reglages, "droite", largeur, 0.0205);
  const diametreGauche = diametrePastilleManu(reglages, "gauche", hauteur);
  const diametreDroite = diametrePastilleManu(reglages, "droite", hauteur);
  const margeRuban = Math.max(3, largeur * 0.004);
  const xGaucheSouhaite = largeur * positionMarque(reglages, "gauche") / 100;
  const xDroiteSouhaite = largeur - (largeur * positionMarque(reglages, "droite") / 100);
  const xGauche = Math.min(xGaucheSouhaite, rubanX - diametreGauche / 2 - margeRuban);
  const xDroite = Math.max(xDroiteSouhaite, rubanX + rubanW + diametreDroite / 2 + margeRuban);
  const yGauche = hauteur * hauteurMarque(reglages, "gauche") / 100;
  const yDroite = hauteur * hauteurMarque(reglages, "droite") / 100;

  dessinerPastilleManu(ctx, reglages, "gauche", texteGauche, xGauche, yGauche, diametreGauche, tailleGauche);
  dessinerPastilleManu(ctx, reglages, "droite", texteDroite, xDroite, yDroite, diametreDroite, tailleDroite);
}

function diametrePastilleManu(reglages, cote, hauteur) {
  const suffixe = cote === "gauche" ? "Gauche" : "Droite";
  const valeur = reglages.synchroniserMarques === false
    ? reglages[`diametrePastille${suffixe}`]
    : reglages.diametrePastille;
  const pourcent = limiterNombre(Number(valeur) || 33, 12, 70);
  return Math.max(16, hauteur * pourcent / 100);
}

function dessinerPastilleManu(ctx, reglages, cote, texte, x, y, diametre, taille) {
  const suffixe = cote === "gauche" ? "Gauche" : "Droite";
  const couleurPastille = reglages.synchroniserMarques === false
    ? reglages[`couleurMarque${suffixe}`]
    : reglages.couleurMarques;
  const forme = formePastilleManu(reglages, cote);
  const angle = angleMarque(reglages, cote);

  ctx.save();
  ctx.fillStyle = couleurPastille;
  tracerFormePastilleManu(ctx, forme, x, y, diametre);
  ctx.fill();

  const tailleAjustee = tailleTextePastilleManu(ctx, reglages, cote, texte, taille, diametre, forme);
  appliquerStyleMarque(ctx, reglages, cote, tailleAjustee);
  ctx.fillStyle = couleurEstBlanche(couleurPastille)
    ? couleurLateraleSurFondBlanc(reglages)
    : couleurTexteContraste(couleurPastille);
  dessinerTexteTourneRespectantCasse(ctx, texte, x, y, angle);
  ctx.restore();
}

function formePastilleManu(reglages, cote) {
  const suffixe = cote === "gauche" ? "Gauche" : "Droite";
  const forme = reglages.synchroniserMarques === false
    ? reglages[`formePastille${suffixe}`]
    : reglages.formePastille;
  return ["rond", "carre", "losange"].includes(forme) ? forme : "rond";
}

function tracerFormePastilleManu(ctx, forme, x, y, diametre) {
  const demi = diametre / 2;
  ctx.beginPath();
  if (forme === "carre") {
    ctx.rect(x - demi, y - demi, diametre, diametre);
  } else if (forme === "losange") {
    ctx.moveTo(x, y - demi);
    ctx.lineTo(x + demi, y);
    ctx.lineTo(x, y + demi);
    ctx.lineTo(x - demi, y);
    ctx.closePath();
  } else {
    ctx.arc(x, y, demi, 0, Math.PI * 2);
  }
}

function tailleTextePastilleManu(ctx, reglages, cote, texte, taille, diametre, forme) {
  let tailleAjustee = taille;
  const marge = forme === "losange" ? 0.52 : 0.68;
  const largeurMax = Math.max(8, diametre * marge);
  appliquerStyleMarque(ctx, reglages, cote, tailleAjustee);
  const contenu = String(texte || "");
  const largeurTexte = ctx.measureText(contenu).width;
  if (largeurTexte > largeurMax) {
    tailleAjustee = Math.max(8, tailleAjustee * (largeurMax / largeurTexte));
  }
  return tailleAjustee;
}

function tracerRectangleArrondi(ctx, x, y, largeur, hauteur, rayon) {
  // Demarre un nouveau trace autonome.
  const r = Math.min(rayon, largeur / 2, hauteur / 2);
  ctx.beginPath();
  if (r <= 0) {
    ctx.rect(x, y, largeur, hauteur);
    ctx.closePath();
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + largeur - r, y);
  ctx.quadraticCurveTo(x + largeur, y, x + largeur, y + r);
  ctx.lineTo(x + largeur, y + hauteur - r);
  ctx.quadraticCurveTo(x + largeur, y + hauteur, x + largeur - r, y + hauteur);
  ctx.lineTo(x + r, y + hauteur);
  ctx.quadraticCurveTo(x, y + hauteur, x, y + hauteur - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function ajouterRectangleArrondi(ctx, x, y, largeur, hauteur, rayon) {
  // Ajoute au trace courant, notamment pour les remplissages evenodd.
  const r = Math.min(rayon, largeur / 2, hauteur / 2);
  if (r <= 0) {
    ctx.rect(x, y, largeur, hauteur);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + largeur - r, y);
  ctx.quadraticCurveTo(x + largeur, y, x + largeur, y + r);
  ctx.lineTo(x + largeur, y + hauteur - r);
  ctx.quadraticCurveTo(x + largeur, y + hauteur, x + largeur - r, y + hauteur);
  ctx.lineTo(x + r, y + hauteur);
  ctx.quadraticCurveTo(x, y + hauteur, x, y + hauteur - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function dessinerBordureInterieureArrondie(ctx, x, y, largeur, hauteur, epaisseur, couleur, rayonInterieur = 0, reglages = {}) {
  const trait = Math.max(0, Math.min(epaisseur, largeur / 2, hauteur / 2));
  if (trait <= 0) {
    return;
  }
  const afficherHorizontale = reglages.bordureHorizontale !== false;
  const afficherVerticale = reglages.modele !== "JEAN" && reglages.bordureVerticale !== false;
  if (!afficherHorizontale && !afficherVerticale) {
    return;
  }
  if (!afficherHorizontale || !afficherVerticale) {
    ctx.save();
    ctx.fillStyle = couleur;
    if (afficherHorizontale) {
      ctx.fillRect(x, y, largeur, trait);
      ctx.fillRect(x, y + hauteur - trait, largeur, trait);
    }
    if (afficherVerticale) {
      ctx.fillRect(x, y, trait, hauteur);
      ctx.fillRect(x + largeur - trait, y, trait, hauteur);
    }
    ctx.restore();
    return;
  }
  const interieurX = x + trait;
  const interieurY = y + trait;
  const interieurW = Math.max(0, largeur - trait * 2);
  const interieurH = Math.max(0, hauteur - trait * 2);
  ctx.save();
  ctx.fillStyle = couleur;
  ctx.beginPath();
  ctx.rect(x, y, largeur, hauteur);
  if (interieurW > 0 && interieurH > 0) {
    ajouterRectangleArrondi(ctx, interieurX, interieurY, interieurW, interieurH, rayonInterieur);
    ctx.fill("evenodd");
  } else {
    ctx.fill();
  }
  ctx.restore();
}

function dessinerFlechesAlice(ctx, reglages, largeur, rubanX, rubanY, rubanW, rubanH) {
  const flecheW = largeur * 0.086;
  const recouvrement = Math.max(1, largeur * 0.0012);
  ctx.fillStyle = reglages.couleur1;
  ctx.beginPath();
  ctx.moveTo(rubanX - recouvrement, rubanY);
  ctx.lineTo(rubanX + flecheW, rubanY + rubanH / 2);
  ctx.lineTo(rubanX - recouvrement, rubanY + rubanH);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(rubanX + rubanW + recouvrement, rubanY);
  ctx.lineTo(rubanX + rubanW - flecheW, rubanY + rubanH / 2);
  ctx.lineTo(rubanX + rubanW + recouvrement, rubanY + rubanH);
  ctx.closePath();
  ctx.fill();
}

function dessinerRubanSimple(ctx, reglages, rubanX, rubanY, rubanW, rubanH) {
  const pointe = Math.min(rubanW * 0.075, rubanH * 0.95);
  const trait = Math.max(2, rubanH * 0.06);
  ctx.fillStyle = reglages.couleurRuban;
  ctx.strokeStyle = reglages.couleur1;
  ctx.lineWidth = trait;
  ctx.beginPath();
  tracerRubanSimple(ctx, rubanX, rubanY, rubanW, rubanH, pointe);
  ctx.fill();
  dessinerMotifRuban(ctx, reglages, rubanX, rubanY, rubanW, rubanH, 0, (contexte) => {
    tracerRubanSimple(contexte, rubanX, rubanY, rubanW, rubanH, pointe);
  });
  dessinerMotifSecondaireRuban(ctx, reglages, rubanX, rubanY, rubanW, rubanH, 0, (contexte) => {
    tracerRubanSimple(contexte, rubanX, rubanY, rubanW, rubanH, pointe);
  });
  ctx.beginPath();
  tracerRubanSimple(ctx, rubanX, rubanY, rubanW, rubanH, pointe);
  ctx.stroke();
  return trait;
}

function tracerRubanSimple(ctx, rubanX, rubanY, rubanW, rubanH, pointe) {
  ctx.moveTo(rubanX, rubanY + rubanH / 2);
  ctx.lineTo(rubanX + pointe, rubanY);
  ctx.lineTo(rubanX + rubanW - pointe, rubanY);
  ctx.lineTo(rubanX + rubanW, rubanY + rubanH / 2);
  ctx.lineTo(rubanX + rubanW - pointe, rubanY + rubanH);
  ctx.lineTo(rubanX + pointe, rubanY + rubanH);
  ctx.closePath();
}

function dessinerRubanMartin(ctx, reglages, rubanX, rubanY, rubanW, rubanH) {
  const cran = rubanW * 0.085;
  const insetY = Math.max(3, rubanH * 0.14);
  const centreX = rubanX + cran * 1.08;
  const centreW = rubanW - cran * 2.16;
  ctx.fillStyle = reglages.couleur1;
  ctx.save();
  ctx.beginPath();
  ctx.rect(rubanX, rubanY, rubanW, rubanH);
  tracerEncocheMartin(ctx, [
    [rubanX, rubanY],
    [rubanX + cran, rubanY + rubanH / 2],
    [rubanX, rubanY + rubanH],
  ]);
  tracerEncocheMartin(ctx, [
    [rubanX + rubanW, rubanY],
    [rubanX + rubanW - cran, rubanY + rubanH / 2],
    [rubanX + rubanW, rubanY + rubanH],
  ]);
  ctx.fill("evenodd");
  ctx.restore();
  ctx.fillStyle = reglages.couleurRuban;
  ctx.fillRect(centreX, rubanY + insetY, centreW, rubanH - insetY * 2);
  dessinerMotifRuban(ctx, reglages, centreX, rubanY + insetY, centreW, rubanH - insetY * 2);
  dessinerMotifSecondaireRuban(ctx, reglages, centreX, rubanY + insetY, centreW, rubanH - insetY * 2);
  ctx.strokeStyle = reglages.couleur1;
  ctx.lineWidth = Math.max(2, rubanH * 0.045);
  ctx.strokeRect(centreX, rubanY + insetY, centreW, rubanH - insetY * 2);
}

function tracerEncocheMartin(ctx, points) {
  const [a, b, c] = points;
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.lineTo(c[0], c[1]);
  ctx.closePath();
}

function dessinerMarques(ctx, reglages, largeur, hauteur, rubanY, rubanH, bandeH) {
  let tailleGauche = tailleMarque(reglages, "gauche", largeur, 0.0205);
  let tailleDroite = tailleMarque(reglages, "droite", largeur, 0.0205);
  const [texteGauche, texteDroite] = textesMarques(reglages);
  if (reglages.limiterMarquesBandeSurprise) {
    const hauteurMax = Math.max(8, (bandeH > 0 ? bandeH : rubanH) * 0.82);
    appliquerStyleMarque(ctx, reglages, "gauche", tailleGauche);
    while (ctx.measureText(texteGauche).width > hauteurMax && tailleGauche > 10) {
      tailleGauche -= 1;
      appliquerStyleMarque(ctx, reglages, "gauche", tailleGauche);
    }
    appliquerStyleMarque(ctx, reglages, "droite", tailleDroite);
    while (ctx.measureText(texteDroite).width > hauteurMax && tailleDroite > 10) {
      tailleDroite -= 1;
      appliquerStyleMarque(ctx, reglages, "droite", tailleDroite);
    }
  }
  const xGauche = largeur * positionMarque(reglages, "gauche") / 100;
  const xDroite = largeur * positionMarque(reglages, "droite") / 100;
  const yGauche = hauteur * hauteurMarque(reglages, "gauche") / 100;
  const yDroite = hauteur * hauteurMarque(reglages, "droite") / 100;
  appliquerStyleMarque(ctx, reglages, "gauche", tailleGauche);
  appliquerContrasteMarqueSurFondBlanc(ctx, reglages, xGauche, yGauche);
  if (reglages.modele === "JEAN" && reglages.marquesVerticalesJEAN) {
    dessinerTexteVerticalDroit(ctx, texteGauche, xGauche, yGauche, tailleGauche);
  } else {
    dessinerTexteTourne(ctx, texteGauche, xGauche, yGauche, angleMarque(reglages, "gauche"));
  }
  appliquerStyleMarque(ctx, reglages, "droite", tailleDroite);
  appliquerContrasteMarqueSurFondBlanc(ctx, reglages, largeur - xDroite, yDroite);
  if (reglages.modele === "JEAN" && reglages.marquesVerticalesJEAN) {
    dessinerTexteVerticalDroit(ctx, texteDroite, largeur - xDroite, yDroite, tailleDroite);
  } else {
    dessinerTexteTourne(ctx, texteDroite, largeur - xDroite, yDroite, angleMarque(reglages, "droite"));
  }
}

function tailleMarque(reglages, cote, largeur, facteur) {
  if (reglages.synchroniserMarques === false) {
    const suffixe = cote === "gauche" ? "Gauche" : "Droite";
    const taille = Number(reglages[`tailleMarque${suffixe}`]);
    return largeur * facteur * (Number.isFinite(taille) ? taille : reglages.tailleMarques) / 100;
  }
  return largeur * facteur * reglages.tailleMarques / 100;
}

function textesMarques(reglages) {
  if (reglages.synchroniserMarques === false) {
    return [
      String(reglages.marqueGaucheTexte || "").toLocaleUpperCase("fr-FR"),
      String(reglages.marqueDroiteTexte || "").toLocaleUpperCase("fr-FR"),
    ];
  }
  return [
    String(reglages.marqueGauche || "").toLocaleUpperCase("fr-FR"),
    String(reglages.marqueDroite || "").toLocaleUpperCase("fr-FR"),
  ];
}

function textesMarquesBruts(reglages) {
  if (reglages.synchroniserMarques === false) {
    return [
      String(reglages.marqueGaucheTexte || ""),
      String(reglages.marqueDroiteTexte || ""),
    ];
  }
  return [
    String(reglages.marqueGauche || ""),
    String(reglages.marqueDroite || ""),
  ];
}

function appliquerStyleMarque(ctx, reglages, cote, taille) {
  const suffixe = cote === "gauche" ? "Gauche" : "Droite";
  const police = reglages.synchroniserMarques === false ? reglages[`policeMarque${suffixe}`] : reglages.policeMarques;
  const styleDemande = reglages.synchroniserMarques === false ? reglages[`styleMarque${suffixe}`] : "gras";
  const style = normaliserStylePolice(police, styleDemande);
  const couleur = reglages.synchroniserMarques === false ? reglages[`couleurMarque${suffixe}`] : reglages.couleurMarques;
  const poids = poidsPolice(police, style === "gras" || style === "gras-italique" ? 700 : 400);
  const italique = style === "italique" || style === "gras-italique" ? "italic " : "";
  ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(police)}`;
  ctx.fillStyle = couleur;
}

function appliquerContrasteMarqueSurFondBlanc(ctx, reglages, x, y) {
  if (pixelEstBlanc(ctx, x, y)) {
    ctx.fillStyle = couleurLateraleSurFondBlanc(reglages);
  }
}

function pixelEstBlanc(ctx, x, y) {
  const px = Math.max(0, Math.min(ctx.canvas.width - 1, Math.round(x)));
  const py = Math.max(0, Math.min(ctx.canvas.height - 1, Math.round(y)));
  try {
    const [rouge, vert, bleu, alpha] = ctx.getImageData(px, py, 1, 1).data;
    return alpha > 0 && rouge >= 245 && vert >= 245 && bleu >= 245;
  } catch {
    return false;
  }
}

function couleurEstBlanche(couleur) {
  const { rouge, vert, bleu } = lireCouleurRgb(couleur);
  return rouge >= 245 && vert >= 245 && bleu >= 245;
}

function couleurLateraleSurFondBlanc(reglages) {
  const couleurBordure = reglages.couleur1 || "#000000";
  return ratioContraste("#ffffff", couleurBordure) >= 3 ? couleurBordure : "#000000";
}

function angleMarque(reglages, cote) {
  if (reglages.synchroniserMarques === false) {
    return cote === "gauche" ? reglages.angleMarqueGauche : reglages.angleMarqueDroite;
  }
  return cote === "gauche" ? reglages.angleMarques : -reglages.angleMarques;
}

function positionMarque(reglages, cote) {
  if (reglages.synchroniserMarques === false) {
    return cote === "gauche" ? reglages.positionMarqueGauche : reglages.positionMarqueDroite;
  }
  return reglages.positionMarques;
}

function hauteurMarque(reglages, cote) {
  if (reglages.synchroniserMarques === false) {
    return cote === "gauche" ? reglages.hauteurMarqueGauche : reglages.hauteurMarqueDroite;
  }
  return reglages.hauteurMarques;
}

function dessinerTexteTourne(ctx, texte, x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  dessinerEmpreinteTexte(ctx, String(texte || "").toLocaleUpperCase("fr-FR"), 0, 0);
  ctx.restore();
}

function dessinerTexteVerticalDroit(ctx, texte, x, y, taille) {
  const lettres = Array.from(String(texte || "").toLocaleUpperCase("fr-FR"));
  if (!lettres.length) {
    return;
  }
  const interligne = taille * 1.02;
  const departY = y - ((lettres.length - 1) * interligne) / 2;
  lettres.forEach((lettre, index) => {
    dessinerEmpreinteTexte(ctx, lettre, x, departY + index * interligne);
  });
}

function dessinerTexteTourneRespectantCasse(ctx, texte, x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  dessinerEmpreinteTexte(ctx, String(texte || ""), 0, 0);
  ctx.restore();
}

function dessinerMotif(ctx, reglages, largeur, hauteur) {
  if (reglages.motifFond === false) {
    return;
  }
  const type = reglages.motifType || "aucun";
  const opacite = Math.max(0, Math.min(1, reglages.motif / 100)) * 0.42;
  const angle = limiterNombre(Number(reglages.angleMotif) || 0, -80, 80);
  if (type === "aucun" || opacite <= 0) {
    return;
  }
  dessinerMotifLibre(ctx, type, reglages.couleurMotif || reglages.couleur1, opacite, largeur, hauteur, angle);
}

function dessinerMotifZone(ctx, reglages, x, y, largeur, hauteur) {
  if (reglages.motifFond === false || largeur <= 0 || hauteur <= 0) {
    return;
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, largeur, hauteur);
  ctx.clip();
  ctx.translate(x, y);
  dessinerMotif(ctx, reglages, largeur, hauteur);
  ctx.restore();
}

function dessinerMotifRuban(ctx, reglages, x, y, largeur, hauteur, rayon = 0, tracerClip = null) {
  if (!reglages.motifRuban || largeur <= 0 || hauteur <= 0) {
    return;
  }
  const type = reglages.motifRubanType || "aucun";
  const opacite = Math.max(0, Math.min(1, Number(reglages.opaciteMotifRuban) / 100)) * 0.42;
  const angle = limiterNombre(Number(reglages.angleMotifRuban) || 0, -80, 80);
  if (type === "aucun" || opacite <= 0) {
    return;
  }
  ctx.save();
  ctx.beginPath();
  if (typeof tracerClip === "function") {
    tracerClip(ctx);
  } else {
    ajouterRectangleArrondi(ctx, x, y, largeur, hauteur, rayon);
  }
  ctx.clip();
  ctx.translate(x, y);
  dessinerMotifLibre(ctx, type, reglages.couleurMotifRuban || reglages.couleurMotif || reglages.couleur1, opacite, largeur, hauteur, angle);
  ctx.restore();
}

function dessinerMotifLibre(ctx, type, couleurMotif, opacite, largeur, hauteur, angle = 0) {
  if (type === "aucun" || opacite <= 0) {
    return;
  }
  ctx.save();
  const angleLimite = limiterNombre(Number(angle) || 0, -80, 80);
  const largeurVisible = largeur;
  const hauteurVisible = hauteur;
  let largeurMotif = largeur;
  let hauteurMotif = hauteur;
  if (angleLimite !== 0) {
    const diagonale = Math.hypot(largeurVisible, hauteurVisible) * 1.25;
    ctx.beginPath();
    ctx.rect(0, 0, largeurVisible, hauteurVisible);
    ctx.clip();
    ctx.translate(largeurVisible / 2, hauteurVisible / 2);
    ctx.rotate((angleLimite * Math.PI) / 180);
    ctx.translate(-diagonale / 2, -diagonale / 2);
    largeurMotif = diagonale;
    hauteurMotif = diagonale;
  }
  ctx.strokeStyle = convertirHexEnRgba(couleurMotif, opacite);
  ctx.fillStyle = convertirHexEnRgba(couleurMotif, opacite * 0.85);
  ctx.lineWidth = Math.max(1, largeurMotif * 0.0016);
  if (type === "grille") {
    for (let x = 0; x <= largeurMotif; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, hauteurMotif);
      ctx.stroke();
    }
    for (let y = 0; y <= hauteurMotif; y += 18) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(largeurMotif, y);
      ctx.stroke();
    }
  } else if (type === "rayures") {
    ctx.lineWidth = Math.max(2, largeurMotif * 0.003);
    for (let x = -largeurMotif; x <= largeurMotif * 2; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + hauteurMotif * 1.2, hauteurMotif);
      ctx.stroke();
    }
  } else if (type === "points") {
    const rayon = Math.max(2, largeurMotif * 0.0036);
    for (let x = 14; x <= largeurMotif; x += 28) {
      for (let y = 12; y <= hauteurMotif; y += 22) {
        ctx.beginPath();
        ctx.arc(x, y, rayon, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (type === "diagonales") {
    ctx.strokeStyle = convertirHexEnRgba(couleurMotif, opacite * 0.72);
    for (let x = -largeurMotif; x <= largeurMotif * 2; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, hauteurMotif);
      ctx.lineTo(x + hauteurMotif, 0);
      ctx.stroke();
    }
  } else if (type === "chevrons") {
    ctx.lineWidth = Math.max(1, largeurMotif * 0.002);
    const pasX = 34;
    const pasY = 26;
    for (let y = -pasY; y <= hauteurMotif + pasY; y += pasY) {
      for (let x = -pasX; x <= largeurMotif + pasX; x += pasX) {
        ctx.beginPath();
        ctx.moveTo(x, y + pasY * 0.7);
        ctx.lineTo(x + pasX * 0.5, y);
        ctx.lineTo(x + pasX, y + pasY * 0.7);
        ctx.stroke();
      }
    }
  } else if (type === "croisillons") {
    ctx.strokeStyle = convertirHexEnRgba(couleurMotif, opacite * 0.68);
    for (let x = -largeurMotif; x <= largeurMotif * 2; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + hauteurMotif, hauteurMotif);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, hauteurMotif);
      ctx.lineTo(x + hauteurMotif, 0);
      ctx.stroke();
    }
  } else if (type === "vagues") {
    ctx.lineWidth = Math.max(1, largeurMotif * 0.002);
    const amplitude = hauteurMotif * 0.035;
    const pas = 42;
    for (let y = hauteurMotif * 0.12; y <= hauteurMotif * 0.9; y += 24) {
      ctx.beginPath();
      for (let x = -pas; x <= largeurMotif + pas; x += 6) {
        const yy = y + Math.sin((x / pas) * Math.PI * 2 + angle / 18) * amplitude;
        if (x === -pas) {
          ctx.moveTo(x, yy);
        } else {
          ctx.lineTo(x, yy);
        }
      }
      ctx.stroke();
    }
  } else if (type === "soleil") {
    const centreX = largeurMotif * 0.5;
    const centreY = hauteurMotif * 0.5;
    const rayonMin = Math.min(largeurMotif, hauteurMotif) * 0.08;
    const rayonMax = Math.max(largeurMotif, hauteurMotif) * 0.72;
    for (let i = 0; i < 42; i += 1) {
      const a = (i / 42) * Math.PI * 2 + (angle * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(centreX + Math.cos(a) * rayonMin, centreY + Math.sin(a) * rayonMin);
      ctx.lineTo(centreX + Math.cos(a) * rayonMax, centreY + Math.sin(a) * rayonMax);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function dessinerVignette(ctx, reglages, largeur, hauteur) {
  if (reglages.modeVignette === "aucun") {
    return;
  }
  const force = (reglages.vignette / 100) * (reglages.intensite / 100);
  if (force <= 0) {
    return;
  }
  const angle = (Number(reglages.angle) || 0) * Math.PI / 180;
  const horizontal = Math.abs(Math.cos(angle));
  const vertical = Math.abs(Math.sin(angle));
  ctx.save();
  if (horizontal > 0.01) {
    const gradientH = ctx.createLinearGradient(0, 0, largeur, 0);
    gradientH.addColorStop(0, convertirHexEnRgba(reglages.couleurVignette, force * horizontal));
    gradientH.addColorStop(0.18, convertirHexEnRgba(reglages.couleurVignette, force * horizontal * 0.38));
    gradientH.addColorStop(0.38, convertirHexEnRgba(reglages.couleurVignette, 0));
    gradientH.addColorStop(0.62, convertirHexEnRgba(reglages.couleurVignette, 0));
    gradientH.addColorStop(0.82, convertirHexEnRgba(reglages.couleurVignette, force * horizontal * 0.38));
    gradientH.addColorStop(1, convertirHexEnRgba(reglages.couleurVignette, force * horizontal));
    ctx.fillStyle = gradientH;
    ctx.fillRect(0, 0, largeur, hauteur);
  }
  if (vertical > 0.01) {
    const gradientV = ctx.createLinearGradient(0, 0, 0, hauteur);
    gradientV.addColorStop(0, convertirHexEnRgba(reglages.couleurVignette, force * vertical));
    gradientV.addColorStop(0.18, convertirHexEnRgba(reglages.couleurVignette, force * vertical * 0.38));
    gradientV.addColorStop(0.38, convertirHexEnRgba(reglages.couleurVignette, 0));
    gradientV.addColorStop(0.62, convertirHexEnRgba(reglages.couleurVignette, 0));
    gradientV.addColorStop(0.82, convertirHexEnRgba(reglages.couleurVignette, force * vertical * 0.38));
    gradientV.addColorStop(1, convertirHexEnRgba(reglages.couleurVignette, force * vertical));
    ctx.fillStyle = gradientV;
    ctx.fillRect(0, 0, largeur, hauteur);
  }
  ctx.restore();
}

function dessinerTitre(ctx, texte, x, y, largeurMax, reglages, couleurFond, couleurTitre, couleurManuelle) {
  const taille = 22 * reglages.tailleTitres / 100;
  const style = normaliserStylePolice(reglages.policeTitres, reglages.styleTitres);
  const poids = poidsPolice(reglages.policeTitres, styleTexteEnGras(style) ? 700 : 400);
  const italique = style === "italique" || style === "gras-italique" ? "italic " : "";
  const interligne = taille * 1.12;
  const decalageRetro = modeDecalageRetro(reglages);
  ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(reglages.policeTitres)}`;
  const texteNettoye = nettoyerGuillemetsTitre(texte);
  ctx.fillStyle = couleurTextePourFond(
    couleurFond,
    couleurTitre,
    couleurManuelle,
  );
  const margeGuillemets = reglages.guillemetsTitres ? taille * 1.35 : 0;
  const lignes = dessinerTexteMultiligne(
    ctx,
    texteNettoye,
    x,
    y,
    Math.max(taille * 3, largeurMax - margeGuillemets),
    interligne,
    2,
    reglages.guillemetsTitres ? composerLignesTitreAvecParentheseSeparee : composerLignesTitre,
    decalageRetro !== "aucun" ? (ligne, index, total, taillePolice) => transformerLigneTitreRetro(decalageRetro, ligne, index, total, taillePolice) : null,
    reglages.irregulariteCaracteres,
  );
  if (reglages.guillemetsTitres) {
    dessinerGuillemetsTitre(ctx, lignes);
  }
}

function modeDecalageRetro(reglages) {
  return reglages.decalageRetro || "aucun";
}

function styleTexteEnGras(style) {
  return style === "gras" || style === "gras-italique";
}

function transformerLigneTitreRetro(mode, ligne, index, total, taillePolice) {
  if (ligneEstParenthese(ligne)) {
    return { angle: 0, decalageX: 0, decalageY: 0 };
  }
  if (!["titres-leger", "un-titre", "tout-leger", "tout-bas-decale"].includes(mode)) {
    return { angle: 0, decalageX: 0, decalageY: 0 };
  }
  if (mode === "un-titre" && index !== 0) {
    return { angle: 0, decalageX: 0, decalageY: 0 };
  }
  const alternance = index % 2 === 0 ? -1 : 1;
  const force = mode === "tout-bas-decale" ? 1.35 : 1;
  const angle = total > 1
    ? alternance * (index === 0 ? 0.85 : 0.65) * force
    : -0.7 * force;
  return {
    angle,
    decalageX: alternance * taillePolice * 0.09 * force,
    decalageY: mode === "tout-bas-decale"
      ? taillePolice * (0.08 + index * 0.04)
      : (index === 0 && total > 1 ? -taillePolice * 0.015 : taillePolice * 0.015),
  };
}

function transformerArtisteRetro(mode, taillePolice) {
  if (!["artiste-leger", "tout-leger", "artiste-bas", "tout-bas-decale"].includes(mode)) {
    return { angle: 0, decalageX: 0, decalageY: 0 };
  }
  if (mode === "artiste-bas") {
    return { angle: 0.55, decalageX: taillePolice * 0.07, decalageY: taillePolice * 0.18 };
  }
  if (mode === "tout-bas-decale") {
    return { angle: 0.75, decalageX: taillePolice * 0.08, decalageY: taillePolice * 0.2 };
  }
  return { angle: 0.6, decalageX: taillePolice * 0.075, decalageY: taillePolice * 0.08 };
}

function dessinerTexteAvecTransformation(ctx, texte, x, y, transformation, irregulariteCaracteres = false) {
  const angle = transformation.angle || 0;
  const xTexte = x + (transformation.decalageX || 0);
  const yTexte = y + (transformation.decalageY || 0);
  if (angle) {
    ctx.save();
    ctx.translate(xTexte, yTexte);
    ctx.rotate((angle * Math.PI) / 180);
    dessinerEmpreinteTexteOptionnelle(ctx, texte, 0, 0, irregulariteCaracteres);
    ctx.restore();
    return;
  }
  dessinerEmpreinteTexteOptionnelle(ctx, texte, xTexte, yTexte, irregulariteCaracteres);
}

function nettoyerGuillemetsTitre(texte) {
  return String(texte || "").trim().replace(/^["“”'‘’]+|["“”'‘’]+$/g, "");
}

function dessinerGuillemetsTitre(ctx, lignes) {
  if (!lignes.length) {
    return;
  }
  const lignesCitation = lignes.filter((item) => !ligneEstParenthese(item.texte));
  const premiereLigne = lignesCitation.at(0);
  const derniereLigne = lignesCitation.at(-1);
  if (!premiereLigne || !derniereLigne) {
    return;
  }
  const texteFinCitation = retirerParentheseFinale(derniereLigne.texte);
  if (!texteFinCitation) {
    return;
  }

  ctx.save();
  ctx.font = premiereLigne.font;
  const debutCitation = premiereLigne.x - ctx.measureText(premiereLigne.texte).width / 2;
  const margeDebut = Math.max(7, premiereLigne.taillePolice * 0.48);
  const tailleGuillemetDebut = premiereLigne.taillePolice * 0.95;
  const yGuillemetDebut = premiereLigne.y - premiereLigne.taillePolice * 0.03;
  dessinerGuillemetIncline(ctx, "“", debutCitation - margeDebut, yGuillemetDebut, -8, tailleGuillemetDebut);

  ctx.font = derniereLigne.font;
  const debutDerniereLigne = derniereLigne.x - ctx.measureText(derniereLigne.texte).width / 2;
  const finCitation = debutDerniereLigne + ctx.measureText(texteFinCitation).width;
  const margeFin = Math.max(7, derniereLigne.taillePolice * 0.48);
  const tailleGuillemetFin = derniereLigne.taillePolice * 0.95;
  const yGuillemetFin = derniereLigne.y - derniereLigne.taillePolice * 0.03;
  dessinerGuillemetIncline(ctx, "”", finCitation + margeFin, yGuillemetFin, 7, tailleGuillemetFin);
  ctx.restore();
}

function ligneEstParenthese(ligne) {
  return /^\([^)]*\)$/.test(String(ligne || "").trim());
}

function retirerParentheseFinale(ligne) {
  return String(ligne || "").replace(/\s+\([^)]*\)\s*$/, "").trim();
}

function dessinerGuillemetIncline(ctx, texte, x, y, angle, taille) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.font = ctx.font.replace(/\d+(?:\.\d+)?px/, `${taille}px`);
  dessinerEmpreinteTexte(ctx, texte, 0, 0);
  ctx.restore();
}

function dessinerArtiste(ctx, texte, x, y, largeurMax, reglages, couleurFond = reglages.couleurRuban) {
  let taille = 32 * reglages.tailleArtiste / 100;
  const style = normaliserStylePolice(reglages.policeArtiste, reglages.styleArtiste);
  const poids = poidsPolice(reglages.policeArtiste, styleTexteEnGras(style) ? 700 : 400);
  const italique = style === "italique" || style === "gras-italique" ? "italic " : "";
  const decalageRetro = modeDecalageRetro(reglages);
  ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(reglages.policeArtiste)}`;
  const contenu = choisirTexteArtiste(ctx, texte, largeurMax).toLocaleUpperCase("fr-FR");
  let mesure = ctx.measureText(contenu).width;
  if (mesure > largeurMax) {
    taille *= Math.max(0.5, largeurMax / mesure);
    ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(reglages.policeArtiste)}`;
    mesure = ctx.measureText(contenu).width;
  }
  ctx.fillStyle = couleurTextePourFond(
    couleurFond,
    reglages.couleurArtiste,
    reglages.couleurArtisteManuelle,
  );
  dessinerTexteAvecTransformation(
    ctx,
    contenu,
    x,
    y,
    transformerArtisteRetro(decalageRetro, taille),
    reglages.irregulariteCaracteres,
  );
}

function choisirTexteArtiste(ctx, artiste, largeurMax) {
  const variantes = variantesArtiste(artiste);
  return variantes.find((variante) => ctx.measureText(variante.toLocaleUpperCase("fr-FR")).width <= largeurMax) || variantes.at(-1);
}

function variantesArtiste(artiste) {
  const texte = String(artiste || "").trim();
  if (!texte) {
    return [""];
  }
  const variantes = [texte, abregerPrenomsArtiste(texte), nomPrincipalArtiste(texte)]
    .map((variante) => variante.trim())
    .filter(Boolean);
  return [...new Set(variantes)];
}

function abregerPrenomsArtiste(artiste) {
  const texte = String(artiste || "").trim();
  const separateurs = /\s+(&|ET|AND)\s+/i;
  if (separateurs.test(texte)) {
    return texte
      .split(separateurs)
      .filter((fragment) => !/^(?:&|ET|AND)$/i.test(fragment))
      .map((fragment) => abregerNom(fragment.trim()))
      .join(" & ");
  }
  return abregerNom(texte);
}

function abregerNom(nom) {
  const mots = nom.split(/\s+/).filter(Boolean);
  if (mots.length < 2) {
    return nom;
  }
  const dernierMot = mots.at(-1);
  const initiales = mots
    .slice(0, -1)
    .map((mot) => mot.split(/[-']/).filter(Boolean).map((partie) => `${partie[0]}.`).join(""))
    .join("");
  return `${initiales} ${dernierMot}`.trim();
}

function nomPrincipalArtiste(artiste) {
  const texte = String(artiste || "").trim();
  const separateurs = /\s+(&|ET|AND)\s+/i;
  if (separateurs.test(texte)) {
    return texte
      .split(separateurs)
      .filter((fragment) => !/^(?:&|ET|AND)$/i.test(fragment))
      .map((fragment) => dernierMotArtiste(fragment.trim()))
      .join(" & ");
  }
  return dernierMotArtiste(texte);
}

function dernierMotArtiste(artiste) {
  const mots = String(artiste || "").split(/\s+/).filter(Boolean);
  return mots.at(-1) || artiste;
}

function composerLignesTitre(ctx, texte, largeurMax) {
  const contenu = String(texte || "").trim();
  if (ctx.measureText(contenu.toLocaleUpperCase("fr-FR")).width <= largeurMax) {
    return null;
  }

  const parenthese = contenu.match(/^(.*?)\s*(\((?=[^)]*[A-Za-zÀ-ÖØ-öø-ÿ])[^)]+\))\s*$/);
  if (parenthese && parenthese[1].trim()) {
    return [parenthese[1].trim(), parenthese[2].trim()];
  }
  return null;
}

function composerLignesTitreAvecParentheseSeparee(ctx, texte, largeurMax) {
  const contenu = String(texte || "").trim();
  const parenthese = contenu.match(/^(.*?)\s*(\((?=[^)]*[A-Za-zÀ-ÖØ-öø-ÿ0-9])[^)]+\))\s*$/);
  if (parenthese && parenthese[1].trim()) {
    return [parenthese[1].trim(), parenthese[2].trim()];
  }
  return composerLignesTitre(ctx, texte, largeurMax);
}

function dessinerTexteMultiligne(
  ctx,
  texte,
  x,
  y,
  largeurMax,
  interligne,
  limite,
  composerLignes = null,
  transformerLigne = null,
  irregulariteCaracteres = false,
) {
  const lignesForcees = composerLignes?.(ctx, texte, largeurMax);
  const mots = String(texte || "").toLocaleUpperCase("fr-FR").split(/\s+/).filter(Boolean);
  const lignes = [];
  if (lignesForcees) {
    lignes.push(...lignesForcees.map((ligne) => ligne.toLocaleUpperCase("fr-FR")));
  } else {
    mots.forEach((mot) => {
      const derniere = lignes.at(-1) || "";
      const candidate = derniere ? `${derniere} ${mot}` : mot;
      if (!derniere || ctx.measureText(candidate).width <= largeurMax) {
        if (lignes.length) {
          lignes[lignes.length - 1] = candidate;
        } else {
          lignes.push(candidate);
        }
      } else if (lignes.length < limite) {
        lignes.push(mot);
      } else {
        lignes[lignes.length - 1] += ` ${mot}`;
      }
    });
  }

  const visibles = lignes.slice(0, limite);
  const depart = y - ((visibles.length - 1) * interligne) / 2;
  const policeBase = ctx.font;
  return visibles.map((ligne, index) => {
    ctx.font = policeBase;
    let taillePolice = parseFloat(ctx.font.match(/(\d+(?:\.\d+)?)px/)?.[1] || "18");
    if (ligneEstParenthese(ligne)) {
      taillePolice *= 0.72;
      ctx.font = ctx.font.replace(/\d+(?:\.\d+)?px/, `${taillePolice}px`);
    }
    while (ctx.measureText(ligne).width > largeurMax && taillePolice > 9) {
      taillePolice -= 1;
      ctx.font = ctx.font.replace(/\d+(?:\.\d+)?px/, `${taillePolice}px`);
    }
    const transformation = transformerLigne?.(ligne, index, visibles.length, taillePolice) || {};
    const xLigne = x + (transformation.decalageX || 0);
    const yLigne = depart + index * interligne + (transformation.decalageY || 0);
    const angle = transformation.angle || 0;
    const font = ctx.font;
    if (angle) {
      ctx.save();
      ctx.translate(xLigne, yLigne);
      ctx.rotate((angle * Math.PI) / 180);
      dessinerTexteCentreVisuel(ctx, ligne, 0, 0, irregulariteCaracteres);
      ctx.restore();
    } else {
      dessinerTexteCentreVisuel(ctx, ligne, xLigne, yLigne, irregulariteCaracteres);
    }
    return {
      texte: ligne,
      x: xLigne,
      y: yLigne,
      font,
      taillePolice,
    };
  });
}

function dessinerTexteCentreVisuel(ctx, texte, x, y, irregulariteCaracteres = false) {
  const baseline = ctx.textBaseline;
  ctx.textBaseline = "alphabetic";
  const mesures = ctx.measureText(texte);
  const ascendant = Number.isFinite(mesures.actualBoundingBoxAscent) ? mesures.actualBoundingBoxAscent : 0;
  const descendant = Number.isFinite(mesures.actualBoundingBoxDescent) ? mesures.actualBoundingBoxDescent : 0;
  const correction = ascendant || descendant ? (ascendant - descendant) / 2 : 0;
  dessinerEmpreinteTexteOptionnelle(ctx, texte, x, y + correction, irregulariteCaracteres);
  ctx.textBaseline = baseline;
}

function dessinerEmpreinteTexteOptionnelle(ctx, texte, x, y, irregulariteCaracteres) {
  if (!irregulariteCaracteres) {
    dessinerEmpreinteTexte(ctx, texte, x, y);
    return;
  }
  dessinerEmpreinteTexteIrréguliere(ctx, texte, x, y);
}

function dessinerEmpreinteTexteIrréguliere(ctx, texte, x, y) {
  const caracteres = Array.from(String(texte || ""));
  const largeurs = caracteres.map((caractere) => ctx.measureText(caractere).width);
  const largeurTotale = largeurs.reduce((total, largeur) => total + largeur, 0);
  const alignement = ctx.textAlign;
  const taille = parseFloat(ctx.font.match(/(\d+(?:\.\d+)?)px/)?.[1] || "16");
  const aleatoire = creerAleatoireDeterministe(`${texte}|${ctx.font}|irregularite`);
  let positionX = ["center"].includes(alignement)
    ? x - largeurTotale / 2
    : ["right", "end"].includes(alignement) ? x - largeurTotale : x;

  ctx.save();
  ctx.textAlign = "left";
  caracteres.forEach((caractere, index) => {
    const largeur = largeurs[index];
    if (caractere.trim()) {
      const decalageX = (aleatoire() - 0.5) * taille * 0.035;
      const decalageY = (aleatoire() - 0.5) * taille * 0.07;
      const angle = (aleatoire() - 0.5) * 2;
      const opacite = 0.82 + aleatoire() * 0.18;
      ctx.save();
      ctx.globalAlpha *= opacite;
      ctx.translate(positionX + decalageX, y + decalageY);
      ctx.rotate((angle * Math.PI) / 180);
      dessinerEmpreinteTexte(ctx, caractere, 0, 0);
      ctx.restore();
    }
    positionX += largeur;
  });
  ctx.restore();
}

function policeCanvas(police) {
  return famillePolice(police);
}

function dessinerEmpreinteTexte(ctx, texte, x, y) {
  const effet = effetPoliceDepuisFont(ctx.font);
  if (effet === "aucun") {
    ctx.fillText(texte, x, y);
    return;
  }

  const mesures = ctx.measureText(texte);
  const taille = parseFloat(ctx.font.match(/(\d+(?:\.\d+)?)px/)?.[1] || "16");
  const ascendant = mesures.actualBoundingBoxAscent || taille * 0.78;
  const descendant = mesures.actualBoundingBoxDescent || taille * 0.22;
  const marge = Math.max(3, Math.ceil(taille * 0.16));
  const largeur = Math.max(1, Math.ceil(mesures.width + marge * 2));
  const hauteur = Math.max(1, Math.ceil(ascendant + descendant + marge * 2));
  const empreinte = document.createElement("canvas");
  empreinte.width = largeur;
  empreinte.height = hauteur;
  const tampon = empreinte.getContext("2d");
  tampon.font = ctx.font;
  tampon.textAlign = ctx.textAlign;
  tampon.textBaseline = ctx.textBaseline;
  tampon.direction = ctx.direction;
  tampon.fillStyle = typeof ctx.fillStyle === "string" ? ctx.fillStyle : "#000000";

  const ancreX = ["right", "end"].includes(ctx.textAlign)
    ? largeur - marge
    : ctx.textAlign === "center" ? largeur / 2 : marge;
  const ancreY = ancreVerticaleEmpreinte(ctx.textBaseline, hauteur, marge, ascendant);
  tampon.fillText(texte, ancreX, ancreY);
  renforcerEmpreinteTexte(tampon, texte, ancreX, ancreY, taille, effet);
  eroderEmpreinteTexte(tampon, largeur, hauteur, taille, `${texte}|${ctx.font}|${effet}`, effet);

  ctx.drawImage(empreinte, x - ancreX, y - ancreY);
}

function ancreVerticaleEmpreinte(baseline, hauteur, marge, ascendant) {
  if (baseline === "top" || baseline === "hanging") {
    return marge;
  }
  if (baseline === "middle") {
    return hauteur / 2;
  }
  if (baseline === "bottom" || baseline === "ideographic") {
    return hauteur - marge;
  }
  return marge + ascendant;
}

function eroderEmpreinteTexte(ctx, largeur, hauteur, taille, graine, effet) {
  const aleatoire = creerAleatoireDeterministe(graine);
  const profils = {
    usee: { force: 1, rayon: 0.055, griffures: 1, poussiere: 0 },
    efface: { force: 1.65, rayon: 0.095, griffures: 1.65, poussiere: 0 },
    "encre-noire": { force: 0.72, rayon: 0.048, griffures: 0.55, poussiere: 0.18 },
    veteran: { force: 1.1, rayon: 0.062, griffures: 0.8, poussiere: 0.08 },
    smith: { force: 0.82, rayon: 0.052, griffures: 0.7, poussiere: 0.12 },
    fantome: { force: 2.15, rayon: 0.13, griffures: 2.25, poussiere: 1 },
    tampon: { force: 1.38, rayon: 0.085, griffures: 0.9, poussiere: 0.35 },
  };
  const profil = profils[effet] || profils.usee;
  const force = profil.force;
  const surface = largeur * hauteur;
  const nombreTrous = Math.min(900, Math.max(8, Math.round(surface * 0.012 * force)));
  const rayonMinimum = Math.max(0.32, taille * 0.012);
  const rayonMaximum = Math.max(0.75, taille * profil.rayon);

  ctx.save();
  ctx.globalCompositeOperation = "destination-out";

  for (let index = 0; index < nombreTrous; index += 1) {
    const rayon = rayonMinimum + (aleatoire() ** 2.2) * (rayonMaximum - rayonMinimum);
    const x = aleatoire() * largeur;
    const y = aleatoire() * hauteur;
    ctx.globalAlpha = 0.48 + aleatoire() * 0.52;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      rayon * (0.65 + aleatoire() * 1.55),
      rayon * (0.45 + aleatoire() * 0.9),
      aleatoire() * Math.PI,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  const nombreEraflures = Math.max(1, Math.round(largeur / Math.max(55, taille * 3.4) * profil.griffures));
  ctx.globalAlpha = ["efface", "fantome"].includes(effet) ? 0.92 : 0.68;
  for (let index = 0; index < nombreEraflures; index += 1) {
    const x = aleatoire() * largeur;
    const y = aleatoire() * hauteur;
    const verticale = aleatoire() > 0.32;
    const epaisseur = Math.max(0.45, taille * (0.018 + aleatoire() * 0.025));
    if (verticale) {
      ctx.fillRect(x, y, epaisseur, taille * (0.3 + aleatoire() * 0.95));
    } else {
      ctx.fillRect(x, y, taille * (0.3 + aleatoire() * 0.9), epaisseur);
    }
  }
  ctx.restore();

  if (profil.poussiere > 0) {
    ajouterPoussiereEncre(ctx, largeur, hauteur, taille, aleatoire, profil.poussiere);
  }
}

function renforcerEmpreinteTexte(ctx, texte, x, y, taille, effet) {
  const epaisseurs = {
    "encre-noire": 0.075,
    smith: 0.065,
    tampon: 0.025,
  };
  const epaisseur = epaisseurs[effet];
  if (!epaisseur) {
    return;
  }
  ctx.save();
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = Math.max(0.55, taille * epaisseur);
  ctx.lineJoin = "round";
  ctx.strokeText(texte, x, y);
  ctx.restore();
}

function ajouterPoussiereEncre(ctx, largeur, hauteur, taille, aleatoire, force) {
  const nombrePoints = Math.min(420, Math.round(largeur * hauteur * 0.0015 * force));
  ctx.save();
  ctx.globalAlpha = Math.min(0.42, 0.16 + force * 0.16);
  for (let index = 0; index < nombrePoints; index += 1) {
    const rayon = Math.max(0.25, taille * (0.006 + aleatoire() * 0.018));
    ctx.beginPath();
    ctx.arc(aleatoire() * largeur, aleatoire() * hauteur, rayon, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function creerAleatoireDeterministe(texte) {
  let etat = 2166136261;
  for (let index = 0; index < texte.length; index += 1) {
    etat ^= texte.charCodeAt(index);
    etat = Math.imul(etat, 16777619);
  }
  return () => {
    etat += 0x6d2b79f5;
    let valeur = etat;
    valeur = Math.imul(valeur ^ (valeur >>> 15), valeur | 1);
    valeur ^= valeur + Math.imul(valeur ^ (valeur >>> 7), valeur | 61);
    return ((valeur ^ (valeur >>> 14)) >>> 0) / 4294967296;
  };
}

function convertirHexEnRgba(couleur, opacite) {
  const { rouge, vert, bleu } = lireCouleurRgb(couleur);
  return `rgba(${rouge}, ${vert}, ${bleu}, ${Math.max(0, Math.min(1, opacite)).toFixed(3)})`;
}

function lireCouleurRgb(couleur) {
  const valeur = String(couleur || "#000000").replace("#", "");
  return {
    rouge: parseInt(valeur.slice(0, 2), 16) || 0,
    vert: parseInt(valeur.slice(2, 4), 16) || 0,
    bleu: parseInt(valeur.slice(4, 6), 16) || 0,
  };
}

function luminanceCouleur(couleur) {
  const { rouge, vert, bleu } = lireCouleurRgb(couleur);
  const convertir = (canal) => {
    const valeur = canal / 255;
    return valeur <= 0.03928 ? valeur / 12.92 : ((valeur + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * convertir(rouge) + 0.7152 * convertir(vert) + 0.0722 * convertir(bleu);
}

function ratioContraste(couleurA, couleurB) {
  const luminanceA = luminanceCouleur(couleurA);
  const luminanceB = luminanceCouleur(couleurB);
  const clair = Math.max(luminanceA, luminanceB);
  const fonce = Math.min(luminanceA, luminanceB);
  return (clair + 0.05) / (fonce + 0.05);
}

export function couleurLisible(couleurFond, couleurPreferee, contrasteMinimum = 4.5) {
  if (ratioContraste(couleurFond, couleurPreferee) >= contrasteMinimum) {
    return couleurPreferee;
  }
  return ratioContraste(couleurFond, "#fffdf8") > ratioContraste(couleurFond, "#16120d") ? "#fffdf8" : "#16120d";
}

function couleurTextePourFond(couleurFond, couleurPreferee, couleurManuelle) {
  return couleurManuelle
    ? couleurPreferee
    : couleurLisible(couleurFond, couleurPreferee);
}

export function couleurTexteContraste(couleurFond) {
  return ratioContraste(couleurFond, "#fffdf8") > ratioContraste(couleurFond, "#16120d") ? "#fffdf8" : "#16120d";
}
