#!/usr/bin/env bash
echo "==================================================="
echo "  StratMind - Cartographie Mentale & Stratégie"
echo "  Mode Application Portable PC"
echo "==================================================="
echo ""
echo "Démarrage du serveur portable local..."

if ! command -v node &> /dev/null; then
    echo "[!] Node.js n'a pas été détecté."
    echo "    Ouvrez directement dist/index.html dans votre navigateur."
    exit 1
fi

npm run preview || npm run start
