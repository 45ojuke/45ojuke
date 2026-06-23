import { couleurLisible, couleurTexteContraste, dessinerEtiquette } from "./etiquettes.js";
import { initialiserOptionsAbsentesPourImport, preparerReglagesPourExport } from "./export-style.js";
import {
  capacitesModeles,
  chargerStylesEtiquettes,
  combosSurprise,
  modelesParTheme,
  obtenirStyleEtiquette,
  obtenirStylesEtiquettes,
  palettesVariantesModernes,
  presets,
  presetsMarques,
  themesModeles,
} from "./modeles.js";
import {
  CLE_CSV_LOCAL,
  CLE_FAVORIS,
  CLE_FAVORIS_ANCIENNE_VERSION,
  CLE_LANGUE,
  CLE_REGLAGES_AUTOMATIQUES,
  DIMENSIONS_ETIQUETTE_DEFAUT,
  ETAPES_ASSISTANT,
  LIEN_PAYPAL_SOUTIEN,
  LIMITES_DIMENSIONS,
  MAX_MODELES_ACCUEIL,
  MAX_MODELES_SECONDAIRES,
} from "./reglages.js";
import { parserCsvVinyles, serialiserCsvVinyles } from "./csv.js";
import { creerGestionFavoris } from "./favoris.js";
import {
  OPTIONS_MOTIFS_SECONDAIRES,
  aidesOptions,
  phrasesInterface,
  traductions,
} from "./traductions.js";
import {
  calculerDispositionImpression,
  preparerLignesSortie,
  telechargerPdf as telechargerPdfModule,
} from "./impression.js";
import { envoyerJsonStyle } from "./analytics.js";
import { chargerPolicesLocales, normaliserIdPolice, normaliserStylePolice, remplirSelectPolice, stylesPolice } from "./polices.js";

const EMAIL_CONTACT = "contact@45ojuke.fr";
const EPAISSEUR_BORDURE_MIN = 0;
const LIEN_FACEBOOK_CONTACT = "https://www.facebook.com/45.O.Juke/";
const MOTIFS_DECOR_VARIANTES = ["grille", "rayures", "points", "diagonales", "chevrons", "croisillons", "vagues"];
const REPARTITION_DECOR_VARIANTES = ["aucun", "aucun", "aucun", "aucun", "aucun", "aucun", "ruban", "ruban", "fond", "fond", "deux"];
const CLE_POSITION_FOND_INTRO = "45ojuke.positionFondIntro.v2";
const MEDIA_MOBILE = window.matchMedia("(max-width: 860px)");
const MEDIA_SURVOL_PRECIS = window.matchMedia("(hover: hover) and (pointer: fine)");
const LIMITE_TAILLE_TITRES = 200;
const LIMITE_TAILLE_ARTISTE = 200;
const PIXELS_CSS_PAR_MM = 96 / 25.4;
const PIXELS_APERCU_PAR_MM_MAX = 12;

const elements = {
  intro: document.querySelector("#intro"),
  introFond: document.querySelector("#introFond"),
  boutonCommencer: document.querySelector("#boutonCommencer"),
  titreIntro: document.querySelector("#titreIntro"),
  sousTitreIntro: document.querySelector("#sousTitreIntro"),
  boutonsLangue: document.querySelectorAll(".drapeau"),
  boutonAPropos: document.querySelector("#boutonAPropos"),
  topActions: document.querySelector("#topActions"),
  menuMobileToggle: document.querySelector("#menuMobileToggle"),
  menuMobileActions: document.querySelector("#menuMobileActions"),
  fermerAPropos: document.querySelector("#fermerAPropos"),
  aboutModal: document.querySelector("#aboutModal"),
  ouvrirLicenceComplete: document.querySelector("#ouvrirLicenceComplete"),
  fermerLicenceComplete: document.querySelector("#fermerLicenceComplete"),
  licenceCompleteModal: document.querySelector("#licenceCompleteModal"),
  ouvrirConfidentialite: document.querySelector("#ouvrirConfidentialite"),
  ouvrirConfidentialiteMenu: document.querySelector("#ouvrirConfidentialiteMenu"),
  fermerConfidentialite: document.querySelector("#fermerConfidentialite"),
  confidentialiteModal: document.querySelector("#confidentialiteModal"),
  zoomApercu: document.querySelector("#zoomApercu"),
  diminuerZoomApercu: document.querySelector("#diminuerZoomApercu"),
  augmenterZoomApercu: document.querySelector("#augmenterZoomApercu"),
  valeurZoomApercu: document.querySelector("#valeurZoomApercu"),
  zoomApercuTailleReelle: document.querySelector("#zoomApercuTailleReelle"),
  regleApercu: document.querySelector("#regleApercu"),
  nombresRegleApercu: document.querySelector("#nombresRegleApercu"),
  restaurationAccueil: document.querySelector("#restaurationAccueil"),
  dateRestauration: document.querySelector("#dateRestauration"),
  restaurerReglagesAuto: document.querySelector("#restaurerReglagesAuto"),
  formulaire: document.querySelector("#formulaire"),
  assistantReglages: document.querySelector("#assistantReglages"),
  assistantEtape: document.querySelector("#assistantEtape"),
  assistantTitre: document.querySelector("#assistantTitre"),
  assistantAide: document.querySelector("#assistantAide"),
  assistantNavigation: document.querySelector("#assistantNavigation"),
  assistantPrecedent: document.querySelector("#assistantPrecedent"),
  assistantSuivant: document.querySelector("#assistantSuivant"),
  nombreEtiquettes: document.querySelector("#nombreEtiquettes"),
  modeModificationEtiquettes: document.querySelectorAll('input[name="modeModificationEtiquettes"]'),
  panneauxReglages: document.querySelectorAll("[data-tab-panel]"),
  ouvrirSoutien: document.querySelector("#ouvrirSoutien"),
  ouvrirSoutienMenu: document.querySelector("#ouvrirSoutienMenu"),
  installerApp: document.querySelector("#installerApp"),
  installerAppMenu: document.querySelector("#installerAppMenu"),
  miseEnAvantSecondaire: document.querySelector("#miseEnAvantSecondaire"),
  deuxiemeEtiquette: document.querySelectorAll('input[name="deuxiemeEtiquette"]'),
  blocGalerieSecondaire: document.querySelector("#blocGalerieSecondaire"),
  galerieModelesSecondaires: document.querySelector("#galerieModelesSecondaires"),
  modelesSecondairesPrecedent: document.querySelector("#modelesSecondairesPrecedent"),
  modelesSecondairesSuivant: document.querySelector("#modelesSecondairesSuivant"),
  galerieModelesAccueil: document.querySelector("#galerieModelesAccueil"),
  modelesAccueilPrecedent: document.querySelector("#modelesAccueilPrecedent"),
  modelesAccueilSuivant: document.querySelector("#modelesAccueilSuivant"),
  accueilApercu: document.querySelector("#accueilApercu"),
  heroSiteContenu: document.querySelector(".hero-site__contenu"),
  scene: document.querySelector(".scene"),
  sceneEntete: document.querySelector("#sceneEntete"),
  actionsApercu: document.querySelector("#actionsApercu"),
  verrouillerStyle: document.querySelector("#verrouillerStyle"),
  apercu: document.querySelector("#apercu"),
  apercuSecondaire: document.querySelector("#apercuSecondaire"),
  apercus: document.querySelector(".apercus"),
  indicateurSwipePrecedent: document.querySelector("#indicateurSwipePrecedent"),
  indicateurSwipeSuivant: document.querySelector("#indicateurSwipeSuivant"),
  navigationApercu: document.querySelector("#navigationApercu"),
  editionTexte: document.querySelector("#editionTexte"),
  editionTexteEtat: document.querySelector("#editionTexteEtat"),
  editionTextePrecedent: document.querySelector("#editionTextePrecedent"),
  editionTexteSuivant: document.querySelector("#editionTexteSuivant"),
  aideSwipeMobile: document.querySelector("#aideSwipeMobile"),
  basculerEditionTexteMobile: document.querySelector("#basculerEditionTexteMobile"),
  aideSelectionEtiquette: document.querySelector("#aideSelectionEtiquette"),
  changerEtiquetteMobile: document.querySelector("#changerEtiquetteMobile"),
  selecteurEtiquette: document.querySelector("#selecteurEtiquette"),
  editionEtiquette: document.querySelectorAll('input[name="editionEtiquette"]'),
  modele: document.querySelector("#modele"),
  modeleSecondaire: document.querySelector("#modeleSecondaire"),
  couleur1: document.querySelector("#couleur1"),
  couleur2: document.querySelector("#couleur2"),
  couleur3: document.querySelector("#couleur3"),
  couleurRuban: document.querySelector("#couleurRuban"),
  couleurVignette: document.querySelector("#couleurVignette"),
  couleurFondModerne: document.querySelector("#couleurFondModerne"),
  couleurBandeGauche: document.querySelector("#couleurBandeGauche"),
  couleurBandeDroite: document.querySelector("#couleurBandeDroite"),
  couleurTitreFaceA: document.querySelector("#couleurTitreFaceA"),
  couleurTitreFaceB: document.querySelector("#couleurTitreFaceB"),
  couleurArtiste: document.querySelector("#couleurArtiste"),
  decorPanel: document.querySelector("#decorPanel"),
  activerMotif: document.querySelector("#activerMotif"),
  activerVignettage: document.querySelector("#activerVignettage"),
  activerPatine: document.querySelector("#activerPatine"),
  boutonMotif: document.querySelector("#boutonMotif"),
  boutonVignettage: document.querySelector("#boutonVignettage"),
  boutonPatine: document.querySelector("#boutonPatine"),
  intensitePatine: document.querySelector("#intensitePatine"),
  angle: document.querySelector("#angle"),
  intensite: document.querySelector("#intensite"),
  motifType: document.querySelector("#motifType"),
  motifFond: document.querySelector("#motifFond"),
  motifRuban: document.querySelector("#motifRuban"),
  motifRubanType: document.querySelector("#motifRubanType"),
  couleurMotif: document.querySelector("#couleurMotif"),
  motif: document.querySelector("#motif"),
  angleMotif: document.querySelector("#angleMotif"),
  couleurMotifRuban: document.querySelector("#couleurMotifRuban"),
  opaciteMotifRuban: document.querySelector("#opaciteMotifRuban"),
  angleMotifRuban: document.querySelector("#angleMotifRuban"),
  afficherTraitsModernes: document.querySelector("#afficherTraitsModernes"),
  motifTraitsModernes: document.querySelector("#motifTraitsModernes"),
  motifSecondaireFond: document.querySelector("#motifSecondaireFond"),
  motifSecondaireRuban: document.querySelector("#motifSecondaireRuban"),
  couleurTraitsModernes: document.querySelector("#couleurTraitsModernes"),
  opaciteTraitsModernes: document.querySelector("#opaciteTraitsModernes"),
  angleTraitsModernes: document.querySelector("#angleTraitsModernes"),
  modeVignette: document.querySelector("#modeVignette"),
  vignette: document.querySelector("#vignette"),
  bordure: document.querySelector("#bordure"),
  bordureHorizontale: document.querySelector("#bordureHorizontale"),
  bordureVerticale: document.querySelector("#bordureVerticale"),
  arrondiInterieurBordure: document.querySelector("#arrondiInterieurBordure"),
  reglageArrondiBordure: document.querySelector("[data-reglage-arrondi-bordure]"),
  largeurRuban: document.querySelector("#largeurRuban"),
  hauteurRuban: document.querySelector("#hauteurRuban"),
  afficherEtoiles: document.querySelector("#afficherEtoiles"),
  nombreEtoiles: document.querySelector("#nombreEtoiles"),
  dispositionEtoiles: document.querySelector("#dispositionEtoiles"),
  courbureEtoiles: document.querySelector("#courbureEtoiles"),
  positionHorizontaleEtoiles: document.querySelector("#positionHorizontaleEtoiles"),
  positionVerticaleEtoiles: document.querySelector("#positionVerticaleEtoiles"),
  etendueEtoiles: document.querySelector("#etendueEtoiles"),
  tailleEtoiles: document.querySelector("#tailleEtoiles"),
  couleurFondEtoiles: document.querySelector("#couleurFondEtoiles"),
  hauteurBande: document.querySelector("#hauteurBande"),
  epaisseurTraitsLEON: document.querySelector("#epaisseurTraitsLEON"),
  positionTraitsLEON: document.querySelector("#positionTraitsLEON"),
  ecartTraitsLEON: document.querySelector("#ecartTraitsLEON"),
  tailleTrianglesJEAN: document.querySelector("#tailleTrianglesJEAN"),
  modifierTextesMiseEnPage: document.querySelector("#modifierTextesMiseEnPage"),
  reglagesTextePrincipaux: document.querySelector("#reglagesTextePrincipaux"),
  reglagesTexteMiseEnPage: document.querySelector("#reglagesTexteMiseEnPage"),
  tailleBandeGauche: document.querySelector("#tailleBandeGauche"),
  angleBandeGauche: document.querySelector("#angleBandeGauche"),
  tailleBandeDroite: document.querySelector("#tailleBandeDroite"),
  angleBandeDroite: document.querySelector("#angleBandeDroite"),
  policeTitres: document.querySelector("#policeTitres"),
  policeArtiste: document.querySelector("#policeArtiste"),
  tailleTitres: document.querySelector("#tailleTitres"),
  tailleArtiste: document.querySelector("#tailleArtiste"),
  styleTitres: document.querySelector("#styleTitres"),
  styleArtiste: document.querySelector("#styleArtiste"),
  guillemetsTitres: document.querySelector("#guillemetsTitres"),
  retourLigneTitres: document.querySelector("#retourLigneTitres"),
  reglageRetourLigneTitres: document.querySelector("#reglageRetourLigneTitres"),
  decalageRetro: document.querySelector("#decalageRetro"),
  irregulariteCaracteres: document.querySelector("#irregulariteCaracteres"),
  deplacementTextesManuel: document.querySelector("#deplacementTextesManuel"),
  reglagesDeplacementTextes: document.querySelector("#reglagesDeplacementTextes"),
  decalageTitreAX: document.querySelector("#decalageTitreAX"),
  decalageTitreAY: document.querySelector("#decalageTitreAY"),
  decalageArtisteX: document.querySelector("#decalageArtisteX"),
  decalageArtisteY: document.querySelector("#decalageArtisteY"),
  decalageTitreBX: document.querySelector("#decalageTitreBX"),
  decalageTitreBY: document.querySelector("#decalageTitreBY"),
  afficherMarques: document.querySelector("#afficherMarques"),
  groupeMarques: document.querySelector("#groupeMarques"),
  reglagesMarques: document.querySelectorAll("[data-marque-reglage]"),
  reglagesDecor: document.querySelectorAll("[data-decor-panel]"),
  reglagesMotif: document.querySelectorAll("[data-motif-reglage]"),
  reglagesTraitsModernes: document.querySelectorAll("[data-traits-modernes-reglage]"),
  reglagesVignette: document.querySelectorAll("[data-vignette-reglage]"),
  reglagesMotifRuban: document.querySelectorAll("[data-motif-ruban-reglage]"),
  reglagesMotifRubanDetails: document.querySelectorAll("[data-motif-ruban-details]"),
  champsModele: document.querySelectorAll("[data-modele-visible]"),
  champsMasquesModele: document.querySelectorAll("[data-modele-masque]"),
  champsCapaciteModele: document.querySelectorAll("[data-capacite-modele]"),
  reglagesEtoiles: document.querySelectorAll("[data-reglage-etoiles]"),
  reglageCourbureEtoiles: document.querySelector("[data-reglage-courbure-etoiles]"),
  valeursRange: document.querySelectorAll("[data-range-value]"),
  presetMarques: document.querySelector("#presetMarques"),
  couleurMarques: document.querySelector("#couleurMarques"),
  formePastille: document.querySelector("#formePastille"),
  diametrePastille: document.querySelector("#diametrePastille"),
  marqueGauche: document.querySelector("#marqueGauche"),
  marqueDroite: document.querySelector("#marqueDroite"),
  policeMarques: document.querySelector("#policeMarques"),
  marquesVerticales: document.querySelector("#marquesVerticales"),
  synchroniserMarques: document.querySelector("#synchroniserMarques"),
  reglagesMarquesCommuns: document.querySelectorAll("[data-marque-commun]"),
  reglagesMarquesSepares: document.querySelectorAll("[data-marque-separe]"),
  marqueGaucheTexte: document.querySelector("#marqueGaucheTexte"),
  marqueDroiteTexte: document.querySelector("#marqueDroiteTexte"),
  couleurMarqueGauche: document.querySelector("#couleurMarqueGauche"),
  couleurMarqueDroite: document.querySelector("#couleurMarqueDroite"),
  formePastilleGauche: document.querySelector("#formePastilleGauche"),
  formePastilleDroite: document.querySelector("#formePastilleDroite"),
  policeMarqueGauche: document.querySelector("#policeMarqueGauche"),
  policeMarqueDroite: document.querySelector("#policeMarqueDroite"),
  styleMarqueGauche: document.querySelector("#styleMarqueGauche"),
  styleMarqueDroite: document.querySelector("#styleMarqueDroite"),
  tailleMarqueGauche: document.querySelector("#tailleMarqueGauche"),
  tailleMarqueDroite: document.querySelector("#tailleMarqueDroite"),
  diametrePastilleGauche: document.querySelector("#diametrePastilleGauche"),
  diametrePastilleDroite: document.querySelector("#diametrePastilleDroite"),
  angleMarqueGauche: document.querySelector("#angleMarqueGauche"),
  angleMarqueDroite: document.querySelector("#angleMarqueDroite"),
  positionMarqueGauche: document.querySelector("#positionMarqueGauche"),
  positionMarqueDroite: document.querySelector("#positionMarqueDroite"),
  hauteurMarqueGauche: document.querySelector("#hauteurMarqueGauche"),
  hauteurMarqueDroite: document.querySelector("#hauteurMarqueDroite"),
  positionMarques: document.querySelector("#positionMarques"),
  hauteurMarques: document.querySelector("#hauteurMarques"),
  angleMarques: document.querySelector("#angleMarques"),
  tailleMarques: document.querySelector("#tailleMarques"),
  limiterMarquesBandeSurprise: document.querySelector("#limiterMarquesBandeSurprise"),
  largeurEtiquette: document.querySelector("#largeurEtiquette"),
  hauteurEtiquette: document.querySelector("#hauteurEtiquette"),
  messageDimensions: document.querySelector("#messageDimensions"),
  statutCsv: document.querySelector("#statutCsv"),
  importStyleFile: document.querySelector("#importStyleFile"),
  importSauvegardeFile: document.querySelector("#importSauvegardeFile"),
  exporterSauvegardeDonnees: document.querySelector("#exporterSauvegardeDonnees"),
  importerSauvegardeDonnees: document.querySelector("#importerSauvegardeDonnees"),
  exporterSauvegardeFavoris: document.querySelector("#exporterSauvegardeFavoris"),
  importerSauvegardeFavoris: document.querySelector("#importerSauvegardeFavoris"),
  importerStyleDonnees: document.querySelector("#importerStyleDonnees"),
  copierReglagesDonnees: document.querySelector("#copierReglagesDonnees"),
  importCsv: document.querySelector("#importCsv"),
  choisirCsv: document.querySelector("#choisirCsv"),
  choisirCsvSauvegarde: document.querySelector("#choisirCsvSauvegarde"),
  ouvrirTableauCsv: document.querySelector("#ouvrirTableauCsv"),
  ouvrirTableauCsvApercu: document.querySelector("#ouvrirTableauCsvApercu"),
  exporterCsv: document.querySelector("#exporterCsv"),
  exporterCsvSauvegarde: document.querySelector("#exporterCsvSauvegarde"),
  texteFaceA: document.querySelector("#texteFaceA"),
  texteArtiste: document.querySelector("#texteArtiste"),
  texteFaceB: document.querySelector("#texteFaceB"),
  copierReglagesFavoris: document.querySelector("#copierReglagesFavoris"),
  importerReglagesFavoris: document.querySelector("#importerReglagesFavoris"),
  aimerReglage: document.querySelector("#aimerReglage"),
  ouvrirFavoris: document.querySelector("#ouvrirFavoris"),
  listeFavoris: document.querySelector("#listeFavoris"),
  imprimer: document.querySelector("#imprimer"),
  annulerReglage: document.querySelector("#annulerReglage"),
  retablirReglage: document.querySelector("#retablirReglage"),
  reinitialiserReglage: document.querySelector("#reinitialiserReglage"),
  inverser: document.querySelector("#inverser"),
  teinte: document.querySelector("#teinte"),
  precedent: document.querySelector("#precedent"),
  suivant: document.querySelector("#suivant"),
  etat: document.querySelector("#etat"),
  statutPlanche: document.querySelector("#statutPlanche"),
};

const PALETTES_TEINTES = [
  { nom: "rouge", cadre: "#9f1d24", fondHaut: "#fff7df", fondBas: "#f3d59b", ruban: "#b8242e", vignette: "#7c151b", motif: "#8b1a20", secondaire: "#d0a24d", titre: "#5c1015", artiste: "#fff7df", marques: "#fff0c0" },
  { nom: "rouge-vif", cadre: "#d71920", fondHaut: "#fff5e8", fondBas: "#ffc9bd", ruban: "#ef233c", vignette: "#a50f1b", motif: "#d71920", secondaire: "#ff8a3d", titre: "#8f1018", artiste: "#fffdf8", marques: "#ffe0a8" },
  { nom: "rouge-electrique", cadre: "#ff1744", fondHaut: "#fff3f5", fondBas: "#ffb3c1", ruban: "#ff2d55", vignette: "#c90035", motif: "#ff1744", secondaire: "#ff9f1c", titre: "#a8002d", artiste: "#ffffff", marques: "#ffe66d" },
  { nom: "vert", cadre: "#176a46", fondHaut: "#fff6dc", fondBas: "#d9c47a", ruban: "#1f7a53", vignette: "#125439", motif: "#176a46", secondaire: "#b49543", titre: "#103f2c", artiste: "#fff7df", marques: "#f1dd91" },
  { nom: "vert-vif", cadre: "#008f5a", fondHaut: "#f2fff8", fondBas: "#a7f3c8", ruban: "#00a86b", vignette: "#006b43", motif: "#008f5a", secondaire: "#f2b705", titre: "#005638", artiste: "#ffffff", marques: "#fff176" },
  { nom: "vert-electrique", cadre: "#00b84a", fondHaut: "#effff3", fondBas: "#8df5ae", ruban: "#00d05a", vignette: "#008c38", motif: "#00b84a", secondaire: "#ffd600", titre: "#006d2a", artiste: "#071b0d", marques: "#f5ff70" },
  { nom: "bleu", cadre: "#1e4f85", fondHaut: "#fff5dd", fondBas: "#d6bd78", ruban: "#285f96", vignette: "#173f69", motif: "#1e4f85", secondaire: "#b78f3e", titre: "#14365c", artiste: "#fff7df", marques: "#efd487" },
  { nom: "bleu-vif", cadre: "#0067d9", fondHaut: "#f2f8ff", fondBas: "#a9d4ff", ruban: "#087ff5", vignette: "#004da8", motif: "#0067d9", secondaire: "#ffb000", titre: "#00418d", artiste: "#ffffff", marques: "#ffe47a" },
  { nom: "bleu-electrique", cadre: "#0057ff", fondHaut: "#f0f5ff", fondBas: "#93bcff", ruban: "#0077ff", vignette: "#003dcc", motif: "#0057ff", secondaire: "#ff9d00", titre: "#0036a3", artiste: "#ffffff", marques: "#ffea61" },
  { nom: "violet", cadre: "#64356f", fondHaut: "#fff4dc", fondBas: "#d5b978", ruban: "#76407d", vignette: "#4f2857", motif: "#64356f", secondaire: "#b68a3d", titre: "#3d2145", artiste: "#fff7df", marques: "#efd182" },
  { nom: "violet-vif", cadre: "#8125d6", fondHaut: "#fbf3ff", fondBas: "#d7b2ff", ruban: "#9635e8", vignette: "#5e149f", motif: "#8125d6", secondaire: "#ff9f1c", titre: "#501080", artiste: "#ffffff", marques: "#ffe27a" },
  { nom: "violet-electrique", cadre: "#9d00ff", fondHaut: "#fcf2ff", fondBas: "#e2a6ff", ruban: "#b000ff", vignette: "#7200bd", motif: "#9d00ff", secondaire: "#ffb000", titre: "#63009e", artiste: "#ffffff", marques: "#fff06a" },
  { nom: "orange", cadre: "#a44d1f", fondHaut: "#fff4dc", fondBas: "#d9bd76", ruban: "#b85c24", vignette: "#7b3517", motif: "#a44d1f", secondaire: "#9c6f32", titre: "#663016", artiste: "#fff7df", marques: "#efd48a" },
  { nom: "orange-vif", cadre: "#e85d04", fondHaut: "#fff7ed", fondBas: "#ffd09e", ruban: "#f97316", vignette: "#b83f00", motif: "#e85d04", secondaire: "#d9a000", titre: "#963800", artiste: "#ffffff", marques: "#fff176" },
  { nom: "orange-electrique", cadre: "#ff5a00", fondHaut: "#fff5eb", fondBas: "#ffbd73", ruban: "#ff7100", vignette: "#cc3d00", motif: "#ff5a00", secondaire: "#ffc400", titre: "#a83200", artiste: "#ffffff", marques: "#fff35c" },
  { nom: "jaune", cadre: "#8a6a1f", fondHaut: "#fff2d1", fondBas: "#d0ad4f", ruban: "#9a7622", vignette: "#6d5319", motif: "#8a6a1f", secondaire: "#725426", titre: "#513f16", artiste: "#fff7df", marques: "#e7c15d" },
  { nom: "jaune-vif", cadre: "#d59a00", fondHaut: "#fffced", fondBas: "#ffe875", ruban: "#f2b800", vignette: "#a87500", motif: "#d59a00", secondaire: "#ff6b00", titre: "#765300", artiste: "#2b2100", marques: "#fff7a8" },
  { nom: "jaune-electrique", cadre: "#f2c500", fondHaut: "#ffffed", fondBas: "#fff45c", ruban: "#ffdf00", vignette: "#bd9500", motif: "#f2c500", secondaire: "#ff5c00", titre: "#6f5900", artiste: "#211d00", marques: "#fffbc2" },
  { nom: "rose", cadre: "#a21d5d", fondHaut: "#fff4e5", fondBas: "#e6b77c", ruban: "#bd2f74", vignette: "#7c1747", motif: "#a21d5d", secondaire: "#b47b35", titre: "#65143d", artiste: "#fff7df", marques: "#efd08b" },
  { nom: "rose-vif", cadre: "#d41473", fondHaut: "#fff2f8", fondBas: "#ffadd4", ruban: "#ec238a", vignette: "#a40b55", motif: "#d41473", secondaire: "#ff9f1c", titre: "#8d094c", artiste: "#ffffff", marques: "#ffe16f" },
  { nom: "rose-electrique", cadre: "#ff007f", fondHaut: "#fff0f7", fondBas: "#ff9acb", ruban: "#ff1493", vignette: "#c70068", motif: "#ff007f", secondaire: "#ffb000", titre: "#a50057", artiste: "#ffffff", marques: "#fff06a" },
  { nom: "turquoise", cadre: "#0f6f78", fondHaut: "#fff6df", fondBas: "#d4bd75", ruban: "#16828c", vignette: "#0b5961", motif: "#0f6f78", secondaire: "#aa8c3f", titre: "#0b454b", artiste: "#fff7df", marques: "#ecd389" },
  { nom: "turquoise-vif", cadre: "#008c95", fondHaut: "#efffff", fondBas: "#96edf0", ruban: "#00a9b4", vignette: "#006b72", motif: "#008c95", secondaire: "#f4ad00", titre: "#005a61", artiste: "#ffffff", marques: "#fff27a" },
  { nom: "turquoise-electrique", cadre: "#00aeb8", fondHaut: "#edffff", fondBas: "#79f2ef", ruban: "#00ced1", vignette: "#007f87", motif: "#00aeb8", secondaire: "#ffb300", titre: "#006c72", artiste: "#042425", marques: "#f7ff70" },
  { nom: "indigo", cadre: "#34427d", fondHaut: "#fff5dd", fondBas: "#d7bd78", ruban: "#43519a", vignette: "#283363", motif: "#34427d", secondaire: "#b48f42", titre: "#222b55", artiste: "#fff7df", marques: "#efd489" },
  { nom: "bordeaux", cadre: "#7f2432", fondHaut: "#fff4dd", fondBas: "#d8b474", ruban: "#973044", vignette: "#641a27", motif: "#7f2432", secondaire: "#a87b38", titre: "#521622", artiste: "#fff7df", marques: "#ebcb80" },
  { nom: "menthe", cadre: "#2f7a55", fondHaut: "#fff7e1", fondBas: "#d8c07c", ruban: "#3d9368", vignette: "#235d40", motif: "#2f7a55", secondaire: "#b08c3e", titre: "#214c37", artiste: "#fff7df", marques: "#edd28a" },
  { nom: "marine", cadre: "#1f3f67", fondHaut: "#fff5dc", fondBas: "#d2b979", ruban: "#2b507c", vignette: "#182f4f", motif: "#1f3f67", secondaire: "#aa8640", titre: "#172d49", artiste: "#fff7df", marques: "#ecd18a" },
  { nom: "prune", cadre: "#70345d", fondHaut: "#fff4de", fondBas: "#d7b879", ruban: "#86406f", vignette: "#562848", motif: "#70345d", secondaire: "#ad843c", titre: "#48223d", artiste: "#fff7df", marques: "#ecd086" },
  { nom: "olive", cadre: "#69712a", fondHaut: "#fff4d8", fondBas: "#d0b565", ruban: "#7b8431", vignette: "#515720", motif: "#69712a", secondaire: "#8b6b30", titre: "#414719", artiste: "#fff7df", marques: "#e2c36c" },
  { nom: "corail", cadre: "#b04434", fondHaut: "#fff4df", fondBas: "#ddb477", ruban: "#c45140", vignette: "#843126", motif: "#b04434", secondaire: "#a97736", titre: "#6e2b22", artiste: "#fff7df", marques: "#ebcc83" },
  { nom: "ardoise", cadre: "#4d5865", fondHaut: "#fff5df", fondBas: "#d1bb7b", ruban: "#5d6876", vignette: "#3b444f", motif: "#4d5865", secondaire: "#a78643", titre: "#343c45", artiste: "#fff7df", marques: "#ead088" },
];

let vinyles = [];
let indexApercu = 0;
let etiquetteActive = "1";
let modeModificationEtiquettes = "toutes";
let stylesVerrouillesParLigne = {};
let reglagesParLigne = {};
let modeleChoisi = false;
let chargementReglages = false;
let temporisateurRedimensionnement = null;
let temporisateurAnimationApercu = null;
let frameAnimationApercu = null;
let gesteApercu = null;
let signatureDerniereVarianteCouleur = "";
let cycleVarianteBouton = null;
let indexTeinteActif = -1;
let ignorerProchainClicApercu = false;
let etapeReglageActive = "reglages";
const reglagesParEtiquette = {
  1: null,
  2: null,
};
const reglagesDefautParModele = new Map();
const modelesAccueilMelanges = new Map();
const MAX_MODELES_ACCUEIL_AVEC_TEASERS = Math.max(1, MAX_MODELES_ACCUEIL - 2);
let pageModelesSecondaires = 0;
let pageAccueilModeles = 0;
let rendreTableauCsvActif = null;
let ordreOriginalVinyles = [];
let vinylesReferenceOrganisation = [];
let langueActive = lireLangueMemorisee() || document.documentElement.lang || "fr";
let bulleAideActive = null;
let favorisOuverts = false;
let invitationInstallation = null;
let dernierToucherZoom = 0;
let zoomApercuPourcentage = null;
let zoomApercuMaximum = 200;
const LIMITE_HISTORIQUE_REGLAGES = 40;
const historiqueReglages = {
  annulations: [],
  retablissements: [],
  instantanesControle: new WeakMap(),
  restaurationEnCours: false,
};
const minuteriesMessageVerrouillage = new WeakMap();

initialiser();

async function initialiser() {
  desactiverServiceWorkerEtCaches();
  installerFondIntroMobile();
  appliquerLangueSite(langueActive, { memoriser: false });
  document.body.classList.add("is-accueil-selection");
  appliquerDimensionsEtiquetteDefaut();
  await chargerStylesEtiquettes();
  remplirMenusPolices();
  await chargerPolicesLocales();
  remplirModelesTheme();
  synchroniserOptionsMotifSecondaire();
  initialiserReglagesDefautModeles();
  const modeleInitial = obtenirStylesEtiquettes("tout")[0]?.reglages?.modele || "ALICE";
  appliquerReglagesAuFormulaire(obtenirReglagesDefautModele(modeleInitial));
  reglagesParEtiquette[1] = lireReglagesFormulaire();
  brancherEvenements();
  installerAidesOptions();
  mettreAJourBoutonsInstallation(true);
  await chargerBibliotheque();
  elements.nombreEtiquettes.value = String(Math.max(1, vinyles.length));
  mettreAJourGalerieModeles();
  mettreAJour();
  afficherFavoris();
}


function appliquerDimensionsEtiquetteDefaut() {
  const { largeur, hauteur } = DIMENSIONS_ETIQUETTE_DEFAUT;
  elements.largeurEtiquette.value = String(largeur);
  elements.hauteurEtiquette.value = String(hauteur);
  document.documentElement.style.setProperty("--ratio-etiquette", `${largeur} / ${hauteur}`);
  document.documentElement.style.setProperty("--largeur-etiquette-defaut-mm", `${largeur}mm`);
  document.documentElement.style.setProperty("--hauteur-etiquette-defaut-mm", `${hauteur}mm`);
}

function brancherEvenements() {
  brancherAccueilIntro();
  brancherRestaurationAccueil();
  document.addEventListener("click", (evenement) => {
    if (!evenement.target.closest(".aide-option, .aide-bulle")) {
      fermerBulleAide();
    }
    if (!evenement.target.closest("#topActions")) {
      fermerMenuActionsMobile();
    }
  });
  window.addEventListener("resize", fermerBulleAide);
  window.addEventListener("scroll", fermerBulleAide, true);
  bloquerZoomMobile();
  elements.formulaire.addEventListener("focusin", memoriserPointDepartControle);
  elements.formulaire.addEventListener("pointerdown", memoriserPointDepartControle);
  elements.formulaire.addEventListener("keydown", memoriserPointDepartControle);
  elements.panneauxReglages.forEach((panneau) => {
    panneau.addEventListener("pointerdown", (evenement) => {
      if (!panneau.classList.contains("is-verrouille")) {
        return;
      }
      evenement.preventDefault();
      afficherMessagePanneauVerrouille(panneau);
    });
    panneau.addEventListener("keydown", (evenement) => {
      if (
        panneau.classList.contains("is-verrouille")
        && ["Enter", " "].includes(evenement.key)
      ) {
        evenement.preventDefault();
        afficherMessagePanneauVerrouille(panneau);
      }
    });
  });
  brancherInteractionCurseursTactiles();
  brancherCransSurregimeTexte();
  elements.formulaire.addEventListener("input", (evenement) => {
    if (chargementReglages || evenement.target.closest("[data-configuration-etiquettes]")) {
      return;
    }
    enregistrerHistoriqueDepuisControle(evenement.target);
    appliquerReglagesMarquesALActivation(evenement.target);
    marquerCouleurTexteManuelle(evenement.target);
    actualiserCouleurMarquesAutomatiqueDepuisFormulaire();
    desactiverLimiteMarquesSurpriseSiModificationManuelle(evenement.target);
    if (evenement.target.closest("[data-marque-commun]")) {
      synchroniserValeursMarquesDepuisCommun();
    }
    enregistrerReglagesActifs();
    mettreAJour();
  });
  elements.formulaire.addEventListener("change", (evenement) => {
    if (chargementReglages || evenement.target.closest("[data-configuration-etiquettes]")) {
      return;
    }
    enregistrerHistoriqueDepuisControle(evenement.target);
    appliquerReglagesMarquesALActivation(evenement.target);
    marquerCouleurTexteManuelle(evenement.target);
    actualiserCouleurMarquesAutomatiqueDepuisFormulaire();
    desactiverLimiteMarquesSurpriseSiModificationManuelle(evenement.target);
    if ([
      elements.policeTitres,
      elements.policeArtiste,
      elements.policeMarques,
      elements.policeMarqueGauche,
      elements.policeMarqueDroite,
    ].includes(evenement.target)) {
      if (evenement.target === elements.policeMarques && elements.synchroniserMarques.checked) {
        elements.policeMarqueGauche.value = elements.policeMarques.value;
        elements.policeMarqueDroite.value = elements.policeMarques.value;
      }
      synchroniserTousStylesPolices();
    }
    if (evenement.target.closest("[data-marque-commun]")) {
      synchroniserValeursMarquesDepuisCommun();
    }
    enregistrerReglagesActifs();
    mettreAJourInterfaceConditionnelle(lireReglagesFormulaire());
    mettreAJour();
  });
  elements.modele.addEventListener("change", () => {
    afficherApercuApresChoixModele();
    appliquerPreset(elements.modele.value);
  });
  elements.galerieModelesSecondaires.addEventListener("click", choisirModeleSecondaireDepuisGalerie);
  elements.galerieModelesAccueil.addEventListener("click", choisirModeleDepuisAccueil);
  elements.modelesSecondairesPrecedent.addEventListener("click", () => changerPageModeles("secondaire", -1));
  elements.modelesSecondairesSuivant.addEventListener("click", () => changerPageModeles("secondaire", 1));
  elements.modelesAccueilPrecedent.addEventListener("click", () => changerPageModelesAccueil(-1));
  elements.modelesAccueilSuivant.addEventListener("click", () => changerPageModelesAccueil(1));
  elements.assistantPrecedent.addEventListener("click", () => naviguerAssistant(-1));
  elements.assistantSuivant.addEventListener("click", naviguerAssistantSuivant);
  elements.modeModificationEtiquettes.forEach((radio) => {
    radio.addEventListener("change", () => {
      modeModificationEtiquettes = obtenirModeModificationEtiquettes();
      sauvegarderReglagesAutomatiques();
    });
  });
  elements.deuxiemeEtiquette.forEach((radio) => {
    radio.addEventListener("change", changerActivationDeuxiemeEtiquette);
  });
  elements.modeleSecondaire.addEventListener("change", changerModeleSecondaire);
  elements.decorPanel.addEventListener("change", () => {
    enregistrerReglagesActifs();
    mettreAJour();
  });
  elements.boutonMotif.addEventListener("click", () => basculerDecor("motif"));
  elements.boutonVignettage.addEventListener("click", () => basculerDecor("vignette"));
  elements.boutonPatine.addEventListener("click", () => basculerDecor("patine"));
  elements.intensitePatine.addEventListener("input", synchroniserPatineDepuisIntensite);
  elements.afficherTraitsModernes.addEventListener("change", () => {
    if (
      elements.afficherTraitsModernes.checked
      && !elements.motifSecondaireFond.checked
      && !elements.motifSecondaireRuban.checked
    ) {
      elements.motifSecondaireFond.checked = true;
    }
    synchroniserOptionsMotifSecondaire();
    enregistrerReglagesActifs();
    mettreAJourInterfaceConditionnelle(lireReglagesFormulaire());
    mettreAJour();
  });
  elements.modifierTextesMiseEnPage.addEventListener("change", () => {
    mettreAJourReglagesTexteMiseEnPage();
    mettreAJourInterfaceConditionnelle(lireReglagesFormulaire());
  });
  elements.motifType.addEventListener("change", ajusterMotifVisible);
  elements.motifFond.addEventListener("change", ajusterMotifVisible);
  elements.motifRuban.addEventListener("change", ajusterMotifVisible);
  elements.motifRubanType.addEventListener("change", ajusterMotifVisible);
  elements.modeVignette.addEventListener("change", ajusterVignetteVisible);
  elements.presetMarques.addEventListener("change", appliquerPresetMarques);
  elements.synchroniserMarques.addEventListener("change", () => {
    synchroniserValeursMarquesDepuisCommun();
    mettreAJourInterfaceConditionnelle(lireReglagesFormulaire());
    enregistrerReglagesActifs();
    mettreAJour();
  });
  elements.editionEtiquette.forEach((radio) => {
    radio.addEventListener("change", changerEtiquetteActive);
  });
  elements.inverser.addEventListener("click", inverserStyle);
  elements.teinte.addEventListener("click", applyNextTint);
  elements.annulerReglage.addEventListener("click", annulerDerniereModification);
  elements.retablirReglage.addEventListener("click", retablirModification);
  elements.reinitialiserReglage.addEventListener("click", reinitialiserStyleDefaut);
  elements.copierReglagesFavoris.addEventListener("click", copierReglages);
  elements.copierReglagesDonnees.addEventListener("click", copierReglages);
  elements.importerReglagesFavoris.addEventListener("click", importerReglages);
  elements.importerStyleDonnees.addEventListener("click", importerReglages);
  elements.importStyleFile.addEventListener("change", importerReglagesDepuisFichier);
  [elements.exporterSauvegardeDonnees, elements.exporterSauvegardeFavoris].forEach((bouton) => {
    bouton.addEventListener("click", exporterSauvegardeSession);
  });
  [elements.importerSauvegardeDonnees, elements.importerSauvegardeFavoris].forEach((bouton) => {
    bouton.addEventListener("click", demanderImportSauvegardeSession);
  });
  elements.importSauvegardeFile.addEventListener("change", importerSauvegardeSessionDepuisFichier);
  elements.choisirCsv.addEventListener("click", demanderImportCsv);
  elements.choisirCsvSauvegarde.addEventListener("click", demanderImportCsv);
  elements.importCsv.addEventListener("change", importerCsvUtilisateur);
  elements.exporterCsv.addEventListener("click", exporterCsv);
  elements.exporterCsvSauvegarde.addEventListener("click", exporterCsv);
  elements.ouvrirTableauCsv.addEventListener("click", ouvrirTableauCsv);
  elements.ouvrirTableauCsvApercu.addEventListener("click", ouvrirTableauCsv);
  [elements.texteFaceA, elements.texteArtiste, elements.texteFaceB].forEach((champ) => {
    champ.addEventListener("input", modifierTexteApercu);
  });
  elements.aimerReglage.addEventListener("click", basculerFavori);
  elements.verrouillerStyle.addEventListener("click", basculerVerrouillageStyle);
  elements.ouvrirFavoris.addEventListener("click", ouvrirListeFavoris);
  elements.listeFavoris.addEventListener("click", gererActionFavori);
  elements.precedent.addEventListener("click", () => changerApercu(-1));
  elements.suivant.addEventListener("click", () => changerApercu(1));
  elements.indicateurSwipePrecedent.addEventListener("click", () => changerApercu(-1));
  elements.indicateurSwipeSuivant.addEventListener("click", () => changerApercu(1));
  elements.editionTextePrecedent.addEventListener("click", () => changerApercu(-1));
  elements.editionTexteSuivant.addEventListener("click", () => changerApercu(1));
  elements.aideSwipeMobile.addEventListener("click", () => afficherBulleAide(elements.aideSwipeMobile));
  elements.basculerEditionTexteMobile.addEventListener("click", basculerEditionTexteMobile);
  elements.imprimer.addEventListener("click", imprimer);
  elements.zoomApercu.addEventListener("input", () => definirZoomApercu(elements.zoomApercu.value));
  elements.diminuerZoomApercu.addEventListener("click", () => modifierZoomApercu(-10));
  elements.augmenterZoomApercu.addEventListener("click", () => modifierZoomApercu(10));
  elements.zoomApercuTailleReelle.addEventListener("click", () => definirZoomApercu(100));
  elements.ouvrirSoutien.addEventListener("click", ouvrirSoutien);
  elements.ouvrirSoutienMenu.addEventListener("click", ouvrirSoutien);
  elements.installerApp.addEventListener("click", installerApplication);
  elements.installerAppMenu.addEventListener("click", installerApplication);
  elements.apercu.addEventListener("click", () => selectionnerEtiquetteDepuisApercu("1"));
  elements.apercuSecondaire.addEventListener("click", () => selectionnerEtiquetteDepuisApercu("2"));
  elements.changerEtiquetteMobile.addEventListener("click", () => {
    selectionnerEtiquetteDepuisApercu(etiquetteActive === "1" ? "2" : "1", { ouvrirEditeur: false });
  });
  [elements.apercus, elements.editionTexte].forEach((zone) => {
    zone.addEventListener("pointerdown", demarrerGesteApercu);
    zone.addEventListener("pointerup", terminerGesteApercu);
    zone.addEventListener("pointercancel", annulerGesteApercu);
  });
  elements.apercus.addEventListener("dragstart", (evenement) => evenement.preventDefault());
  [elements.apercu, elements.apercuSecondaire].forEach((image) => {
    image.draggable = false;
    image.addEventListener("keydown", (evenement) => {
      if (evenement.key !== "Enter" && evenement.key !== " ") {
        return;
      }
      evenement.preventDefault();
      selectionnerEtiquetteDepuisApercu(image.dataset.apercuEtiquette);
    });
  });
  window.addEventListener("resize", () => {
    clearTimeout(temporisateurRedimensionnement);
    temporisateurRedimensionnement = setTimeout(() => {
      const editionTexteActive = champEditionTexteActif();
      placerMenuActionsMobile();
      if (!editionTexteActive) {
        placerEditeurTexteMobile(document.body.classList.contains("is-edition-texte-mobile"));
      }
      ajusterHauteurPanneauOptionsMobile();
      if (!editionTexteActive) {
        mettreAJour();
      }
    }, 120);
  });
  window.visualViewport?.addEventListener("resize", ajusterHauteurPanneauOptionsMobile);
  window.visualViewport?.addEventListener("scroll", ajusterHauteurPanneauOptionsMobile);
  window.addEventListener("beforeinstallprompt", (evenement) => {
    evenement.preventDefault();
    invitationInstallation = evenement;
    mettreAJourBoutonsInstallation(true);
  });
  window.addEventListener("appinstalled", () => {
    invitationInstallation = null;
    mettreAJourBoutonsInstallation(false);
  });
}

function brancherCranSurregimeTexte(input, limite) {
  let surregimeDebloque = false;
  let temporisateur = null;
  const reinitialiser = () => {
    surregimeDebloque = false;
    input.classList.remove("is-au-cran");
  };

  input.addEventListener("input", () => {
    const valeur = Number(input.value);
    if (valeur <= limite - 5) {
      reinitialiser();
      return;
    }
    if (valeur > limite && !surregimeDebloque) {
      input.value = String(limite);
      input.classList.add("is-au-cran");
      surregimeDebloque = true;
      clearTimeout(temporisateur);
      temporisateur = window.setTimeout(reinitialiser, 1200);
    }
  });
  input.addEventListener("pointerup", () => {
    if (Number(input.value) <= limite) {
      reinitialiser();
    }
  });
}

function brancherCransSurregimeTexte() {
  brancherCranSurregimeTexte(elements.tailleTitres, LIMITE_TAILLE_TITRES);
  brancherCranSurregimeTexte(elements.tailleArtiste, LIMITE_TAILLE_ARTISTE);
}

function bloquerZoomMobile() {
  ["gesturestart", "gesturechange", "gestureend"].forEach((nomEvenement) => {
    document.addEventListener(nomEvenement, (evenement) => evenement.preventDefault(), { passive: false });
  });
  document.addEventListener("dblclick", (evenement) => evenement.preventDefault(), { passive: false });
  document.addEventListener("touchend", (evenement) => {
    const maintenant = Date.now();
    if (maintenant - dernierToucherZoom < 320) {
      evenement.preventDefault();
    }
    dernierToucherZoom = maintenant;
  }, { passive: false });
}

function brancherRestaurationAccueil() {
  elements.restaurerReglagesAuto.addEventListener("click", restaurerReglagesAutomatiques);
}

function proposerRestaurationReglagesAutomatiques() {
  const sauvegarde = lireSauvegardeReglagesAutomatiques();
  if (!sauvegarde) {
    masquerOptionRestauration();
    return;
  }

  mettreAJourTexteRestauration(sauvegarde);
  elements.restaurationAccueil.hidden = false;
}

function mettreAJourTexteRestauration(sauvegarde = lireSauvegardeReglagesAutomatiques()) {
  if (!sauvegarde) {
    return;
  }
  const date = new Date(sauvegarde.sauvegardeLe);
  elements.dateRestauration.textContent = Number.isNaN(date.getTime())
    ? traduirePhrase("Vous pouvez reprendre votre dernière configuration.")
    : `${traduirePhrase("Dernière sauvegarde")} : ${date.toLocaleString(localeCourante(), { dateStyle: "short", timeStyle: "short" })}.`;
}

function restaurerReglagesAutomatiques() {
  const sauvegarde = lireSauvegardeReglagesAutomatiques();
  if (!sauvegarde) {
    masquerOptionRestauration();
    return;
  }

  try {
    const reglagesPrincipaux = normaliserReglagesImportes(sauvegarde.reglages?.["1"]);
    const reglagesSecondaires = sauvegarde.reglages?.["2"]
      ? normaliserReglagesImportes(sauvegarde.reglages["2"])
      : null;
    const secondeActive = Boolean(sauvegarde.deuxiemeEtiquetteActive && reglagesSecondaires);

    reglagesParEtiquette[1] = reglagesPrincipaux;
    reglagesParEtiquette[2] = secondeActive ? reglagesSecondaires : null;
    modeModificationEtiquettes = sauvegarde.modeModificationEtiquettes === "individuel" ? "individuel" : "toutes";
    elements.modeModificationEtiquettes.forEach((radio) => {
      radio.checked = radio.value === modeModificationEtiquettes;
    });
    stylesVerrouillesParLigne = { ...(sauvegarde.stylesVerrouillesParLigne || {}) };
    reglagesParLigne = Object.fromEntries(
      Object.entries(sauvegarde.reglagesParLigne || {}).map(([cle, reglages]) => [
        cle,
        normaliserReglagesImportes(reglages),
      ]),
    );
    synchroniserBoutonDeuxiemeEtiquette(secondeActive);
    if (secondeActive) {
      elements.modeleSecondaire.value = reglagesSecondaires.modele;
    }

    etiquetteActive = secondeActive && sauvegarde.etiquetteActive === "2" ? "2" : "1";
    elements.editionEtiquette.forEach((radio) => {
      radio.checked = radio.value === etiquetteActive;
    });
    appliquerReglagesAuFormulaire(lireReglages(etiquetteActive));
    afficherApercuApresChoixModele();
    quitterIntro();
    mettreAJourGalerieModeles();
    mettreAJour();
    sauvegarderReglagesAutomatiques();
    masquerOptionRestauration();
  } catch (erreur) {
    supprimerReglagesAutomatiques();
    masquerOptionRestauration();
    window.alert(erreur.message || traduirePhrase("Impossible de restaurer les réglages sauvegardés."));
  }
}

function masquerOptionRestauration() {
  elements.restaurationAccueil.hidden = true;
}

function lireSauvegardeReglagesAutomatiques() {
  try {
    const texte = localStorage.getItem(CLE_REGLAGES_AUTOMATIQUES);
    if (!texte) {
      return null;
    }
    const donnees = JSON.parse(texte);
    if (!donnees || typeof donnees !== "object" || !donnees.reglages?.["1"]) {
      return null;
    }
    return donnees;
  } catch {
    return null;
  }
}

function sauvegarderReglagesAutomatiques() {
  try {
    const reglagesActifs = styleActifVerrouille()
      ? reglagesParEtiquette[etiquetteActive]
      : lireReglagesFormulaire();
    const payload = {
      version: 1,
      sauvegardeLe: new Date().toISOString(),
      etiquetteActive,
      deuxiemeEtiquetteActive: deuxiemeEtiquetteActive(),
      modeModificationEtiquettes,
      stylesVerrouillesParLigne: { ...stylesVerrouillesParLigne },
      reglagesParLigne: clonerReglages(reglagesParLigne),
      reglages: {
        1: etiquetteActive === "1" ? reglagesActifs : reglagesParEtiquette[1],
        2: deuxiemeEtiquetteActive()
          ? (etiquetteActive === "2" ? reglagesActifs : reglagesParEtiquette[2])
          : null,
      },
    };
    localStorage.setItem(CLE_REGLAGES_AUTOMATIQUES, JSON.stringify(payload));
  } catch {
    // Le navigateur peut refuser localStorage en navigation privee ou si le quota est plein.
  }
}

function supprimerReglagesAutomatiques() {
  try {
    localStorage.removeItem(CLE_REGLAGES_AUTOMATIQUES);
  } catch {
    // localStorage indisponible : rien a nettoyer.
  }
}

function lireLangueMemorisee() {
  try {
    const langue = localStorage.getItem(CLE_LANGUE);
    return traductions[langue] ? langue : null;
  } catch {
    return null;
  }
}

function memoriserLangueChoisie(langue) {
  try {
    localStorage.setItem(CLE_LANGUE, langue);
  } catch {
    // localStorage peut etre indisponible selon le navigateur.
  }
}

function brancherAccueilIntro() {
  elements.boutonsLangue.forEach((drapeau) => {
    drapeau.addEventListener("click", () => {
      const langue = drapeau.dataset.lang || "fr";
      appliquerLangueSite(langue);
    });
  });

  elements.boutonCommencer.addEventListener("click", () => {
    quitterIntro();
  });

  elements.menuMobileToggle.addEventListener("click", (evenement) => {
    evenement.stopPropagation();
    basculerMenuActionsMobile();
  });
  elements.menuMobileActions.addEventListener("click", () => fermerMenuActionsMobile());
  elements.boutonAPropos.addEventListener("click", () => elements.aboutModal.showModal());
  elements.ouvrirConfidentialite.addEventListener("click", ouvrirConfidentialite);
  elements.ouvrirConfidentialiteMenu.addEventListener("click", ouvrirConfidentialite);
  elements.fermerAPropos.addEventListener("click", fermerAPropos);
  elements.ouvrirLicenceComplete.addEventListener("click", ouvrirLicenceComplete);
  elements.fermerLicenceComplete.addEventListener("click", fermerLicenceComplete);
  elements.fermerConfidentialite.addEventListener("click", fermerConfidentialite);
  elements.aboutModal.addEventListener("click", (evenement) => {
    if (evenement.target === elements.aboutModal) {
      fermerAPropos();
    }
  });
  elements.confidentialiteModal.addEventListener("click", (evenement) => {
    if (evenement.target === elements.confidentialiteModal) {
      fermerConfidentialite();
    }
  });
  elements.licenceCompleteModal.addEventListener("click", (evenement) => {
    if (evenement.target === elements.licenceCompleteModal) {
      fermerLicenceComplete();
    }
  });
  elements.aboutModal.addEventListener("cancel", (evenement) => {
    evenement.preventDefault();
    fermerAPropos();
  });
  elements.confidentialiteModal.addEventListener("cancel", (evenement) => {
    evenement.preventDefault();
    fermerConfidentialite();
  });
  elements.licenceCompleteModal.addEventListener("cancel", (evenement) => {
    evenement.preventDefault();
    fermerLicenceComplete();
  });
  document.addEventListener("keydown", (evenement) => {
    if (evenement.key === "Escape") {
      fermerMenuActionsMobile();
    }
    if (evenement.key === "Escape" && elements.aboutModal.open && !elements.licenceCompleteModal.open) {
      fermerAPropos();
    }
    if (evenement.key === "Escape" && elements.licenceCompleteModal.open) {
      fermerLicenceComplete();
    }
    if (evenement.key === "Escape" && elements.confidentialiteModal.open) {
      fermerConfidentialite();
    }
  });
}

function placerMenuActionsMobile() {
  if (!document.body.classList.contains("is-intro-active")) {
    elements.heroSiteContenu.append(elements.topActions);
    return;
  }
  if (elements.topActions.parentElement !== document.body) {
    document.body.insertBefore(elements.topActions, document.body.firstElementChild);
  }
}

function basculerMenuActionsMobile() {
  const ouvert = !elements.topActions.classList.contains("is-menu-ouvert");
  elements.topActions.classList.toggle("is-menu-ouvert", ouvert);
  elements.menuMobileToggle.setAttribute("aria-expanded", String(ouvert));
}

function fermerMenuActionsMobile() {
  elements.topActions.classList.remove("is-menu-ouvert");
  elements.menuMobileToggle.setAttribute("aria-expanded", "false");
}

function desactiverServiceWorkerEtCaches() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(() => {});
  }
  if ("caches" in window) {
    caches.keys()
      .then((cles) => Promise.all(cles.map((cle) => caches.delete(cle))))
      .catch(() => {});
  }
}

function mettreAJourBoutonsInstallation(visible) {
  const afficher = visible && !window.matchMedia("(display-mode: standalone)").matches;
  [elements.installerApp, elements.installerAppMenu].forEach((bouton) => {
    bouton.hidden = !afficher;
  });
}

async function installerApplication() {
  fermerMenuActionsMobile();
  if (!invitationInstallation) {
    window.alert(traduirePhrase("Pour installer l'application, utilisez le menu de votre navigateur puis choisissez Ajouter à l'écran d'accueil ou Installer l'application."));
    return;
  }
  const invitation = invitationInstallation;
  invitationInstallation = null;
  invitation.prompt();
  const choix = await invitation.userChoice.catch(() => null);
  mettreAJourBoutonsInstallation(choix?.outcome !== "accepted");
}

function positionFondIntroDefaut() {
  return { x: Number.MAX_SAFE_INTEGER, y: 50, scale: 1 };
}

function lirePositionFondIntro() {
  try {
    const position = JSON.parse(localStorage.getItem(CLE_POSITION_FOND_INTRO));
    if (!position || typeof position !== "object") {
      return positionFondIntroDefaut();
    }
    return {
      x: bornerNombre(Number(position.x), -300, 400, positionFondIntroDefaut().x),
      y: bornerNombre(Number(position.y), -300, 400, 50),
      scale: bornerNombre(Number(position.scale), 1, 1.7, 1),
    };
  } catch {
    return positionFondIntroDefaut();
  }
}

function contraindrePositionFondIntro(position) {
  const image = elements.introFond?.querySelector("img");
  const rect = elements.intro?.getBoundingClientRect();
  const largeurImage = image?.offsetWidth || rect?.width || 0;
  const hauteurImage = image?.offsetHeight || rect?.height || 0;
  const largeurConteneur = rect?.width || 0;
  const hauteurConteneur = rect?.height || 0;
  const scale = bornerNombre(Number(position.scale), 1, 1.7, 1);
  const positionBornee = {
    x: bornerNombre(Number(position.x), -300, 400, positionFondIntroDefaut().x),
    y: bornerNombre(Number(position.y), -300, 400, 50),
    scale,
  };

  const bornerAxe = (valeur, tailleConteneur, tailleImage) => {
    if (tailleConteneur <= 0 || tailleImage <= 0) {
      return bornerNombre(valeur, 0, 100, 50);
    }
    const tailleVisible = tailleImage * scale;
    if (tailleVisible <= tailleConteneur) {
      return 50;
    }
    const demiDebordement = ((tailleVisible - tailleConteneur) / 2 / tailleConteneur) * 100;
    return bornerNombre(valeur, 50 - demiDebordement, 50 + demiDebordement, 50);
  };

  positionBornee.x = bornerAxe(positionBornee.x, largeurConteneur, largeurImage);
  positionBornee.y = bornerAxe(positionBornee.y, hauteurConteneur, hauteurImage);
  return positionBornee;
}

function memoriserPositionFondIntro(position) {
  try {
    localStorage.setItem(CLE_POSITION_FOND_INTRO, JSON.stringify(position));
  } catch {
    // localStorage peut etre indisponible selon le mode de navigation.
  }
}

function bornerNombre(valeur, min, max, defaut) {
  if (!Number.isFinite(valeur)) {
    return defaut;
  }
  return Math.min(max, Math.max(min, valeur));
}

function appliquerPositionFondIntro(position) {
  Object.assign(position, contraindrePositionFondIntro(position));
  elements.intro.style.setProperty("--intro-bg-x", `${position.x}%`);
  elements.intro.style.setProperty("--intro-bg-y", `${position.y}%`);
  elements.intro.style.setProperty("--intro-bg-scale", String(position.scale));
  elements.intro.classList.add("is-fond-positionne");
}

function installerFondIntroMobile() {
  if (!elements.introFond) {
    return;
  }
  const position = lirePositionFondIntro();
  const pointeurs = new Map();
  let depart = null;

  const mesurerDistance = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  const memoriserDepart = () => {
    const actifs = Array.from(pointeurs.values());
    depart = {
      position: { ...position },
      pointeurs: actifs,
      distance: actifs.length >= 2 ? mesurerDistance(actifs[0], actifs[1]) : 0,
    };
  };

  const rafraichir = () => {
    appliquerPositionFondIntro(position);
    memoriserPositionFondIntro(position);
  };

  elements.introFond.addEventListener("pointerdown", (evenement) => {
    if (!MEDIA_MOBILE.matches) {
      return;
    }
    evenement.preventDefault();
    elements.introFond.setPointerCapture?.(evenement.pointerId);
    pointeurs.set(evenement.pointerId, evenement);
    memoriserDepart();
  });

  elements.introFond.addEventListener("pointermove", (evenement) => {
    if (!MEDIA_MOBILE.matches || !pointeurs.has(evenement.pointerId) || !depart) {
      return;
    }
    evenement.preventDefault();
    pointeurs.set(evenement.pointerId, evenement);
    const rect = elements.intro.getBoundingClientRect();
    const actifs = Array.from(pointeurs.values());
    const premier = actifs[0];
    const premierDepart = depart.pointeurs[0] || premier;
    const deltaX = ((premier.clientX - premierDepart.clientX) / Math.max(1, rect.width)) * 100;
    const deltaY = ((premier.clientY - premierDepart.clientY) / Math.max(1, rect.height)) * 100;
    position.x = depart.position.x + deltaX;
    position.y = depart.position.y + deltaY;
    if (actifs.length >= 2 && depart.distance > 0) {
      const distance = mesurerDistance(actifs[0], actifs[1]);
      position.scale = bornerNombre(depart.position.scale * (distance / depart.distance), 1, 1.7, 1);
    }
    rafraichir();
  });

  ["pointerup", "pointercancel", "lostpointercapture"].forEach((nomEvenement) => {
    elements.introFond.addEventListener(nomEvenement, (evenement) => {
      if (!pointeurs.has(evenement.pointerId)) {
        return;
      }
      pointeurs.delete(evenement.pointerId);
      if (pointeurs.size) {
        memoriserDepart();
      } else {
        depart = null;
      }
    });
  });

  elements.introFond.addEventListener("dblclick", () => {
    Object.assign(position, positionFondIntroDefaut());
    rafraichir();
  });

  const imageFond = elements.introFond.querySelector("img");
  if (imageFond?.complete && imageFond.naturalWidth > 0) {
    requestAnimationFrame(rafraichir);
  } else {
    imageFond?.addEventListener("load", rafraichir, { once: true });
  }
  window.addEventListener("resize", rafraichir);
}

function quitterIntro() {
  elements.intro.classList.add("disparait");
  document.body.classList.remove("is-intro-active");
  fermerMenuActionsMobile();
  placerMenuActionsMobile();
  ajusterHauteurPanneauOptionsMobile();
  if (!modeleChoisi) {
    proposerRestaurationReglagesAutomatiques();
  }
}

function traductionCourante() {
  return traductions[langueActive] || traductions.fr;
}

function localeCourante() {
  return {
    fr: "fr-FR",
    en: "en-GB",
    us: "en-US",
    nl: "nl-NL",
    de: "de-DE",
    es: "es-ES",
    it: "it-IT",
  }[langueActive] || "fr-FR";
}

function traduire(cle) {
  return traductionCourante()[cle] || traductions.fr[cle] || cle;
}

function traduirePhrase(cle) {
  return langueActive === "fr" ? cle : phrasesInterface[cle]?.[langueActive] || cle;
}

function retrouverClePhrase(texte) {
  if (phrasesInterface[texte]) {
    return texte;
  }
  if (!retrouverClePhrase.index) {
    retrouverClePhrase.index = new Map();
    Object.entries(phrasesInterface).forEach(([cle, traductionsPhrase]) => {
      [cle, ...Object.values(traductionsPhrase)].forEach((traduction) => {
        if (!retrouverClePhrase.index.has(traduction)) {
          retrouverClePhrase.index.set(traduction, new Set());
        }
        retrouverClePhrase.index.get(traduction).add(cle);
      });
    });
  }
  const cles = retrouverClePhrase.index.get(texte);
  return cles?.size === 1 ? cles.values().next().value : "";
}

function definirTexteElement(selecteur, texte) {
  const element = document.querySelector(selecteur);
  if (element) {
    element.textContent = texte;
  }
}

function traduireTextesVisibles() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(noeud) {
      const parent = noeud.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      const texte = noeud.textContent.trim();
      const cle = noeud.__cleI18n || retrouverClePhrase(texte);
      return phrasesInterface[cle] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const noeuds = [];
  while (walker.nextNode()) {
    noeuds.push(walker.currentNode);
  }
  noeuds.forEach((noeud) => {
    const cle = noeud.__cleI18n || retrouverClePhrase(noeud.textContent.trim());
    noeud.__cleI18n = cle;
    const traduction = langueActive === "fr" ? cle : phrasesInterface[cle]?.[langueActive] || cle;
    const prefixe = noeud.textContent.match(/^\s*/)?.[0] || "";
    const suffixe = noeud.textContent.match(/\s*$/)?.[0] || "";
    noeud.textContent = `${prefixe}${traduction}${suffixe}`;
  });
}

function traduireAttributsVisibles() {
  document.querySelectorAll("[aria-label], [title], [alt], [placeholder], [label]").forEach((element) => {
    ["aria-label", "title", "alt", "placeholder", "label"].forEach((attribut) => {
      if (!element.hasAttribute(attribut)) {
        return;
      }
      const valeur = element.getAttribute(attribut);
      const cle = element.dataset[`cleI18n${attribut.replace(/(^|-)([a-z])/g, (_, __, lettre) => lettre.toUpperCase())}`]
        || retrouverClePhrase(valeur);
      if (!cle || !phrasesInterface[cle]) {
        return;
      }
      element.dataset[`cleI18n${attribut.replace(/(^|-)([a-z])/g, (_, __, lettre) => lettre.toUpperCase())}`] = cle;
      element.setAttribute(attribut, langueActive === "fr" ? cle : phrasesInterface[cle]?.[langueActive] || cle);
    });
  });
}

function traduireApercusModeles() {
  document.querySelectorAll(".carte-modele__image--base[data-nom-modele]").forEach((image) => {
    image.alt = `${traduirePhrase("Aperçu")} ${image.dataset.nomModele}`;
  });
}

function trouverCleLibelleOption(element) {
  const cible = element.querySelector(".champ__libelle") || element.querySelector(".choix-decor__titre") || element.querySelector(".marques-activation__texte") || element;
  const noeud = Array.from(cible.childNodes).find((item) => item.nodeType === Node.TEXT_NODE && item.textContent.trim())
    || Array.from(cible.querySelectorAll("*")).flatMap((item) => Array.from(item.childNodes)).find((item) => item.nodeType === Node.TEXT_NODE && item.textContent.trim());
  return noeud?.__cleI18n || noeud?.textContent.trim() || "";
}

function creerBoutonAide(cle) {
  const bouton = document.createElement("button");
  bouton.className = "aide-option";
  bouton.type = "button";
  bouton.dataset.helpKey = cle;
  bouton.textContent = "?";
  bouton.addEventListener("click", (evenement) => {
    evenement.preventDefault();
    evenement.stopPropagation();
    afficherBulleAide(bouton);
  });
  return bouton;
}

function creerAideDynamique(cle) {
  const bouton = creerBoutonAide(cle);
  bouton.setAttribute("aria-label", texteAideOption(cle));
  return bouton;
}

function fermerBulleAide() {
  document.querySelectorAll(".aide-option.is-active").forEach((bouton) => bouton.classList.remove("is-active"));
  bulleAideActive?.remove();
  bulleAideActive = null;
}

function afficherBulleAide(bouton) {
  const dejaActive = bouton.classList.contains("is-active");
  fermerBulleAide();
  if (dejaActive) {
    return;
  }
  const texte = texteAideOption(bouton.dataset.helpKey);
  if (!texte) {
    return;
  }
  bouton.classList.add("is-active");
  const bulle = document.createElement("div");
  bulle.className = "aide-bulle";
  bulle.textContent = texte;
  const conteneurBulle = bouton.closest("dialog[open]") || document.body;
  conteneurBulle.append(bulle);
  bulleAideActive = bulle;
  positionnerBulleAide(bouton, bulle);
}

function positionnerBulleAide(bouton, bulle) {
  const marge = 10;
  const boutonRect = bouton.getBoundingClientRect();
  const bulleRect = bulle.getBoundingClientRect();
  const largeurMax = window.innerWidth - marge * 2;
  const gaucheIdeal = boutonRect.left + boutonRect.width / 2 - bulleRect.width / 2;
  const gauche = Math.max(marge, Math.min(gaucheIdeal, window.innerWidth - bulleRect.width - marge));
  let haut = boutonRect.top - bulleRect.height - 8;
  if (haut < marge) {
    haut = boutonRect.bottom + 8;
  }
  bulle.style.maxWidth = `${Math.min(260, largeurMax)}px`;
  bulle.style.left = `${gauche}px`;
  bulle.style.top = `${Math.max(marge, haut)}px`;
}

function installerAidesOptions() {
  elements.formulaire.querySelectorAll(".aide-option[data-help-key]").forEach((bouton) => {
    bouton.setAttribute("aria-label", texteAideOption(bouton.dataset.helpKey));
    bouton.addEventListener("click", (evenement) => {
      evenement.preventDefault();
      evenement.stopPropagation();
      afficherBulleAide(bouton);
    });
  });
  const cibles = Array.from(elements.formulaire.querySelectorAll(".champ, .marques-activation"));
  cibles.forEach((element) => {
    const cle = trouverCleLibelleOption(element);
    if (!cle || !aidesOptions[cle] || aideOptionDesactivee(element, cle) || element.querySelector(".aide-option")) {
      return;
    }
    const conteneur = element.querySelector(".champ__libelle") || element.querySelector(".choix-decor__titre") || element.querySelector(".marques-activation__titre");
    if (conteneur) {
      conteneur.append(creerBoutonAide(cle));
      return;
    }
    const noeud = Array.from(element.childNodes).find((item) => item.nodeType === Node.TEXT_NODE && item.textContent.trim());
    if (!noeud) {
      return;
    }
    const libelle = document.createElement("span");
    libelle.className = "option-libelle";
    libelle.textContent = noeud.textContent.trim();
    noeud.replaceWith(libelle);
    libelle.append(creerBoutonAide(cle));
  });
}

function aideOptionDesactivee(element, cle) {
  const panneau = element.closest("[data-tab-panel]");
  const etape = panneau?.dataset.tabPanel;
  if (["reglages", "cote"].includes(etape)) {
    return true;
  }
  if (etape === "texte" && !["Effet rétro sur les titres", "Décalage rétro automatique", "Irrégularité des caractères", "Retour à la ligne automatique", "Déplacer les textes manuellement"].includes(cle)) {
    return true;
  }
  if (etape === "decor" && !["Élément à modifier", "Vignettage", "Couleur", "Intensité", "Opacité", "Angle"].includes(cle)) {
    return true;
  }
  return false;
}

function traduireAidesOptions() {
  elements.formulaire.querySelectorAll(".aide-option").forEach((bouton) => {
    const texte = texteAideOption(bouton.dataset.helpKey);
    bouton.setAttribute("aria-label", texte);
  });
  fermerBulleAide();
}

function texteAideOption(cle) {
  const aide = langueActive === "fr" ? cle && aidesOptions[cle]?.fr : aidesOptions[cle]?.[langueActive];
  return aide || aidesOptions[cle]?.fr || cle || "";
}

function appliquerLangueSite(langue, options = {}) {
  const { memoriser = true } = options;
  langueActive = traductions[langue] ? langue : "fr";
  if (memoriser) {
    memoriserLangueChoisie(langueActive);
  }
  const t = traductionCourante();
  const [titre, sousTitre, bouton] = t.intro || traductions.fr.intro;
  document.documentElement.lang = langueActive === "us" ? "en" : langueActive;
  document.title = langueActive === "fr"
    ? "Étiquettes de Jukebox Personnalisées | 45'O'Juke"
    : phrasesInterface["Étiquettes de Jukebox Personnalisées | 45'O'Juke"][langueActive];
  elements.titreIntro.textContent = titre;
  elements.sousTitreIntro.textContent = sousTitre;
  elements.boutonCommencer.textContent = bouton;
  definirTexteElement(".accueil-apercu__surtitre", `${traduire("step")} 1`);
  definirTexteElement(".accueil-apercu h2", traduire("styleTitle"));
  definirTexteElement(".accueil-apercu__description", traductionCourante().styleDescription || traductions.fr.styleDescription);
  elements.inverser.textContent = traduire("variant");
  elements.teinte.textContent = traduirePhrase("Teinte");
  elements.reinitialiserReglage.textContent = traduirePhrase("Reset");
  elements.reinitialiserReglage.setAttribute("aria-label", traduirePhrase("Revenir au style par défaut"));
  elements.reinitialiserReglage.title = traduirePhrase("Style par défaut");
  elements.ouvrirTableauCsvApercu.textContent = traduire("data");
  elements.imprimer.textContent = traduire("print");
  elements.ouvrirFavoris.textContent = traduirePhrase("Favoris");
  traduireTextesVisibles();
  traduireAttributsVisibles();
  traduireApercusModeles();
  if (!elements.restaurationAccueil.hidden) {
    mettreAJourTexteRestauration();
  }
  if (elements.statutCsv?.dataset.cleStatut) {
    mettreAJourStatutCsv(elements.statutCsv.dataset.cleStatut);
  }
  definirEditionTexteMobile(document.body.classList.contains("is-edition-texte-mobile"));
  synchroniserOptionsMotifSecondaire();
  traduireAidesOptions();
  mettreAJourAssistantReglages();
  if (modeleChoisi) {
    mettreAJourVerrouillageStyle();
    synchroniserControleZoomApercu();
  }
  synchroniserBoutonsLangue();
}

function synchroniserBoutonsLangue() {
  elements.boutonsLangue.forEach((drapeau) => {
    drapeau.classList.toggle("actif", drapeau.dataset.lang === langueActive);
  });
}

function fermerAPropos() {
  if (elements.aboutModal.open) {
    elements.aboutModal.close();
  }
}

function ouvrirLicenceComplete() {
  elements.licenceCompleteModal.showModal();
}

function fermerLicenceComplete() {
  if (elements.licenceCompleteModal.open) {
    elements.licenceCompleteModal.close();
  }
}

function ouvrirConfidentialite() {
  elements.confidentialiteModal.showModal();
}

function fermerConfidentialite() {
  if (elements.confidentialiteModal.open) {
    elements.confidentialiteModal.close();
  }
}

function calculerZoomApercuAutomatique() {
  const largeurDisponible = Math.max(280, elements.apercus.clientWidth || elements.apercu.parentElement?.clientWidth || 760);
  const reglagesVisibles = [lireReglages("1")];
  if (deuxiemeEtiquetteActive()) {
    reglagesVisibles.push(lireReglages("2"));
  }
  const largeurMax = Math.max(...reglagesVisibles.map((reglages) => Number(reglages.largeurEtiquette) || DIMENSIONS_ETIQUETTE_DEFAUT.largeur));
  const hauteurMax = Math.max(...reglagesVisibles.map((reglages) => Number(reglages.hauteurEtiquette) || DIMENSIONS_ETIQUETTE_DEFAUT.hauteur));
  const largeurReference = MEDIA_MOBILE.matches
    ? largeurMax
    : Math.max(LIMITES_DIMENSIONS.largeurEtiquette.max, largeurMax);
  const zoomLargeur = (largeurDisponible * 0.96) / largeurReference;
  const zoomHauteur = MEDIA_MOBILE.matches ? (window.innerHeight * 0.24) / hauteurMax : PIXELS_APERCU_PAR_MM_MAX;
  const pixelsParMm = Math.min(PIXELS_APERCU_PAR_MM_MAX, zoomLargeur, zoomHauteur);
  return Math.max(100, Math.round(((pixelsParMm / PIXELS_CSS_PAR_MM) * 100) / 5) * 5);
}

function obtenirZoomApercuCourant() {
  zoomApercuMaximum = calculerZoomApercuAutomatique();
  return Math.min(zoomApercuMaximum, zoomApercuPourcentage ?? zoomApercuMaximum);
}

function definirZoomApercu(valeur) {
  zoomApercuPourcentage = Math.max(100, Math.min(zoomApercuMaximum, Math.round(Number(valeur) || 100)));
  appliquerZoomApercuCourant();
}

function modifierZoomApercu(delta) {
  definirZoomApercu(obtenirZoomApercuCourant() + delta);
}

function appliquerZoomApercuCourant() {
  if (!modeleChoisi) {
    return;
  }
  const zoom = obtenirZoomApercuCourant();
  appliquerTailleApercu(elements.apercu, lireReglages("1"), zoom);
  if (deuxiemeEtiquetteActive() && !elements.apercuSecondaire.hidden) {
    appliquerTailleApercu(elements.apercuSecondaire, lireReglages("2"), zoom);
  }
  synchroniserControleZoomApercu(zoom);
}

function synchroniserControleZoomApercu(zoom = obtenirZoomApercuCourant()) {
  elements.zoomApercu.max = String(zoomApercuMaximum);
  elements.zoomApercu.value = String(zoom);
  elements.valeurZoomApercu.value = `${zoom} %`;
  elements.valeurZoomApercu.textContent = `${zoom} %`;
  elements.diminuerZoomApercu.disabled = zoom <= 100;
  elements.augmenterZoomApercu.disabled = zoom >= zoomApercuMaximum;
  elements.zoomApercuTailleReelle.classList.toggle("is-actif", zoom === 100);
  elements.apercus.classList.toggle("is-taille-reelle", zoom === 100);
  synchroniserRegleApercu(zoom);
}

function synchroniserRegleApercu(zoom) {
  const numero = etiquetteActive === "2" && deuxiemeEtiquetteActive() ? "2" : "1";
  const reglages = lireReglages(numero);
  const largeurMm = Number(reglages.largeurEtiquette) || DIMENSIONS_ETIQUETTE_DEFAUT.largeur;
  const pixelsParMm = PIXELS_CSS_PAR_MM * zoom / 100;
  elements.regleApercu.style.width = `${largeurMm * pixelsParMm}px`;
  elements.regleApercu.style.setProperty("--pas-regle-mm", `${pixelsParMm}px`);
  elements.regleApercu.style.setProperty("--pas-regle-5mm", `${pixelsParMm * 5}px`);
  elements.regleApercu.style.setProperty("--pas-regle-cm", `${pixelsParMm * 10}px`);
  elements.regleApercu.setAttribute(
    "aria-label",
    `${traduirePhrase("Règle de l’aperçu")} : ${largeurMm.toLocaleString(localeCourante())} mm`,
  );

  const nombres = [];
  for (let positionMm = 0; positionMm <= largeurMm; positionMm += 10) {
    nombres.push([positionMm, positionMm / 10]);
  }
  if (nombres.at(-1)?.[0] !== largeurMm) {
    nombres.push([largeurMm, largeurMm / 10]);
  }
  elements.nombresRegleApercu.replaceChildren(
    ...nombres.map(([positionMm, valeurCm]) => {
      const nombre = document.createElement("span");
      nombre.style.left = `${positionMm / largeurMm * 100}%`;
      nombre.textContent = valeurCm.toLocaleString(localeCourante(), { maximumFractionDigits: 1 });
      return nombre;
    }),
  );
}

function remplirMenusPolices() {
  remplirSelectPolice(elements.policeTitres, "dactylo-ronde");
  remplirSelectPolice(elements.policeArtiste, "dactylo-ronde");
  remplirSelectPolice(elements.policeMarques, "compacte");
  remplirSelectPolice(elements.policeMarqueGauche, "compacte");
  remplirSelectPolice(elements.policeMarqueDroite, "compacte");
  synchroniserTousStylesPolices();
}

function synchroniserTousStylesPolices() {
  synchroniserSelectStylePolice(elements.policeTitres, elements.styleTitres);
  synchroniserSelectStylePolice(elements.policeArtiste, elements.styleArtiste);
  synchroniserSelectStylePolice(elements.policeMarqueGauche, elements.styleMarqueGauche);
  synchroniserSelectStylePolice(elements.policeMarqueDroite, elements.styleMarqueDroite);
}

function synchroniserSelectStylePolice(selectPolice, selectStyle) {
  if (!selectPolice || !selectStyle) {
    return;
  }
  const stylesDisponibles = stylesPolice(selectPolice.value);
  const styleCompatible = normaliserStylePolice(selectPolice.value, selectStyle.value);
  Array.from(selectStyle.options).forEach((option) => {
    const disponible = stylesDisponibles.includes(option.value);
    option.disabled = !disponible;
    option.hidden = !disponible;
  });
  selectStyle.value = styleCompatible;
  const optionUnique = stylesDisponibles.length <= 1;
  selectStyle.disabled = optionUnique;
  const conteneur = selectStyle.closest(".champ");
  if (conteneur) {
    const peutEtreMasque = selectStyle === elements.styleTitres || selectStyle === elements.styleArtiste;
    conteneur.hidden = peutEtreMasque && optionUnique;
    conteneur.classList.toggle("champ--option-unique", optionUnique);
    conteneur.title = optionUnique
      ? "Cette police est disponible uniquement en style normal."
      : "";
  }
}

function ouvrirSoutien(options = {}) {
  const { onParticipation = null } = options;
  const dialogue = document.createElement("dialog");
  dialogue.className = "fenetre-soutien";

  const contenu = document.createElement("div");
  contenu.className = "fenetre-soutien__contenu";

  const entete = document.createElement("div");
  entete.className = "fenetre-soutien__entete";

  const blocTitre = document.createElement("div");

  const titre = document.createElement("h2");
  titre.className = "fenetre-soutien__titre";
  titre.textContent = traduirePhrase("Soutenir / contacter 45’O’Juke");

  const texte = document.createElement("p");
  texte.className = "fenetre-soutien__texte";
  texte.textContent = traduirePhrase("45’O’Juke est un petit projet indépendant, créé avec passion autour de l’univers des jukebox et des étiquettes rétro.");

  const fermer = document.createElement("button");
  fermer.className = "bouton bouton-secondaire";
  fermer.type = "button";
  fermer.textContent = traduirePhrase("Fermer");

  blocTitre.append(titre, texte);
  entete.append(blocTitre, fermer);

  const liste = document.createElement("div");
  liste.className = "soutien-options";

  [
    ["Un jeton", "Un petit coup de pouce.", "0,99 €", "0.99"],
    ["Trois jetons", "Un vrai merci pour le projet.", "2,99 €", "2.99"],
    ["Une poignée de jetons", "Pour aider 45'O'Juke à évoluer.", "4,99 €", "4.99"],
    ["Montant libre", "Pour envoyer le nombre de jetons de votre choix.", "Libre", ""],
  ].forEach(([nom, description, prix, montant]) => {
    const option = document.createElement("button");
    option.className = "soutien-option";
    option.type = "button";
    option.dataset.montant = montant;

    const libelles = document.createElement("span");
    libelles.className = "soutien-option__libelles";

    const nomElement = document.createElement("span");
    nomElement.className = "soutien-option__nom";
    nomElement.textContent = traduirePhrase(nom);

    const descriptionElement = document.createElement("span");
    descriptionElement.className = "soutien-option__description";
    descriptionElement.textContent = traduirePhrase(description);

    const prixElement = document.createElement("span");
    prixElement.className = "soutien-option__prix";
    prixElement.textContent = traduirePhrase(prix);

    libelles.append(nomElement, descriptionElement);
    option.append(libelles, prixElement);
    liste.append(option);
  });

  const mention = document.createElement("p");
  mention.className = "fenetre-soutien__mention";
  mention.textContent = traduirePhrase("Le soutien est libre, volontaire, sans obligation et sans avantage fiscal.");

  const contact = document.createElement("div");
  contact.className = "contact-projet";

  const contactTitre = document.createElement("p");
  contactTitre.className = "contact-projet__titre";
  contactTitre.textContent = traduirePhrase("Une question, un bug ou une idée ?");

  const contactTexte = document.createElement("p");
  contactTexte.className = "contact-projet__texte";
  contactTexte.textContent = traduirePhrase("Pour signaler un problème, proposer une amélioration, corriger une traduction ou partager une idée de style, vous pouvez me contacter ici.");

  const contactActions = document.createElement("div");
  contactActions.className = "contact-projet__actions";

  const contactLien = document.createElement("a");
  contactLien.className = "bouton bouton-principal contact-projet__lien";
  contactLien.href = `mailto:${EMAIL_CONTACT}?subject=Contact%2045%27O%27Juke`;
  contactLien.setAttribute("aria-label", EMAIL_CONTACT);
  contactLien.textContent = traduirePhrase("Email");

  const facebookLien = document.createElement("a");
  facebookLien.className = "bouton bouton-secondaire contact-projet__lien contact-projet__lien--facebook";
  facebookLien.href = LIEN_FACEBOOK_CONTACT;
  facebookLien.target = "_blank";
  facebookLien.rel = "noopener noreferrer";
  facebookLien.setAttribute("aria-label", traduirePhrase("Envoyer un message Facebook"));
  facebookLien.textContent = traduirePhrase("Facebook");

  contactActions.append(contactLien, facebookLien);
  contact.append(contactTitre, contactTexte, contactActions);

  contenu.append(entete, contact, liste, mention);
  dialogue.append(contenu);
  document.body.append(dialogue);

  fermer.addEventListener("click", () => dialogue.close());
  dialogue.addEventListener("close", () => dialogue.remove(), { once: true });
  dialogue.addEventListener("click", (evenement) => {
    if (evenement.target === dialogue) {
      dialogue.close();
    }
  });
  liste.addEventListener("click", (evenement) => {
    const option = evenement.target.closest("[data-montant]");
    if (!option) {
      return;
    }
    const soutienLance = ouvrirLienPayPal(option.dataset.montant);
    if (soutienLance) {
      onParticipation?.();
      dialogue.close();
    }
  });

  dialogue.showModal();
}

function ouvrirLienPayPal(montant) {
  const lien = new URL(LIEN_PAYPAL_SOUTIEN);
  if (montant && (lien.hostname.includes("paypal.me") || lien.pathname.includes("/paypalme/"))) {
    lien.pathname = `${lien.pathname.replace(/\/$/, "")}/${montant}`;
  }
  window.open(lien.toString(), "_blank", "noopener,noreferrer");
  return true;
}

function desactiverLimiteMarquesSurpriseSiModificationManuelle(cible) {
  if (!elements.limiterMarquesBandeSurprise.checked || cible === elements.limiterMarquesBandeSurprise) {
    return false;
  }
  if (!cible?.closest?.("[data-marque-reglage]")) {
    return false;
  }
  elements.limiterMarquesBandeSurprise.checked = false;
  return true;
}

function activerEtapeReglage(nomEtape, options = {}) {
  const panneauActif = Array.from(elements.panneauxReglages).find((panneau) => panneau.dataset.tabPanel === nomEtape);
  if (!panneauActif || panneauActif.dataset.tabDisabled === "true") {
    return;
  }
  etapeReglageActive = nomEtape;
  elements.panneauxReglages.forEach((panneau) => {
    panneau.hidden = panneau.dataset.tabPanel !== nomEtape || panneau.dataset.tabDisabled === "true";
  });
  mettreAJourReglagesTexteMiseEnPage();
  if (!options.conserverEditionTexteMobile) {
    fermerEditionTexteMobile();
  }
  mettreAJourAssistantReglages();
  replacerAtelierMobile();
  ajusterHauteurPanneauOptionsMobile();
}

function replacerAtelierMobile() {
  if (!MEDIA_MOBILE.matches || document.body.classList.contains("is-accueil-selection")) {
    return;
  }
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    elements.formulaire?.scrollTo?.(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  });
}

function ajusterHauteurPanneauOptionsMobile() {
  const formulaire = elements.formulaire;
  if (!formulaire) {
    return;
  }
  if (!MEDIA_MOBILE.matches || document.body.classList.contains("is-accueil-selection")) {
    formulaire.style.removeProperty("--hauteur-controles-mobile");
    return;
  }
  requestAnimationFrame(() => {
    const viewport = window.visualViewport;
    const hauteurVue = viewport?.height || window.innerHeight;
    const hautVue = viewport?.offsetTop || 0;
    const hauteurPied = elements.installerApp?.closest(".pied-site")?.getBoundingClientRect().height || 0;
    const margeBasse = 12;
    const { top } = formulaire.getBoundingClientRect();
    const hauteurDisponible = Math.max(240, hauteurVue + hautVue - top - hauteurPied - margeBasse);
    formulaire.style.setProperty("--hauteur-controles-mobile", `${Math.round(hauteurDisponible)}px`);
  });
}

function definirEditionTexteMobile(ouverte) {
  placerEditeurTexteMobile(ouverte);
  document.body.classList.toggle("is-edition-texte-mobile", ouverte);
  elements.basculerEditionTexteMobile.textContent = ouverte ? traduirePhrase("Retour aux options") : traduirePhrase("Modifier les textes");
  elements.basculerEditionTexteMobile.setAttribute("aria-expanded", String(ouverte));
  if (!ouverte) {
    fermerBulleAide();
  }
}

function placerEditeurTexteMobile(ouverte) {
  if (ouverte && MEDIA_MOBILE.matches) {
    if (elements.editionTexte.parentElement !== elements.formulaire
      || elements.editionTexte.nextElementSibling !== elements.assistantNavigation) {
      elements.formulaire.insertBefore(elements.editionTexte, elements.assistantNavigation);
    }
    return;
  }
  if (elements.editionTexte.parentElement !== elements.scene) {
    elements.scene.append(elements.editionTexte);
  }
}

function champEditionTexteActif() {
  return [elements.texteFaceA, elements.texteArtiste, elements.texteFaceB].includes(document.activeElement);
}

function fermerEditionTexteMobile() {
  definirEditionTexteMobile(false);
}

function basculerEditionTexteMobile() {
  definirEditionTexteMobile(!document.body.classList.contains("is-edition-texte-mobile"));
}

function ouvrirEditionTexteDepuisApercu() {
  if (!MEDIA_MOBILE.matches) {
    activerEtapeReglage("texte");
    return;
  }
  activerEtapeReglage("texte", { conserverEditionTexteMobile: true });
  definirEditionTexteMobile(true);
  requestAnimationFrame(() => {
    const champsTexte = [elements.texteFaceA, elements.texteArtiste, elements.texteFaceB];
    if (champsTexte.includes(document.activeElement)) {
      document.activeElement.blur();
    }
  });
}

function etapesAssistantDisponibles() {
  return ETAPES_ASSISTANT.filter((nomEtape) => {
    const panneau = Array.from(elements.panneauxReglages).find((item) => item.dataset.tabPanel === nomEtape);
    return panneau && panneau.dataset.tabDisabled !== "true";
  });
}

function indexEtapeAssistantActive() {
  const etapes = etapesAssistantDisponibles();
  const index = etapes.indexOf(etapeReglageActive);
  return index >= 0 ? index : 0;
}

function naviguerAssistant(delta) {
  const etapes = etapesAssistantDisponibles();
  if (!etapes.length) {
    return;
  }
  if (delta < 0 && indexEtapeAssistantActive() === 0) {
    revenirSelectionAccueil();
    return;
  }
  const cible = Math.min(etapes.length - 1, Math.max(0, indexEtapeAssistantActive() + delta));
  activerEtapeReglage(etapes[cible]);
}

function revenirSelectionAccueil() {
  modeleChoisi = false;
  fermerEditionTexteMobile();
  document.body.classList.add("is-accueil-selection");
  elements.assistantReglages.hidden = true;
  elements.assistantNavigation.hidden = true;
  elements.accueilApercu.hidden = false;
  elements.apercus.hidden = true;
  elements.navigationApercu.hidden = true;
  elements.basculerEditionTexteMobile.hidden = true;
  elements.editionTexte.hidden = true;
  elements.actionsApercu.hidden = true;
  elements.sceneEntete.hidden = true;
  elements.panneauxReglages.forEach((panneau) => {
    panneau.hidden = true;
  });
  mettreAJourEditeurTexte(null);
  mettreAJourGalerieModeles();
  proposerRestaurationReglagesAutomatiques();
}

function naviguerAssistantSuivant() {
  const etapes = etapesAssistantDisponibles();
  const index = indexEtapeAssistantActive();
  if (etapeReglageActive === "organisation") {
    appliquerOrganisationEtiquettes();
  }
  if (index >= etapes.length - 1) {
    imprimer();
    return;
  }
  activerEtapeReglage(etapes[index + 1]);
}

function obtenirModeModificationEtiquettes() {
  return [...elements.modeModificationEtiquettes].find((radio) => radio.checked)?.value || "toutes";
}

function appliquerOrganisationEtiquettes() {
  modeModificationEtiquettes = obtenirModeModificationEtiquettes();
  const total = Math.max(1, Math.min(500, Math.round(Number(elements.nombreEtiquettes.value) || vinyles.length || 1)));
  elements.nombreEtiquettes.value = String(total);
  ajusterNombreEtiquettes(total);
  sauvegarderReglagesAutomatiques();
}

function ajusterNombreEtiquettes(total) {
  synchroniserReferenceOrganisation();
  vinyles = Array.from({ length: total }, (_, index) => {
    const entree = vinyles[index] || vinylesReferenceOrganisation[index];
    return entree ? { ...entree } : creerVinyleVide(index);
  });
  stylesVerrouillesParLigne = Object.fromEntries(
    Object.entries(stylesVerrouillesParLigne).filter(([cle]) => Number(cle) < total),
  );
  reglagesParLigne = Object.fromEntries(
    Object.entries(reglagesParLigne).filter(([cle]) => Number(cle) < total),
  );
  finaliserChangementTableau();
}

function creerVinyleVide(index) {
  return {
    emplacement: "jukebox",
    position_jukebox: "",
    selection_face_a: "",
    selection_face_b: "",
    artiste: "",
    titre_face_a: "",
    titre_face_b: "",
    __ordreOriginal: index,
  };
}

function synchroniserReferenceOrganisation() {
  vinyles.forEach((vinyle, index) => {
    vinylesReferenceOrganisation[index] = { ...vinyle };
  });
}

function libelleEtapeAssistant(nomEtape) {
  const libelles = traductions[langueActive]?.assistant || traductions.fr.assistant;
  return libelles[nomEtape] || traductions.fr.assistant[nomEtape];
}

function mettreAJourAssistantReglages() {
  if (!modeleChoisi) {
    elements.assistantReglages.hidden = true;
    elements.assistantNavigation.hidden = true;
    return;
  }
  const etapes = etapesAssistantDisponibles();
  const index = indexEtapeAssistantActive();
  const nomEtape = etapes[index];
  const libelle = libelleEtapeAssistant(nomEtape);
  elements.assistantReglages.hidden = false;
  elements.assistantNavigation.hidden = false;
  elements.assistantEtape.textContent = `${traduire("step")} ${index + 2} / ${etapes.length + 1}`;
  elements.assistantTitre.textContent = libelle.titre;
  elements.assistantAide.textContent = libelle.aide;
  elements.assistantPrecedent.disabled = false;
  elements.assistantPrecedent.textContent = traduire("previous");
  elements.assistantSuivant.textContent = index >= etapes.length - 1 ? traduire("print") : traduire("next");
}

async function chargerBibliotheque() {
  const csvLocal = localStorage.getItem(CLE_CSV_LOCAL);
  try {
    const reponse = await fetch("./exemple.csv", { cache: "no-store" });
    const texte = await reponse.text();
    vinylesReferenceOrganisation = parserCsvVinyles(texte).map((vinyle) => ({ ...vinyle }));
  } catch (erreur) {
    vinylesReferenceOrganisation = [];
  }

  if (csvLocal) {
    vinyles = parserCsvVinyles(csvLocal);
    synchroniserReferenceOrganisation();
    memoriserOrdreOriginal();
    mettreAJourStatutCsv("CSV local restaure");
    return;
  }

  vinyles = vinylesReferenceOrganisation.map((vinyle) => ({ ...vinyle }));
  memoriserOrdreOriginal();
  mettreAJourStatutCsv(vinyles.length ? "CSV exemple charge" : "Impossible de charger le CSV");
}


function sauvegarderCsvLocal() {
  try {
    localStorage.setItem(CLE_CSV_LOCAL, serialiserCsvVinyles(vinyles));
    mettreAJourStatutCsv("CSV sauvegarde localement");
  } catch {
    mettreAJourStatutCsv("Sauvegarde locale impossible");
  }
}

function mettreAJourStatutCsv(prefixe) {
  if (!elements.statutCsv) {
    return;
  }
  elements.statutCsv.dataset.cleStatut = prefixe;
  elements.statutCsv.textContent = `${traduirePhrase(prefixe)} - ${vinyles.length} ${traduirePhrase(vinyles.length > 1 ? "entrées" : "entrée")}`;
}

async function importerCsvUtilisateur() {
  const fichier = elements.importCsv.files?.[0];
  if (!fichier) {
    return;
  }
  try {
    const texte = await fichier.text();
    const nouveauxVinyles = parserCsvVinyles(texte);
    if (!nouveauxVinyles.length) {
      window.alert(traduirePhrase("Le CSV ne contient aucune entrée exploitable."));
      return;
    }
    vinyles = nouveauxVinyles;
    vinylesReferenceOrganisation = nouveauxVinyles.map((vinyle) => ({ ...vinyle }));
    memoriserOrdreOriginal();
    indexApercu = 0;
    sauvegarderCsvLocal();
    rendreTableauCsvActif?.();
    mettreAJourGalerieModeles();
    mettreAJour();
  } finally {
    elements.importCsv.value = "";
  }
}

function demanderImportCsv() {
  if (document.querySelector(".fenetre-choix-csv[open]")) {
    return;
  }

  const dialogue = document.createElement("dialog");
  dialogue.className = "fenetre-choix-csv";
  dialogue.setAttribute("aria-labelledby", "titreChoixCsv");

  const contenu = document.createElement("div");
  contenu.className = "fenetre-choix-csv__contenu";

  const entete = document.createElement("div");
  entete.className = "fenetre-choix-csv__entete";

  const titre = document.createElement("h2");
  titre.className = "fenetre-import__titre";
  titre.id = "titreChoixCsv";
  titre.textContent = traduirePhrase("Importer un fichier CSV");

  const fermer = document.createElement("button");
  fermer.className = "bouton bouton-secondaire";
  fermer.type = "button";
  fermer.textContent = "×";
  fermer.setAttribute("aria-label", traduirePhrase("Fermer"));
  entete.append(titre, fermer);

  const explication = document.createElement("p");
  explication.className = "fenetre-choix-csv__texte";
  explication.textContent = traduirePhrase("Votre fichier doit contenir trois colonnes : Artiste, Face A et Face B. La première ligne contient les noms des colonnes, puis chaque ligne correspond à une étiquette. Les fichiers séparés par des points-virgules, des virgules ou des tabulations sont acceptés.");

  const exemple = document.createElement("pre");
  exemple.className = "fenetre-choix-csv__exemple";
  exemple.textContent = "artiste;titre_face_a;titre_face_b\nThe Beatles;Hey Jude;Let It Be\nElvis Presley;Jailhouse Rock;All Shook Up";

  const actions = document.createElement("div");
  actions.className = "fenetre-choix-csv__actions";

  const telechargerExemple = document.createElement("a");
  telechargerExemple.className = "bouton bouton-secondaire";
  telechargerExemple.href = "./exemple.csv";
  telechargerExemple.download = "45-o-juke-exemple.csv";
  telechargerExemple.textContent = traduirePhrase("Télécharger un fichier d’exemple");

  const choisirFichier = document.createElement("button");
  choisirFichier.className = "bouton bouton-principal";
  choisirFichier.type = "button";
  choisirFichier.textContent = traduirePhrase("Choisir mon fichier CSV");

  actions.append(telechargerExemple, choisirFichier);
  contenu.append(entete, explication, exemple, actions);
  dialogue.append(contenu);
  document.body.append(dialogue);

  fermer.addEventListener("click", () => dialogue.close());
  choisirFichier.addEventListener("click", () => {
    dialogue.close();
    elements.importCsv.click();
  });
  dialogue.addEventListener("click", (evenement) => {
    if (evenement.target === dialogue) {
      dialogue.close();
    }
  });
  dialogue.addEventListener("close", () => dialogue.remove(), { once: true });
  dialogue.showModal();
}

function memoriserOrdreOriginal() {
  ordreOriginalVinyles = vinyles.map((vinyle, index) => vinyle.__ordreOriginal ?? index);
  vinyles.forEach((vinyle, index) => {
    vinyle.__ordreOriginal = ordreOriginalVinyles[index] ?? index;
  });
}

function exporterCsv() {
  const blob = new Blob([serialiserCsvVinyles(vinyles)], { type: "text/csv;charset=utf-8" });
  const lien = document.createElement("a");
  lien.href = URL.createObjectURL(blob);
  lien.download = "45-o-juke-bibliotheque.csv";
  document.body.append(lien);
  lien.click();
  lien.remove();
  URL.revokeObjectURL(lien.href);
}

function appliquerPreset(modele) {
  const reglagesDefaut = obtenirReglagesDefautModele(modele);
  if (!reglagesDefaut) {
    return;
  }
  appliquerReglagesAuFormulaire(reglagesDefaut);
  enregistrerReglagesActifs();
  mettreAJourGalerieModeles();
  mettreAJour();
}

function reinitialiserStyleDefaut() {
  const modele = lireReglagesFormulaire().modele || elements.modele.value;
  const reglagesDefaut = obtenirReglagesDefautModele(modele);
  if (!reglagesDefaut || styleCourantEstStyleDefaut()) {
    return;
  }
  enregistrerHistoriqueAvantAction();
  elements.modele.value = modele;
  appliquerReglagesAuFormulaire(reglagesDefaut);
  signatureDerniereVarianteCouleur = "";
  cycleVarianteBouton = null;
  enregistrerReglagesActifs();
  mettreAJourGalerieModeles();
  mettreAJour();
}

function styleCourantEstStyleDefaut() {
  const reglages = lireReglagesFormulaire();
  const modele = reglages.modele || elements.modele.value;
  const reglagesDefaut = obtenirReglagesDefautModele(modele);
  if (!reglagesDefaut) {
    return true;
  }
  return signatureEtatReglages(reglages) === signatureEtatReglages(reglagesDefaut);
}

function appliquerStyleEtiquetteEnregistre(id) {
  const style = obtenirStyleEtiquette(id);
  if (!style) {
    return false;
  }
  const modele = style.reglages.modele;
  const reglagesDefaut = obtenirReglagesDefautModele(modele);
  const reglages = normaliserReglagesImportes({ ...reglagesDefaut, ...style.reglages });
  elements.modele.value = reglages.modele;
  appliquerReglagesAuFormulaire(reglages);
  enregistrerReglagesActifs();
  mettreAJourGalerieModeles();
  mettreAJour();
  return true;
}

function obtenirModelesCategorie(categorie) {
  return modelesParTheme[categorie] || modelesParTheme.tout;
}

function remplirModelesTheme() {
  const modeles = obtenirModelesCategorie("tout");
  const modelesSecondaires = obtenirModelesCategorie("tout");
  const valeurActuelle = elements.modele.value;
  const valeurSecondaire = elements.modeleSecondaire.value;
  elements.modele.replaceChildren(...modeles.map(([valeur, libelle]) => new Option(libelle, valeur)));
  elements.modeleSecondaire.replaceChildren(...modelesSecondaires.map(([valeur, libelle]) => new Option(libelle, valeur)));
  elements.modele.value = modeles.some(([valeur]) => valeur === valeurActuelle) ? valeurActuelle : modeles[0][0];
  if (valeurSecondaire) {
    elements.modeleSecondaire.value = modelesSecondaires.some(([valeur]) => valeur === valeurSecondaire) ? valeurSecondaire : modelesSecondaires[0][0];
  } else {
    elements.modeleSecondaire.selectedIndex = 0;
  }
  mettreAJourGalerieModeles();
}

function mettreAJourGalerieModeles() {
  const modelesAccueil = obtenirModelesAccueil("tout");
  const deuxiemeActive = deuxiemeEtiquetteActive();
  const modelesSecondaires = obtenirStylesEtiquettes("tout");
  const modelePrincipal = lireReglages("1").modele || elements.modele.value;
  const modeleSecondaire = lireReglages("2").modele || elements.modeleSecondaire.value;
  const ligneDemo = obtenirLignes()[indexApercu] || {
    titreA: "En Rouge Et Noir",
    artiste: "Mylene Farmer",
    titreB: "Plus Forte Que L'Ocean",
    position: "00",
  };
  const ligneDemoAccueil = {
    titreA: "",
    artiste: "",
    titreB: "",
    position: "",
  };
  const totalPagesAccueil = Math.max(1, Math.ceil(modelesAccueil.length / MAX_MODELES_ACCUEIL_AVEC_TEASERS));
  pageAccueilModeles = ((pageAccueilModeles % totalPagesAccueil) + totalPagesAccueil) % totalPagesAccueil;
  const modelesAccueilPage = modelesAccueil.slice(
    pageAccueilModeles * MAX_MODELES_ACCUEIL_AVEC_TEASERS,
    pageAccueilModeles * MAX_MODELES_ACCUEIL_AVEC_TEASERS + MAX_MODELES_ACCUEIL_AVEC_TEASERS,
  );
  elements.galerieModelesAccueil.replaceChildren(...modelesAccueilPage.map((style) => creerCarteModele({
    valeur: style.reglages.modele,
    libelle: style.nom,
    styleId: style.id,
    ligneDemo: ligneDemoAccueil,
    actif: modelePrincipal === style.reglages.modele,
    cible: "principale",
    reglagesBase: lireReglages("1"),
    reglagesStyle: style.reglages,
    vierge: true,
  })), creerCarteModeleIndisponible(), creerCarteModelePropose());
  const navigationAccueilVisible = modelesAccueil.length > MAX_MODELES_ACCUEIL_AVEC_TEASERS;
  elements.modelesAccueilPrecedent.hidden = !navigationAccueilVisible;
  elements.modelesAccueilSuivant.hidden = !navigationAccueilVisible;
  elements.modelesAccueilPrecedent.disabled = !navigationAccueilVisible;
  elements.modelesAccueilSuivant.disabled = !navigationAccueilVisible;

  synchroniserBoutonDeuxiemeEtiquette(deuxiemeActive);
  elements.miseEnAvantSecondaire.classList.toggle("is-active", deuxiemeActive);
  elements.blocGalerieSecondaire.hidden = !deuxiemeActive;
  pageModelesSecondaires = normaliserPage(pageModelesSecondaires, modelesSecondaires.length, MAX_MODELES_SECONDAIRES);
  const modelesSecondairesPage = modelesSecondaires.slice(
    pageModelesSecondaires * MAX_MODELES_SECONDAIRES,
    pageModelesSecondaires * MAX_MODELES_SECONDAIRES + MAX_MODELES_SECONDAIRES,
  );
  elements.galerieModelesSecondaires.replaceChildren(
    ...modelesSecondairesPage.map((style) => creerCarteModele({
      valeur: style.reglages.modele,
      libelle: style.nom,
      styleId: style.id,
      ligneDemo,
      actif: deuxiemeActive && modeleSecondaire === style.reglages.modele,
      cible: "secondaire",
      reglagesBase: lireReglages("1"),
      reglagesStyle: style.reglages,
    })),
  );
  mettreAJourBoutonsNavigationModeles(
    elements.modelesSecondairesPrecedent,
    elements.modelesSecondairesSuivant,
    modelesSecondaires.length,
    MAX_MODELES_SECONDAIRES,
  );
}

function obtenirModelesAccueil(categorie) {
  const modeles = obtenirStylesEtiquettes(categorie);
  const signature = modeles.map((style) => style.id).join("|");
  const cache = modelesAccueilMelanges.get(categorie);
  if (cache?.signature === signature) {
    return cache.modeles;
  }
  const modelesMelanges = melangerOrdreModeles(modeles);
  modelesAccueilMelanges.set(categorie, { signature, modeles: modelesMelanges });
  return modelesMelanges;
}

function melangerOrdreModeles(modeles) {
  const melanges = [...modeles];
  for (let index = melanges.length - 1; index > 0; index -= 1) {
    const cible = Math.floor(Math.random() * (index + 1));
    [melanges[index], melanges[cible]] = [melanges[cible], melanges[index]];
  }
  return melanges;
}

function normaliserPage(page, total, pageSize) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return ((page % totalPages) + totalPages) % totalPages;
}

function mettreAJourBoutonsNavigationModeles(precedent, suivant, total, pageSize) {
  const visible = total > pageSize;
  precedent.hidden = !visible;
  suivant.hidden = !visible;
  precedent.disabled = !visible;
  suivant.disabled = !visible;
}

function changerPageModeles(cible, delta) {
  const totalSecondaires = obtenirStylesEtiquettes("tout").length;
  pageModelesSecondaires = normaliserPage(
    pageModelesSecondaires + delta,
    totalSecondaires,
    MAX_MODELES_SECONDAIRES,
  );
  mettreAJourGalerieModeles();
}

function changerPageModelesAccueil(delta) {
  const total = obtenirModelesAccueil("tout").length;
  const totalPages = Math.max(1, Math.ceil(total / MAX_MODELES_ACCUEIL_AVEC_TEASERS));
  pageAccueilModeles = (pageAccueilModeles + delta + totalPages) % totalPages;
  mettreAJourGalerieModeles();
}

function creerCarteModele({ valeur, libelle, styleId = "", ligneDemo, actif, cible, reglagesBase, reglagesStyle = null, vierge = false }) {
  const bouton = document.createElement("button");
  bouton.className = "carte-modele";
  bouton.type = "button";
  bouton.dataset.modele = valeur;
  bouton.dataset.modeleCible = cible;
  if (styleId) {
    bouton.dataset.styleId = styleId;
  }
  bouton.setAttribute("aria-pressed", String(actif));
  if (actif) {
    bouton.classList.add("is-actif");
  }

  const reglagesDefaut = obtenirReglagesDefautModele(valeur) || {};
  const reglagesCarte = {
    ...reglagesDefaut,
    ...(reglagesStyle || presets[valeur]),
    modele: valeur,
    largeurEtiquette: reglagesBase?.largeurEtiquette ?? reglagesDefaut.largeurEtiquette,
    hauteurEtiquette: reglagesBase?.hauteurEtiquette ?? reglagesDefaut.hauteurEtiquette,
  };
  if (!Object.prototype.hasOwnProperty.call(reglagesStyle || presets[valeur] || {}, "motifRuban")) {
    reglagesCarte.motifRuban = false;
    reglagesCarte.motifRubanType = "aucun";
    reglagesCarte.opaciteMotifRuban = 45;
    reglagesCarte.angleMotifRuban = 0;
  }
  const apercu = document.createElement("span");
  apercu.className = "carte-modele__apercu";

  const image = document.createElement("img");
  image.className = "carte-modele__image carte-modele__image--base";
  image.dataset.nomModele = libelle;
  image.alt = `${traduirePhrase("Aperçu")} ${libelle}`;
  image.src = dessinerEtiquette(ligneDemo, reglagesCarte).toDataURL("image/png");

  const imageVariante = document.createElement("img");
  imageVariante.className = "carte-modele__image carte-modele__image--variante";
  imageVariante.alt = "";
  imageVariante.setAttribute("aria-hidden", "true");

  const cycleVariante = creerCycleVarianteSurvol(reglagesCarte);
  const mettreAJourVariante = () => {
    imageVariante.src = dessinerEtiquette(ligneDemo, cycleVariante.prochaine()).toDataURL("image/png");
  };
  mettreAJourVariante();
  let varianteDejaAffichee = false;
  bouton.addEventListener("pointerenter", () => {
    if (MEDIA_SURVOL_PRECIS.matches) {
      if (varianteDejaAffichee) {
        mettreAJourVariante();
      } else {
        varianteDejaAffichee = true;
      }
    }
  });

  const nom = document.createElement("span");
  nom.className = "carte-modele__nom";
  nom.textContent = libelle;

  apercu.append(image, imageVariante);
  bouton.append(apercu, nom);
  return bouton;
}

function creerCycleVarianteSurvol(reglages) {
  const motifsDecorRecents = [reglages.motifRubanType, reglages.motifType].filter((motif) => motif && motif !== "aucun");
  const avecDecorMotifVarie = (variante) => {
    const varianteAvecDecor = appliquerDecorMotifVariante(variante, reglages, motifsDecorRecents);
    return {
      ...appliquerBordureVisibleAleatoire(varianteAvecDecor),
      // Une variante peut proposer d'autres textes latéraux, mais seul
      // l'utilisateur décide s'ils sont visibles ou non, lorsque le modèle
      // prend en charge ces mentions.
      afficherMarques: capacitesModeles[reglages.modele]?.marques === true
        && reglages.afficherMarques === true,
      ...(reglages.couleurMarquesManuelle ? {
        couleurMarques: reglages.couleurMarques,
        couleurMarqueGauche: reglages.couleurMarqueGauche,
        couleurMarqueDroite: reglages.couleurMarqueDroite,
        couleurMarquesManuelle: true,
      } : {}),
    };
  };
  const premiereVariante = avecDecorMotifVarie(creerVarianteCouleur(reglages));
  let premiereVarianteAffichee = false;
  let dernierePalette = null;

  const prochaine = () => {
    if (!premiereVarianteAffichee) {
      premiereVarianteAffichee = true;
      return premiereVariante;
    }

    const palettesPossibles = PALETTES_TEINTES.filter((palette) => palette !== dernierePalette);
    dernierePalette = choisirAleatoire(palettesPossibles.length ? palettesPossibles : PALETTES_TEINTES);
    return appliquerPaletteTeinte(premiereVariante, dernierePalette);
  };

  return { prochaine };
}

function creerCycleVariante(reglages) {
  const signatureBase = signatureStyleEnregistre(reglages);
  const stylesEnregistres = obtenirStylesEtiquettes("tout")
    .filter((item) => item.reglages?.modele === reglages.modele && !estStyleParDefautVariante(item, reglages.modele))
    .map((item) => normaliserReglagesStyle(item.reglages))
    .filter((reglagesStyle) => signatureStyleEnregistre(reglagesStyle) !== signatureBase);
  const signaturesRecentes = [signatureBase];
  const motifsDecorRecents = [reglages.motifRubanType, reglages.motifType].filter((motif) => motif && motif !== "aucun");
  let couleurProposee = false;
  let indexStyle = 0;
  const avecDecorMotifVarie = (variante) => {
    const varianteAvecDecor = appliquerDecorMotifVariante(variante, reglages, motifsDecorRecents);
    [varianteAvecDecor.motifRubanType, varianteAvecDecor.motifType]
      .filter((motif) => motif && motif !== "aucun")
      .forEach((motif) => motifsDecorRecents.push(motif));
    motifsDecorRecents.splice(0, Math.max(0, motifsDecorRecents.length - 4));
    return {
      ...appliquerBordureVisibleAleatoire(varianteAvecDecor),
      // Une variante peut proposer d'autres textes latéraux, mais seul
      // l'utilisateur décide s'ils sont visibles ou non, lorsque le modèle
      // prend en charge ces mentions.
      afficherMarques: capacitesModeles[reglages.modele]?.marques === true
        && reglages.afficherMarques === true,
      ...(reglages.couleurMarquesManuelle ? {
        couleurMarques: reglages.couleurMarques,
        couleurMarqueGauche: reglages.couleurMarqueGauche,
        couleurMarqueDroite: reglages.couleurMarqueDroite,
        couleurMarquesManuelle: true,
      } : {}),
    };
  };

  const prochaine = () => {
    if (!couleurProposee) {
      couleurProposee = true;
      const varianteCouleur = avecDecorMotifVarie(creerVarianteCouleur(reglages));
      const signatureCouleur = signatureStyleEnregistre(varianteCouleur);
      if (signatureCouleur !== signatureBase) {
        signaturesRecentes.push(signatureCouleur);
        return varianteCouleur;
      }
    }

    while (indexStyle < stylesEnregistres.length) {
      const style = stylesEnregistres[indexStyle];
      indexStyle += 1;
      const styleAvecMotif = avecDecorMotifVarie(style);
      const signatureStyle = signatureStyleEnregistre(styleAvecMotif);
      if (!signaturesRecentes.includes(signatureStyle)) {
        signaturesRecentes.push(signatureStyle);
        return styleAvecMotif;
      }
    }

    const surprise = avecDecorMotifVarie(creerSurpriseDistinctePourApercu(reglages, signaturesRecentes));
    signaturesRecentes.push(signatureStyleEnregistre(surprise));
    signaturesRecentes.splice(0, Math.max(0, signaturesRecentes.length - 12));
    return surprise;
  };

  return { prochaine };
}

function creerVarianteCouleur(reglages) {
  if (reglages.modele === "MANU") {
    return creerVarianteManu(reglages);
  }
  if (reglages.modele === "CELESTE") {
    return creerVarianteModerne(reglages);
  }
  return creerVarianteClassique(reglages);
}

function appliquerBordureVisibleAleatoire(reglages) {
  const mode = choisirAleatoire(["horizontale", "verticale", "complete"]);
  return {
    ...reglages,
    bordureHorizontale: mode !== "verticale",
    bordureVerticale: reglages.modele === "JEAN" ? false : mode !== "horizontale",
  };
}

function appliquerDecorMotifVariante(reglages, reglagesBase = reglages, motifsExclus = []) {
  const rubanDisponible = Boolean(capacitesModeles[reglages.modele]?.ruban);
  const choixPossibles = rubanDisponible
    ? REPARTITION_DECOR_VARIANTES
    : ["aucun", "aucun", "aucun", "fond"];
  const decorMotif = choisirAleatoire(choixPossibles);
  if (decorMotif === "aucun") {
    return {
      ...reglages,
      decorPanel: reglages.modeVignette && reglages.modeVignette !== "aucun" ? "vignette" : reglages.decorPanel,
      motifType: "aucun",
      motifFond: false,
      motifRuban: false,
      motifRubanType: "aucun",
      afficherTraitsModernes: false,
    };
  }

  const motifsAEviter = new Set([reglagesBase.motifRubanType, reglagesBase.motifType, ...motifsExclus].filter(Boolean));
  const motifsPossibles = MOTIFS_DECOR_VARIANTES.filter((motif) => !motifsAEviter.has(motif));
  const motifChoisi = choisirAleatoire(motifsPossibles.length ? motifsPossibles : MOTIFS_DECOR_VARIANTES);
  const motifDansFond = decorMotif === "fond" || decorMotif === "deux";
  const motifDansRuban = rubanDisponible && (decorMotif === "ruban" || decorMotif === "deux");

  return {
    ...reglages,
    decorPanel: "motif",
    motifType: motifDansFond ? motifChoisi : "aucun",
    motifFond: motifDansFond,
    couleurMotif: reglages.couleurMotif || reglages.couleur1,
    motif: motifDansFond ? nombreAleatoire(10, 18, 1) : (Number(reglages.motif) || 0),
    angleMotif: motifDansFond ? nombreAleatoire(-35, 35, 5) : (Number(reglages.angleMotif) || 0),
    motifRuban: motifDansRuban,
    motifRubanType: motifDansRuban ? motifChoisi : "aucun",
    couleurMotifRuban: reglages.couleurMotifRuban || reglages.couleurMotif || reglages.couleur1,
    opaciteMotifRuban: motifDansRuban ? nombreAleatoire(10, 18, 1) : (Number(reglages.opaciteMotifRuban) || 0),
    angleMotifRuban: motifDansRuban ? nombreAleatoire(-40, 40, 5) : (Number(reglages.angleMotifRuban) || 0),
    afficherTraitsModernes: false,
  };
}

function creerSurprisePourApercuVariante(reglages) {
  if (reglages.modele === "MANU") {
    return creerSurpriseManu(reglages);
  }
  if (reglages.modele === "LEON") {
    return creerSurpriseLeon(reglages);
  }
  return creerVarianteClassiqueAleatoire(reglages);
}

function creerSurpriseDistinctePourApercu(reglages, signaturesRecentes) {
  let surprise = null;
  for (let tentative = 0; tentative < 40; tentative += 1) {
    surprise = { ...creerSurprisePourApercuVariante(reglages), decalageRetro: "aucun" };
    if (!signaturesRecentes.includes(signatureStyleEnregistre(surprise))) {
      return surprise;
    }
  }
  return surprise || { ...reglages, decalageRetro: "aucun" };
}

function creerVarianteClassiqueAleatoire(reglages) {
  const combo = choisirAleatoire(combosSurprise);
  const variation = choisirAleatoire(["original", "inverse", "ruban-fond-haut", "ruban-fond-bas"]);
  const [couleur1, couleur2, couleur3, couleurRuban, couleurTitreSource, couleurArtiste, couleurMarques] = combo.couleurs;
  const fondHaut = variation === "inverse" ? couleur3 : couleur2;
  const fondBas = variation === "inverse" ? couleur2 : couleur3;
  const ruban = variation === "ruban-fond-haut" ? couleur2 : variation === "ruban-fond-bas" ? couleur3 : couleurRuban;
  const marques = creerMarquesSurprise(combo, reglages);

  return {
    ...reglages,
    couleur1,
    couleur2: fondHaut,
    couleur3: fondBas,
    couleurRuban: ruban,
    couleurVignette: variation === "inverse" ? couleur1 : couleurRuban,
    couleurTitreFaceA: couleurLisible(fondHaut, couleurTitreSource),
    couleurTitreFaceB: couleurLisible(fondBas, couleurTitreSource),
    couleurTitreFaceAManuelle: false,
    couleurTitreFaceBManuelle: false,
    couleurArtiste: couleurLisible(ruban, couleurArtiste),
    couleurMarques: couleurLisible(couleur1, couleurMarques),
    couleurMotif: couleur1,
    decorPanel: combo.decor,
    motifType: combo.motif,
    modeVignette: combo.vignette,
    intensite: combo.vignette === "aucun" ? reglages.intensite : nombreAleatoire(60, 92, 2),
    motif: nombreAleatoire(28, 76, 2),
    angleMotif: nombreAleatoire(-30, 30, 2),
    vignette: combo.vignette === "aucun" ? reglages.vignette : nombreAleatoire(18, 44, 2),
    bordure: nombreAleatoire(38, 92, 2),
    largeurRuban: nombreAleatoire(72, 96, 2),
    hauteurRuban: nombreAleatoire(22, 34, 1),
    hauteurBande: reglages.modele === "ALICE" ? nombreAleatoire(8, 24, 1) : reglages.hauteurBande,
    ...marques,
  };
}

function creerCarteModeleIndisponible() {
  const carte = document.createElement("div");
  carte.className = "carte-modele carte-modele--indisponible";
  carte.setAttribute("aria-disabled", "true");

  const etiquette = document.createElement("div");
  etiquette.className = "carte-modele__teaser";
  etiquette.textContent = traduirePhrase("Prochaine étiquette bientôt disponible");

  const nom = document.createElement("span");
  nom.className = "carte-modele__nom";
  nom.textContent = traduirePhrase("Bientôt disponible");

  carte.append(etiquette, nom);
  return carte;
}

function creerCarteModelePropose() {
  const carte = document.createElement("div");
  carte.className = "carte-modele carte-modele--indisponible";
  carte.setAttribute("aria-disabled", "true");

  const etiquette = document.createElement("div");
  etiquette.className = "carte-modele__teaser";
  etiquette.textContent = traduirePhrase("Votre étiquette ici ?");

  const nom = document.createElement("span");
  nom.className = "carte-modele__nom";
  nom.textContent = traduirePhrase("Envoyez-moi votre modèle");

  carte.append(etiquette, nom);
  return carte;
}

function choisirModeleDepuisAccueil(evenement) {
  const bouton = evenement.target.closest("[data-modele]");
  if (!bouton) {
    return;
  }
  enregistrerHistoriqueAvantAction();
  if (bouton.dataset.styleId) {
    afficherApercuApresChoixModele();
    if (appliquerStyleEtiquetteEnregistre(bouton.dataset.styleId)) {
      activerEtapeReglage("organisation");
      mettreAJour();
      return;
    }
  }
  elements.modele.value = bouton.dataset.modele;
  appliquerPreset(bouton.dataset.modele);
  if (champDimensionHorsLimites(elements.largeurEtiquette, "largeurEtiquette")
    || champDimensionHorsLimites(elements.hauteurEtiquette, "hauteurEtiquette")) {
    mettreAJourMessageDimensions();
    return;
  }
  afficherApercuApresChoixModele();
  activerEtapeReglage("organisation");
  mettreAJour();
}

function choisirModeleSecondaireDepuisGalerie(evenement) {
  const bouton = evenement.target.closest("[data-modele]");
  if (!bouton || (etiquetteActive === "2" && styleActifVerrouille())) {
    return;
  }
  enregistrerHistoriqueAvantAction();
  enregistrerReglagesActifs();
  elements.modeleSecondaire.value = bouton.dataset.modele;
  synchroniserBoutonDeuxiemeEtiquette(true);
  afficherApercuApresChoixModele();
  const style = bouton.dataset.styleId ? obtenirStyleEtiquette(bouton.dataset.styleId) : null;
  const reglagesPrincipaux = lireReglages("1");
  const memeModeleQuePrincipal = bouton.dataset.modele === reglagesPrincipaux.modele;
  reglagesParEtiquette[2] = memeModeleQuePrincipal
    ? appliquerBordureVisibleAleatoire(creerVarianteCouleur(reglagesPrincipaux))
    : style ? normaliserReglagesStyle(style.reglages) : creerReglagesSecondaires();
  etiquetteActive = "2";
  elements.editionEtiquette.forEach((radio) => {
    radio.checked = radio.value === "2";
  });
  appliquerReglagesAuFormulaire(lireReglages("2"));
  mettreAJourGalerieModeles();
  mettreAJour();
}

function deuxiemeEtiquetteActive() {
  return [...elements.deuxiemeEtiquette].some((radio) => radio.value === "oui" && radio.checked);
}

function obtenirCleLigneApercu(numero = etiquetteActive) {
  const ligne = obtenirLigneApercu(obtenirLignes(), numero);
  return ligne ? String(ligne.index) : null;
}

function styleActifVerrouille() {
  const cle = obtenirCleLigneApercu();
  return cle !== null && Boolean(stylesVerrouillesParLigne[cle]);
}

function basculerVerrouillageStyle() {
  enregistrerHistoriqueAvantAction();
  const cle = obtenirCleLigneApercu();
  if (cle === null) {
    return;
  }
  const verrouiller = !stylesVerrouillesParLigne[cle];
  stylesVerrouillesParLigne[cle] = verrouiller;
  if (verrouiller) {
    reglagesParLigne[cle] = lireReglagesFormulaire();
  } else {
    const reglagesConserves = clonerReglages(reglagesParLigne[cle]) || lireReglagesFormulaire();
    reglagesParEtiquette[etiquetteActive] = reglagesConserves;
    delete reglagesParLigne[cle];
    appliquerReglagesAuFormulaire(reglagesConserves);
  }
  sauvegarderReglagesAutomatiques();
  mettreAJour();
}

function mettreAJourVerrouillageStyle() {
  const verrouille = styleActifVerrouille();
  const libelle = traduirePhrase(verrouille ? "Déverrouiller le style" : "Verrouiller le style");
  elements.verrouillerStyle.querySelector("span").textContent = verrouille ? "🔒" : "🔓";
  elements.verrouillerStyle.setAttribute("aria-pressed", String(verrouille));
  elements.verrouillerStyle.setAttribute("aria-label", libelle);
  elements.verrouillerStyle.title = libelle;
  elements.verrouillerStyle.classList.toggle("is-verrouille", verrouille);

  elements.panneauxReglages.forEach((panneau) => {
    const verrouillable = !["organisation", "style", "reglages", "donnees", "favoris"].includes(panneau.dataset.tabPanel);
    const panneauVerrouille = verrouille && verrouillable;
    const message = obtenirMessagePanneauVerrouille(panneau);
    Array.from(panneau.children).forEach((enfant) => {
      if (enfant !== message) {
        enfant.inert = panneauVerrouille;
      }
    });
    panneau.classList.toggle("is-verrouille", panneauVerrouille);
    panneau.toggleAttribute("tabindex", panneauVerrouille);
    panneau.toggleAttribute("role", panneauVerrouille);
    if (panneauVerrouille) {
      panneau.tabIndex = 0;
      panneau.setAttribute("role", "button");
      panneau.setAttribute("aria-label", traduirePhrase("Déverrouillez l’étiquette avec le cadenas pour la modifier."));
    } else {
      panneau.removeAttribute("aria-label");
      message.hidden = true;
    }
  });

  const verrouillerModeleSecondaire = verrouille && etiquetteActive === "2";
  elements.galerieModelesSecondaires.inert = verrouillerModeleSecondaire;
  elements.galerieModelesSecondaires.classList.toggle("is-verrouille", verrouillerModeleSecondaire);
  elements.modelesSecondairesPrecedent.disabled = verrouillerModeleSecondaire;
  elements.modelesSecondairesSuivant.disabled = verrouillerModeleSecondaire;

  [
    elements.inverser,
    elements.teinte,
    elements.importerStyleDonnees,
    elements.importerReglagesFavoris,
  ].forEach((bouton) => {
    bouton.disabled = verrouille;
  });
  mettreAJourEtatBoutonReset(verrouille);
  elements.importStyleFile.disabled = verrouille;
  const clePrincipale = obtenirCleLigneApercu("1");
  const cleSecondaire = obtenirCleLigneApercu("2");
  elements.apercu.classList.toggle("is-verrouillee", clePrincipale !== null && Boolean(stylesVerrouillesParLigne[clePrincipale]));
  elements.apercuSecondaire.classList.toggle("is-verrouillee", cleSecondaire !== null && Boolean(stylesVerrouillesParLigne[cleSecondaire]));
}

function obtenirMessagePanneauVerrouille(panneau) {
  let message = panneau.querySelector(":scope > .message-panneau-verrouille");
  if (!message) {
    message = document.createElement("p");
    message.className = "message-panneau-verrouille";
    message.setAttribute("aria-live", "polite");
    message.hidden = true;
    panneau.append(message);
  }
  message.textContent = traduirePhrase("Déverrouillez l’étiquette avec le cadenas pour la modifier.");
  return message;
}

function afficherMessagePanneauVerrouille(panneau) {
  const message = obtenirMessagePanneauVerrouille(panneau);
  const minuterieExistante = minuteriesMessageVerrouillage.get(panneau);
  if (minuterieExistante) {
    clearTimeout(minuterieExistante);
  }
  message.hidden = false;
  message.classList.remove("is-visible");
  requestAnimationFrame(() => message.classList.add("is-visible"));
  const minuterie = window.setTimeout(() => {
    message.classList.remove("is-visible");
    window.setTimeout(() => {
      message.hidden = true;
    }, 180);
    minuteriesMessageVerrouillage.delete(panneau);
  }, 2600);
  minuteriesMessageVerrouillage.set(panneau, minuterie);
}

function synchroniserBoutonDeuxiemeEtiquette(active) {
  elements.deuxiemeEtiquette.forEach((radio) => {
    radio.checked = radio.value === (active ? "oui" : "non");
  });
}

function initialiserReglagesDefautModeles() {
  const reglagesSocle = lireReglagesFormulaire();
  reglagesDefautParModele.clear();

  Object.entries(presets).forEach(([modele, preset]) => {
    appliquerReglagesAuFormulaire({
      ...reglagesSocle,
      ...preset,
      theme: preset.theme || "tout",
      modele,
    });
    reglagesDefautParModele.set(modele, lireReglagesFormulaire());
  });

  appliquerReglagesAuFormulaire(reglagesSocle);
}

function obtenirReglagesDefautModele(modele) {
  const reglages = reglagesDefautParModele.get(modele);
  return reglages ? { ...reglages } : null;
}

function appliquerReglagesAuFormulaire(reglages) {
  chargementReglages = true;
  const reglagesNormalises = { ...reglages };
  reglagesNormalises.couleurTitreFaceAManuelle = reglagesNormalises.couleurTitreFaceAManuelle ?? false;
  reglagesNormalises.couleurTitreFaceBManuelle = reglagesNormalises.couleurTitreFaceBManuelle ?? false;
  const epaisseurBordure = Number(reglagesNormalises.bordure);
  reglagesNormalises.bordure = Number.isFinite(epaisseurBordure)
    ? Math.max(EPAISSEUR_BORDURE_MIN, Math.min(100, epaisseurBordure))
    : EPAISSEUR_BORDURE_MIN;
  reglagesNormalises.decalageRetro = reglagesNormalises.decalageRetro === "un-titre"
    ? "titre-face-a"
    : reglagesNormalises.decalageRetro || "aucun";
  reglagesNormalises.irregulariteCaracteres = [true, 1, "true", "1"].includes(reglagesNormalises.irregulariteCaracteres);
  reglagesNormalises.deplacementTextesManuel = [true, 1, "true", "1"].includes(reglagesNormalises.deplacementTextesManuel);
  [
    "decalageTitreAX",
    "decalageTitreAY",
    "decalageArtisteX",
    "decalageArtisteY",
    "decalageTitreBX",
    "decalageTitreBY",
  ].forEach((cle) => {
    const valeur = Number(reglagesNormalises[cle]);
    reglagesNormalises[cle] = Number.isFinite(valeur) ? Math.max(-5, Math.min(5, valeur)) : 0;
  });
  reglagesNormalises.angleMotif = reglagesNormalises.angleMotif ?? 0;
  const intensitePatine = Number(reglagesNormalises.intensitePatine ?? 55);
  reglagesNormalises.intensitePatine = Number.isFinite(intensitePatine)
    ? Math.max(0, Math.min(100, intensitePatine))
    : 55;
  reglagesNormalises.activerPatine = (
    [true, 1, "true", "1"].includes(reglagesNormalises.activerPatine)
    && reglagesNormalises.intensitePatine > 0
  );
  reglagesNormalises.motifFond = reglagesNormalises.motifFond ?? true;
  reglagesNormalises.motifRuban = reglagesNormalises.motifRuban ?? false;
  reglagesNormalises.motifSecondaireFond = reglagesNormalises.motifSecondaireFond ?? true;
  reglagesNormalises.motifSecondaireRuban = reglagesNormalises.motifSecondaireRuban ?? false;
  reglagesNormalises.motifRubanType = reglagesNormalises.motifRubanType || reglagesNormalises.motifType || "aucun";
  reglagesNormalises.couleurMotifRuban = reglagesNormalises.couleurMotifRuban || reglagesNormalises.couleurMotif || reglagesNormalises.couleur1;
  reglagesNormalises.opaciteMotifRuban = reglagesNormalises.opaciteMotifRuban ?? reglagesNormalises.motif ?? 45;
  reglagesNormalises.angleMotifRuban = reglagesNormalises.angleMotifRuban ?? reglagesNormalises.angleMotif ?? 0;
  reglagesNormalises.bordureHorizontale = reglagesNormalises.bordureHorizontale ?? true;
  reglagesNormalises.bordureVerticale = reglagesNormalises.modele === "JEAN"
    ? false
    : reglagesNormalises.bordureVerticale ?? true;
  reglagesNormalises.arrondiInterieurBordure = reglagesNormalises.arrondiInterieurBordure ?? false;
  if (!capacitesModeles[reglagesNormalises.modele]?.bandeCentrale) {
    reglagesNormalises.hauteurBande = 0;
  }
  reglagesNormalises.afficherEtoiles = reglagesNormalises.afficherEtoiles ?? reglagesNormalises.modele === "STELLA";
  reglagesNormalises.nombreEtoiles = Math.max(3, Math.min(5, Math.round(Number(reglagesNormalises.nombreEtoiles) || 5)));
  reglagesNormalises.dispositionEtoiles = ["droite", "concave", "convexe"].includes(reglagesNormalises.dispositionEtoiles)
    ? reglagesNormalises.dispositionEtoiles
    : "droite";
  reglagesNormalises.courbureEtoiles = Math.max(0, Math.min(100, Number(reglagesNormalises.courbureEtoiles) || 0));
  reglagesNormalises.positionHorizontaleEtoiles = Math.max(3, Math.min(18, Number(reglagesNormalises.positionHorizontaleEtoiles) || 7));
  reglagesNormalises.positionVerticaleEtoiles = Math.max(35, Math.min(65, Number(reglagesNormalises.positionVerticaleEtoiles) || 50));
  reglagesNormalises.etendueEtoiles = Math.max(35, Math.min(78, Number(reglagesNormalises.etendueEtoiles) || 66));
  reglagesNormalises.tailleEtoiles = Math.max(70, Math.min(130, Number(reglagesNormalises.tailleEtoiles) || 100));
  reglagesNormalises.couleurFondEtoiles = reglagesNormalises.couleurFondEtoiles || reglagesNormalises.couleur2 || "#ffffff";
  reglagesNormalises.epaisseurTraitsLEON = reglagesNormalises.epaisseurTraitsLEON ?? 3;
  reglagesNormalises.positionTraitsLEON = reglagesNormalises.positionTraitsLEON ?? 50;
  reglagesNormalises.ecartTraitsLEON = reglagesNormalises.ecartTraitsLEON ?? 24;
  reglagesNormalises.tailleTrianglesJEAN = reglagesNormalises.tailleTrianglesJEAN ?? 11;
  reglagesNormalises.tailleTrianglesJEAN = convertirTailleTrianglesEnCurseur(reglagesNormalises.tailleTrianglesJEAN);
  reglagesNormalises.afficherMarques = capacitesModeles[reglagesNormalises.modele]?.marques === true
    && [true, 1, "true", "1"].includes(reglagesNormalises.afficherMarques);
  reglagesNormalises.couleurMarquesManuelle = [true, 1, "true", "1"].includes(
    reglagesNormalises.couleurMarquesManuelle,
  );
  if (reglagesNormalises.afficherMarques && !reglagesNormalises.couleurMarquesManuelle) {
    reglagesNormalises.couleurMarques = couleurMarquesAutomatique(reglagesNormalises);
    reglagesNormalises.couleurMarqueGauche = reglagesNormalises.couleurMarques;
    reglagesNormalises.couleurMarqueDroite = reglagesNormalises.couleurMarques;
  }
  reglagesNormalises.synchroniserMarques = ![false, 0, "false", "0"].includes(reglagesNormalises.synchroniserMarques);
  reglagesNormalises.marquesVerticales = [true, 1, "true", "1"].includes(
    reglagesNormalises.marquesVerticales ?? reglagesNormalises.marquesVerticalesJEAN,
  );
  reglagesNormalises.marqueGaucheTexte = reglagesNormalises.marqueGaucheTexte ?? reglagesNormalises.marqueGauche ?? "";
  reglagesNormalises.marqueDroiteTexte = reglagesNormalises.marqueDroiteTexte ?? reglagesNormalises.marqueDroite ?? "";
  reglagesNormalises.couleurMarqueGauche = reglagesNormalises.couleurMarqueGauche || reglagesNormalises.couleurMarques;
  reglagesNormalises.couleurMarqueDroite = reglagesNormalises.couleurMarqueDroite || reglagesNormalises.couleurMarques;
  reglagesNormalises.formePastille = reglagesNormalises.formePastille || "rond";
  reglagesNormalises.diametrePastille = reglagesNormalises.diametrePastille ?? 33;
  reglagesNormalises.formePastilleGauche = reglagesNormalises.formePastilleGauche || reglagesNormalises.formePastille;
  reglagesNormalises.formePastilleDroite = reglagesNormalises.formePastilleDroite || reglagesNormalises.formePastille;
  reglagesNormalises.diametrePastilleGauche = reglagesNormalises.diametrePastilleGauche ?? reglagesNormalises.diametrePastille;
  reglagesNormalises.diametrePastilleDroite = reglagesNormalises.diametrePastilleDroite ?? reglagesNormalises.diametrePastille;
  reglagesNormalises.policeMarqueGauche = reglagesNormalises.policeMarqueGauche || reglagesNormalises.policeMarques;
  reglagesNormalises.policeMarqueDroite = reglagesNormalises.policeMarqueDroite || reglagesNormalises.policeMarques;
  reglagesNormalises.policeTitres = normaliserIdPolice(reglagesNormalises.policeTitres);
  reglagesNormalises.policeArtiste = normaliserIdPolice(reglagesNormalises.policeArtiste);
  reglagesNormalises.policeMarques = normaliserIdPolice(reglagesNormalises.policeMarques, "compacte");
  reglagesNormalises.policeMarqueGauche = normaliserIdPolice(reglagesNormalises.policeMarqueGauche, "compacte");
  reglagesNormalises.policeMarqueDroite = normaliserIdPolice(reglagesNormalises.policeMarqueDroite, "compacte");
  reglagesNormalises.styleMarqueGauche = reglagesNormalises.styleMarqueGauche || "gras";
  reglagesNormalises.styleMarqueDroite = reglagesNormalises.styleMarqueDroite || "gras";
  reglagesNormalises.styleTitres = normaliserStylePolice(reglagesNormalises.policeTitres, reglagesNormalises.styleTitres || "normal");
  reglagesNormalises.styleArtiste = normaliserStylePolice(reglagesNormalises.policeArtiste, reglagesNormalises.styleArtiste || "normal");
  reglagesNormalises.retourLigneTitres = reglagesNormalises.retourLigneTitres !== false;
  reglagesNormalises.styleMarqueGauche = normaliserStylePolice(reglagesNormalises.policeMarqueGauche, reglagesNormalises.styleMarqueGauche);
  reglagesNormalises.styleMarqueDroite = normaliserStylePolice(reglagesNormalises.policeMarqueDroite, reglagesNormalises.styleMarqueDroite);
  reglagesNormalises.tailleMarqueGauche = reglagesNormalises.tailleMarqueGauche ?? reglagesNormalises.tailleMarques;
  reglagesNormalises.tailleMarqueDroite = reglagesNormalises.tailleMarqueDroite ?? reglagesNormalises.tailleMarques;
  reglagesNormalises.angleMarqueGauche = reglagesNormalises.angleMarqueGauche ?? reglagesNormalises.angleMarques;
  reglagesNormalises.angleMarqueDroite = reglagesNormalises.angleMarqueDroite ?? -Number(reglagesNormalises.angleMarques || 0);
  reglagesNormalises.positionMarqueGauche = reglagesNormalises.positionMarqueGauche ?? reglagesNormalises.positionMarques;
  reglagesNormalises.positionMarqueDroite = reglagesNormalises.positionMarqueDroite ?? reglagesNormalises.positionMarques;
  reglagesNormalises.hauteurMarqueGauche = reglagesNormalises.hauteurMarqueGauche ?? reglagesNormalises.hauteurMarques;
  reglagesNormalises.hauteurMarqueDroite = reglagesNormalises.hauteurMarqueDroite ?? reglagesNormalises.hauteurMarques;
  if (reglagesNormalises.decorPanel && !["motif", "vignette", "patine"].includes(reglagesNormalises.decorPanel)) {
    reglagesNormalises.decorPanel = "motif";
  }
  reglagesNormalises.decorPanel = reglagesNormalises.decorPanel || (
    reglagesNormalises.modeVignette && reglagesNormalises.modeVignette !== "aucun" ? "vignette" : "motif"
  );
  Object.entries(reglagesNormalises).forEach(([cle, valeur]) => {
    const element = elements[cle];
    if (!element) {
      return;
    }
    if (element.type === "checkbox") {
      element.checked = Boolean(valeur);
    } else {
      element.value = String(valeur);
    }
  });
  elements.couleurTitreFaceA.dataset.modifieeManuellement = reglagesNormalises.couleurTitreFaceAManuelle ? "true" : "false";
  elements.couleurTitreFaceB.dataset.modifieeManuellement = reglagesNormalises.couleurTitreFaceBManuelle ? "true" : "false";
  elements.couleurArtiste.dataset.modifieeManuellement = reglagesNormalises.couleurArtisteManuelle ? "true" : "false";
  elements.couleurMarques.dataset.modifieeManuellement = reglagesNormalises.couleurMarquesManuelle ? "true" : "false";
  synchroniserOptionsMotifSecondaire(reglagesNormalises.motifTraitsModernes);
  elements.activerMotif.checked = motifDecorActifDepuisFormulaire();
  elements.activerVignettage.checked = reglagesNormalises.modeVignette !== "aucun";
  elements.activerPatine.checked = reglagesNormalises.activerPatine;
  const decorActif = decorActifDepuisPanel();
  if (decorActif) {
    elements.decorPanel.value = decorActif;
  }
  mettreAJourBoutonsDecor();
  synchroniserTousStylesPolices();
  chargementReglages = false;
  synchroniserValeursMarquesDepuisCommun(false);
  mettreAJourDeplacementTextes();
  mettreAJourReglagesTexteMiseEnPage();
}

function synchroniserOptionsMotifSecondaire(valeurPreferee = elements.motifTraitsModernes.value) {
  const motifPrincipal = elements.motifType.value;
  const options = OPTIONS_MOTIFS_SECONDAIRES.filter(([valeur]) => valeur !== motifPrincipal);
  elements.motifTraitsModernes.replaceChildren(...options.map(([valeur, libelle]) => {
    const option = document.createElement("option");
    option.value = valeur;
    option.textContent = traduirePhrase(libelle);
    option.__cleI18n = libelle;
    return option;
  }));
  const valeursDisponibles = options.map(([valeur]) => valeur);
  elements.motifTraitsModernes.value = valeursDisponibles.includes(valeurPreferee)
    ? valeurPreferee
    : valeursDisponibles[0] || "";
}

function clonerReglages(reglages) {
  return reglages ? JSON.parse(JSON.stringify(reglages)) : null;
}

function creerInstantaneReglages() {
  const actif = etiquetteActive === "2" && deuxiemeEtiquetteActive() ? "2" : "1";
  const reglagesActifs = styleActifVerrouille()
    ? reglagesParEtiquette[actif]
    : lireReglagesFormulaire();
  return {
    etiquetteActive: actif,
    modeleChoisi,
    deuxiemeActive: deuxiemeEtiquetteActive(),
    stylesVerrouillesParLigne: { ...stylesVerrouillesParLigne },
    reglagesParLigne: clonerReglages(reglagesParLigne),
    modeleSecondaire: elements.modeleSecondaire.value,
    reglagesParEtiquette: {
      1: clonerReglages(actif === "1" ? reglagesActifs : lireReglages("1")),
      2: clonerReglages(actif === "2" ? reglagesActifs : reglagesParEtiquette[2]),
    },
  };
}

function signatureInstantaneReglages(instantane) {
  return JSON.stringify(instantane);
}

function controleHistorisable(cible) {
  const controle = cible?.closest?.("input, select, textarea");
  if (!controle || controle.disabled || controle.readOnly) {
    return null;
  }
  return elements.formulaire.contains(controle) ? controle : null;
}

function rangeDepuisCible(cible) {
  const controle = cible?.closest?.('input[type="range"]');
  return controle && elements.formulaire.contains(controle) ? controle : null;
}

function brancherInteractionCurseursTactiles() {
  let rangeActif = null;
  let pointeurRangeActif = null;
  let positionPanneauVerrouillee = null;

  const verrouillerPositionPanneau = () => {
    positionPanneauVerrouillee = {
      panneau: elements.formulaire.scrollTop,
      page: window.scrollY,
    };
  };

  const restaurerPositionPanneau = () => {
    if (!positionPanneauVerrouillee) {
      return;
    }
    elements.formulaire.scrollTop = positionPanneauVerrouillee.panneau;
    if (window.scrollY !== positionPanneauVerrouillee.page) {
      window.scrollTo(window.scrollX, positionPanneauVerrouillee.page);
    }
  };

  const protegerPositionApresRendu = () => {
    restaurerPositionPanneau();
    requestAnimationFrame(restaurerPositionPanneau);
  };

  const appliquerValeurDepuisPosition = (range, clientX) => {
    const rect = range.getBoundingClientRect();
    if (!rect.width) {
      return;
    }
    const min = Number(range.min || 0);
    const max = Number(range.max || 100);
    const step = Number(range.step || 1);
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const valeurBrute = min + ratio * (max - min);
    const valeur = Number.isFinite(step) && step > 0
      ? min + Math.round((valeurBrute - min) / step) * step
      : valeurBrute;
    const precision = String(range.step || "").split(".")[1]?.length || 0;
    range.value = String(Number(Math.max(min, Math.min(max, valeur)).toFixed(precision)));
    range.dispatchEvent(new Event("input", { bubbles: true }));
    protegerPositionApresRendu();
  };

  const terminerInteraction = () => {
    if (!rangeActif) {
      return;
    }
    rangeActif.dispatchEvent(new Event("change", { bubbles: true }));
    protegerPositionApresRendu();
    rangeActif = null;
    pointeurRangeActif = null;
    document.body.classList.remove("is-range-dragging");
    requestAnimationFrame(() => {
      restaurerPositionPanneau();
      positionPanneauVerrouillee = null;
    });
  };

  elements.formulaire.addEventListener("pointerdown", (evenement) => {
    const range = rangeDepuisCible(evenement.target);
    if (!range) {
      return;
    }
    verrouillerPositionPanneau();
    if (evenement.pointerType !== "mouse" && evenement.cancelable) {
      evenement.preventDefault();
    }
    rangeActif = range;
    pointeurRangeActif = evenement.pointerId;
    document.body.classList.add("is-range-dragging");
    range.setPointerCapture?.(evenement.pointerId);
    appliquerValeurDepuisPosition(range, evenement.clientX);
  });

  document.addEventListener("pointermove", (evenement) => {
    if (!rangeActif || evenement.pointerId !== pointeurRangeActif) {
      return;
    }
    appliquerValeurDepuisPosition(rangeActif, evenement.clientX);
    if (evenement.cancelable) {
      evenement.preventDefault();
    }
  });
  document.addEventListener("pointerup", terminerInteraction);
  document.addEventListener("pointercancel", terminerInteraction);
  window.addEventListener("blur", terminerInteraction);
}

function memoriserPointDepartControle(evenement) {
  if (chargementReglages || historiqueReglages.restaurationEnCours) {
    return;
  }
  const controle = controleHistorisable(evenement.target);
  if (!controle || historiqueReglages.instantanesControle.has(controle)) {
    return;
  }
  historiqueReglages.instantanesControle.set(controle, creerInstantaneReglages());
}

function pousserHistoriqueReglages(instantane) {
  if (!instantane || historiqueReglages.restaurationEnCours) {
    return;
  }
  const signature = signatureInstantaneReglages(instantane);
  const precedent = historiqueReglages.annulations[historiqueReglages.annulations.length - 1];
  if (precedent && signatureInstantaneReglages(precedent) === signature) {
    return;
  }
  historiqueReglages.annulations.push(instantane);
  historiqueReglages.annulations.splice(0, Math.max(0, historiqueReglages.annulations.length - LIMITE_HISTORIQUE_REGLAGES));
  historiqueReglages.retablissements = [];
  mettreAJourBoutonsHistorique();
}

function enregistrerHistoriqueDepuisControle(cible) {
  const controle = controleHistorisable(cible);
  if (!controle) {
    return;
  }
  const instantane = historiqueReglages.instantanesControle.get(controle);
  if (!instantane) {
    return;
  }
  historiqueReglages.instantanesControle.delete(controle);
  pousserHistoriqueReglages(instantane);
}

function enregistrerHistoriqueAvantAction() {
  if (chargementReglages || historiqueReglages.restaurationEnCours) {
    return;
  }
  pousserHistoriqueReglages(creerInstantaneReglages());
}

function restaurerInstantaneReglages(instantane) {
  historiqueReglages.restaurationEnCours = true;
  reglagesParEtiquette[1] = clonerReglages(instantane.reglagesParEtiquette[1]);
  reglagesParEtiquette[2] = clonerReglages(instantane.deuxiemeActive ? instantane.reglagesParEtiquette[2] : null);
  stylesVerrouillesParLigne = { ...(instantane.stylesVerrouillesParLigne || {}) };
  reglagesParLigne = clonerReglages(instantane.reglagesParLigne) || {};
  etiquetteActive = instantane.etiquetteActive === "2" && instantane.deuxiemeActive ? "2" : "1";
  modeleChoisi = instantane.modeleChoisi;
  elements.modeleSecondaire.value = instantane.modeleSecondaire;
  elements.deuxiemeEtiquette.forEach((radio) => {
    radio.checked = radio.value === (instantane.deuxiemeActive ? "oui" : "non");
  });
  elements.editionEtiquette.forEach((radio) => {
    radio.checked = radio.value === etiquetteActive;
  });
  appliquerReglagesAuFormulaire(lireReglages(etiquetteActive));
  historiqueReglages.restaurationEnCours = false;
  sauvegarderReglagesAutomatiques();
  mettreAJourGalerieModeles();
  mettreAJour();
}

function annulerDerniereModification() {
  const instantane = historiqueReglages.annulations.pop();
  if (!instantane) {
    mettreAJourBoutonsHistorique();
    return;
  }
  historiqueReglages.retablissements.push(creerInstantaneReglages());
  restaurerInstantaneReglages(instantane);
}

function retablirModification() {
  const instantane = historiqueReglages.retablissements.pop();
  if (!instantane) {
    mettreAJourBoutonsHistorique();
    return;
  }
  historiqueReglages.annulations.push(creerInstantaneReglages());
  restaurerInstantaneReglages(instantane);
}

function mettreAJourBoutonsHistorique() {
  elements.annulerReglage.disabled = historiqueReglages.annulations.length === 0;
  const retablirDisponible = historiqueReglages.retablissements.length > 0;
  elements.retablirReglage.disabled = !retablirDisponible;
  elements.retablirReglage.hidden = !retablirDisponible;
  mettreAJourEtatBoutonReset();
}

function mettreAJourEtatBoutonReset(verrouille = styleActifVerrouille()) {
  elements.reinitialiserReglage.disabled = verrouille || styleCourantEstStyleDefaut();
}

const { obtenirFavoris, enregistrerFavoris, signatureReglages } = creerGestionFavoris({
  cleFavoris: CLE_FAVORIS,
  cleFavorisAncienneVersion: CLE_FAVORIS_ANCIENNE_VERSION,
  normaliserReglagesImportes,
});

function basculerFavori() {
  const reglages = lireReglagesFormulaire();
  if (!styleActifVerrouille()) {
    reglagesParEtiquette[etiquetteActive] = reglages;
  }
  const id = signatureReglages(reglages);
  const favoris = obtenirFavoris();
  const dejaPresent = favoris.some((favori) => favori.id === id);

  if (dejaPresent) {
    enregistrerFavoris(favoris.filter((favori) => favori.id !== id));
  } else {
    enregistrerFavoris([{ id, creeLe: new Date().toISOString(), nomPersonnalise: "", reglages }, ...favoris].slice(0, 24));
    envoyerJsonStyle("favorite_added", creerPayloadFavori(reglages));
  }

  afficherFavoris();
}

function afficherFavoris() {
  const favoris = obtenirFavoris();
  const idCourant = signatureReglages(lireReglagesFormulaire());
  const estFavori = favoris.some((favori) => favori.id === idCourant);
  if (!favoris.length) {
    favorisOuverts = false;
  }
  document.body.classList.toggle("is-favoris-ouverts", favorisOuverts);

  elements.aimerReglage.setAttribute("aria-pressed", String(estFavori));
  elements.aimerReglage.querySelector("span:first-child").textContent = estFavori ? "♥" : "♡";
  elements.aimerReglage.setAttribute(
    "aria-label",
    estFavori ? traduirePhrase("Retirer des favoris") : traduirePhrase("Ajouter aux favoris"),
  );
  elements.aimerReglage.title = estFavori ? traduirePhrase("Retirer des favoris") : traduirePhrase("Ajouter aux favoris");
  elements.ouvrirFavoris.hidden = favoris.length === 0;
  elements.ouvrirFavoris.setAttribute("aria-expanded", String(favorisOuverts));
  elements.ouvrirFavoris.textContent = traduirePhrase("Favoris");

  if (favorisOuverts) {
    remplirListeFavoris(favoris);
    return;
  }

  elements.listeFavoris.hidden = true;
  elements.listeFavoris.innerHTML = "";
}

function ouvrirListeFavoris() {
  favorisOuverts = !favorisOuverts;
  afficherFavoris();
}

function remplirListeFavoris(favoris = obtenirFavoris()) {
  elements.listeFavoris.innerHTML = "";

  const entete = document.createElement("div");
  entete.className = "favoris__entete";

  const titre = document.createElement("strong");
  titre.className = "favoris__titre";
  titre.textContent = traduirePhrase("Mes favoris");

  const fermer = document.createElement("button");
  fermer.className = "bouton bouton-secondaire";
  fermer.type = "button";
  fermer.textContent = traduirePhrase("Fermer");

  entete.append(titre, fermer);
  elements.listeFavoris.append(entete);

  if (!favoris.length) {
    const messageVide = document.createElement("p");
    messageVide.className = "favoris__vide";
    messageVide.textContent = traduirePhrase("Vous n'avez enregistré aucun favori.");
    elements.listeFavoris.append(messageVide);
    elements.listeFavoris.hidden = false;
    fermer.addEventListener("click", () => {
      favorisOuverts = false;
      afficherFavoris();
    });
    return;
  }

  let favorisAffiches = 0;
  favoris.forEach((favori) => {
    try {
      elements.listeFavoris.append(creerCarteFavori(favori));
      favorisAffiches += 1;
    } catch {
      // Un favori invalide ne doit pas empêcher l'affichage de la liste.
    }
  });

  if (!favorisAffiches) {
    const messageVide = document.createElement("p");
    messageVide.className = "favoris__vide";
    messageVide.textContent = traduirePhrase("Vous n'avez enregistré aucun favori.");
    elements.listeFavoris.append(messageVide);
  }

  elements.listeFavoris.hidden = false;
  fermer.addEventListener("click", () => {
    favorisOuverts = false;
    afficherFavoris();
  });
}

function creerCarteFavori(favori) {
  const carte = document.createElement("article");
  carte.className = "favori";

  const texte = document.createElement("div");
  texte.className = "favori__texte";

  const nom = document.createElement("strong");
  nom.className = "favori__nom";
  nom.textContent = nomFavori(favori);

  const details = document.createElement("span");
  details.className = "favori__details";
  details.textContent = detailsFavori(favori.reglages);

  const actions = document.createElement("div");
  actions.className = "favori__actions";

  const appliquer = document.createElement("button");
  appliquer.className = "bouton";
  appliquer.type = "button";
  appliquer.textContent = traduirePhrase("Recharger");
  appliquer.dataset.action = "appliquer";
  appliquer.dataset.id = favori.id;
  appliquer.setAttribute("aria-label", `${traduirePhrase("Appliquer")} ${nom.textContent}`);

  const renommer = document.createElement("button");
  renommer.className = "bouton";
  renommer.type = "button";
  renommer.textContent = traduirePhrase("Renommer");
  renommer.dataset.action = "renommer";
  renommer.dataset.id = favori.id;
  renommer.setAttribute("aria-label", `${traduirePhrase("Renommer")} ${nom.textContent}`);

  const supprimer = document.createElement("button");
  supprimer.className = "bouton bouton-secondaire";
  supprimer.type = "button";
  supprimer.textContent = traduirePhrase("Supprimer");
  supprimer.dataset.action = "supprimer";
  supprimer.dataset.id = favori.id;
  supprimer.setAttribute("aria-label", `${traduirePhrase("Supprimer")} ${nom.textContent}`);

  texte.append(nom, details);
  actions.append(appliquer, renommer, supprimer);
  carte.append(texte, actions);
  return carte;
}

function nomFavori(favori) {
  const reglages = favori.reglages;
  const themeModele = presets[reglages.modele]?.theme || reglages.theme;
  const theme = themesModeles[themeModele] || themeModele;
  const modele = modelesParTheme.tout.find(([valeur]) => valeur === reglages.modele)?.[1] || reglages.modele;
  const nomPersonnalise = String(favori.nomPersonnalise || "").trim();
  return nomPersonnalise ? `${theme} – ${modele} – ${nomPersonnalise}` : `${theme} – ${modele}`;
}

function detailsFavori(reglages) {
  return `${reglages.largeurEtiquette} x ${reglages.hauteurEtiquette} mm · ${traduirePhrase("titres")} ${reglages.tailleTitres}% · ${traduirePhrase("artiste")} ${reglages.tailleArtiste}%`;
}

function gererActionFavori(evenement) {
  const bouton = evenement.target.closest("[data-action]");
  if (!bouton) {
    return;
  }

  const favoris = obtenirFavoris();
  const favori = favoris.find((item) => item.id === bouton.dataset.id);
  if (!favori) {
    afficherFavoris();
    return;
  }

  if (bouton.dataset.action === "appliquer") {
    enregistrerHistoriqueAvantAction();
    appliquerReglagesAuFormulaire(favori.reglages);
    enregistrerReglagesActifs();
    mettreAJour();
    return;
  }

  if (bouton.dataset.action === "renommer") {
    const nomActuel = favori.nomPersonnalise || "";
    const nouveauNom = window.prompt(traduirePhrase("Nom du favori"), nomActuel);
    if (nouveauNom === null) {
      return;
    }
    const nomPersonnalise = nouveauNom.trim().slice(0, 80);
    enregistrerFavoris(favoris.map((item) => (
      item.id === favori.id ? { ...item, nomPersonnalise } : item
    )));
    afficherFavoris();
    return;
  }

  if (bouton.dataset.action === "supprimer") {
    enregistrerFavoris(favoris.filter((item) => item.id !== favori.id));
    afficherFavoris();
  }
}

function lireReglagesFormulaire() {
  const styleTitres = normaliserStylePolice(elements.policeTitres.value, elements.styleTitres.value);
  const styleArtiste = normaliserStylePolice(elements.policeArtiste.value, elements.styleArtiste.value);
  const motifActif = elements.activerMotif.checked;
  const vignettageActif = elements.activerVignettage.checked;
  const intensitePatine = Number(elements.intensitePatine.value);
  const patineActive = elements.activerPatine.checked && intensitePatine > 0;
  const panelDecor = elements.decorPanel.value || "motif";
  return {
    theme: presets[elements.modele.value]?.theme || "tout",
    modele: elements.modele.value,
    couleur1: elements.couleur1.value,
    couleur2: elements.couleur2.value,
    couleur3: elements.couleur3.value,
    couleurRuban: elements.couleurRuban.value,
    couleurVignette: elements.couleurVignette.value,
    couleurFondModerne: elements.couleurFondModerne.value,
    couleurBandeGauche: elements.couleurBandeGauche.value,
    couleurBandeDroite: elements.couleurBandeDroite.value,
    couleurTitreFaceA: elements.couleurTitreFaceA.value,
    couleurTitreFaceB: elements.couleurTitreFaceB.value,
    couleurArtiste: elements.couleurArtiste.value,
    couleurTitreFaceAManuelle: elements.couleurTitreFaceA.dataset.modifieeManuellement === "true",
    couleurTitreFaceBManuelle: elements.couleurTitreFaceB.dataset.modifieeManuellement === "true",
    couleurArtisteManuelle: elements.couleurArtiste.dataset.modifieeManuellement === "true",
    decorPanel: (
      (panelDecor === "vignette" && vignettageActif)
        || (panelDecor === "motif" && motifActif)
        || (panelDecor === "patine" && patineActive)
    ) ? panelDecor : (motifActif ? "motif" : (vignettageActif ? "vignette" : (patineActive ? "patine" : panelDecor))),
    activerPatine: patineActive,
    intensitePatine,
    angle: Number(elements.angle.value),
    intensite: Number(elements.intensite.value),
    motifType: motifActif ? elements.motifType.value : "aucun",
    couleurMotif: elements.couleurMotif.value,
    motif: Number(elements.motif.value),
    angleMotif: Number(elements.angleMotif.value),
    motifFond: elements.motifFond.checked,
    motifRuban: elements.motifRuban.checked,
    motifRubanType: elements.motifRuban.checked ? elements.motifRubanType.value : "aucun",
    couleurMotifRuban: elements.couleurMotifRuban.value,
    opaciteMotifRuban: Number(elements.opaciteMotifRuban.value),
    angleMotifRuban: Number(elements.angleMotifRuban.value),
    afficherTraitsModernes: elements.afficherTraitsModernes.checked,
    motifTraitsModernes: elements.motifTraitsModernes.value,
    motifSecondaireFond: elements.motifSecondaireFond.checked,
    motifSecondaireRuban: elements.motifSecondaireRuban.checked,
    couleurTraitsModernes: elements.couleurTraitsModernes.value,
    opaciteTraitsModernes: Number(elements.opaciteTraitsModernes.value),
    angleTraitsModernes: Number(elements.angleTraitsModernes.value),
    modeVignette: vignettageActif ? elements.modeVignette.value : "aucun",
    vignette: Number(elements.vignette.value),
    bordure: Math.max(EPAISSEUR_BORDURE_MIN, Math.min(100, Number(elements.bordure.value) || 0)),
    bordureHorizontale: elements.bordureHorizontale.checked,
    bordureVerticale: elements.modele.value === "JEAN" ? false : elements.bordureVerticale.checked,
    arrondiInterieurBordure: elements.arrondiInterieurBordure.checked,
    largeurRuban: Number(elements.largeurRuban.value),
    hauteurRuban: Number(elements.hauteurRuban.value),
    afficherEtoiles: elements.afficherEtoiles.checked,
    nombreEtoiles: Number(elements.nombreEtoiles.value),
    dispositionEtoiles: elements.dispositionEtoiles.value,
    courbureEtoiles: Number(elements.courbureEtoiles.value),
    positionHorizontaleEtoiles: Number(elements.positionHorizontaleEtoiles.value),
    positionVerticaleEtoiles: Number(elements.positionVerticaleEtoiles.value),
    etendueEtoiles: Number(elements.etendueEtoiles.value),
    tailleEtoiles: Number(elements.tailleEtoiles.value),
    couleurFondEtoiles: elements.couleurFondEtoiles.value,
    hauteurBande: Number(elements.hauteurBande.value),
    epaisseurTraitsLEON: Number(elements.epaisseurTraitsLEON.value),
    positionTraitsLEON: Number(elements.positionTraitsLEON.value),
    ecartTraitsLEON: Number(elements.ecartTraitsLEON.value),
    tailleTrianglesJEAN: convertirCurseurEnTailleTriangles(elements.tailleTrianglesJEAN.value),
    tailleBandeGauche: Number(elements.tailleBandeGauche.value),
    angleBandeGauche: Number(elements.angleBandeGauche.value),
    tailleBandeDroite: Number(elements.tailleBandeDroite.value),
    angleBandeDroite: Number(elements.angleBandeDroite.value),
    policeTitres: elements.policeTitres.value,
    policeArtiste: elements.policeArtiste.value,
    tailleTitres: Number(elements.tailleTitres.value),
    tailleArtiste: Number(elements.tailleArtiste.value),
    styleTitres,
    styleArtiste,
    guillemetsTitres: elements.guillemetsTitres.checked,
    retourLigneTitres: elements.retourLigneTitres.checked,
    decalageRetro: elements.decalageRetro.value,
    irregulariteCaracteres: elements.irregulariteCaracteres.checked,
    deplacementTextesManuel: elements.deplacementTextesManuel.checked,
    decalageTitreAX: Number(elements.decalageTitreAX.value),
    decalageTitreAY: Number(elements.decalageTitreAY.value),
    decalageArtisteX: Number(elements.decalageArtisteX.value),
    decalageArtisteY: Number(elements.decalageArtisteY.value),
    decalageTitreBX: Number(elements.decalageTitreBX.value),
    decalageTitreBY: Number(elements.decalageTitreBY.value),
    afficherMarques: capacitesModeles[elements.modele.value]?.marques === true
      && elements.afficherMarques.checked,
    couleurMarques: elements.couleurMarques.value,
    couleurMarquesManuelle: elements.couleurMarques.dataset.modifieeManuellement === "true",
    formePastille: elements.formePastille.value,
    diametrePastille: Number(elements.diametrePastille.value),
    presetMarques: elements.presetMarques.value,
    synchroniserMarques: elements.synchroniserMarques.checked,
    marqueGauche: elements.marqueGauche.value.trim(),
    marqueDroite: elements.marqueDroite.value.trim(),
    policeMarques: elements.policeMarques.value,
    marquesVerticales: elements.marquesVerticales.checked,
    marqueGaucheTexte: elements.marqueGaucheTexte.value.trim(),
    marqueDroiteTexte: elements.marqueDroiteTexte.value.trim(),
    couleurMarqueGauche: elements.couleurMarqueGauche.value,
    couleurMarqueDroite: elements.couleurMarqueDroite.value,
    formePastilleGauche: elements.formePastilleGauche.value,
    formePastilleDroite: elements.formePastilleDroite.value,
    policeMarqueGauche: elements.policeMarqueGauche.value,
    policeMarqueDroite: elements.policeMarqueDroite.value,
    styleMarqueGauche: normaliserStylePolice(elements.policeMarqueGauche.value, elements.styleMarqueGauche.value),
    styleMarqueDroite: normaliserStylePolice(elements.policeMarqueDroite.value, elements.styleMarqueDroite.value),
    tailleMarqueGauche: Number(elements.tailleMarqueGauche.value),
    tailleMarqueDroite: Number(elements.tailleMarqueDroite.value),
    diametrePastilleGauche: Number(elements.diametrePastilleGauche.value),
    diametrePastilleDroite: Number(elements.diametrePastilleDroite.value),
    angleMarqueGauche: Number(elements.angleMarqueGauche.value),
    angleMarqueDroite: Number(elements.angleMarqueDroite.value),
    positionMarqueGauche: Number(elements.positionMarqueGauche.value),
    positionMarqueDroite: Number(elements.positionMarqueDroite.value),
    hauteurMarqueGauche: Number(elements.hauteurMarqueGauche.value),
    hauteurMarqueDroite: Number(elements.hauteurMarqueDroite.value),
    positionMarques: Number(elements.positionMarques.value),
    hauteurMarques: Number(elements.hauteurMarques.value),
    angleMarques: Number(elements.angleMarques.value),
    tailleMarques: Number(elements.tailleMarques.value),
    limiterMarquesBandeSurprise: elements.limiterMarquesBandeSurprise.checked,
    largeurEtiquette: lireDimensionEtiquette(elements.largeurEtiquette, "largeurEtiquette"),
    hauteurEtiquette: lireDimensionEtiquette(elements.hauteurEtiquette, "hauteurEtiquette"),
  };
}

function marquerCouleurTexteManuelle(champ) {
  if (
    champ === elements.couleurTitreFaceA
    || champ === elements.couleurTitreFaceB
    || champ === elements.couleurArtiste
    || champ === elements.couleurMarques
  ) {
    champ.dataset.modifieeManuellement = "true";
  }
}

function appliquerReglagesMarquesALActivation(champ) {
  if (champ !== elements.afficherMarques || !elements.afficherMarques.checked) {
    return;
  }
  elements.synchroniserMarques.checked = true;
  elements.presetMarques.value = "45-rpm";
  elements.marqueGauche.value = "45";
  elements.marqueDroite.value = "RPM";
  elements.policeMarques.value = "compacte";
  elements.tailleMarques.value = "175";
  elements.marquesVerticales.checked = elements.modele.value === "JEAN";
  elements.angleMarques.value = "-90";
  elements.positionMarques.value = "3";
  elements.hauteurMarques.value = "50";
  elements.couleurMarques.dataset.modifieeManuellement = "false";
  actualiserCouleurMarquesAutomatiqueDepuisFormulaire();
  synchroniserValeursMarquesDepuisCommun();
}

function actualiserCouleurMarquesAutomatiqueDepuisFormulaire() {
  if (elements.couleurMarques.dataset.modifieeManuellement === "true") {
    return;
  }
  const couleur = couleurMarquesAutomatique({
    modele: elements.modele.value,
    couleur1: elements.couleur1.value,
    couleur2: elements.couleur2.value,
    couleur3: elements.couleur3.value,
    couleurFondModerne: elements.couleurFondModerne.value,
  });
  elements.couleurMarques.value = couleur;
  elements.couleurMarqueGauche.value = couleur;
  elements.couleurMarqueDroite.value = couleur;
}

function couleurMarquesAutomatique(reglages) {
  const fonds = reglages.modele === "CELESTE"
    ? [reglages.couleurFondModerne]
    : [reglages.couleur2, reglages.couleur3];
  const contrasteMinimum = (couleur) => fonds.reduce(
    (minimum, fond) => Math.min(minimum, ratioContrasteTeinte(fond, couleur)),
    Infinity,
  );
  if (/^#[0-9a-f]{6}$/i.test(String(reglages.couleur1)) && contrasteMinimum(reglages.couleur1) >= 3) {
    return reglages.couleur1;
  }
  const candidats = ["#16120d", "#fffdf8"]
    .filter((couleur) => /^#[0-9a-f]{6}$/i.test(String(couleur)));
  return candidats.reduce((meilleure, couleur) => {
    const contraste = contrasteMinimum(couleur);
    return contraste > meilleure.contraste ? { couleur, contraste } : meilleure;
  }, { couleur: "#16120d", contraste: -Infinity }).couleur;
}

function lireDimensionEtiquette(element, cle) {
  const limites = LIMITES_DIMENSIONS[cle];
  const valeur = Number(String(element?.value || "").replace(",", "."));
  if (!Number.isFinite(valeur)) {
    return limites.defaut;
  }

  return Number(Math.max(limites.min, Math.min(limites.max, valeur)).toFixed(1));
}

function lireReglages(numero = etiquetteActive, ligne = null) {
  const ligneCible = ligne || (modeleChoisi ? obtenirLigneApercu(obtenirLignes(), numero) : null);
  const cleLigne = ligneCible ? String(ligneCible.index) : null;
  if (cleLigne !== null && stylesVerrouillesParLigne[cleLigne] && reglagesParLigne[cleLigne]) {
    return reglagesParLigne[cleLigne];
  }
  if (numero === "2") {
    return reglagesParEtiquette[2] || creerReglagesSecondaires();
  }

  return reglagesParEtiquette[1] || lireReglagesFormulaire();
}

function enregistrerReglagesActifs() {
  const reglages = lireReglagesFormulaire();
  if (styleActifVerrouille()) {
    enregistrerDimensionsEtiquettesVerrouillees(reglages);
    return;
  }
  if (modeModificationEtiquettes === "toutes") {
    if (deuxiemeEtiquetteActive()) {
      reglagesParEtiquette[etiquetteActive] = clonerReglages(reglages);
    } else if (etiquetteActive === "1") {
      reglagesParEtiquette[1] = clonerReglages(reglages);
    }
  } else {
    reglagesParEtiquette[etiquetteActive] = reglages;
  }
  sauvegarderReglagesAutomatiques();
}

function verrouillerEtiquetteActiveAutomatiquement() {
  if (modeModificationEtiquettes !== "individuel" || styleActifVerrouille()) {
    return;
  }
  const cle = obtenirCleLigneApercu();
  if (cle === null) {
    return;
  }
  const reglages = lireReglagesFormulaire();
  reglagesParEtiquette[etiquetteActive] = reglages;
  stylesVerrouillesParLigne[cle] = true;
  reglagesParLigne[cle] = clonerReglages(reglages);
  sauvegarderReglagesAutomatiques();
}

function enregistrerDimensionsEtiquettesVerrouillees(reglages) {
  const dimensions = {
    largeurEtiquette: reglages.largeurEtiquette,
    hauteurEtiquette: reglages.hauteurEtiquette,
  };
  ["1", "2"].forEach((numero) => {
    if (reglagesParEtiquette[numero]) {
      Object.assign(reglagesParEtiquette[numero], dimensions);
    }
  });
  Object.values(reglagesParLigne).forEach((reglagesLigne) => {
    if (reglagesLigne) {
      Object.assign(reglagesLigne, dimensions);
    }
  });
  sauvegarderReglagesAutomatiques();
}

function obtenirEditionActive() {
  return [...elements.editionEtiquette].find((radio) => radio.checked)?.value || "1";
}

function changerEtiquetteActive() {
  enregistrerReglagesActifs();
  verrouillerEtiquetteActiveAutomatiquement();
  etiquetteActive = obtenirEditionActive();
  appliquerReglagesAuFormulaire(lireReglages(etiquetteActive));
  mettreAJour();
}

function selectionnerEtiquetteDepuisApercu(numero, { ouvrirEditeur = true } = {}) {
  if (ignorerProchainClicApercu) {
    ignorerProchainClicApercu = false;
    return;
  }
  if (numero === "2" && !deuxiemeEtiquetteActive()) {
    return;
  }
  if (numero === etiquetteActive) {
    if (ouvrirEditeur) {
      ouvrirEditionTexteDepuisApercu();
    }
    return;
  }
  enregistrerReglagesActifs();
  verrouillerEtiquetteActiveAutomatiquement();
  etiquetteActive = numero;
  elements.editionEtiquette.forEach((radio) => {
    radio.checked = radio.value === numero;
  });
  appliquerReglagesAuFormulaire(lireReglages(numero));
  mettreAJour();
  if (ouvrirEditeur) {
    ouvrirEditionTexteDepuisApercu();
  }
}

function changerModeleSecondaire() {
  enregistrerReglagesActifs();
  if (!deuxiemeEtiquetteActive()) {
    reglagesParEtiquette[2] = null;
    etiquetteActive = "1";
    elements.editionEtiquette.forEach((radio) => {
      radio.checked = radio.value === "1";
    });
    appliquerReglagesAuFormulaire(lireReglages("1"));
    mettreAJourGalerieModeles();
    mettreAJour();
    sauvegarderReglagesAutomatiques();
    return;
  }

  if (etiquetteActive === "2" && styleActifVerrouille()) {
    appliquerReglagesAuFormulaire(lireReglages("2"));
    mettreAJour();
    return;
  }
  afficherApercuApresChoixModele();
  reglagesParEtiquette[2] = creerReglagesSecondaires();
  etiquetteActive = "2";
  elements.editionEtiquette.forEach((radio) => {
    radio.checked = radio.value === "2";
  });
  appliquerReglagesAuFormulaire(lireReglages("2"));
  mettreAJourGalerieModeles();
  mettreAJour();
  sauvegarderReglagesAutomatiques();
}

function changerActivationDeuxiemeEtiquette() {
  enregistrerReglagesActifs();
  if (!deuxiemeEtiquetteActive()) {
    changerModeleSecondaire();
    return;
  }

  afficherApercuApresChoixModele();
  const reglagesPrincipaux = lireReglages("1");
  elements.modeleSecondaire.value = reglagesPrincipaux.modele;
  reglagesParEtiquette[2] = appliquerBordureVisibleAleatoire(
    creerVarianteCouleur(reglagesPrincipaux),
  );
  etiquetteActive = "2";
  elements.editionEtiquette.forEach((radio) => {
    radio.checked = radio.value === "2";
  });
  appliquerReglagesAuFormulaire(lireReglages("2"));
  mettreAJourGalerieModeles();
  mettreAJour();
  sauvegarderReglagesAutomatiques();
}

function afficherApercuApresChoixModele() {
  modeleChoisi = true;
  masquerOptionRestauration();
  document.body.classList.remove("is-accueil-selection");
  window.scrollTo({ top: 0, left: 0 });
  elements.formulaire?.scrollTo?.({ top: 0, left: 0 });
  ajusterHauteurPanneauOptionsMobile();
}

function creerReglagesSecondaires() {
  const modele = elements.modeleSecondaire.value || elements.modele.value;
  return obtenirReglagesDefautModele(modele) || lireReglages("1");
}

function choisirAleatoire(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

function nombreAleatoire(minimum, maximum, pas = 1) {
  const crans = Math.floor((maximum - minimum) / pas);
  return minimum + Math.floor(Math.random() * (crans + 1)) * pas;
}

function creerMarquesSurprise(combo, reglagesBase) {
  const modele = reglagesBase.modele;
  if (modele === "STELLA" || modele === "JUJU" || modele === "MARTIN" || combo.marques === "aucun") {
    return {
      afficherMarques: false,
      presetMarques: "custom",
      marqueGauche: "",
      marqueDroite: "",
      marqueGaucheTexte: "",
      marqueDroiteTexte: "",
    };
  }

  const preset = combo.marques !== "aucun" && Math.random() > 0.18 ? combo.marques : choisirAleatoire([
    "juke-box",
    "vinyl-hit",
    "45-rpm",
    "hit-tune",
    "old-hit",
    "top-side",
    "a-side",
    "b-side",
    "stereo-sound",
    "vintage-label",
    "music-select",
    "45-o-juke",
    "juke-time",
    "vinyl-side",
    "retro-hit",
    "hit-parade",
    "oldies-club",
    "dance-tune",
    "music-box",
    "select-play",
    "side-one",
    "side-two",
    "top-vinyl",
    "golden-hit",
    "45-record",
    "play-music",
    "jukebox-sound",
    "retro-label",
    "tune-select",
    "sound-track",
    "hit-record",
    "vinyl-select",
  ]);
  const textes = presetsMarques[preset] || ["HIT", "OLDY"];
  return {
    afficherMarques: Math.random() > 0.16,
    presetMarques: preset,
    marqueGauche: textes[0],
    marqueDroite: textes[1],
    marqueGaucheTexte: textes[0],
    marqueDroiteTexte: textes[1],
  };
}

function choisirDecalageRetroSurprise(base, variantes) {
  return base.decalageRetro && base.decalageRetro !== "aucun"
    ? choisirAleatoire(variantes)
    : "aucun";
}

function creerSurpriseLeon(base) {
  const palettesAnciennes = [
    { cadre: "#2a241c", haut: "#efe5c7", artiste: "#e4d1a4", bas: "#dcc99d", titre: "#181410", artisteTexte: "#19130d", motif: "#7a6241", vignette: "#7b5830" },
    { cadre: "#3a2a1d", haut: "#f3ead1", artiste: "#d8c090", bas: "#e5d4aa", titre: "#24180f", artisteTexte: "#2f2117", motif: "#8b6c42", vignette: "#6d4a25" },
    { cadre: "#263027", haut: "#e9e2c7", artiste: "#cfd5b0", bas: "#d8cfad", titre: "#151913", artisteTexte: "#1b2019", motif: "#59664e", vignette: "#4a563d" },
    { cadre: "#302b27", haut: "#e8dcc1", artiste: "#d5c2a0", bas: "#cbb795", titre: "#1d1915", artisteTexte: "#221b15", motif: "#6f5a45", vignette: "#5a4632" },
    { cadre: "#452a24", haut: "#f1dfbc", artiste: "#e5c69a", bas: "#d7b98b", titre: "#23110e", artisteTexte: "#311813", motif: "#8b5140", vignette: "#6f352a" },
    { cadre: "#1f2a2a", haut: "#e6dfc7", artiste: "#c3b98f", bas: "#d3c6a4", titre: "#101616", artisteTexte: "#182121", motif: "#3f5751", vignette: "#2e4a43" },
    { cadre: "#242b3a", haut: "#e8e3d2", artiste: "#c4c9d4", bas: "#d2d5dd", titre: "#121622", artisteTexte: "#1b2030", motif: "#4d5a73", vignette: "#35445f" },
    { cadre: "#3b2428", haut: "#efe0cb", artiste: "#d2b3a7", bas: "#ddc3b4", titre: "#211114", artisteTexte: "#30181c", motif: "#7d4b4c", vignette: "#65343b" },
    { cadre: "#212321", haut: "#eee8d8", artiste: "#c9c1ad", bas: "#d8d0bd", titre: "#141512", artisteTexte: "#202019", motif: "#555145", vignette: "#403c32" },
    { cadre: "#322a3a", haut: "#ece2d0", artiste: "#c9b7c9", bas: "#d8c7ce", titre: "#1b1421", artisteTexte: "#281d31", motif: "#65516b", vignette: "#4e3b58" },
    { cadre: "#253326", haut: "#ede4c9", artiste: "#c6c08f", bas: "#d7cca2", titre: "#131a13", artisteTexte: "#1b241a", motif: "#52633e", vignette: "#3f542d" },
    { cadre: "#3a2d22", haut: "#f0e1c8", artiste: "#d0b18c", bas: "#dfc29b", titre: "#21170e", artisteTexte: "#2d1f14", motif: "#7a5937", vignette: "#5f4327" },
    { cadre: "#1e2d33", haut: "#e4dfcc", artiste: "#b9c4c2", bas: "#ccd2cc", titre: "#10191d", artisteTexte: "#17242a", motif: "#3f6167", vignette: "#2f5058" },
    { cadre: "#33251f", haut: "#eadcc8", artiste: "#c7aa91", bas: "#d4bcaa", titre: "#1d120e", artisteTexte: "#2a1a13", motif: "#715245", vignette: "#563a31" },
    { cadre: "#2b2920", haut: "#f0e8c9", artiste: "#d2c27d", bas: "#ded29d", titre: "#17160f", artisteTexte: "#24210f", motif: "#686028", vignette: "#514b21" },
    { cadre: "#252733", haut: "#e9e1d1", artiste: "#bdb8a8", bas: "#d1c9bd", titre: "#141620", artisteTexte: "#202230", motif: "#545766", vignette: "#3b3e4c" },
  ];
  const palette = choisirAleatoire(palettesAnciennes);
  const motifType = choisirAleatoire(["aucun", "grille", "rayures", "diagonales"]);
  return {
    ...base,
    couleur1: palette.cadre,
    couleur2: palette.haut,
    couleur3: palette.bas,
    couleurRuban: palette.artiste,
    couleurVignette: palette.vignette,
    couleurMotif: palette.motif,
    couleurTraitsModernes: palette.motif,
    couleurTitreFaceA: couleurLisible(palette.haut, palette.titre),
    couleurTitreFaceB: couleurLisible(palette.bas, palette.titre),
    couleurTitreFaceAManuelle: false,
    couleurTitreFaceBManuelle: false,
    couleurArtiste: palette.artisteTexte,
    decorPanel: "vignette",
    motifType,
    motif: motifType === "aucun" ? 0 : nombreAleatoire(6, 22, 1),
    angleMotif: nombreAleatoire(-10, 10, 1),
    afficherTraitsModernes: Math.random() > 0.78,
    motifTraitsModernes: choisirAleatoire(["grille", "rayures", "points"]),
    opaciteTraitsModernes: nombreAleatoire(4, 14, 1),
    angleTraitsModernes: nombreAleatoire(-8, 8, 1),
    modeVignette: choisirAleatoire(["fond", "global"]),
    vignette: nombreAleatoire(22, 46, 1),
    intensite: nombreAleatoire(28, 58, 1),
    angle: choisirAleatoire([0, 45, 90, 135, 180]),
    bordure: nombreAleatoire(42, 88, 2),
    arrondiInterieurBordure: Math.random() > 0.58,
    epaisseurTraitsLEON: nombreAleatoire(1.5, 5.5, 0.5),
    positionTraitsLEON: nombreAleatoire(45, 55, 1),
    ecartTraitsLEON: nombreAleatoire(18, 34, 1),
    tailleTitres: nombreAleatoire(82, 112, 2),
    tailleArtiste: nombreAleatoire(82, 110, 2),
    styleTitres: Math.random() > 0.35 ? "gras" : "normal",
    styleArtiste: "gras",
    guillemetsTitres: Math.random() > 0.18,
    decalageRetro: choisirDecalageRetroSurprise(base, ["titres-leger", "titre-face-a", "titre-face-b", "artiste-leger", "tout-leger", "artiste-bas"]),
    policeTitres: choisirAleatoire(["dactylo-seche", "dactylo-ronde", "journal-ancien", "terminal-carre"]),
    policeArtiste: choisirAleatoire(["mono-moderne", "compacte", "dactylo-seche", "terminal-carre"]),
    afficherMarques: false,
  };
}

function creerSurpriseManu(base) {
  const palettesSimples = [
    { cadre: "#d50000", fond: "#ffffff", ruban: "#ffffff", pastille: "#082a8c", titre: "#111111", artiste: "#d50000", motif: "#d50000" },
    { cadre: "#111827", fond: "#ffffff", ruban: "#ffffff", pastille: "#dc2626", titre: "#111827", artiste: "#dc2626", motif: "#111827" },
    { cadre: "#0f766e", fond: "#ffffff", ruban: "#ffffff", pastille: "#f59e0b", titre: "#111827", artiste: "#0f766e", motif: "#0f766e" },
    { cadre: "#7c2d12", fond: "#fffdf8", ruban: "#ffffff", pastille: "#2563eb", titre: "#1f2937", artiste: "#7c2d12", motif: "#7c2d12" },
    { cadre: "#be185d", fond: "#ffffff", ruban: "#fff7fb", pastille: "#111827", titre: "#111827", artiste: "#be185d", motif: "#be185d" },
    { cadre: "#1d4ed8", fond: "#ffffff", ruban: "#ffffff", pastille: "#15803d", titre: "#111827", artiste: "#1d4ed8", motif: "#1d4ed8" },
  ];
  const palettesPop = [
    { cadre: "#ff2f7d", haut: "#201a4d", bas: "#fff1a8", ruban: "#2dd4bf", pastille: "#11100c", titre: "#fff8e8", artiste: "#201a4d", motif: "#ff2f7d" },
    { cadre: "#004e89", haut: "#fdf0d5", bas: "#7bdff2", ruban: "#ffffff", pastille: "#c1121f", titre: "#111827", artiste: "#004e89", motif: "#004e89" },
    { cadre: "#0f5132", haut: "#fffbe6", bas: "#b7f7d4", ruban: "#ffffff", pastille: "#d4a017", titre: "#172016", artiste: "#0f5132", motif: "#0f5132" },
    { cadre: "#6d28d9", haut: "#e0f2fe", bas: "#fef08a", ruban: "#ffffff", pastille: "#f472b6", titre: "#231033", artiste: "#6d28d9", motif: "#6d28d9" },
    { cadre: "#121212", haut: "#f8c8dc", bas: "#b8f2e6", ruban: "#ffffff", pastille: "#f15bb5", titre: "#101010", artiste: "#101010", motif: "#121212" },
    { cadre: "#d71920", haut: "#fff6df", bas: "#f4c430", ruban: "#ffffff", pastille: "#0f1115", titre: "#17120b", artiste: "#d71920", motif: "#d71920" },
  ];
  const paletteSobre = Math.random() < 0.48;
  const palette = choisirAleatoire(paletteSobre ? palettesSimples : palettesPop);
  const profilsMiseEnPage = [
    {
      nom: "filet",
      bordure: [30, 42],
      largeurRuban: [64, 69],
      hauteurRuban: [28, 31],
      hauteurBande: [12, 16],
      diametre: paletteSobre ? [24, 29] : [26, 31],
      position: [8, 9],
      hauteurMarques: [50, 50],
      angle: [-25, -15, -10, 10, 15, 25],
    },
    {
      nom: "classique",
      bordure: [42, 58],
      largeurRuban: [58, 66],
      hauteurRuban: [24, 30],
      hauteurBande: [20, 30],
      diametre: paletteSobre ? [24, 31] : [26, 34],
      position: [8, 10],
      hauteurMarques: [49, 51],
      angle: [-12, -6, 0, 6, 12],
    },
    {
      nom: "bande-large",
      bordure: [50, 76],
      largeurRuban: [50, 62],
      hauteurRuban: [23, 29],
      hauteurBande: [34, 46],
      diametre: paletteSobre ? [25, 32] : [28, 36],
      position: [7, 10],
      hauteurMarques: [48, 52],
      angle: [-8, -4, 0, 4, 8],
    },
    {
      nom: "compact",
      bordure: [26, 42],
      largeurRuban: [56, 68],
      hauteurRuban: [20, 26],
      hauteurBande: [16, 24],
      diametre: [20, 27],
      position: [7, 9],
      hauteurMarques: [50, 50],
      angle: [-18, -10, 0, 10, 18],
    },
  ];
  const profil = choisirAleatoire(profilsMiseEnPage);
  const preset = choisirAleatoire(["45-o-juke", "stereo-sound", "juke-box", "vinyl-hit", "hit-tune", "music-box", "retro-hit", "golden-hit"]);
  const [marqueGauche, marqueDroite] = presetsMarques[preset] || ["45’O", "JUKE"];
  const fondHaut = paletteSobre ? palette.fond : palette.haut;
  const fondBas = paletteSobre ? palette.fond : palette.bas;
  const motifType = paletteSobre
    ? choisirAleatoire(["aucun", "aucun", "diagonales", "rayures"])
    : choisirAleatoire(["diagonales", "rayures", "points", "grille"]);
  const formePastille = choisirAleatoire(["rond", "rond", "carre", "losange"]);
  const diametrePastille = nombreAleatoire(profil.diametre[0], profil.diametre[1], 1);
  const hauteurBande = nombreAleatoire(profil.hauteurBande[0], profil.hauteurBande[1], 1);
  const angleMarques = choisirAleatoire(profil.angle);
  const positionMarques = nombreAleatoire(profil.position[0], profil.position[1], 1);
  const hauteurMarques = nombreAleatoire(profil.hauteurMarques[0], profil.hauteurMarques[1], 1);

  return {
    ...base,
    theme: "classique",
    modele: "MANU",
    couleur1: palette.cadre,
    couleur2: fondHaut,
    couleur3: fondBas,
    couleurRuban: palette.ruban,
    couleurVignette: palette.pastille,
    couleurTitreFaceA: couleurLisible(fondHaut, palette.titre),
    couleurTitreFaceB: couleurLisible(fondBas, palette.titre),
    couleurTitreFaceAManuelle: false,
    couleurTitreFaceBManuelle: false,
    couleurArtiste: couleurLisible(palette.ruban, palette.artiste),
    couleurMotif: palette.motif,
    decorPanel: motifType === "aucun" ? "motif" : "motif",
    motifType,
    motif: motifType === "aucun" ? 0 : nombreAleatoire(paletteSobre ? 10 : 22, paletteSobre ? 26 : 46, 2),
    angleMotif: choisirAleatoire([-18, -12, 0, 12, 18]),
    modeVignette: "aucun",
    vignette: 0,
    intensite: 0,
    bordure: nombreAleatoire(profil.bordure[0], profil.bordure[1], 1),
    arrondiInterieurBordure: Math.random() < 0.55,
    largeurRuban: nombreAleatoire(profil.largeurRuban[0], profil.largeurRuban[1], 1),
    hauteurRuban: nombreAleatoire(profil.hauteurRuban[0], profil.hauteurRuban[1], 1),
    hauteurBande,
    afficherMarques: true,
    presetMarques: preset,
    marqueGauche,
    marqueDroite,
    marqueGaucheTexte: marqueGauche,
    marqueDroiteTexte: marqueDroite,
    synchroniserMarques: true,
    couleurMarques: palette.pastille,
    couleurMarqueGauche: palette.pastille,
    couleurMarqueDroite: palette.pastille,
    formePastille,
    formePastilleGauche: formePastille,
    formePastilleDroite: formePastille,
    diametrePastille,
    diametrePastilleGauche: diametrePastille,
    diametrePastilleDroite: diametrePastille,
    positionMarques,
    positionMarqueGauche: positionMarques,
    positionMarqueDroite: positionMarques,
    hauteurMarques,
    hauteurMarqueGauche: hauteurMarques,
    hauteurMarqueDroite: hauteurMarques,
    angleMarques,
    angleMarqueGauche: angleMarques,
    angleMarqueDroite: -angleMarques,
    tailleMarques: nombreAleatoire(145, 185, 5),
    tailleMarqueGauche: nombreAleatoire(145, 185, 5),
    tailleMarqueDroite: nombreAleatoire(145, 185, 5),
    policeMarques: choisirAleatoire(["sans-serree", "elegante", "compacte", "mono-moderne"]),
    policeMarqueGauche: base.policeMarqueGauche || "sans-serree",
    policeMarqueDroite: base.policeMarqueDroite || "sans-serree",
    styleMarqueGauche: "gras",
    styleMarqueDroite: "gras",
    limiterMarquesBandeSurprise: false,
    policeTitres: choisirAleatoire(["swing-50", "sans-serree", "mono-moderne", "rock-affiche"]),
    policeArtiste: choisirAleatoire(["sans-serree", "elegante", "compacte", "mono-moderne"]),
    tailleTitres: nombreAleatoire(118, 160, 2),
    tailleArtiste: nombreAleatoire(118, 145, 2),
    styleTitres: Math.random() < 0.35 ? "gras" : "normal",
    styleArtiste: "gras",
    guillemetsTitres: Math.random() < 0.45,
    decalageRetro: choisirDecalageRetroSurprise(base, ["titres-leger", "artiste-leger", "tout-leger", "tout-bas-decale"]),
  };
}

function signatureStyleEnregistre(reglages) {
  return JSON.stringify([
    reglages.modele,
    reglages.couleur1,
    reglages.couleur2,
    reglages.couleur3,
    reglages.couleurRuban,
    reglages.couleurVignette,
    reglages.couleurTitreFaceA,
    reglages.couleurTitreFaceB,
    reglages.couleurArtiste,
    reglages.decorPanel,
    reglages.motifType,
    reglages.modeVignette,
    reglages.bordure,
    reglages.bordureHorizontale,
    reglages.bordureVerticale,
    normaliserTailleTrianglesPourSignature(reglages),
    reglages.largeurRuban,
    reglages.hauteurRuban,
    reglages.hauteurBande,
    reglages.policeTitres,
    reglages.policeArtiste,
  ]);
}

function signatureEtatReglages(reglages) {
  return JSON.stringify(
    Object.keys(reglages)
      .sort()
      .map((cle) => [cle, reglages[cle]]),
  );
}

function ajusterMotifVisible() {
  elements.decorPanel.value = "motif";
  // Une case d’application désactive uniquement sa zone. Le panneau Motif
  // reste ouvert afin de pouvoir activer le fond, le ruban ou le secondaire.
  elements.activerMotif.checked = true;
  synchroniserOptionsMotifSecondaire();
  mettreAJourBoutonsDecor();
  if (elements.motifFond.checked && elements.motifType.value !== "aucun" && Number(elements.motif.value) < 25) {
    elements.motif.value = "45";
  }
  if (elements.motifRuban.checked && elements.motifRubanType.value === "aucun") {
    elements.motifRubanType.value = elements.motifType.value !== "aucun" ? elements.motifType.value : "grille";
  }
  if (elements.motifRuban.checked && Number(elements.opaciteMotifRuban.value) < 25) {
    elements.opaciteMotifRuban.value = "45";
  }
  if (!chargementReglages) {
    enregistrerReglagesActifs();
    mettreAJour();
  }
}

function motifDecorActifDepuisFormulaire() {
  return (
    (elements.motifFond.checked && elements.motifType.value !== "aucun")
    || (elements.motifRuban.checked && elements.motifRubanType.value !== "aucun")
    || (
      elements.afficherTraitsModernes.checked
      && (elements.motifSecondaireFond.checked || elements.motifSecondaireRuban.checked)
    )
  );
}

function ajusterVignetteVisible() {
  elements.decorPanel.value = "vignette";
  elements.activerVignettage.checked = elements.modeVignette.value !== "aucun";
  mettreAJourBoutonsDecor();
  if (elements.modeVignette.value !== "aucun" && Number(elements.vignette.value) < 25) {
    elements.vignette.value = "80";
  }
  if (!chargementReglages) {
    enregistrerReglagesActifs();
    mettreAJour();
  }
}

function basculerDecor(type) {
  enregistrerHistoriqueAvantAction();
  const panelDejaOuvert = elements.decorPanel.value === type;
  if (type === "motif") {
    elements.activerMotif.checked = panelDejaOuvert
      ? !elements.activerMotif.checked
      : true;
    elements.decorPanel.value = "motif";
    if (elements.activerMotif.checked) {
      if (elements.motifType.value === "aucun") {
        elements.motifType.value = "grille";
      }
      synchroniserOptionsMotifSecondaire();
      elements.motifFond.checked = true;
      if (Number(elements.motif.value) < 25) {
        elements.motif.value = "45";
      }
    } else {
      elements.motifType.value = "aucun";
      elements.motifFond.checked = true;
      elements.motifRuban.checked = false;
      elements.motifRubanType.value = "aucun";
      elements.afficherTraitsModernes.checked = false;
      elements.motifSecondaireFond.checked = true;
      elements.motifSecondaireRuban.checked = false;
    }
  }
  if (type === "vignette") {
    elements.activerVignettage.checked = panelDejaOuvert
      ? !elements.activerVignettage.checked
      : true;
    elements.decorPanel.value = "vignette";
    if (elements.activerVignettage.checked) {
      if (elements.modeVignette.value === "aucun") {
        elements.modeVignette.value = "fond";
      }
      if (Number(elements.vignette.value) < 25) {
        elements.vignette.value = "80";
      }
    } else {
      elements.modeVignette.value = "aucun";
    }
  }
  if (type === "patine") {
    elements.activerPatine.checked = panelDejaOuvert
      ? !elements.activerPatine.checked
      : true;
    elements.decorPanel.value = "patine";
    if (elements.activerPatine.checked && Number(elements.intensitePatine.value) < 1) {
      elements.intensitePatine.value = "55";
    }
  }
  mettreAJourBoutonsDecor();
  mettreAJourInterfaceConditionnelle(lireReglagesFormulaire());
  enregistrerReglagesActifs();
  mettreAJour();
}

function decorActifDepuisPanel() {
  const panel = elements.decorPanel.value;
  if (panel === "motif" && elements.activerMotif.checked) {
    return "motif";
  }
  if (panel === "vignette" && elements.activerVignettage.checked) {
    return "vignette";
  }
  if (panel === "patine" && elements.activerPatine.checked) {
    return "patine";
  }
  if (elements.activerMotif.checked) {
    return "motif";
  }
  if (elements.activerVignettage.checked) {
    return "vignette";
  }
  if (elements.activerPatine.checked) {
    return "patine";
  }
  return null;
}

function mettreAJourBoutonsDecor() {
  elements.boutonMotif.setAttribute("aria-pressed", String(elements.activerMotif.checked));
  elements.boutonVignettage.setAttribute("aria-pressed", String(elements.activerVignettage.checked));
  elements.boutonPatine.setAttribute("aria-pressed", String(elements.activerPatine.checked));
}

function synchroniserPatineDepuisIntensite() {
  elements.activerPatine.checked = Number(elements.intensitePatine.value) > 0;
  mettreAJourBoutonsDecor();
}

function mettreAJourReglagesTexteMiseEnPage() {
  const afficherDansMiseEnPage = etapeReglageActive === "ruban" && elements.modifierTextesMiseEnPage.checked;
  elements.reglagesTexteMiseEnPage.hidden = !afficherDansMiseEnPage;
  const cible = afficherDansMiseEnPage ? elements.reglagesTexteMiseEnPage : document.querySelector('[data-tab-panel="texte"]');
  if (cible && !cible.contains(elements.reglagesTextePrincipaux)) {
    cible.append(elements.reglagesTextePrincipaux);
  }
}

function mettreAJourDeplacementTextes() {
  elements.reglagesDeplacementTextes.hidden = !elements.deplacementTextesManuel.checked;
}

function appliquerPresetMarques() {
  const valeurs = presetsMarques[elements.presetMarques.value];
  if (!valeurs) {
    return;
  }
  elements.marqueGauche.value = valeurs[0];
  elements.marqueDroite.value = valeurs[1];
  if (elements.synchroniserMarques.checked) {
    synchroniserValeursMarquesDepuisCommun();
  } else {
    elements.marqueGaucheTexte.value = valeurs[0];
    elements.marqueDroiteTexte.value = valeurs[1];
  }
  enregistrerReglagesActifs();
  mettreAJour();
}

function synchroniserValeursMarquesDepuisCommun(ecraserTextes = true) {
  if (!elements.synchroniserMarques.checked) {
    return;
  }
  if (ecraserTextes) {
    elements.marqueGaucheTexte.value = elements.marqueGauche.value;
    elements.marqueDroiteTexte.value = elements.marqueDroite.value;
  }
  elements.couleurMarqueGauche.value = elements.couleurMarques.value;
  elements.couleurMarqueDroite.value = elements.couleurMarques.value;
  elements.formePastilleGauche.value = elements.formePastille.value;
  elements.formePastilleDroite.value = elements.formePastille.value;
  elements.policeMarqueGauche.value = elements.policeMarques.value;
  elements.policeMarqueDroite.value = elements.policeMarques.value;
  elements.styleMarqueGauche.value = normaliserStylePolice(elements.policeMarqueGauche.value, "gras");
  elements.styleMarqueDroite.value = normaliserStylePolice(elements.policeMarqueDroite.value, "gras");
  synchroniserSelectStylePolice(elements.policeMarqueGauche, elements.styleMarqueGauche);
  synchroniserSelectStylePolice(elements.policeMarqueDroite, elements.styleMarqueDroite);
  elements.tailleMarqueGauche.value = elements.tailleMarques.value;
  elements.tailleMarqueDroite.value = elements.tailleMarques.value;
  elements.diametrePastilleGauche.value = elements.diametrePastille.value;
  elements.diametrePastilleDroite.value = elements.diametrePastille.value;
  elements.angleMarqueGauche.value = elements.angleMarques.value;
  elements.angleMarqueDroite.value = String(-Number(elements.angleMarques.value || 0));
  elements.positionMarqueGauche.value = elements.positionMarques.value;
  elements.positionMarqueDroite.value = elements.positionMarques.value;
  elements.hauteurMarqueGauche.value = elements.hauteurMarques.value;
  elements.hauteurMarqueDroite.value = elements.hauteurMarques.value;
}

function copierReglages(evenement) {
  const texte = JSON.stringify(preparerReglagesPourExport(lireReglagesFormulaire()), null, 2);
  const bouton = evenement?.currentTarget || elements.copierReglagesFavoris;
  const libelleInitial = bouton.textContent;
  const blob = new Blob([`${texte}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = `45ojuke-style-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(lien);
  lien.click();
  lien.remove();
  URL.revokeObjectURL(url);
  bouton.textContent = traduirePhrase("Exporté");
  setTimeout(() => {
    bouton.textContent = libelleInitial;
  }, 1400);
}

function creerSauvegardeSession() {
  const actif = etiquetteActive === "2" && deuxiemeEtiquetteActive() ? "2" : "1";
  const reglagesActifs = styleActifVerrouille()
    ? reglagesParEtiquette[actif]
    : lireReglagesFormulaire();
  return {
    type: "45ojuke-session",
    version: 1,
    sauvegardeLe: new Date().toISOString(),
    session: {
      etiquetteActive: actif,
      deuxiemeEtiquetteActive: deuxiemeEtiquetteActive(),
      modeModificationEtiquettes,
      indexApercu,
      etapeReglageActive,
      stylesVerrouillesParLigne: { ...stylesVerrouillesParLigne },
      reglagesParLigne: clonerReglages(reglagesParLigne),
      reglages: {
        1: clonerReglages(actif === "1" ? reglagesActifs : lireReglages("1")),
        2: deuxiemeEtiquetteActive()
          ? clonerReglages(actif === "2" ? reglagesActifs : lireReglages("2"))
          : null,
      },
      vinyles: vinyles.map((vinyle) => ({ ...vinyle })),
      favoris: obtenirFavoris(),
    },
  };
}

function exporterSauvegardeSession(evenement) {
  const bouton = evenement.currentTarget;
  const libelleInitial = bouton.textContent;
  const texte = JSON.stringify(creerSauvegardeSession(), null, 2);
  const blob = new Blob([`${texte}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = `45ojuke-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(lien);
  lien.click();
  lien.remove();
  URL.revokeObjectURL(url);
  bouton.textContent = traduirePhrase("Sauvegarde téléchargée");
  setTimeout(() => {
    bouton.textContent = libelleInitial;
  }, 1400);
}

function demanderImportSauvegardeSession() {
  elements.importSauvegardeFile.value = "";
  elements.importSauvegardeFile.click();
}

async function importerSauvegardeSessionDepuisFichier(evenement) {
  const fichier = evenement.target.files?.[0];
  if (!fichier) {
    return;
  }
  try {
    const donnees = JSON.parse(await fichier.text());
    restaurerSauvegardeSession(donnees);
    window.alert(traduirePhrase("Sauvegarde restaurée."));
  } catch (erreur) {
    window.alert(erreur.message || traduirePhrase("Impossible d’importer cette sauvegarde."));
  } finally {
    evenement.target.value = "";
  }
}

function restaurerSauvegardeSession(donnees) {
  if (donnees?.type !== "45ojuke-session" || donnees.version !== 1 || !donnees.session?.reglages?.["1"]) {
    throw new Error(traduirePhrase("Format de sauvegarde invalide."));
  }
  const session = donnees.session;
  if (!Array.isArray(session.vinyles)) {
    throw new Error(traduirePhrase("Format de sauvegarde invalide."));
  }

  const reglagesPrincipaux = normaliserReglagesImportes(session.reglages["1"]);
  const reglagesSecondaires = session.reglages["2"]
    ? normaliserReglagesImportes(session.reglages["2"])
    : null;
  const secondeActive = Boolean(session.deuxiemeEtiquetteActive && reglagesSecondaires);

  reglagesParEtiquette[1] = reglagesPrincipaux;
  reglagesParEtiquette[2] = secondeActive ? reglagesSecondaires : null;
  modeModificationEtiquettes = session.modeModificationEtiquettes === "individuel" ? "individuel" : "toutes";
  elements.modeModificationEtiquettes.forEach((radio) => {
    radio.checked = radio.value === modeModificationEtiquettes;
  });
  stylesVerrouillesParLigne = { ...(session.stylesVerrouillesParLigne || {}) };
  reglagesParLigne = Object.fromEntries(
    Object.entries(session.reglagesParLigne || {}).map(([cle, reglages]) => [
      cle,
      normaliserReglagesImportes(reglages),
    ]),
  );
  vinyles = session.vinyles.map((vinyle, index) => ({
    ...vinyle,
    __ordreOriginal: Number.isFinite(Number(vinyle.__ordreOriginal))
      ? Number(vinyle.__ordreOriginal)
      : index,
  }));
  elements.nombreEtiquettes.value = String(Math.max(1, vinyles.length));
  enregistrerFavoris(Array.isArray(session.favoris) ? session.favoris : []);
  memoriserOrdreOriginal();
  indexApercu = Math.max(0, Math.min(Number(session.indexApercu) || 0, Math.max(0, vinyles.length - 1)));
  synchroniserBoutonDeuxiemeEtiquette(secondeActive);
  if (secondeActive) {
    elements.modeleSecondaire.value = reglagesSecondaires.modele;
  }
  etiquetteActive = secondeActive && session.etiquetteActive === "2" ? "2" : "1";
  elements.editionEtiquette.forEach((radio) => {
    radio.checked = radio.value === etiquetteActive;
  });
  appliquerReglagesAuFormulaire(lireReglages(etiquetteActive));
  sauvegarderCsvLocal();
  sauvegarderReglagesAutomatiques();
  afficherApercuApresChoixModele();
  quitterIntro();
  mettreAJourGalerieModeles();
  afficherFavoris();
  const etapeDemandee = ETAPES_ASSISTANT.includes(session.etapeReglageActive)
    ? session.etapeReglageActive
    : "donnees";
  activerEtapeReglage(etapeDemandee);
  rendreTableauCsvActif?.();
  mettreAJour();
}

function creerPayloadJsonStyle() {
  const deuxiemeActive = deuxiemeEtiquetteActive();
  const reglagesPrincipaux = lireReglages("1");
  const reglagesSecondaires = deuxiemeActive ? lireReglages("2") : null;
  return {
    styles: {
      primary: preparerReglagesPourExport(reglagesPrincipaux),
      secondary: reglagesSecondaires ? preparerReglagesPourExport(reglagesSecondaires) : null,
    },
    previewImages: {
      primary: creerApercuStylePourEmail(reglagesPrincipaux, "principal"),
      secondary: reglagesSecondaires ? creerApercuStylePourEmail(reglagesSecondaires, "secondaire") : null,
    },
  };
}

function creerPayloadFavori(reglages) {
  return {
    favoriteStyle: preparerReglagesPourExport(reglages),
    favoritePreviewImage: creerApercuStylePourEmail(reglages, "favori"),
  };
}

function creerApercuStylePourEmail(reglages, nom) {
  try {
    const canvas = dessinerEtiquette(creerLigneAnonymePourApercuEmail(), reglages);
    const apercu = redimensionnerCanvasPourEmail(canvas);
    return {
      name: `45ojuke-apercu-${nom}.jpg`,
      dataUrl: apercu.toDataURL("image/jpeg", 0.7),
    };
  } catch {
    return null;
  }
}

function creerLigneAnonymePourApercuEmail() {
  return {
    titre_face_a: "FACE A",
    titre_face_b: "FACE B",
    selection_face_a: "A",
    selection_face_b: "B",
    titreA: "FACE A",
    artiste: "45'O'JUKE",
    titreB: "FACE B",
    artisteAffiche: "45'O'JUKE",
    position: "",
  };
}

function redimensionnerCanvasPourEmail(source) {
  const largeurMax = 420;
  const ratio = Math.min(1, largeurMax / source.width);
  if (ratio >= 1) {
    return source;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(source.width * ratio);
  canvas.height = Math.round(source.height * ratio);
  const contexte = canvas.getContext("2d");
  contexte.fillStyle = "#ffffff";
  contexte.fillRect(0, 0, canvas.width, canvas.height);
  contexte.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function importerReglages() {
  elements.importStyleFile.value = "";
  elements.importStyleFile.click();
}

async function importerReglagesDepuisFichier(evenement) {
  const fichier = evenement.target.files?.[0];
  if (!fichier) {
    return;
  }
  try {
    const texte = await fichier.text();
    const reglages = normaliserReglagesImportes(JSON.parse(texte));
    enregistrerHistoriqueAvantAction();
    appliquerReglagesAuFormulaire(reglages);
    enregistrerReglagesActifs();
    mettreAJour();
  } catch (erreur) {
    window.alert(erreur.message || traduirePhrase("Impossible d'importer ces réglages."));
  } finally {
    evenement.target.value = "";
  }
}

function normaliserReglagesStyle(reglagesStyle) {
  const modele = String(reglagesStyle?.modele || "").trim();
  const reglagesDefaut = obtenirReglagesDefautModele(modele) || {};
  return normaliserReglagesImportes({
    ...reglagesDefaut,
    ...reglagesStyle,
    modele,
  });
}

function normaliserReglagesImportes(donnees) {
  if (!donnees || Array.isArray(donnees) || typeof donnees !== "object") {
    throw new Error(traduirePhrase("Format de réglages invalide."));
  }

  const donneesCompatibles = { ...donnees };
  const reglages = lireReglagesFormulaire();
  initialiserOptionsAbsentesPourImport(reglages, donneesCompatibles);
  Object.entries(donneesCompatibles).forEach(([cle, valeur]) => {
    const champ = elements[cle];
    if (!champ || !(cle in reglages)) {
      return;
    }

    if (champ.type === "checkbox") {
      reglages[cle] = Boolean(valeur);
      return;
    }

    if (champ.type === "range" || champ.type === "number") {
      const nombre = Number(valeur);
      if (!Number.isFinite(nombre)) {
        return;
      }
      const minimum = cle === "bordure" ? EPAISSEUR_BORDURE_MIN : (champ.min === "" ? -Infinity : Number(champ.min));
      const maximum = champ.max === "" ? Infinity : Number(champ.max);
      reglages[cle] = Math.max(minimum, Math.min(maximum, nombre));
      return;
    }

    if (champ.type === "color") {
      if (/^#[0-9a-f]{6}$/i.test(String(valeur))) {
        reglages[cle] = String(valeur);
      }
      return;
    }

    if (champ.tagName === "SELECT") {
      if ([...champ.options].some((option) => option.value === String(valeur))) {
        reglages[cle] = String(valeur);
      }
      return;
    }

    reglages[cle] = String(valeur).slice(0, champ.maxLength > 0 ? champ.maxLength : 500);
  });
  const couleurTexteEstManuelle = (cleCouleur, cleIndicateur) => (
    Object.prototype.hasOwnProperty.call(donneesCompatibles, cleIndicateur)
      ? donneesCompatibles[cleIndicateur] === true
      : Object.prototype.hasOwnProperty.call(donneesCompatibles, cleCouleur)
  );
  reglages.couleurTitreFaceAManuelle = couleurTexteEstManuelle("couleurTitreFaceA", "couleurTitreFaceAManuelle");
  reglages.couleurTitreFaceBManuelle = couleurTexteEstManuelle("couleurTitreFaceB", "couleurTitreFaceBManuelle");
  reglages.couleurArtisteManuelle = couleurTexteEstManuelle("couleurArtiste", "couleurArtisteManuelle");
  reglages.couleurMarquesManuelle = Object.prototype.hasOwnProperty.call(donneesCompatibles, "couleurMarquesManuelle")
    ? donneesCompatibles.couleurMarquesManuelle === true
    : Object.prototype.hasOwnProperty.call(donneesCompatibles, "couleurMarques");

  if (reglages.modele === "MARTIN" && !Object.prototype.hasOwnProperty.call(donneesCompatibles, "hauteurBande")) {
    reglages.hauteurBande = 0;
  }
  if (!Object.prototype.hasOwnProperty.call(donneesCompatibles, "angleMotif")) {
    reglages.angleMotif = presets[reglages.modele]?.angleMotif ?? 0;
  }
  if (!Object.prototype.hasOwnProperty.call(donneesCompatibles, "motifRuban")) {
    reglages.motifRuban = false;
  }
  if (!Object.prototype.hasOwnProperty.call(donneesCompatibles, "motifRubanType")) {
    reglages.motifRubanType = "aucun";
  }
  if (!Object.prototype.hasOwnProperty.call(donneesCompatibles, "opaciteMotifRuban")) {
    reglages.opaciteMotifRuban = 45;
  }
  if (!Object.prototype.hasOwnProperty.call(donneesCompatibles, "angleMotifRuban")) {
    reglages.angleMotifRuban = 0;
  }
  if (!Object.prototype.hasOwnProperty.call(donneesCompatibles, "motifSecondaireFond")) {
    reglages.motifSecondaireFond = true;
  }
  if (!Object.prototype.hasOwnProperty.call(donneesCompatibles, "motifSecondaireRuban")) {
    reglages.motifSecondaireRuban = false;
  }
  if (reglages.modele === "CELESTE") {
    const preset = presets[reglages.modele] || presets.CELESTE;
    [
      "couleurBandeGauche",
      "couleurBandeDroite",
      "couleurFondModerne",
      "afficherTraitsModernes",
      "motifTraitsModernes",
      "couleurTraitsModernes",
      "opaciteTraitsModernes",
      "angleTraitsModernes",
      "tailleBandeGauche",
      "angleBandeGauche",
      "tailleBandeDroite",
      "angleBandeDroite",
    ].forEach((cle) => {
      if (!Object.prototype.hasOwnProperty.call(donneesCompatibles, cle)) {
        reglages[cle] = preset[cle];
      }
    });
  }

  return reglages;
}

function inverserStyle() {
  const reglages = lireReglagesFormulaire();
  const signatureVariante = signatureBaseVariante(reglages);
  if (!cycleVarianteBouton || signatureDerniereVarianteCouleur !== signatureVariante) {
    cycleVarianteBouton = creerCycleVariante(reglages);
  }

  const variante = cycleVarianteBouton.prochaine();
  enregistrerHistoriqueAvantAction();
  appliquerReglagesAuFormulaire(variante);
  signatureDerniereVarianteCouleur = signatureBaseVariante(lireReglagesFormulaire());
  enregistrerReglagesActifs();
  mettreAJour();
}

function applyNextTint() {
  const reglages = lireReglagesFormulaire();
  indexTeinteActif = (indexTeinteActif + 1) % PALETTES_TEINTES.length;
  enregistrerHistoriqueAvantAction();
  appliquerReglagesAuFormulaire(appliquerPaletteTeinte(reglages, PALETTES_TEINTES[indexTeinteActif]));
  signatureDerniereVarianteCouleur = "";
  cycleVarianteBouton = null;
  enregistrerReglagesActifs();
  mettreAJour();
}

function appliquerPaletteTeinte(reglages, palette) {
  const fondHaut = couleurFondTeintee(reglages.couleur2, palette.fondHaut);
  const fondBas = couleurFondTeintee(reglages.couleur3, palette.fondBas);
  const ruban = couleurFondTeintee(reglages.couleurRuban, palette.ruban);
  const fondModerne = couleurFondTeintee(reglages.couleurFondModerne, palette.fondHaut);
  const couleurTitreFaceA = couleurTexteTeintee(reglages.couleurTitreFaceA, palette.titre, fondHaut);
  const couleurTitreFaceB = couleurTexteTeintee(reglages.couleurTitreFaceB, palette.titre, fondBas);
  const couleurArtisteSource = estCouleurClaire(ruban) ? palette.cadre : palette.artiste;
  const couleurArtiste = couleurTexteTeintee(reglages.couleurArtiste, couleurArtisteSource, ruban);
  const couleurMarques = reglages.couleurMarquesManuelle
    ? reglages.couleurMarques
    : couleurFondTeintee(reglages.couleurMarques, palette.marques);
  const couleurMarqueGauche = couleurFondTeintee(reglages.couleurMarqueGauche, couleurMarques);
  const couleurMarqueDroite = couleurFondTeintee(reglages.couleurMarqueDroite, couleurMarques);
  return {
    ...reglages,
    couleur1: palette.cadre,
    couleur2: fondHaut,
    couleur3: fondBas,
    couleurRuban: ruban,
    couleurFondModerne: fondModerne,
    couleurBandeGauche: palette.cadre,
    couleurBandeDroite: couleurFondTeintee(reglages.couleurBandeDroite, palette.fondBas),
    couleurTitreFaceA,
    couleurTitreFaceB,
    couleurArtiste,
    couleurMotif: palette.motif,
    couleurMotifRuban: palette.secondaire,
    couleurTraitsModernes: palette.secondaire,
    couleurMarques,
    couleurMarqueGauche,
    couleurMarqueDroite,
  };
}

function couleurFondTeintee(couleurActuelle, couleurTeinte) {
  if (estFondPreserveParTeinte(couleurActuelle)) {
    return normaliserCouleurHex(couleurActuelle);
  }
  if (estCouleurClaire(couleurActuelle)) {
    return appliquerTeinteEnGardantClarte(couleurActuelle, couleurTeinte);
  }
  return couleurTeinte;
}

function couleurTexteTeintee(couleurActuelle, couleurTeinte, couleurFond) {
  if (estCouleurNeutreFoncee(couleurActuelle)) {
    return normaliserCouleurHex(couleurActuelle);
  }
  if (estCouleurNeutre(couleurActuelle)) {
    return couleurLisible(couleurFond, normaliserCouleurHex(couleurActuelle));
  }
  return couleurTeinteeLisible(couleurTeinte, couleurFond);
}

function couleurTeinteeLisible(couleurTeinte, couleurFond, contrasteMinimum = 4.5) {
  const couleurNormalisee = normaliserCouleurHex(couleurTeinte);
  if (ratioContrasteTeinte(couleurFond, couleurNormalisee) >= contrasteMinimum) {
    return couleurNormalisee;
  }

  const hsl = rgbVersHsl(lireCouleurHex(couleurNormalisee));
  const fondEstClair = rgbVersHsl(lireCouleurHex(couleurFond)).l >= 0.5;
  const borne = fondEstClair ? 0 : 1;
  let meilleureCouleur = couleurNormalisee;
  let meilleurEcart = Infinity;

  for (let etape = 0; etape <= 100; etape += 1) {
    const clarte = hsl.l + (borne - hsl.l) * (etape / 100);
    const candidate = hslVersHex(hsl.h, hsl.s, clarte);
    if (ratioContrasteTeinte(couleurFond, candidate) >= contrasteMinimum) {
      const ecart = Math.abs(clarte - hsl.l);
      if (ecart < meilleurEcart) {
        meilleureCouleur = candidate;
        meilleurEcart = ecart;
      }
    }
  }

  return meilleurEcart < Infinity ? meilleureCouleur : couleurLisible(couleurFond, couleurNormalisee);
}

function ratioContrasteTeinte(couleurA, couleurB) {
  const luminanceA = luminanceTeinte(couleurA);
  const luminanceB = luminanceTeinte(couleurB);
  return (Math.max(luminanceA, luminanceB) + 0.05) / (Math.min(luminanceA, luminanceB) + 0.05);
}

function luminanceTeinte(couleur) {
  const rgb = lireCouleurHex(couleur);
  if (!rgb) {
    return 0;
  }
  const convertir = (canal) => {
    const valeur = canal / 255;
    return valeur <= 0.03928 ? valeur / 12.92 : ((valeur + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * convertir(rgb.rouge)
    + 0.7152 * convertir(rgb.vert)
    + 0.0722 * convertir(rgb.bleu)
  );
}

function estFondPreserveParTeinte(couleur) {
  const rgb = lireCouleurHex(couleur);
  if (!rgb) {
    return false;
  }
  const max = Math.max(rgb.rouge, rgb.vert, rgb.bleu);
  const min = Math.min(rgb.rouge, rgb.vert, rgb.bleu);
  return min >= 244 && (max - min) <= 12;
}

function estCouleurNeutre(couleur) {
  const rgb = lireCouleurHex(couleur);
  if (!rgb) {
    return false;
  }
  const max = Math.max(rgb.rouge, rgb.vert, rgb.bleu);
  const min = Math.min(rgb.rouge, rgb.vert, rgb.bleu);
  return (max - min) <= 10;
}

function estCouleurNeutreFoncee(couleur) {
  const rgb = lireCouleurHex(couleur);
  return Boolean(rgb) && estCouleurNeutre(couleur) && rgbVersHsl(rgb).l <= 0.3;
}

function estCouleurClaire(couleur) {
  const rgb = lireCouleurHex(couleur);
  if (!rgb) {
    return false;
  }
  return rgbVersHsl(rgb).l >= 0.74;
}

function appliquerTeinteEnGardantClarte(couleurActuelle, couleurTeinte) {
  const hslActuel = rgbVersHsl(lireCouleurHex(couleurActuelle));
  const hslTeinte = rgbVersHsl(lireCouleurHex(couleurTeinte));
  const saturation = limiterRatio(Math.max(0.16, Math.min(hslActuel.s, 0.36), hslTeinte.s * 0.42), 0.16, 0.42);
  const clarte = limiterRatio(Math.max(0.78, hslActuel.l), 0.78, 0.94);
  return hslVersHex(hslTeinte.h, saturation, clarte);
}

function limiterRatio(valeur, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, valeur));
}

function rgbVersHsl({ rouge, vert, bleu }) {
  const r = rouge / 255;
  const g = vert / 255;
  const b = bleu / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l };
  }
  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let h = 0;
  if (max === r) {
    h = (g - b) / delta + (g < b ? 6 : 0);
  } else if (max === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }
  return { h: h / 6, s, l };
}

function hslVersHex(h, s, l) {
  const teinteVersRgb = (p, q, t) => {
    let teinte = t;
    if (teinte < 0) teinte += 1;
    if (teinte > 1) teinte -= 1;
    if (teinte < 1 / 6) return p + (q - p) * 6 * teinte;
    if (teinte < 1 / 2) return q;
    if (teinte < 2 / 3) return p + (q - p) * (2 / 3 - teinte) * 6;
    return p;
  };
  if (s === 0) {
    const gris = Math.round(l * 255);
    return normaliserRgbEnHex(gris, gris, gris);
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return normaliserRgbEnHex(
    Math.round(teinteVersRgb(p, q, h + 1 / 3) * 255),
    Math.round(teinteVersRgb(p, q, h) * 255),
    Math.round(teinteVersRgb(p, q, h - 1 / 3) * 255)
  );
}

function normaliserCouleurHex(couleur) {
  const rgb = lireCouleurHex(couleur);
  if (!rgb) {
    return couleur;
  }
  return normaliserRgbEnHex(rgb.rouge, rgb.vert, rgb.bleu);
}

function normaliserRgbEnHex(rouge, vert, bleu) {
  return `#${[rouge, vert, bleu].map((composant) => composant.toString(16).padStart(2, "0")).join("")}`;
}

function lireCouleurHex(couleur) {
  const valeur = String(couleur || "").trim();
  const court = /^#?([0-9a-f]{3})$/i.exec(valeur);
  if (court) {
    const [rouge, vert, bleu] = court[1].split("").map((composant) => parseInt(composant + composant, 16));
    return { rouge, vert, bleu };
  }
  const long = /^#?([0-9a-f]{6})$/i.exec(valeur);
  if (!long) {
    return null;
  }
  return {
    rouge: parseInt(long[1].slice(0, 2), 16),
    vert: parseInt(long[1].slice(2, 4), 16),
    bleu: parseInt(long[1].slice(4, 6), 16),
  };
}

function estStyleParDefautVariante(style, modele) {
  if (String(style.id || "").trim() === modele) {
    return true;
  }
  const reglagesDefaut = obtenirReglagesDefautModele(modele);
  if (!reglagesDefaut) {
    return false;
  }
  const reglagesStyle = normaliserReglagesImportes({ ...reglagesDefaut, ...style.reglages });
  return signatureEtatReglages(reglagesStyle) === signatureEtatReglages(reglagesDefaut);
}

function signatureBaseVariante(reglages) {
  return JSON.stringify(
    Object.keys(reglages)
      .filter((cle) => !cle.startsWith("couleur"))
      .sort()
      .map((cle) => [cle, reglages[cle]])
  );
}

function creerVarianteClassique(reglages) {
  const fond = reglages.couleurRuban;
  const ruban = reglages.couleur3;
  return {
    ...reglages,
    couleur2: fond,
    couleur3: fond,
    couleurRuban: ruban,
    couleurTitreFaceA: couleurLisible(fond, reglages.couleurTitreFaceA),
    couleurTitreFaceB: couleurLisible(fond, reglages.couleurTitreFaceB),
    couleurTitreFaceAManuelle: false,
    couleurTitreFaceBManuelle: false,
    couleurArtiste: couleurLisible(ruban, reglages.couleurArtiste),
  };
}

function creerVarianteManu(reglages) {
  const palettes = [
    { cadre: "#111827", pastille: "#dc2626", fond: "#ffffff", ruban: "#ffffff", titre: "#111827", artiste: "#dc2626", motif: "#111827" },
    { cadre: "#dc2626", pastille: "#111827", fond: "#ffffff", ruban: "#ffffff", titre: "#111827", artiste: "#dc2626", motif: "#dc2626" },
    { cadre: "#0f766e", pastille: "#f59e0b", fond: "#ffffff", ruban: "#ffffff", titre: "#111827", artiste: "#0f766e", motif: "#0f766e" },
    { cadre: "#1d4ed8", pastille: "#be185d", fond: "#ffffff", ruban: "#ffffff", titre: "#111827", artiste: "#1d4ed8", motif: "#1d4ed8" },
    { cadre: "#7c2d12", pastille: "#2563eb", fond: "#fffdf8", ruban: "#ffffff", titre: "#1f2937", artiste: "#7c2d12", motif: "#7c2d12" },
    { cadre: "#4c1d95", pastille: "#f97316", fond: "#ffffff", ruban: "#fff7ed", titre: "#1f1633", artiste: "#4c1d95", motif: "#4c1d95" },
    { cadre: "#0f172a", pastille: "#10b981", fond: "#f8fafc", ruban: "#ffffff", titre: "#0f172a", artiste: "#0f172a", motif: "#0f172a" },
  ];
  const paletteActuelle = palettes.findIndex((palette) => (
    couleursEgales(palette.cadre, reglages.couleur1)
    && couleursEgales(palette.pastille, reglages.couleurMarques)
  ));
  const palette = paletteActuelle >= 0
    ? palettes[(paletteActuelle + 1) % palettes.length]
    : choisirPaletteManuDistincte(palettes, reglages);

  return {
    ...reglages,
    couleur1: palette.cadre,
    couleur2: palette.fond,
    couleur3: palette.fond,
    couleurRuban: palette.ruban,
    couleurVignette: palette.pastille,
    couleurMotif: palette.motif,
    couleurTitreFaceA: couleurLisible(palette.fond, palette.titre),
    couleurTitreFaceB: couleurLisible(palette.fond, palette.titre),
    couleurTitreFaceAManuelle: false,
    couleurTitreFaceBManuelle: false,
    couleurArtiste: couleurLisible(palette.ruban, palette.artiste),
    couleurMarques: palette.pastille,
    couleurMarqueGauche: palette.pastille,
    couleurMarqueDroite: palette.pastille,
    modeVignette: "fond",
    vignette: Math.max(20, Number(reglages.vignette) || 80),
    decorPanel: "vignette",
    motifType: reglages.motifType === "aucun" ? "diagonales" : reglages.motifType,
    motif: Math.max(12, Number(reglages.motif) || 20),
  };
}

function choisirPaletteManuDistincte(palettes, reglages) {
  return palettes.find((palette) => (
    !couleursEgales(palette.cadre, reglages.couleur1)
    || !couleursEgales(palette.pastille, reglages.couleurMarques)
  )) || palettes[0];
}

function couleursEgales(a, b) {
  return String(a || "").toLowerCase() === String(b || "").toLowerCase();
}

function creerVarianteModerne(reglages) {
  const palette = choisirPaletteVariante(reglages);
  return {
    ...reglages,
    couleur1: palette.cadre,
    couleurFondModerne: palette.fond,
    couleurRuban: palette.ruban,
    couleurBandeGauche: palette.gauche,
    couleurBandeDroite: palette.droite,
    couleurVignette: palette.vignette,
    couleurMotif: palette.motif,
    couleurTraitsModernes: palette.secondaire,
    couleurTitreFaceA: couleurTexteContraste(palette.fond),
    couleurTitreFaceB: couleurTexteContraste(palette.fond),
    couleurTitreFaceAManuelle: false,
    couleurTitreFaceBManuelle: false,
    couleurArtiste: couleurTexteContraste(palette.ruban),
    couleurMarques: couleurTexteContraste(palette.gauche),
  };
}

function choisirPaletteVariante(reglages) {
  const source = palettesVariantesModernes;
  const palettes = source.filter((palette) => (
    palette.cadre !== reglages.couleur1
    || palette.fond !== reglages.couleurFondModerne
    || palette.ruban !== reglages.couleurRuban
  ));
  return choisirAleatoire(palettes.length ? palettes : source);
}

function obtenirLignes(selection = "") {
  const filtre = parserSelections(selection);
  return vinyles
    .map((vinyle, index) => ({ vinyle, index }))
    .filter(({ index }) => !filtre.size || filtre.has(index))
    .map(({ vinyle, index }) => ({
      index,
      numeroTableau: index + 1,
      titre_face_a: vinyle.titre_face_a || "",
      titre_face_b: vinyle.titre_face_b || "",
      selection_face_a: vinyle.selection_face_a || "",
      selection_face_b: vinyle.selection_face_b || "",
      titreA: vinyle.titre_face_a || "",
      artiste: vinyle.artiste || "",
      titreB: vinyle.titre_face_b || "",
      artisteAffiche: vinyle.artiste || "",
      position: vinyle.position_jukebox || "",
    }));
}

function obtenirIndexLigneApercu(numeroEtiquette = etiquetteActive) {
  return indexApercu + (deuxiemeEtiquetteActive() && numeroEtiquette === "2" ? 1 : 0);
}

function obtenirLigneApercu(lignes, numeroEtiquette = etiquetteActive) {
  return lignes[obtenirIndexLigneApercu(numeroEtiquette)] || null;
}

function modifierTexteApercu() {
  const ligne = obtenirLigneApercu(obtenirLignes());
  const vinyle = ligne ? vinyles[ligne.index] : null;
  if (!vinyle) {
    return;
  }
  vinyle.titre_face_a = elements.texteFaceA.value;
  vinyle.artiste = elements.texteArtiste.value;
  vinyle.titre_face_b = elements.texteFaceB.value;
  sauvegarderCsvLocal();
  mettreAJour();
}

function mettreAJourEditeurTexte(ligne) {
  const champs = [elements.texteFaceA, elements.texteArtiste, elements.texteFaceB];
  champs.forEach((champ) => {
    champ.disabled = !ligne;
  });
  if (!ligne) {
    champs.forEach((champ) => {
      champ.value = "";
    });
    return;
  }
  elements.texteFaceA.value = vinyles[ligne.index]?.titre_face_a || "";
  elements.texteArtiste.value = vinyles[ligne.index]?.artiste || "";
  elements.texteFaceB.value = vinyles[ligne.index]?.titre_face_b || "";
}

function ouvrirTableauCsv() {
  const dialogue = document.createElement("dialog");
  dialogue.className = "fenetre-csv";

  const contenu = document.createElement("div");
  contenu.className = "fenetre-csv__contenu";

  const entete = document.createElement("div");
  entete.className = "fenetre-csv__entete";

  const titre = document.createElement("h2");
  titre.className = "fenetre-import__titre";
  titre.textContent = traduirePhrase("Données");

  const actions = document.createElement("div");
  actions.className = "fenetre-import__actions";

  const barre = document.createElement("div");
  barre.className = "tableau-csv__barre";

  const groupeAjout = document.createElement("div");
  groupeAjout.className = "tableau-csv__groupe tableau-csv__groupe--ajout";

  const question = document.createElement("label");
  question.className = "tableau-csv__quantite";
  question.textContent = traduirePhrase("Étiquette à ajouter");

  const quantite = document.createElement("input");
  quantite.type = "number";
  quantite.min = "1";
  quantite.max = "500";
  quantite.value = "1";

  const ajouter = document.createElement("button");
  ajouter.className = "bouton tableau-csv__bouton";
  ajouter.type = "button";
  ajouter.textContent = traduirePhrase("Ajouter");
  question.append(quantite);
  groupeAjout.append(question, ajouter);

  const groupeRecherche = document.createElement("div");
  groupeRecherche.className = "tableau-csv__groupe tableau-csv__groupe--recherche";

  const recherche = document.createElement("input");
  recherche.className = "tableau-csv__recherche";
  recherche.type = "search";
  recherche.placeholder = traduirePhrase("Rechercher");
  recherche.autocomplete = "off";
  groupeRecherche.append(recherche);

  const groupeTri = document.createElement("div");
  groupeTri.className = "tableau-csv__groupe tableau-csv__groupe--tri";

  const groupeFichiers = document.createElement("div");
  groupeFichiers.className = "tableau-csv__groupe tableau-csv__groupe--fichiers";

  const menu = document.createElement("details");
  menu.className = "tableau-csv__menu";
  menu.open = !window.matchMedia("(max-width: 640px)").matches;

  const menuResume = document.createElement("summary");
  menuResume.className = "tableau-csv__menu-resume";
  const menuResumeTexte = document.createElement("span");
  menuResumeTexte.textContent = `☰ ${traduirePhrase("Filtres")}`;
  menuResume.append(menuResumeTexte);

  const menuContenu = document.createElement("div");
  menuContenu.className = "tableau-csv__menu-contenu";

  const groupePliage = document.createElement("div");
  groupePliage.className = "tableau-csv__groupe tableau-csv__groupe--pliage";

  const info = document.createElement("p");
  info.className = "tableau-csv__info";
  info.textContent = traduirePhrase("Vos données restent sur cet ordinateur. Exportez un CSV pour les sauvegarder.");

  let triActif = null;
  const creerBoutonTri = (libelle, cle) => creerBoutonTableau("", () => {
    const direction = triActif?.cle === cle && triActif.direction === 1 ? -1 : 1;
    triActif = { cle, direction };
    trierVinyles(cle, direction);
  }, "bouton tableau-csv__bouton");
  const trierArtiste = creerBoutonTri(traduirePhrase("Artiste"), "artiste");
  const trierFaceA = creerBoutonTri(traduirePhrase("Face A"), "titre_face_a");
  const trierFaceB = creerBoutonTri(traduirePhrase("Face B"), "titre_face_b");
  const boutonsTri = [
    { bouton: trierArtiste, libelle: traduirePhrase("Artiste"), cle: "artiste" },
    { bouton: trierFaceA, libelle: traduirePhrase("Face A"), cle: "titre_face_a" },
    { bouton: trierFaceB, libelle: traduirePhrase("Face B"), cle: "titre_face_b" },
  ];
  const ordreOrigine = creerBoutonTableau(traduirePhrase("Ordre initial"), () => {
    vinyles.sort((a, b) => (a.__ordreOriginal ?? 0) - (b.__ordreOriginal ?? 0));
    triActif = null;
    finaliserChangementTableau();
  }, "bouton tableau-csv__bouton");
  groupeTri.append(trierArtiste, trierFaceA, trierFaceB, ordreOrigine);

  const importer = creerBoutonTableau(traduirePhrase("Importer"), demanderImportCsv, "bouton tableau-csv__bouton");
  importer.classList.add("tableau-csv__bouton--desktop");
  const exporter = creerBoutonTableau(traduirePhrase("Exporter"), exporterCsv, "bouton tableau-csv__bouton");
  exporter.classList.add("tableau-csv__bouton--desktop");
  const effacerTableau = () => {
    if (!window.confirm(traduirePhrase("Vider le tableau ?"))) {
      return;
    }
    vinyles = [];
    indexApercu = 0;
    triActif = null;
    finaliserChangementTableau();
  };
  const toutEffacerMobile = creerBoutonTableau(traduirePhrase("Tout effacer"), effacerTableau, "bouton bouton-secondaire tableau-csv__bouton tableau-csv__bouton--mobile");
  toutEffacerMobile.addEventListener("click", (evenement) => {
    evenement.preventDefault();
    evenement.stopPropagation();
  });
  const toutEffacerDesktop = creerBoutonTableau(traduirePhrase("Tout effacer"), effacerTableau, "bouton bouton-secondaire tableau-csv__bouton tableau-csv__bouton--desktop");
  groupeFichiers.append(importer, exporter, toutEffacerDesktop);
  menuResume.append(toutEffacerMobile);

  let cartesPliees = false;
  const basculerEtiquettes = creerBoutonTableau("", () => {
    cartesPliees = !cartesPliees;
    rendreTableauCsvActif?.();
  }, "bouton tableau-csv__bouton");
  groupePliage.append(basculerEtiquettes);
  menuContenu.append(groupeTri, groupePliage, groupeFichiers);
  menu.append(menuResume, menuContenu);

  const fermer = document.createElement("button");
  fermer.className = "bouton bouton-principal";
  fermer.type = "button";
  fermer.textContent = traduirePhrase("Fermer");

  const zone = document.createElement("div");
  zone.className = "tableau-csv";

  actions.append(fermer);
  barre.append(groupeAjout, groupeRecherche, menu);
  entete.append(titre, actions);
  contenu.append(entete, info, barre, zone);
  dialogue.append(contenu);
  document.body.append(dialogue);

  const rendre = () => {
    boutonsTri.forEach(({ bouton, libelle, cle }) => {
      const estActif = triActif?.cle === cle;
      bouton.textContent = libelle;
      bouton.setAttribute("aria-pressed", String(estActif));
    });
    ordreOrigine.disabled = vinyles.every((vinyle, index) => (
      index === 0
      || (vinyles[index - 1].__ordreOriginal ?? index - 1) <= (vinyle.__ordreOriginal ?? index)
    ));
    basculerEtiquettes.textContent = traduirePhrase(cartesPliees ? "Déplier les étiquettes" : "Plier les étiquettes");
    basculerEtiquettes.setAttribute("aria-expanded", String(!cartesPliees));
    zone.replaceChildren(creerTableCsv(recherche.value, { cartesPliees }));
  };
  rendreTableauCsvActif = rendre;

  ajouter.addEventListener("click", () => {
    const total = Math.max(1, Math.min(500, Number(quantite.value) || 1));
    const premierOrdre = vinyles.reduce(
      (maximum, entree) => Math.max(maximum, entree.__ordreOriginal ?? -1),
      -1,
    ) + 1;
    for (let i = 0; i < total; i += 1) {
      vinyles.push({
        emplacement: "jukebox",
        position_jukebox: "",
        selection_face_a: "",
        selection_face_b: "",
        artiste: "",
        titre_face_a: "",
        titre_face_b: "",
        __ordreOriginal: premierOrdre + i,
      });
    }
    finaliserChangementTableau();
  });
  recherche.addEventListener("input", rendre);
  fermer.addEventListener("click", () => dialogue.close());
  dialogue.addEventListener("close", () => {
    rendreTableauCsvActif = null;
    dialogue.remove();
  }, { once: true });
  dialogue.addEventListener("click", (evenement) => {
    if (evenement.target === dialogue) {
      dialogue.close();
    }
  });
  zone.addEventListener("input", (evenement) => {
    const numero = evenement.target.closest("[data-numero-ligne]");
    if (numero) {
      return;
    }
    const champ = evenement.target.closest("[data-csv-colonne]");
    if (!champ) {
      return;
    }
    const vinyle = vinyles[Number(champ.dataset.index)];
    if (!vinyle) {
      return;
    }
    vinyle[champ.dataset.csvColonne] = champ.value;
    sauvegarderCsvLocal();
    mettreAJour();
  });
  zone.addEventListener("change", (evenement) => {
    const numero = evenement.target.closest("[data-numero-ligne]");
    if (!numero) {
      return;
    }
    const source = Number(numero.dataset.index);
    const cible = Number(numero.value) - 1;
    if (Number.isInteger(cible) && cible >= 0 && cible < vinyles.length && cible !== source) {
      [vinyles[source], vinyles[cible]] = [vinyles[cible], vinyles[source]];
      indexApercu = cible;
      finaliserChangementTableau();
      return;
    }
    rendre();
  });
  zone.addEventListener("click", (evenement) => {
    const basculeEdition = evenement.target.closest("[data-basculer-edition-ligne]");
    if (basculeEdition) {
      const carte = basculeEdition.closest(".tableau-csv__carte");
      const champs = carte?.querySelector(".tableau-csv__carte-champs");
      if (carte && champs) {
        const estPliee = carte.classList.toggle("tableau-csv__carte--pliee");
        champs.hidden = estPliee;
        basculeEdition.textContent = estPliee ? traduirePhrase("Modifier") : traduirePhrase("Masquer");
        basculeEdition.setAttribute("aria-expanded", String(!estPliee));
      }
      return;
    }
    const deplacement = evenement.target.closest("[data-deplacer-ligne]");
    if (deplacement) {
      const source = Number(deplacement.dataset.index);
      const cible = source + Number(deplacement.dataset.deplacerLigne);
      if (Number.isInteger(source) && Number.isInteger(cible) && cible >= 0 && cible < vinyles.length) {
        [vinyles[source], vinyles[cible]] = [vinyles[cible], vinyles[source]];
        indexApercu = cible;
        finaliserChangementTableau();
      }
      return;
    }
    const bouton = evenement.target.closest("[data-supprimer-ligne]");
    if (!bouton) {
      return;
    }
    vinyles.splice(Number(bouton.dataset.index), 1);
    finaliserChangementTableau();
  });
  zone.addEventListener("dragstart", (evenement) => {
    const ligne = evenement.target.closest("[data-ligne-index]");
    if (!ligne) {
      return;
    }
    evenement.dataTransfer.setData("text/plain", ligne.dataset.ligneIndex);
    evenement.dataTransfer.effectAllowed = "move";
  });
  zone.addEventListener("dragover", (evenement) => {
    if (evenement.target.closest("[data-ligne-index]")) {
      evenement.preventDefault();
    }
  });
  zone.addEventListener("drop", (evenement) => {
    const ligne = evenement.target.closest("[data-ligne-index]");
    if (!ligne) {
      return;
    }
    evenement.preventDefault();
    const source = Number(evenement.dataTransfer.getData("text/plain"));
    const cible = Number(ligne.dataset.ligneIndex);
    if (!Number.isInteger(source) || !Number.isInteger(cible) || source === cible) {
      return;
    }
    const [deplace] = vinyles.splice(source, 1);
    vinyles.splice(cible, 0, deplace);
    indexApercu = cible;
    finaliserChangementTableau();
  });

  rendre();
  dialogue.showModal();
}

function creerBoutonTableau(texte, action, classe = "bouton") {
  const bouton = document.createElement("button");
  bouton.className = classe;
  bouton.type = "button";
  bouton.textContent = texte;
  bouton.addEventListener("click", action);
  return bouton;
}

function finaliserChangementTableau() {
  renumeroterVinyles();
  indexApercu = Math.min(indexApercu, Math.max(0, vinyles.length - 1));
  sauvegarderCsvLocal();
  rendreTableauCsvActif?.();
  mettreAJour();
}

function trierVinyles(cle, direction = 1) {
  vinyles.sort((a, b) => (
    String(a[cle] || "").localeCompare(String(b[cle] || ""), "fr", { sensitivity: "base" }) * direction
  ));
  finaliserChangementTableau();
}

function creerTableCsv(recherche = "", options = {}) {
  const fragment = document.createDocumentFragment();
  const table = document.createElement("table");
  table.className = "tableau-csv__table";
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  ["", "N°", "Artiste", "Face A", "Face B", ""].forEach((libelle) => {
    const th = document.createElement("th");
    th.textContent = libelle;
    trHead.append(th);
  });
  thead.append(trHead);
  const tbody = document.createElement("tbody");
  const filtre = recherche.trim().toLocaleLowerCase(localeCourante());
  const cartes = document.createElement("div");
  cartes.className = "tableau-csv__cartes";
  let compteurResultats = 0;
  vinyles.forEach((vinyle, index) => {
    const contenu = `${vinyle.artiste || ""} ${vinyle.titre_face_a || ""} ${vinyle.titre_face_b || ""}`.toLocaleLowerCase(localeCourante());
    if (filtre && !contenu.includes(filtre)) {
      return;
    }
    compteurResultats += 1;
    const tr = document.createElement("tr");
    tr.draggable = true;
    tr.dataset.ligneIndex = String(index);
    const tdPoignee = document.createElement("td");
    tdPoignee.className = "tableau-csv__poignee";
    tdPoignee.textContent = "↕";
    tr.append(tdPoignee);
    const tdNumero = document.createElement("td");
    tdNumero.className = "tableau-csv__numero";
    const numero = document.createElement("input");
    numero.type = "number";
    numero.min = "1";
    numero.max = String(vinyles.length);
    numero.value = String(index + 1);
    numero.dataset.numeroLigne = "1";
    numero.dataset.index = String(index);
    tdNumero.append(numero);
    tr.append(tdNumero);
    [
      ["artiste", vinyle.artiste || ""],
      ["titre_face_a", vinyle.titre_face_a || ""],
      ["titre_face_b", vinyle.titre_face_b || ""],
    ].forEach(([colonne, valeur]) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.value = valeur;
      input.dataset.index = String(index);
      input.dataset.csvColonne = colonne;
      td.append(input);
      tr.append(td);
    });
    const tdAction = document.createElement("td");
    const supprimer = document.createElement("button");
    supprimer.className = "bouton bouton-secondaire";
    supprimer.type = "button";
    supprimer.textContent = traduirePhrase("Supprimer");
    supprimer.dataset.supprimerLigne = "1";
    supprimer.dataset.index = String(index);
    tdAction.append(supprimer);
    tr.append(tdAction);
    tbody.append(tr);
    cartes.append(creerCarteCsvMobile(vinyle, index, options));
  });
  table.append(thead, tbody);
  fragment.append(table);
  if (!compteurResultats) {
    const vide = document.createElement("p");
    vide.className = "tableau-csv__vide";
    vide.textContent = traduirePhrase("Aucune ligne ne correspond à cette sélection.");
    cartes.append(vide);
  }
  fragment.append(cartes);
  return fragment;
}

function creerCarteCsvMobile(vinyle, index, options = {}) {
  const carte = document.createElement("article");
  carte.className = "tableau-csv__carte";
  if (options.cartesPliees) {
    carte.classList.add("tableau-csv__carte--pliee");
  }
  carte.dataset.ligneIndex = String(index);

  const entete = document.createElement("div");
  entete.className = "tableau-csv__carte-entete";

  const titre = document.createElement("h3");
  titre.textContent = `${traduirePhrase("Étiquette")} ${index + 1}`;

  const actions = document.createElement("div");
  actions.className = "tableau-csv__carte-actions";
  const basculeEdition = document.createElement("button");
  basculeEdition.className = "bouton tableau-csv__bouton-edition";
  basculeEdition.type = "button";
  basculeEdition.textContent = options.cartesPliees ? traduirePhrase("Modifier") : traduirePhrase("Masquer");
  basculeEdition.dataset.basculerEditionLigne = "1";
  basculeEdition.setAttribute("aria-expanded", String(!options.cartesPliees));
  actions.append(basculeEdition);
  [
    ["↑", "-1", traduirePhrase("Précédent")],
    ["↓", "1", traduirePhrase("Suivant")],
  ].forEach(([texte, delta, libelle]) => {
    const bouton = document.createElement("button");
    bouton.className = "bouton tableau-csv__mini-bouton";
    bouton.type = "button";
    bouton.textContent = texte;
    bouton.dataset.deplacerLigne = delta;
    bouton.dataset.index = String(index);
    bouton.setAttribute("aria-label", libelle);
    bouton.disabled = (delta === "-1" && index === 0) || (delta === "1" && index === vinyles.length - 1);
    actions.append(bouton);
  });
  const supprimer = document.createElement("button");
  supprimer.className = "bouton bouton-secondaire tableau-csv__mini-bouton";
  supprimer.type = "button";
  supprimer.textContent = "×";
  supprimer.dataset.supprimerLigne = "1";
  supprimer.dataset.index = String(index);
  supprimer.setAttribute("aria-label", traduirePhrase("Supprimer"));
  actions.append(supprimer);

  entete.append(titre, actions);
  carte.append(entete);

  const champs = document.createElement("div");
  champs.className = "tableau-csv__carte-champs";
  champs.hidden = Boolean(options.cartesPliees);
  [
    ["artiste", traduirePhrase("Artiste"), vinyle.artiste || ""],
    ["titre_face_a", traduirePhrase("Face A"), vinyle.titre_face_a || ""],
    ["titre_face_b", traduirePhrase("Face B"), vinyle.titre_face_b || ""],
  ].forEach(([colonne, libelle, valeur]) => {
    const label = document.createElement("label");
    label.className = "tableau-csv__champ-mobile";
    label.textContent = libelle;
    const input = document.createElement("input");
    input.type = "text";
    input.value = valeur;
    input.dataset.index = String(index);
    input.dataset.csvColonne = colonne;
    label.append(input);
    champs.append(label);
  });
  carte.append(champs);

  return carte;
}

function renumeroterVinyles() {
  vinyles.forEach((vinyle, index) => {
    vinyle.position_jukebox = String(index).padStart(index < 100 ? 2 : 3, "0");
    vinyle.selection_face_a = String(index + 100);
    vinyle.selection_face_b = String(index + 200);
  });
}

function parserSelections(texte) {
  if (/^\s*(tout|toutes|all)\s*$/i.test(String(texte || ""))) {
    return new Set();
  }
  const lignes = new Set();
  String(texte || "")
    .replace(/\bet\b/gi, ",")
    .split(/[\s,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      const plage = item.match(/^(\d{1,3})-(\d{1,3})$/);
      if (plage) {
        const debut = Number(plage[1]);
        const fin = Number(plage[2]);
        const sens = debut <= fin ? 1 : -1;
        for (let valeur = debut; sens > 0 ? valeur <= fin : valeur >= fin; valeur += sens) {
          if (valeur > 0) {
            lignes.add(valeur - 1);
          }
        }
        return;
      }

      const nombre = Number(item);
      if (Number.isInteger(nombre) && nombre > 0) {
        lignes.add(nombre - 1);
      }
    });
  return lignes;
}

function changerApercu(delta) {
  const lignes = obtenirLignes();
  if (!lignes.length) {
    return;
  }
  enregistrerReglagesActifs();
  verrouillerEtiquetteActiveAutomatiquement();
  animerChangementApercu(delta);
  if (deuxiemeEtiquetteActive()) {
    const nombrePaires = Math.ceil(lignes.length / 2);
    const paireActive = Math.floor(indexApercu / 2);
    indexApercu = ((paireActive + delta + nombrePaires) % nombrePaires) * 2;
  } else {
    indexApercu = (indexApercu + delta + lignes.length) % lignes.length;
  }
  appliquerReglagesAuFormulaire(lireReglages(etiquetteActive));
  mettreAJour();
}

function animerChangementApercu(delta) {
  const direction = delta > 0 ? "suivant" : "precedent";
  [elements.apercus, elements.editionTexte].forEach((element) => {
    element.classList.remove("is-changement-etiquette");
    element.dataset.directionChangement = direction;
  });
  window.cancelAnimationFrame(frameAnimationApercu);
  frameAnimationApercu = window.requestAnimationFrame(() => {
    [elements.apercus, elements.editionTexte].forEach((element) => {
      element.classList.add("is-changement-etiquette");
    });
  });
  clearTimeout(temporisateurAnimationApercu);
  temporisateurAnimationApercu = window.setTimeout(() => {
    [elements.apercus, elements.editionTexte].forEach((element) => {
      element.classList.remove("is-changement-etiquette");
      delete element.dataset.directionChangement;
    });
  }, 520);
}

function demarrerGesteApercu(evenement) {
  if (!MEDIA_MOBILE.matches || !modeleChoisi) {
    return;
  }
  gesteApercu = {
    x: evenement.clientX,
    y: evenement.clientY,
    temps: Date.now(),
  };
}

function terminerGesteApercu(evenement) {
  if (!gesteApercu || !MEDIA_MOBILE.matches) {
    gesteApercu = null;
    return;
  }

  const deltaX = evenement.clientX - gesteApercu.x;
  const deltaY = evenement.clientY - gesteApercu.y;
  const duree = Date.now() - gesteApercu.temps;
  gesteApercu = null;

  if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25 || duree > 900) {
    return;
  }

  ignorerProchainClicApercu = true;
  changerApercu(deltaX < 0 ? 1 : -1);
  window.setTimeout(() => {
    ignorerProchainClicApercu = false;
  }, 350);
}

function annulerGesteApercu() {
  gesteApercu = null;
}

function mettreAJour() {
  mettreAJourBoutonsHistorique();
  const lignes = obtenirLignes();
  const afficherIndicateursSwipe = modeleChoisi && lignes.length > 1;
  elements.indicateurSwipePrecedent.hidden = !afficherIndicateursSwipe;
  elements.indicateurSwipeSuivant.hidden = !afficherIndicateursSwipe;
  const deuxiemeActive = deuxiemeEtiquetteActive();
  mettreAJourVisibiliteApercu();
  if (!modeleChoisi) {
    elements.etat.textContent = traduirePhrase("En attente");
    elements.editionTexteEtat.textContent = "";
    elements.statutPlanche.textContent = "0 page";
    elements.apercu.removeAttribute("src");
    elements.apercuSecondaire.removeAttribute("src");
    elements.apercuSecondaire.hidden = true;
    elements.reglageRetourLigneTitres.hidden = true;
    mettreAJourEditeurTexte(null);
    afficherFavoris();
    ajusterHauteurPanneauOptionsMobile();
    return;
  }

  mettreAJourInterfaceConditionnelle(lireReglages(etiquetteActive));
  mettreAJourValeursRange();
  mettreAJourMessageDimensions();
  elements.selecteurEtiquette.hidden = true;
  elements.aideSelectionEtiquette.hidden = !deuxiemeActive;
  elements.changerEtiquetteMobile.hidden = !deuxiemeActive;
  elements.changerEtiquetteMobile.textContent = `${traduirePhrase("Modifier l'étiquette")} ${etiquetteActive === "1" ? "2" : "1"}`;
  elements.apercus.classList.toggle("apercus--duo", deuxiemeActive);
  elements.apercus.classList.toggle("apercus--selection", deuxiemeActive);
  elements.apercu.classList.toggle("is-selectionnee", deuxiemeActive && etiquetteActive === "1");
  elements.apercuSecondaire.classList.toggle("is-selectionnee", deuxiemeActive && etiquetteActive === "2");
  elements.apercu.toggleAttribute("aria-current", deuxiemeActive && etiquetteActive === "1");
  elements.apercuSecondaire.toggleAttribute("aria-current", deuxiemeActive && etiquetteActive === "2");
  mettreAJourVerrouillageStyle();
  [elements.apercu, elements.apercuSecondaire].forEach((image, index) => {
    if (deuxiemeActive) {
      image.setAttribute("role", "button");
      image.setAttribute("tabindex", "0");
      image.setAttribute("title", `${traduirePhrase("Modifier l'étiquette")} ${index + 1}`);
    } else {
      image.removeAttribute("role");
      image.removeAttribute("tabindex");
      image.removeAttribute("title");
      image.removeAttribute("aria-current");
    }
  });

  if (!lignes.length) {
    elements.etat.textContent = traduirePhrase("Aucune étiquette");
    elements.editionTexteEtat.textContent = "0/0";
    elements.apercu.removeAttribute("src");
    elements.apercuSecondaire.hidden = true;
    elements.reglageRetourLigneTitres.hidden = true;
    elements.statutPlanche.textContent = "0 page";
    mettreAJourEditeurTexte(null);
    afficherFavoris();
    ajusterHauteurPanneauOptionsMobile();
    return;
  }

  indexApercu = ((indexApercu % lignes.length) + lignes.length) % lignes.length;
  if (deuxiemeActive) {
    indexApercu = Math.floor(indexApercu / 2) * 2;
  }
  const lignePrincipale = obtenirLigneApercu(lignes, "1");
  const ligneSecondaire = obtenirLigneApercu(lignes, "2");
  const ligneEdition = obtenirLigneApercu(lignes);
  const reglagesPrincipaux = lireReglages("1", lignePrincipale);
  const canvasPrincipal = dessinerEtiquette(lignePrincipale, reglagesPrincipaux);
  elements.apercu.src = canvasPrincipal.toDataURL("image/png");
  const zoomApercu = obtenirZoomApercuCourant();
  appliquerTailleApercu(elements.apercu, reglagesPrincipaux, zoomApercu);
  let canvasSecondaire = null;
  if (deuxiemeActive && ligneSecondaire) {
    const reglagesSecondaires = lireReglages("2", ligneSecondaire);
    canvasSecondaire = dessinerEtiquette(ligneSecondaire, reglagesSecondaires);
    elements.apercuSecondaire.src = canvasSecondaire.toDataURL("image/png");
    appliquerTailleApercu(elements.apercuSecondaire, reglagesSecondaires, zoomApercu);
    elements.apercuSecondaire.hidden = false;
  } else {
    elements.apercuSecondaire.hidden = true;
    elements.apercuSecondaire.removeAttribute("src");
  }
  const canvasEtiquetteActive = etiquetteActive === "2" && canvasSecondaire
    ? canvasSecondaire
    : canvasPrincipal;
  synchroniserControleZoomApercu(zoomApercu);
  elements.reglageRetourLigneTitres.hidden = canvasEtiquetteActive.dataset.retourLigneTitresPossible !== "true";
  elements.etat.textContent = MEDIA_MOBILE.matches
    ? ""
    : `${traduirePhrase("Étiquette")} ${ligneEdition?.numeroTableau || lignePrincipale.numeroTableau} ${traduirePhrase("sur")} ${lignes.length}`;
  elements.editionTexteEtat.textContent = `${ligneEdition?.numeroTableau || lignePrincipale.numeroTableau}/${lignes.length}`;
  mettreAJourEditeurTexte(ligneEdition);
  mettreAJourStatutCsv("CSV actif");
  const disposition = calculerDispositionImpression(lireReglages(etiquetteActive));
  const pages = disposition.etiquettesParPage ? Math.max(1, Math.ceil(lignes.length / disposition.etiquettesParPage)) : 0;
  elements.statutPlanche.textContent = `${pages} ${traduirePhrase(pages > 1 ? "pages" : "page")} A4`;
  afficherFavoris();
  ajusterHauteurPanneauOptionsMobile();
}

function mettreAJourVisibiliteApercu() {
  elements.accueilApercu.hidden = modeleChoisi;
  elements.sceneEntete.hidden = !modeleChoisi;
  elements.actionsApercu.hidden = !modeleChoisi;
  elements.apercus.hidden = !modeleChoisi;
  elements.navigationApercu.hidden = !modeleChoisi;
  elements.basculerEditionTexteMobile.hidden = !modeleChoisi;
  elements.editionTexte.hidden = !modeleChoisi;
}

function appliquerTailleApercu(image, reglages, pourcentage = obtenirZoomApercuCourant()) {
  const pixelsParMm = PIXELS_CSS_PAR_MM * pourcentage / 100;
  image.style.width = `${reglages.largeurEtiquette * pixelsParMm}px`;
  image.style.height = `${reglages.hauteurEtiquette * pixelsParMm}px`;
}

function mettreAJourMessageDimensions() {
  const messages = Object.entries(LIMITES_DIMENSIONS)
    .filter(([cle]) => champDimensionHorsLimites(elements[cle], cle))
    .map(([cle, limites]) => limites.message);

  elements.messageDimensions.hidden = messages.length === 0;
  elements.messageDimensions.textContent = messages.join(" ");
  Object.keys(LIMITES_DIMENSIONS).forEach((cle) => {
    elements[cle].classList.toggle("champ-invalide", champDimensionHorsLimites(elements[cle], cle));
  });
}

function champDimensionHorsLimites(element, cle) {
  const limites = LIMITES_DIMENSIONS[cle];
  const valeur = Number(String(element?.value || "").replace(",", "."));
  return Number.isFinite(valeur) && (valeur < limites.min || valeur > limites.max);
}

function mettreAJourInterfaceConditionnelle(reglages) {
  const modele = reglages.modele;
  const capacites = capacitesModeles[modele] || {};
  const appliquerVisibiliteModele = () => elements.champsModele.forEach((champ) => {
    const modelesVisibles = String(champ.dataset.modeleVisible || "").split(/\s+/);
    champ.classList.toggle("champ-masque", !modelesVisibles.includes(modele));
  });
  appliquerVisibiliteModele();
  elements.champsMasquesModele.forEach((champ) => {
    champ.classList.toggle("champ-masque", champ.dataset.modeleMasque === modele);
  });
  elements.champsCapaciteModele.forEach((champ) => {
    const capacite = champ.dataset.capaciteModele;
    champ.classList.toggle("champ-masque", !capacites[capacite]);
  });
  const masquerGroupeMarques = !capacites.marques;
  elements.groupeMarques.dataset.modeleDisabled = String(masquerGroupeMarques);
  elements.groupeMarques.dataset.tabDisabled = String(masquerGroupeMarques);
  if (masquerGroupeMarques && etapeReglageActive === "cote") {
    activerEtapeReglage("texte", { conserverEditionTexteMobile: true });
  } else {
    activerEtapeReglage(etapeReglageActive, { conserverEditionTexteMobile: true });
  }
  if (!masquerGroupeMarques) {
    elements.reglagesMarques.forEach((champ) => {
      champ.classList.toggle("champ-masque", !reglages.afficherMarques);
    });
    elements.reglagesMarquesCommuns.forEach((champ) => {
      champ.classList.toggle("champ-masque", !reglages.afficherMarques || !reglages.synchroniserMarques);
    });
    elements.reglagesMarquesSepares.forEach((champ) => {
      champ.hidden = !reglages.afficherMarques || reglages.synchroniserMarques;
    });
  }
  appliquerVisibiliteModele();
  elements.reglagesEtoiles.forEach((champ) => {
    champ.classList.toggle("champ-masque", modele !== "STELLA" || !reglages.afficherEtoiles);
  });
  elements.reglageCourbureEtoiles.classList.toggle(
    "champ-masque",
    modele !== "STELLA" || !reglages.afficherEtoiles || reglages.dispositionEtoiles === "droite",
  );
  elements.reglageArrondiBordure.classList.toggle(
    "champ-masque",
    modele === "JEAN" || !reglages.bordureHorizontale || !reglages.bordureVerticale,
  );
  const motifActif = elements.activerMotif.checked;
  const vignettageActif = elements.activerVignettage.checked;
  const patineActive = elements.activerPatine.checked;
  const panelDecor = elements.decorPanel.value || "motif";
  elements.reglagesDecor.forEach((champ) => {
    const panel = champ.dataset.decorPanel;
    champ.classList.toggle(
      "champ-masque",
      panel !== panelDecor
        || (panel === "motif" && !motifActif)
        || (panel === "vignette" && !vignettageActif)
        || (panel === "patine" && !patineActive && panelDecor !== "patine"),
    );
  });
  elements.reglagesMotif.forEach((champ) => {
    champ.classList.toggle(
      "champ-masque",
      panelDecor !== "motif"
        || !motifActif
        || !reglages.motifFond
        || reglages.motifType === "aucun",
    );
  });
  elements.reglagesMotifRuban.forEach((champ) => {
    champ.classList.toggle(
      "champ-masque",
      panelDecor !== "motif" || !motifActif || !reglages.motifRuban,
    );
  });
  elements.reglagesMotifRubanDetails.forEach((champ) => {
    champ.classList.toggle(
      "champ-masque",
      panelDecor !== "motif"
        || !motifActif
        || !reglages.motifRuban
        || reglages.motifRubanType === "aucun",
    );
  });
  elements.reglagesTraitsModernes.forEach((champ) => {
    champ.classList.toggle(
      "champ-masque",
      panelDecor !== "motif" || !motifActif || !reglages.afficherTraitsModernes,
    );
  });
  elements.reglagesVignette.forEach((champ) => {
    champ.classList.toggle(
      "champ-masque",
      panelDecor !== "vignette" || !vignettageActif || reglages.modeVignette === "aucun",
    );
  });
  elements.reglagesDeplacementTextes.hidden = !reglages.deplacementTextesManuel;
  mettreAJourReglagesTexteMiseEnPage();
  mettreAJourPanneauxSelonContenu();
}

function mettreAJourPanneauxSelonContenu() {
  const panneauxToujoursUtiles = new Set(["style", "reglages", "donnees", "texte", "ruban", "decor", "favoris"]);
  elements.panneauxReglages.forEach((panneau) => {
    if (panneauxToujoursUtiles.has(panneau.dataset.tabPanel)) {
      panneau.dataset.tabDisabled = "false";
      return;
    }
    const modeleDesactive = panneau.dataset.modeleDisabled === "true";
    const controlesVisibles = panneau.querySelectorAll(
      ".champ:not(.champ-masque), .marques-activation:not(.champ-masque), .bloc-fichier:not(.champ-masque), .favoris__liste",
    );
    const panneauInutile = modeleDesactive || controlesVisibles.length === 0;
    panneau.dataset.tabDisabled = String(panneauInutile);
  });
  const panneauActif = Array.from(elements.panneauxReglages).find((panneau) => panneau.dataset.tabPanel === etapeReglageActive);
  if (panneauActif?.dataset.tabDisabled === "true") {
    activerEtapeReglage("texte", { conserverEditionTexteMobile: true });
  }
}

function mettreAJourValeursRange() {
  elements.valeursRange.forEach((valeur) => {
    const cle = valeur.dataset.rangeValue;
    const input = elements[cle];
    if (!input) {
      return;
    }
    valeur.textContent = formaterValeurRange(cle, input.value, valeur.dataset.rangeUnit);
    const minimum = Number(input.min || 0);
    const maximum = Number(input.max || 100);
    const progression = maximum > minimum ? ((Number(input.value) - minimum) / (maximum - minimum)) * 100 : 0;
    input.style.setProperty("--range-progression", `${Math.max(0, Math.min(100, progression))}%`);
  });
}

function formaterValeurRange(cle, valeur, unite) {
  const nombre = Number(valeur);
  if (cle === "nombreEtoiles") {
    return String(Math.round(nombre));
  }
  if (/^decalage(?:Titre[AB]|Artiste)[XY]$/.test(cle)) {
    if (nombre === 0) {
      return "0%";
    }
    const horizontal = cle.endsWith("X");
    const direction = horizontal
      ? (nombre < 0 ? "←" : "→")
      : (nombre < 0 ? "↑" : "↓");
    return `${direction} ${Math.abs(nombre)}%`;
  }
  const limiteSurregime = {
    tailleTitres: LIMITE_TAILLE_TITRES,
    tailleArtiste: LIMITE_TAILLE_ARTISTE,
  }[cle];
  if (limiteSurregime && nombre > limiteSurregime) {
    const espacement = Math.round(((nombre - limiteSurregime) / 40) * 100);
    return `${limiteSurregime}% · ${traduirePhrase("écart")} +${espacement}%`;
  }
  if (cle.toLowerCase().startsWith("angle")) {
    return `${nombre}°`;
  }
  return `${nombre}${unite || "%"}`;
}

function convertirTailleTrianglesEnCurseur(valeur) {
  const taille = Math.max(6, Math.min(24, Number(valeur) || 11));
  return Math.round(((taille - 6) / 18) * 100);
}

function convertirCurseurEnTailleTriangles(valeur) {
  const curseur = Math.max(0, Math.min(100, Number(valeur) || 0));
  return 6 + (curseur / 100) * 18;
}

function normaliserTailleTrianglesPourSignature(reglages) {
  if (reglages.modele !== "JEAN") {
    return reglages.tailleTrianglesJEAN;
  }
  return convertirCurseurEnTailleTriangles(convertirTailleTrianglesEnCurseur(reglages.tailleTrianglesJEAN));
}


function imprimer() {
  enregistrerReglagesActifs();
  const lignes = obtenirLignes();
  if (!lignes.length) {
    elements.etat.textContent = traduirePhrase("Aucune étiquette à imprimer");
    return;
  }
  ouvrirDialogueImpression(lignes);
}

function ouvrirDialogueImpression(lignes) {
  const dialogue = document.createElement("dialog");
  dialogue.className = "fenetre-impression";

  const contenu = document.createElement("form");
  contenu.className = "fenetre-impression__contenu";
  contenu.method = "dialog";

  const entete = document.createElement("div");
  entete.className = "fenetre-impression__entete";

  const titre = document.createElement("h2");
  titre.className = "fenetre-import__titre";
  titre.textContent = traduirePhrase("Impression des étiquettes");

  const fermer = document.createElement("button");
  fermer.className = "bouton bouton-secondaire";
  fermer.type = "button";
  fermer.textContent = traduirePhrase("Fermer");

  entete.append(titre, fermer);

  const soutien = document.createElement("div");
  soutien.className = "soutien-impression";
  const soutienTexte = document.createElement("p");
  soutienTexte.textContent = traduirePhrase("Un petit coup de pouce ? 45'O'Juke est gratuit et créé par passion. Si le site vous plaît, vous pouvez laisser une petite participation libre pour aider à son amélioration.");
  const soutienAide = document.createElement("p");
  soutienAide.className = "soutien-impression__aide";
  soutienAide.textContent = traduirePhrase("Choisissez une participation pour continuer ensuite l'impression, ou poursuivez gratuitement.");
  const soutienActions = document.createElement("div");
  soutienActions.className = "fenetre-import__actions";
  const participer = document.createElement("button");
  participer.className = "bouton bouton-secondaire";
  participer.type = "button";
  participer.textContent = traduirePhrase("Faire une participation libre");
  const continuer = document.createElement("button");
  continuer.className = "bouton bouton-principal";
  continuer.type = "button";
  continuer.textContent = traduirePhrase("Continuer gratuitement");
  soutienActions.append(participer, continuer);
  soutien.append(soutienTexte, soutienAide, soutienActions);

  const options = document.createElement("div");
  options.className = "sortie-etiquettes";
  options.hidden = true;

  const selection = document.createElement("fieldset");
  selection.className = "sortie-section";
  const selectionTitre = document.createElement("legend");
  selectionTitre.textContent = traduirePhrase("Étiquettes à sortir");
  selectionTitre.append(creerAideDynamique("Étiquettes à sortir"));
  selection.append(selectionTitre);

  const choixSelection = document.createElement("div");
  choixSelection.className = "sortie-choix";

  const ligneActive = lignes[indexApercu] || lignes[0];
  const creerRadioSelection = (valeur, nom, detail, checked = false) => {
    const label = document.createElement("label");
    label.className = "sortie-radio";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "selectionImpression";
    radio.value = valeur;
    radio.checked = checked;
    const texte = document.createElement("span");
    texte.className = "sortie-radio__texte";
    const titreRadio = document.createElement("strong");
    titreRadio.textContent = nom;
    const detailRadio = document.createElement("small");
    detailRadio.textContent = detail;
    texte.append(titreRadio, detailRadio);
    label.append(radio, texte);
    return label;
  };

  choixSelection.append(
    creerRadioSelection("tout", traduirePhrase("Toutes les étiquettes"), `${lignes.length} ${traduirePhrase("Lignes").toLocaleLowerCase(localeCourante())}`, true),
    creerRadioSelection("active", traduirePhrase("Étiquette affichée"), `${traduirePhrase("Lignes")} ${ligneActive.numeroTableau}`),
    creerRadioSelection("choix", traduirePhrase("Choisir des lignes"), traduirePhrase("Ex. 3 ou 3-8")),
  );

  const personnalise = document.createElement("div");
  personnalise.className = "impression-personnalisee";
  personnalise.hidden = true;

  const label = document.createElement("label");
  label.className = "impression-selection-libre";
  label.textContent = traduirePhrase("Lignes");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = traduirePhrase("Ex. 3 ou 3-8");
  input.inputMode = "numeric";

  const liste = document.createElement("div");
  liste.className = "impression-liste-lignes";
  lignes.forEach((ligne) => {
    const item = document.createElement("label");
    item.className = "impression-ligne";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = String(ligne.numeroTableau);
    const texte = document.createElement("span");
    const titreLigne = [ligne.artiste, ligne.titre_face_a].filter(Boolean).join(" - ") || `${traduirePhrase("Lignes")} ${ligne.numeroTableau}`;
    texte.textContent = `${ligne.numeroTableau}. ${titreLigne}`;
    item.append(checkbox, texte);
    liste.append(item);
  });

  const aide = document.createElement("p");
  aide.className = "impression-personnalisee__aide";
  aide.textContent = traduirePhrase("Indiquez un numéro, une plage ou cochez des lignes.");

  const message = document.createElement("p");
  message.className = "message-validation";
  message.hidden = true;

  label.append(input);
  personnalise.append(label, liste, aide, message);
  selection.append(choixSelection, personnalise);

  const optionsSortie = document.createElement("fieldset");
  optionsSortie.className = "sortie-section sortie-section--options";
  const optionsTitre = document.createElement("legend");
  optionsTitre.textContent = traduirePhrase("Options");

  const vierges = document.createElement("label");
  vierges.className = "sortie-option";
  const viergesInput = document.createElement("input");
  viergesInput.type = "checkbox";
  const viergesTexte = document.createElement("span");
  const viergesNom = document.createElement("strong");
  viergesNom.textContent = traduirePhrase("Étiquettes vierges");
  viergesNom.append(creerAideDynamique("Étiquettes vierges"));
  const viergesDetail = document.createElement("small");
  viergesDetail.textContent = traduirePhrase("Imprime le style sans artiste ni titres.");
  viergesTexte.append(viergesNom, viergesDetail);
  vierges.append(viergesInput, viergesTexte);
  optionsSortie.append(optionsTitre, vierges);

  const actionsSortie = document.createElement("div");
  actionsSortie.className = "sortie-actions";

  const boutonImpression = document.createElement("button");
  boutonImpression.className = "bouton bouton-principal";
  boutonImpression.type = "button";
  boutonImpression.textContent = traduirePhrase("Télécharger PDF");

  const blocImpression = document.createElement("div");
  blocImpression.className = "sortie-action";
  const enteteImpression = document.createElement("div");
  enteteImpression.className = "sortie-action__entete";
  enteteImpression.append(boutonImpression);
  blocImpression.append(enteteImpression);

  actionsSortie.append(blocImpression);
  options.append(selection, optionsSortie, actionsSortie);

  const afficherOptions = () => {
    soutien.hidden = true;
    options.hidden = false;
  };

  const selectionnerLignes = () => {
    const mode = options.querySelector('input[name="selectionImpression"]:checked')?.value || "tout";
    if (mode === "tout") {
      return lignes;
    }
    if (mode === "active") {
      return [ligneActive];
    }
    const cochees = Array.from(liste.querySelectorAll("input:checked")).map((item) => item.value).join(",");
    const saisie = [input.value, cochees].filter((valeur) => valeur.trim()).join(",");
    return obtenirLignes(saisie);
  };

  const afficherMessageSelection = () => {
    message.hidden = false;
    message.textContent = traduirePhrase("Aucune ligne ne correspond à cette sélection.");
    input.focus();
  };

  const executerSortie = async () => {
    const selectionLignes = selectionnerLignes();
    if (!selectionLignes.length) {
      afficherMessageSelection();
      return;
    }
    const libelleInitial = boutonImpression.textContent;
    boutonImpression.disabled = true;
    boutonImpression.textContent = traduirePhrase("Préparation...");
    envoyerJsonStyle("pdf_downloaded", creerPayloadJsonStyle());
    const lignesSortie = preparerLignesSortie(selectionLignes, { vierges: viergesInput.checked });
    await attendreRenduInterface();
    try {
      await telechargerPdf(lignesSortie);
      dialogue.close();
    } catch {
      message.hidden = false;
      message.textContent = traduirePhrase("Impossible de générer le PDF.");
      boutonImpression.disabled = false;
      boutonImpression.textContent = libelleInitial;
    }
  };

  participer.addEventListener("click", () => {
    ouvrirSoutien({ onParticipation: afficherOptions });
  });
  continuer.addEventListener("click", afficherOptions);
  choixSelection.addEventListener("change", () => {
    personnalise.hidden = options.querySelector('input[name="selectionImpression"]:checked')?.value !== "choix";
    message.hidden = true;
    if (!personnalise.hidden) {
      input.focus();
    }
  });
  boutonImpression.addEventListener("click", executerSortie);

  contenu.append(entete, soutien, options);
  dialogue.append(contenu);
  document.body.append(dialogue);

  fermer.addEventListener("click", () => dialogue.close());
  dialogue.addEventListener("close", () => dialogue.remove(), { once: true });
  dialogue.addEventListener("click", (evenement) => {
    if (evenement.target === dialogue) {
      dialogue.close();
    }
  });
  dialogue.showModal();
}

function telechargerPdf(lignes) {
  return telechargerPdfModule(lignes, { deuxiemeEtiquetteActive, lireReglages });
}

function attendreRenduInterface() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}
