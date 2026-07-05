export const DIMENSIONS_ETIQUETTE_DEFAUT = {
  largeur: 77,
  hauteur: 26,
};
export const LARGEUR_PAGE_MM = 210;
export const HAUTEUR_PAGE_MM = 297;
export const MARGE_PAGE_MM = 8;
export const ECART_MM = 6;
export const CLE_FAVORIS = "45ojuke.etiquettesPersonnalisees.favoris";
export const CLE_CSV_LOCAL = "45ojuke.etiquettesPersonnalisees.csv";
export const CLE_LANGUE = "45ojuke.langue";
export const CLE_REGLAGES_AUTOMATIQUES = "45ojuke.etiquettesPersonnalisees.reglagesAuto";
export const LIEN_PAYPAL_SOUTIEN = "https://www.paypal.com/paypalme/45oJuke";
export const COLONNES_CSV = ["artiste", "titre_face_a", "titre_face_b"];
export const MAX_MODELES_SECONDAIRES = 10;
export const MAX_MODELES_ACCUEIL = 15;
export const ETAPES_ASSISTANT = ["organisation", "reglages", "donnees", "texte", "ruban", "cote", "decor", "favoris"];
export const LIMITES_DIMENSIONS = {
  largeurEtiquette: { min: 50, max: 100, defaut: DIMENSIONS_ETIQUETTE_DEFAUT.largeur, message: "La largeur doit être comprise entre 50 et 100." },
  hauteurEtiquette: { min: 20, max: 40, defaut: DIMENSIONS_ETIQUETTE_DEFAUT.hauteur, message: "La hauteur doit être comprise entre 20 et 40." },
};
