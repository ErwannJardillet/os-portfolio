// Window.jsx
import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import styles from "./Window.module.css";

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
        return `${(dimension * percent) / 75}px`;
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
  const [position, setPosition] = useState(() => ({
    top: parsePosition(initialTop, true),
    left: parsePosition(initialLeft, false),
  }));

  // Recalculer la position quand la taille de l'écran change
  useEffect(() => {
    setPosition({
      top: parsePosition(initialTop, true),
      left: parsePosition(initialLeft, false),
    });
  }, [windowSize.width, windowSize.height]);

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
  const positionRef = useRef(position);
  const lastAnimationTimeRef = useRef(0);

  // Constantes pour le calcul de hauteur maximale
  const TASKBAR_HEIGHT = 52;
  const TITLEBAR_HEIGHT = 36;
  const MARGIN = 8;

  // Constantes pour le momentum
  const FRICTION = 0.92; // Facteur de friction (plus proche de 1 = moins de friction)
  const MIN_VELOCITY = 0.5; // Vitesse minimale pour continuer l'animation

  // Calculer la hauteur maximale en fonction de la position
  const maxHeight = useMemo(() => {
    if (height) return null; // Si height est spécifiée, pas de limitation
    
    const availableHeight = windowSize.height - position.top - TASKBAR_HEIGHT - MARGIN;
    return Math.max(200, availableHeight); // Minimum de 200px pour la hauteur
  }, [position.top, height, windowSize.height]);

  const onDrag = useCallback((e) => {
    const now = Date.now();
    const currentX = e.clientX - dragOffset.current.x;
    const currentY = e.clientY - dragOffset.current.y;

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
      windowSize.height - TASKBAR_HEIGHT - TITLEBAR_HEIGHT - MARGIN;

    // On empêche la titleBar de passer sous la taskbar
    newTop = Math.min(Math.max(newTop, minTop), maxTop);

    // Optionnel : empêcher de sortir trop à gauche / droite
    const minLeft = MARGIN;
    const maxLeft = windowSize.width - MARGIN - 200; // 200 = largeur minimale approximative
    newLeft = Math.min(Math.max(newLeft, minLeft), maxLeft);

    setPosition({
      top: newTop,
      left: newLeft,
    });
  }, [windowSize.height, windowSize.width]);


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
        windowSize.height - TASKBAR_HEIGHT - TITLEBAR_HEIGHT - MARGIN;
      const minLeft = MARGIN;
      const maxLeft = windowSize.width - MARGIN - 200;

      // Appliquer les limites et inverser la vélocité si on touche un bord
      if (newTop <= minTop || newTop >= maxTop) {
        newTop = Math.min(Math.max(newTop, minTop), maxTop);
        velocityRef.current.y *= -0.6; // Rebond avec perte d'énergie
      }

      if (newLeft <= minLeft || newLeft >= maxLeft) {
        newLeft = Math.min(Math.max(newLeft, minLeft), maxLeft);
        velocityRef.current.x *= -0.6; // Rebond avec perte d'énergie
      }

      return {
        top: newTop,
        left: newLeft,
      };
    });

    // Continuer l'animation
    animationFrameRef.current = requestAnimationFrame(animateMomentum);
  }, [windowSize.height, windowSize.width]);

  const stopDrag = useCallback(() => {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
    
    isDraggingRef.current = false;

    // Démarrer l'animation de momentum si la vélocité est suffisante
    const speed = Math.sqrt(
      velocityRef.current.x * velocityRef.current.x + 
      velocityRef.current.y * velocityRef.current.y
    );

    if (speed >= MIN_VELOCITY) {
      lastAnimationTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(animateMomentum);
    }
  }, [onDrag, animateMomentum]);

  const startDrag = useCallback((e) => {
    // Mettre la fenêtre au premier plan
    onFocus && onFocus(id);

    // Arrêter toute animation de momentum en cours
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Réinitialiser les références de vélocité
    velocityRef.current = { x: 0, y: 0 };
    lastTimeRef.current = Date.now();
    lastAnimationTimeRef.current = 0;
    
    const currentPosition = positionRef.current;
    lastPositionRef.current = {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    };
    
    dragOffset.current = {
      x: e.clientX - currentPosition.left,
      y: e.clientY - currentPosition.top,
    };
    
    isDraggingRef.current = true;

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
  }, [id, onFocus, onDrag, stopDrag]);

  // Nettoyer l'animation et les event listeners lors du démontage
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Nettoyer les event listeners au cas où
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [onDrag, stopDrag]);

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
      onMouseDown={() => onFocus && onFocus(id)}
    >
      <div
        className={styles.titleBar}
        onMouseDown={startDrag}
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
