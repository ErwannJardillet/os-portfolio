# OS Portfolio — React + Vite

Un portfolio interactif présenté comme un système d'exploitation fictif. Explorez mes projets, compétences et informations de contact à travers une interface immersive simulant un environnement de bureau moderne.

🌐 **Site en ligne** : [https://os-portfolio-steel.vercel.app/](https://os-portfolio-steel.vercel.app/)

## 🎨 Caractéristiques

- **Écran de démarrage** : Animation de boot avec messages système et barre de progression
- **Interface OS-like** : Expérience utilisateur similaire à un système d'exploitation avec bureau, icônes et fenêtres
- **Glassmorphisme** : Design moderne avec effets de verre dépoli et transparence
- **Fenêtres interactives** : Fenêtres déplaçables avec effet de momentum/inertie et animations fluides
- **Icônes déplaçables** : Réorganisez les icônes sur le bureau par glisser-déposer avec détection de collisions
- **Wallpaper animé** : Fond d'écran avec shader gradient animé utilisant Three.js
- **Audio ambiant** : Lecteur audio intégré avec visualiseur de fréquences et contrôle de volume
- **Barre des tâches** : Affichage de l'heure, date, batterie et connexion Wi-Fi
- **Applications intégrées** :
  - **À propos** : Présentation personnelle
  - **Projets** : Portfolio de réalisations
  - **Compétences** : Technologies maîtrisées
  - **Contact** : Informations de contact
- **Responsive** : Interface adaptative avec blocage des appareils mobiles pour une expérience optimale sur desktop

## 🛠️ Technologies

- **React 19** : Framework UI moderne
- **Vite** : Build tool rapide et optimisé
- **Three.js** : Rendu 3D et shaders pour le wallpaper
- **@react-three/fiber** : Intégration React pour Three.js
- **@shadergradient/react** : Gradients animés avec shaders
- **Web Audio API** : Analyse audio et visualisation des fréquences
- **CSS Modules** : Styles modulaires et encapsulés
- **React Hooks** : Gestion d'état et effets personnalisés

## 📦 Installation

```bash
# Cloner le repository
git clone <repository-url>
cd os-portfolio

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditez .env et ajoutez vos valeurs

# Lancer le serveur de développement
npm run dev
```

Le projet sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite).

## 🔐 Configuration pour GitHub Pages

Pour déployer sur GitHub Pages avec votre token GitHub sans l'exposer dans le code :

1. **Créez un token GitHub** (si vous ne l'avez pas déjà) :
   - Allez sur [https://github.com/settings/tokens](https://github.com/settings/tokens)
   - Cliquez sur "Generate new token (classic)"
   - Cochez la permission `public_repo` (read-only)
   - Générez et copiez le token

2. **Configurez les secrets GitHub** :
   - Allez dans votre repository GitHub
   - Cliquez sur **Settings** → **Secrets and variables** → **Actions**
   - Cliquez sur **New repository secret**
   - Ajoutez deux secrets :
     - `VITE_GITHUB_USERNAME` : votre nom d'utilisateur GitHub
     - `VITE_GITHUB_TOKEN` : votre token GitHub

3. **Activez GitHub Pages** :
   - Allez dans **Settings** → **Pages**
   - Sous **Source**, sélectionnez **GitHub Actions**

4. **Le workflow se déclenchera automatiquement** :
   - À chaque push sur la branche `main`
   - Le token sera injecté de manière sécurisée pendant le build
   - Le site sera déployé sur GitHub Pages

⚠️ **Important** : Le token ne sera jamais visible dans le code source du site déployé, car il est injecté uniquement pendant le build via GitHub Actions.

## 🚀 Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile le projet pour la production
- `npm run preview` : Prévisualise le build de production
- `npm run lint` : Vérifie le code avec ESLint

## 📁 Structure du projet

```
src/
├── App.jsx                 # Composant racine avec gestion du boot screen
├── main.jsx               # Point d'entrée
├── apps/                  # Applications du portfolio
│   ├── About/            # Application "À propos"
│   ├── Projects/         # Application "Projets"
│   ├── Skills/           # Application "Compétences"
│   └── Contact/          # Application "Contact"
├── components/           # Composants réutilisables
│   ├── Desktop/         # Bureau principal
│   ├── DesktopIcon/     # Icônes du bureau (drag & drop)
│   ├── Window/          # Composant fenêtre (momentum, animations)
│   ├── Taskbar/         # Barre des tâches (heure, date, système)
│   ├── BootScreen/      # Écran de démarrage animé
│   ├── Wallpaper/       # Fond d'écran animé (shaders)
│   ├── AudioPlayer/     # Lecteur audio ambiant
│   ├── AudioVisualizer/ # Visualiseur de fréquences audio
│   ├── VolumeControl/   # Contrôle du volume
│   └── MobileBlock/     # Blocage des appareils mobiles
├── contexts/            # Contextes React
│   └── AudioContext.jsx # Gestion de l'audio global
├── hooks/               # Hooks personnalisés
│   └── useIsMobile.js   # Détection des appareils mobiles
└── styles/              # Styles globaux
    ├── global.css
    └── theme.css
```

## 🎯 Fonctionnalités principales

### Gestion des fenêtres
- Ouverture/fermeture via double-clic sur les icônes
- Déplacement par glisser-déposer avec effet de momentum/inertie
- Animations de fermeture fluides
- Gestion du z-index pour la superposition (clic pour mettre au premier plan)
- Positions adaptatives selon la taille de l'écran

### Gestion des icônes
- Déplacement par glisser-déposer avec grille magnétique adaptative
- Détection et prévention des collisions entre icônes
- Positions initiales calculées dynamiquement
- Réorganisation libre sur le bureau

### Audio et ambiance
- Lecture automatique d'audio ambiant au démarrage
- Visualiseur de fréquences en temps réel dans la barre des tâches
- Contrôle du volume avec slider et mute/unmute
- Analyse audio via Web Audio API

### Interface utilisateur
- Écran de boot avec messages système et barre de progression
- Design glassmorphique avec effets de transparence
- Animations fluides et transitions
- Barre des tâches avec informations système (heure, date, batterie, Wi-Fi)
- Wallpaper animé avec shaders Three.js
- Blocage des appareils mobiles pour une expérience desktop optimale

## 📝 Licence

Ce projet est privé et personnel.

---

Développé avec ❤️ en utilisant React et Vite
