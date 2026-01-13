# Design de Solution par Lot - OS Portfolio

**Date:** 2025-01-27  
**Version:** 1.0  
**Auteurs:** Winston (Architect) & Sally (UX Expert)  
**Contexte:** Design de solution pour éviter le développement story par story sans cohérence globale

---

## Vue d'ensemble

Ce document définit les décisions d'architecture, les flux UX/UI, et les contrats nécessaires pour le développement par lots du backlog de finalisation. Chaque lot regroupe des fonctionnalités cohérentes pour assurer une cohérence architecturale et UX.

---

## Lot 1 : Système de fond d'écran (M2, M3, M4)

### Décisions d'architecture

#### Contrats API
- **Aucune API externe** : Système 100% frontend
- **Three.js Integration** : Utilisation de `@react-three/fiber` pour intégration React
- **ShaderGradient Integration** : Utilisation de `@shadergradient/react` avec peer dependencies

#### Modèle de données

```javascript
// src/constants/wallpaper.js
export const WALLPAPER_TYPES = {
  SPHERES_3D: 'spheres-3d',
  SHADER_GRADIENT: 'shader-gradient',
  // Extensible pour futurs types
};

// État wallpaper (dans Desktop ou Context)
{
  currentWallpaper: WALLPAPER_TYPES.SPHERES_3D,
  wallpaperConfig: {
    [WALLPAPER_TYPES.SPHERES_3D]: {
      sphereCount: 20,
      gravity: 0.5,
      mouseInteraction: true,
    },
    [WALLPAPER_TYPES.SHADER_GRADIENT]: {
      preset: 'default', // ou config personnalisée
    }
  }
}
```

#### États UI
- **Loading State** : Fond d'écran par défaut (couleur unie) pendant chargement Three.js
- **Active State** : Fond d'écran actif (sphères ou gradient)
- **Settings State** : Interface Settings ouverte pour changer de fond
- **Error State** : Fallback vers fond uni si WebGL non supporté

#### Gestion d'erreurs
- **WebGL Detection** : Vérifier support WebGL avant initialisation Three.js
- **ErrorBoundary** : Isoler erreurs Three.js pour éviter crash complet
- **Fallback Strategy** : En cas d'erreur → fond d'écran CSS dégradé simple
- **Loading Timeout** : Si Three.js ne charge pas en < 3s → fallback

### UX Flows / UI States

#### Flow principal : Affichage fond d'écran
```
[Chargement page]
  → Vérification WebGL support
  → Si OK: Initialisation Three.js
  → Si échec: Fallback CSS dégradé
  → Affichage fond actif
```

#### Flow : Changement de fond (via Settings)
```
[Ouverture Settings]
  → Affichage liste des fonds disponibles
  → Sélection nouveau fond
  → Transition fluide (fade 300ms)
  → Nouveau fond actif
  → Sauvegarde préférence (localStorage)
```

#### Écrans/Composants

**1. Composant WallpaperProvider**
- Position : `src/components/Wallpaper/WallpaperProvider.jsx`
- Responsabilité : Gestion état wallpaper global, initialisation Three.js
- Props : Aucune (provider contextuel)

**2. Composant WallpaperSpheres**
- Position : `src/components/Wallpaper/WallpaperSpheres.jsx`
- Responsabilité : Rendu sphères 3D avec Three.js
- Props :
  - `sphereCount: number`
  - `gravity: number`
  - `mouseInteraction: boolean`

**3. Composant WallpaperShaderGradient**
- Position : `src/components/Wallpaper/WallpaperShaderGradient.jsx`
- Responsabilité : Rendu gradient shader
- Props :
  - `preset: string`

**4. App Settings**
- Position : `src/apps/Settings/Settings.jsx`
- Responsabilité : Interface de sélection fond d'écran
- État : Liste des fonds disponibles, fond actuel
- Actions : Changement de fond

#### Empty States
- **Pas de fond actif** : Affichage fond par défaut (couleur unie du thème)

#### Cas d'erreur
- **WebGL non supporté** : Message discret + fond CSS de fallback
- **Erreur Three.js** : ErrorBoundary capture → fallback fond CSS
- **Erreur ShaderGradient** : Fallback vers sphères 3D ou fond CSS

### Contrats

#### Schémas de données
```typescript
// Types (documentation, pas TypeScript réel)
type WallpaperType = 'spheres-3d' | 'shader-gradient';
type WallpaperConfig = {
  currentWallpaper: WallpaperType;
  wallpaperConfig: {
    'spheres-3d': {
      sphereCount: number;
      gravity: number;
      mouseInteraction: boolean;
    };
    'shader-gradient': {
      preset: string;
    };
  };
};
```

#### Events (pas de realtime, événements React)
- `wallpaper:change` : Événement interne React (via Context/State)
- `wallpaper:error` : Erreur capturée par ErrorBoundary

#### Permissions
- **Aucune permission requise** : Application frontend-only

---

## Lot 2 : Animations & Loading (M5, M6)

### Décisions d'architecture

#### Contrats API
- **Aucune API externe**

#### Modèle de données

```javascript
// État loading (dans App.jsx ou Desktop)
{
  isLoading: boolean,
  loadingProgress: number, // 0-100 (optionnel)
}

// État animation entrée
{
  hasEntered: boolean, // Flag après animation d'entrée
}
```

#### États UI
- **Initial Loading** : Écran de chargement avant affichage Desktop
- **Entry Animation** : Animation d'entrée après chargement
- **Desktop Ready** : État normal (Desktop affiché)
- **Error State** : Si chargement échoue → affichage direct sans animation

#### Gestion d'erreurs
- **Loading Timeout** : Si chargement > 5s → afficher Desktop quand même
- **Animation Error** : Si animation CSS/JS échoue → skip animation, afficher Desktop
- **ErrorBoundary** : Capturer erreurs pendant animation

### UX Flows / UI States

#### Flow : Chargement initial
```
[Page charge]
  → Affichage LoadingScreen
  → Chargement ressources critiques (fonts, Three.js si nécessaire)
  → Détection chargement complet
  → Transition vers animation d'entrée
  → Animation d'entrée (waou effect)
  → Affichage Desktop
```

#### Écrans/Composants

**1. Composant LoadingScreen**
- Position : `src/components/LoadingScreen/LoadingScreen.jsx`
- Responsabilité : Affichage écran de chargement
- Design : Animé, moderne, cohérent avec thème
- Durée : Max 2-3s (optimisé pour ressources)

**2. Animation EntryEffect**
- Position : `src/components/EntryEffect/EntryEffect.jsx`
- Responsabilité : Animation d'entrée "waou"
- Type : Fade-in + scale + effet visuel (particles/glow optionnel)
- Durée : 800ms - 1200ms

**3. Orchestration dans App.jsx**
- Gestion séquence : LoadingScreen → EntryEffect → Desktop
- État : `loadingState: 'loading' | 'entering' | 'ready'`

#### Transitions
- **Loading → Entry** : Fade out loading (300ms) + fade in entry (300ms)
- **Entry → Desktop** : Fade out entry (300ms) + fade in desktop (300ms)
- **Total transition** : ~900ms fluide

#### Empty States
- N/A (loading/entry ne gèrent pas de données)

#### Cas d'erreur
- **Chargement timeout** : Skip loading, afficher Desktop directement
- **Animation CSS manquante** : Skip animation, afficher Desktop
- **Erreur JavaScript** : ErrorBoundary → affichage Desktop sans animation

### Contrats

#### Schémas de données
```typescript
type LoadingState = 'loading' | 'entering' | 'ready' | 'error';
type LoadingConfig = {
  state: LoadingState;
  progress?: number; // 0-100
};
```

#### Events
- `loading:complete` : Chargement terminé
- `entry:complete` : Animation entrée terminée
- `entry:error` : Erreur animation (skip)

#### Permissions
- **Aucune**

---

## Lot 3 : Infrastructure & Qualité (M7, M8, M9, M10, M11, M12)

### Décisions d'architecture

#### Contrats API
- **npm audit** : Outil CLI, pas d'API
- **GitHub Pages** : Déploiement via GitHub Actions (pas d'API directe)
- **Bundle analysis** : Vite build analyzer

#### Modèle de données

```javascript
// ErrorBoundary State
{
  hasError: boolean,
  error: Error | null,
  errorInfo: ReactErrorInfo | null,
}

// Build configuration (vite.config.js)
{
  build: {
    outDir: 'dist',
    sourcemap: false, // Production
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three', '@react-three/fiber'],
          'vendor': ['react', 'react-dom'],
        }
      }
    }
  }
}
```

#### États UI
- **Error State** : Affichage ErrorBoundary (composant fallback)
- **Normal State** : Application fonctionnelle
- **Build State** : Processus build (hors UI)

#### Gestion d'erreurs
- **ErrorBoundary Strategy** : 
  - Capturer erreurs React
  - Logger erreur (console.error)
  - Afficher UI de fallback (pas de crash blanc)
  - Bouton "Recharger" pour récupérer
- **Error Logging** : Console uniquement (pas de service externe pour MVP)
- **Build Errors** : Vite affiche erreurs dans terminal

### UX Flows / UI States

#### Flow : Gestion erreur runtime
```
[Erreur JavaScript/React]
  → ErrorBoundary capture erreur
  → Logger erreur (console.error)
  → Afficher composant ErrorFallback
  → User peut recharger page
```

#### Écrans/Composants

**1. Composant ErrorBoundary**
- Position : `src/components/ErrorBoundary/ErrorBoundary.jsx`
- Responsabilité : Capturer erreurs React, afficher fallback
- Pattern : Class component (React Error Boundary requirement)
- Placement : Autour de `<Desktop />` dans App.jsx

**2. Composant ErrorFallback**
- Position : `src/components/ErrorBoundary/ErrorFallback.jsx`
- Responsabilité : UI de fallback en cas d'erreur
- Design : Message clair, bouton "Recharger la page"
- Style : Cohérent avec thème (glassmorphism)

**3. Documentation README.md**
- Sections requises :
  - Installation
  - Scripts disponibles
  - Build & déploiement GitHub Pages
  - Architecture (référence à etat-des-lieux.md)
  - Technologies utilisées

#### Cas d'erreur
- **Erreur composant** : ErrorBoundary capture → ErrorFallback affiché
- **Erreur build** : Vite affiche dans terminal, build échoue
- **Vulnérabilité npm** : `npm audit fix` ou mise à jour manuelle

### Contrats

#### Schémas de données
```typescript
type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: {
    componentStack: string;
  } | null;
};
```

#### Events
- `error:boundary` : Erreur capturée par ErrorBoundary (interne React)
- `error:logged` : Erreur loggée (console.error)

#### Permissions
- **GitHub Pages** : Permissions repository pour déploiement
- **npm audit** : Aucune permission (lecture package-lock.json)

---

## Lot 4 : Apps enrichies (S2, S3)

### Décisions d'architecture

#### Contrats API

**GitHub API (S2 - App Projets)**
- **Endpoint** : `GET https://api.github.com/users/{username}/repos`
- **Authentication** : Aucune requise pour repos publics
- **Rate Limiting** : 60 requêtes/heure (sans auth)
- **Response Format** : JSON array de repositories
- **Caching Strategy** : 
  - Cache localStorage (key: `github-repos-{username}`, TTL: 1h)
  - Fetch si cache expiré ou inexistant

**Schéma API GitHub Repository**
```json
{
  "id": number,
  "name": string,
  "full_name": string,
  "description": string | null,
  "html_url": string,
  "stargazers_count": number,
  "forks_count": number,
  "language": string | null,
  "updated_at": string,
  "topics": string[]
}
```

#### Modèle de données

```javascript
// App Projets State
{
  repositories: GitHubRepo[],
  loading: boolean,
  error: string | null,
  filters: {
    language: string | null,
    search: string,
  }
}

// App Skills State (gravité logos)
{
  skills: Skill[],
  windowPosition: { x: number, y: number }, // Pour effet gravité
  isDragging: boolean,
}

// Skill Model
{
  id: string,
  name: string,
  logo: string,
  category: 'language' | 'framework' | 'tool',
  position: { x: number, y: number }, // Position dans canvas
  velocity: { x: number, y: number }, // Pour physique
}
```

#### États UI

**App Projets**
- **Loading** : Skeleton ou spinner pendant fetch GitHub
- **Success** : Liste repos affichée (cards)
- **Empty** : Message "Aucun repository public"
- **Error** : Message d'erreur + bouton réessayer
- **Filtered** : Liste filtrée affichée

**App Skills**
- **Normal** : Logos positionnés normalement
- **Dragging** : Logos réagissent à mouvement fenêtre (gravité)
- **Settled** : Logos au repos après mouvement

#### Gestion d'erreurs

**GitHub API**
- **Network Error** : Afficher message erreur, bouton réessayer
- **Rate Limit** : Afficher message "Trop de requêtes", utiliser cache si disponible
- **404 User** : Afficher message "Utilisateur non trouvé"
- **Timeout** : Timeout 10s, afficher erreur si dépassé
- **Cache Fallback** : Si erreur réseau, utiliser cache si disponible

**App Skills**
- **WebGL Error** : Fallback vers positionnement CSS statique (pas de gravité)
- **Performance** : Limiter nombre de logos si performance dégradée

### UX Flows / UI States

#### Flow : App Projets - Chargement repos
```
[Ouverture App Projets]
  → Vérifier cache localStorage
  → Si cache valide : Afficher repos du cache
  → Si cache expiré/inexistant : Fetch GitHub API
  → État Loading
  → Si succès : Afficher repos, sauvegarder cache
  → Si erreur : Afficher message erreur, utiliser cache si disponible
```

#### Flow : App Projets - Filtrage
```
[User tape dans filtre recherche]
  → Filtrage client-side (pas de nouvelle requête API)
  → Mise à jour liste affichée en temps réel
```

#### Flow : App Skills - Effet gravité
```
[User déplace fenêtre Skills]
  → Détecter mouvement fenêtre
  → Calculer force gravité (direction centre fenêtre)
  → Animer logos avec physique (velocity, acceleration)
  → Logos "tombent" vers centre
  → Après arrêt mouvement : Logos se stabilisent
```

#### Écrans/Composants

**1. App Projets (enrichie)**
- Position : `src/apps/Projects/Projects.jsx`
- Nouveaux composants :
  - `ProjectCard.jsx` : Card repo GitHub
  - `ProjectFilters.jsx` : Filtres recherche/langage
  - `ProjectList.jsx` : Liste repos
- Service : `src/services/githubService.js` (fetch + cache)

**2. App Skills (gravité)**
- Position : `src/apps/Skills/Skills.jsx`
- Nouveaux composants :
  - `SkillCanvas.jsx` : Canvas pour logos avec physique
  - `SkillLogo.jsx` : Logo individuel avec position/velocity
- Hook : `useWindowPosition.js` (détecter mouvement fenêtre parent)
- Physique : Calcul gravité basique (pas de lib externe, math simple)

#### Empty States

**App Projets**
- **Aucun repo** : Message "Aucun repository public trouvé"
- **Filtre vide** : Message "Aucun résultat pour cette recherche"
- **Erreur réseau + pas de cache** : Message erreur + bouton réessayer

**App Skills**
- N/A (skills hardcodées, toujours présentes)

#### Cas d'erreur

**App Projets**
- **Erreur réseau** : Message + bouton réessayer + cache fallback
- **Rate limit** : Message + utilisation cache
- **Timeout** : Message + bouton réessayer
- **User 404** : Message "Utilisateur GitHub non trouvé" (configurable)

**App Skills**
- **Performance dégradée** : Désactiver effet gravité automatiquement
- **WebGL non supporté** : Fallback CSS statique

### Contrats

#### Schémas de données

```typescript
// GitHub Repository
type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
};

// Cache GitHub
type GitHubCache = {
  repos: GitHubRepo[];
  timestamp: number; // Date.now()
  username: string;
};

// Skill
type Skill = {
  id: string;
  name: string;
  logo: string;
  category: 'language' | 'framework' | 'tool';
};
```

#### Events

**App Projets**
- `projects:fetch:start` : Début fetch GitHub
- `projects:fetch:success` : Fetch réussi
- `projects:fetch:error` : Erreur fetch
- `projects:filter:change` : Changement filtre

**App Skills**
- `skills:window:move` : Mouvement fenêtre détecté
- `skills:gravity:apply` : Application gravité
- `skills:settle` : Logos stabilisés

#### Permissions

- **GitHub API** : Aucune pour repos publics
- **localStorage** : Lecture/écriture pour cache

---

## Lot 5 : Audio & UX (S1)

### Décisions d'architecture

#### Contrats API
- **Aucune API externe**
- **Web Audio API** : API native navigateur pour visualiseur

#### Modèle de données

```javascript
// Audio State (dans Taskbar ou Context global)
{
  isPlaying: boolean,
  volume: number, // 0-1
  currentTrack: string | null,
  audioContext: AudioContext | null,
  analyserNode: AnalyserNode | null,
}
```

#### États UI
- **Stopped** : Audio arrêté, pas de visualisation
- **Playing** : Audio en lecture, visualiseur actif
- **Loading** : Chargement fichier audio
- **Error** : Erreur chargement/lecture audio

#### Gestion d'erreurs
- **Audio Load Error** : Afficher message erreur discret, désactiver audio
- **Autoplay Blocked** : Ne pas autoplay (politique navigateurs), bouton play manuel
- **Format Not Supported** : Fallback vers autre format ou message erreur
- **Performance** : Si performance dégradée → désactiver visualiseur, garder audio

### UX Flows / UI States

#### Flow : Activation audio
```
[User clique bouton play dans Taskbar]
  → Vérifier autoplay policy (si première interaction)
  → Charger fichier audio
  → Initialiser AudioContext + AnalyserNode
  → Démarrer lecture
  → Afficher visualiseur (barres animées)
```

#### Flow : Visualisation audio
```
[Audio en lecture]
  → AnalyserNode récupère données fréquences (60fps)
  → Calculer amplitudes par bande de fréquences
  → Mettre à jour barres visualiseur
  → Animation fluide (60fps)
```

#### Écrans/Composants

**1. Composant AudioPlayer (dans Taskbar)**
- Position : `src/components/Taskbar/AudioPlayer.jsx`
- Responsabilité : Contrôle audio (play/pause, volume)
- Integration : Dans Taskbar, à côté de l'horloge

**2. Composant AudioVisualizer**
- Position : `src/components/Taskbar/AudioVisualizer.jsx`
- Responsabilité : Barres audio animées
- Design : Barres verticales animées (8-16 barres)
- Style : Cohérent avec thème (glassmorphism, couleurs thème)

**3. Service AudioService**
- Position : `src/services/audioService.js`
- Responsabilité : Gestion AudioContext, AnalyserNode, lecture audio
- Pattern : Singleton ou hook `useAudio`

#### Transitions
- **Play → Pause** : Barres visualiseur se figent progressivement (200ms)
- **Pause → Play** : Barres redémarrent animation (200ms)

#### Empty States
- N/A (audio optionnel, pas de données)

#### Cas d'erreur
- **Autoplay blocked** : Bouton play visible, pas d'autoplay
- **Format non supporté** : Message erreur discret
- **Erreur chargement** : Message erreur, désactiver audio
- **Performance** : Désactiver visualiseur, garder audio si performance OK

### Contrats

#### Schémas de données
```typescript
type AudioState = {
  isPlaying: boolean;
  volume: number; // 0-1
  currentTrack: string | null;
  audioContext: AudioContext | null;
  analyserNode: AnalyserNode | null;
};

type AudioVisualizerData = {
  frequencies: Uint8Array; // Données fréquences (0-255)
  amplitudes: number[]; // Amplitudes par bande (0-1)
};
```

#### Events
- `audio:play` : Début lecture
- `audio:pause` : Pause
- `audio:volume:change` : Changement volume
- `audio:error` : Erreur audio
- `audio:visualizer:update` : Mise à jour données visualiseur (60fps)

#### Permissions
- **Aucune** : Web Audio API native, pas de permission utilisateur

---

## Lot 6 : Refactor & Polish (S4, S5, S6, S7, S8, S9, S10, S11, S12)

### Décisions d'architecture

#### Contrats API
- **localStorage API** : API native navigateur (S5 - Persistance positions)

#### Modèle de données

```javascript
// Constants centralisées (S7)
// src/constants/index.js
export const ICON_WIDTH = 80;
export const ICON_HEIGHT = 100;
export const GRID_SIZE = 100;
export const TASKBAR_HEIGHT = 52;
export const WINDOW_MIN_WIDTH = 300;
export const WINDOW_MIN_HEIGHT = 200;

// Persistance positions (S5)
// localStorage key: 'os-portfolio-icon-positions'
{
  about: { x: number, y: number },
  projects: { x: number, y: number },
  contact: { x: number, y: number },
  skills: { x: number, y: number },
}

// Custom Hooks (S6, S9)
// useWindows.js, useIcons.js, useDrag.js
```

#### États UI
- **Normal** : Application fonctionnelle
- **Loading Persistence** : Chargement positions depuis localStorage
- **Saving Persistence** : Sauvegarde positions (transparent)

#### Gestion d'erreurs
- **localStorage Error** : Si quota exceeded ou disabled → skip persistance, continuer normalement
- **Invalid Data** : Si données localStorage invalides → utiliser positions par défaut

### UX Flows / UI States

#### Flow : Chargement positions icônes (S5)
```
[Chargement Desktop]
  → Lire localStorage 'os-portfolio-icon-positions'
  → Si valide : Utiliser positions sauvegardées
  → Si invalide/absent : Utiliser positions par défaut
  → Afficher icônes aux positions
```

#### Flow : Sauvegarde positions (S5)
```
[User déplace icône]
  → Position mise à jour dans state
  → Débounce 500ms
  → Sauvegarder dans localStorage
  → (Transparent pour user)
```

#### Flow : Refactor Desktop (S6)
```
[Refactor Desktop.jsx]
  → Extraire logique windows → useWindows hook
  → Extraire logique icons → useIcons hook
  → Desktop.jsx devient orchestrateur uniquement
  → Réduction ~294 lignes → ~150 lignes
```

#### Écrans/Composants

**1. Hooks personnalisés**
- `src/hooks/useWindows.js` : Gestion état fenêtres (open, close, focus, z-index)
- `src/hooks/useIcons.js` : Gestion positions icônes + persistance localStorage
- `src/hooks/useDrag.js` : Logique drag partagée (Window + DesktopIcon)
- `src/hooks/useLocalStorage.js` : Hook générique persistance localStorage

**2. Constants**
- `src/constants/index.js` : Toutes constantes centralisées

**3. Desktop refactoré**
- `src/components/Desktop/Desktop.jsx` : Orchestrateur uniquement, utilise hooks

**4. Animations fenêtres améliorées (S4)**
- `src/components/Window/Window.jsx` : Ajout animations scale + fade
- CSS transitions améliorées

#### Transitions

**Animations fenêtres (S4)**
- **Ouverture** : Scale 0.8 → 1.0 + Fade in (300ms)
- **Fermeture** : Scale 1.0 → 0.8 + Fade out (300ms)
- **Focus** : Légère scale up (1.0 → 1.02, 150ms) optionnel

#### Empty States
- N/A (refactor ne change pas fonctionnalités)

#### Cas d'erreur
- **localStorage quota exceeded** : Skip persistance, continuer normalement
- **localStorage disabled** : Skip persistance, continuer normalement
- **Données invalides** : Utiliser positions par défaut

### Contrats

#### Schémas de données

```typescript
// localStorage Persistence
type IconPositionsPersistence = {
  [iconId: string]: {
    x: number;
    y: number;
  };
};

// Hook useWindows
type UseWindowsReturn = {
  windows: Window[];
  openWindow: (windowData: WindowData) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
};

// Hook useIcons
type UseIconsReturn = {
  iconPositions: IconPositions;
  updateIconPosition: (id: string, position: Position) => void;
  loadPositions: () => void;
  savePositions: () => void;
};
```

#### Events
- `icons:position:change` : Changement position icône
- `icons:positions:loaded` : Positions chargées depuis localStorage
- `icons:positions:saved` : Positions sauvegardées (interne)

#### Permissions
- **localStorage** : Lecture/écriture (permission navigateur automatique)

---

## Décisions transversales

### Architecture globale

#### State Management
- **Approche actuelle maintenue** : useState local dans Desktop
- **Extensions futures possibles** : Context API si besoin partage état distant (ex: Audio, Wallpaper)
- **Pas de Redux/Zustand** : Overkill pour scope actuel

#### Performance
- **Code splitting** : Manuels chunks pour Three.js (éviter bundle unique)
- **Lazy loading** : Components Three.js chargés uniquement si nécessaire
- **Memoization** : React.memo sur composants coûteux si nécessaire
- **Bundle optimization** : Vite build avec optimisations automatiques

#### Error Handling Strategy
- **ErrorBoundary global** : Autour de Desktop dans App.jsx
- **Error logging** : Console uniquement (pas de service externe pour MVP)
- **Fallback UI** : Toujours afficher quelque chose (pas d'écran blanc)
- **Graceful degradation** : Fonctionnalités optionnelles (audio, Three.js) peuvent échouer sans bloquer app

#### Testing Strategy
- **Vitest + React Testing Library** : Infrastructure tests
- **Coverage cible** : 60% minimum code critique (Desktop, Window, DesktopIcon)
- **Tests prioritaires** : 
  - Détection collisions (useIcons)
  - Gestion z-index (useWindows)
  - Drag logic (useDrag)
  - ErrorBoundary

### UX/UI Patterns

#### Design System
- **Glassmorphism** : Style principal maintenu
- **Thème futuriste moderne** : Cohérence visuelle
- **Animations** : Fluides, 60fps, durées 200-300ms standard
- **Couleurs** : Variables CSS dans `theme.css`, pas de gradient purple/blue par défaut (règle utilisateur)

#### Transitions
- **Durée standard** : 300ms pour transitions principales
- **Easing** : ease-in-out standard
- **Loading states** : Toujours afficher indicateur si > 500ms

#### Accessibilité (S8)
- **Navigation clavier** : Tab, Enter, Escape
- **ARIA labels** : Labels explicites pour composants interactifs
- **Contraste** : Respecter WCAG AA minimum
- **Focus visible** : Indicateur focus clair

---

## Ordre d'implémentation recommandé

### Phase 1 : Fondations (Lots 3 partiel + 2)
1. ErrorBoundary (M7)
2. Loading screen + Animation entrée (M5, M6)
3. Build & déploiement (M8)

**Rationale** : Infrastructure de base avant fonctionnalités

### Phase 2 : Fond d'écran (Lot 1)
1. Sphères 3D (M2)
2. ShaderGradient (M3)
3. App Settings (M4)

**Rationale** : Fonctionnalité critique, impact visuel majeur

### Phase 3 : Apps enrichies (Lot 4)
1. App Projets GitHub (S2)
2. App Skills gravité (S3)

**Rationale** : Contenu enrichi, valeur utilisateur

### Phase 4 : Audio & UX (Lot 5)
1. Audio + Visualiseur (S1)

**Rationale** : Fonctionnalité standalone, peut être développée en parallèle

### Phase 5 : Refactor & Polish (Lot 6)
1. Constants (S7)
2. Persistance positions (S5)
3. Refactor Desktop (S6)
4. Hook useDrag (S9)
5. Animations fenêtres (S4)
6. Accessibilité (S8)
7. Tests (S10)
8. Documentation (S11)

**Rationale** : Amélioration qualité code, peut être fait progressivement

### Phase 6 : Finalisation (Lot 3 restant)
1. Audit sécurité (M9)
2. Optimisation bundle (M10)
3. Documentation README (M11)
4. Validation navigateurs (M12)

**Rationale** : Finalisation avant production

---

## Notes d'implémentation

### Dépendances à installer

```bash
# Lot 1 : Fond d'écran
npm install three @react-three/fiber @react-three/drei
npm install @shadergradient/react camera-controls three-stdlib

# Lot 4 : GitHub API (pas de dépendance, fetch natif)
# Mais recommandé pour cache/retry :
npm install axios # ou garder fetch natif

# Lot 5 : Audio (Web Audio API natif, pas de dépendance)
```

### Variables d'environnement

```bash
# .env (optionnel, pour GitHub username si configurable)
VITE_GITHUB_USERNAME=username
```

### Structure fichiers proposée

```
src/
├── components/
│   ├── Desktop/
│   ├── Window/
│   ├── DesktopIcon/
│   ├── Taskbar/
│   ├── ErrorBoundary/
│   ├── LoadingScreen/
│   ├── EntryEffect/
│   ├── Wallpaper/
│   │   ├── WallpaperProvider.jsx
│   │   ├── WallpaperSpheres.jsx
│   │   └── WallpaperShaderGradient.jsx
│   └── ...
├── apps/
│   ├── About/
│   ├── Contact/
│   ├── Projects/ (enrichie)
│   ├── Skills/ (gravité)
│   └── Settings/ (nouveau)
├── hooks/
│   ├── useWindows.js
│   ├── useIcons.js
│   ├── useDrag.js
│   ├── useLocalStorage.js
│   └── useAudio.js
├── services/
│   ├── githubService.js
│   └── audioService.js
├── constants/
│   └── index.js
└── ...
```

---

## Validation & Approbation

**Statut** : 📋 Design créé - En attente validation

**Prochaines étapes** :
1. Valider ce design avec l'équipe
2. Ajuster si nécessaire
3. Démarrer implémentation Phase 1

---

*Document créé par: Winston (Architect) & Sally (UX Expert)*  
*Basé sur: docs/backlog-finalisation.md, docs/etat-des-lieux.md*