export const VERSION_EXPORT_STYLE = 2;

// Un style est un instantané complet. Les champs masqués peuvent encore servir
// au dessin (marques synchronisées, couleurs automatiques, décors secondaires).
// Les omettre ferait dépendre le résultat des réglages ouverts lors de l'import.
export function preparerReglagesPourExport(reglages) {
  return { ...reglages, versionExport: VERSION_EXPORT_STYLE };
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
    activerPatine: false,
    afficherMarques: false,
    afficherEtoiles: false,
    synchroniserMarques: true,
    couleurMarquesManuelle: false,
    marquesVerticales: false,
    marquesVerticalesJEAN: false,
    limiterMarquesBandeSurprise: false,
    deplacementTextesManuel: false,
    decalageTitreAX: 0,
    decalageTitreAY: 0,
    decalageArtisteX: 0,
    decalageArtisteY: 0,
    decalageTitreBX: 0,
    decalageTitreBY: 0,
  });
}
