import { presets } from "./modeles.js";

window.PX_PAR_MM = window.PX_PAR_MM || 12;

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

  if (reglages.modele === "celeste") {
    dessinerEtiquetteModerne(ctx, ligne, reglages, largeur, hauteur, bordure, rubanX, rubanY, rubanW, rubanH);
    return canvas;
  }

  if (reglages.modele === "leon") {
    dessinerEtiquetteLeon(ctx, ligne, reglages, largeur, hauteur, bordure);
    return canvas;
  }

  if (reglages.modele === "manu") {
    dessinerEtiquetteManu(ctx, ligne, reglages, largeur, hauteur, bordure, rubanX, rubanY, rubanW, rubanH, bandeH, bandeY);
    return canvas;
  }

  ctx.fillStyle = reglages.couleur2;
  ctx.fillRect(0, 0, largeur, hauteur / 2);
  ctx.fillStyle = reglages.couleur3;
  ctx.fillRect(0, hauteur / 2, largeur, hauteur / 2);
  if (reglages.papierVieilli) {
    dessinerPapierVieilli(ctx, reglages, largeur, hauteur);
  }
  dessinerMotif(ctx, reglages, largeur, hauteur);
  dessinerTraitsModernes(ctx, reglages, largeur, hauteur);

  if (reglages.modeVignette === "fond") {
    dessinerVignette(ctx, reglages, largeur, hauteur);
  }

  if (bandeH > 0) {
    ctx.fillStyle = reglages.couleur1;
    ctx.fillRect(bordure / 2, bandeY, largeur - bordure, bandeH);
  }

  let traitRuban = 0;
  if (rubanVisible) {
    if (reglages.modele === "alice") {
      traitRuban = Math.max(2, rubanH * 0.075);
      ctx.fillStyle = reglages.couleurRuban;
      ctx.fillRect(rubanX, rubanY, rubanW, rubanH);
      dessinerMotifRuban(ctx, reglages, rubanX, rubanY, rubanW, rubanH);
      ctx.strokeStyle = reglages.couleur1;
      ctx.lineWidth = traitRuban;
      ctx.strokeRect(
        rubanX + ctx.lineWidth / 2,
        rubanY + ctx.lineWidth / 2,
        rubanW - ctx.lineWidth,
        rubanH - ctx.lineWidth,
      );
      dessinerFlechesAlice(ctx, reglages, largeur, rubanX, rubanY, rubanW, rubanH);
    } else if (reglages.modele === "simple") {
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
    rubanVisible ? rubanW * (reglages.modele === "martin" ? 0.72 : 0.7) : largeur * 0.58,
    reglages,
    rubanVisible ? reglages.couleurRuban : (bandeH > 0 ? reglages.couleur1 : reglages.couleur2),
  );

  if (reglages.papierVieilli) {
    dessinerUsurePapier(ctx, reglages, largeur, hauteur);
  }

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
  dessinerTitre(ctx, ligne.titreA, largeur / 2, zonesTitres.haut, geometrie.largeurTitre, reglages, reglages.couleur2);
  dessinerTitre(ctx, ligne.titreB, largeur / 2, zonesTitres.bas, geometrie.largeurTitre, reglages, reglages.couleur3);
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
  ctx.fillStyle = reglages.couleurFondModerne || presets.celeste.couleurFondModerne;
  ctx.fillRect(0, 0, largeur, hauteur);

  if (reglages.papierVieilli) {
    dessinerPapierVieilli(ctx, reglages, largeur, hauteur);
  }

  dessinerMotif(ctx, reglages, largeur, hauteur);

  ctx.save();
  dessinerBandeModerne(
    ctx,
    "droite",
    reglages.couleurBandeDroite || presets.celeste.couleurBandeDroite,
    reglages.tailleBandeDroite ?? presets.celeste.tailleBandeDroite,
    reglages.angleBandeDroite ?? presets.celeste.angleBandeDroite,
    largeur,
    hauteur,
    0.9,
  );
  dessinerBandeModerne(
    ctx,
    "gauche",
    reglages.couleurBandeGauche || presets.celeste.couleurBandeGauche,
    reglages.tailleBandeGauche ?? presets.celeste.tailleBandeGauche,
    reglages.angleBandeGauche ?? presets.celeste.angleBandeGauche,
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
    rubanW > 0.5 && rubanH > 0.5 ? reglages.couleurRuban : (reglages.couleurFondModerne || presets.celeste.couleurFondModerne),
  );

  if (reglages.papierVieilli) {
    dessinerUsurePapier(ctx, reglages, largeur, hauteur);
  }
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

  if (reglages.papierVieilli) {
    dessinerPapierVieilli(ctx, reglages, largeur, hauteur);
  }

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

  if (reglages.papierVieilli) {
    dessinerUsurePapier(ctx, reglages, largeur, hauteur);
  }
}

function dessinerEtiquetteLeon(ctx, ligne, reglages, largeur, hauteur, bordure) {
  const traitBordure = bordure > 0 ? Math.max(1, bordure) : 0;
  const fondHaut = reglages.couleur2 || "#efe3c3";
  const fondBas = reglages.couleur3 || fondHaut;
  const fondArtiste = reglages.couleurRuban || fondHaut;
  const centreTraits = hauteur * limiterNombre(Number(reglages.positionTraitsLeon) || 50, 25, 75) / 100;
  const ecartTraits = hauteur * limiterNombre(Number(reglages.ecartTraitsLeon) || 24, 10, 42) / 100;
  const epaisseurTraits = Math.max(1, Number(reglages.epaisseurTraitsLeon) || 3);
  const yHaut = limiterNombre(centreTraits - ecartTraits / 2, traitBordure + epaisseurTraits, hauteur - traitBordure - epaisseurTraits);
  const yBas = limiterNombre(centreTraits + ecartTraits / 2, traitBordure + epaisseurTraits, hauteur - traitBordure - epaisseurTraits);

  ctx.fillStyle = fondHaut;
  ctx.fillRect(0, 0, largeur, yHaut);
  ctx.fillStyle = fondArtiste;
  ctx.fillRect(0, yHaut, largeur, yBas - yHaut);
  ctx.fillStyle = fondBas;
  ctx.fillRect(0, yBas, largeur, hauteur - yBas);

  if (reglages.papierVieilli) {
    dessinerPapierVieilli(ctx, reglages, largeur, hauteur);
  }

  dessinerMotifZone(ctx, reglages, 0, 0, largeur, yHaut);
  dessinerMotifZone(ctx, reglages, 0, yBas, largeur, hauteur - yBas);
  dessinerTraitsModernes(ctx, reglages, largeur, hauteur);
  dessinerMotifRuban(ctx, reglages, 0, yHaut, largeur, yBas - yHaut);
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

  const margeX = Math.max(largeur * 0.09, traitBordure + largeur * 0.035);
  const largeurTexte = largeur - margeX * 2;
  dessinerTitre(ctx, ligne.titreA, largeur / 2, centreEntreTraits(traitBordure, yHaut), largeurTexte, reglages, fondHaut);
  dessinerTitre(ctx, ligne.titreB, largeur / 2, centreEntreTraits(yBas, hauteur - traitBordure), largeurTexte, reglages, fondBas);
  dessinerArtisteLeon(ctx, ligne.artiste, largeur / 2, centreEntreTraits(yHaut, yBas), largeurTexte * 0.94, yBas - yHaut, reglages, fondArtiste);

  if (reglages.papierVieilli) {
    dessinerUsurePapier(ctx, reglages, largeur, hauteur);
  }
}

function dessinerArtisteLeon(ctx, texte, x, y, largeurMax, hauteurZone, reglages, couleurFond) {
  let taille = 32 * reglages.tailleArtiste / 100;
  const tailleMax = Math.max(10, hauteurZone * 0.48);
  taille = Math.min(taille, tailleMax);
  const poids = styleTexteEnGras(reglages.styleArtiste) ? 800 : 600;
  const italique = reglages.styleArtiste === "italique" || reglages.styleArtiste === "gras-italique" ? "italic " : "";
  const decalageRetro = modeDecalageRetro(reglages);
  ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(reglages.policeArtiste)}`;
  const contenu = choisirTexteArtiste(ctx, texte, largeurMax).toLocaleUpperCase("fr-FR");
  let mesure = ctx.measureText(contenu).width;
  if (mesure > largeurMax) {
    taille *= Math.max(0.48, largeurMax / mesure);
    ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(reglages.policeArtiste)}`;
    mesure = ctx.measureText(contenu).width;
  }
  ctx.fillStyle = reglages.couleurArtiste;
  dessinerTexteAvecTransformation(ctx, contenu, x, y, transformerArtisteRetro(decalageRetro, taille));
}

function dessinerPapierVieilli(ctx, reglages, largeur, hauteur) {
  const jaunissement = limiterNombre(Number(reglages.jaunissementPapier) || 0, 0, 100) / 100;
  const froissage = limiterNombre(Number(reglages.froissagePapier) || 0, 0, 100) / 100;
  const imperfections = limiterNombre(Number(reglages.imperfectionsPapier) || 0, 0, 100) / 100;
  const usureBords = limiterNombre(Number(reglages.usureBordsPapier) || 0, 0, 100) / 100;
  const couleurVieillie = reglages.couleurPapierVieilli || reglages.couleurVignette || "#8a6b3f";
  ctx.save();

  const gradient = ctx.createLinearGradient(0, 0, largeur, hauteur);
  gradient.addColorStop(0, convertirHexEnRgba("#fff2c6", 0.06 + jaunissement * 0.2));
  gradient.addColorStop(0.32, convertirHexEnRgba(couleurVieillie, 0.04 + jaunissement * 0.12));
  gradient.addColorStop(0.72, convertirHexEnRgba("#f8e5b8", 0.04 + jaunissement * 0.16));
  gradient.addColorStop(1, convertirHexEnRgba(couleurVieillie, 0.05 + jaunissement * 0.2));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, largeur, hauteur);

  ctx.globalCompositeOperation = "multiply";
  const grandesTaches = Math.round(5 + imperfections * 9 + jaunissement * 4);
  for (let i = 0; i < grandesTaches; i += 1) {
    const x = largeur * (0.05 + bruitLeon(i, 17) * 0.9);
    const y = hauteur * (0.08 + bruitLeon(i, 29) * 0.84);
    const rayonX = largeur * (0.06 + bruitLeon(i, 43) * 0.18);
    const rayonY = hauteur * (0.08 + bruitLeon(i, 61) * 0.26);
    const gradientTache = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rayonX, rayonY));
    const opacite = 0.018 + imperfections * 0.08 + jaunissement * 0.035;
    gradientTache.addColorStop(0, convertirHexEnRgba(couleurVieillie, opacite * (0.55 + bruitLeon(i, 71) * 0.65)));
    gradientTache.addColorStop(0.42, convertirHexEnRgba(couleurVieillie, opacite * 0.34));
    gradientTache.addColorStop(1, convertirHexEnRgba(couleurVieillie, 0));
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((bruitLeon(i, 79) - 0.5) * Math.PI * 0.32);
    ctx.scale(rayonX / Math.max(rayonX, rayonY), rayonY / Math.max(rayonX, rayonY));
    ctx.fillStyle = gradientTache;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(rayonX, rayonY), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.globalCompositeOperation = "screen";
  const zonesEclaircies = Math.round(3 + imperfections * 5);
  for (let i = 0; i < zonesEclaircies; i += 1) {
    const x = largeur * (0.1 + bruitLeon(i, 151) * 0.8);
    const y = hauteur * (0.12 + bruitLeon(i, 157) * 0.76);
    const rayon = Math.max(largeur, hauteur) * (0.035 + bruitLeon(i, 163) * 0.08);
    const gradientClair = ctx.createRadialGradient(x, y, 0, x, y, rayon);
    gradientClair.addColorStop(0, convertirHexEnRgba("#fff8dc", 0.02 + imperfections * 0.08));
    gradientClair.addColorStop(1, convertirHexEnRgba("#fff8dc", 0));
    ctx.fillStyle = gradientClair;
    ctx.fillRect(x - rayon, y - rayon, rayon * 2, rayon * 2);
  }

  ctx.globalCompositeOperation = "source-over";
  const nombreFibres = Math.round(34 + froissage * 60 + imperfections * 42);
  ctx.lineWidth = Math.max(0.55, largeur * 0.0008);
  for (let i = 0; i < nombreFibres; i += 1) {
    const horizontal = bruitLeon(i, 181) > 0.22;
    const opacite = 0.012 + bruitLeon(i, 191) * (0.018 + imperfections * 0.035);
    ctx.strokeStyle = convertirHexEnRgba(bruitLeon(i, 193) > 0.38 ? couleurVieillie : "#fff7d6", opacite);
    ctx.beginPath();
    if (horizontal) {
      const y = hauteur * bruitLeon(i, 197);
      const x = largeur * bruitLeon(i, 199) * 0.22;
      const longueur = largeur * (0.15 + bruitLeon(i, 211) * 0.7);
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + longueur * 0.32, y + (bruitLeon(i, 223) - 0.5) * hauteur * 0.025, x + longueur * 0.72, y + (bruitLeon(i, 227) - 0.5) * hauteur * 0.032, x + longueur, y);
    } else {
      const x = largeur * bruitLeon(i, 229);
      const y = hauteur * bruitLeon(i, 233) * 0.2;
      const longueur = hauteur * (0.2 + bruitLeon(i, 239) * 0.58);
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + (bruitLeon(i, 241) - 0.5) * largeur * 0.018, y + longueur * 0.35, x + (bruitLeon(i, 251) - 0.5) * largeur * 0.026, y + longueur * 0.72, x, y + longueur);
    }
    ctx.stroke();
  }

  ctx.strokeStyle = convertirHexEnRgba(reglages.couleur1 || "#2a241c", 0.018 + froissage * 0.11);
  ctx.lineWidth = Math.max(0.8, hauteur * (0.0015 + froissage * 0.0035));
  const nombrePlis = Math.round(1 + froissage * 6);
  for (let i = 0; i < nombrePlis; i += 1) {
    const y = hauteur * (0.12 + bruitLeon(i, 83) * 0.76);
    const depart = -largeur * (0.05 + bruitLeon(i, 85) * 0.12);
    const fin = largeur * (1.02 + bruitLeon(i, 87) * 0.12);
    const amplitude = hauteur * (0.01 + froissage * 0.045);
    ctx.beginPath();
    ctx.moveTo(depart, y);
    ctx.bezierCurveTo(
      largeur * 0.25,
      y + (bruitLeon(i, 91) - 0.5) * amplitude,
      largeur * 0.68,
      y + (bruitLeon(i, 97) - 0.5) * amplitude * 1.3,
      fin,
      y,
    );
    ctx.stroke();
    ctx.strokeStyle = convertirHexEnRgba("#fff7df", 0.012 + froissage * 0.045);
    ctx.beginPath();
    ctx.moveTo(depart, y + Math.max(1, hauteur * 0.008));
    ctx.bezierCurveTo(
      largeur * 0.25,
      y + Math.max(1, hauteur * 0.008) + (bruitLeon(i, 101) - 0.5) * amplitude,
      largeur * 0.68,
      y + Math.max(1, hauteur * 0.008) + (bruitLeon(i, 103) - 0.5) * amplitude,
      fin,
      y + Math.max(1, hauteur * 0.008),
    );
    ctx.stroke();
    ctx.strokeStyle = convertirHexEnRgba(reglages.couleur1 || "#2a241c", 0.018 + froissage * 0.11);
  }

  if (usureBords > 0) {
    const bord = Math.min(0.34, 0.08 + usureBords * 0.22);
    const opacite = usureBords * 0.2;
    const gradientH = ctx.createLinearGradient(0, 0, largeur, 0);
    gradientH.addColorStop(0, convertirHexEnRgba(couleurVieillie, opacite));
    gradientH.addColorStop(bord, convertirHexEnRgba(couleurVieillie, opacite * 0.18));
    gradientH.addColorStop(0.5, convertirHexEnRgba(couleurVieillie, 0));
    gradientH.addColorStop(1 - bord, convertirHexEnRgba(couleurVieillie, opacite * 0.18));
    gradientH.addColorStop(1, convertirHexEnRgba(couleurVieillie, opacite));
    ctx.fillStyle = gradientH;
    ctx.fillRect(0, 0, largeur, hauteur);

    const gradientV = ctx.createLinearGradient(0, 0, 0, hauteur);
    gradientV.addColorStop(0, convertirHexEnRgba(couleurVieillie, opacite * 0.8));
    gradientV.addColorStop(bord, convertirHexEnRgba(couleurVieillie, opacite * 0.12));
    gradientV.addColorStop(0.5, convertirHexEnRgba(couleurVieillie, 0));
    gradientV.addColorStop(1 - bord, convertirHexEnRgba(couleurVieillie, opacite * 0.12));
    gradientV.addColorStop(1, convertirHexEnRgba(couleurVieillie, opacite * 0.8));
    ctx.fillStyle = gradientV;
    ctx.fillRect(0, 0, largeur, hauteur);

    const coins = [
      [0, 0],
      [largeur, 0],
      [0, hauteur],
      [largeur, hauteur],
    ];
    coins.forEach(([x, y], index) => {
      const rayon = Math.max(largeur, hauteur) * (0.16 + bruitLeon(index, 271) * 0.08);
      const gradientCoin = ctx.createRadialGradient(x, y, 0, x, y, rayon);
      gradientCoin.addColorStop(0, convertirHexEnRgba(couleurVieillie, usureBords * 0.28));
      gradientCoin.addColorStop(0.45, convertirHexEnRgba(couleurVieillie, usureBords * 0.08));
      gradientCoin.addColorStop(1, convertirHexEnRgba(couleurVieillie, 0));
      ctx.fillStyle = gradientCoin;
      ctx.fillRect(0, 0, largeur, hauteur);
    });
  }
  ctx.restore();
}

function dessinerUsurePapier(ctx, reglages, largeur, hauteur) {
  const imperfections = limiterNombre(Number(reglages.imperfectionsPapier) || 0, 0, 100) / 100;
  const usureBords = limiterNombre(Number(reglages.usureBordsPapier) || 0, 0, 100) / 100;
  if (imperfections <= 0 && usureBords <= 0) {
    return;
  }
  ctx.save();
  const nombreMarques = Math.round(4 + imperfections * 24 + usureBords * 8);
  for (let i = 0; i < nombreMarques; i += 1) {
    const x = bruitLeon(i, 109) * largeur;
    const y = bruitLeon(i, 127) * hauteur;
    const w = largeur * (0.004 + bruitLeon(i, 131) * 0.02);
    const h = hauteur * (0.006 + bruitLeon(i, 137) * 0.045);
    const opacite = 0.012 + imperfections * 0.065 + usureBords * 0.025;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((bruitLeon(i, 139) - 0.5) * Math.PI * 0.2);
    ctx.fillStyle = convertirHexEnRgba(reglages.couleurPapierVieilli || "#4b351f", opacite * (0.45 + bruitLeon(i, 149)));
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    if (bruitLeon(i, 151) > 0.58) {
      ctx.strokeStyle = convertirHexEnRgba("#fff8df", opacite * 0.55);
      ctx.lineWidth = Math.max(0.5, largeur * 0.0007);
      ctx.beginPath();
      ctx.moveTo(-w * 1.3, 0);
      ctx.lineTo(w * 1.5, (bruitLeon(i, 157) - 0.5) * h);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}

function bruitLeon(index, sel) {
  // Bruit pseudo-aleatoire deterministe pour garder le papier vieilli stable entre deux rendus.
  const valeur = Math.sin((index + 1) * (sel + 3) * 12.9898) * 43758.5453;
  return valeur - Math.floor(valeur);
}

function dessinerTraitsModernes(ctx, reglages, largeur, hauteur) {
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
  dessinerTexteTourne(ctx, textes[0], xGauche, yGauche, angleMarque(reglages, "gauche"));
  appliquerStyleMarque(ctx, reglages, "droite", tailleDroite);
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
  ctx.fillStyle = couleurTexteContraste(couleurPastille);
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
  const afficherVerticale = reglages.bordureVerticale !== false;
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
  dessinerTexteTourne(ctx, texteGauche, xGauche, yGauche, angleMarque(reglages, "gauche"));
  appliquerStyleMarque(ctx, reglages, "droite", tailleDroite);
  dessinerTexteTourne(ctx, texteDroite, largeur - xDroite, yDroite, angleMarque(reglages, "droite"));
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
  const style = reglages.synchroniserMarques === false ? reglages[`styleMarque${suffixe}`] : "gras";
  const police = reglages.synchroniserMarques === false ? reglages[`policeMarque${suffixe}`] : reglages.policeMarques;
  const couleur = reglages.synchroniserMarques === false ? reglages[`couleurMarque${suffixe}`] : reglages.couleurMarques;
  const poids = style === "gras" || style === "gras-italique" ? 800 : 500;
  const italique = style === "italique" || style === "gras-italique" ? "italic " : "";
  ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(police)}`;
  ctx.fillStyle = couleur;
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
  ctx.fillText(String(texte || "").toLocaleUpperCase("fr-FR"), 0, 0);
  ctx.restore();
}

function dessinerTexteTourneRespectantCasse(ctx, texte, x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillText(String(texte || ""), 0, 0);
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

function dessinerTitre(ctx, texte, x, y, largeurMax, reglages, couleurFond) {
  const taille = 22 * reglages.tailleTitres / 100;
  const poids = styleTexteEnGras(reglages.styleTitres) ? 800 : 500;
  const italique = reglages.styleTitres === "italique" || reglages.styleTitres === "gras-italique" ? "italic " : "";
  const interligne = taille * 1.12;
  const decalageRetro = modeDecalageRetro(reglages);
  ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(reglages.policeTitres)}`;
  const texteNettoye = nettoyerGuillemetsTitre(texte);
  const largeurEchantillon = Math.min(
    largeurMax,
    Math.max(taille * 5, ctx.measureText(texteNettoye.toLocaleUpperCase("fr-FR")).width * 0.86),
  );
  ctx.fillStyle = reglages.couleurTitres;
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

function dessinerTexteAvecTransformation(ctx, texte, x, y, transformation) {
  const angle = transformation.angle || 0;
  const xTexte = x + (transformation.decalageX || 0);
  const yTexte = y + (transformation.decalageY || 0);
  if (angle) {
    ctx.save();
    ctx.translate(xTexte, yTexte);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillText(texte, 0, 0);
    ctx.restore();
    return;
  }
  ctx.fillText(texte, xTexte, yTexte);
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
  ctx.fillText(texte, 0, 0);
  ctx.restore();
}

function dessinerArtiste(ctx, texte, x, y, largeurMax, reglages, couleurFond = reglages.couleurRuban) {
  let taille = 32 * reglages.tailleArtiste / 100;
  const poids = styleTexteEnGras(reglages.styleArtiste) ? 800 : 500;
  const italique = reglages.styleArtiste === "italique" || reglages.styleArtiste === "gras-italique" ? "italic " : "";
  const decalageRetro = modeDecalageRetro(reglages);
  ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(reglages.policeArtiste)}`;
  const contenu = choisirTexteArtiste(ctx, texte, largeurMax).toLocaleUpperCase("fr-FR");
  let mesure = ctx.measureText(contenu).width;
  if (mesure > largeurMax) {
    taille *= Math.max(0.5, largeurMax / mesure);
    ctx.font = `${italique}${poids} ${taille}px ${policeCanvas(reglages.policeArtiste)}`;
    mesure = ctx.measureText(contenu).width;
  }
  ctx.fillStyle = reglages.couleurArtiste;
  dessinerTexteAvecTransformation(ctx, contenu, x, y, transformerArtisteRetro(decalageRetro, taille));
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

function dessinerTexteMultiligne(ctx, texte, x, y, largeurMax, interligne, limite, composerLignes = null, transformerLigne = null) {
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
      dessinerTexteCentreVisuel(ctx, ligne, 0, 0);
      ctx.restore();
    } else {
      dessinerTexteCentreVisuel(ctx, ligne, xLigne, yLigne);
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

function dessinerTexteCentreVisuel(ctx, texte, x, y) {
  const baseline = ctx.textBaseline;
  ctx.textBaseline = "alphabetic";
  const mesures = ctx.measureText(texte);
  const ascendant = Number.isFinite(mesures.actualBoundingBoxAscent) ? mesures.actualBoundingBoxAscent : 0;
  const descendant = Number.isFinite(mesures.actualBoundingBoxDescent) ? mesures.actualBoundingBoxDescent : 0;
  const correction = ascendant || descendant ? (ascendant - descendant) / 2 : 0;
  ctx.fillText(texte, x, y + correction);
  ctx.textBaseline = baseline;
}

function policeCanvas(police) {
  const polices = {
    "dactylo-ronde": '"American Typewriter", "Courier New", monospace',
    "dactylo-seche": '"Courier New", Courier, monospace',
    "silk-remington": '"Silk Remington", "American Typewriter", "Courier New", monospace',
    "terminal-carre": 'Monaco, "Lucida Console", monospace',
    "mono-moderne": 'Menlo, Monaco, Consolas, monospace',
    "classique-livre": 'Georgia, "Times New Roman", serif',
    "journal-ancien": '"Times New Roman", Times, serif',
    "machine-vintage": '"Courier Prime", "Courier New", monospace',
    "rock-affiche": '"Cooper Black", Impact, "Arial Black", sans-serif',
    "swing-50": '"Gill Sans", "Trebuchet MS", Arial, sans-serif',
    "western-retro": 'Rockwell, "American Typewriter", Georgia, serif',
    elegante: 'Palatino, "Palatino Linotype", Georgia, serif',
    "luxe-fin": 'Didot, "Bodoni 72", "Hoefler Text", Georgia, serif',
    gravure: '"Hoefler Text", Baskerville, Georgia, serif',
    compacte: '"Arial Narrow", "Helvetica Neue Condensed", Arial, sans-serif',
    "affiche-condensee": 'Impact, "Arial Black", "Arial Narrow", sans-serif',
    "sans-serree": '"Helvetica Neue", Helvetica, Arial, sans-serif',
  };
  return polices[police] || polices["dactylo-ronde"];
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

function couleurHexDepuisRgb(rouge, vert, bleu) {
  const canal = (valeur) => Math.round(limiterNombre(valeur, 0, 255)).toString(16).padStart(2, "0");
  return `#${canal(rouge)}${canal(vert)}${canal(bleu)}`;
}

function couleurFondMoyenneCanvas(ctx, x, y, largeur, hauteur) {
  const canvas = ctx.canvas;
  if (!canvas) {
    return null;
  }
  const margeX = Math.max(1, largeur / 2);
  const margeY = Math.max(1, hauteur / 2);
  const gauche = Math.floor(limiterNombre(x - margeX, 0, canvas.width - 1));
  const haut = Math.floor(limiterNombre(y - margeY, 0, canvas.height - 1));
  const droite = Math.ceil(limiterNombre(x + margeX, gauche + 1, canvas.width));
  const bas = Math.ceil(limiterNombre(y + margeY, haut + 1, canvas.height));
  const largeurZone = droite - gauche;
  const hauteurZone = bas - haut;
  if (largeurZone <= 0 || hauteurZone <= 0) {
    return null;
  }
  try {
    const pixels = ctx.getImageData(gauche, haut, largeurZone, hauteurZone).data;
    const pasX = Math.max(1, Math.floor(largeurZone / 24));
    const pasY = Math.max(1, Math.floor(hauteurZone / 8));
    let total = 0;
    let rouge = 0;
    let vert = 0;
    let bleu = 0;
    for (let yy = Math.floor(pasY / 2); yy < hauteurZone; yy += pasY) {
      for (let xx = Math.floor(pasX / 2); xx < largeurZone; xx += pasX) {
        const index = (yy * largeurZone + xx) * 4;
        const alpha = pixels[index + 3] / 255;
        if (alpha <= 0.02) {
          continue;
        }
        rouge += pixels[index] * alpha + 255 * (1 - alpha);
        vert += pixels[index + 1] * alpha + 255 * (1 - alpha);
        bleu += pixels[index + 2] * alpha + 255 * (1 - alpha);
        total += 1;
      }
    }
    return total ? couleurHexDepuisRgb(rouge / total, vert / total, bleu / total) : null;
  } catch {
    return null;
  }
}

function couleurLisibleSurCanvas(ctx, x, y, largeur, hauteur, couleurFondSecours, couleurPreferee, contrasteMinimum = 4.5) {
  const couleurFond = couleurFondMoyenneCanvas(ctx, x, y, largeur, hauteur) || couleurFondSecours;
  return couleurLisible(couleurFond, couleurPreferee, contrasteMinimum);
}

export function couleurLisible(couleurFond, couleurPreferee, contrasteMinimum = 4.5) {
  if (ratioContraste(couleurFond, couleurPreferee) >= contrasteMinimum) {
    return couleurPreferee;
  }
  return ratioContraste(couleurFond, "#fffdf8") > ratioContraste(couleurFond, "#16120d") ? "#fffdf8" : "#16120d";
}

export function couleurTexteContraste(couleurFond) {
  return ratioContraste(couleurFond, "#fffdf8") > ratioContraste(couleurFond, "#16120d") ? "#fffdf8" : "#16120d";
}
