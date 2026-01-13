# État des lieux - OS Portfolio

**Date:** 2025-01-27  
**Type:** Application frontend React (SPA statique)  
**Version:** 0.0.0

---

## 1. System Overview

### Architecture générale
Application React 19.2.0 monolithique, frontend-only, déployable en statique (pas de backend). Concept : portfolio interactif présenté comme un système d'exploitation fictif avec bureau, fenêtres draggables, icônes, barre des tâches.

### Modules et responsabilités

| Module | Fichier | Responsabilité |
|--------|---------|----------------|
| **Desktop** | `src/components/Desktop/Desktop.jsx` | Composant racine, orchestre fenêtres, icônes, état global (windows, iconPositions, selectedIcon) |
| **Window** | `src/components/Window/Window.jsx` | Fenêtre draggable, gestion z-index, focus, close, contraintes de position |
| **DesktopIcon** | `src/components/DesktopIcon/DesktopIcon.jsx` | Icône draggable avec snap sur grille, détection collisions, double-clic pour ouvrir |
| **Taskbar** | `src/components/Taskbar/Taskbar.jsx` | Barre système (horloge, batterie simulée, WiFi) |
| **Apps** | `src/apps/*/` | Contenu statique : About, Contact, Projects, Skills |

### Structure des dépendances

```
main.jsx (point d'entrée)
  └── App.jsx
      └── Desktop (état global)
          ├── DesktopIcon × 4 (About, Projects, Contact, Skills)
          ├── Window × N (dynamique selon ouverture)
          └── Taskbar (isolé, état local)
```

**Point d'entrée:** `src/main.jsx` → `App.jsx` → `Desktop`

### Technologies et dépendances

**Core:**
- React 19.2.0 + React DOM
- Vite 7.2.4 (build tool)
- Pas de routing (SPA monolithique)
- Pas de state management externe (useState local)

**Build & Dev:**
- ESLint 9.39.1 (config React hooks)
- @vitejs/plugin-react

**External:**
- Google Fonts (Orbitron, Space Grotesk, Inter) - chargement asynchrone

### Environnement

**Développement:**
- `npm run dev` → Vite dev server (port par défaut: 5173)
- Hot reload activé
- Pas de variables d'environnement requises

**Production:**
- `npm run build` → build statique dans `dist/`
- Déploiement: serveur web statique (Nginx, Vercel, Netlify, etc.)
- Pas de backend requis

---

## 2. Architecture & Constraints

### Patterns existants

1. **State Management:** useState local (pas de Context/Redux)
   - État centralisé dans `Desktop` (windows, iconPositions)
   - État isolé dans composants feuilles (Taskbar: horloge locale)

2. **Composition de composants:**
   - Pattern "componentMap" pour mapper string → composant React (ligne 12-17 Desktop.jsx)
   - Props drilling modéré (Desktop → Window → children)

3. **Gestion d'événements:**
   - Handlers inline dans JSX
   - Pas de custom hooks partagés
   - Event listeners DOM natifs pour drag (Window, DesktopIcon)

4. **Styling:**
   - CSS Modules (`.module.css` par composant)
   - Variables CSS (`theme.css`) pour polices
   - Pas de framework CSS (Tailwind, etc.)

### Conventions de code

- **Naming:** PascalCase pour composants, camelCase pour fonctions/variables
- **Fichiers:** 1 composant = 1 fichier `.jsx` + 1 `.module.css`
- **Structure:** Composants UI dans `components/`, applications dans `apps/`
- **Pas de TypeScript:** JavaScript pur

### Limites architecturales

1. **Pas de routing:** Impossible d'avoir des URLs dédiées (ex: `/about`, `/projects`)
2. **State non persisté:** Positions d'icônes perdues au refresh
3. **Pas de state management global:** Difficile de partager état entre composants distants
4. **Pas de services/API:** Contenu hardcodé dans les composants `apps/`
5. **Pas de tests:** Aucun test unitaire/e2e détecté

### Contraintes techniques

- **React 19.2.0:** Nouvelle version, vérifier compatibilité avec certaines libs
- **Pas de polyfills:** Cible navigateurs modernes (ES2020+)
- **CSS Modules:** Scoping automatique, pas d'injection globale (sauf `global.css`, `theme.css`)
- **Images statiques:** Servies depuis `/public/icons/`

### Risques identifiés

| Risque | Impact | Probabilité | Mitigation suggérée |
|--------|--------|-------------|---------------------|
| État complexe dans Desktop | Moyen | Élevé | Extraire vers Context API ou state manager |
| Pas de tests | Élevé | Élevé | Ajouter tests (Vitest + React Testing Library) |
| Performance avec beaucoup de fenêtres | Faible | Faible | Optimisation actuelle suffisante |
| Compatibilité navigateurs | Moyen | Faible | Tester sur navigateurs cibles |

---

## 3. Map des flux critiques

### Flux d'ouverture de fenêtre

```
User double-clique icône
  → DesktopIcon.onOpen()
  → Desktop.openWindow(windowData)
  → Desktop.setState(windows: [...prev, newWindow])
  → Render: windows.map() → Window + componentMap[component]
```

**Points critiques:**
- Détection double-clic vs drag (DesktopIcon: `hasDraggedRef`)
- Gestion z-index automatique (max + 1)
- Prévention doublons (vérification `exists` avant ajout)

### Flux de gestion des icônes

```
User drag icône
  → DesktopIcon: mouse events → setCurrentPosition
  → onPositionChange(finalPosition)
  → Desktop.handleIconPositionChange()
  → findNearestFreePosition() (détection collisions)
  → setIconPositions({...prev, [id]: freePosition})
```

**Points critiques:**
- Algorithme de collision (rectangles, chevauchement horizontal ET vertical)
- Snap sur grille (GRID_SIZE = 100px)
- Recherche spirale si collision

### Flux de focus/fermeture

```
User clique titleBar
  → Window.onFocus(id)
  → Desktop.handleFocus(id)
  → Recalcul z-index (fenêtre cliquée = max + 1)

User clique bouton close
  → Window.onClose(id)
  → Desktop.handleClose(id)
  → Filter windows (remove by id)
```

### Flux de données (inexistants)

**Auth:** Aucun  
**API externes:** Aucune  
**Paiements:** Aucun  
**Realtime:** Aucun  
**Base de données:** Aucune  
**Storage:** Aucun (pas de localStorage/sessionStorage)

**Données:** Contenu statique hardcodé dans composants `apps/` (About, Contact, Projects, Skills)

---

## 4. Debt & Risks Log

### Technical Debt critique

1. **État centralisé dans Desktop.jsx (294 lignes)**
   - **Problème:** Composant trop lourd, logique métier mélangée avec UI
   - **Impact:** Difficile à tester, maintenir, étendre
   - **Solution suggérée:** Extraire logique dans custom hooks (`useWindows`, `useIcons`)

2. **Pas de tests**
   - **Problème:** Aucune garantie de non-régression
   - **Impact:** Risque élevé lors d'ajout de fonctionnalités
   - **Solution suggérée:** Vitest + React Testing Library, tests critiques (drag, focus, collisions)

3. **Positions d'icônes non persistées**
   - **Problème:** Utilisateur perd configuration au refresh
   - **Impact:** UX dégradée
   - **Solution suggérée:** localStorage dans `handleIconPositionChange`

4. **Contenu hardcodé dans apps/**
   - **Problème:** Impossible de modifier contenu sans redéployer
   - **Impact:** Maintenance fastidieuse
   - **Solution suggérée:** JSON/YAML externe ou CMS headless

5. **Pas de gestion d'erreurs**
   - **Problème:** Aucun try/catch, pas de ErrorBoundary
   - **Impact:** Crash possible en production
   - **Solution suggérée:** ErrorBoundary React, logging erreurs

### Technical Debt modérée

6. **Constants magiques dispersées**
   - Exemples: `ICON_WIDTH = 80`, `GRID_SIZE = 100`, `TASKBAR_HEIGHT = 52`
   - **Solution:** Fichier `constants.js` centralisé

7. **Duplication de logique drag**
   - Window et DesktopIcon ont logique drag similaire mais séparée
   - **Solution:** Hook partagé `useDrag`

8. **Batterie/WiFi hardcodés (Taskbar)**
   - Valeurs statiques, pas de vraie détection
   - **Note:** Acceptable pour un portfolio, mais documenter comme simulation

### Risques pour l'ajout de fonctionnalités

| Fonctionnalité future | Risque | Blocage identifié |
|-----------------------|--------|-------------------|
| **Routing (URLs)** | Élevé | Pas de router installé, architecture SPA monolithique |
| **State management avancé** | Moyen | État dans Desktop, refactor nécessaire |
| **API backend** | Faible | Architecture frontend-only, ajout backend = nouveau projet |
| **Internationalisation (i18n)** | Moyen | Textes hardcodés, pas de lib i18n |
| **Authentification** | Élevé | Pas d'infrastructure auth, besoin backend |
| **Données dynamiques** | Moyen | Contenu statique, besoin state management + API |
| **Tests** | Faible | Infrastructure à créer mais pas de blocage technique |

### Recommandations prioritaires

1. **Court terme:**
   - Ajouter ErrorBoundary
   - Extraire constants
   - Documenter patterns existants

2. **Moyen terme:**
   - Tests critiques (drag, focus)
   - Persistance positions icônes (localStorage)
   - Refactor Desktop (custom hooks)

3. **Long terme (si évolution):**
   - Évaluer besoin routing (React Router)
   - State management (Context API ou Zustand)
   - Séparation contenu/configuration (JSON/CMS)

---

## Annexes

### Structure fichiers complète

```
src/
├── main.jsx                    # Point d'entrée
├── App.jsx                     # Wrapper (juste Desktop)
├── styles/
│   ├── global.css             # Reset CSS
│   └── theme.css              # Variables CSS (polices)
├── components/
│   ├── Desktop/               # Orchestrateur principal
│   ├── Window/                # Fenêtre draggable
│   ├── DesktopIcon/           # Icône draggable
│   └── Taskbar/               # Barre système
└── apps/                      # Contenu statique
    ├── About/
    ├── Contact/
    ├── Projects/
    └── Skills/
```

### Scripts disponibles

- `npm run dev` - Démarre serveur de développement
- `npm run build` - Build production (output: `dist/`)
- `npm run lint` - Lint ESLint
- `npm run preview` - Preview build production
