export function creerGestionFavoris({ cleFavoris, normaliserReglagesImportes }) {
  function obtenirFavoris() {
    try {
      const donneesStockees = localStorage.getItem(cleFavoris) || "[]";
      const donnees = JSON.parse(donneesStockees);
      if (!Array.isArray(donnees)) {
        return [];
      }
      return donnees
        .map(normaliserFavori)
        .filter(Boolean);
    } catch {
      return [];
    }
  }

  function enregistrerFavoris(favoris) {
    localStorage.setItem(cleFavoris, JSON.stringify(favoris));
  }

  function normaliserFavori(favori) {
    if (!favori || typeof favori !== "object") {
      return null;
    }

    try {
      if (!favori.reglages || typeof favori.reglages !== "object") {
        return null;
      }
      const reglages = normaliserReglagesImportes(favori.reglages);
      return {
        id: signatureReglages(reglages),
        creeLe: favori.creeLe || new Date().toISOString(),
        nomPersonnalise: String(favori.nomPersonnalise || "").trim().slice(0, 80),
        reglages,
      };
    } catch {
      return null;
    }
  }

  return { obtenirFavoris, enregistrerFavoris, normaliserFavori, signatureReglages };
}

export function signatureReglages(reglages) {
  return JSON.stringify(trierObjetPourSignature(reglages));
}

function trierObjetPourSignature(valeur) {
  if (Array.isArray(valeur)) {
    return valeur.map(trierObjetPourSignature);
  }
  if (!valeur || typeof valeur !== "object") {
    return valeur;
  }
  return Object.keys(valeur)
    .sort()
    .reduce((resultat, cle) => {
      resultat[cle] = trierObjetPourSignature(valeur[cle]);
      return resultat;
    }, {});
}
