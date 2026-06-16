import { couleurLisible, couleurTexteContraste, dessinerEtiquette } from "./etiquettes.js";
import {
  capacitesModeles,
  combosSurprise,
  modelesParTheme,
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
  ECART_MM,
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

const EMAIL_CONTACT = "contact45ojuke@gmail.com";
const LIEN_FACEBOOK_CONTACT = "https://www.facebook.com/45.O.Juke/";
const CLE_POSITION_FOND_INTRO = "45ojuke.positionFondIntro.v2";
const MEDIA_MOBILE = window.matchMedia("(max-width: 860px)");

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
  bandeauRestauration: document.querySelector("#bandeauRestauration"),
  dateRestauration: document.querySelector("#dateRestauration"),
  restaurerReglagesAuto: document.querySelector("#restaurerReglagesAuto"),
  ignorerReglagesAuto: document.querySelector("#ignorerReglagesAuto"),
  formulaire: document.querySelector("#formulaire"),
  assistantReglages: document.querySelector("#assistantReglages"),
  assistantEtape: document.querySelector("#assistantEtape"),
  assistantTitre: document.querySelector("#assistantTitre"),
  assistantAide: document.querySelector("#assistantAide"),
  assistantNavigation: document.querySelector("#assistantNavigation"),
  assistantPrecedent: document.querySelector("#assistantPrecedent"),
  assistantSuivant: document.querySelector("#assistantSuivant"),
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
  apercu: document.querySelector("#apercu"),
  apercuSecondaire: document.querySelector("#apercuSecondaire"),
  apercus: document.querySelector(".apercus"),
  navigationApercu: document.querySelector("#navigationApercu"),
  editionTexte: document.querySelector("#editionTexte"),
  editionTexteEtat: document.querySelector("#editionTexteEtat"),
  editionTextePrecedent: document.querySelector("#editionTextePrecedent"),
  editionTexteSuivant: document.querySelector("#editionTexteSuivant"),
  aideSwipeMobile: document.querySelector("#aideSwipeMobile"),
  basculerEditionTexteMobile: document.querySelector("#basculerEditionTexteMobile"),
  aideSelectionEtiquette: document.querySelector("#aideSelectionEtiquette"),
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
  couleurTitres: document.querySelector("#couleurTitres"),
  couleurArtiste: document.querySelector("#couleurArtiste"),
  decorPanel: document.querySelector("#decorPanel"),
  activerMotif: document.querySelector("#activerMotif"),
  activerVignettage: document.querySelector("#activerVignettage"),
  boutonMotif: document.querySelector("#boutonMotif"),
  boutonVignettage: document.querySelector("#boutonVignettage"),
  boutonPapierVieilli: document.querySelector("#boutonPapierVieilli"),
  angle: document.querySelector("#angle"),
  intensite: document.querySelector("#intensite"),
  motifType: document.querySelector("#motifType"),
  couleurMotif: document.querySelector("#couleurMotif"),
  motif: document.querySelector("#motif"),
  angleMotif: document.querySelector("#angleMotif"),
  afficherTraitsModernes: document.querySelector("#afficherTraitsModernes"),
  motifTraitsModernes: document.querySelector("#motifTraitsModernes"),
  couleurTraitsModernes: document.querySelector("#couleurTraitsModernes"),
  opaciteTraitsModernes: document.querySelector("#opaciteTraitsModernes"),
  angleTraitsModernes: document.querySelector("#angleTraitsModernes"),
  modeVignette: document.querySelector("#modeVignette"),
  vignette: document.querySelector("#vignette"),
  papierVieilli: document.querySelector("#papierVieilli"),
  couleurPapierVieilli: document.querySelector("#couleurPapierVieilli"),
  jaunissementPapier: document.querySelector("#jaunissementPapier"),
  froissagePapier: document.querySelector("#froissagePapier"),
  imperfectionsPapier: document.querySelector("#imperfectionsPapier"),
  usureBordsPapier: document.querySelector("#usureBordsPapier"),
  bordure: document.querySelector("#bordure"),
  arrondiInterieurBordure: document.querySelector("#arrondiInterieurBordure"),
  largeurRuban: document.querySelector("#largeurRuban"),
  hauteurRuban: document.querySelector("#hauteurRuban"),
  hauteurBande: document.querySelector("#hauteurBande"),
  epaisseurTraitsLeon: document.querySelector("#epaisseurTraitsLeon"),
  positionTraitsLeon: document.querySelector("#positionTraitsLeon"),
  ecartTraitsLeon: document.querySelector("#ecartTraitsLeon"),
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
  decalageRetro: document.querySelector("#decalageRetro"),
  afficherMarques: document.querySelector("#afficherMarques"),
  groupeMarques: document.querySelector("#groupeMarques"),
  reglagesMarques: document.querySelectorAll("[data-marque-reglage]"),
  reglagesDecor: document.querySelectorAll("[data-decor-panel]"),
  reglagesMotif: document.querySelectorAll("[data-motif-reglage]"),
  reglagesTraitsModernes: document.querySelectorAll("[data-traits-modernes-reglage]"),
  reglagesVignette: document.querySelectorAll("[data-vignette-reglage]"),
  reglagesPapier: document.querySelectorAll("[data-papier-reglage]"),
  champsModele: document.querySelectorAll("[data-modele-visible]"),
  champsMasquesModele: document.querySelectorAll("[data-modele-masque]"),
  champsCapaciteModele: document.querySelectorAll("[data-capacite-modele]"),
  valeursRange: document.querySelectorAll("[data-range-value]"),
  presetMarques: document.querySelector("#presetMarques"),
  couleurMarques: document.querySelector("#couleurMarques"),
  formePastille: document.querySelector("#formePastille"),
  diametrePastille: document.querySelector("#diametrePastille"),
  marqueGauche: document.querySelector("#marqueGauche"),
  marqueDroite: document.querySelector("#marqueDroite"),
  policeMarques: document.querySelector("#policeMarques"),
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
  surprise: document.querySelector("#surprise"),
  inverser: document.querySelector("#inverser"),
  precedent: document.querySelector("#precedent"),
  suivant: document.querySelector("#suivant"),
  etat: document.querySelector("#etat"),
  statutPlanche: document.querySelector("#statutPlanche"),
};

let vinyles = [];
let indexApercu = 0;
let etiquetteActive = "1";
let modeleChoisi = false;
let chargementReglages = false;
let temporisateurRedimensionnement = null;
let temporisateurAnimationApercu = null;
let frameAnimationApercu = null;
let gesteApercu = null;
let ignorerProchainClicApercu = false;
let etapeReglageActive = "style";
const reglagesParEtiquette = {
  1: null,
  2: null,
};
const signaturesSurpriseRecentes = [];
const modelesAccueilMelanges = new Map();
const MAX_MODELES_ACCUEIL_AVEC_TEASER = Math.max(1, MAX_MODELES_ACCUEIL - 1);
let pageModelesSecondaires = 0;
let pageAccueilModeles = 0;
let rendreTableauCsvActif = null;
let ordreOriginalVinyles = [];
let langueActive = lireLangueMemorisee() || document.documentElement.lang || "fr";
let bulleAideActive = null;
let favorisOuverts = false;
let invitationInstallation = null;
let dernierToucherZoom = 0;
const LIMITE_HISTORIQUE_REGLAGES = 40;
const historiqueReglages = {
  annulations: [],
  retablissements: [],
  instantanesControle: new WeakMap(),
  restaurationEnCours: false,
};

initialiser();

async function initialiser() {
  desactiverServiceWorkerEtCaches();
  appliquerLangueSite(langueActive, { memoriser: false });
  document.body.classList.add("is-accueil-selection");
  appliquerDimensionsEtiquetteDefaut();
  remplirPolicesTextesLateraux();
  remplirModelesTheme();
  synchroniserOptionsMotifSecondaire();
  appliquerReglagesAuFormulaire({ ...presets.alice, theme: "tout" });
  reglagesParEtiquette[1] = lireReglagesFormulaire();
  brancherEvenements();
  installerAidesOptions();
  mettreAJourBoutonsInstallation(true);
  proposerRestaurationReglagesAutomatiques();
  await chargerBibliotheque();
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
  brancherBandeauRestauration();
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
  brancherInteractionCurseursTactiles();
  elements.formulaire.addEventListener("input", (evenement) => {
    if (chargementReglages) {
      return;
    }
    enregistrerHistoriqueDepuisControle(evenement.target);
    desactiverLimiteMarquesSurpriseSiModificationManuelle(evenement.target);
    if (evenement.target.closest("[data-marque-commun]")) {
      synchroniserValeursMarquesDepuisCommun();
    }
    enregistrerReglagesActifs();
    mettreAJour();
  });
  elements.formulaire.addEventListener("change", (evenement) => {
    if (chargementReglages) {
      return;
    }
    enregistrerHistoriqueDepuisControle(evenement.target);
    desactiverLimiteMarquesSurpriseSiModificationManuelle(evenement.target);
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
  elements.boutonPapierVieilli.addEventListener("click", () => basculerDecor("papier"));
  elements.afficherTraitsModernes.addEventListener("change", () => {
    enregistrerReglagesActifs();
    mettreAJourInterfaceConditionnelle(lireReglagesFormulaire());
    mettreAJour();
  });
  elements.modifierTextesMiseEnPage.addEventListener("change", () => {
    mettreAJourReglagesTexteMiseEnPage();
    mettreAJourInterfaceConditionnelle(lireReglagesFormulaire());
  });
  elements.motifType.addEventListener("change", ajusterMotifVisible);
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
  elements.surprise.addEventListener("click", melanger);
  elements.inverser.addEventListener("click", inverserStyle);
  elements.annulerReglage.addEventListener("click", annulerDerniereModification);
  elements.retablirReglage.addEventListener("click", retablirModification);
  elements.copierReglagesFavoris.addEventListener("click", copierReglages);
  elements.copierReglagesDonnees.addEventListener("click", copierReglages);
  elements.importerReglagesFavoris.addEventListener("click", importerReglages);
  elements.importerStyleDonnees.addEventListener("click", importerReglages);
  elements.importStyleFile.addEventListener("change", importerReglagesDepuisFichier);
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
  elements.ouvrirFavoris.addEventListener("click", ouvrirListeFavoris);
  elements.listeFavoris.addEventListener("click", gererActionFavori);
  elements.precedent.addEventListener("click", () => changerApercu(-1));
  elements.suivant.addEventListener("click", () => changerApercu(1));
  elements.editionTextePrecedent.addEventListener("click", () => changerApercu(-1));
  elements.editionTexteSuivant.addEventListener("click", () => changerApercu(1));
  elements.aideSwipeMobile.addEventListener("click", () => afficherBulleAide(elements.aideSwipeMobile));
  elements.basculerEditionTexteMobile.addEventListener("click", basculerEditionTexteMobile);
  elements.imprimer.addEventListener("click", imprimer);
  elements.ouvrirSoutien.addEventListener("click", ouvrirSoutien);
  elements.ouvrirSoutienMenu.addEventListener("click", ouvrirSoutien);
  elements.installerApp.addEventListener("click", installerApplication);
  elements.installerAppMenu.addEventListener("click", installerApplication);
  elements.apercu.addEventListener("click", () => selectionnerEtiquetteDepuisApercu("1"));
  elements.apercuSecondaire.addEventListener("click", () => selectionnerEtiquetteDepuisApercu("2"));
  elements.apercus.addEventListener("pointerdown", demarrerGesteApercu);
  elements.apercus.addEventListener("pointerup", terminerGesteApercu);
  elements.apercus.addEventListener("pointercancel", annulerGesteApercu);
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
      placerMenuActionsMobile();
      placerEditeurTexteMobile(document.body.classList.contains("is-edition-texte-mobile"));
      ajusterHauteurPanneauOptionsMobile();
      mettreAJour();
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

function brancherBandeauRestauration() {
  elements.restaurerReglagesAuto.addEventListener("click", restaurerReglagesAutomatiques);
  elements.ignorerReglagesAuto.addEventListener("click", () => {
    supprimerReglagesAutomatiques();
    masquerBandeauRestauration();
  });
}

function proposerRestaurationReglagesAutomatiques() {
  const sauvegarde = lireSauvegardeReglagesAutomatiques();
  if (!sauvegarde) {
    return;
  }

  const date = new Date(sauvegarde.sauvegardeLe);
  elements.dateRestauration.textContent = Number.isNaN(date.getTime())
    ? traduirePhrase("Vous pouvez restaurer votre dernière configuration.")
    : `${traduirePhrase("Dernière sauvegarde")} : ${date.toLocaleString(localeCourante(), { dateStyle: "short", timeStyle: "short" })}.`;
  elements.bandeauRestauration.hidden = false;
  document.body.classList.add("is-restauration-visible");
}

function restaurerReglagesAutomatiques() {
  const sauvegarde = lireSauvegardeReglagesAutomatiques();
  if (!sauvegarde) {
    masquerBandeauRestauration();
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
    masquerBandeauRestauration();
  } catch (erreur) {
    supprimerReglagesAutomatiques();
    masquerBandeauRestauration();
    window.alert(erreur.message || traduirePhrase("Impossible de restaurer les réglages sauvegardés."));
  }
}

function masquerBandeauRestauration() {
  elements.bandeauRestauration.hidden = true;
  document.body.classList.remove("is-restauration-visible");
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
    const reglagesActifs = lireReglagesFormulaire();
    const payload = {
      version: 1,
      sauvegardeLe: new Date().toISOString(),
      etiquetteActive,
      deuxiemeEtiquetteActive: deuxiemeEtiquetteActive(),
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
  installerFondIntroMobile();
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
  elements.fermerAPropos.addEventListener("click", fermerAPropos);
  elements.aboutModal.addEventListener("click", (evenement) => {
    if (evenement.target === elements.aboutModal) {
      fermerAPropos();
    }
  });
  elements.aboutModal.addEventListener("cancel", (evenement) => {
    evenement.preventDefault();
    fermerAPropos();
  });
  document.addEventListener("keydown", (evenement) => {
    if (evenement.key === "Escape") {
      fermerMenuActionsMobile();
    }
    if (evenement.key === "Escape" && elements.aboutModal.open) {
      fermerAPropos();
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
      const cle = noeud.__cleI18n || texte;
      return phrasesInterface[cle] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const noeuds = [];
  while (walker.nextNode()) {
    noeuds.push(walker.currentNode);
  }
  noeuds.forEach((noeud) => {
    const cle = noeud.__cleI18n || noeud.textContent.trim();
    noeud.__cleI18n = cle;
    const traduction = langueActive === "fr" ? cle : phrasesInterface[cle]?.[langueActive] || cle;
    const prefixe = noeud.textContent.match(/^\s*/)?.[0] || "";
    const suffixe = noeud.textContent.match(/\s*$/)?.[0] || "";
    noeud.textContent = `${prefixe}${traduction}${suffixe}`;
  });
}

function traduireAttributsVisibles() {
  document.querySelectorAll("[aria-label], [title], [alt], [placeholder]").forEach((element) => {
    ["aria-label", "title", "alt", "placeholder"].forEach((attribut) => {
      if (!element.hasAttribute(attribut)) {
        return;
      }
      const valeur = element.getAttribute(attribut);
      const cle = element.dataset[`cleI18n${attribut.replace(/(^|-)([a-z])/g, (_, __, lettre) => lettre.toUpperCase())}`] || valeur;
      if (!cle || !phrasesInterface[cle]) {
        return;
      }
      element.dataset[`cleI18n${attribut.replace(/(^|-)([a-z])/g, (_, __, lettre) => lettre.toUpperCase())}`] = cle;
      element.setAttribute(attribut, langueActive === "fr" ? cle : phrasesInterface[cle]?.[langueActive] || cle);
    });
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
  if (etape === "texte" && !["Effet rétro sur les titres", "Désalignement rétro"].includes(cle)) {
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
    ? "45'O'Juke - Étiquettes jukebox personnalisées"
    : phrasesInterface["45'O'Juke - Étiquettes jukebox personnalisées"][langueActive];
  elements.titreIntro.textContent = titre;
  elements.sousTitreIntro.textContent = sousTitre;
  elements.boutonCommencer.textContent = bouton;
  definirTexteElement(".accueil-apercu__surtitre", `${traduire("step")} 1`);
  definirTexteElement(".accueil-apercu h2", traduire("styleTitle"));
  definirTexteElement(".accueil-apercu__description", traductionCourante().styleDescription || traductions.fr.styleDescription);
  elements.surprise.textContent = traduire("newStyle");
  elements.inverser.textContent = traduire("variant");
  elements.ouvrirTableauCsvApercu.textContent = traduire("data");
  elements.imprimer.textContent = traduire("print");
  elements.ouvrirFavoris.textContent = traduirePhrase("Favoris");
  traduireTextesVisibles();
  traduireAttributsVisibles();
  definirEditionTexteMobile(document.body.classList.contains("is-edition-texte-mobile"));
  synchroniserOptionsMotifSecondaire();
  traduireAidesOptions();
  mettreAJourAssistantReglages();
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

function remplirPolicesTextesLateraux() {
  const options = elements.policeTitres.cloneNode(true).querySelectorAll("option");
  [elements.policeMarques, elements.policeMarqueGauche, elements.policeMarqueDroite].forEach((select) => {
    const valeur = select.value;
    select.replaceChildren(...Array.from(options).map((option) => option.cloneNode(true)));
    select.value = Array.from(select.options).some((option) => option.value === valeur) ? valeur : "compacte";
  });
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
    elements.formulaire.insertBefore(elements.editionTexte, elements.assistantNavigation);
    return;
  }
  if (elements.editionTexte.parentElement !== elements.scene) {
    elements.scene.append(elements.editionTexte);
  }
}

function fermerEditionTexteMobile() {
  definirEditionTexteMobile(false);
}

function basculerEditionTexteMobile() {
  definirEditionTexteMobile(!document.body.classList.contains("is-edition-texte-mobile"));
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
}

function naviguerAssistantSuivant() {
  const etapes = etapesAssistantDisponibles();
  const index = indexEtapeAssistantActive();
  if (index >= etapes.length - 1) {
    imprimer();
    return;
  }
  activerEtapeReglage(etapes[index + 1]);
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
  if (csvLocal) {
    vinyles = parserCsvVinyles(csvLocal);
    memoriserOrdreOriginal();
    mettreAJourStatutCsv("CSV local restaure");
    return;
  }

  try {
    const reponse = await fetch("./exemple.csv", { cache: "no-store" });
    const texte = await reponse.text();
    vinyles = parserCsvVinyles(texte);
    memoriserOrdreOriginal();
    mettreAJourStatutCsv("CSV exemple charge");
  } catch (erreur) {
    vinyles = [];
    memoriserOrdreOriginal();
    mettreAJourStatutCsv("Impossible de charger le CSV");
  }
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
  elements.statutCsv.textContent = `${prefixe} - ${vinyles.length} ${traduirePhrase(vinyles.length > 1 ? "entrées" : "entrée")}`;
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
  mettreAJourStatutCsv("CSV attendu : Artiste, Face A, Face B");
  elements.importCsv.click();
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
  const preset = presets[modele];
  if (!preset) {
    return;
  }
  appliquerReglagesAuFormulaire({ ...lireReglagesFormulaire(), ...preset, theme: presets[modele]?.theme || "tout", modele });
  enregistrerReglagesActifs();
  mettreAJourGalerieModeles();
  mettreAJour();
}

function obtenirModelesCategorie(categorie) {
  return modelesParTheme[categorie] || modelesParTheme.tout;
}

function remplirModelesTheme() {
  const modeles = obtenirModelesCategorie("tout");
  const valeurPrincipale = elements.modele.value || modeles[0][0];
  const modelesSecondaires = obtenirModelesCategorie("tout").filter(([valeur]) => valeur !== valeurPrincipale);
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
  const modelePrincipal = lireReglages("1").modele || elements.modele.value;
  const modelesSecondaires = obtenirModelesCategorie("tout").filter(([valeur]) => valeur !== modelePrincipal);
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
  const totalPagesAccueil = Math.max(1, Math.ceil(modelesAccueil.length / MAX_MODELES_ACCUEIL_AVEC_TEASER));
  pageAccueilModeles = ((pageAccueilModeles % totalPagesAccueil) + totalPagesAccueil) % totalPagesAccueil;
  const modelesAccueilPage = modelesAccueil.slice(
    pageAccueilModeles * MAX_MODELES_ACCUEIL_AVEC_TEASER,
    pageAccueilModeles * MAX_MODELES_ACCUEIL_AVEC_TEASER + MAX_MODELES_ACCUEIL_AVEC_TEASER,
  );
  elements.galerieModelesAccueil.replaceChildren(...modelesAccueilPage.map(([valeur, libelle]) => creerCarteModele({
    valeur,
    libelle,
    ligneDemo: ligneDemoAccueil,
    actif: modelePrincipal === valeur,
    cible: "principale",
    reglagesBase: lireReglages("1"),
    vierge: true,
  })), creerCarteModeleIndisponible());
  const navigationAccueilVisible = modelesAccueil.length > MAX_MODELES_ACCUEIL_AVEC_TEASER;
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
    ...modelesSecondairesPage.map(([valeur, libelle]) => creerCarteModele({
      valeur,
      libelle,
      ligneDemo,
      actif: deuxiemeActive && modeleSecondaire === valeur,
      cible: "secondaire",
      reglagesBase: lireReglages("1"),
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
  const modeles = obtenirModelesCategorie(categorie);
  const signature = modeles.map(([valeur]) => valeur).join("|");
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
  const modelePrincipal = lireReglages("1").modele || elements.modele.value;
  const totalSecondaires = obtenirModelesCategorie("tout").filter(([valeur]) => valeur !== modelePrincipal).length;
  pageModelesSecondaires = normaliserPage(
    pageModelesSecondaires + delta,
    totalSecondaires,
    MAX_MODELES_SECONDAIRES,
  );
  mettreAJourGalerieModeles();
}

function changerPageModelesAccueil(delta) {
  const total = obtenirModelesAccueil("tout").length;
  const totalPages = Math.max(1, Math.ceil(total / MAX_MODELES_ACCUEIL_AVEC_TEASER));
  pageAccueilModeles = (pageAccueilModeles + delta + totalPages) % totalPages;
  mettreAJourGalerieModeles();
}

function creerCarteModele({ valeur, libelle, ligneDemo, actif, cible, reglagesBase, vierge = false }) {
  const bouton = document.createElement("button");
  bouton.className = "carte-modele";
  bouton.type = "button";
  bouton.dataset.modele = valeur;
  bouton.dataset.modeleCible = cible;
  bouton.setAttribute("aria-pressed", String(actif));
  if (actif) {
    bouton.classList.add("is-actif");
  }

  const image = document.createElement("img");
  image.alt = `Apercu ${libelle}`;
  const reglagesCarte = {
    ...reglagesBase,
    ...presets[valeur],
    modele: valeur,
  };
  image.src = dessinerEtiquette(ligneDemo, reglagesCarte).toDataURL("image/png");

  const nom = document.createElement("span");
  nom.className = "carte-modele__nom";
  nom.textContent = libelle;

  bouton.append(image, nom);
  return bouton;
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

function choisirModeleDepuisAccueil(evenement) {
  const bouton = evenement.target.closest("[data-modele]");
  if (!bouton) {
    return;
  }
  enregistrerHistoriqueAvantAction();
  elements.modele.value = bouton.dataset.modele;
  appliquerPreset(bouton.dataset.modele);
  if (champDimensionHorsLimites(elements.largeurEtiquette, "largeurEtiquette")
    || champDimensionHorsLimites(elements.hauteurEtiquette, "hauteurEtiquette")) {
    mettreAJourMessageDimensions();
    return;
  }
  afficherApercuApresChoixModele();
  activerEtapeReglage("style");
  mettreAJour();
}

function choisirModeleSecondaireDepuisGalerie(evenement) {
  const bouton = evenement.target.closest("[data-modele]");
  if (!bouton) {
    return;
  }
  enregistrerHistoriqueAvantAction();
  enregistrerReglagesActifs();
  elements.modeleSecondaire.value = bouton.dataset.modele;
  synchroniserBoutonDeuxiemeEtiquette(true);
  afficherApercuApresChoixModele();
  reglagesParEtiquette[2] = creerReglagesSecondaires();
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

function synchroniserBoutonDeuxiemeEtiquette(active) {
  elements.deuxiemeEtiquette.forEach((radio) => {
    radio.checked = radio.value === (active ? "oui" : "non");
  });
}

function appliquerReglagesAuFormulaire(reglages) {
  chargementReglages = true;
  const reglagesNormalises = { ...reglages };
  reglagesNormalises.decalageRetro = reglagesNormalises.decalageRetro || "aucun";
  reglagesNormalises.angleMotif = reglagesNormalises.angleMotif ?? 0;
  reglagesNormalises.arrondiInterieurBordure = reglagesNormalises.arrondiInterieurBordure ?? false;
  reglagesNormalises.papierVieilli = reglagesNormalises.papierVieilli ?? false;
  reglagesNormalises.epaisseurTraitsLeon = reglagesNormalises.epaisseurTraitsLeon ?? 3;
  reglagesNormalises.positionTraitsLeon = reglagesNormalises.positionTraitsLeon ?? 50;
  reglagesNormalises.ecartTraitsLeon = reglagesNormalises.ecartTraitsLeon ?? 24;
  reglagesNormalises.couleurPapierVieilli = reglagesNormalises.couleurPapierVieilli || reglagesNormalises.couleurVignette || "#8a6b3f";
  reglagesNormalises.jaunissementPapier = reglagesNormalises.jaunissementPapier ?? 50;
  reglagesNormalises.froissagePapier = reglagesNormalises.froissagePapier ?? 30;
  reglagesNormalises.imperfectionsPapier = reglagesNormalises.imperfectionsPapier ?? 35;
  reglagesNormalises.usureBordsPapier = reglagesNormalises.usureBordsPapier ?? 40;
  reglagesNormalises.synchroniserMarques = ![false, 0, "false", "0"].includes(reglagesNormalises.synchroniserMarques);
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
  reglagesNormalises.styleMarqueGauche = reglagesNormalises.styleMarqueGauche || "gras";
  reglagesNormalises.styleMarqueDroite = reglagesNormalises.styleMarqueDroite || "gras";
  reglagesNormalises.tailleMarqueGauche = reglagesNormalises.tailleMarqueGauche ?? reglagesNormalises.tailleMarques;
  reglagesNormalises.tailleMarqueDroite = reglagesNormalises.tailleMarqueDroite ?? reglagesNormalises.tailleMarques;
  reglagesNormalises.angleMarqueGauche = reglagesNormalises.angleMarqueGauche ?? reglagesNormalises.angleMarques;
  reglagesNormalises.angleMarqueDroite = reglagesNormalises.angleMarqueDroite ?? -Number(reglagesNormalises.angleMarques || 0);
  reglagesNormalises.positionMarqueGauche = reglagesNormalises.positionMarqueGauche ?? reglagesNormalises.positionMarques;
  reglagesNormalises.positionMarqueDroite = reglagesNormalises.positionMarqueDroite ?? reglagesNormalises.positionMarques;
  reglagesNormalises.hauteurMarqueGauche = reglagesNormalises.hauteurMarqueGauche ?? reglagesNormalises.hauteurMarques;
  reglagesNormalises.hauteurMarqueDroite = reglagesNormalises.hauteurMarqueDroite ?? reglagesNormalises.hauteurMarques;
  if (reglagesNormalises.decorPanel === "bordure") {
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
  synchroniserOptionsMotifSecondaire(reglagesNormalises.motifTraitsModernes);
  elements.activerMotif.checked = reglagesNormalises.motifType !== "aucun";
  elements.activerVignettage.checked = reglagesNormalises.modeVignette !== "aucun";
  const decorActif = decorActifDepuisPanel();
  rendreDecorExclusif(decorActif);
  if (decorActif) {
    elements.decorPanel.value = decorActif;
  }
  mettreAJourBoutonsDecor();
  chargementReglages = false;
  synchroniserValeursMarquesDepuisCommun(false);
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
  const reglagesActifs = lireReglagesFormulaire();
  return {
    etiquetteActive: actif,
    modeleChoisi,
    deuxiemeActive: deuxiemeEtiquetteActive(),
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
  };

  const terminerInteraction = () => {
    if (!rangeActif) {
      return;
    }
    rangeActif.dispatchEvent(new Event("change", { bubbles: true }));
    rangeActif = null;
    pointeurRangeActif = null;
    document.body.classList.remove("is-range-dragging");
  };

  elements.formulaire.addEventListener("pointerdown", (evenement) => {
    const range = rangeDepuisCible(evenement.target);
    if (!range) {
      return;
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
  elements.retablirReglage.disabled = historiqueReglages.retablissements.length === 0;
}

const { obtenirFavoris, enregistrerFavoris, signatureReglages } = creerGestionFavoris({
  cleFavoris: CLE_FAVORIS,
  cleFavorisAncienneVersion: CLE_FAVORIS_ANCIENNE_VERSION,
  normaliserReglagesImportes,
});

function basculerFavori() {
  const reglages = lireReglagesFormulaire();
  reglagesParEtiquette[etiquetteActive] = reglages;
  const id = signatureReglages(reglages);
  const favoris = obtenirFavoris();
  const dejaPresent = favoris.some((favori) => favori.id === id);

  if (dejaPresent) {
    enregistrerFavoris(favoris.filter((favori) => favori.id !== id));
  } else {
    enregistrerFavoris([{ id, creeLe: new Date().toISOString(), nomPersonnalise: "", reglages }, ...favoris].slice(0, 24));
    envoyerJsonStyle("favorite_added", creerPayloadJsonStyle({
      favoriteStyle: preparerReglagesPourExport(reglages),
    }));
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
  elements.ouvrirFavoris.hidden = false;
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
    const nouveauNom = window.prompt("Nom du favori", nomActuel);
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
  const styleTitres = elements.styleTitres.value;
  const styleArtiste = elements.styleArtiste.value;
  const motifActif = elements.activerMotif.checked;
  const vignettageActif = elements.activerVignettage.checked;
  const papierActif = elements.papierVieilli.checked;
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
    couleurTitres: elements.couleurTitres.value,
    couleurArtiste: elements.couleurArtiste.value,
    decorPanel: (
      (panelDecor === "papier" && papierActif)
        || (panelDecor === "vignette" && vignettageActif)
        || (panelDecor === "motif" && motifActif)
    ) ? panelDecor : (papierActif ? "papier" : (motifActif ? "motif" : (vignettageActif ? "vignette" : panelDecor))),
    angle: Number(elements.angle.value),
    intensite: Number(elements.intensite.value),
    motifType: motifActif ? elements.motifType.value : "aucun",
    couleurMotif: elements.couleurMotif.value,
    motif: Number(elements.motif.value),
    angleMotif: Number(elements.angleMotif.value),
    afficherTraitsModernes: elements.afficherTraitsModernes.checked,
    motifTraitsModernes: elements.motifTraitsModernes.value,
    couleurTraitsModernes: elements.couleurTraitsModernes.value,
    opaciteTraitsModernes: Number(elements.opaciteTraitsModernes.value),
    angleTraitsModernes: Number(elements.angleTraitsModernes.value),
    modeVignette: vignettageActif ? elements.modeVignette.value : "aucun",
    vignette: Number(elements.vignette.value),
    papierVieilli: elements.papierVieilli.checked,
    couleurPapierVieilli: elements.couleurPapierVieilli.value,
    jaunissementPapier: Number(elements.jaunissementPapier.value),
    froissagePapier: Number(elements.froissagePapier.value),
    imperfectionsPapier: Number(elements.imperfectionsPapier.value),
    usureBordsPapier: Number(elements.usureBordsPapier.value),
    bordure: Number(elements.bordure.value),
    arrondiInterieurBordure: elements.arrondiInterieurBordure.checked,
    largeurRuban: Number(elements.largeurRuban.value),
    hauteurRuban: Number(elements.hauteurRuban.value),
    hauteurBande: Number(elements.hauteurBande.value),
    epaisseurTraitsLeon: Number(elements.epaisseurTraitsLeon.value),
    positionTraitsLeon: Number(elements.positionTraitsLeon.value),
    ecartTraitsLeon: Number(elements.ecartTraitsLeon.value),
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
    decalageRetro: elements.decalageRetro.value,
    afficherMarques: elements.afficherMarques.checked,
    couleurMarques: elements.couleurMarques.value,
    formePastille: elements.formePastille.value,
    diametrePastille: Number(elements.diametrePastille.value),
    presetMarques: elements.presetMarques.value,
    synchroniserMarques: elements.synchroniserMarques.checked,
    marqueGauche: elements.marqueGauche.value.trim(),
    marqueDroite: elements.marqueDroite.value.trim(),
    policeMarques: elements.policeMarques.value,
    marqueGaucheTexte: elements.marqueGaucheTexte.value.trim(),
    marqueDroiteTexte: elements.marqueDroiteTexte.value.trim(),
    couleurMarqueGauche: elements.couleurMarqueGauche.value,
    couleurMarqueDroite: elements.couleurMarqueDroite.value,
    formePastilleGauche: elements.formePastilleGauche.value,
    formePastilleDroite: elements.formePastilleDroite.value,
    policeMarqueGauche: elements.policeMarqueGauche.value,
    policeMarqueDroite: elements.policeMarqueDroite.value,
    styleMarqueGauche: elements.styleMarqueGauche.value,
    styleMarqueDroite: elements.styleMarqueDroite.value,
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

function lireDimensionEtiquette(element, cle) {
  const limites = LIMITES_DIMENSIONS[cle];
  const valeur = Number(String(element?.value || "").replace(",", "."));
  if (!Number.isFinite(valeur)) {
    return limites.defaut;
  }

  return Number(Math.max(limites.min, Math.min(limites.max, valeur)).toFixed(1));
}

function lireReglages(numero = etiquetteActive) {
  if (numero === "2") {
    return reglagesParEtiquette[2] || creerReglagesSecondaires();
  }

  return reglagesParEtiquette[1] || lireReglagesFormulaire();
}

function enregistrerReglagesActifs() {
  reglagesParEtiquette[etiquetteActive] = lireReglagesFormulaire();
  sauvegarderReglagesAutomatiques();
}

function obtenirEditionActive() {
  return [...elements.editionEtiquette].find((radio) => radio.checked)?.value || "1";
}

function changerEtiquetteActive() {
  enregistrerReglagesActifs();
  etiquetteActive = obtenirEditionActive();
  appliquerReglagesAuFormulaire(lireReglages(etiquetteActive));
  mettreAJour();
}

function selectionnerEtiquetteDepuisApercu(numero) {
  if (ignorerProchainClicApercu) {
    ignorerProchainClicApercu = false;
    return;
  }
  if (numero === "2" && !deuxiemeEtiquetteActive()) {
    return;
  }
  enregistrerReglagesActifs();
  etiquetteActive = numero;
  elements.editionEtiquette.forEach((radio) => {
    radio.checked = radio.value === numero;
  });
  appliquerReglagesAuFormulaire(lireReglages(numero));
  mettreAJour();
  activerEtapeReglage("reglages");
  if (MEDIA_MOBILE.matches) {
    definirEditionTexteMobile(true);
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

  const modelePrincipal = lireReglages("1").modele || elements.modele.value;
  const modeles = obtenirModelesCategorie("tout").filter(([valeur]) => valeur !== modelePrincipal);
  if (!modeles.some(([valeur]) => valeur === elements.modeleSecondaire.value)) {
    elements.modeleSecondaire.value = modeles[0][0];
  }
  changerModeleSecondaire();
}

function afficherApercuApresChoixModele() {
  modeleChoisi = true;
  document.body.classList.remove("is-accueil-selection");
  window.scrollTo({ top: 0, left: 0 });
  elements.formulaire?.scrollTo?.({ top: 0, left: 0 });
  ajusterHauteurPanneauOptionsMobile();
}

function creerReglagesSecondaires() {
  const modele = elements.modeleSecondaire.value || elements.modele.value;
  return {
    ...lireReglages("1"),
    ...presets[modele],
    theme: presets[modele]?.theme || "tout",
    modele,
  };
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
  if (modele === "simple") {
    return {
      afficherMarques: Boolean(reglagesBase.afficherMarques),
      presetMarques: reglagesBase.presetMarques || "custom",
      marqueGauche: reglagesBase.marqueGauche || "",
      marqueDroite: reglagesBase.marqueDroite || "",
    };
  }

  if (modele === "martin" || combo.marques === "aucun") {
    return {
      afficherMarques: false,
      presetMarques: combo.marques === "aucun" ? "custom" : combo.marques,
      marqueGauche: "",
      marqueDroite: "",
    };
  }

  const preset = Math.random() > 0.18 ? combo.marques : choisirAleatoire([
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
    couleurTitres: palette.titre,
    couleurArtiste: palette.artisteTexte,
    decorPanel: "papier",
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
    papierVieilli: true,
    couleurPapierVieilli: palette.vignette,
    jaunissementPapier: nombreAleatoire(42, 86, 1),
    froissagePapier: nombreAleatoire(18, 68, 1),
    imperfectionsPapier: nombreAleatoire(24, 72, 1),
    usureBordsPapier: nombreAleatoire(28, 78, 1),
    bordure: nombreAleatoire(42, 88, 2),
    arrondiInterieurBordure: Math.random() > 0.58,
    epaisseurTraitsLeon: nombreAleatoire(1.5, 5.5, 0.5),
    positionTraitsLeon: nombreAleatoire(45, 55, 1),
    ecartTraitsLeon: nombreAleatoire(18, 34, 1),
    tailleTitres: nombreAleatoire(82, 112, 2),
    tailleArtiste: nombreAleatoire(82, 110, 2),
    styleTitres: Math.random() > 0.35 ? "gras" : "normal",
    styleArtiste: "gras",
    guillemetsTitres: Math.random() > 0.18,
    decalageRetro: choisirDecalageRetroSurprise(base, ["titres-leger", "un-titre", "artiste-leger", "tout-leger", "artiste-bas"]),
    policeTitres: choisirAleatoire(["dactylo-seche", "dactylo-ronde", "journal-ancien", "machine-vintage", "terminal-carre"]),
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
  const simple = Math.random() < 0.48;
  const palette = choisirAleatoire(simple ? palettesSimples : palettesPop);
  const profilsMiseEnPage = [
    {
      nom: "filet",
      bordure: [30, 42],
      largeurRuban: [64, 69],
      hauteurRuban: [28, 31],
      hauteurBande: [12, 16],
      diametre: simple ? [24, 29] : [26, 31],
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
      diametre: simple ? [24, 31] : [26, 34],
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
      diametre: simple ? [25, 32] : [28, 36],
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
  const fondHaut = simple ? palette.fond : palette.haut;
  const fondBas = simple ? palette.fond : palette.bas;
  const motifType = simple
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
    modele: "manu",
    couleur1: palette.cadre,
    couleur2: fondHaut,
    couleur3: fondBas,
    couleurRuban: palette.ruban,
    couleurVignette: palette.pastille,
    couleurTitres: couleurLisible(fondHaut, palette.titre),
    couleurArtiste: couleurLisible(palette.ruban, palette.artiste),
    couleurMotif: palette.motif,
    decorPanel: motifType === "aucun" ? "motif" : "motif",
    motifType,
    motif: motifType === "aucun" ? 0 : nombreAleatoire(simple ? 10 : 22, simple ? 26 : 46, 2),
    angleMotif: choisirAleatoire([-18, -12, 0, 12, 18]),
    modeVignette: "aucun",
    vignette: 0,
    intensite: 0,
    papierVieilli: false,
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
    policeTitres: choisirAleatoire(["swing-50", "sans-serree", "mono-moderne", "affiche-condensee"]),
    policeArtiste: choisirAleatoire(["sans-serree", "elegante", "compacte", "mono-moderne"]),
    tailleTitres: nombreAleatoire(118, 160, 2),
    tailleArtiste: nombreAleatoire(118, 145, 2),
    styleTitres: Math.random() < 0.35 ? "gras" : "normal",
    styleArtiste: "gras",
    guillemetsTitres: Math.random() < 0.45,
    decalageRetro: choisirDecalageRetroSurprise(base, ["titres-leger", "artiste-leger", "tout-leger", "tout-bas-decale"]),
  };
}

function melanger() {
  enregistrerHistoriqueAvantAction();
  const base = lireReglagesFormulaire();
  let surprise = null;
  let signature = "";

  for (let tentative = 0; tentative < 40; tentative += 1) {
    if (base.modele === "manu") {
      surprise = creerSurpriseManu(base);
      signature = JSON.stringify([
        surprise.couleur1,
        surprise.couleur2,
        surprise.couleur3,
        surprise.couleurRuban,
        surprise.couleurMarques,
        surprise.formePastille,
        surprise.diametrePastille,
        surprise.largeurRuban,
        surprise.hauteurRuban,
        surprise.hauteurBande,
        surprise.presetMarques,
        surprise.motifType,
        surprise.motif,
      ]);
      if (!signaturesSurpriseRecentes.includes(signature)) {
        break;
      }
      continue;
    }
    if (base.modele === "leon") {
      surprise = creerSurpriseLeon(base);
      signature = JSON.stringify([
        surprise.couleur1,
        surprise.couleur2,
        surprise.couleur3,
        surprise.couleurRuban,
        surprise.motifType,
        surprise.modeVignette,
        surprise.papierVieilli,
        surprise.couleurPapierVieilli,
        surprise.jaunissementPapier,
        surprise.froissagePapier,
        surprise.imperfectionsPapier,
        surprise.usureBordsPapier,
        surprise.epaisseurTraitsLeon,
        surprise.positionTraitsLeon,
        surprise.ecartTraitsLeon,
      ]);
      if (!signaturesSurpriseRecentes.includes(signature)) {
        break;
      }
      continue;
    }
    const combo = choisirAleatoire(combosSurprise);
    const variation = choisirAleatoire(["original", "inverse", "ruban-fond-haut", "ruban-fond-bas"]);
    const [couleur1, couleur2, couleur3, couleurRuban, couleurTitres, couleurArtiste, couleurMarques] = combo.couleurs;
    const marques = creerMarquesSurprise(combo, base);
    const motifActif = Math.random() > 0.1 ? combo.motif : choisirAleatoire(["grille", "rayures", "points", "diagonales", "chevrons", "croisillons", "vagues", "soleil"]);
    const modeVignette = Math.random() > 0.14 ? combo.vignette : choisirAleatoire(["fond", "global", "aucun"]);
    const fondHaut = variation === "inverse" ? couleur3 : couleur2;
    const fondBas = variation === "inverse" ? couleur2 : couleur3;
    const ruban = variation === "ruban-fond-haut" ? couleur2 : variation === "ruban-fond-bas" ? couleur3 : couleurRuban;
    const modeleModerne = base.modele === "celeste";
    const fondModerne = modeleModerne ? choisirAleatoire([fondHaut, fondBas, "#f8fafc", "#fffdf8", "#111827"]) : base.couleurFondModerne;
    surprise = {
      ...base,
      couleur1,
      couleur2: fondHaut,
      couleur3: fondBas,
      couleurRuban: ruban,
      couleurVignette: variation === "inverse" ? couleur1 : couleurRuban,
      couleurFondModerne: fondModerne,
      couleurBandeGauche: modeleModerne ? couleurRuban : base.couleurBandeGauche,
      couleurBandeDroite: modeleModerne ? couleur1 : base.couleurBandeDroite,
      couleurTitres: modeleModerne ? couleurTexteContraste(fondModerne) : couleurLisible(fondHaut, couleurTitres),
      couleurArtiste: modeleModerne ? couleurTexteContraste(ruban) : couleurLisible(ruban, couleurArtiste),
      couleurMarques: couleurLisible(couleur1, couleurMarques),
      decorPanel: Math.random() > 0.2 ? combo.decor : choisirAleatoire(["motif", "vignette"]),
      angle: nombreAleatoire(0, 180, 10),
      intensite: modeVignette === "aucun" ? base.intensite : nombreAleatoire(64, 94, 2),
      motifType: motifActif,
      couleurMotif: couleur1,
      motif: nombreAleatoire(34, 82, 2),
      angleMotif: nombreAleatoire(-36, 36, 2),
      afficherTraitsModernes: modeleModerne ? Math.random() > 0.18 : base.afficherTraitsModernes,
      motifTraitsModernes: modeleModerne
        ? choisirAleatoire(OPTIONS_MOTIFS_SECONDAIRES.map(([valeur]) => valeur).filter((valeur) => valeur !== motifActif))
        : base.motifTraitsModernes,
      couleurTraitsModernes: modeleModerne ? couleur1 : base.couleurTraitsModernes,
      opaciteTraitsModernes: modeleModerne ? nombreAleatoire(10, 34, 2) : base.opaciteTraitsModernes,
      angleTraitsModernes: modeleModerne ? nombreAleatoire(-34, 34, 2) : base.angleTraitsModernes,
      modeVignette,
      vignette: modeVignette === "aucun" ? base.vignette : nombreAleatoire(18, 46, 2),
      bordure: nombreAleatoire(38, 92, 2),
      largeurRuban: nombreAleatoire(72, 96, 2),
      hauteurRuban: nombreAleatoire(22, 36, 1),
      hauteurBande: base.modele === "alice" ? nombreAleatoire(8, 24, 1) : base.hauteurBande,
      tailleBandeGauche: base.modele === "celeste" ? nombreAleatoire(10, 24, 1) : base.tailleBandeGauche,
      angleBandeGauche: base.modele === "celeste" ? nombreAleatoire(-24, 24, 2) : base.angleBandeGauche,
      tailleBandeDroite: base.modele === "celeste" ? nombreAleatoire(18, 34, 1) : base.tailleBandeDroite,
      angleBandeDroite: base.modele === "celeste" ? nombreAleatoire(-28, 28, 2) : base.angleBandeDroite,
      tailleTitres: nombreAleatoire(92, 130, 2),
      tailleArtiste: nombreAleatoire(92, 138, 2),
      tailleMarques: nombreAleatoire(95, 160, 5),
      limiterMarquesBandeSurprise: true,
      styleTitres: Math.random() > 0.18 ? "gras" : "normal",
      styleArtiste: Math.random() > 0.55 ? "gras" : "normal",
      policeTitres: choisirAleatoire(["dactylo-ronde", "mono-moderne", "affiche-condensee", "sans-serree"]),
      policeArtiste: choisirAleatoire(["compacte", "elegante", "mono-moderne", "sans-serree"]),
      ...marques,
    };
    signature = JSON.stringify([
      surprise.couleur1,
      surprise.couleur2,
      surprise.couleur3,
      surprise.couleurRuban,
      surprise.couleurFondModerne,
      surprise.couleurBandeGauche,
      surprise.couleurBandeDroite,
      surprise.modeVignette,
      surprise.motifType,
      surprise.angleMotif,
      surprise.afficherTraitsModernes,
      surprise.motifTraitsModernes,
      surprise.opaciteTraitsModernes,
      surprise.angleTraitsModernes,
      surprise.presetMarques,
      surprise.afficherMarques,
      surprise.largeurRuban,
      surprise.hauteurRuban,
      surprise.tailleBandeGauche,
      surprise.angleBandeGauche,
      surprise.tailleBandeDroite,
      surprise.angleBandeDroite,
      surprise.jaunissementPapier,
      surprise.froissagePapier,
      surprise.imperfectionsPapier,
      surprise.usureBordsPapier,
    ]);
    if (!signaturesSurpriseRecentes.includes(signature)) {
      break;
    }
  }

  signaturesSurpriseRecentes.push(signature);
  signaturesSurpriseRecentes.splice(0, Math.max(0, signaturesSurpriseRecentes.length - 12));
  appliquerReglagesAuFormulaire(surprise);
  enregistrerReglagesActifs();
  mettreAJour();
}

function ajusterMotifVisible() {
  elements.decorPanel.value = "motif";
  elements.activerMotif.checked = elements.motifType.value !== "aucun";
  rendreDecorExclusif(elements.activerMotif.checked ? "motif" : null);
  synchroniserOptionsMotifSecondaire();
  if (!elements.activerMotif.checked) {
    elements.afficherTraitsModernes.checked = false;
  }
  mettreAJourBoutonsDecor();
  if (elements.motifType.value !== "aucun" && Number(elements.motif.value) < 25) {
    elements.motif.value = "45";
  }
  if (!chargementReglages) {
    enregistrerReglagesActifs();
    mettreAJour();
  }
}

function ajusterVignetteVisible() {
  elements.decorPanel.value = "vignette";
  elements.activerVignettage.checked = elements.modeVignette.value !== "aucun";
  rendreDecorExclusif(elements.activerVignettage.checked ? "vignette" : null);
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
  if (type === "motif") {
    elements.activerMotif.checked = !elements.activerMotif.checked;
    elements.decorPanel.value = "motif";
    if (elements.activerMotif.checked) {
      if (elements.motifType.value === "aucun") {
        elements.motifType.value = "grille";
      }
      if (Number(elements.motif.value) < 25) {
        elements.motif.value = "45";
      }
    } else {
      elements.motifType.value = "aucun";
      elements.afficherTraitsModernes.checked = false;
    }
    rendreDecorExclusif(elements.activerMotif.checked ? "motif" : null);
  }
  if (type === "vignette") {
    elements.activerVignettage.checked = !elements.activerVignettage.checked;
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
    rendreDecorExclusif(elements.activerVignettage.checked ? "vignette" : null);
  }
  if (type === "papier") {
    elements.papierVieilli.checked = !elements.papierVieilli.checked;
    elements.decorPanel.value = "papier";
    rendreDecorExclusif(elements.papierVieilli.checked ? "papier" : null);
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
  if (panel === "papier" && elements.papierVieilli.checked) {
    return "papier";
  }
  if (elements.papierVieilli.checked) {
    return "papier";
  }
  if (elements.activerMotif.checked) {
    return "motif";
  }
  if (elements.activerVignettage.checked) {
    return "vignette";
  }
  return null;
}

function rendreDecorExclusif(typeActif) {
  if (typeActif !== "motif") {
    elements.activerMotif.checked = false;
    elements.motifType.value = "aucun";
    elements.afficherTraitsModernes.checked = false;
  }
  if (typeActif !== "vignette") {
    elements.activerVignettage.checked = false;
    elements.modeVignette.value = "aucun";
  }
  if (typeActif !== "papier") {
    elements.papierVieilli.checked = false;
  }
}

function mettreAJourBoutonsDecor() {
  elements.boutonMotif.setAttribute("aria-pressed", String(elements.activerMotif.checked));
  elements.boutonVignettage.setAttribute("aria-pressed", String(elements.activerVignettage.checked));
  elements.boutonPapierVieilli.setAttribute("aria-pressed", String(elements.papierVieilli.checked));
}

function mettreAJourReglagesTexteMiseEnPage() {
  const afficherDansMiseEnPage = etapeReglageActive === "ruban" && elements.modifierTextesMiseEnPage.checked;
  elements.reglagesTexteMiseEnPage.hidden = !afficherDansMiseEnPage;
  const cible = afficherDansMiseEnPage ? elements.reglagesTexteMiseEnPage : document.querySelector('[data-tab-panel="texte"]');
  if (cible && !cible.contains(elements.reglagesTextePrincipaux)) {
    cible.append(elements.reglagesTextePrincipaux);
  }
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
  elements.styleMarqueGauche.value = "gras";
  elements.styleMarqueDroite.value = "gras";
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

function preparerReglagesPourExport(reglages) {
  const copie = { ...reglages };
  if (copie.modele === "simple") {
    copie.modele = "juju";
    copie.nomModele = "Juju";
  } else {
    const nom = modelesParTheme.tout.find(([valeur]) => valeur === copie.modele)?.[1];
    if (nom) {
      copie.nomModele = nom.charAt(0) + nom.slice(1).toLowerCase();
    }
  }
  return copie;
}

function creerPayloadJsonStyle(details = {}) {
  const deuxiemeActive = deuxiemeEtiquetteActive();
  return {
    page: location.pathname,
    language: langueActive,
    activeLabel: etiquetteActive,
    secondLabelEnabled: deuxiemeActive,
    styles: {
      primary: preparerReglagesPourExport(lireReglages("1")),
      secondary: deuxiemeActive ? preparerReglagesPourExport(lireReglages("2")) : null,
    },
    ...details,
  };
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

function normaliserReglagesImportes(donnees) {
  if (!donnees || Array.isArray(donnees) || typeof donnees !== "object") {
    throw new Error(traduirePhrase("Format de réglages invalide."));
  }

  const donneesCompatibles = { ...donnees };
  if (String(donneesCompatibles.modele || "").toLowerCase() === "juju") {
    donneesCompatibles.modele = "simple";
  }
  const reglages = lireReglagesFormulaire();
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
      const minimum = champ.min === "" ? -Infinity : Number(champ.min);
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

  if (reglages.modele === "martin" && !Object.prototype.hasOwnProperty.call(donneesCompatibles, "hauteurBande")) {
    reglages.hauteurBande = 0;
  }
  if (!Object.prototype.hasOwnProperty.call(donneesCompatibles, "angleMotif")) {
    reglages.angleMotif = presets[reglages.modele]?.angleMotif ?? 0;
  }
  if (reglages.modele === "celeste") {
    const preset = presets[reglages.modele] || presets.celeste;
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
  enregistrerHistoriqueAvantAction();
  const reglages = lireReglagesFormulaire();
  const variante = reglages.modele === "manu"
    ? creerVarianteManu(reglages)
    : reglages.modele === "celeste"
    ? creerVarianteModerne(reglages)
    : creerVarianteClassique(reglages);
  appliquerReglagesAuFormulaire(variante);
  enregistrerReglagesActifs();
  mettreAJour();
}

function creerVarianteClassique(reglages) {
  const fond = reglages.couleurRuban;
  const ruban = reglages.couleur3;
  return {
    ...reglages,
    couleur2: fond,
    couleur3: fond,
    couleurRuban: ruban,
    couleurTitres: couleurLisible(fond, reglages.couleurTitres),
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
    couleurTitres: couleurLisible(palette.fond, palette.titre),
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
    couleurTitres: couleurTexteContraste(palette.fond),
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

function modifierTexteApercu() {
  const ligne = obtenirLignes()[indexApercu];
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
  question.textContent = traduirePhrase("Lignes à ajouter");

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
  menuResume.textContent = `☰ ${traduirePhrase("Filtres")}`;

  const menuContenu = document.createElement("div");
  menuContenu.className = "tableau-csv__menu-contenu";

  const groupePliage = document.createElement("div");
  groupePliage.className = "tableau-csv__groupe tableau-csv__groupe--pliage";

  const info = document.createElement("p");
  info.className = "tableau-csv__info";
  info.textContent = traduirePhrase("Vos données restent sur cet ordinateur. Exportez un CSV pour les sauvegarder.");

  const trierArtiste = creerBoutonTableau(traduirePhrase("Trier par artiste"), () => trierVinyles("artiste"), "bouton tableau-csv__bouton");
  const trierFaceA = creerBoutonTableau(traduirePhrase("Trier Face A"), () => trierVinyles("titre_face_a"), "bouton tableau-csv__bouton");
  const trierFaceB = creerBoutonTableau(traduirePhrase("Trier Face B"), () => trierVinyles("titre_face_b"), "bouton tableau-csv__bouton");
  const ordreOrigine = creerBoutonTableau(traduirePhrase("Ordre initial"), () => {
    vinyles.sort((a, b) => (a.__ordreOriginal ?? 0) - (b.__ordreOriginal ?? 0));
    finaliserChangementTableau();
  }, "bouton tableau-csv__bouton");
  groupeTri.append(trierArtiste, trierFaceA, trierFaceB, ordreOrigine);

  const importer = creerBoutonTableau(traduirePhrase("Importer"), demanderImportCsv, "bouton tableau-csv__bouton");
  importer.classList.add("tableau-csv__bouton--desktop");
  const exporter = creerBoutonTableau(traduirePhrase("Exporter"), exporterCsv, "bouton tableau-csv__bouton");
  exporter.classList.add("tableau-csv__bouton--desktop");
  const toutEffacer = creerBoutonTableau(traduirePhrase("Vider"), () => {
    if (!window.confirm(traduirePhrase("Vider le tableau ?"))) {
      return;
    }
    vinyles = [];
    indexApercu = 0;
    finaliserChangementTableau();
  }, "bouton bouton-secondaire tableau-csv__bouton");
  groupeFichiers.append(importer, exporter, toutEffacer);

  let cartesPliees = false;
  const plierEtiquettes = creerBoutonTableau(traduirePhrase("Plier les étiquettes"), () => {
    cartesPliees = true;
    rendreTableauCsvActif?.();
  }, "bouton tableau-csv__bouton");
  const deplierEtiquettes = creerBoutonTableau(traduirePhrase("Déplier les étiquettes"), () => {
    cartesPliees = false;
    rendreTableauCsvActif?.();
  }, "bouton tableau-csv__bouton");
  groupePliage.append(plierEtiquettes, deplierEtiquettes);
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
    zone.replaceChildren(creerTableCsv(recherche.value, { cartesPliees }));
  };
  rendreTableauCsvActif = rendre;

  ajouter.addEventListener("click", () => {
    const total = Math.max(1, Math.min(500, Number(quantite.value) || 1));
    for (let i = 0; i < total; i += 1) {
      const vinyle = normaliserVinyleCsv(["", "", ""], [0, 1, 2], vinyles.length);
      vinyle.__ordreOriginal = vinyles.length;
      vinyles.push(vinyle);
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

function trierVinyles(cle) {
  vinyles.sort((a, b) => String(a[cle] || "").localeCompare(String(b[cle] || ""), "fr", { sensitivity: "base" }));
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
  animerChangementApercu(delta);
  indexApercu = (indexApercu + delta + lignes.length) % lignes.length;
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
  const deuxiemeActive = deuxiemeEtiquetteActive();
  mettreAJourVisibiliteApercu();
  if (!modeleChoisi) {
    elements.etat.textContent = traduirePhrase("En attente");
    elements.editionTexteEtat.textContent = "";
    elements.statutPlanche.textContent = "0 page";
    elements.apercu.removeAttribute("src");
    elements.apercuSecondaire.removeAttribute("src");
    elements.apercuSecondaire.hidden = true;
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
  elements.apercus.classList.toggle("apercus--duo", deuxiemeActive);
  elements.apercus.classList.toggle("apercus--selection", deuxiemeActive);
  elements.apercu.classList.toggle("is-selectionnee", deuxiemeActive && etiquetteActive === "1");
  elements.apercuSecondaire.classList.toggle("is-selectionnee", deuxiemeActive && etiquetteActive === "2");
  elements.apercu.toggleAttribute("aria-current", deuxiemeActive && etiquetteActive === "1");
  elements.apercuSecondaire.toggleAttribute("aria-current", deuxiemeActive && etiquetteActive === "2");
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
    elements.statutPlanche.textContent = "0 page";
    mettreAJourEditeurTexte(null);
    afficherFavoris();
    ajusterHauteurPanneauOptionsMobile();
    return;
  }

  indexApercu = ((indexApercu % lignes.length) + lignes.length) % lignes.length;
  const reglagesPrincipaux = lireReglages("1");
  const image = dessinerEtiquette(lignes[indexApercu], reglagesPrincipaux).toDataURL("image/png");
  elements.apercu.src = image;
  appliquerTailleApercu(elements.apercu, reglagesPrincipaux);
  if (deuxiemeActive) {
    const reglagesSecondaires = lireReglages("2");
    elements.apercuSecondaire.src = dessinerEtiquette(lignes[indexApercu], reglagesSecondaires).toDataURL("image/png");
    appliquerTailleApercu(elements.apercuSecondaire, reglagesSecondaires);
    elements.apercuSecondaire.hidden = false;
  } else {
    elements.apercuSecondaire.hidden = true;
    elements.apercuSecondaire.removeAttribute("src");
  }
  elements.etat.textContent = MEDIA_MOBILE.matches
    ? ""
    : `${indexApercu + 1} / ${lignes.length} - ${traduirePhrase("ligne")} ${lignes[indexApercu].numeroTableau}`;
  elements.editionTexteEtat.textContent = `${indexApercu + 1}/${lignes.length}`;
  mettreAJourEditeurTexte(lignes[indexApercu]);
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

function appliquerTailleApercu(image, reglages) {
  const largeurDisponible = Math.max(320, elements.apercus.clientWidth || image.parentElement?.clientWidth || 760);
  const zoom = Math.min(window.PX_PAR_MM, Math.max(5.2, (largeurDisponible * 0.96) / LIMITES_DIMENSIONS.largeurEtiquette.max));
  image.style.width = `${Math.round(reglages.largeurEtiquette * zoom)}px`;
  image.style.height = `${Math.round(reglages.hauteurEtiquette * zoom)}px`;
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
  const motifActif = elements.activerMotif.checked;
  const vignettageActif = elements.activerVignettage.checked;
  const papierActif = elements.papierVieilli.checked;
  elements.reglagesDecor.forEach((champ) => {
    const panel = champ.dataset.decorPanel;
    champ.classList.toggle(
      "champ-masque",
      (panel === "motif" && !motifActif)
        || (panel === "vignette" && !vignettageActif)
        || (panel === "papier" && !papierActif),
    );
  });
  elements.reglagesMotif.forEach((champ) => {
    champ.classList.toggle("champ-masque", !motifActif || reglages.motifType === "aucun");
  });
  elements.reglagesTraitsModernes.forEach((champ) => {
    champ.classList.toggle(
      "champ-masque",
      !motifActif || !reglages.afficherTraitsModernes,
    );
  });
  elements.reglagesVignette.forEach((champ) => {
    champ.classList.toggle("champ-masque", !vignettageActif || reglages.modeVignette === "aucun");
  });
  elements.reglagesPapier.forEach((champ) => {
    champ.classList.toggle("champ-masque", !papierActif);
  });
  mettreAJourReglagesTexteMiseEnPage();
  mettreAJourPanneauxSelonContenu();
}

function mettreAJourPanneauxSelonContenu() {
  const panneauxToujoursUtiles = new Set(["style", "reglages", "donnees", "couleurs", "texte", "decor", "favoris"]);
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
  if (cle.toLowerCase().includes("angle")) {
    return `${nombre}°`;
  }
  return `${nombre}${unite || "%"}`;
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
    const lignesSortie = preparerLignesSortie(selectionLignes, { vierges: viergesInput.checked });
    await attendreRenduInterface();
    try {
      await telechargerPdf(lignesSortie);
      envoyerJsonStyle("pdf_downloaded", creerPayloadJsonStyle({
        selectedRows: selectionLignes.length,
        blankLabels: viergesInput.checked,
      }));
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
