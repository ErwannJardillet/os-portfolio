> ⚠️ **Work In Progress** — Ce projet est actuellement en développement actif. Les fonctionnalités peuvent changer et certaines parties peuvent être incomplètes.

# OS Portfolio — React + Vite

Un portfolio interactif présenté comme un système d'exploitation fictif. Explorez mes projets, compétences et informations de contact à travers une interface immersive simulant un environnement de bureau moderne.

🌐 **Site en ligne** : [https://os-portfolio-steel.vercel.app/](https://os-portfolio-steel.vercel.app/)

## 🎨 Caractéristiques

- **Interface OS-like** : Expérience utilisateur similaire à un système d'exploitation avec bureau, icônes et fenêtres
- **Glassmorphisme** : Design moderne avec effets de verre dépoli et transparence
- **Fenêtres interactives** : Fenêtres déplaçables, redimensionnables et minimisables
- **Icônes déplaçables** : Réorganisez les icônes sur le bureau par glisser-déposer
- **Wallpaper animé** : Fond d'écran avec shader gradient animé utilisant Three.js
- **Applications intégrées** :
  - **À propos** : Présentation personnelle
  - **Projets** : Portfolio de réalisations
  - **Compétences** : Technologies maîtrisées
  - **Contact** : Informations de contact

## 🛠️ Technologies

- **React 19** : Framework UI moderne
- **Vite** : Build tool rapide et optimisé
- **Three.js** : Rendu 3D et shaders pour le wallpaper
- **@react-three/fiber** : Intégration React pour Three.js
- **@shadergradient/react** : Gradients animés avec shaders
- **CSS Modules** : Styles modulaires et encapsulés
- **State Management** : Gestion d'état custom avec React Hooks

## 📦 Installation

```bash
# Cloner le repository
git clone <repository-url>
cd os-portfolio

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le projet sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite).

## 🚀 Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile le projet pour la production
- `npm run preview` : Prévisualise le build de production
- `npm run lint` : Vérifie le code avec ESLint

## 📁 Structure du projet

```
src/
├── App.jsx                 # Composant racine
├── main.jsx               # Point d'entrée
├── apps/                  # Applications du portfolio
│   ├── About/            # Application "À propos"
│   ├── Projects/         # Application "Projets"
│   ├── Skills/           # Application "Compétences"
│   └── Contact/          # Application "Contact"
├── components/           # Composants réutilisables
│   ├── Desktop/         # Bureau principal
│   ├── DesktopIcon/     # Icônes du bureau
│   ├── Window/          # Composant fenêtre
│   ├── Taskbar/         # Barre des tâches
│   └── Wallpaper/       # Fond d'écran animé
└── styles/              # Styles globaux
    ├── global.css
    └── theme.css
```

## 🎯 Fonctionnalités principales

### Gestion des fenêtres
- Ouverture/fermeture via double-clic sur les icônes
- Déplacement par glisser-déposer
- Gestion du z-index pour la superposition
- Prévention des collisions entre icônes

### Interface utilisateur
- Design glassmorphique avec effets de transparence
- Animations fluides
- Responsive design
- Thème moderne et futuriste

## 🔮 À venir

- [ ] Système de minimisation des fenêtres
- [ ] Redimensionnement des fenêtres
- [ ] Thèmes personnalisables
- [ ] Plus d'applications
- [ ] Animations supplémentaires
- [ ] Optimisations de performance

## 📝 Licence

Ce projet est privé et personnel.

---

Développé avec ❤️ en utilisant React et Vite
