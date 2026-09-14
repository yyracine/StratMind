# Guide d'Installation - StratMind

Guide complet pour installer et lancer l'application StratMind sur votre machine.

## 📋 Prérequis

- **Node.js** v20+ ou **Bun** v1.0+ (recommandé pour les meilleures performances)
- **Git** (pour cloner le repository)
- Une clé API **Google Gemini** (optionnel, pour l'assistant IA)

### Vérifier les installations

```bash
# Vérifier Node.js
node --version

# Vérifier Bun (si installé)
bun --version

# Vérifier Git
git --version
```

---

## 🚀 Installation Rapide

### Option 1 : Avec Bun (Recommandé)

```bash
# 1. Cloner le repository
git clone https://github.com/yyracine/StratMind.git
cd StratMind

# 2. Installer les dépendances
bun install

# 3. Configurer les variables d'environnement
cp .env.example .env.local

# 4. Ajouter votre clé Gemini API (optionnel)
# Éditer .env.local et ajouter:
# GEMINI_API_KEY=votre_clé_api

# 5. Lancer en développement
bun run dev

# L'application sera disponible à http://localhost:3000
```

### Option 2 : Avec npm

```bash
# 1. Cloner le repository
git clone https://github.com/yyracine/StratMind.git
cd StratMind

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local

# 4. Ajouter votre clé Gemini API (optionnel)
# Éditer .env.local et ajouter:
# GEMINI_API_KEY=votre_clé_api

# 5. Lancer en développement
npm run dev

# L'application sera disponible à http://localhost:3000
```

---

## ⚙️ Configuration

### Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Clé API Google Gemini (optionnel)
GEMINI_API_KEY=votre_clé_api_ici

# Port du serveur (défaut: 3000)
PORT=3000

# Mode environnement
NODE_ENV=development
```

### Obtenir une clé Gemini API

1. Allez sur [Google AI Studio](https://ai.google.dev)
2. Cliquez sur "Get API Key"
3. Créez une nouvelle clé
4. Copiez-la dans votre fichier `.env.local`

---

## 🏃 Lancer l'Application

### Mode Développement

Avec hot-reload et Vue Devtools :

```bash
# Avec Bun
bun run dev

# Avec npm
npm run dev
```

L'application démarre à **http://localhost:3000**

### Mode Production

#### Compiler l'application

```bash
# Avec Bun
bun run build

# Avec npm
npm run build
```

Cela génère un dossier `dist/` avec :
- Frontend compilé (HTML/CSS/JS)
- Serveur Node.js bundlé
- Service Worker pour PWA

#### Lancer en production

```bash
# Avec Bun
bun start

# Avec Node.js
node dist/server.cjs
```

---

## 🎨 Features Disponibles

### Cartographie Mentale
- ✅ Créer des nœuds avec différents types (concept, décision, action, objectif, risque, note)
- ✅ Dessiner des connexions entre nœuds
- ✅ Organiser avec un minimap
- ✅ Chercher des nœuds par titre ou contenu

### Stratégie & Décisions
- ✅ Templates prédéfinis (SWOT, 5 Pourquoi, Stratégie, Brainstorm)
- ✅ Assistant IA pour suggestions stratégiques
- ✅ Statuts et priorités (Backlog, En cours, Complété)
- ✅ Dates d'échéance et assignataires

### Synchronisation
- ✅ WebSocket en temps réel
- ✅ Support PWA (application desktop)
- ✅ Offline-first avec service worker

---

## 🛠️ Commandes Disponibles

```bash
# Développement
npm run dev          # Lancer le serveur en mode dev
npm run preview      # Prévisualiser la version compilée
npm run lint         # Vérifier la syntaxe TypeScript
npm run clean        # Nettoyer le dossier dist/

# Production
npm run build        # Compiler pour la production
npm start            # Lancer la version compilée
```

---

## 🧪 Test de l'Application

Après le lancement, testez les endpoints :

```bash
# Récupérer la liste des cartes
curl http://localhost:3000/api/maps

# Récupérer une carte spécifique
curl http://localhost:3000/api/maps/strategy-growth-2026

# Créer une nouvelle carte
curl -X POST http://localhost:3000/api/maps \
  -H "Content-Type: application/json" \
  -d '{"title":"Ma Carte","description":"Test","category":"brainstorm","theme":"rose","nodes":[],"edges":[]}'
```

---

## 📱 Installation en tant qu'App (PWA)

StratMind est une Progressive Web App (PWA) et peut être installée comme application desktop :

### Sur Chrome/Edge
1. Visitez http://localhost:3000
2. Cliquez sur le bouton "Installer" dans la barre d'adresse
3. Confirmez l'installation

### Sur macOS/iOS
1. Ouvrez en Safari
2. Partagez → Ajouter à l'écran d'accueil
3. Nommez l'app et confirmez

---

## ❓ Dépannage

### Port 3000 déjà utilisé

```bash
# Lancer sur un port différent
PORT=3001 npm run dev

# Ou tuer le processus existant
# Sur Windows: taskkill /PID <pid> /F
# Sur macOS/Linux: kill -9 <pid>
```

### Clé Gemini API invalide

- Vérifiez que la clé est correctement copiée dans `.env.local`
- Vérifiez que l'API est activée dans Google Cloud Console
- L'assistant IA reste optionnel, l'app fonctionne sans

### Dépendances manquantes

```bash
# Réinitialiser node_modules
rm -rf node_modules
npm install

# Ou avec Bun
rm -rf node_modules
bun install
```

---

## 📊 Structure du Projet

```
StratMind/
├── src/              # Code source React
├── public/           # Assets statiques
├── dist/             # Build compilé (généré)
├── server.ts         # Serveur Express
├── vite.config.ts    # Configuration Vite
├── package.json      # Dépendances
├── tsconfig.json     # Configuration TypeScript
└── .env.example      # Template variables d'env
```

---

## 🚀 Déploiement

StratMind peut être déployé sur :

- **Vercel** (avec serverless)
- **Netlify** (frontend) + backend séparé
- **Docker** (image conteneurisée)
- **Heroku** (Node.js)
- **Self-hosted** (VPS, serveur personnel)

Pour plus d'infos sur le déploiement, consultez la documentation de votre plateforme.

---

## 📞 Support & Contribution

- **Issues** : https://github.com/yyracine/StratMind/issues
- **Pull Requests** : Bienvenues ! 🎉

---

Bon usage de StratMind ! 🚀
