import styles from "./DesktopIcon.module.css";
import { useState, useEffect, useRef } from "react";

function getClientCoords(e) {
  if (e.touches?.[0]) return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
  if (e.changedTouches?.[0]) return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
  return { clientX: e.clientX, clientY: e.clientY };
}

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
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const iconRef = useRef(null);

  // Détecter si on est sur un appareil tactile (mobile) pour ouvrir au simple tap
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const handler = () => setIsTouchDevice(mq.matches);
    handler(); // valeur initiale
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Mettre à jour la position locale quand la prop change
  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  const handlePointerDown = (e) => {
    if (e.detail === 2) return;
    e.stopPropagation();

    const { clientX, clientY } = getClientCoords(e);
    const rect = iconRef.current.getBoundingClientRect();
    dragOffsetRef.current = { x: clientX - rect.left, y: clientY - rect.top };
    hasDraggedRef.current = false;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const getContainerRect = () => {
      const container = iconRef.current?.parentElement;
      return container ? container.getBoundingClientRect() : null;
    };

    const handleMove = (e) => {
      const containerRect = getContainerRect();
      if (!containerRect || !iconRef.current) return;

      hasDraggedRef.current = true;
      if (e.cancelable) e.preventDefault();

      const { clientX, clientY } = getClientCoords(e);
      const newX = clientX - containerRect.left - dragOffsetRef.current.x;
      const newY = clientY - containerRect.top - dragOffsetRef.current.y;

      const minWidth = 60;
      const maxWidth = 80;
      const vwWidth = containerRect.width * 0.06;
      const iconWidth = Math.max(minWidth, Math.min(maxWidth, vwWidth));
      const minHeight = 75;
      const maxHeight = 100;
      const vwHeight = containerRect.height * 0.075;
      const iconHeight = Math.max(minHeight, Math.min(maxHeight, vwHeight));
      const margin = GRID_OFFSET_X;
      const maxX = containerRect.width - iconWidth - margin;
      const maxY = containerRect.height - iconHeight - margin;

      const clampedX = Math.max(margin, Math.min(newX, maxX));
      const clampedY = Math.max(margin, Math.min(newY, maxY));
      setCurrentPosition({ x: clampedX, y: clampedY });
    };

    const handleUp = (e) => {
      setIsDragging(false);
      if (!hasDraggedRef.current) return;

      const containerRect = getContainerRect();
      if (!containerRect) return;

      const { clientX, clientY } = getClientCoords(e);
      const finalX = clientX - containerRect.left - dragOffsetRef.current.x;
      const finalY = clientY - containerRect.top - dragOffsetRef.current.y;

      const minWidth = 60;
      const maxWidth = 80;
      const vwWidth = containerRect.width * 0.06;
      const iconWidth = Math.max(minWidth, Math.min(maxWidth, vwWidth));
      const minHeight = 75;
      const maxHeight = 100;
      const vwHeight = containerRect.height * 0.075;
      const iconHeight = Math.max(minHeight, Math.min(maxHeight, vwHeight));
      const margin = GRID_OFFSET_X;
      const maxX = containerRect.width - iconWidth - margin;
      const maxY = containerRect.height - iconHeight - margin;

      const clampedX = Math.max(margin, Math.min(finalX, maxX));
      const clampedY = Math.max(margin, Math.min(finalY, maxY));
      const snappedX = Math.round((clampedX - GRID_OFFSET_X) / GRID_SIZE_X) * GRID_SIZE_X + GRID_OFFSET_X;
      const snappedY = Math.round((clampedY - GRID_OFFSET_Y) / GRID_SIZE_Y) * GRID_SIZE_Y + GRID_OFFSET_Y;
      const finalPosition = { x: snappedX, y: snappedY };
      setCurrentPosition(finalPosition);
      onPositionChange?.(finalPosition);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleUp);
    document.addEventListener('touchcancel', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove, { passive: false });
      document.removeEventListener('touchend', handleUp);
      document.removeEventListener('touchcancel', handleUp);
    };
  }, [isDragging, onPositionChange, GRID_OFFSET_X, GRID_OFFSET_Y, GRID_SIZE_X, GRID_SIZE_Y]);

  const handleClick = (e) => {
    // Ne pas réagir si on vient de finir un drag
    if (hasDraggedRef.current) {
      e.stopPropagation();
      hasDraggedRef.current = false;
      return;
    }
    
    e.stopPropagation();
    // Sur mobile/tactile : un seul tap ouvre l'app (comportement téléphone)
    if (isTouchDevice && onOpen) {
      onOpen();
    } else if (onSelect) {
      onSelect();
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (onOpen) {
      onOpen();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen?.();
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
      tabIndex={0}
      role="button"
      aria-label={label}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
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
