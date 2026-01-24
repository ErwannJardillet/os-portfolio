import styles from "./Desktop.module.css";
import Window from "../Window/Window";
import Taskbar from "../Taskbar/Taskbar";
import { useState, useEffect, useMemo, useRef } from "react";
import DesktopIcon from "../DesktopIcon/DesktopIcon";
import About from "../../apps/About/About";
import Contact from "../../apps/Contact/Contact";
import Projects from "../../apps/Projects/Projects";
import Skills from "../../apps/Skills/Skills";
import Introduction from "../../apps/Introduction/Introduction";
import WallpaperShaderGradient from "../Wallpaper/WallpaperShaderGradient.jsx";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

// Mapping des composants pour éviter les if/else
const componentMap = {
  About,
  Contact,
  Projects,
  Skills,
  Introduction,
};


export default function Desktop({ shouldOpenIntroduction = false }) {

  // Initialiser avec un tableau vide - les fenêtres s'ouvrent via les icônes
  const [windows, setWindows] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const introductionOpenedRef = useRef(false);
  
  // État pour la taille de l'écran
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tailles relatives des fenêtres en pourcentages
  const windowSizes = {
    width: "40%",      // 40% de la largeur de l'écran
    height: "60%",     // 60% de la hauteur de l'écran (pour les grandes fenêtres)
    heightSmall: "50%", // 50% de la hauteur de l'écran (pour les petites fenêtres)
  };

  // Calculer la grille adaptative - plus la fenêtre est petite, plus l'espacement est réduit
  const gridConfig = useMemo(() => {
    // Calculer l'espacement horizontal : réduit pour les petites fenêtres
    // Pour les petites fenêtres (< 1200px) : 5-6% de la largeur
    // Pour les grandes fenêtres (> 1920px) : 8-9% de la largeur
    const widthRatio = windowSize.width < 1200 
      ? 0.05 + (windowSize.width / 1200) * 0.01  // 5% à 6%
      : 0.06 + Math.min((windowSize.width - 1200) / 720, 1) * 0.03; // 6% à 9%
    const baseGridX = windowSize.width * widthRatio;
    
    // Calculer l'espacement vertical : réduit pour les petites fenêtres
    // Pour les petites fenêtres (< 800px) : 8-10% de la hauteur
    // Pour les grandes fenêtres (> 1080px) : 12-14% de la hauteur
    const heightRatio = windowSize.height < 800
      ? 0.08 + (windowSize.height / 800) * 0.02  // 8% à 10%
      : 0.10 + Math.min((windowSize.height - 800) / 280, 1) * 0.04; // 10% à 14%
    const baseGridY = windowSize.height * heightRatio;
    
    // Appliquer des limites min/max pour éviter des valeurs trop extrêmes
    const minGridX = Math.max(50, windowSize.width * 0.04); // Minimum 4% ou 50px
    const maxGridX = Math.min(140, windowSize.width * 0.1);   // Maximum 10% ou 140px
    const minGridY = Math.max(70, windowSize.height * 0.07); // Minimum 7% ou 70px
    const maxGridY = Math.min(180, windowSize.height * 0.15); // Maximum 15% ou 180px
    
    return {
      GRID_SIZE_X: Math.round(Math.max(minGridX, Math.min(maxGridX, baseGridX)) / 5) * 5, // Arrondir à 5px
      GRID_SIZE_Y: Math.round(Math.max(minGridY, Math.min(maxGridY, baseGridY)) / 5) * 5,
      GRID_OFFSET_X: Math.max(12, Math.min(32, windowSize.width * 0.012)), // Réduire aussi les offsets
      GRID_OFFSET_Y: Math.max(12, Math.min(32, windowSize.height * 0.012)),
    };
  }, [windowSize.width, windowSize.height]);
  
  // Calculer les positions initiales des icônes (utilise les mêmes calculs que gridConfig)
  const getInitialIconPositions = () => {
    const offsetX = Math.max(12, Math.min(32, window.innerWidth * 0.012));
    const offsetY = Math.max(12, Math.min(32, window.innerHeight * 0.012));
    
    // Utiliser le même calcul que gridConfig pour la cohérence
    const heightRatio = window.innerHeight < 800
      ? 0.08 + (window.innerHeight / 800) * 0.02
      : 0.10 + Math.min((window.innerHeight - 800) / 280, 1) * 0.04;
    const baseGridY = window.innerHeight * heightRatio;
    const minGridY = Math.max(70, window.innerHeight * 0.07);
    const maxGridY = Math.min(180, window.innerHeight * 0.15);
    const gridY = Math.round(Math.max(minGridY, Math.min(maxGridY, baseGridY)) / 5) * 5;
    
    return {
      about: { x: offsetX, y: offsetY },
      projects: { x: offsetX, y: offsetY + gridY },
      contact: { x: offsetX, y: offsetY + gridY * 2 },
      skills: { x: offsetX, y: offsetY + gridY * 3 }
    };
  };

  // Positions des icônes sur le bureau (adaptatives)
  const [iconPositions, setIconPositions] = useState(getInitialIconPositions);

  // Mettre à jour les positions des icônes quand la grille change
  useEffect(() => {
    setIconPositions(prev => {
      const offsetY = gridConfig.GRID_OFFSET_Y;
      const gridY = gridConfig.GRID_SIZE_Y;
      const offsetX = gridConfig.GRID_OFFSET_X;
      
      // Préserver les positions relatives si possible
      return {
        about: { 
          x: Math.round((prev.about.x - gridConfig.GRID_OFFSET_X) / gridConfig.GRID_SIZE_X) * gridConfig.GRID_SIZE_X + offsetX,
          y: Math.round((prev.about.y - offsetY) / gridY) * gridY + offsetY
        },
        projects: { 
          x: Math.round((prev.projects.x - offsetX) / gridConfig.GRID_SIZE_X) * gridConfig.GRID_SIZE_X + offsetX,
          y: Math.round((prev.projects.y - offsetY) / gridY) * gridY + offsetY
        },
        contact: { 
          x: Math.round((prev.contact.x - offsetX) / gridConfig.GRID_SIZE_X) * gridConfig.GRID_SIZE_X + offsetX,
          y: Math.round((prev.contact.y - offsetY) / gridY) * gridY + offsetY
        },
        skills: { 
          x: Math.round((prev.skills.x - offsetX) / gridConfig.GRID_SIZE_X) * gridConfig.GRID_SIZE_X + offsetX,
          y: Math.round((prev.skills.y - offsetY) / gridY) * gridY + offsetY
        }
      };
    });
  }, [gridConfig.GRID_SIZE_X, gridConfig.GRID_SIZE_Y, gridConfig.GRID_OFFSET_X, gridConfig.GRID_OFFSET_Y]);

  // Constantes adaptatives pour la détection de collision
  const ICON_WIDTH = useMemo(() => {
    // Correspond à clamp(60px, 6vw, 80px) du CSS
    const minWidth = 50;
    const maxWidth = 80;
    const vwWidth = windowSize.width * 0.06;
    return Math.max(minWidth, Math.min(maxWidth, vwWidth));
  }, [windowSize.width]);
  
  const ICON_HEIGHT = useMemo(() => {
    // Hauteur approximative : largeur + espace pour le label
    // Correspond à environ clamp(75px, 7.5vw, 100px)
    const minHeight = 75;
    const maxHeight = 100;
    const vwHeight = windowSize.height * 0.075;
    return Math.max(minHeight, Math.min(maxHeight, vwHeight));
  }, [windowSize.height]);

  // Vérifie si deux positions se chevauchent réellement
  // Permet le placement vertical (au-dessus/en dessous) tant qu'il n'y a pas de chevauchement vertical
  function checkCollision(pos1, pos2) {
    // Calculer les rectangles des deux icônes
    const rect1 = {
      left: pos1.x,
      right: pos1.x + ICON_WIDTH,
      top: pos1.y,
      bottom: pos1.y + ICON_HEIGHT
    };
    
    const rect2 = {
      left: pos2.x,
      right: pos2.x + ICON_WIDTH,
      top: pos2.y,
      bottom: pos2.y + ICON_HEIGHT
    };
    
    // Vérifier le chevauchement horizontal (les rectangles se chevauchent horizontalement)
    // Utiliser < strict pour exclure les cas où les rectangles sont juste adjacents
    const horizontalOverlap = rect1.right > rect2.left && rect1.left < rect2.right;
    
    // Vérifier le chevauchement vertical (les rectangles se chevauchent verticalement)
    // Utiliser < strict pour exclure les cas où les rectangles sont juste adjacents
    const verticalOverlap = rect1.bottom > rect2.top && rect1.top < rect2.bottom;
    
    // Collision seulement si les deux se chevauchent (horizontal ET vertical)
    // Cela permet le placement vertical (même colonne) tant qu'il n'y a pas de chevauchement vertical
    return horizontalOverlap && verticalOverlap;
  }

  // Trouve la position la plus proche sans collision
  function findNearestFreePosition(targetPosition, allPositions, currentId) {
    const GRID_SIZE_X = gridConfig.GRID_SIZE_X;
    const GRID_SIZE_Y = gridConfig.GRID_SIZE_Y;
    const GRID_OFFSET_X = gridConfig.GRID_OFFSET_X;
    const GRID_OFFSET_Y = gridConfig.GRID_OFFSET_Y;
    const margin = Math.max(16, Math.min(32, windowSize.width * 0.015));
    
    // Vérifier d'abord si la position cible est libre
    const hasCollision = Object.entries(allPositions).some(
      ([id, pos]) => id !== currentId && checkCollision(targetPosition, pos)
    );
    
    if (!hasCollision) {
      return targetPosition;
    }

    // Chercher une position libre autour de la position cible
    const maxRadius = 500; // Rayon de recherche maximum
    const desktop = document.querySelector('[class*="desktop"]');
    if (!desktop) return targetPosition;
    
    const desktopRect = desktop.getBoundingClientRect();
    const maxX = desktopRect.width - ICON_WIDTH - margin;
    const maxY = desktopRect.height - ICON_HEIGHT - margin;

    // Chercher en spirale autour de la position cible
    for (let radius = GRID_SIZE_Y; radius <= maxRadius; radius += GRID_SIZE_Y) {
      for (let angle = 0; angle < 360; angle += 45) {
        const rad = (angle * Math.PI) / 180;
        const testX = Math.round((targetPosition.x + Math.cos(rad) * radius - GRID_OFFSET_X) / GRID_SIZE_X) * GRID_SIZE_X + GRID_OFFSET_X;
        const testY = Math.round((targetPosition.y + Math.sin(rad) * radius - GRID_OFFSET_Y) / GRID_SIZE_Y) * GRID_SIZE_Y + GRID_OFFSET_Y;
        
        const clampedX = Math.max(margin, Math.min(testX, maxX));
        const clampedY = Math.max(margin, Math.min(testY, maxY));
        
        const testPosition = { x: clampedX, y: clampedY };
        
        const hasTestCollision = Object.entries(allPositions).some(
          ([id, pos]) => id !== currentId && checkCollision(testPosition, pos)
        );
        
        if (!hasTestCollision) {
          return testPosition;
        }
      }
    }

    // Si aucune position libre n'est trouvée, retourner la position originale
    return targetPosition;
  }

  function handleIconPositionChange(id, newPosition) {
    setIconPositions((prev) => {
      // Vérifier les collisions avec les autres icônes
      const freePosition = findNearestFreePosition(newPosition, prev, id);
      
      return {
        ...prev,
        [id]: freePosition
      };
    });
  }


  function handleClose(id) {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }

  function handleFocus(id) {
    setWindows((prev) => {
      if (prev.length === 0) return prev;
      
      const maxZ = Math.max(...prev.map(w => w.zIndex), 0); // trouve le plus haut z-index actuel

      return prev.map((w) =>
        w.id === id
          ? { ...w, zIndex: maxZ + 1 }    // la fenêtre cliquée passe au-dessus
          : w
      );
    });
  }


  function openWindow(windowData) {
    setWindows((prev) => {
      const exists = prev.find(w => w.id === windowData.id);
      if (exists) {
        handleFocus(windowData.id);
        return prev;
      }

      const maxZ = Math.max(...prev.map(w => w.zIndex), 0);

      return [
        ...prev,
        { ...windowData, zIndex: maxZ + 1 }
      ];
    });
  }

  // Ouvrir automatiquement la fenêtre d'introduction
  useEffect(() => {
    if (shouldOpenIntroduction && !introductionOpenedRef.current) {
      introductionOpenedRef.current = true;
      setWindows((prev) => {
        const exists = prev.find(w => w.id === "introduction");
        if (exists) {
          return prev;
        }
        const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
        return [
          ...prev,
          {
            id: "introduction",
            title: "Introduction",
            initialTop: "15%",
            initialLeft: "15%",
            width: windowSizes.width,
            height: windowSizes.heightSmall,
            component: "Introduction",
            zIndex: maxZ + 1
          }
        ];
      });
    }
  }, [shouldOpenIntroduction]);



  return (
    <div 
      className={styles.desktop}
      onClick={(e) => {
        // Désélectionner si on clique sur le desktop (pas sur une icône ou une fenêtre)
        const clickedIcon = e.target.closest(`[data-icon-id]`);
        const clickedWindow = e.target.closest(`[data-window]`);
        if (!clickedIcon && !clickedWindow) {
          setSelectedIcon(null);
        }
      }}
    >
      <WallpaperShaderGradient />

      <div className={styles.iconsArea}>
        <DesktopIcon
          id="about"
          label="À propos"
          iconImage="/icons/about-icon.png"
          position={iconPositions.about}
          isSelected={selectedIcon === "about"}
          onSelect={() => setSelectedIcon("about")}
          onPositionChange={(newPosition) => handleIconPositionChange("about", newPosition)}
          gridConfig={gridConfig}
          onOpen={() => {
            openWindow({
              id: "about",
              title: "À propos",
              initialTop: "10%",
              initialLeft: "10%",
              width: windowSizes.width,
              height: windowSizes.heightSmall,
              component: "About",
            });
            setSelectedIcon(null);
          }}
        />

        <DesktopIcon
          id="projects"
          label="Projets"
          iconImage="/icons/projects-icon.png"
          position={iconPositions.projects}
          isSelected={selectedIcon === "projects"}
          onSelect={() => setSelectedIcon("projects")}
          onPositionChange={(newPosition) => handleIconPositionChange("projects", newPosition)}
          gridConfig={gridConfig}
          onOpen={() => {
            openWindow({
              id: "projects",
              title: "Projets",
              initialTop: "12%",
              initialLeft: "12%",
              width: windowSizes.width,
              height: windowSizes.height,
              component: "Projects",
            });
            setSelectedIcon(null);
          }}
        />

        <DesktopIcon
          id="contact"
          label="Contact"
          iconImage="/icons/contact-icon.png"
          position={iconPositions.contact}
          isSelected={selectedIcon === "contact"}
          onSelect={() => setSelectedIcon("contact")}
          onPositionChange={(newPosition) => handleIconPositionChange("contact", newPosition)}
          gridConfig={gridConfig}
          onOpen={() => {
            openWindow({
              id: "contact",
              title: "Contact",
              initialTop: "14%",
              initialLeft: "14%",
              width: windowSizes.width,
              height: windowSizes.heightSmall,
              component: "Contact",
            });
            setSelectedIcon(null);
          }}
        />

        <DesktopIcon
          id="skills"
          label="Compétences"
          iconImage="/icons/skills-icon.png"
          position={iconPositions.skills}
          isSelected={selectedIcon === "skills"}
          onSelect={() => setSelectedIcon("skills")}
          onPositionChange={(newPosition) => handleIconPositionChange("skills", newPosition)}
          gridConfig={gridConfig}
          onOpen={() => {
            openWindow({
              id: "skills",
              title: "Compétences",
              initialTop: "16%",
              initialLeft: "16%",
              width: windowSizes.width,
              height: windowSizes.heightSmall,
              component: "Skills",
            });
            setSelectedIcon(null);
          }}
        />
      </div>



      {windows.map((win) => {
        const Component = componentMap[win.component];

        return (
          <Window
            key={win.id}
            title={win.title}
            id={win.id}
            initialTop={win.initialTop}
            initialLeft={win.initialLeft}
            width={win.width}
            height={win.height}
            onClose={handleClose}
            onFocus={handleFocus}
            zIndex={win.zIndex}
          >
            {Component ? <Component /> : <p>{win.content}</p>}
          </Window>
        );
      })}

      <Taskbar />
      <AudioPlayer />
    </div>
  );
}
