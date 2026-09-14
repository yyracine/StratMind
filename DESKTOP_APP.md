# StratMind - Application Desktop

Guide complet pour transformer StratMind en application desktop installable et portable.

## 🎯 Qu'est-ce que c'est ?

StratMind Desktop est une application standalone pour Windows, macOS et Linux. Elle contient :
- ✅ Serveur backend intégré (Express)
- ✅ Frontend compilée (React + Vite)
- ✅ Aucune installation supplémentaire requise
- ✅ Fonctionne hors ligne

## 📦 Installation

### Sur Windows

#### Option 1 : Installer (Recommandé)
```bash
cd release
# Lancez le fichier .exe de l'installeur
# Suivez les instructions
```

#### Option 2 : Portable (Sans installation)
```bash
cd release
# Lancez StratMind-*-portable.exe
# Pas besoin d'installer, ça fonctionne immédiatement
```

### Sur macOS

```bash
cd release
# Ouvrez StratMind-*.dmg
# Glissez-déposez StratMind.app dans le dossier Applications
```

### Sur Linux

```bash
cd release
# Option 1 : AppImage
./StratMind-*.AppImage

# Option 2 : Deb (Debian/Ubuntu)
sudo dpkg -i StratMind-*.deb
# Puis lancez depuis le menu Applications
```

---

## 🛠️ Développement

### Lancer en Développement

```bash
npm run electron-dev
```

Cela :
1. Compile l'app (Vite + esbuild)
2. Lance le serveur backend
3. Ouvre la fenêtre Electron

### Compiler pour Production

```bash
npm run electron-build
```

Cela génère des installers pour Windows, macOS et Linux dans le dossier `release/`.

---

## 📋 Fonctionnalités

| Feature | Desktop | Web |
|---------|---------|-----|
| **Cartographie** | ✅ | ✅ |
| **API AI** | ✅ | ✅ |
| **WebSocket Temps Réel** | ✅ | ✅ |
| **Service Worker** | ✅ | ✅ |
| **Offline** | ✅ | ❌ |
| **Installation** | ✅ | ❌ |
| **Desktop Menu** | ✅ | ❌ |

---

## ⚙️ Configuration

### Variables d'Environnement

Avant de compiler, créez `.env` :

```env
GEMINI_API_KEY=votre_clé_ici
NODE_ENV=production
PORT=3000
```

### Personnalisation Electron

Éditez `electron-main.js` pour :
- Changer l'icône
- Modifier la taille de la fenêtre
- Ajouter des menus personnalisés

Éditez `electron-builder.yml` pour :
- Changer le nom de l'app
- Ajouter des associatiations de fichiers
- Configurer les certificats de signature

---

## 📊 Tailles des Fichiers

| Format | Taille |
|--------|--------|
| **Windows Portable** | ~150 MB |
| **Windows Installer** | ~100 MB |
| **macOS DMG** | ~180 MB |
| **Linux AppImage** | ~160 MB |

---

## 🔐 Sécurité

- ✅ Context Isolation activée
- ✅ Node Integration désactivée
- ✅ Preload scripts sécurisés
- ✅ Pas de requêtes HTTP externes non sécurisées

---

## 🐛 Dépannage

### L'app ne lance pas

```bash
# Vérifiez les logs
npm run electron-dev
```

Regardez la console pour les erreurs.

### Le serveur ne démarre pas

```bash
# Vérifiez que le port 3000 est libre
lsof -i :3000
```

Changez le `PORT` dans `.env` si nécessaire.

### Les fichiers n'apparaissent pas

```bash
# Compilez d'abord
npm run build
# Puis lancez Electron
npm run electron-dev
```

---

## 📦 Distribution

### Pour Publier les Releases

```bash
# Compiler tous les formats
npm run electron-build

# Les fichiers seront dans `release/`
ls release/
```

Puis :
1. Allez sur GitHub → Releases
2. Créez une nouvelle release
3. Uploadez les fichiers du dossier `release/`

---

## 🎨 Branding

Pour changer l'icône :

1. Remplacez `public/icon.png` (512x512)
2. Relancez le build

L'icône sera automatiquement redimensionnée pour tous les formats.

---

## 📚 Ressources

- Docs Electron : https://www.electronjs.org/docs
- electron-builder : https://www.electron.build/
- Signing (macOS/Windows) : https://www.electron.build/code-signing

---

Bon développement ! 🚀
