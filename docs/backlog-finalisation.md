# Backlog de Finalisation - OS Portfolio

**Date de création:** 2025-01-27  
**Date de mise à jour:** 2025-01-27  
**Version:** 2.0  
**Objectif:** Transformer "je veux finaliser" en backlog structuré et priorisé  
**Contexte:** Backlog mis à jour suite à l'elicitation des besoins utilisateur

---

## Definition of Done (DoD) - Produit

### Critères fonctionnels
- ✅ Toutes les fonctionnalités core sont opérationnelles (desktop, icônes, fenêtres, apps)
- ✅ Aucune régression fonctionnelle identifiée
- ✅ Toutes les interactions utilisateur fonctionnent (drag, double-clic, focus, fermeture)
- ✅ Compatibilité navigateurs cibles validée (Chrome, Firefox, Safari, Edge - dernières 2 versions)

### Critères UX/UI
- ✅ Design cohérent et professionnel (glassmorphisme, thème futuriste moderne)
- ✅ Responsive sur desktop (résolutions 1280px+)
- ✅ Animations fluides (pas de lag, 60fps)
- ✅ Animations d'entrée et de chargement (loading screen, effet "waou")
- ✅ Fond d'écran dynamique fonctionnel (sphères 3D ou shadergradient)
- ✅ Accessibilité de base (navigation clavier, contraste, labels)
- ✅ Expérience utilisateur intuitive (pas de confusion, feedback visuel clair)

### Critères performance
- ✅ Temps de chargement initial < 2s (3G throttled)
- ✅ First Contentful Paint (FCP) < 1.5s
- ✅ Time to Interactive (TTI) < 3s
- ✅ Bundle size optimisé (analyse et minification)
- ✅ Pas de memory leaks (test avec DevTools)

### Critères sécurité
- ✅ Pas de vulnérabilités npm critiques (audit npm)
- ✅ Pas d'injection XSS (validation/sanitization si nécessaire)
- ✅ Headers sécurité si déploiement (CSP, HSTS - selon hébergeur)
- ✅ Pas de données sensibles exposées dans le code

### Critères documentation
- ✅ README.md à jour (installation, build, déploiement)
- ✅ Code commenté pour logique complexe (collisions, drag)
- ✅ Architecture documentée (ou référence à etat-des-lieux.md)
- ✅ Guide de déploiement (étapes, prérequis)

### Critères tests
- ✅ Tests unitaires pour logique critique (collisions, z-index, position)
- ✅ Tests d'intégration pour flux principaux (ouverture fenêtre, drag icône)
- ✅ Pas de tests bloquants en échec
- ✅ Coverage minimum 60% pour code critique (Desktop, Window, DesktopIcon)

### Critères déploiement
- ✅ Build production réussi sans erreurs
- ✅ Preview production validée localement
- ✅ Déploiement sur GitHub Pages (hébergement choisi)
- ✅ URL de production accessible et fonctionnelle
- ✅ Variables d'environnement configurées si nécessaire

### Critères qualité code
- ✅ ESLint passe sans erreurs
- ✅ Code review effectué (ou auto-review avec checklist)
- ✅ Pas de code mort (dead code)
- ✅ Structure de fichiers respectée (conventions du projet)

---

## Backlog structuré

### 🔴 Must-Have (Bloquants de sortie)

Ces items sont **critiques** pour considérer le projet comme "fini". Sans eux, le projet ne peut pas être livré en production.

| ID | Titre | Description | Impact | Effort | Risque | Priorité |
|----|-------|-------------|--------|--------|--------|----------|
| **M1** | **🐛 Fix: Positions icônes sur grille snap** | Corriger positions initiales des apps pour qu'elles soient directement snappées sur la grille (évite décalage au drag). | 🔴 Critique | 🟢 Faible (1-2h) | 🟢 Faible | **P0** |
| **M2** | **Fond d'écran: Sphères 3D Three.js** | Implémenter sphères 3D qui chutent du haut au démarrage, s'empilent, réagissent au passage de la souris. | 🔴 Critique | 🔴 Élevé (8-12h) | 🟡 Moyen | **P0** |
| **M3** | **Fond d'écran: Intégration ShaderGradient** | Intégrer @shadergradient/react pour fonds d'écran alternatifs. Configurer avec Three.js. | 🔴 Critique | 🟡 Moyen (4-6h) | 🟡 Moyen | **P0** |
| **M4** | **App Settings: Switch fonds d'écran** | Créer app Settings permettant de switcher entre différents styles de fond (sphères 3D, shadergradient, etc.). | 🔴 Critique | 🟡 Moyen (3-4h) | 🟢 Faible | **P0** |
| **M5** | **Loading screen au démarrage** | Animation de chargement au début du site avec effet visuel moderne. | 🔴 Critique | 🟡 Moyen (2-3h) | 🟢 Faible | **P0** |
| **M6** | **Animation d'entrée "waou effect"** | Animation d'entrée impressionnante au chargement du site (transition, fade-in, etc.). | 🔴 Critique | 🟡 Moyen (2-3h) | 🟢 Faible | **P0** |
| **M7** | **Gestion d'erreurs (ErrorBoundary)** | Implémenter ErrorBoundary React pour éviter crash total en cas d'erreur. Logger les erreurs. | 🔴 Critique | 🟡 Moyen (2-3h) | 🟡 Moyen | **P1** |
| **M8** | **Build & déploiement GitHub Pages** | Configurer déploiement GitHub Pages, valider build production, tester en prod. | 🔴 Critique | 🟢 Faible (2-3h) | 🟡 Moyen | **P1** |
| **M9** | **Audit sécurité npm** | Exécuter `npm audit`, corriger vulnérabilités critiques/high. | 🔴 Critique | 🟢 Faible (1-2h) | 🟢 Faible | **P1** |
| **M10** | **Optimisation bundle & performance** | Analyser bundle size (Three.js peut être lourd), optimiser imports, vérifier métriques (FCP, TTI). | 🔴 Critique | 🟡 Moyen (4-6h) | 🟡 Moyen | **P1** |
| **M11** | **Documentation README** | README complet : installation, scripts, déploiement GitHub Pages, architecture. | 🔴 Critique | 🟢 Faible (2-3h) | 🟢 Faible | **P1** |
| **M12** | **Validation navigateurs** | Tester sur Chrome, Firefox, Safari, Edge (dernières 2 versions) avec Three.js. | 🔴 Critique | 🟡 Moyen (3-4h) | 🟡 Moyen | **P1** |

**Total Must-Have:** 12 items | **Estimation totale:** 34-48h

---

### 🟡 Should-Have (Qualité perçue)

Ces items améliorent significativement la qualité perçue et l'expérience utilisateur. Fortement recommandés pour une livraison professionnelle.

| ID | Titre | Description | Impact | Effort | Risque | Priorité |
|----|-------|-------------|--------|--------|--------|----------|
| **S1** | **Musique d'ambiance + Visualiseur sonore** | Ajouter musique d'ambiance avec visualiseur audio dans la taskbar (barres audio animées). | 🟡 Élevé | 🟡 Moyen (4-6h) | 🟡 Moyen | **P2** |
| **S2** | **App Projets: API GitHub** | Intégrer API GitHub pour afficher repos publics (fetch, affichage liste, filtres). | 🟡 Élevé | 🟡 Moyen (4-6h) | 🟡 Moyen | **P2** |
| **S3** | **App Skills: Logo avec gravité** | Afficher logos apps/langages maîtrisés, effet de gravité quand on bouge la fenêtre (logo "tombent"). | 🟡 Élevé | 🔴 Élevé (6-8h) | 🟡 Moyen | **P2** |
| **S4** | **Animations ouverture/fermeture fenêtres** | Améliorer animations d'ouverture (scale + fade) et fermeture (scale down) des fenêtres. | 🟡 Élevé | 🟡 Moyen (3-4h) | 🟢 Faible | **P2** |
| **S5** | **Persistance positions icônes (localStorage)** | Sauvegarder positions icônes dans localStorage, restaurer au refresh. | 🟡 Élevé | 🟢 Faible (2-3h) | 🟢 Faible | **P2** |
| **S6** | **Refactor Desktop.jsx (custom hooks)** | Extraire logique dans `useWindows`, `useIcons` pour réduire complexité (294 lignes → ~150). | 🟡 Élevé | 🟡 Moyen (4-6h) | 🟡 Moyen | **P3** |
| **S7** | **Centralisation constants** | Créer `constants.js` pour ICON_WIDTH, GRID_SIZE, TASKBAR_HEIGHT, etc. | 🟡 Moyen | 🟢 Faible (1h) | 🟢 Faible | **P3** |
| **S8** | **Accessibilité de base** | Navigation clavier (Tab, Enter, Escape), ARIA labels, contraste couleurs. | 🟡 Élevé | 🟡 Moyen (4-6h) | 🟡 Moyen | **P3** |
| **S9** | **Hook partagé useDrag** | Factoriser logique drag de Window et DesktopIcon dans hook réutilisable. | 🟡 Moyen | 🟡 Moyen (3-4h) | 🟡 Moyen | **P3** |
| **S10** | **Tests critiques (drag, focus, collisions)** | Tests unitaires pour logique métier critique : détection collisions, gestion z-index, drag icônes/fenêtres. | 🟡 Élevé | 🔴 Élevé (8-12h) | 🟢 Faible | **P3** |
| **S11** | **Documentation architecture** | Documenter patterns existants, flux critiques, décisions techniques (Three.js, shadergradient). | 🟡 Moyen | 🟡 Moyen (2-3h) | 🟢 Faible | **P3** |
| **S12** | **Optimisation images/icons** | Vérifier taille/format images, lazy loading si nécessaire. | 🟡 Moyen | 🟢 Faible (1-2h) | 🟢 Faible | **P3** |

**Total Should-Have:** 12 items | **Estimation totale:** 42-58h

---

### 🟢 Could-Have (Bonus)

Ces items sont des améliorations "nice-to-have" qui ajoutent de la valeur mais ne sont pas essentiels pour la sortie.

| ID | Titre | Description | Impact | Effort | Risque | Priorité |
|----|-------|-------------|--------|--------|--------|----------|
| **C1** | **App Jeux: Snake** | Créer app Snake jouable dans une fenêtre (jeu classique avec contrôles clavier). | 🟢 Moyen | 🟡 Moyen (4-6h) | 🟢 Faible | **P4** |
| **C2** | **App Jeux: Autres mini-jeux** | Ajouter autres mini-jeux (Pong, Tetris, etc.) selon inspiration. | 🟢 Faible | 🔴 Élevé (6-10h) | 🟢 Faible | **P4** |
| **C3** | **Thème sombre/clair** | Toggle thème dark/light avec persistance préférence. | 🟢 Moyen | 🟡 Moyen (4-6h) | 🟢 Faible | **P4** |
| **C4** | **Minimiser fenêtres** | Bouton minimize qui cache fenêtre dans taskbar, restauration au clic. | 🟢 Moyen | 🟡 Moyen (4-5h) | 🟡 Moyen | **P5** |
| **C5** | **Redimensionner fenêtres** | Permettre resize fenêtres (drag corners/edges). | 🟢 Faible | 🔴 Élevé (6-8h) | 🟡 Moyen | **P5** |
| **C6** | **Séparation contenu/configuration** | Extraire contenu apps vers JSON/YAML externe (facilite maintenance). | 🟢 Moyen | 🟡 Moyen (3-4h) | 🟡 Moyen | **P5** |
| **C7** | **Tests coverage 80%+** | Augmenter coverage tests au-delà du minimum (60% → 80%+). | 🟢 Faible | 🔴 Élevé (8-10h) | 🟢 Faible | **P5** |
| **C8** | **Analytics basiques** | Ajouter analytics (Google Analytics, Plausible) pour tracking usage. | 🟢 Faible | 🟢 Faible (1-2h) | 🟢 Faible | **P5** |
| **C9** | **SEO meta tags** | Optimiser meta tags (title, description, OG) pour partage social. | 🟢 Faible | 🟢 Faible (1h) | 🟢 Faible | **P5** |

**Total Could-Have:** 9 items | **Estimation totale:** 37-54h

---

### ⚪ Won't-Have (Scope Creep - Exclu)

Ces items sont **explicitement exclus** du scope de finalisation pour éviter le scope creep. À documenter pour référence future.

| ID | Titre | Raison d'exclusion |
|----|-------|-------------------|
| **W1** | **Routing (React Router)** | Architecture SPA monolithique, pas de besoin URLs dédiées pour MVP. |
| **W2** | **State management global (Context/Redux)** | État local suffisant pour scope actuel, refactor futur si besoin. |
| **W3** | **Backend/API** | Application frontend-only, pas de besoin backend pour portfolio statique. |
| **W4** | **Authentification** | Pas de besoin auth pour portfolio public. |
| **W5** | **Internationalisation (i18n)** | Portfolio français uniquement, pas de besoin multi-langues. |
| **W6** | **CMS headless** | Contenu statique suffisant, complexité inutile pour MVP. |
| **W7** | **PWA (Service Worker)** | Pas de besoin offline pour portfolio, complexité ajoutée. |
| **W8** | **Tests E2E complets (Playwright/Cypress)** | Tests unitaires/intégration suffisants pour MVP, E2E = overkill. |

---

## Matrice de priorisation (Impact vs Effort vs Risque)

### Légende
- **Impact:** 🔴 Critique | 🟡 Élevé | 🟢 Moyen | ⚪ Faible
- **Effort:** 🔴 Élevé (6h+) | 🟡 Moyen (3-6h) | 🟢 Faible (<3h)
- **Risque:** 🔴 Élevé | 🟡 Moyen | 🟢 Faible

### Stratégie de priorisation

**Quick Wins (Impact élevé, Effort faible):**
- M1: Fix positions icônes sur grille
- M9: Audit sécurité npm
- S5: Persistance positions icônes
- S7: Centralisation constants
- S12: Optimisation images

**High Value (Impact élevé, Effort moyen):**
- M3: Intégration ShaderGradient
- M4: App Settings switch fonds
- M5: Loading screen
- M6: Animation entrée "waou"
- M7: ErrorBoundary
- M10: Optimisation bundle
- S1: Musique + visualiseur
- S2: App Projets API GitHub
- S4: Animations fenêtres
- S6: Refactor Desktop.jsx
- S8: Accessibilité

**Big Bets (Impact élevé, Effort élevé):**
- M2: Sphères 3D Three.js
- S3: App Skills gravité
- S10: Tests critiques

**Fill-ins (Impact moyen, Effort faible):**
- M6: Documentation README
- C7: Analytics
- C8: SEO meta tags

**Time Sinks (Impact faible, Effort élevé):**
- C4: Redimensionner fenêtres
- C6: Tests coverage 80%+

---

## Plan d'exécution recommandé

### Sprint 1 - Fixes critiques & Fondations (Must-Have P0)
1. M1: Fix positions icônes sur grille (1-2h) - **Quick win**
2. M9: Audit sécurité npm (1-2h)
3. M5: Loading screen (2-3h)
4. M6: Animation entrée "waou" (2-3h)
5. M8: Build & déploiement GitHub Pages (2-3h)

**Total Sprint 1:** 8-13h  
**Focus:** Corriger bugs, ajouter animations, préparer déploiement

### Sprint 2 - Fond d'écran système (Must-Have P0)
1. M2: Sphères 3D Three.js (8-12h) - **Biggest item**
2. M3: Intégration ShaderGradient (4-6h)
3. M4: App Settings switch fonds (3-4h)

**Total Sprint 2:** 15-22h  
**Focus:** Système de fond d'écran complet avec choix utilisateur

### Sprint 3 - Apps enrichies & UX (Should-Have P2)
1. S2: App Projets API GitHub (4-6h)
2. S3: App Skills gravité (6-8h) - **Complexe**
3. S4: Animations fenêtres améliorées (3-4h)
4. S5: Persistance positions icônes (2-3h)

**Total Sprint 3:** 15-21h  
**Focus:** Enrichir contenu des apps avec fonctionnalités interactives

### Sprint 4 - Audio & Polish (Should-Have P2-P3)
1. S1: Musique d'ambiance + visualiseur (4-6h)
2. S7: Centralisation constants (1h)
3. S6: Refactor Desktop.jsx (4-6h)
4. M7: ErrorBoundary (2-3h)
5. M11: Documentation README (2-3h)

**Total Sprint 4:** 13-19h  
**Focus:** Audio, refactoring, documentation

### Sprint 5 - Qualité & Performance (Must-Have P1)
1. M10: Optimisation bundle (4-6h)
2. M12: Validation navigateurs (3-4h)
3. S10: Tests critiques (8-12h) - **Biggest item**
4. S12: Optimisation images (1-2h)

**Total Sprint 5:** 16-24h  
**Focus:** Performance, tests, qualité

### Sprint 6 - Polish final & Bonus (Should-Have P3 + Could-Have)
1. S8: Accessibilité (4-6h)
2. S9: Hook useDrag (3-4h)
3. S11: Documentation architecture (2-3h)
4. C1: App Jeux Snake (4-6h) - **Bonus**

**Total Sprint 6:** 13-20h  
**Focus:** Finalisation qualité, bonus si temps disponible

### Sprint 7+ - Bonus (Could-Have)
Items Could-Have restants selon temps disponible.

---

## Métriques de succès

### Objectifs quantitatifs
- ✅ 0 vulnérabilités npm critiques/high
- ✅ Bundle size < 800KB (gzipped) - *Note: Three.js peut augmenter la taille*
- ✅ FCP < 2s, TTI < 3.5s - *Note: Three.js peut ralentir le chargement initial*
- ✅ Coverage tests ≥ 60% (code critique)
- ✅ ESLint 0 erreurs
- ✅ Compatibilité 4 navigateurs (Chrome, Firefox, Safari, Edge)
- ✅ Fond d'écran fonctionnel (sphères 3D ou shadergradient)
- ✅ App Settings opérationnelle avec switch fonds

### Objectifs qualitatifs
- ✅ Code maintenable (Desktop.jsx < 200 lignes après refactor)
- ✅ Documentation complète et à jour
- ✅ Expérience utilisateur fluide et intuitive
- ✅ Déploiement automatisé et reproductible

---

## Notes & Risques identifiés

### Risques techniques
- **React 19.2.0:** Version récente, vérifier compatibilité libs (faible probabilité)
- **Three.js:** Bibliothèque lourde, peut impacter performance et bundle size. Nécessite optimisation.
- **ShaderGradient:** Nouvelle dépendance, vérifier compatibilité avec Three.js et React 19.
- **API GitHub:** Rate limiting possible, nécessite gestion d'erreurs et cache.
- **Musique d'ambiance:** Fichiers audio peuvent être lourds, nécessite optimisation et lazy loading.
- **Tests:** Infrastructure à créer (Vitest + React Testing Library), courbe d'apprentissage possible
- **Refactor Desktop.jsx:** Risque de régression, nécessite tests avant refactor

### Dépendances
- **Three.js** + **@react-three/fiber** (pour sphères 3D)
- **@shadergradient/react** + peer deps (@react-three/fiber, three, three-stdlib, camera-controls)
- **API GitHub** (publique, pas de token requis pour repos publics)
- **Fichiers audio** (musique d'ambiance - à fournir ou utiliser librairie)
- Déploiement GitHub Pages (configuré)

### Assumptions
- Portfolio reste frontend-only (pas de backend)
- API GitHub utilisée uniquement pour repos publics (pas d'auth)
- Musique d'ambiance fournie par l'utilisateur ou librairie libre de droits
- Cible desktop uniquement (responsive desktop, pas mobile-first)
- Three.js supporté par navigateurs cibles (WebGL requis)

---

## Prochaines étapes

1. **Valider ce backlog** avec les parties prenantes
2. **Estimer effort réel** (ajuster si nécessaire)
3. **Démarrer Sprint 1** (fondations critiques)
4. **Suivre progression** via ce document (mettre à jour statuts)

**Statut actuel:** 📋 Backlog créé - En attente validation

---

*Document créé par: John (PM) & Mary (Analyst)*  
*Basé sur: docs/etat-des-lieux.md*
