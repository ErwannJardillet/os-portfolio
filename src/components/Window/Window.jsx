// Window.jsx
import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import styles from "./Window.module.css";
import {
  FRICTION,
  BOUNCE_DAMPING,
  MIN_VELOCITY,
  TASKBAR_HEIGHT,
  TASKBAR_WIDTH,
  TITLEBAR_HEIGHT,
  MARGIN,
} from "../../constants";

/** Récupère les coordonnées client (souris ou tactile) */
function getClientCoords(e) {
  if (e.touches && e.touches.length > 0) {
    return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
  }
  if (e.changedTouches && e.changedTouches.length > 0) {
    return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
  }
  return { clientX: e.clientX, clientY: e.clientY };
}

export default function Window({
  id,
  title = "PlaceHolder",
  children = "PlaceHolder",
  initialTop = "100",   // en px pour le moment
  initialLeft = "100",  // en px pour le moment
  width = "400px",
  height = null,  // null par défaut pour permettre l'adaptation automatique au contenu
  onClose,
  onFocus,
  zIndex,
}) {
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

  // Fonction pour convertir initialTop/initialLeft en pixels
  const parsePosition = (value, isTop = false) => {
    if (typeof value === 'string' && value.includes('%')) {
      const percent = parseFloat(value);
      const dimension = isTop ? windowSize.height : windowSize.width;
      return (dimension * percent) / 100;
    }
    return parseInt(value, 10) || 100;
  };

  // Fonction pour parser la largeur/hauteur (supporte px, %, et calculs)
  const parseSize = (value, isHeight = false) => {
    if (!value) return null;
    if (typeof value === 'string') {
      if (value.includes('%')) {
        const percent = parseFloat(value);
        const dimension = isHeight ? windowSize.height : windowSize.width;
        return `${(dimension * percent) / 100}px`;
      }
      // Si c'est déjà en px ou autre unité, le retourner tel quel
      return value;
    }
    // Si c'est un nombre, le traiter comme un pourcentage
    if (typeof value === 'number') {
      const dimension = isHeight ? windowSize.height : windowSize.width;
      return `${(dimension * value) / 100}px`;
    }
    return value;
  };


  // Position locale de la fenêtre
  const [position, setPosition] = useState(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const left = typeof initialLeft === 'string' && initialLeft.includes('%')
      ? (w * parseFloat(initialLeft)) / 100
      : parseInt(initialLeft, 10) || 100;
    const top = typeof initialTop === 'string' && initialTop.includes('%')
      ? (h * parseFloat(initialTop)) / 100
      : parseInt(initialTop, 10) || 100;
    const minLeft = w <= 768 ? TASKBAR_WIDTH + MARGIN : MARGIN;
    return { top, left: Math.max(left, minLeft) };
  });

  // Recalculer la position quand la taille de l'écran change
  useEffect(() => {
    if (hasBeenDraggedRef.current) return; // Ne pas reset si la fenêtre a été déplacée
    const left = parsePosition(initialLeft, false);
    const top = parsePosition(initialTop, true);
    const mobile = windowSize.width <= 768;
    const minLeft = mobile ? TASKBAR_WIDTH + MARGIN : MARGIN;
    setPosition({
      top,
      left: Math.max(left, minLeft),
    });
  }, [windowSize.width, windowSize.height, initialTop, initialLeft]);

  // Mettre à jour la ref de position à chaque changement
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // État pour gérer l'animation de fermeture
  const [isClosing, setIsClosing] = useState(false);

  // Décalage entre la souris et le coin de la fenêtre
  const dragOffset = useRef({ x: 0, y: 0 });

  // Références pour le momentum/inertie
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const hasBeenDraggedRef = useRef(false);
  const positionRef = useRef(position);
  const lastAnimationTimeRef = useRef(0);
  const lastTouchEndRef = useRef(0);

  const isMobile = windowSize.width <= 768;

  // Calculer la hauteur maximale en fonction de la position (taskbar en bas sur desktop, à gauche sur mobile)
  const maxHeight = useMemo(() => {
    if (height) return null; // Si height est spécifiée, pas de limitation
    const taskbarSpace = isMobile ? 0 : TASKBAR_HEIGHT;
    const availableHeight = windowSize.height - position.top - taskbarSpace - MARGIN;
    return Math.max(200, availableHeight); // Minimum de 200px pour la hauteur
  }, [position.top, height, windowSize.height, isMobile]);

  const onDrag = useCallback((e) => {
    if (e.cancelable) e.preventDefault();
    const { clientX, clientY } = getClientCoords(e);
    const now = Date.now();
    const currentX = clientX - dragOffset.current.x;
    const currentY = clientY - dragOffset.current.y;

    // Calculer la vélocité si on a une position précédente
    if (lastTimeRef.current > 0 && isDraggingRef.current) {
      const deltaTime = (now - lastTimeRef.current) / 1000; // Convertir en secondes
      if (deltaTime > 0) {
        velocityRef.current = {
          x: (currentX - lastPositionRef.current.x) / deltaTime,
          y: (currentY - lastPositionRef.current.y) / deltaTime,
        };
      }
    }

    lastPositionRef.current = { x: currentX, y: currentY };
    lastTimeRef.current = now;

    let newTop = currentY;
    let newLeft = currentX;

    const minTop = MARGIN;
    const maxTop =
      windowSize.height - (isMobile ? 0 : TASKBAR_HEIGHT) - TITLEBAR_HEIGHT - MARGIN;
    const minLeft = isMobile ? TASKBAR_WIDTH + MARGIN : MARGIN;
    const minWindowWidth = isMobile ? 280 : 420;
    const maxLeft = windowSize.width - MARGIN - minWindowWidth;

    newTop = Math.min(Math.max(newTop, minTop), maxTop);
    newLeft = Math.min(Math.max(newLeft, minLeft), maxLeft);

    hasBeenDraggedRef.current = true;
    setPosition({
      top: newTop,
      left: newLeft,
    });
  }, [windowSize.height, windowSize.width, isMobile]);


  // Fonction pour animer le momentum après le relâchement
  const animateMomentum = useCallback(() => {
    const now = Date.now();
    const deltaTime = lastAnimationTimeRef.current > 0 
      ? (now - lastAnimationTimeRef.current) / 1000 // Convertir en secondes
      : 0.016; // Valeur par défaut pour la première frame (~60fps)
    
    lastAnimationTimeRef.current = now;

    // Appliquer la friction (basée sur le temps écoulé pour être plus fluide)
    const frictionFactor = Math.pow(FRICTION, deltaTime * 60); // Ajuster pour 60fps
    velocityRef.current.x *= frictionFactor;
    velocityRef.current.y *= frictionFactor;

    // Vérifier si la vélocité est encore significative
    const speed = Math.sqrt(
      velocityRef.current.x * velocityRef.current.x + 
      velocityRef.current.y * velocityRef.current.y
    );

    if (speed < MIN_VELOCITY) {
      // Arrêter l'animation si la vélocité est trop faible
      animationFrameRef.current = null;
      lastAnimationTimeRef.current = 0;
      return;
    }

    // Calculer la nouvelle position en utilisant la forme fonctionnelle de setPosition
    setPosition((currentPosition) => {
      // Multiplier la vélocité par deltaTime pour obtenir le déplacement
      let newTop = currentPosition.top + velocityRef.current.y * deltaTime;
      let newLeft = currentPosition.left + velocityRef.current.x * deltaTime;

      const minTop = MARGIN;
      const maxTop =
        windowSize.height - (isMobile ? 0 : TASKBAR_HEIGHT) - TITLEBAR_HEIGHT - MARGIN;
      const minLeft = isMobile ? TASKBAR_WIDTH + MARGIN : MARGIN;
      const minWindowWidth = isMobile ? 280 : 420;
      const maxLeft = windowSize.width - MARGIN - minWindowWidth;

      // Appliquer les limites et inverser la vélocité si on touche un bord
      if (newTop <= minTop || newTop >= maxTop) {
        newTop = Math.min(Math.max(newTop, minTop), maxTop);
        velocityRef.current.y *= -BOUNCE_DAMPING;
      }

      if (newLeft <= minLeft || newLeft >= maxLeft) {
        newLeft = Math.min(Math.max(newLeft, minLeft), maxLeft);
        velocityRef.current.x *= -BOUNCE_DAMPING;
      }

      return {
        top: newTop,
        left: newLeft,
      };
    });

    // Continuer l'animation
    animationFrameRef.current = requestAnimationFrame(animateMomentum);
  }, [windowSize.height, windowSize.width, isMobile]);

  const stopDragRef = useRef(null);

  const handleTouchEnd = useCallback(() => {
    lastTouchEndRef.current = Date.now();
    stopDragRef.current?.();
  }, []);

  const stopDrag = useCallback(() => {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("touchmove", onDrag, { passive: false });
    window.removeEventListener("touchend", handleTouchEnd);
    window.removeEventListener("touchcancel", handleTouchEnd);

    isDraggingRef.current = false;

    const speed = Math.sqrt(
      velocityRef.current.x * velocityRef.current.x +
      velocityRef.current.y * velocityRef.current.y
    );
    if (speed >= MIN_VELOCITY) {
      lastAnimationTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(animateMomentum);
    }
  }, [onDrag, animateMomentum, handleTouchEnd]);

  stopDragRef.current = stopDrag;

  const startDrag = useCallback((e) => {
    if (!e.touches && lastTouchEndRef.current && Date.now() - lastTouchEndRef.current < 400) {
      return;
    }
    e.preventDefault();
    onFocus && onFocus(id);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    velocityRef.current = { x: 0, y: 0 };
    lastTimeRef.current = Date.now();
    lastAnimationTimeRef.current = 0;

    const { clientX, clientY } = getClientCoords(e);
    const currentPosition = positionRef.current;
    lastPositionRef.current = {
      x: clientX - dragOffset.current.x,
      y: clientY - dragOffset.current.y,
    };
    dragOffset.current = {
      x: clientX - currentPosition.left,
      y: clientY - currentPosition.top,
    };
    isDraggingRef.current = true;

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", onDrag, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
  }, [id, onFocus, onDrag, stopDrag, handleTouchEnd]);

  // Nettoyer l'animation et les event listeners lors du démontage
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", onDrag, { passive: false });
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [onDrag, stopDrag, handleTouchEnd]);

  // Gestion de la fermeture avec animation
  function handleClose() {
    setIsClosing(true);
    // Attendre la fin de l'animation avant d'appeler onClose
    setTimeout(() => {
      onClose && onClose(id);
    }, 300); // Durée de l'animation de fermeture
  }

  // Style de base de la fenêtre
  const style = {
    top: position.top,
    left: position.left,
    zIndex,
  };

  if (width) {
    style.width = parseSize(width, false);
  }
  // Si height est spécifié, l'utiliser, sinon adapter automatiquement au contenu
  if (height) {
    style.height = parseSize(height, true);
  } else {
    // Hauteur maximale calculée dynamiquement selon la position pour éviter de dépasser en bas
    style.maxHeight = `${maxHeight}px`;
  }

  return (

    
    <div
      className={`${styles.window} ${isClosing ? styles.closing : ''}`}
      style={style}
      data-window={id}
      tabIndex={-1}
      onMouseDown={(e) => { onFocus && onFocus(id); e.currentTarget.focus(); }}
      onTouchStart={(e) => { onFocus && onFocus(id); e.currentTarget.focus(); }}
      onKeyDown={(e) => { if (e.key === 'Escape') handleClose(); }}
    >
      <div
        className={styles.titleBar}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <div className={styles.title}>{title}</div>
        <div className={styles.actions}>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Fermer"
          >
            <span className={styles.closeIcon}>×</span>
          </button>
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
}
