# Guide d'Utilisation & Manuel StratMind

Bienvenue dans **StratMind**, votre environnement de cartographie mentale stratégique, de pensée systémique et de pilotage opérationnel en temps réel.

---

## 🎯 À quoi sert cette application ?

### 1. La Raison d'Être de StratMind
Dans la plupart des organisations et projets, il existe une rupture majeure entre deux mondes :
- **D'un côté, les outils de Mind Mapping classiques** (Miró, XMind, FigJam) : ils sont formidables pour le dessin et le brainstorming, mais restent souvent de simples dessins passifs, déconnectés de l'exécution et des plans d'action concrets.
- **De l'autre, les gestionnaires de tâches linéaires** (Trello, Jira, Asana) : ils permettent de lister des tickets, mais font perdre la vision d'ensemble, les interdépendances logiques, les causes profondes et les risques stratégiques.

**StratMind comble ce fossé.** C'est un outil hybride conçu pour :
1. **Structurer la réflexion complexe** sous forme de réseau visuel interactif (nœuds, liaisons causales, matrices).
2. **Transformer instantanément la stratégie en exécution** grâce à une synchronisation bidirectionnelle entre le Canvas visuel et un tableau Kanban dynamique.
3. **Clarifier la prise de décision** en identifiant explicitement les objectifs, les hypothèses, les arbitrages, les blocages et les plans de mitigation des risques.

---

### 2. Quels problèmes concrets StratMind résout-il ?

| Problème récurrent | Solution apportée par StratMind |
| :--- | :--- |
| **Dispersion et bruit lors des réunions d'idéation** | Gabarits méthodologiques prêts à l'emploi (SWOT, 5 Pourquoi, OKRs, Arbre décisionnel) qui canalisent l'échange en temps réel. |
| **Perte des idées après un atelier visuel** | Les nœuds de type « Action » alimentent automatiquement le **Plan d'Action** avec priorités, échéances et assignations sans aucune ressaisie. |
| **Manque de visibilité sur les causes et conséquences** | Liens directionnels personnalisés (cause à effet, blocage, mitigation) et formes géométriques distinctes (losanges pour les décisions, cercles pour les concepts centraux). |
| **Dépendance à des serveurs tiers ou connexions instables** | Fonctionnement **100 % autonome, portable et hors-ligne** : vos données restent sur votre machine, aucun compte externe n'est imposé. |
| **Revues de direction fastidieuses** | **Mode Présentation** immersif masquant les menus superflus pour focaliser l'attention du public sur le raisonnement stratégique. |

---

### 3. Cas d'Usage Principaux & Métiers

- **Direction Générale & Fondateurs** : Cadrage de vision d'entreprise, plans de croissance trimestriels, modélisation de modèle économique, arbitrage entre opportunités concurrentes.
- **Chefs de Projet & Product Managers** : Définition de Roadmap produit, décomposition d'épopées en tâches concrètes, animation d'ateliers de rétrospective et de post-mortem.
- **Consultants & Coachs Agiles** : Animation d'ateliers clients participatifs en direct, diagnostics organisationnels par l'arbre des 5 Pourquoi, audits de risques.
- **Architectes Techniques & Développeurs** : Cartographie d'architectures applicatives, cartographie de la dette technique, analyse d'impacts avant refonte logicielle.
- **Indépendants, Étudiants & Chercheurs** : Prise de notes structurée, cartographie de domaines de connaissance, organisation d'examens ou de mémoires de recherche.

---

## 💻 Installation sur PC & Mode Application Portable

StratMind a été conçu pour être **totalement portable et installable sur PC** (Windows 10/11, macOS, Linux) sans nécessiter de configuration complexe ni de base de données externe.

### 🚀 Option A : Installation en 1 Clic sur PC (Application de Bureau PWA)

L'application intègre le standard **Progressive Web App (PWA)**, vous permettant de la transformer en un véritable logiciel PC :

1. Cliquez sur le bouton **« Installer sur PC »** situé dans la barre de navigation supérieure droite de l'application (ou cliquez sur l'icône d'écran / installation dans la barre d'adresse de votre navigateur Chrome, Edge ou Brave).
2. Confirmez l'installation : **StratMind** s'installe alors localement sur votre ordinateur.
3. **Avantages immédiats :**
   - Raccourci dédié sur le **Bureau**, dans le **Menu Démarrer** et la **Barre des tâches**.
   - Fenêtre indépendante et propre (sans barre d'URL ni onglets de navigateur parasites).
   - **Exécution 100% Hors-Ligne** : Le *Service Worker* précharge automatiquement l'intégralité du code, des polices et des icônes. Même sans accès à Internet, StratMind démarre et fonctionne parfaitement.
   - Vos données et vos cartes mentales sont automatiquement persistées dans le stockage local de votre machine.

---

### 💾 Option B : Application Portable Standalone (Clé USB & Sans Installation)

Si vous souhaitez emporter StratMind sur une **clé USB** ou l'exécuter sur un PC d'entreprise sans droits d'administrateur :

1. **Le build de production prêt à l'emploi** :
   - Le répertoire `dist/` généré contient tous les fichiers HTML, CSS, JavaScript et assets statiques compilés et optimisés.
2. **Utilisation autonome :**
   - Copiez simplement le dossier de l'application sur votre clé USB ou disque externe.
   - Lancez le serveur local léger fourni avec le projet :
     - Sur **Windows** : double-cliquez sur `start-portable.bat`.
     - Sur **Mac / Linux** : exécutez `./start-portable.sh` ou `npm run preview`.
   - L'application s'ouvre instantanément dans votre navigateur ou fenêtre d'application, sans aucune installation supplémentaire.
3. **Portabilité intégrale de vos cartes et données :**
   - Cliquez sur **Exporter > Sauvegarde JSON StratMind** pour enregistrer vos cartes sous forme de fichiers `.json` ultra-légers.
   - Sur un autre ordinateur, importez votre fichier JSON pour retrouver votre carte, vos nœuds, vos formes, vos liens et vos tâches exactement dans le même état.

---

## 🧭 Navigation & Manipulation du Canevas

| Action | Contrôle Souris / Trackpad | Raccourci Clavier |
| :--- | :--- | :--- |
| **Sélectionner un élément** | Clic gauche sur le nœud ou la flèche | <kbd>V</kbd> |
| **Déplacer un nœud** | Clic gauche maintenu sur le nœud puis glisser | Glisser-déposer |
| **Déposer / Se séparer d'un nœud** | Relâcher le bouton gauche de la souris | — |
| **Désélectionner tout** | Clic gauche dans le fond vide du canvas | <kbd>Échap</kbd> |
| **Déplacer la vue (Panoramique)** | Clic droit glissé, ou molette cliquée glissée | <kbd>H</kbd> |
| **Zoomer / Dézoomer** | Molette de la souris ou pincement trackpad | <kbd>+</kbd> / <kbd>-</kbd> |
| **Ajuster la vue (Zoom-to-Fit)** | Bouton **« Ajuster la vue »** en haut à droite | <kbd>F</kbd> |
| **Mode Présentation (Plein écran)** | Bouton **« Présentation »** ou HUD flottant | <kbd>P</kbd> ou <kbd>Échap</kbd> |
| **Déplacer toute la carte** | Bouton mode global sur la barre d'outils | <kbd>M</kbd> |
| **Annuler / Rétablir** | Boutons d'historique en haut à gauche | <kbd>Ctrl</kbd> + <kbd>Z</kbd> / <kbd>Ctrl</kbd> + <kbd>Y</kbd> |
| **Supprimer l'élément sélectionné** | Bouton corbeille dans l'inspecteur | <kbd>Suppr</kbd> / <kbd>Retour arrière</kbd> |

---

## 🧲 Comment se séparer d'un nœud après l'avoir déplacé ?

1. **Relâcher la souris (Drop) :**
   - Dès que vous **relâchez le bouton gauche de la souris**, le déplacement s'arrête net et le nœud se fixe à sa nouvelle position.
2. **Retirer la sélection active (Désélectionner) :**
   - **Option A :** Appuyez sur la touche <kbd>Échap</kbd> de votre clavier.
   - **Option B :** Faites un simple clic gauche dans n'importe quelle zone vide du canvas.
3. **Détacher ou rompre une connexion (Isoler le nœud) :**
   - Cliquez sur la ligne/flèche reliant le nœud pour la sélectionner.
   - Appuyez sur <kbd>Suppr</kbd> ou cliquez sur l'icône corbeille : la liaison est supprimée, le nœud devient indépendant.
4. **Supprimer définitivement un nœud :**
   - Sélectionnez-le, puis appuyez sur <kbd>Suppr</kbd> ou utilisez la corbeille dans l'inspecteur latéral droit.

---

## 🎨 Typologie des Nœuds & Formes Géométriques

### Typologie Sémantique
- **💡 Concept** : Idée maîtresse, sujet de réflexion, hypothèse de travail ou brique architecturale.
- **🎯 Objectif (Goal)** : Résultat attendu, jalon prioritaire ou indicateur clé de performance (OKR).
- **⚡ Action** : Tâche exécutable avec statut (*À Planifier*, *En Cours*, *Terminé*), échéance et responsable.
- **⚖️ Décision** : Choix validé, compromis d'équipe ou arbitrage stratégique.
- **⚠️ Risque** : Point de vigilance, dette technique, vulnérabilité ou dépendance critique.
- **📝 Note / Post-it** : Mémo rapide, citation ou retour d'expérience libre.

### Formes Géométriques Personnalisables
Depuis l'inspecteur latéral de propriétés, vous pouvez assigner une forme géométrique à chaque nœud :
- **Rectangle** (Standard) : Idéal pour les descriptions denses, cartes d'action et listes d'attributs.
- **Cercle** : Idéal pour les concepts centraux, jalons majeurs et brainstormings radiaux.
- **Losange** : Idéal pour les nœuds de décision stratégique, aiguillages, conditions et bifurcations logiques.

---

## ⚡ Fonctionnalités Clés & Outils Intégrés

### 🏗️ Modèles Stratégiques Prédéfinis (Touche <kbd>T</kbd>)
Accédez à la bibliothèque de modèles prêts à l'emploi via la barre d'outils :
- **Matrice SWOT** (Forces, Faiblesses, Opportunités, Menaces).
- **Arbre des 5 Pourquoi** (Diagnostic méthodique des causes profondes).
- **Objectifs & Résultats Clés (OKRs)** (Alignement stratégique).
- **Brainstorming Produit & Idéation** (Phases d'exploration).
- **Matrice Risques & Plans de Mitigation** (Gestion préventive des menaces).

### 📋 Vue Plan d'Action (Kanban Synchronisé)
- Accédez à l'onglet **Plan d'Action** pour piloter l'exécution de toutes les tâches de type *Action*.
- Tout déplacement d'une carte dans les colonnes (*À Planifier*, *En Cours*, *Terminé*) ou modification d'échéance met à jour instantanément la carte mentale du Canvas.

### 📺 Mode Présentation (Revues de Direction & Pitchs)
- Appuyez sur <kbd>P</kbd> ou cliquez sur le bouton **« Présentation »**.
- L'interface complète s'efface pour laisser place à la carte en plein écran, avec un HUD discret de contrôle en haut à droite.

### 🌐 Collaboration Temps Réel
- Synchronisation WebSocket bidirectionnelle avec indication de latence en millisecondes.
- Visualisation en direct des curseurs et des avatars de vos collègues sur le canevas.

### 💾 Exports & Sauvegardes
- **Plan Stratégique Markdown** : Génère un document récapitulatif textuel hiérarchisé prêt à être partagé par e-mail ou intégré dans un wiki (Notion, Confluence).
- **Sauvegarde JSON StratMind** : Archive intégrale ré-importable sur n'importe quel ordinateur.
