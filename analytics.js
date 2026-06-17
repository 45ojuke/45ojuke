export const ANALYTICS_CONFIG = {
  enabled: true,
  endpoint: "https://script.google.com/macros/s/AKfycbznxgpvqp55RhjmjWN7gKdDJlr7ifhMaWk0GJSdRBB7pZwfa7Adn_Y5RHNWvO5cSPrF/exec",
  events: ["favorite_added", "pdf_downloaded"],
};

export function envoyerJsonStyle(evenement, payload) {
  if (!ANALYTICS_CONFIG.enabled || !ANALYTICS_CONFIG.endpoint || !ANALYTICS_CONFIG.events.includes(evenement)) {
    return;
  }

  const donnees = JSON.stringify(payload);

  try {
    const formulaire = new URLSearchParams();
    formulaire.set("payload", donnees);
    fetch(ANALYTICS_CONFIG.endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formulaire,
    }).catch(() => {});
  } catch {
    // L'envoi du JSON ne doit jamais bloquer l'utilisation de l'application.
  }
}
