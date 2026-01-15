import styles from "./DesktopIcon.module.css";
import { useState, useEffect, useRef } from "react";

// Valeurs par défaut pour la grille (utilisées si gridConfig n'est pas fourni)
const DEFAULT_GRID_SIZE_X = 100;
const DEFAULT_GRID_SIZE_Y = 112;
const DEFAULT_GRID_OFFSET_X = 24;
const DEFAULT_GRID_OFFSET_Y = 24;

export default function DesktopIcon({ 
  id, 
  label, 
  isSelected, 
  onSelect, 
  onOpen, 
  position, 
  onPositionChange, 
  iconImage,
  gridConfig 
}) {
  // Utiliser gridConfig si fourni, sinon les valeurs par défaut
  const GRID_SIZE_X = gridConfig?.GRID_SIZE_X || DEFAULT_GRID_SIZE_X;
  const GRID_SIZE_Y = gridConfig?.GRID_SIZE_Y || DEFAULT_GRID_SIZE_Y;
  const GRID_OFFSET_X = gridConfig?.GRID_OFFSET_X || DEFAULT_GRID_OFFSET_X;
  const GRID_OFFSET_Y = gridConfig?.GRID_OFFSET_Y || DEFAULT_GRID_OFFSET_Y;
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const iconRef = useRef(null);

  // Mettre à jour la position locale quand la prop change
  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  const handleMouseDown = (e) => {
    // Ne pas démarrer le drag sur un double-clic
    if (e.detail === 2) {
      return;
    }

    e.stopPropagation();
    
    const rect = iconRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    dragOffsetRef.current = { x: offsetX, y: offsetY };
    hasDraggedRef.current = false;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const desktop = document.querySelector('[class*="desktop"]');
      if (!desktop || !iconRef.current) return;

      hasDraggedRef.current = true;

      const desktopRect = desktop.getBoundingClientRect();
      const newX = e.clientX - desktopRect.left - dragOffsetRef.current.x;
      const newY = e.clientY - desktopRect.top - dragOffsetRef.current.y;

      // Limiter aux limites du bureau (avec marges)
      const iconWidth = 80;
      const iconHeight = 100; // Approximation
      const margin = GRID_OFFSET_X; // Utiliser le même offset que la grille
      const maxX = desktopRect.width - iconWidth - margin;
      const maxY = desktopRect.height - iconHeight - margin;

      const clampedX = Math.max(margin, Math.min(newX, maxX));
      const clampedY = Math.max(margin, Math.min(newY, maxY));

      setCurrentPosition({ x: clampedX, y: clampedY });
    };

    const handleMouseUp = (e) => {
      setIsDragging(false);
      
      if (!hasDraggedRef.current) {
        return;
      }

      const desktop = document.querySelector('[class*="desktop"]');
      if (!desktop) return;

      const desktopRect = desktop.getBoundingClientRect();
      const finalX = e.clientX - desktopRect.left - dragOffsetRef.current.x;
      const finalY = e.clientY - desktopRect.top - dragOffsetRef.current.y;

      // Limiter aux limites du bureau (avec marges)
      const iconWidth = 80;
      const iconHeight = 100;
      const margin = GRID_OFFSET_X; // Utiliser le même offset que la grille
      const maxX = desktopRect.width - iconWidth - margin;
      const maxY = desktopRect.height - iconHeight - margin;

      const clampedX = Math.max(margin, Math.min(finalX, maxX));
      const clampedY = Math.max(margin, Math.min(finalY, maxY));
      
      // Appliquer le snap sur grille avec offset pour correspondre aux positions initiales
      const snappedX = Math.round((clampedX - GRID_OFFSET_X) / GRID_SIZE_X) * GRID_SIZE_X + GRID_OFFSET_X;
      const snappedY = Math.round((clampedY - GRID_OFFSET_Y) / GRID_SIZE_Y) * GRID_SIZE_Y + GRID_OFFSET_Y;
      
      const finalPosition = { x: snappedX, y: snappedY };
      setCurrentPosition(finalPosition);
      
      if (onPositionChange) {
        onPositionChange(finalPosition);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onPositionChange]);

  const handleClick = (e) => {
    // Ne pas sélectionner si on vient de finir un drag
    if (hasDraggedRef.current) {
      e.stopPropagation();
      hasDraggedRef.current = false;
      return;
    }
    
    e.stopPropagation();
    if (onSelect) {
      onSelect();
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (onOpen) {
      onOpen();
    }
  };

  return (
    <div
      ref={iconRef}
      className={`${styles.icon} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      data-icon-id={id}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className={`${styles.iconImage} ${iconImage ? styles.hasImage : ''}`}>
        {iconImage ? (
          <img 
            src={iconImage} 
            alt={label}
            className={`${styles.iconImg} ${id === 'contact' ? styles.fullSize : ''}`}
            draggable="false"
          />
        ) : (
          <span className={styles.iconLetter}>
            {label[0]}
          </span>
        )}
      </div>

      <span className={styles.iconLabel}>{label}</span>
    </div>
  );
}
