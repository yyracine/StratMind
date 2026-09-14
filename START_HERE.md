# 🚀 StratMind Desktop - Guide de Démarrage

## 📦 Version Portable (Prête à l'emploi !)

Votre application **StratMind** est maintenant prête à l'emploi en tant qu'application desktop portable !

### **Lancer l'Application**

**Méthode 1 : Double-cliquez sur le script (RECOMMANDÉ)**
```
run-stratmind.bat
```

**Méthode 2 : Allez directement dans le dossier**
```
release/win-unpacked/StratMind.exe
```

### **C'est tout ! ✅**

L'application démarre automatiquement avec :
- ✅ Serveur backend intégré
- ✅ Interface React interactive
- ✅ WebSocket synchronisation temps réel
- ✅ Service Worker offline

---

## 📊 Infos de l'Application

| Aspect | Détail |
|--------|--------|
| **Taille** | 235 MB |
| **Type** | Portable (pas d'installation) |
| **Plateforme** | Windows 10+ |
| **Dépendances** | Aucune (tout inclus) |
| **Port** | 3000 (localhost) |

---

## 🎨 Fonctionnalités

- 🗺️ Cartographie mentale interactive
- 🎯 Templates stratégiques (SWOT, 5 Pourquoi, etc.)
- 🤖 Assistant IA (Gemini) - optionnel
- 💾 Synchronisation temps réel WebSocket
- 📱 PWA + Service Worker
- 🌙 Thème sombre natif
- 📲 Responsive design

---

## 🔧 Développement

### Modifier l'Application

```bash
# Mode développement
npm run electron-dev

# Compiler pour production
npm run electron-build

# Créer un build simple
npm run electron-dist
```

### Fichiers Importants

```
electron-main.js       # Processus principal
preload.js             # Sécurité Electron
electron-builder.yml   # Config des installers
package.json           # Scripts et dépendances
```

---

## 📝 Configuration Optionnelle

Créez un fichier `.env` pour les options avancées :

```env
# Clé API Gemini (optionnel)
GEMINI_API_KEY=votre_clé_ici

# Port du serveur (défaut: 3000)
PORT=3000

# Mode environnement
NODE_ENV=production
```

---

## 🆘 Dépannage

### L'application ne démarre pas

1. Vérifiez que le port 3000 est libre
2. Vérifiez les logs dans la console Electron
3. Essayez de lancer `npm run electron-dev`

### Le port 3000 est occupé

```bash
# Changez le port dans .env
PORT=3001
```

### Problèmes de WebSocket

Assurez-vous que le firewall n'est pas bloqué :
- Windows Defender → Pare-feu → Autoriser StratMind

---

## 📦 Distribution

### Créer une Version Installer

```bash
npm run electron-build
```

Cela crée des installers dans `release/` :
- `StratMind Setup 1.0.0.exe` - Installer standard
- `StratMind-1.0.0-portable.exe` - Version portable (recommandée)

### Créer un Installeur pour macOS/Linux

Sur votre machine macOS/Linux :
```bash
npm run electron-build
```

Cela créera `.dmg` (macOS) ou `.AppImage` (Linux).

---

## 🚀 Prochaines Étapes

1. **Testez l'application** en lançant `run-stratmind.bat`
2. **Créez vos cartographies mentales**
3. **Partagez avec votre équipe** (WebSocket actif)
4. **Distribuez** la version portable `.exe`

---

## 📞 Support

- **GitHub** : https://github.com/yyracine/StratMind
- **Issues** : https://github.com/yyracine/StratMind/issues
- **Documentation** : Voir `DESKTOP_APP.md`

---

**Bienvenue dans StratMind Desktop ! 🎉**

Lancez l'application et commencez à cartographier ! 🗺️
