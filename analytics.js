export const ANALYTICS_CONFIG = {
  enabled: true,
  endpoint: "https://script.google.com/macros/s/AKfycbznxgpvqp55RhjmjWN7gKdDJlr7ifhMaWk0GJSdRBB7pZwfa7Adn_Y5RHNWvO5cSPrF/exec",
  events: ["favorite_added", "pdf_downloaded"],
};

export function envoyerJsonStyle(evenement, payload) {
  if (!ANALYTICS_CONFIG.enabled || !ANALYTICS_CONFIG.endpoint || !ANALYTICS_CONFIG.events.includes(evenement)) {
    return;
  }

  const donnees = JSON.stringify({
    event: evenement,
    sentAt: new Date().toISOString(),
    source: "45ojuke",
    device: obtenirInfosAppareil(),
    ...payload,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([donnees], { type: "text/plain;charset=utf-8" });
      if (navigator.sendBeacon(ANALYTICS_CONFIG.endpoint, blob)) {
        return;
      }
    }

    fetch(ANALYTICS_CONFIG.endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: donnees,
    }).catch(() => {});
  } catch {
    // L'envoi du JSON ne doit jamais bloquer l'utilisation de l'application.
  }
}

function obtenirInfosAppareil() {
  return {
    userAgent: navigator.userAgent || "",
    platform: navigator.platform || "",
    language: navigator.language || "",
    languages: Array.isArray(navigator.languages) ? navigator.languages.join(", ") : "",
    screen: {
      width: window.screen?.width || null,
      height: window.screen?.height || null,
      pixelRatio: window.devicePixelRatio || 1,
    },
    viewport: {
      width: window.innerWidth || null,
      height: window.innerHeight || null,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
  };
}
