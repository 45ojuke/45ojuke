#!/bin/zsh

cd "$(dirname "$0")" || exit 1

PORT=8765
URL="http://127.0.0.1:${PORT}/"

echo "45'O'Juke"
echo "Demarrage du serveur local sur ${URL}"
echo

if curl -fsS --max-time 2 "${URL}" >/dev/null 2>&1; then
  echo "Le serveur est deja disponible."
  open "${URL}"
  exit 0
fi

PID="$(lsof -tiTCP:${PORT} -sTCP:LISTEN 2>/dev/null)"
if [ -n "${PID}" ]; then
  echo "Un ancien serveur bloque le port ${PORT}. Redemarrage..."
  kill ${PID} 2>/dev/null
  sleep 1
fi

python3 -m http.server "${PORT}" &
SERVER_PID=$!

sleep 1
open "${URL}"

echo
echo "Serveur lance. Garde cette fenetre ouverte pendant l'utilisation."
echo "Pour arreter le serveur: ferme cette fenetre ou appuie sur Ctrl+C."
echo

wait "${SERVER_PID}"
