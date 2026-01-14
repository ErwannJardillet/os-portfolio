// Window.jsx
import { useState, useRef, useMemo } from "react";
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
  // Fonction pour convertir initialTop/initialLeft en pixels
  const parsePosition = (value, isTop = false) => {
    if (typeof value === 'string' && value.includes('%')) {
      const percent = parseFloat(value);
      const dimension = isTop ? window.innerHeight : window.innerWidth;
      return (dimension * percent) / 100;
    }
    return parseInt(value, 10) || 100;
  };

  // Position locale de la fenêtre
  const [position, setPosition] = useState({
    top: parsePosition(initialTop, true),
    left: parsePosition(initialLeft, false),
  });

  // État pour gérer l'animation de fermeture
  const [isClosing, setIsClosing] = useState(false);

  // Décalage entre la souris et le coin de la fenêtre
  const dragOffset = useRef({ x: 0, y: 0 });

  // Constantes pour le calcul de hauteur maximale
  const TASKBAR_HEIGHT = 52;
  const TITLEBAR_HEIGHT = 36;
  const MARGIN = 8;

  // Calculer la hauteur maximale en fonction de la position
  const maxHeight = useMemo(() => {
    if (height) return null; // Si height est spécifiée, pas de limitation
    
    const availableHeight = window.innerHeight - position.top - TASKBAR_HEIGHT - MARGIN;
    return Math.max(200, availableHeight); // Minimum de 200px pour la hauteur
  }, [position.top, height]);

function onDrag(e) {
  let newTop = e.clientY - dragOffset.current.y;
  let newLeft = e.clientX - dragOffset.current.x;

  const minTop = MARGIN;
  const maxTop =
    window.innerHeight - TASKBAR_HEIGHT - TITLEBAR_HEIGHT - MARGIN;

  // On empêche la titleBar de passer sous la taskbar
  newTop = Math.min(Math.max(newTop, minTop), maxTop);

  // Optionnel : empêcher de sortir trop à gauche / droite
  const minLeft = MARGIN;
  const maxLeft = window.innerWidth - MARGIN - 200; // 200 = largeur minimale approximative
  newLeft = Math.min(Math.max(newLeft, minLeft), maxLeft);

  setPosition({
    top: newTop,
    left: newLeft,
  });
}


  function startDrag(e) {
    // Mettre la fenêtre au premier plan
    onFocus && onFocus(id);

    dragOffset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
  }

  function stopDrag() {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
  }

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

  if (width) style.width = width;
  // Si height est spécifié, l'utiliser, sinon adapter automatiquement au contenu
  if (height) {
    style.height = height;
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
