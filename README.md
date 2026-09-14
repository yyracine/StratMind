# 🎨 StratMind - Cartographie Mentale & Stratégie

Une application desktop de cartographie mentale inspirée de Miró, dédiée à la productivité, la pensée critique et la stratégie avec synchronisation en temps réel.

## ✨ Fonctionnalités

- 📍 **Cartographie Mentale Interactive** : Créez et organisez des nœuds avec connexions visuelles
- 🎯 **Outils Stratégiques** : Templates SWOT, 5 Pourquoi, Brainstorm
- 🤖 **Assistant IA** : Suggestions intelligentes avec Google Gemini
- 💾 **Synchronisation Temps Réel** : WebSocket pour collaboration
- 📱 **Progressive Web App** : Installez comme application native
- 🎨 **Thèmes Personnalisables** : Multiples thèmes de couleurs
- ⚡ **Offline-First** : Service Worker intégré

## 🚀 Démarrage Rapide

### Avec Bun (Recommandé)
```bash
git clone https://github.com/yyracine/StratMind.git
cd StratMind
bun install
cp .env.example .env.local
bun run dev
```

### Avec npm
```bash
git clone https://github.com/yyracine/StratMind.git
cd StratMind
npm install
cp .env.example .env.local
npm run dev
```

L'application démarre à **http://localhost:3000**

## 📖 Documentation Complète

Pour un guide d'installation détaillé, consultez [INSTALLATION.md](INSTALLATION.md)

### Configuration Rapide

1. **Dépendances** : Node.js v20+ ou Bun v1.0+
2. **Variables d'env** : Copiez `.env.example` vers `.env.local`
3. **Clé Gemini** : Optionnel, obtenue sur [AI Studio](https://ai.google.dev)

## 📦 Commandes

```bash
npm run dev       # Mode développement avec hot-reload
npm run build     # Compiler pour production
npm start         # Lancer la version compilée
npm run lint      # Vérifier la syntaxe TypeScript
```

## 🛠️ Stack Technique

- **Frontend** : React 19 + TypeScript + Tailwind CSS
- **Backend** : Express.js + Node.js
- **Build** : Vite 6 + esbuild
- **Temps Réel** : WebSocket (ws)
- **IA** : Google Generative AI SDK
- **PWA** : Vite PWA Plugin

## 📝 Licence

MIT - Libre d'utilisation et de modification
