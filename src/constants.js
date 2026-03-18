// Constantes partagées de l'application

// ─── Boot screen ────────────────────────────────────────────────────────────
export const BOOT_DURATION = 4500; // ms — durée totale du boot screen

// ─── Physique des fenêtres (drag & momentum) ────────────────────────────────
export const FRICTION = 0.92;       // Facteur de friction (plus proche de 1 = moins de friction)
export const BOUNCE_DAMPING = 0.6;  // Perte d'énergie au rebord (appliqué comme -BOUNCE_DAMPING)
export const MIN_VELOCITY = 0.5;    // Vitesse minimale pour continuer l'animation momentum

// ─── Layout des fenêtres (px) ────────────────────────────────────────────────
export const TASKBAR_HEIGHT = 52;   // Hauteur de la taskbar desktop (en bas)
export const TASKBAR_WIDTH = 52;    // Largeur de la taskbar mobile (à gauche)
export const TITLEBAR_HEIGHT = 36;  // Hauteur de la barre de titre d'une fenêtre
export const MARGIN = 8;            // Marge minimale au bord de l'écran

// ─── API GitHub ──────────────────────────────────────────────────────────────
export const GITHUB_REST_API_URL = "https://api.github.com";
export const GITHUB_GRAPHQL_API_URL = "https://api.github.com/graphql";
export const REPO_TO_EXCLUDE = "os-portfolio";

// ─── Fallback projets ────────────────────────────────────────────────────────
// Affichés si l'API GitHub est indisponible ou rate-limitée.
// À mettre à jour avec vos projets réels.
export const FALLBACK_REPOS = [
  {
    name: "os-portfolio",
    description: "Portfolio interactif au style système d'exploitation de bureau, construit avec React et Three.js",
    url: "https://github.com/ErwannJardillet/os-portfolio",
    stars: 0,
    forks: 0,
    updatedAt: "2025-01-01T00:00:00Z",
    languages: [
      { name: "JavaScript", color: "#f1e05a" },
      { name: "CSS", color: "#563d7c" },
    ],
    topics: ["portfolio", "react", "vite", "three.js"],
  },
];
