import styles from "./Desktop.module.css";
import Window from "../Window/Window";
import Taskbar from "../Taskbar/Taskbar";
import { useState } from "react";
import DesktopIcon from "../DesktopIcon/DesktopIcon";
import About from "../../apps/About/About";
import Contact from "../../apps/Contact/Contact";
import Projects from "../../apps/Projects/Projects";
import Skills from "../../apps/Skills/Skills";
import WallpaperShaderGradient from "../Wallpaper/WallpaperShaderGradient.jsx";

// Mapping des composants pour éviter les if/else
const componentMap = {
  About,
  Contact,
  Projects,
  Skills,
};


export default function Desktop() {

  // Initialiser avec un tableau vide - les fenêtres s'ouvrent via les icônes
  const [windows, setWindows] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  
  // Positions des icônes sur le bureau
  const [iconPositions, setIconPositions] = useState({
    about: { x: 24, y: 24 },
    projects: { x: 24, y: 136 },
    contact: { x: 24, y: 248 },
    skills: { x: 24, y: 360 }
  });

  // Constantes pour la détection de collision
  const ICON_WIDTH = 80;
  const ICON_HEIGHT = 100;

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
    const GRID_SIZE_X = 100;
    const GRID_SIZE_Y = 112;
    const GRID_OFFSET_X = 24;
    const GRID_OFFSET_Y = 24;
    const margin = 24;
    
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
          onOpen={() => {
            openWindow({
              id: "about",
              title: "À propos",
              initialTop: "120",
              initialLeft: "120",
              width: "520px",
              height: "500px",
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
          onOpen={() => {
            openWindow({
              id: "projects",
              title: "Projets",
              initialTop: "160",
              initialLeft: "160",
              width: "520px",
              height: "680px",
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
          onOpen={() => {
            openWindow({
              id: "contact",
              title: "Contact",
              initialTop: "200",
              initialLeft: "200",
              width: "520px",
              height: "500px",
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
          onOpen={() => {
            openWindow({
              id: "skills",
              title: "Compétences",
              initialTop: "240",
              initialLeft: "240",
              width: "520px",
              height: "500px",
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
    </div>
  );
}
